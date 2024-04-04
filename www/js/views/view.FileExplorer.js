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