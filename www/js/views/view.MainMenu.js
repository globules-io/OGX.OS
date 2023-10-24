require('Views.MainMenu', 'View');
OGX.Views.MainMenu = function(__config){
    construct(this, 'Views.MainMenu');
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
        }else{
            this.off(this.touch.down, '.icon_settings');
        }
    };

    //@Override
    this.destroy = function(){};
};