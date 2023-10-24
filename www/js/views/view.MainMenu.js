require('Views.MainMenu', 'View');
OGX.Views.MainMenu = function(__config){
    construct(this, 'Views.MainMenu');
	'use strict'; 
    let program_list;

    //@Override
	this.construct = function(){
        program_list = app.cfind('DynamicList', 'menu_programs');
    };
	
    //@Override
	this.onFocus = function(){};
	
    //@Override
	this.onBlur = function(){};
	
    //@Override
	this.ux = function(__bool){
        if(__bool){
            this.on(this.touch.down, '.icon_settings', (__e, __item) => {
                __e.stopImmediatePropagation();
                this.parent.hide(true);
                const popup = app.addPopup({
                    id: 'settings',
                    title: 'Settings',
                    width: '60%',
                    height: '60%',
                    anim: 'scale',
                    drag: true,
                    resize: true,
                    icons: [
                        {icon:'/img/close.svg', callback:() => {
                            app.removePopup(popup.id, false);
                        }}
                    ]
                }, app.getStage().children('View')[0]);
                popup.show(true);
            });
            program_list.on(OGX.DynamicList.SELECT, (__e, __item) => {
                if(__item.type === 'MenuLetter'){
                    return;
                }
                this.parent.hide(true);
                const node = makeProgramNode(__item);
                const popup = app.addPopup({
                    title: __item.label,
                    width: '60%',
                    height: '60%',
                    anim: 'scale',
                    drag: true,
                    resize: true,
                    icon: '/img/'+__item.icon+'.svg',
                    icons: [
                        {icon:'/img/close.svg', callback:() => {
                            app.removePopup(popup.id, false);
                        }}
                    ],
                    'node:OML':[node]
                }, app.getStage().children('View')[0]);
                popup.show(true);
            });
        }else{
            this.off(this.touch.down, '.icon_settings');
            program_list.off(OGX.DynamicList.SELECT);
        }
    };

    //@Override
    this.destroy = function(){};

    function makeProgramNode(__item){
        let node = {};
        node['default:Views.'+__item.view] = {
            template: __item.view,
            css: __item.view
        };
        return node;
    }
};