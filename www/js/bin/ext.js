/* EXTENDING OGX CLASSES */
/* OS */
require('OS', 'Core');
OGX.OS = function(__config){
    construct(this, 'OS');
    'use strict';   
    let program_manager;    

    this.construct = function(){
        this.SYSTEM.FILE = this.create('Controllers.FileManager', {id : 'file_manager'});
        this.SYSTEM.DATA = this.create('Controllers.DataManager', {id : 'data_manager'});
        this.SYSTEM.DRIVES = this.SYSTEM.DATA.getDrives();
        program_manager = this.create('Controllers.ProgramManager', {id : 'program_manager'});
    };

    /* NAME SPACE */
    this.SYSTEM = {PATH:'C:/system/', UTILS:{}};  

    /* UTILS */
    this.SYSTEM.UTILS.normalizePath = function(__path){
        !__path.match(/\/$/) ? __path += '/' : null;
        __path = __path.slice(0,1).toUpperCase()+__path.slice(1);
        return __path;
    };

    this.SYSTEM.UTILS.pathToPathFile = function(__path){
         console.log('pathToPathFile', __path);
        __path = OS.SYSTEM.UTILS.normalizePath(__path);
        __path = __path.split('/');
        __path.pop();
        let name = __path.pop();
        return {path:OS.SYSTEM.UTILS.normalizePath(__path.join('/')), name:name};
    };

    /* PROCESS MANAGER */
    const processes = new OGX.List();    

    this.SYSTEM.PROCESS = {
        KILLED: 'processKilled',
        STARTED: 'processStarted'
    };

    //__target is either false to create popup and start process in popup
    //or a selector
    this.SYSTEM.PROCESS.start = function(__parent, __item, __data, __target){
        typeof __target === 'undefined' ? __target = false : null;
        let process;
        if(!__target){
            process = program_manager.startProcessInPopup(__parent, __item, __data);
        }else{
            process = program_manager.startProcessInTarget(__parent, __target, __item, __data);
        }
        if(!process){
            return;
        }
        processes.push(process);
        OS.el.trigger(OS.SYSTEM.PROCESS.STARTED, process.id);
        return process;
    };

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
        //if immediate parent is a popup
        if(process.parent._NAME_ === 'Popup'){
            OS.removePopup(process.parent.id, false);
        }else{
            process.kill();
        }
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

    /* DRIVES */
    this.SYSTEM.DRIVE = 'C';
    this.SYSTEM.DRIVES = null;

    /* DESKTOPS */
    this.SYSTEM.DESKTOP = {};
    this.SYSTEM.DESKTOP.get = function(__active){
        typeof __active === 'undefined' ? __active = true : null;
        if(__active){
            return OS.gather('Views.Desktop').get({blured:false}, null, 1);
        }
        return OS.gather('Views.Desktop');
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