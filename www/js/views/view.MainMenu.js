require('Views.MainMenu', 'View');
OGX.Views.MainMenu = function(__config){
    construct(this, 'Views.MainMenu');
	'use strict'; 
    let desktop, icon_list, program_list, program_manager, window;

    //@Override
	this.construct = function(){
        desktop = OS.getStage().gather('Views.Desktop')[0]; 
        icon_list = OS.cfind('DynamicList', 'menu_icons');
        program_list = OS.cfind('DynamicList', 'menu_programs');
        program_manager = OS.cfind('Controller', 'program_manager');
        window = OS.findWindow(this);
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
                OS.SYSTEM.PROCESS.start(desktop, __item);
            });
            program_list.on(OGX.DynamicList.SELECT, (__e, __item) => {
                __e.stopImmediatePropagation();
                if(__item.type === 'MenuLetter'){
                    return;
                }
                this.parent.hide(true);   
                OS.SYSTEM.PROCESS.start(desktop, __item);
            });
            this.on(this.touch.down, '.search', function(__e){
                window.disable();            
                setTimeout(() => {window.enable()}, 1000);
            });
        }else{
            icon_list.off(OGX.DynamicList.SELECT);
            program_list.off(OGX.DynamicList.SELECT);
            this.off(this.touch.down, '.search');
        }
    };

    //@Override
    this.destroy = function(){};   
};