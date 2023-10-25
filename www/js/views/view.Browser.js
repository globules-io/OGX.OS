require('Views.Browser', 'View');
OGX.Views.Browser = function(__config){
    construct(this, 'Views.Browser');
	'use strict'; 

    //@Override
	this.construct = function(){
        OGX.Form.bindForm({
            el: this.selector+' form',
            fields:{
                url:{}
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
            
        }else{
           
        }
    };

    //@Override
    this.destroy = function(){
        OGX.Form.unbindForm(this.selector+' form');
    };

    function onSubmit(__e){

    }

    function isURL(__string){
        return __string.match('^(https?:\\/\\/)?((([-a-z0-9]{1,63}\\.)*?[a-z0-9]([-a-z0-9]{0,253}[a-z0-9])?\\.[a-z]{2,63})|((\\d{1,3}\\.){3}\\d{1,3}))(:\\d{1,5})?((\\/|\\?)((%[0-9a-f]{2})|[-\\w\\+\\.\\?\\/@~#&=])*)?$');
    }
};