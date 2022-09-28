require('Views.FolderView', 'View');
OGX.Views.FolderView = function(__config){
    construct(this, 'Views.FolderView');
	'use strict'; 
    let list;

    //@Override
    this.construct = function(__data, __route_data){
        list = this.chidlren('DynamicList')[0];
    };
    
    //@Override
	this.enable = function(){};
	
    //@Override
	this.disable = function(){};    
	
    //@Override
	this.ux = function(__bool){
        if(__bool){

        }else{

        }
    }; 
    
    //@Override
    this.destroy = function(){};
};