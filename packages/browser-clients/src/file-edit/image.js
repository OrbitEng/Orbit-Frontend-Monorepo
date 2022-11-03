function DataurlToImage(dataurl){
    return new Promise((resolve, reject)=>{
        let img = new Image();
        img.onload = function(){
            resolve(img);
        };
        img.src = dataurl;
    });
}

/**
 * 
 * @param {Image | ImageBitmap} image_in 
 * @param {number} x_slices 
 * @param {number} y_slices 
 * @returns {blob[]}
 */
function SliceImage(image_in, x_slices, y_slices){
    let slice_height = (image_in.height/y_slices);
    let slice_width = (image_in.width/x_slices);

    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.height = slice_height;
    canvas.width = slice_width;

    let retarr = [];

    for(let r = 0; r < image_in.width; r+=slice_width){
        for(let c = 0; c < image_in.height; c+=slice_height){
            ctx.drawImage(
                image_in,
                r, c,
                slice_width, slice_height,
                0,0,
                slice_width, slice_height
            );

            retarr.push(canvas.toDataURL("image/png"))
        }
    }

    return retarr
}

/**
 * 
 * @param {ImageBitmap} blobs 
 * @param {number} original_width 
 * @param {number} original_height 
 * @param {number} x_slices 
 * @param {number} y_slices 
 * @returns {DataUrl}
 */
function StitchImage(images, original_width, original_height, x_slices, y_slices){
    let slice_width = (image_in.width/x_slices);
    let slice_height = (image_in.height/y_slices);
    

    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = original_width;
    canvas.height = original_height;
    

    for(let r = 0; r < image_in.width; r+=slice_width){
        for(let c = 0; c < image_in.height; c+=slice_height){
            ctx.drawImage(
                images.shift(),
                0, 0,
                slice_width, slice_height,
                r*slice_width, c*slice_height,
                slice_width, slice_height
            );
        }
    }

    return canvas.toDataURL()
}

export{
    DataurlToImage,
    StitchImage,
    SliceImage
}