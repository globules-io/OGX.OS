require('Controllers.DataManager', 'Controller');
OGX.Controllers.DataManager = function(){
    construct(this, 'Controllers.DataManager');
    'use strict';

    //@Override
	this.construct = function(){
        initMongo();
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

    function initMongo(){
		let options = {encryption:{scheme:OGX.Mongogx.ENCRYPTION_AES, key:'ogx'}};		
        mongogx = new OGX.Mongogx(null, null, options);
        mongogx.createDatabase('system');
        mongogx.setDatabase('drives');	
	} 	
};