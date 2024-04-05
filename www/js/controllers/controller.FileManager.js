require('Controllers.FileManager', 'Controller');
OGX.Controllers.FileManager = function(){
    construct(this, 'Controllers.FileManager');
    'use strict';

    //@Override
	this.construct = function(){};

    //Constants
    this.CREATED = 'fileCreated';
    this.UPDATED = 'fileUpdated';
    this.DELETED = 'fileDeleted';
   
    this.createFile = function(__path, __name){
        typeof __name === 'undefined' ? __name = null : null;
        if(!__name){
            //get all files at this loc, and lookup new file as label to add n
            let files = OS.SYSTEM.DATA.getFiles(__path, {type:{$eq:'file'}, label:{$regex:'/^new file ?[\d]+?\.txt$/'}});                 
            if(files.length){
                files = new OGX.List(files);
                let i = 1;
                while(!__name){
                    if(!files.get({label:'new file ('+i+').txt'}, null, 1)){
                        __name = 'new file ('+i+').txt';
                    }
                    i++;
                }
            }else{
                __name = 'new file.txt';
            }
        }
        //check that path exists, or create it
        if(!OS.SYSTEM.DATA.getFile(__path, {type:'folder'})){
            createRecursive(__path);
        }       
        const file = OS.SYSTEM.DATA.createFile(__path, __name);
    };

    this.deleteFile = function(__path, __name){
        OS.SYSTEM.DATA.deleteFile(__path, __name);
    };

    this.createFolder = function(__path, __name){
        if(!OS.SYSTEM.DATA.getFile(__path, {type:'folder'})){
            createRecursive(__path);
        }
        const folder = OS.SYSTEM.DATA.createFolder(__path, __name);
    };

    this.deleteFolder = function(__path){};

    function createRecursive(__path){
        __path = __path.split('/');
        const drive = path.shift();
        let p = drive+'/';
        for(let i = 0; i < path.length; i++){
            if(!OS.SYSTEM.DATA.getFile(p+path[i], {type:'folder'})){
                console.log('create', p, path[i]);
                OS.SYSTEM.DATA.createFolder(p, path[i]);
                p += path[i]+'/';
            }
        }
    }	   
};