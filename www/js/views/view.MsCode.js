require('Views.MsCode', 'Program', 'View');
OGX.Views.MsCode = function(__config){
    construct(this, 'Views.MsCode');
	'use strict'; 
    const that = this;
    let code;

    //@Override
	this.construct = function(){
        let init_content = false;
        if(this.data && this.data.hasOwnProperty('file')){
            this.data.file = OGX.Data.clone(this.data.file);      
            init_content = true;      
        };
        code = CodeMirror(this.el.find('.editor')[0], {mode: 'javascript',  lineNumbers: true, theme: 'base16-dark', scrollbarStyle: 'simple'});
        code.setSize('100%', '100%'); 
        if(init_content){
            code.setValue(this.data.file.data);
        }  
        code.on('change', () => {
            that.data.file.data = code.getValue();
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
    this.destroy = function(){};

    this.val = function(__string){
        if(typeof __string === 'undefined'){
            return code.getValue();
        }
        code.setValue(__string);
    };
};