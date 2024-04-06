require('Views.TextEditor', 'Program', 'View');
OGX.Views.TextEditor = function(__config){
    construct(this, 'Views.TextEditor');
	'use strict'; 
    let popup;
   
    //@Override
	this.construct = function(){
        this.parent.on(OGX.Resize.RESIZING, (__e) => {
            this.el.find('iframe').addClass('noevent');
        }); 
        this.parent.on(OGX.Resize.RESIZED, (__e) => {
            this.el.find('iframe').removeClass('noevent');
        });
        popup = OS.findPopup(this);
        tinymce.init({
            selector: this.selector+' textarea.editor',
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
        if(this.data && this.data.hasOwnProperty('file')){
            tinymce.activeEditor.setContent(this.data.file.data);
        }        
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
       
    };

    function onBodyChange(){

    }
};
    