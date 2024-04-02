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
   
    this.createFile = function(__path, __name){};
    this.deleteFile = function(__path){};
    this.createFolder = function(__path, __name){};
    this.deleteFolder = function(__path){};
	   
};