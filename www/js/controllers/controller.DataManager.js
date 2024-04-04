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
            json = OS.getJSON('menu_pins');
            mongogx.setCollection('menu_pins');
            json.forEach(__pin => {
                mongogx.insert(__pin);
            });
        }        
    };

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
        return this.getTree();
    };

    this.getFiles = function(__path, __filter, __limit){
        typeof __limit === 'undefined' ? __limit = 0 : null;
        mongogx.setCollection('files');
        const reg = new RegExp('^'+__path, 'i');
        const query = {path:{regex:reg}};
        typeof __filter !== 'undefined' ? OGX.Data.merge(query, __filter) : null;
        if(__limit && __limit === 1){
            return mongogx.findOne(query);
        }
        return new OGX.List(mongogx.find(query, __limit));
    };

    this.getFile = function(__path, __filter){
        return this.getFiles(__path, __filter, 1);
    };
    
    //if folder, must delete sub children too
    this.deleteFile = function(__path, __name){
        mongogx.setCollection('files');
    };

    this.getTree = function(__path){
        const files = this.getFiles(__path);
        const root = __path.split('/')[0];
        const tree = {type:'root', label: root, items:[]};

        //if we want the entire drive, need to add the drive
        if(__path.length === 1){
            tree.label = __path+':';
        }

        //need to sort the path first     
        files.update({}, (__file) => {__file.depth = __file.path.split('/').length-1;});        
        files.order('depth', 1);
        files.get({depth:1}).forEach((__file) => {
            if(__file.type === 'folder'){
                cycle(__file);
            }
            tree.items.push(__file);
        });

        function cycle(__folder){   
            __folder.items = files.get({path:__folder.path+__folder.label+'/'});        
            __folder.items.forEach((__item) => {
                cycle(__item);
            }); 
        }      
        return tree;
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
        mongogx.createCollection('drives');
        mongogx.createCollection('files');
        mongogx.createCollection('menu_programs');
        mongogx.createCollection('menu_pins');   

        //drives
        mongogx.setDatabase('system');	
        mongogx.setCollection('drives');
        if(!mongogx.findOne({})){
            mongogx.insert({label: 'SYSTEM', letter:'C', size: getStorageSize(), vendor: {brand: 'Western Sea', model: 'Shark 5M WSS000SM007'}});
        };

        //sytem folders
        mongogx.setCollection('files');	
        if(!mongogx.findOne({type:'folder', label:'system', path:'C:/'})){      
            const t = moment().unix();
            mongogx.insert({type:'folder', label:'system', path:'C:/', created:t, modified:t});
            mongogx.insert({type:'folder', label:'desktops', path:'C:/system/', created:t, modified:t});          
        }        
	} 	
};