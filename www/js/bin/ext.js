/* EXTENDING OGX CLASSES */
/* OS */
require('OS', 'Core');
OGX.OS = function(__config){
    construct(this, 'OS');
    'use strict'; 

    /* NAME SPACE */
    this.SYSTEM = {};

    /* FILE MANAGER */
    this.SYSTEM.FILE = {};
    this.SYSTEM.FILE.create = function(__path, __name){};
    this.SYSTEM.FILE.delete = function(__path){};
    this.SYSTEM.FOLDER = {};
    this.SYSTEM.FOLDER.create = function(__path, __name){};
    this.SYSTEM.FOLDER.delete = function(__path){};

    /* PROGRAM MANAGER */
    this.SYSTEM.PROCESS = {};
    this.SYSTEM.PROCESS.start = function(__name, __desktop){};
    this.SYSTEM.PROCESS.stop = function(__process_id){};

};

/* PROGRAMS */
require('Program');
OGX.Program = function(__config){ 
    construct(this, 'Program');
    'use strict'; 
    this.isProgram = true;
};
