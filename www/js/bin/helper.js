const Helper = {};
//Template formats are File / Folder but type is file folder, transform
Helper.getFileTemplate = function(__item){
    return __item.slice(0,1).toUpperCase()+ __item.slice(1);
};