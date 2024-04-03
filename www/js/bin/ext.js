/* EXTENDING OGX CLASSES */
/* OS */
require('OS', 'Core');
OGX.OS = function(__config){
    construct(this, 'OS');
    'use strict';   
    let data_manager;  
    let program_manager;    

    this.construct = function(){
        this.SYSTEM.FILE = this.create('Controllers.FileManager', {id : 'file_manager'});
        this.SYSTEM.DATA = this.create('Controllers.DataManager', {id : 'data_manager'});
        program_manager = this.create('Controllers.ProgramManager', {id : 'program_manager'});
    };

    /* NAME SPACE */
    this.SYSTEM = {};  

    /* PROCESS MANAGER */
    let processes = new OGX.List();    

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
        OS.el.trigger(OS.SYSTEM.PROCESS.STARTED, process.id);
    };

    //this is popup_id
    this.SYSTEM.PROCESS.stop = function(__process_id){
        //if we pass a whole container instead, kill all its processes
        if(typeof __process_id !== 'string'){            
            __process_id.gather('View').get({isProgram:true}).forEach((__app) => {
                OS.SYSTEM.PROCESS.stop(__OS.parent.id);
            });
            OS.removePopup(__process_id.id, false);
            return;
        }

        const process = processes.get({id:__process_id}, null, 1);
        if(!process){            
            return;
        }
        let id = process.id;
        OS.removePopup(process.parent.id, false);
        processes.findDelete('id', id, 1);
        OS.el.trigger(OS.SYSTEM.PROCESS.KILLED, id);
    };    
    this.SYSTEM.PROCESS.get = function(__deep){
        typeof __deep === 'undefined' ? __deep = true : null;
        if(!__deep){
            return processes;
        }
        let nodes = [];
        processes.forEach(__process => {
            nodes.push(__process);
            nodes = nodes.concat(__process.gather());
        });
        return new OGX.List(nodes);
    };

    /* DISPLAY */
    this.SYSTEM.DISPLAY = {};
    this.SYSTEM.DISPLAY.settings = function(){
        let o = {};
        o.hardware = {brand:'Nguyen', model:'@AtWork', driver:{version:'Nguyen XperienceMaxx 0.0.1'}}
        o.resolution = [window.innerWidth, window.innerHeight];
        return o;
    };
    this.SYSTEM.DISPLAY.preferences = function(){
        let o = {};   
        o.background = {mode:'swatch', value:'#2d5cb4'};
        return o;
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