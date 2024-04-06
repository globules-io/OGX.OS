require('Views.FileExplorer',  'Program', 'View');
OGX.Views.FileExplorer = function(__config){
    construct(this, 'Views.FileExplorer');
	'use strict'; 
    let tree, list;
    let tree_item = null;
    let list_item = null;

    //@Override
    this.construct = function(__data){
        tree = this.gather('Tree')[0];
        list = this.gather('DynamicList')[0];
        const t = OS.SYSTEM.DATA.getTree(this.data.path);
        list.val(t.items);
        tree.setTree(t);
    };
    
    //@Override
	this.enable = function(){};
	
    //@Override
	this.disable = function(){};    
	
    //@Override
	this.ux = function(__bool){
        if(__bool){
            OS.on(OS.SYSTEM.FILE.CREATED, (__e, __file) => {
                //need parent _id here
                let o = OS.SYSTEM.UTILS.pathToPathFile(__file.path);
                let parent = OS.SYSTEM.DATA.getFile(o.path);             
                tree.addItem(__file, parent._id);                
            });
            OS.on(OS.SYSTEM.FILE.RENAMED, (__e, __file) => {
                tree.updateItem(__file._id, __file);
                list.findUpdate('_id', __file._id, {label:__file.label}, false, 1);
            });
            OS.on(OS.SYSTEM.FILE.DELETED, (__e, __file) => {
                tree.deleteItem(__file._id);
                list.findDelete('_id', __file._id, 1);
            });
            tree.on(OGX.Tree.SELECT, function(__e, __item){
                tree_item = __item;
                if(['root', 'folder'].includes(__item.item.type)){
                    list.val(__item.item.items);
                }else{
                    list.wipe();
                }
            });
        }else{
            OS.off(OS.SYSTEM.FILE.CREATED);
            OS.off(OS.SYSTEM.FILE.RENAMED);
            OS.off(OS.SYSTEM.FILE.DELETED);
            tree.off(OGX.Tree.SELECT);
        }
    }; 
    
    //@Override
    this.destroy = function(){};

    

};