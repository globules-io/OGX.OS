require('Controllers.FileManager', 'Controller');
OGX.Controllers.FileManager = function(){
    construct(this, 'Controllers.FileManager');
    'use strict';

    //@Override
	this.construct = function(){};

    //Constants
    this.CREATED = 'fileCreated';
    this.RENAMED = 'fileRenamed';
    this.UPDATED = 'fileUpdated';
    this.DELETED = 'fileDeleted';
   
    this.createFile = function(__path, __name){
        __path = OS.SYSTEM.UTILS.normalizePath(__path);    
        typeof __name === 'undefined' ? __name = null : null;
        if(!__name){
            __name = getAvailableName(__path, 'file');
        }
        //check that path exists, or create it
        let p = __path.split('/');
        p.pop();
        let label = p.pop();
        p = p.join('/'); 
        if(!OS.SYSTEM.DATA.getFile(p, {type:'folder', label:label})){     
            createRecursive(__path);
        }    

        const file = OS.SYSTEM.DATA.createFile(__path, __name);
        OGX.Core.el.trigger(OS.SYSTEM.FILE.CREATED, file);
        return file;
    };

    this.deleteFile = function(__path, __name){
        const file = OS.SYSTEM.DATA.deleteFile(__path, __name);
        OGX.Core.el.trigger(OS.SYSTEM.FILE.DELETED, file);
    };

    this.renameFile = function(__file, __name){
        OS.SYSTEM.DATA.renameFile(__file, __name);
        OGX.Core.el.trigger(OS.SYSTEM.FILE.RENAMED, __file);
    };

    this.createFolder = function(__path, __name){
        if(!__name){
            __name = getAvailableName(__path, 'folder');
        }
        if(!OS.SYSTEM.DATA.getFile(__path, {type:'folder'})){
            createRecursive(__path);
        }
        const folder = OS.SYSTEM.DATA.createFolder(__path, __name);
        OGX.Core.el.trigger(OS.SYSTEM.FILE.CREATED, folder);
        return folder;
    };

    this.deleteFolder = function(__path){};


    function createRecursive(__path){
        __path = __path.split('/');
        const drive = __path.shift();
        let p = drive+'/';
        let folder;
        for(let i = 0; i < __path.length; i++){      
            if(!OS.SYSTEM.DATA.getFile(p+__path[i], {type:'folder'})){
                folder = OS.SYSTEM.DATA.createFolder(p, __path[i]);
                OGX.Core.el.trigger(OS.SYSTEM.FILE.CREATED, folder);                
            }
            p += __path[i]+'/';
        }
    }	

    function getAvailableName(__path, __type){
        let ext = '';
        let name = false;
        __type === 'file' ? ext = '\.txt' : null;
        //get all files at this loc, and lookup new file as label to add n
        let files = OS.SYSTEM.DATA.getFiles(__path, {type:__type, label:{$regex:'^new '+__type+' ?(\\([\\d]+\\))?'+ext+'$'}});       
        if(files.length){
            files = new OGX.List(files);
            let i = 1;
            while(!name){         
                if(!files.get({label:'new '+__type+' ('+i+')'+ext}, null, 1)){
                    name = 'new '+__type+' ('+i+')'+ext;
                    break;
                }
                i++;
            }
        }else{
            name = 'new '+__type+ext;
        }
        return name;
    }   
};