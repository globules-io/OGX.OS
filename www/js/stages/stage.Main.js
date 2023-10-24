require('Stages.Main', 'Stage');
OGX.Stages.Main = function(__obj){
    construct(this, 'Stages.Main');
	'use strict';
    let clock_intv;

    //@Override
	this.construct = function(){
        this.updateClock();
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
                    app.remove('View', clock.id);
                }
                //if context exists in this, remove it
                let ctx = this.children('ContextMenu');
                if(ctx.length){
                    app.remove('ContextMenu', ctx[0].id);
                }
                //show context on right click
                if(this.touch.isRightClick(__e)){
                    __e.preventDefault();
                    __e = this.event(__e);  
                    setTimeout(() => {
                        this.create('ContextMenu', {
                            id: 'desktop_context_list',
                            x: __e.pageX,
                            y: __e.pageY,
                            //overwrite default display to include icons
                            display:{
                                html:'<span class="icon {{$icon}}"></span><span>{{$label}}</span>',
                                css:'ogx_context_menu_item'
                            },
                            //on list select callback
                            callback: () => {
                               
                            },
                            //set list from cached json
                            list: app.getJSON('desktop_context')
                        });
                    }, 0);
                }
            });
            this.on(this.touch.down, '.icon_menu', (__e) => {
                __e.stopImmediatePropagation();
                app.cfind('Window', 'main_menu_win').show(true);
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

};