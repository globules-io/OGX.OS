require('Views.TaskManager', 'Program', 'View');
OGX.Views.TaskManager = function(__config){
    construct(this, 'Views.TaskManager');
	'use strict'; 
    let fps = 0;
    let request = null;
    let docker, list, list_intv, fps_el, fps_graph_el, mem_el, mem_graph_el;
    let cache = null;
    let max_mem = 1024 * 1024 * 1024;

    //@Override
	this.construct = function(){
        docker = app.cfind('Docker', 'docker');
        list = this.gather('DynamicList')[0];
        tree = this.gather('Tree')[0];
        fps_el = this.el.find('.graph > .fps');
        mem_el = this.el.find('.graph > .mem');
        fps_graph_el = this.el.find('.graph > .frames > .box');
        mem_graph_el = this.el.find('.graph > .memory > .box');
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

    function nodeToLabel(__node, __short){
        typeof __short === 'undefined' ? __short = false : null;
        let label = __node._NAME_;     
        if(typeof __node._CLASS_ !== 'undefined'){
            if(!__short){
                label += '.'+__node._CLASS_;
            }else{
                label = __node._CLASS_;
            }
        }         
        return label;
    }

    //convert views to tree item
    function nodeToTree(__node){
        let t = {label: nodeToLabel(__node, true), type:'folder', state: 'closed', id:__node.id, items:new OGX.List()};
        let type;
        
        function cycle(__item, __n){
            __n.children().forEach((__child) => {
                type = 'folder';                   
                !__child.nodes.length ? type = 'file' : null;
                __item.items.push({label: nodeToLabel(__child, true), state: 'closed', type: type, id: __child.id, items: new OGX.List()});
                if(__child.nodes.length){
                    cycle(__item.items.last(), __child);
                }
            });           
        }
    
        cycle(t, __node);
        return t;
    }

    //set tree
    function appsToTree(__list){    
        //only refresh if has changed       
        if(cache && __list.unique('id', false).sort().join(' ') === cache){
            return;
        }  
        let root = {_id:0, type:'root', state:'closed', label: '', items:[]};       
        let t;     

        //this is a list of programs
        __list.forEach((__app) => {
            t = nodeToTree(__app);
            root.items.push(t);
        });  

        tree.setTree(root);
        cache = __list.unique('id', false).sort().join(' ');
    }

    function listInterval(){    
        let sel = list.getSelection();      
        let arr = new OGX.List();
        const nodes = app.getStage().gather();
        nodes.forEach(__node => {             
            arr.push({label: nodeToLabel(__node), value:__node.id});        
        });    
        list.val(arr);      
        if(sel){
            list.select('value', sel.value);    
        } 
        const apps = app.getStage().gather('View').get({isProgram:true});             
        appsToTree(apps);              
    }

    function calcFPS() {
        let prevTime = Date.now();
        let frames = 0;   
        let time, pc; 
           
        function run(){
            //fps
            time = Date.now();
            frames++;
            if (time > prevTime + 1000) {
                fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
                prevTime = time;
                frames = 0;
            }
            fps_el.html(fps+'FPS');
            pc = 100 - fps * 100 / 60;
            !pc ? pc = 1 : null;
            fps_graph_el.css('height', pc+'%');

            //mem
            max_mem < window.performance.memory.totalJSHeapSize ? max_mem = window.performance.memory.totalJSHeapSize : null;
            !max_mem ? max_mem = window.performance.memory.totalJSHeapSize : null;
            pc = window.performance.memory.totalJSHeapSize * 100 / max_mem;
            !pc ? pc = 1 : null;
            mem_graph_el.css('height', pc+'%');
            console.log(pc, window.performance.memory.totalJSHeapSize, max_mem);
            mem_el.html(Math.round((window.performance.memory.totalJSHeapSize / (1024 * 1024)*100)/100)+'/'+(Math.round(max_mem/(1024 * 1024)*100)/100)+'MB');

            request = requestAnimationFrame(run);
        }

        request = requestAnimationFrame(run);
    }     
};