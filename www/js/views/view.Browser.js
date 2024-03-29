require('Views.Browser', 'Program', 'View');
OGX.Views.Browser = function(__config){
    construct(this, 'Views.Browser');
	'use strict'; 
    const view = this;
    const history = [];
    let idx = -1;

    //@Override
	this.construct = function(){
        this.parent.on(OGX.Resize.RESIZING, (__e) => {
            this.el.find('iframe').addClass('noevent');
        }); 
        this.parent.on(OGX.Resize.RESIZED, (__e) => {
            this.el.find('iframe').removeClass('noevent');
        });     
        OGX.Form.bindForm({
            el: this.selector+' form',
            fields:{
                url:{
                    submit: true
                }
            },
            submit_cb: onSubmit
        });
    };
	
    //@Override
	this.onFocus = function(){};
	
    //@Override
	this.onBlur = function(){};
	
    //@Override
	this.ux = function(__bool){
        if(__bool){
            this.on(this.touch.down, '.icon_left', (__e) => {
                if(history.length){
                    idx = history.length-1;
                    const url = history[idx];
                    goto(url, false);
                }
            });
            this.on(this.touch.down, '.icon_right', (__e) => {
                if(idx > 0){
                    const url = history[idx];
                    goto(url, false);
                }
            });
            this.on(this.touch.down, '.icon_reload', (__e) => {
                goto(history[history.length-1], false);
            });  
        }else{
            this.off(this.touch.down, '.icon_left');
            this.off(this.touch.down, '.icon_right');
            this.off(this.touch.down, '.icon_reload');           
        }
    };

    //@Override
    this.destroy = function(){
        this.parent.off(OGX.Resize.RESIZING); 
        this.parent.off(OGX.Resize.RESIZED);    
        OGX.Form.unbindForm(this.selector+' form');
    };

    function onSubmit(__e){
        if(isURL(__e.obj.url)){           
            let url;
            if(/^(https?:\/\/)/.test(__e.obj.url)){
                url = __e.obj.url;
            }else{
                url = 'https://'+__e.obj.url;
            }
            goto(url, true);
        }
    }

    function isURL(__string){
        return __string.match('^(https?:\\/\\/)?((([-a-z0-9]{1,63}\\.)*?[a-z0-9]([-a-z0-9]{0,253}[a-z0-9])?\\.[a-z]{2,63})|((\\d{1,3}\\.){3}\\d{1,3}))(:\\d{1,5})?((\\/|\\?)((%[0-9a-f]{2})|[-\\w\\+\\.\\?\\/@~#&=])*)?$');
    }

    function goto(__url, __add_to_hist){
        view.el.find('iframe').attr('src', __url);
        view.el.find('.icon_reload').removeClass('off');
        if(__add_to_hist){
            history.push(__url);
            if(history.length > 0){
                view.el.find('.icon_reload').removeClass('off');
            }
            if(history.length > 1){
                view.el.find('.icon_left').removeClass('off');
            }
        }
    }
};