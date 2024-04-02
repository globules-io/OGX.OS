require('Controllers.ProgramManager', 'Controller');
OGX.Controllers.ProgramManager = function(){
    construct(this, 'Controllers.ProgramManager');
    'use strict';
    let registered_programs;

    //@Override
	this.construct = function(){
        registered_programs = app.getJSON('programs');

        app.on(OGX.Popup.GROUP, (__e, __o) => {
            let icons = __o.popup.icons();
            icons[icons.length-1].callback = app.SYSTEM.PROCESS.stop;
            icons[icons.length-1].params = __o.popup;
            __o.popup.icons(icons);
        });
        app.on(OGX.Popup.UNGROUP, (__e, __o) => {
            const new_popup = app.cfind('Popup', __o.to_popup);
            let icons = new_popup.icons();
            icons[icons.length-1].callback = app.SYSTEM.PROCESS.stop;
            icons[icons.length-1].params = new_popup.children()[0].id;
            new_popup.icons(icons);
        });
    };

    this.genPopup = function(__desktop, __item, __data){
        typeof __data === 'undefined' ? __data = {} : null;
        const node = makeProgramNode(__item, __data);  
        if(!node){
            return;
        }      
        
        //test uniqueness       
        if(__item.hasOwnProperty('config') && __item.config.hasOwnProperty('unique') && __item.config.unique){
            const cls = OGX.OML.getNodeClass(node);
            //process
            const instance = app.gather(cls);
            if(instance.length){
                instance[0].reveal();
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
                {icon:'/img/close.svg', callback: app.SYSTEM.PROCESS.stop}
            ],
            'node:OML':[node]
        };
        
        if(registered_programs[__item.app].hasOwnProperty('config')){            
            OGX.Data.merge(options, registered_programs[__item.app].config, true);
        }
        options.icon = '/img/'+__item.icon+'.svg';
        options.title = __item.label;
        const popup = app.addPopup(options, __desktop);
        const process = popup.children('View')[0];
        let icons = popup.icons();
        icons[icons.length-1].params = process.id;
        popup.icons(icons)
        app.cfind('Docker', 'docker').addItem(popup, {icon: popup.icon()});
        popup.show(true);
        return process;
    }    

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

    function makeProgramNode(__item, __data){
        if(!registered_programs.hasOwnProperty(__item.app)){
            return;
        }
        let conf = registered_programs[__item.app];             
        if(conf.hasOwnProperty('oml')){
            let oml = app.getOML(conf.oml);           
            if(__data){
                for(let n in oml){
                    n.data = __data;
                    break;
                }
            }   
            return oml;           
        }
        let node = {};
        node['default:Views.'+__item.app] = {
            template: __item.app,
            data: __data
        };
        return node;
    }    
};