require('Views.Sketch', 'View');
OGX.Views.Sketch = function(){
    construct(this, 'Views.Sketch');
	'use strict';
	let that = this;
    let board, canvas, ctx, controls, colors, brushes, image;
    let started = false;
    let brush = 1;
    let color = '#000';

    //@Override
    this.construct = function(){       
        board = this.el.find('.board');
        canvas = this.el.find('canvas');
        ctx = canvas[0].getContext('2d');
        controls = app.cfind('DynamicList', 'sketch_controls');
        colors = app.cfind('DynamicList', 'sketch_colors');
        brushes = app.cfind('DynamicList', 'sketch_brushes'); 
        colors.select('color', '#000000');
        brushes.select('size', 1);
    };
    
    //@Override
    this.resize = function(){
        started = false;
        if(canvas[0].width){            
            image = ctx.getImageData(0, 0, canvas[0].width, canvas[0].height);
            resizeCanvas();
            ctx.putImageData(image, 0, 0);
        }
    };

    //@Override
    this.ux = function(__bool){        
        if(__bool){       
            canvas.on(this.touch.down, function(__e){               
                if(!started){
                    started = true;
                    __e = that.event(__e);
                    const o = toLocalCoordinates(__e);
                    ctx.lineWidth = brush;
                    ctx.strokeStyle = color;   
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(o.x, o.y);
                }                    
            });
            canvas.on(this.touch.move, function(__e){
                if(started){
                    __e = that.event(__e);
                    const o = toLocalCoordinates(__e);
                    ctx.lineTo(o.x, o.y);
		            ctx.stroke();                    
                }
            });
            canvas.on(this.touch.up, function(__e){
                started = false;
            });
            controls.on(OGX.DynamicList.SELECT, function(__e, __data){
                switch(__data.id){
                    case 'clear':
                    that.addOverlay();
                    app.addPopup({
                        id:'popup',
                        title:'Clear Artboard?',
                        width:300,
                        height:180,
                        anim:'scale',
                        html:'<span class="popup_message">Please confirm that you want to clear the artboard.</span>',
                        buttons:[{label:'CLEAR', callback:clearBoard}, {label:'CANCEL', callback:closePopup}]
                    }, that);                 
                    break;

                    case 'save':
                    that.addOverlay();
                    app.addPopup({
                        id:'popup',
                        title:'Send Sketch?',
                        width:300,
                        height:180,
                        anim:'scale',
                        html:'<span class="popup_message">Please confirm that you want to save the artboard.</span>',
                        buttons:[{label:'SAVE', callback:saveSketch}, {label:'CANCEL', callback:closePopup}]
                    }, that);                 
                    break;
                }                
            });
            colors.on(OGX.DynamicList.SELECT, function(__e, __data){
                color = __data.color;
            });
            brushes.on(OGX.DynamicList.SELECT, function(__e, __data){
                brush = __data.size;
            });
        }else{
            canvas.off(this.touch.down);
            canvas.off(this.touch.move);
            canvas.off(this.touch.up);
            controls.off(OGX.DynamicList.SELECT);
            colors.off(OGX.DynamicList.SELECT);
            brushes.off(OGX.DynamicList.SELECT);
        }
    }; 

    function resizeCanvas(){
        let w = board.width();
        let h = board.height(); 
        canvas.attr('width', w);
        canvas.attr('height', h);
    }

    function toLocalCoordinates(__e){
        const rect = __e.target.getBoundingClientRect();
        const o = {};
        o.x = __e.clientX - rect.left; 
        o.y = __e.clientY - rect.top; 
        return o;
    }

    function clearBoard(){
        closePopup();
        ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
    }

    function closePopup(){
        that.removeOverlay(false);
        app.removePopup('popup', false);
    }

    //to do 
    function saveSketch(){
        app.removePopup('popup', false);
        that.removeOverlay(false);
        that.addLoading();
        setTimeout(function(){
            resizeCanvas();
            that.removeLoading(false);
            that.addOverlay(false);
            app.addPopup({
                id:'popup',
                title:'Sketch Saved!',
                width:300,
                height:180,
                anim:'scale',
                html:'<span class="popup_message">Your sketch has been saved!</span>',
                buttons:[{label:'CLOSE', callback:closePopup}]
            }, that);
        }, 2000);
    }
}