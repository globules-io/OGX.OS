require('Views.Desktop', 'View');
OGX.Views.Desktop = function(__config){
    construct(this, 'Views.Desktop');
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

    this.color = function(__val){
        if(typeof __val === 'undefined'){
            return this.data.background.color;
        }
        this.data.background.color = __val;
        this.el.css('background-color', __val);
    };
};