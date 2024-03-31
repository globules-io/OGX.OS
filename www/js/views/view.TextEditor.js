require('Views.TextEditor', 'Program', 'View');
OGX.Views.TextEditor = function(__config){
    construct(this, 'Views.TextEditor');
	'use strict'; 
    let popup;
   
    //@Override
	this.construct = function(){
        popup = app.findPopup(this);
        tinymce.init({
            selector:'textarea.editor',
            plugins: 'image lists',
            menubar:'',
            toolbar:'undo redo | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | bullist | customimage customvideo customlink customtag',
            resize:false,
            skin:'ogx',
            content_css:'dark',            
            setup:function(ed){
                ed.on('keyup', onBodyChange);                             
            },     
            file_picker_callback: function (cb, value, meta) {
                image = false;
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');                
                input.onchange = function(){                   
                    let file = this.files[0];
                    const reader = new FileReader();
                    reader.onload = function(){                       
                        let id = 'blobid' + (new Date()).getTime();
                        let blobCache =  tinymce.activeEditor.editorUpload.blobCache;
                        const base64 = image = reader.result.split(',')[1];   
                        const blobInfo = blobCache.create(id, file, base64);
                        blobCache.add(blobInfo);                       
                        cb(blobInfo.blobUri(), { title: file.name });
                    };
                    reader.readAsDataURL(file);
                };
                input.click();
            }
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
        tinymce.remove('textarea.editor');
    };

    this.val = function(__string){
       
    };

    function onBodyChange(){

    }
};
    