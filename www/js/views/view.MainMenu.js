require('Views.MainMenu', 'View');
OGX.Views.MainMenu = function(__config){
    construct(this, 'Views.MainMenu');
	'use strict'; 
    let icon_list, program_list, program_manager;

    //@Override
	this.construct = function(){
        icon_list = app.cfind('DynamicList', 'menu_icons');
        program_list = app.cfind('DynamicList', 'menu_programs');
        program_manager = app.cfind('Controller', 'program_manager');
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
                program_manager.genPopup(__item);
            });
            program_list.on(OGX.DynamicList.SELECT, (__e, __item) => {
                __e.stopImmediatePropagation();
                if(__item.type === 'MenuLetter'){
                    return;
                }
                this.parent.hide(true);                
                program_manager.genPopup(__item);
            });
        }else{
            icon_list.off(OGX.DynamicList.SELECT);
            program_list.off(OGX.DynamicList.SELECT);
        }
    };

    //@Override
    this.destroy = function(){};   
};