require('Views.Desktop', 'View');
OGX.Views.Desktop = function(__config){
    construct(this, 'Views.Desktop');
	'use strict';   
    let popup_w = 0;
    let desktop_w = 0;
    let zone = 150;
    let flex = null;
    let add_flex = false;
    let remove_flex = false;
    let popup_in = false;
    let cell = null;
    let cell_old = null;
    let cell_idx = null;
    let snapped_programs = new OGX.List();   

    //@Override
	this.construct = function(){};
	
    //@Override
	this.onFocus = function(){
        desktop_w = this.el.width();
    };
	
    //@Override
	this.onBlur = function(){};

    this.onResize = function(){
        desktop_w = this.el.width();
    };
	
    //@Override
	this.ux = function(__bool){
        if(__bool){
            this.on(OGX.Popup.MOVE, (__e, __popup, __pt) => {
                popup_in = false;
                add_flex = false;
                remove_flex = false;
                popup_w = __popup.el.width();                
                popup_in = (__pt.x > desktop_w - zone || __pt.x < zone);
                add_flex = popup_in && !flex;    
                remove_flex = !popup_in && flex && !snapped_programs.length;    
                if(add_flex){
                    flex = this.create('FlexCells', {
                        el: this.selector+' .flex',
                        axis : 'x',
                        min : 10,
                        children : ['50%', '50%'],
                        'node:OML':[
                            {
                                'default:FlexCells':{
                                    axis : 'y',
                                    min : 10,
                                    children : ['100%', '0%'],
                                    'node:OML' : [{}, {}]
                                }
                            }, 
                            {
                                'default:FlexCells':{
                                    axis : 'y',
                                    min : 10,
                                    children : ['100%', '0%'],
                                    'node:OML' : [{}, {}]
                                } 
                            }
                        ]
                    });
                }else if(remove_flex){
                    flex.kill();
                    flex = null;
                }else{
                    if(!popup_in){
                        if(cell_old){
                            cell_old.flex.el.removeClass('lite');
                            cell_old.rowel.removeClass('litebottom litetop');
                            cell_old = null;
                        } 
                        return;
                    }
                    //issue is, if not over a cell that I expended here, I need to restore it
                    cell = getCellAtPoint(__pt.x, __pt.y);   
                    if(cell){
                        if(cell_old){
                            if(cell_old.flex.id !== cell.flex.id || cell_old.row !== cell.row){
                                cell_old.flex.el.removeClass('lite');
                                cell_old.rowel.removeClass('litebottom litetop');
                            }
                        }  
                        cell_old = cell;
                        //if empty, lite up the whole box                   
                        if(!cell.flex.nodes.length){                            
                            cell.flex.el.addClass('lite');
                        }else{                            
                            //flex, row, rowel;
                            //need to calculate where to lite, top or bottom
                            if(__popup.y > __popup.el.height() / 2){
                                cell.rowel.removeClass('litetop').addClass('litebottom');
                                cell.drop = 'bottom';
                            }else{
                                cell.rowel.removeClass('litebottom').addClass('litetop');
                                cell.drop = 'top';
                            }
                        }
                    }else{
                        if(cell_old){
                            cell_old.flex.el.removeClass('lite');
                            cell_old.rowel.removeClass('litebottom litetop');
                            cell_old = null;
                        } 
                    }
                }               
            });
            this.on(OGX.Popup.MOVED, (__e, __popup) => {        
                //need to know if I drop it on top or bottom
                if(flex && popup_in && cell){   
                    __popup.uresize(false);
                    __popup.drag(false);   
                    __popup.detach(); 

                    //save and override icons
                    __popup.old_icons = __popup.icons();
                    var icons = [__popup.old_icons[1]];
                    icons[0].callback = () => {
                        this.unsnap(__popup);
                    };
                    __popup.icons(icons);

                    //need compare with nodes, we always start at 2 cells [100%, 0%];
                    if(cell.flex.nodes.length){

                        //has at least 2 cells, so we must add
                        if(cell.flex.nodes.length >= 2){
                            if(cell.drop === 'bottom'){   
                                cell_idx = cell.row+1;
                                cell.flex.addCell('50%', cell_idx);                                
                            }else{
                                cell_idx = cell.row-1;
                                cell_idx < 0 ? cell_idx = 0 : null;
                                cell.flex.addCell('50%', cell_idx);
                            }                            
                        }else{
                            //only has one cell, drop or add then drop over added
                            //depends if top or bottom here                            
                            if(cell.flex.nodes.length === 1){
                                if(cell.drop === 'bottom'){
                                    cell_idx = cell.row+1;    
                                }else{
                                    //must shift down
                                    cell.flex.addCell('50%', 0);
                                    cell.flex.removeCell(2);
                                    cell_idx = 0;
                                }
                            }
                            cell.flex.cellSize(['50%', '50%']);
                        }
                    }else{
                        cell_idx = cell.row;
                    }
                    cell.flex.create('Ghost', {
                        el: cell.flex.selector+' .ogx_flex_cell:eq('+cell_idx+')',
                        'node:OML':{'default:Uxi': __popup}  
                    });  
                    cell.rowel.removeClass('litebottom litetop'); 
                    cell = null;                                
                    __popup.maximize();     
                    __popup.maximize(false);  
                    snapped_programs.push(__popup);                          
                }
            });
        }else{
           this.off(OGX.Popup.MOVE);
           this.off(OGX.Popup.MOVED);
        }
    };

    //@Override
    this.destroy = function(){};

    this.color = function(__val){
        if(typeof __val === 'undefined'){
            return this.data.background.color;
        }
        this.data.background.color = __val;
        this.el.css('background-color', __val);
    };

    this.unsnap = function(__popup){
        let cell = getCellAtPoint(__popup.x +10, __popup.y +10);        
        __popup.detach(); 

        //remove cell or change display
        if(cell.flex.nodes.length > 2){
            cell.flex.removeCell(cell.row);
        }else{
            cell.flex.nodes[cell.row].kill();
            //depends which
            let size = ['100%', '0%'];
            !cell.row ? size.reverse() : null;
            cell.flex.cellSize(size);            
        }

        __popup.icons(__popup.old_icons);
        delete __popup.old_icons;
        __popup.attach(this);
        __popup.uresize(true);
        __popup.drag(true);  
        __popup.maximize(true);
        __popup.normalize();   
        
    };

    //just return sub_flex, row (it will lite up the bottom)
    function getCellAtPoint(__x, __y){
        let els = document.elementsFromPoint(__x, __y);   
        let el, id;
        let o = {flex: null, row: 0, rowel: null};

        //find the cell under
        for(let i = 0; i < els.length; i++){
            el = $(els[i]);
            if(el.hasClass('ogx_flex_cell')){
                //can't be main id                
                id = els[i+1].getAttribute('data-ogx-id');
                if(id === flex.id){
                    return null;
                }     
                o.flex = app.cfind('FlexCells', id);  
                o.row = o.flex.getCellIndex(el.attr('data-cell'));
                o.rowel = el;
                return o;        
            }
        }
        return null;
    }
};