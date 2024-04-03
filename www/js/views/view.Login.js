require('Views.Login', 'View');
OGX.Views.Login = function(__config){
    construct(this, 'Views.Login');
	'use strict'; 

    //@Override
	this.construct = function(){
        OGX.Form.bindForm({
            el:'#login form',
            submit_cb:onLogin,
            wait:0,
            fields:{
                password:{                   
                    submit: true
                }
            }
        });
        OS.version((__version) => {
            this.el.find('.version').html('ogx.os version '+__version);
        });
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
            
        }else{
           
        }
    };

    //@Override
    this.destroy = function(){
        OGX.Form.unbindForm('#login form');
    };

    function onLogin(__event){
        $('#login > .center').addClass('hide');
        setTimeout(() => {
            OS.goto('main/desktop');
        }, 300);
    }
};