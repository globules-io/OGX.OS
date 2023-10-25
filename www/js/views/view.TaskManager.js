require('Views.TaskManager', 'View');
OGX.Views.TaskManager = function(__config){
    construct(this, 'Views.TaskManager');
	'use strict'; 
    let fps = 0;
    let request = null;
    let list, list_intv, fps_el, graph_el;

    //@Override
	this.construct = function(){
        list = this.children('DynamicList')[0];
        fps_el = this.el.find('.graph > .fps');
        graph_el = this.el.find('.graph > .level > .box');
        calcFPS();
    };
	
    //@Override
	this.onFocus = function(){
        list_intv = setInterval(listInterval, 1000);
    };
	
    //@Override
	this.onBlur = function(){
        clearInterval(list_intv);
    };
	
    //@Override
	this.ux = function(__bool){
        if(__bool){
            
        }else{
           
        }
    };

    //@Override
    this.destroy = function(){
        if(request){
            cancelAnimationFrame(request);
        }
    };

    function listInterval(){
        const nodes = app.gather();
        let arr = [];
        let idx = 1;
        let label;
        nodes.forEach(__node => {           
            label = __node._NAME_;
            typeof __node._CLASS_ !== 'undefined' ? label += '.'+__node._CLASS_ : null;
            arr.push({label:label, value:idx});
            idx++;
        });
        list.val(arr);
    }

    function calcFPS() {
        let prevTime = Date.now();
        let frames = 0;   
        let time, pc; 
           
        function run(){
            time = Date.now();
            frames++;
            if (time > prevTime + 1000) {
                fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
                prevTime = time;
                frames = 0;
            }
            fps_el.html(fps);
            pc = 100 - fps * 100 / 60;
            !pc ? pc = 1 : null;
            graph_el.css('height', pc+'%');
            request = requestAnimationFrame(run);
        }

        request = requestAnimationFrame(run);
    }     
};