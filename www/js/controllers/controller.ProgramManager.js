require('Controllers.ProgramManager', 'Controller');
OGX.Controllers.ProgramManager = function(){
    construct(this, 'Controllers.ProgramManager');
    'use strict';
    let docker;

    //@Override
	this.construct = function(){
        docker = app.cfind('Docker', 'docker');
    };
	
    //@Override
	this.onFocus = function(){};
	
    //@Override
	this.onBlur = function(){};
	
    //@Override
	this.ux = function(__bool){
        if(__bool){
            
        }else{
           
        }
    };

    //@Override
    this.destroy = function(){};

    this.genPopup = function(__item, __data){
        typeof __data === 'undefined' ? __data = {} : null;
        const node = makeProgramNode(__item, __data);        
        
        //test uniqueness       
        if(__item.hasOwnProperty('config') && __item.config.hasOwnProperty('unique') && __item.config.unique){
            const cls = OGX.OML.getNodeClass(node);
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
                {icon:'/img/close.svg', callback:(__popup) => {
                    app.removePopup(__popup.id, false);
                }}
            ],
            'node:OML':[node]
        };
        
        if(__item.hasOwnProperty('config')){            
            OGX.Data.merge(options, __item.config, true);
        }
        options.icon = '/img/'+__item.icon+'.svg';

        const popup = app.addPopup(options, app.getStage().gather('Views.Desktop')[0]);
        docker.addItem(popup, {icon: popup.icon()});
        popup.show(true);
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
        if(__item.hasOwnProperty('oml')){
            let oml = app.getOML(__item.oml);           
            if(__data){
                for(let n in oml){
                    n.data = __data;
                    break;
                }
            }   
            return oml;           
        }
        let node = {};
        node['default:Views.'+__item.view] = {
            template: __item.view,
            data: __data
        };
        return node;
    }    
};