require('Views.Clock', 'View');
OGX.Views.Clock = function(__config){
    construct(this, 'Views.Clock');
	'use strict'; 
    let clock_intv;

    //@Override
	this.construct = function(){
        this.updateClock();
    };
	
    //@Override
	this.onFocus = function(){
        clock_intv = setInterval(() => {this.updateClock()}, 1000);
    };
	
    //@Override
	this.onBlur = function(){
        clearInterval(clock_intv);
    };
	
    //@Override
	this.ux = function(__bool){
        if(__bool){
            
        }else{
           
        }
    };

    //@Override
    this.destroy = function(){};

    this.updateClock = function(){
        this.el.find('.datetime > .time').html(moment().format('HH:mm:ss'));
        this.el.find('.datetime > .date').html(moment().format('dddd, MMMM D, YYYY'));
    };
};