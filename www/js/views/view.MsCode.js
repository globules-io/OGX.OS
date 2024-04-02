require('Views.MsCode', 'Program', 'View');
OGX.Views.MsCode = function(__config){
    construct(this, 'Views.MsCode');
	'use strict'; 
    let code;

    //@Override
	this.construct = function(){
        code = CodeMirror(this.el.find('.editor')[0], {mode: 'javascript',  lineNumbers: true, theme: 'base16-dark', scrollbarStyle: 'simple'});
        code.setSize('100%', '100%'); 
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
    this.destroy = function(){};

    this.val = function(__string){
        if(typeof __string === 'undefined'){
            return code.getValue();
        }
        code.setVlue(__string);
    };
};