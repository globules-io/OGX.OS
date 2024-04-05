require('Controllers.DataManager', 'Controller');
OGX.Controllers.DataManager = function(){
    construct(this, 'Controllers.DataManager');
    'use strict';

    //@Override
	this.construct = function(){
        initMongo();     
        const drives = this.getDrives();        
        const pins = this.getPins();             
    };

    /* DRIVES */
    this.getDrives = function(){
        mongogx.setDatabase('system');	
        mongogx.setCollection('drives');
        return mongogx.find({});
    };   

    this.getPins = function(){
        mongogx.setDatabase('system');	
        mongogx.setCollection('menu_pins');
        return mongogx.find({});
    };

    this.getDriveTree = function(__drive){
        return this.getTree();
    };

    this.getFiles = function(__path, __filter, __limit){
        typeof __limit === 'undefined' ? __limit = 0 : null;
        mongogx.setCollection('files');
        const query = {path:{$regex:'/^'+__path+'$/i'}};
        typeof __filter !== 'undefined' ? OGX.Data.merge(query, __filter, true, false, false) : null;
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
        mongogx.setDatabase('system');	
        mongogx.setCollection('files');
    };

    this.createFile = function(__path, __name){
        __path = normalizePath(__path);        
        mongogx.setDatabase('system');	
        mongogx.setCollection('files');
        const t = moment().unix();
        const file = {type:'file', label:__name, path:__path, created:t, modified:t};
        file._id = mongogx.insert({type:'file', label:__name, path:__path, created:t, modified:t});
        return file;
    };

    this.createFolder = function(__path, __name){
        __path = normalizePath(__path);        
        mongogx.setDatabase('system');	
        mongogx.setCollection('files');
        const t = moment().unix();
        const folder = {type:'folder', label:__name, path:__path, created:t, modified:t};
        folder._id = mongogx.insert({type:'folder', label:__name, path:__path, created:t, modified:t});
        return folder;
    };

    this.getTree = function(__path){
        const files = this.getFiles(__path);
        console.log('TREE FILES', files);
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

    function normalizePath(__path){
        !__path.match(/\/$/) ? __path += '/' : null;
        __path = __path.slice(0,1).toUpperCase()+__path.slice(1);
        return __path;
    }

    
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
            mongogx.insert({type:'folder', label:'default', path:'C:/system/desktops/', created:t, modified:t});      
        }  

        //pins
        mongogx.setCollection('menu_pins');
        if(!mongogx.findOne({})){   
            let json = OS.getJSON('menu_pins');            
            json.forEach(__pin => {
                mongogx.insert(__pin);
            });  
        }    
	} 	
};