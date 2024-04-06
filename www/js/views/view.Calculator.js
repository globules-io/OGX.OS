require('Views.Calculator', 'Program', 'View');
OGX.Views.Calculator = function(__config){
    construct(this, 'Views.Calculator');
	'use strict'; 
    let arr = [];
    let cur = [];
    let ms = 0;
    let ops, res;

    //@Override
	this.construct = function(){
        ops = this.el.find('.operation');
        res = this.el.find('.result');
    };
	
    //@Override
	this.onFocus = function(){};
	
    //@Override
	this.onBlur = function(){};
	
    //@Override
	this.ux = function(__bool){
        if(__bool){              
            this.on(this.touch.down, '.num', function(__e){
                const el = $(this);
                const val = el.html();          
                //already float? dont add . again
                if(val === '.' && isFloat(Number(cur.join('')))){
                    return;
                }  
                cur.push(val);    
                renderNum();
            });
            this.on(this.touch.down, '.op', function(__e){
                const el = $(this);
                const val = el.html();   
                //start with op, means add 0
                if(!cur.length && !arr.length){
                    arr = [0, val];
                }else{       
                    if(cur.length){           
                        arr = arr.concat(cur);
                        arr.push(val); 
                    }else{
                        //change sign
                        if(!isNum(arr[arr.length-1])){
                            arr.pop();
                            arr.push(val);
                        }
                    }
                }   
                cur = [];
                                 
                renderOp();                                   
                const total = calc();     
                renderCalc(total);

                //if we finish with equal, the total is the new starting point
                if(val === '=' && isNum(total)){
                    ops.html('');
                    cur = [total];
                    arr = [];
                }                
            });
            this.on(this.touch.down, '.fnc', function(__e){               
                const el = $(this);
                const val = el.html().trim();    
                switch(val){
                    case 'C':
                    //clear all
                    cur = [];
                    arr = [];
                    res.html('0');
                    ops.html('');       
                    break;

                    case 'DEL': 
                    cur.pop();
                    renderNum();
                    break;

                    case 'CE':                   
                    //clear ongoing num
                    res.html('0');
                    cur = [];    
                    break;     

                    //save
                    case 'MS':                        
                    ms = Number(cur.join(''));
                    //next should reset                    
                    break;   

                    //paste
                    case 'MR':                        
                    cur = [ms];
                    renderNum();
                    break;    

                    //clear
                    case 'MC':
                    ms = 0;
                    break;  

                    //add
                    case 'M+':   
                    ms += Number(cur.join(''));
                    break;

                    //sub
                    case 'M-':   
                    ms -= Number(cur.join(''));
                    break;
                }
            });
        }else{
           this.off(this.touch.down, '.num');
           this.off(this.touch.down, '.op');
           this.off(this.touch.down, '.fnc');
        }
    };

    //@Override
    this.destroy = function(){};

    function renderOp(){
        let html = '';
        arr.forEach(__item => {
            html += '<span>'+__item+'</span>';
        });
        ops.html(html);
    }

    function renderNum(){       
        let html = '';
        cur.forEach(__item => {
            html += __item;
        });
        res.html(html);
    }    

    function renderCalc(__total){     
        if(__total !== false){
            res.html(__total);
        }else{
            res.html('ERROR');
        }
    }

    function calc(){
        let ev = null;        
        try{
            ev = eval(arr.slice(0, -1).join(''));
        }catch(__err){
            console.log('ERROR', ev);
        }
        if(ev !== null){
            return ev;
        }
        return false;
    }

    function isNum(__val){
        return /^d+(\.\d+)?$/.test(String(__val));
    }

    function isFloat(__val){
        return __val === +__val && __val !== (__val|0);
    }
};