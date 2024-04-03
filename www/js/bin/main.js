let OS;
$(document).ready(() => {
    $(document).on(OGX.App.READY, () => {
        $(document).off(OGX.App.READY);        
    });   
    OS = new OGX.App({
        core: 'OS',
        encrypted: false, 
        disable_context: true,
        unique:(__unique) => {
            if(!__unique){
                $('body').html('<div class="popup_message_center_wrapper"><span class="popup_message_center">An instance is already running in another tab!</span></div>');
                return;
            }
        }
    });
});
