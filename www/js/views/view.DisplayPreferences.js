require('Views.DisplayPreferences', 'Program', 'View');
OGX.Views.DisplayPreferences = function(__config){
    construct(this, 'Views.DisplayPreferences');
	'use strict'; 
    let list, roulette;

    //@Override
	this.construct = function(){
        list = OS.cfind('DynamicList', 'swatch_list');
        roulette = OS.cfind('Roulette', 'background_mode');
    };
	
    //@Override
	this.onFocus = function(){};
	
    //@Override
	this.onBlur = function(){};

    //@Override
	this.onResize = function(){};
	
    //@Override
	this.ux = function(__bool){
        if(__bool){
            roulette.on(OGX.Roulette.CHANGE, (__e, __val) => {
                this.el.find('.box').addClass('hidden');
                this.el.find('.'+__val).removeClass('hidden');
            });
            list.on(OGX.DynamicList.SELECT, (__e, __swatch) => {
                OS.getStage().gather('Views.Desktop')[0].color(__swatch.color);
            });
        }else{
            roulette.off(OGX.Roulette.CHANGE);
            list.off(OGX.DynamicList.SELECT);
        }
    };

    //@Override
    this.destroy = function(){};
};