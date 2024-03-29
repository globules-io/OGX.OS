let Helper = {};
Helper.getDisplaySettings = function(){
    let o = {};
    o.hardware = {brand:'Nguyen', model:'@AtWork', driver:{version:'Nguyen XperienceMaxx 0.0.1'}}
    o.resolution = [window.innerWidth, window.innerHeight];
    return o;
};
Helper.getDisplayPreferences = function(){
    let o = {};   
    o.background = {mode:'swatch', value:'#2d5cb4'};
    return o;
};