import React, { useRef, useState } from "react";
import { Range, getTrackBackground, useThumbOverlap } from "react-range";
import usdcMark from "../../../public/Icons/usdcMarkColor.svg";
import Image from "next/image"

const MIN = 0;
const MAX = 999999;
const STEP = 1;
const COLORS = ['#333333', '#276EF1', '#333333'];
const THUMB_SIZE = 18;

const ThumbLabel = ({
	rangeRef,
	values,
	index
}) => {
	const [labelValue, style] = useThumbOverlap(rangeRef, values, index);
	return (
	  <div
		data-label={index}
		style={{
		  display: 'block',
		  position: 'absolute',
		  top: '-28px',
		  color: '#B5B5B5',
		  fontWeight: 'normal',
		  fontSize: '11px',
		  fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
		  padding: '4px',
		  borderRadius: '4px',
		  backgroundColor: 'transparent',
		  whiteSpace: 'nowrap',
		  ...style
		}}
	>
		<div className="flex flex-row my-auto gap-x-[2px]">
			<div className="flex my-auto">
				<Image 
					src={usdcMark}
					height={14}
					width={14}
					layout="fixed"
				/>
			</div>
			<span className="my-auto align-middle">{Math.trunc(labelValue)}</span>
		</div>
	  </div>
	);
  };

export default function DoubleRangeInput(props, { rtl }) {
	const [ values, setValues ] = props.values;
	//const [ values, setValues ] = useState([0, 999999]);
	const rangeRef = useRef();

	return(
		<div className="flex flex-col flex-grow">
			<Range
				min={MIN}
				max={MAX}
				step={STEP}
				rtl={rtl}
				ref={rangeRef}
				allowOverlap
				values={values}
				onChange={(values) => {setValues( values )}}
				renderTrack={({ props, children }) => (
					<div
						onMouseDown={props.onMouseDown}
						onTouchStart={props.onTouchStart}
						style={{
							...props.style,
							height: '36px',
							display: 'flex',
							width: '100%',
							marginTop: "auto",
							marginBottom: "auto",
						}}
					>
						<div
							ref={props.ref}
							style={{
								height: '5px',
								width: '100%',
								borderRadius: '4px',
								background: getTrackBackground({
									values,
									colors: COLORS,
									min: MIN,
									max: MAX,
									rtl
								}),
								alignSelf: 'center'
							}}
						>
							{children}
						</div>
					</div>
				)}
				renderThumb={({ props, index, isDragged }) => {
					return (
						<div
							{...props}
							style={{
								...props.style,
								height: `${THUMB_SIZE}px`,
								width: `${THUMB_SIZE}px`,
								border: '3px solid #97B6EF',
								borderRadius: '999px',
								backgroundColor: '#2057C0',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
							>
								<ThumbLabel
									rangeRef={rangeRef.current}
									values={values}
									index={index}
								/>
						</div>
					);
				}}
			/>
			<div className="flex flex-grow flex-row justify-between -mx-2 text-[10px] text-[#B5B5B5] -mt-1">
				<span>HIGH</span>
				<span>LOW</span>
			</div>
		</div>
	)
}