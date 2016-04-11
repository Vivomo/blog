/*global $, spa*/
spa.shell = (function () {
    //----------------- BEGIN MODULE SCOPE VARIABLES ------------
    var configMap = {
            main_html : '<header class="spa-shell-head">'+
                        '    <div class="spa-shell-head-logo"></div>'+
                        '    <div class="spa-shell-head-acct"></div>'+
                        '    <div class="spa-shell-head-search"></div>'+
                        '</header>'+
                        '<section class="spa-shell-main">'+
                        '    <nav class="spa-shell-main-nav"></nav>'+
                        '    <div class="spa-shell-main-content"></div>'+
                        '</section>'+
                        '<footer class="spa-shell-foot"></footer>'+
                        '<section class="spa-shell-chat"></section>'+
                        '<section class="spa-shell-modal"></section>',
            chat_extend_time : 1000,
            chat_retract_time : 300,
            chat_extend_height : 450,
            chat_retract_height : 15
        },
        stateMap = {$container : null},
        jqueryMap = {},
        setJqueryMap, toggleChat, initModule;
    //----------------- END MODULE SCOPE VARIABLES ------------

    //----------------- BEGIN UTILITY METHODS ----------------
    //----------------- END UTILITY METHODS ----------------

    //------------------    BEGIN DOM METHOD ----------------
    // Begin DOM method /setJqueryMap/
    setJqueryMap = function(){
        var $container = stateMap.$container;
        jqueryMap = {
            $container : $container,
            $chat : $container.find('.spa-shell-chat')
        };
    };
    // End DOM method /setJqueryMap/

    //Begin DOM method /toggleChat/
    /**
     * Purpose : Extends or retracts chat slider
     * @param do_extend - true ? extends slider : retracts slider
     * @param callback - optional function to execute at end of animation
     */
    toggleChat = function (do_extend, callback) {
        var px_chat_ht = jqueryMap.$chat.height(),
            is_open = px_chat_ht === configMap.chat_extend_height,
            is_closed = px_chat_ht === configMap.chat_retract_height,
            is_sliding = !is_open && !is_closed;

        //avoid race condition
        if (is_sliding) {
            return false;
        }
        // Begin extend chat slider
        if (do_extend) {
            jqueryMap.$chat.animate({
                height : configMap.chat_extend_height
            }, configMap.chat_extend_time, function () {
                callback && callback(jqueryMap.$chat);
            });
            return true;
        }
        // End extend chat slider

        //Begin retract chat slider
        jqueryMap.$chat.animate({
            height : configMap.chat_retract_height
        }, configMap.chat_extend_time, function () {
            callback && callback(jqueryMap.$chat);
        });
        return true;
        // End retract chat slider
    };
    //End DOM method /toggleChat/

    //------------------    END DOM METHOD ----------------

    //----------------------- BEGIN EVENT HANDLERS---------------------------------
    //----------------------- END EVENT HANDLERS---------------------------------

    //----------------------- BEGIN PUBLIC METHODS---------------------------------
    //Begin public method /initModule/
    initModule = function ($container) {
        // load HTML and map jQuery collections
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();

        // test toggle
        setTimeout(function () {
            toggleChat(true)
        }, 3000);

        setTimeout(function () {
            toggleChat(false)
        }, 8000)
    };
    //End public method /initModule/
    return {initModule : initModule};
    //----------------------- END PUBLIC METHODS---------------------------------
})();