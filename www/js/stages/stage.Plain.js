require('Stages.Plain', 'Stage');
OGX.Stages.Plain = function(__obj){
    construct(this, 'Stages.Plain');
	'use strict';

    //@Override
	this.construct = function(){};
	
    //@Override
	this.onFocus = function(){};
	
    //@Override
	this.onBlur = function(){};

    //@Override
	this.onResize = function(){};
	
    //@Override
	this.ux = function(__bool){
        if(__bool){
            
        }else{
           
        }
    };

    //@Override
    this.destroy = function(){};
};