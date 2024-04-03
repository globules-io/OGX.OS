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
        data_manager = OS.cfind('Controller', 'data_manager');
        list.val(data_manager.getFiles(this.data.drive, this.data.path));
        tree.setTree(data_manager.getTree(this.data.drive, this.data.path));
    };
    
    //@Override
	this.enable = function(){};
	
    //@Override
	this.disable = function(){};    
	
    //@Override
	this.ux = function(__bool){
        if(__bool){
            tree.on(OGX.Tree.SELECT, function(__e, __item){
                tree_item = __item;
                if(['root', 'folder'].includes(__item.item.type)){
                    list.val(__item.item.items);
                }else{
                    list.wipe();
                }
            });
        }else{
            tree.off(OGX.Tree.SELECT);
        }
    }; 
    
    //@Override
    this.destroy = function(){};

    

};