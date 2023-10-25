require('Views.MainMenu', 'View');
OGX.Views.MainMenu = function(__config){
    construct(this, 'Views.MainMenu');
	'use strict'; 
    let icon_list, program_list;

    //@Override
	this.construct = function(){
        icon_list = app.cfind('DynamicList', 'menu_icons');
        program_list = app.cfind('DynamicList', 'menu_programs');
    };
	
    //@Override
	this.onFocus = function(){};
	
    //@Override
	this.onBlur = function(){};
	
    //@Override
	this.ux = function(__bool){
        if(__bool){
            icon_list.on(OGX.DynamicList.SELECT, (__e, __item) => {
                __e.stopImmediatePropagation();
                this.parent.hide(true);
                genPopup(__item);
            });
            program_list.on(OGX.DynamicList.SELECT, (__e, __item) => {
                if(__item.type === 'MenuLetter'){
                    return;
                }
                this.parent.hide(true);                
                genPopup(__item);
            });
        }else{
            icon_list.off(OGX.DynamicList.SELECT);
            program_list.off(OGX.DynamicList.SELECT);
        }
    };

    //@Override
    this.destroy = function(){};

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
        let node = {};
        node['default:Views.'+__item.view] = {
            template: __item.view,
            css: __item.view
        };
        return node;
    }

    function genPopup(__item){
        const node = makeProgramNode(__item);
        const popup = app.addPopup({
            title: __item.label,
            width: '60%',
            height: '60%',
            anim: 'scale',
            drag: true,
            resize: true,
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
                {icon:'/img/close.svg', callback:() => {
                    app.removePopup(popup.id, false);
                }}
            ],
            'node:OML':[node]
        }, app.getStage().children('View')[0]);
        popup.show(true);
    }    
};