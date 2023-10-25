require('Views.Drives', 'View');
OGX.Views.Drives = function(__config){
    construct(this, 'Views.Drives');
	'use strict'; 
    let list;

    //@Override
	this.construct = function(){
        list = this.children('DynamicList')[0];
        list.val(app.cfind('Controller', 'data_manager').getDrives());
    };
	
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
};