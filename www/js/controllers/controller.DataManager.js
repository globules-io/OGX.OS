require('Controllers.DataManager', 'Controller');
OGX.Controllers.DataManager = function(){
    construct(this, 'Controllers.DataManager');
    'use strict';

    //@Override
	this.construct = function(){
        initMongo(); 
        let json;
        const drives = this.getDrives();
        if(!drives.length){
            json = app.getJSON('drives');
            mongogx.setCollection('drives');
            json.forEach(__drive => {
                mongogx.insert(__drive);
            });
        }   
        const programs = this.getPrograms();
        if(!programs.length){
            json = app.getJSON('programs');
            mongogx.setCollection('menu_programs');
            json.forEach(__program => {
                mongogx.insert(__program);
            });
        }
        const pins = this.getPins();
        if(!pins.length){
            json = app.getJSON('pins');
            mongogx.setCollection('menu_pins');
            json.forEach(__pin => {
                mongogx.insert(__pin);
            });
        }
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

    this.getDrives = function(){
        mongogx.setCollection('drives');
        return mongogx.find({});
    };

    this.getPrograms = function(){
        mongogx.setCollection('menu_programs');
        return mongogx.find({});
    };

    this.getPins = function(){
        mongogx.setCollection('menu_pins');
        return mongogx.find({});
    };

    this.getDriveTree = function(__drive){

    };

    function initMongo(){
		let options = {encryption:{scheme:OGX.Mongogx.ENCRYPTION_AES, key:'ogx'}};		
        mongogx = new OGX.Mongogx(null, null, options);
        mongogx.setDatabase('system');	        
        mongogx.createDatabase('system');
        mongogx.setDatabase('system');	
        mongogx.createCollection('drives');
        mongogx.createCollection('menu_programs');
        mongogx.createCollection('menu_pins');        
	} 	
};