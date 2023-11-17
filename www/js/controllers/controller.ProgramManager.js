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

    this.genPopup = function(__item){
        const node = makeProgramNode(__item);
        
        //test uniqueness       
        if(__item.hasOwnProperty('config') && __item.config.hasOwnProperty('unique') && __item.config.unique){
            const cls = OGX.OML.getNodeClass(node);
            const instance = app.gather(cls);
            if(instance.length){
                instance[0].reveal();
                return;
            }
        }

        !__item.hasOwnProperty('group') ? __item.group = false : null;        
        let w = '60%';
        let h = '60%';
        let r = false;
        if(__item.hasOwnProperty('config')){            
            __item.config.hasOwnProperty('width') ? w = __item.config.width : null;
            __item.config.hasOwnProperty('height') ? h = __item.config.height : null;
            __item.config.hasOwnProperty('keep_ratio') ? r = __item.config.keep_ratio : null;            
        }
        const popup = app.addPopup({
            title: __item.label,
            width: w,
            height: h,
            keep_ratio: r,
            anim: 'scale',
            drag: true,
            resize: true,
            group: __item.group,
            maximize: true,
            maximize_dbc: (__max) => {
                if(__max){
                    maximizePopup(popup);
                }else{
                    normalizePopup(popup);
                }
            },
            icon: '/img/'+__item.icon+'.svg',
            icons: [
                {icon:'/img/minimize.svg', callback:minimizePopup},
                {icon:'/img/maximize.svg', callback:maximizePopup},
                {icon:'/img/close.svg', callback:(__popup) => {
                    app.removePopup(__popup.id, false);
                }}
            ],
            'node:OML':[node]
        }, app.getStage().gather('Views.Desktop')[0]);
        docker.addItem(popup, {icon: popup.icon()});
        popup.show(true);
    }    

    function minimizePopup(__popup){
        __popup.hide(false);        
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

    function makeProgramNode(__item){
        if(__item.hasOwnProperty('oml')){
            return app.getOML(__item.oml);
        }
        let node = {};
        node['default:Views.'+__item.view] = {
            template: __item.view
        };
        return node;
    }    
};