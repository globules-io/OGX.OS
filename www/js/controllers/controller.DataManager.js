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
            json = {label : 'System', letter : 'C', size : getStorageSize(), used: 0};
            mongogx.setCollection('drives');    
            mongogx.insert(json);            
        }  
        const pins = this.getPins();
        if(!pins.length){
            json = app.getJSON('menu_pins');
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

    /* DRIVES */
    this.getDrives = function(){
        mongogx.setCollection('drives');
        return mongogx.find({});
    };   

    this.getPins = function(){
        mongogx.setCollection('menu_pins');
        return mongogx.find({});
    };

    this.getDriveTree = function(__drive){

    };

    this.getFiles = function(__drive, __path){

    };

    //fetch everything from localStorage that is not mongoogx
    //substract to total
    function getDriveUse(__letter){        
        let total = getStorageUse('mongogx');
        let size = 0;
    }

    //total storage used
    function getStorageUse(__skip){
        let size = 0;
        let a;
        for(a in localStorage){
            if(a !== __skip){
                size += localStorage[a].length;
            }
        }
        return size;
    }

    function getStorageSize(){       
        let i;
        let size = 0;
        try {
            for (i = 250; i <= 10000; i += 250) {
                localStorage.setItem('o', new Array((i * 1024) + 1).join('o'));
            }
        } catch (e) {
            localStorage.removeItem('o');     
            size = i - 250;     
        }   
        return size;     
    }

    function initMongo(){
		let options = {encryption:{scheme:OGX.Mongogx.ENCRYPTION_AES, key:'ogx'}};		
        mongogx = new OGX.Mongogx(null, null, options);     
        mongogx.createDatabase('system');
        mongogx.setDatabase('system');	
        //refactor
        mongogx.createCollection('drives');
        mongogx.createCollection('files');
        mongogx.createCollection('menu_programs');
        mongogx.createCollection('menu_pins');        
	} 	
};