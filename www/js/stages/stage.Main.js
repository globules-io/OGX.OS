require('Stages.Main', 'Stage');
OGX.Stages.Main = function(__obj){
    construct(this, 'Stages.Main');
	'use strict';
    let clock_intv, program_manager;
    let context = null;

    //@Override
	this.construct = function(){
        this.updateClock();
        program_manager = OS.cfind('Controller', 'program_manager');
    };
	
    //@Override
	this.onFocus = function(){
        clock_intv = setInterval(() => {this.updateClock()}, 1000);
    };
	
    //@Override
	this.onBlur = function(){
        clearInterval(clock_intv);
    };
	
    //@Override
	this.ux = function(__bool){
        if(__bool){
            this.on(this.touch.down, (__e) => {
                //if clock exists in this, remove it
                let clock = this.find('View', 'main_clock');
                if(clock){
                    OS.remove('View', clock.id);
                }               
                //show context on right click
                if(this.touch.isRightClick(__e)){
                    const desk = getDesktopAtPoint(__e.pageX, __e.pageY);
                    if(desk){
                        __e.preventDefault();
                        __e = this.event(__e);  
                        if(context){
                            context.parent.remove('ContextMenu', context.id);
                            context = null;
                        }
                        setTimeout(() => {       
                            const desktop = this.children('Desktop')[0];                 
                            context = this.create('ContextMenu', {
                                id: 'desktop_context_list',
                                x: __e.pageX,
                                y: __e.pageY,
                                //overwrite default display to include icons
                                display:{
                                    template: {
                                        bind: 'type'
                                    },
                                    css: {
                                        bind: 'type', 
                                        add: 'ogx_context_menu_item'
                                    }
                                },
                                //on list select callback
                                callback: (__item) => {
                                    if(__item.hasOwnProperty('action') && OS.SYSTEM.FILE.hasOwnProperty(__item.action)){
                                        OS.SYSTEM.FILE[__item.action](OS.SYSTEM.PATH+'desktops/'+OS.SYSTEM.DESKTOP.get().name);                                                                         
                                        return;
                                    }
                                    //not an action, then it's a process to start, could be refactored into action
                                    OS.SYSTEM.PROCESS.start(desktop, __item);
                                },
                                //set list from cached json
                                list: OS.getJSON('desktop_context')
                            });                        
                        }, 0);
                        return;
                    }
                    let o = getFileAtPoint(__e.pageX, __e.pageY);                    
                    if(o){
                        __e.preventDefault();
                        __e = this.event(__e);  
                        let file = OS.SYSTEM.DATA.getFileById(o._id);
                        if(file){  
                            //get compatible processses
                            const processes = OS.SYSTEM.PROCESS.compatible(file);
                            //convert process to context menu item                       
                            let arr = processesToContext(processes);
                             //get std context
                            let contx_list = OS.getJSON(file.type+'_context');                                
                            contx_list = arr.concat(contx_list);    
                            if(context){
                                context.parent.remove('ContextMenu', context.id);
                                context = null;
                            }                        
                            setTimeout(() => {  
                                context = this.create('ContextMenu', {
                                    id: 'file_context_list',
                                    x: __e.pageX,
                                    y: __e.pageY,
                                    //overwrite default display to include icons
                                    display:{
                                        template: {
                                            bind: 'type'
                                        },
                                        css: {
                                            bind: 'type', 
                                            add: 'ogx_context_menu_item'
                                        }
                                    },
                                    //on list select callback                                    
                                    callback: (__item) => {
                                        if(__item.hasOwnProperty('action')){   
                                            switch(__item.action){
                                                case 'openFile':     
                                                //start pass file
                                                //need active desktop here
                                                OS.SYSTEM.PROCESS.start(OS.SYSTEM.DESKTOP.get(), __item, {file:file});                                               
                                                break;  

                                                case 'renameFile':
                                                //issue, edits multiple cause fileexplorer.                                              
                                                o.el.addClass('rename').append('<input class="text" name="label" value="'+file.label+'"></input>');
                                                o.el.children('input')[0].select();
                                                OGX.Form.bindField({
                                                    el:'.file[data-ogx-id="'+file._id+'"] input[name="label"]',     
                                                    submit: true,      
                                                    submit_cb: (__o) => {
                                                        if(__o.value.length){                                                        
                                                            OS.SYSTEM.FILE.renameFile(file, __o.value);
                                                            OGX.Form.unbindField('.file[data-ogx-id="'+file._id+'"');
                                                            o.el.removeClass('rename').children('input').remove();   
                                                        }
                                                    }
                                                })
                                                break;                                             

                                                case 'deleteFile':
                                                OS.addOverlay();
                                                OS.addPopup({
                                                    id: 'confirm',
                                                    head: 'none',
                                                    width: 400,
                                                    height: 140,
                                                    html: '<span class="popup_message">Are you sure you want to delete '+file.label+'? Please confirm.</span>',
                                                    buttons: [{label:'YES', callback:null}, {label:'CANCEL', callback:() => {
                                                        OS.removeOverlay(false);
                                                        OS.removePopup('confirm', false);
                                                    }}]
                                                });
                                                break;
                                            }                                
                                            return;
                                        }
                                    },                                    
                                    list: contx_list
                                }); 
                            }, 0);
                        }
                    }
                }
            });
            this.on(this.touch.down, '.icon_menu', (__e) => {
                __e.stopImmediatePropagation();
                const win = OS.cfind('Window', 'main_menu_win');
                if(win.status !== 'WindowClosed'){
                    win.hide(true);
                }else{
                    win.show(true);
                }
            });
            this.on(this.touch.down, '.clock', (__e) => {
                __e.stopImmediatePropagation();
                //add clock view if not exist
                if(!this.children('Clock').length){
                    this.create('Views.Clock', {
                        id: 'main_clock',
                        el: this.selector+'>.view',
                        template: 'Clock',
                        css: 'main_clock',
                        'node:OML':{
                            'default .calendar:Calendar':{
                                simple : true
                            }
                        }
                    });
                }
            });
        }else{
           this.off(this.touch.down);
           this.off(this.touch.down, '.icon_menu');
           this.off(this.touch.down, '.clock');
        }
    };

    //@Override
    this.destroy = function(){};

    this.updateClock = function(){
        this.el.find('.taskbar > .tray > .clock').html(moment().format('HH:mm'));
    };

    function getDesktopAtPoint(__x, __y){
        const els = document.elementsFromPoint(__x, __y);
        //2nd div always or not desktop
        const el = $(els[2]);
        if(el.hasClass('ogx_uxi') && el.hasClass('desktop')){
            return OS.cfind('View', el.data('ogx-id'));
        }
        return false;
    }

    function getFileAtPoint(__x, __y){
        const els = document.elementsFromPoint(__x, __y);    
        //2nd div always or not file/folder    
        let el = $(els[1]);
        if(el.hasClass('ogx_dynamic_list_item') && (el.hasClass('file') || el.hasClass('folder'))){
            return {_id:el.data('ogx-id'), el:el};
        }
        return null;
    }

    function processesToContext(__arr){
        let l = [];
        __arr.forEach((__o) => {   
            //icon is path to img here
            l.push({label : 'Open with '+__o.name, app: __o.name, action: 'openFile', icon: __o.config.config.icon, type : 'ContextItem'});
        });
        return l;
    }

};