//https://github.com/pyth-network/pyth-client-js/blob/3de72323598131d6d14a9dc9f48f5f225b5fbfd2/src/index.ts#L161
import {PublicKey} from "@solana/web3.js";
import { readBigInt64LE, readBigUInt64LE } from './readBig';
let pyth_mapping = require("./pythMapping.json");

export const parseProductData = (data) => {
    // pyth magic number
    const magic = data.readUInt32LE(0)
    // program version
    const version = data.readUInt32LE(4)
    // account type
    const type = data.readUInt32LE(8)
    // price account size
    const size = data.readUInt32LE(12)
    // first price account in list
    const priceAccountBytes = data.slice(16, 48)
    const priceAccountKey = new PublicKey(priceAccountBytes)
    const product = {};
    let idx = 48
    while (idx < size) {
      const keyLength = data[idx]
      idx++
      if (keyLength) {
        const key = data.slice(idx, idx + keyLength).toString()
        idx += keyLength
        const valueLength = data[idx]
        idx++
        const value = data.slice(idx, idx + valueLength).toString()
        idx += valueLength
        product[key] = value
      }
    }
    return { magic, version, type, size, priceAccountKey, product }
}

const parsePriceInfo = (data, exponent)=> {
    // aggregate price
    const priceComponent = readBigInt64LE(data, 0)
    const price = Number(priceComponent) * 10 ** exponent
    // aggregate confidence
    const confidenceComponent = readBigUInt64LE(data, 8)
    const confidence = Number(confidenceComponent) * 10 ** exponent
    // aggregate status
    const status = data.readUInt32LE(16)
    // aggregate corporate action
    const corporateAction = data.readUInt32LE(20)
    // aggregate publish slot
    const publishSlot = readBigUInt64LE(data, 24)
    return {
      priceComponent,
      price,
      confidenceComponent,
      confidence,
      status,
      corporateAction,
      publishSlot,
    }
}

const parseEma = (data, exponent)=> {
    // current value of ema
    const valueComponent = readBigInt64LE(data, 0)
    const value = Number(valueComponent) * 10 ** exponent
    // numerator state for next update
    const numerator = readBigInt64LE(data, 8)
    // denominator state for next update
    const denominator = readBigInt64LE(data, 16)
    return { valueComponent, value, numerator, denominator }
}

const empty32Buffer = Buffer.alloc(32)
const PKorNull = (data) => (data.equals(empty32Buffer) ? null : new PublicKey(data))

export const parsePriceData = (data) => {
    // pyth magic number
    const magic = data.readUInt32LE(0)
    // program version
    const version = data.readUInt32LE(4)
    // account type
    const type = data.readUInt32LE(8)
    // price account size
    const size = data.readUInt32LE(12)
    // price or calculation type
    const priceType = data.readUInt32LE(16)
    // price exponent
    const exponent = data.readInt32LE(20)
    // number of component prices
    const numComponentPrices = data.readUInt32LE(24)
    // number of quoters that make up aggregate
    const numQuoters = data.readUInt32LE(28)
    // slot of last valid (not unknown) aggregate price
    const lastSlot = readBigUInt64LE(data, 32)
    // valid on-chain slot of aggregate price
    const validSlot = readBigUInt64LE(data, 40)
    // time-weighted average price
    const twap = parseEma(data.slice(48, 72), exponent)
    // time-weighted average confidence interval
    const twac = parseEma(data.slice(72, 96), exponent)
    // space for future derived values
    const drv1Component = readBigInt64LE(data, 96)
    const drv1 = Number(drv1Component) * 10 ** exponent
    // minimum number of publishers for status to be TRADING
    const minPublishers = data.readUInt8(104)
    // space for future derived values
    const drv2 = data.readInt8(105)
    // space for future derived values
    const drv3 = data.readInt16LE(106)
    // space for future derived values
    const drv4 = data.readInt32LE(108)
    // product id / reference account
    const productAccountKey = new PublicKey(data.slice(112, 144))
    // next price account in list
    const nextPriceAccountKey = PKorNull(data.slice(144, 176))
    // valid slot of previous update
    const previousSlot = readBigUInt64LE(data, 176)
    // aggregate price of previous update
    const previousPriceComponent = readBigInt64LE(data, 184)
    const previousPrice = Number(previousPriceComponent) * 10 ** exponent
    // confidence interval of previous update
    const previousConfidenceComponent = readBigUInt64LE(data, 192)
    const previousConfidence = Number(previousConfidenceComponent) * 10 ** exponent
    // space for future derived values
    const drv5Component = readBigInt64LE(data, 200)
    const drv5 = Number(drv5Component) * 10 ** exponent
    const aggregate = parsePriceInfo(data.slice(208, 240), exponent)
  
    let price
    let confidence
    if (aggregate.status === 1) {
      price = aggregate.price
      confidence = aggregate.confidence
    }
  
    // price components - up to 32
    const priceComponents = []
    let offset = 240
    let shouldContinue = true
    while (offset < data.length && shouldContinue) {
      const publisher = PKorNull(data.slice(offset, offset + 32))
      offset += 32
      if (publisher) {
        const componentAggregate = parsePriceInfo(data.slice(offset, offset + 32), exponent)
        offset += 32
        const latest = parsePriceInfo(data.slice(offset, offset + 32), exponent)
        offset += 32
        priceComponents.push({ publisher, aggregate: componentAggregate, latest })
      } else {
        shouldContinue = false
      }
    }
  
    return {
      magic,
      version,
      type,
      size,
      priceType,
      exponent,
      numComponentPrices,
      numQuoters,
      lastSlot,
      validSlot,
      twap,
      twac,
      drv1Component,
      drv1,
      minPublishers,
      drv2,
      drv3,
      drv4,
      productAccountKey,
      nextPriceAccountKey,
      previousSlot,
      previousPriceComponent,
      previousPrice,
      previousConfidenceComponent,
      previousConfidence,
      drv5Component,
      drv5,
      aggregate,
      priceComponents,
      price,
      confidence,
    }
}


export const PythMap = () => {
  let pyth_map = pyth_mapping;
  [...Object.entries(pyth_mapping)].forEach(([network, name_price]) =>{
    // for each name, price address in address map object
    [...Object.entries(name_price)].forEach(([asset_name, price_addr]) =>{
      pyth_map[network][asset_name] = new PublicKey(price_addr);
    });
  });
  return pyth_map
}