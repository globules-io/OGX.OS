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
           //get all files at this loc, and lookup new file as label to add x
            let files = OS.SYSTEM.DATA.getFiles(__path, {type:{eq:'file'}, label:{regex:/new file [\d]+\.txt/}});     
            if(files.length){
                files = new OGX.List(files);
                const i = 1;
                while(!__name){
                    if(!files.get({label:'new file ('+i+').txt'}, null, 1)){
                        __name = 'new file ('+i+').txt';
                    }
                    i++;
                }
            }
        }
        //check that path exists, or create it
        if(!OS.SYSTEM.DATA.getFile(__path, {type:'folder'})){
            let p = __path.split('/');
            let name = p.pop();
            OS.SYSTEM.FILE.createFolder(p.join('/'), name);            
        }    
        console.log('FileManager CREATE FILE', __path);
    };


    this.deleteFile = function(__path, __name){
        OS.SYSTEM.DATA.deleteFile(__path, __name);
    };

    this.createFolder = function(__path, __name){

        console.log('FileManager CREATE FOLDER', __path, __name);    


        let p = __path.split('/');
        p.pop();
        let s = '';
        p.forEach((__f) => {
            OS.SYSTEM.FILE.createFolder(p.join('/'));       
        });

        


    };
    this.deleteFolder = function(__path){};
   
	   
};