const GetFile = () => {
    return new Promise((resolve, reject)=>{
        var fileInputEl = document.createElement("input");
        fileInputEl.type = "file";
        fileInputEl.accept = "image/*";
        fileInputEl.style.display = "none";
        document.body.appendChild(fileInputEl);
        fileInputEl.addEventListener("input", function (fileEvent) {
            resolve(fileEvent.target.files[0])
            document.body.removeChild(fileInputEl);
        });
        fileInputEl.click();
    })
};

const GetFiles = () => {
    return new Promise((resolve, reject)=>{
        var fileInputEl = document.createElement("input");
        fileInputEl.type = "file";
        fileInputEl.accept = "image/*";
        fileInputEl.style.display = "none";
        fileInputEl.multiple = "multiple";
        document.body.appendChild(fileInputEl);
        fileInputEl.addEventListener("input", function (fileEvent) {
            resolve(fileEvent.target.files)
            document.body.removeChild(fileInputEl);
        });
        fileInputEl.click();
    })
};

export{
    GetFile,
    GetFiles
}