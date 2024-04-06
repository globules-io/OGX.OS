require('Controllers.ProgramManager', 'Controller');
OGX.Controllers.ProgramManager = function(){
    construct(this, 'Controllers.ProgramManager');
    'use strict';
    let registered_programs;

    //@Override
	this.construct = function(){
        registered_programs = OS.getJSON('programs');

        OS.on(OGX.Popup.GROUP, (__e, __o) => {
            let icons = __o.popup.icons();
            icons[icons.length-1].callback = OS.SYSTEM.PROCESS.stop;
            icons[icons.length-1].params = __o.popup;
            __o.popup.icons(icons);
        });
        OS.on(OGX.Popup.UNGROUP, (__e, __o) => {
            const new_popup = OS.cfind('Popup', __o.to_popup);
            let icons = new_popup.icons();
            icons[icons.length-1].callback = OS.SYSTEM.PROCESS.stop;
            icons[icons.length-1].params = new_popup.children()[0].id;
            new_popup.icons(icons);
        });
    };

    this.getCompatibleProcesses = function(__ext){
        const list = [];
        for(let name in registered_programs){
            if(registered_programs[name].hasOwnProperty('ext') && registered_programs[name].ext.includes(__ext)){
                list.push({name: name, config: registered_programs[name]});
            }
        };        
        return list;
    };

    this.startProcessInTarget = function(__parent, __el, __item, __data){
        typeof __data === 'undefined' ? __data = {} : null;
        const node = makeProgramNode(__item, __data, __el);  
        if(!node){
            return;
        }
        const reg = registered_programs[__item.app];
        
        //test uniqueness       
        if(reg.hasOwnProperty('config') && reg.config.hasOwnProperty('unique') && reg.config.unique){
            let instance = exists(node);
            if(instance){
                instance.reveal();
                return;
            }            
        }
        OGX.OML.render(__parent, node, __data);  
        return __parent.nodes.last();     
    };

    this.startProcessInPopup = function(__parent, __item, __data){
        typeof __data === 'undefined' ? __data = {} : null;
        const node = makeProgramNode(__item, __data);  
        if(!node){
            return;
        }
        const reg = registered_programs[__item.app];
        
        //test uniqueness       
        if(reg.hasOwnProperty('config') && reg.config.hasOwnProperty('unique') && reg.config.unique){
            let instance = exists(node);
            if(instance){
                instance.reveal();
                return;
            }            
        }

        let options = {
            width:'60%', 
            height:'60%', 
            keep_ratio:false, 
            group:false,
            drag: true,
            resize: true,           
            maximize: true,
            maximize_dbc: true,
            icon: null,
            icons: [
                {icon:'/img/minimize.svg', callback:minimizePopup},
                {icon:'/img/maximize.svg', callback:maximizePopup},
                //would be better to set process id from App and not popup because grouping
                //I don't know yet the id of the process cause it's in popup after creating
                {icon:'/img/close.svg', callback: OS.SYSTEM.PROCESS.stop}
            ],
            'node:OML':[node]
        };
        
        if(reg.hasOwnProperty('config')){            
            OGX.Data.merge(options, reg.config, true);
        }
        options.icon = __item.icon;
        options.title = __item.label;
        const popup = OS.addPopup(options, __parent);
        const process = popup.children('View')[0];
        let icons = popup.icons();
        icons[icons.length-1].params = process.id;
        popup.icons(icons)
        OS.cfind('Docker', 'docker').addItem(popup, {icon: popup.icon()});
        popup.show(true);
        return process;
    }; 

    this.onFileInProgress = function(__process_id, __file){
        
    };

    function minimizePopup(__popup){
        __popup.hide('fade slide');        
    }

    function maximizePopup(__popup){    
        __popup.maximize();        
        let icons = __popup.icons();
        icons[1].icon = '/img/normalize.svg';
        icons[1].callback = normalizePopup;
        __popup.icons(icons);
    };    

    function normalizePopup(__popup){       
        __popup.normalize();        
        let icons = __popup.icons();
        icons[1].icon = '/img/maximize.svg';
        icons[1].callback = maximizePopup;
        __popup.icons(icons);
    };

    function makeProgramNode(__item, __data, __el){
        typeof __el === 'undefined' ? __el = null : null;
        if(!registered_programs.hasOwnProperty(__item.app)){
            return;
        }
        let conf = registered_programs[__item.app];             
        if(conf.hasOwnProperty('oml')){
            let oml = OS.getOML(conf.oml);           
            if(__data){
                for(let n in oml){
                    n.data = __data;
                    break;
                }
            } 
            if(__el){
                oml = OGX.OML.rename(oml, 'default '+__el);                
            }  
            injectMenu(conf, oml);       
            return oml;           
        }
        let node = {};
        node['default:Views.'+__item.app] = {
            template: __item.app,
            data: __data
        };
        if(__el){
           node = OGX.OML.rename(node, 'default '+__el);
        }  
        injectMenu(conf, node);     
        return node;
    }  

    function injectMenu(__conf, __oml){
        if(__conf.hasOwnProperty('menu')){
            for(let node in __oml){
                if(!__oml[node].hasOwnProperty('node:OML')){
                    __oml[node]['node:OML'] = {};
                }
                __oml[node]['node:OML'] = {'default .program_menu:ProgramMenu':{                    
                    css:'os_program_bar',
                    'node:OML': {
                        'default:DynamicList':{
                            key : 'label',
                            as : 'item',
                            scroll : false,
                            display:{
                                css : 'program_bar_root',
                                oml : 'program_bar_tree'
                            },                            
                            list: __conf.menu
                        }
                    }
                }};
                break;
            }
        }
    }  

    function exists(__node){        
        const cls = OGX.OML.getNodeClass(__node);
        //process
        const instance = OS.gather(cls);
        if(instance.length){
            return instance[0];
        }      
        return false;
    }
};