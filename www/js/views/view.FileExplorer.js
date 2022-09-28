require('Views.FileExplorer', 'View');
OGX.Views.FileExplorer = function(__config){
    construct(this, 'Views.FileExplorer');
	'use strict'; 
    let tree, list;

    //@Override
    this.construct = function(__data, __route_data){
        tree = this.children('Tree')[0];
        list = this.children('DynamicList')[0];
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