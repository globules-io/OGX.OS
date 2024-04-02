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

    /* PROCESS MANAGER */
    let processes = new OGX.List();
    let program_manager = this.create('Controllers.ProgramManager', {id : 'program_manager'});    
    this.SYSTEM.PROCESS = {
        KILLED: 'processKilled',
        STARTED: 'processStarted'
    };
    this.SYSTEM.PROCESS.start = function(__desktop, __item, __data){
        const process = program_manager.genPopup(__desktop, __item, __data);
        if(!process){
            return;
        }
        processes.push(process);
        app.el.trigger(app.SYSTEM.PROCESS.STARTED, process.id);
    };
    this.SYSTEM.PROCESS.stop = function(__process_id){
        const process = processes.get({id:__process_id}, null, 1);
        if(!process){
            return;
        }
        let id = process.id;
        app.removePopup(id, false);
        processes.findDelete('id', id, 1);
        app.el.trigger(app.SYSTEM.PROCESS.KILLED, id);
    };    
    this.SYSTEM.PROCESS.get = function(__deep){
        typeof __deep === 'undefined' ? __deep = true : null;
        if(!__deep){
            return processes;
        }
        let nodes = [];
        processes.forEach(__process => {
            nodes = nodes.concat(__process.gather());
        });
        return new OGX.List(nodes);
    };
};

/* PROGRAM */
require('Program');
OGX.Program = function(__config){ 
    construct(this, 'Program');
    'use strict'; 
    this.isProgram = true;

    this.open = function(__file){};
    this.close = function(){};
};