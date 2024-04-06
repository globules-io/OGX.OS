require('Views.TextEditor', 'Program', 'View');
OGX.Views.TextEditor = function(__config){
    construct(this, 'Views.TextEditor');
	'use strict'; 
    let popup;
    let data = '';
    let editor = null;
    const that = this;
   
    //@Override
	this.construct = function(){
        this.parent.on(OGX.Resize.RESIZING, (__e) => {
            this.el.find('iframe').addClass('noevent');
        }); 
        this.parent.on(OGX.Resize.RESIZED, (__e) => {
            this.el.find('iframe').removeClass('noevent');
        });
        let init_content = false;
        if(this.data && this.data.hasOwnProperty('file')){
            this.data.file = OGX.Data.clone(this.data.file);      
            init_content = true;      
        };  

        popup = OS.findPopup(this);
        tinymce.init({
            selector: 'textarea.editor',
            plugins: 'image lists',
            menubar:'',
            toolbar:'undo redo | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | bullist',
            resize:false,
            skin:'ogx',
            content_css:'dark',            
            setup:(ed) => {               
                ed.on('keyup', onBodyChange);    
                ed.on('init', ()=>{        
                    editor = ed;    
                    if(init_content){ 
                        ed.setContent(that.data.file.data); 
                    }
                });                         
            }
        });      
            
    };
	
    //@Override
	this.onFocus = function(){
        this.el.find('iframe').removeClass('noevent');
    };
	
    //@Override
	this.onBlur = function(){
        this.el.find('iframe').addClass('noevent');
    };
	
    //@Override
	this.ux = function(__bool){
        if(__bool){
            
        }else{
           
        }
    };

    //@Override
    this.destroy = function(){
        tinymce.remove(this.selector+' textarea.editor');
    };

    this.val = function(__string){
        if(editor){     
            if(this.data && this.data.hasOwnProperty('file')){      
                this.data.file.data = __string;
            }
            editor.setContent(__string);
        }
    };

    function onBodyChange(){
        that.data.file.data = editor.getContent();
    }
};
    