import {SliceImage, StitchImage, DataurlToImage} from "./image";

/**
 * 
 * @param {Blob} file_blob 
 * @returns {Promise<[]DataUrl>}
 */
async function ChopImage(file_blob, x_slices, y_slices){
    let img = await createImageBitmap(file_blob);

    return [
        img.width,
        img.height,
        SliceImage(img, x_slices, y_slices)
    ];
}

async function ChopAudio(){
    await AddFile()
}

async function ChopVideo(){
    await AddFile()
}

/**
 * 
 * @param {number} original_width 
 * @param {number} original_height 
 * @param {number} x_slices 
 * @param {number} y_slices 
 * @param {ArrayBuffer[]} arr_buffs 
 * @returns {DataUrl}
 */
async function AssembleImage(original_width, original_height, x_slices, y_slices, dataurls){
    let image_chunks = await Promise.all(
        dataurls.map((durl) => {
                DataurlToImage(durl)
            }
        )
    );

    return StitchImage(image_chunks, original_width, original_height, x_slices, y_slices);
}


async function AssembleAudio(){
}

async function AssembleVideo(){
}


export{
    ChopImage,
    ChopAudio,
    ChopVideo,

    AssembleImage,
    AssembleAudio,
    AssembleVideo,
}