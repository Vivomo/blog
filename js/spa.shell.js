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
            chat_extend_time : 250,
            chat_retract_time : 300,
            chat_extend_height : 450,
            chat_retract_height : 15,
            chat_extended_title : 'Click to retract',
            chat_retracted_title : 'Click to extend'
        },
        stateMap = {
            $container : null,
            is_chat_retracted : true
        },
        jqueryMap = {},
        setJqueryMap, toggleChat, onClickChat, initModule;
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
     * State : sets stateMap.is_chat_retracted
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
                jqueryMap.$chat.attr('title', configMap.chat_extended_title);
                stateMap.is_chat_retracted = false;
                callback && callback(jqueryMap.$chat);
            });
            return true;
        }
        // End extend chat slider

        //Begin retract chat slider
        jqueryMap.$chat.animate({
            height : configMap.chat_retract_height
        }, configMap.chat_extend_time, function () {
            jqueryMap.$chat.attr('title', configMap.chat_retracted_title);
            stateMap.is_chat_retracted = true;
            callback && callback(jqueryMap.$chat);
        });
        return true;
        // End retract chat slider
    };
    //End DOM method /toggleChat/

    //------------------    END DOM METHOD ----------------

    //----------------------- BEGIN EVENT HANDLERS---------------------------------
    onClickChat = function (event) {
        toggleChat( stateMap.is_chat_retracted);
        return false;
    };
    //----------------------- END EVENT HANDLERS---------------------------------

    //----------------------- BEGIN PUBLIC METHODS---------------------------------
    //Begin public method /initModule/
    initModule = function ($container) {
        // load HTML and map jQuery collections
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();

        // test toggle
        stateMap.is_chat_retracted = true;
        jqueryMap.$chat.attr('title', configMap.chat_retracted_title)
            .click(onClickChat);
    };
    //End public method /initModule/
    return {initModule : initModule};
    //----------------------- END PUBLIC METHODS---------------------------------
})();