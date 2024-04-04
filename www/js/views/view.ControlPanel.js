require('Views.ControlPanel', 'Program', 'View');
OGX.Views.ControlPanel = function(__config){
    construct(this, 'Views.ControlPanel');
	'use strict'; 
    let flip, list;
    let prog = null;

    //@Override
	this.construct = function(){    ;
        flip = this.children('Flip')[0];       
        list = flip.children('DynamicList')[0];   
     };
	
    //@Override
	this.onFocus = function(){};
	
    //@Override
	this.onBlur = function(){};

    //@Override
	this.onResize = function(){};
	
    //@Override
	this.ux = function(__bool){
        if(__bool){
            list.on(OGX.DynamicList.SELECT, (__e, __item) => {
                if(prog){
                    OS.SYSTEM.PROCESS.stop(prog.id);
                    prog = null;
                }            
                prog = OS.SYSTEM.PROCESS.start(flip, __item, {}, '.ogx_flip_cell > .prog');
                if(prog){
                    flip.flip();
                }
            });
            this.on(this.touch.down, '.ogx_flip_back > .back', (__e) => {
                flip.flip();
                OS.SYSTEM.PROCESS.stop(prog.id);
                prog = null;
            });
        }else{
            list.off(OGX.DynamicList.SELECT);
            this.off(this.touch.down, '.ogx_flip_back > .back');
        }
    };

    //@Override
    this.destroy = function(){};
};