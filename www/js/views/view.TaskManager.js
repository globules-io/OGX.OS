require('Views.TaskManager', 'Program', 'View');
OGX.Views.TaskManager = function(__config){
    construct(this, 'Views.TaskManager');
	'use strict'; 
    let stage = null;
    let fps = 0;
    let request = null;
    let docker, list, fps_el, mem_el;
    let mem_chart, fps_chart;
    let cache = null;
    let max_mem = 0;
    let max_mem_used = 0;
    let min_mem_used = 999*999;
    let current_mem = 0;
    let mem_values = [];
    let fps_values = [];
    const max_values = 30;
    
    const chart_conf = {
        type: 'line',            
        options: {
            animations: false,
            responsive: true,
            maintainAspectRatio: false,    
            scales:{
                x: {
                    grid: {
                        display: true,
                        drawOnChartArea: true,
                        drawTicks: false,
                        color: '#333'
                    },
                    ticks: {
                        callback: null
                    }
                }
            },
            elements: {
                point:{
                    radius: 0
                },
                line: {
                    tension: 0.5,
                    borderWidth: 1,
                    borderColor: '#1e90ff'
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }                               
        }      
    }


    //@Override
	this.construct = function(){
        stage = app.getStage();
        docker = app.cfind('Docker', 'docker');
        list = this.gather('DynamicList')[0];
        tree = this.gather('Tree')[0];
        fps_el = this.el.find('.graph > .fps');
        mem_el = this.el.find('.graph > .mem');   
        let c = OGX.Data.clone(chart_conf);
        c.options.scales.x.ticks.callback = () => ('');
        fps_chart = new Chart($(this.selector+' .graph > .frames > canvas'), c);   
        c = OGX.Data.clone(chart_conf);
        c.options.scales.x.ticks.callback = () => ('');       
        mem_chart = new Chart($(this.selector+' .graph > .memory > canvas'), c);      
        calcFPS();
    };
	
    //@Override
	this.onFocus = function(){};
	
    //@Override
	this.onBlur = function(){};
	
    //@Override
	this.ux = function(__bool){
        if(__bool){
            app.on(app.SYSTEM.PROCESS.STARTED+' '+app.SYSTEM.PROCESS.KILLED, (__e, __process_id) => {
                update();
            });
        }else{
           app.off(app.SYSTEM.PROCESS.STARTED+' '+app.SYSTEM.PROCESS.KILLED);
        }
    };
    
    //@Override
    this.destroy = function(){
        if(request){
            cancelAnimationFrame(request);
        }
        mem_chart.destroy();
        fps_chart.destroy();
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

    function update(){    
        let sel = list.getSelection();      
        let arr = new OGX.List();
        const nodes = app.SYSTEM.PROCESS.get();
        nodes.forEach(__node => {             
            arr.push({label: nodeToLabel(__node), value:__node.id});        
        });    
        list.val(arr);      
        if(sel){
            list.select('value', sel.value);    
        }            
        appsToTree(nodes.get({isProgram:true}));              
    }

    function fillArray(__val){
        let arr = [];
        for(let i = 0; i < max_values; i++){
            arr.push(__val);
        }
        return arr;
    }

    function fillArray(__val){
        let arr = [];
        for(let i = 0; i < max_values; i++){
            arr.push(__val);
        }
        return arr;
    }

    function calcFPS() {
        let prevTime = Date.now();
        let frames = 0;   
        let time; 
           
        function run(){           
            time = Date.now();            

            //mem
            max_mem < window.performance.memory.jsHeapSizeLimit ? max_mem = window.performance.memory.jsHeapSizeLimit : null;                
            if(time - prevTime > 999){
                current_mem = Math.round((window.performance.memory.totalJSHeapSize / (1024 * 1024)*100)/100);
                max_mem_used < current_mem ? max_mem_used = current_mem : null;
                current_mem < min_mem_used ? min_mem_used = current_mem : null;
                mem_values.push(current_mem);                
                if(mem_values.length > max_values){
                    mem_values.shift();
                }

                mem_chart.data = {labels:mem_values, datasets:[{data:mem_values, borderColor:'#EDD029'}, {data:fillArray(min_mem_used), borderColor: '#282828'}, {data:fillArray(max_mem_used), borderColor: '#282828'}]};
                mem_chart.update();
                mem_el.html(current_mem+'/'+(Math.round(max_mem/(1024 * 1024)*100)/100)+'MB');                
            }           

            //fps
            frames++;
            if (time > prevTime + 1000) {
                fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
                prevTime = time;
                frames = 0;                
                fps_values.push(fps);
                if(fps_values.length > max_values){
                    fps_values.shift();
                }   
                fps_chart.data = {labels:fps_values, datasets:[{data:fps_values}]};
                fps_chart.update();
                fps_el.html(fps+'FPS');             
            } 

            request = requestAnimationFrame(run);
        }

        request = requestAnimationFrame(run);
    }     
};