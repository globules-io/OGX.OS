require('Controllers.ProgramManager', 'Controller');
OGX.Controllers.ProgramManager = function(){
    construct(this, 'Controllers.ProgramManager');
    'use strict';

    //@Override
	this.construct = function(){};
	
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
        !__item.hasOwnProperty('group') ? __item.group = false : null;        
        const popup = app.addPopup({
            title: __item.label,
            width: '60%',
            height: '60%',
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
                {icon:'/img/maximize.svg', callback:maximizePopup},
                {icon:'/img/close.svg', callback:(__popup) => {
                    app.removePopup(__popup.id, false);
                }}
            ],
            'node:OML':[node]
        }, app.getStage().gather('Views.Desktop')[0]);
        popup.show(true);
    }    

    function maximizePopup(__popup){    
        __popup.maximize();        
        let icons = __popup.icons();
        icons[0].icon = '/img/normalize.svg';
        icons[0].callback = normalizePopup;
        __popup.icons(icons);
    };    

    function normalizePopup(__popup){       
        __popup.normalize();        
        let icons = __popup.icons();
        icons[0].icon = '/img/maximize.svg';
        icons[0].callback = maximizePopup;
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