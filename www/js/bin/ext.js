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
        app.el.trigger(app.SYSTEM.PROCESS.STARTED, process.id);
    };

    //this is popup_id
    this.SYSTEM.PROCESS.stop = function(__process_id){
        //if we pass a whole container instead, kill all its processes
        if(typeof __process_id !== 'string'){            
            __process_id.gather('View').get({isProgram:true}).forEach((__app) => {
                app.SYSTEM.PROCESS.stop(__app.parent.id);
            });
            app.removePopup(__process_id.id, false);
            return;
        }

        const process = processes.get({id:__process_id}, null, 1);
        if(!process){            
            return;
        }
        let id = process.id;
        app.removePopup(process.parent.id, false);
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
            nodes.push(__process);
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