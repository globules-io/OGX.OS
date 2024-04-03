require('Views.Drives', 'View');
OGX.Views.Drives = function(__config){
    construct(this, 'Views.Drives');
	'use strict'; 
    const view = this;
    const dbto = 200;
    let popup, list;


    //@Override
	this.construct = function(){
        popup = OS.findPopup(this);
        list = this.children('DynamicList')[0];
        list.val(OS.cfind('Controller', 'data_manager').getDrives());
    };
	
    //@Override
	this.onFocus = function(){};
	
    //@Override
	this.onBlur = function(){};
	
    //@Override
	this.ux = function(__bool){
        if(__bool){
            list.on(this.touch.down, '.drive', function(__e){
                //need disable dbclick here
                popup.maximize(false);
                const el = $(this);
                const now = Date.now();
                //manual dbc
                const drive = list.val().get({_id:{eq:el.data('ogx-id')}}, null, 1);
                if(!drive.hasOwnProperty('selected') || !drive.selected){                    
                    list.val().update({selected:{ne:0}}, {selected:false}, false);
                    list.findUpdate('_id', drive._id, {selected:now}, false, 1);
                }else{                   
                    if(now - drive.selected < dbto){                   
                        view.el.empty();
                        let oml = OS.getOML('file_explorer');
                        OGX.OML.getNodeByName(oml, 'file_explorer').data = {drive: drive, path: ''};
                        console.log(oml);
                        view.parse(oml);
                    }else{
                        list.findUpdate('_id', drive._id, {selected:now}, false, 1);
                    }
                }
                setTimeout(() => {
                    popup.maximize(true);
                }, 100);
            });
        }else{
            this.off(this.touch.down);
        }
    };

    //@Override
    this.destroy = function(){};
};