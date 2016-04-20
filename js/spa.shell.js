/*global $, spa*/
spa.shell = (function () {
    //----------------- BEGIN MODULE SCOPE VARIABLES ------------
    var configMap = {
            anchor_schema_map : {
                chat : {
                    open : true,
                    close : true
                }
            },
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
            anchor_map : {},
            is_chat_retracted : true
        },
        jqueryMap = {},
        copyAnchorMap,
        setJqueryMap, toggleChat,
        changeAnchorPart, onHashchange,
        onClickChat, initModule;
    //----------------- END MODULE SCOPE VARIABLES ------------

    //----------------- BEGIN UTILITY METHODS ----------------
    // Returns copy of stored anchor map; minimizes overhead
    copyAnchorMap = function () {
        return $.extend(true, {}, stateMap.anchor_map);
    };

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
    /**
     * Begin DOM method /changeAnchorPart/
     * Purpose : Change part of URI anchor component
     * Arguments :
     *      * arg_map - The map describing what part of the URI anchor we want change
     * Returns : boolean
     *      * true - the Anchor portion of the URI was update
     *      * false - the Anchor portion of the URI could not be updated
     * Action :
     *      The current anchor rep stored in stateMap.anchor_map.
     *      See uriAnchor for a discussion of encoding
     *      This method
     *          * Created a copy of this map using copyAnchorMap()
     *          * Modifies the key-values using arg_map.
     *          * Manages the distinction between independent
     *              and dependent values in the encoding
     *          * Attempts to change the URI using uirAnchor
     *          * Returns true on success, and false failure.
     */
    changeAnchorPart = function (arg_map) {
        var anchor_map_revise = copyAnchorMap(),
            bool_return = true,
            key_name, key_name_dep;

        // Begin merge changes into anchor map
        for (key_name in arg_map) {
            if ( arg_map.hasOwnProperty(key_name)) {
                // skip dependent keys during iteration
                if (key_name.indexOf('_') === 0) {
                    continue;
                }
                // update matching dependent key
                anchor_map_revise[key_name] = arg_map[key_name];

                // update matching dependent key
                key_name_dep = '_' + key_name;
                if (arg_map[key_name_dep]) {
                    anchor_map_revise[key_name_dep]  = arg_map[key_name_dep];
                } else {
                    delete anchor_map_revise[key_name_dep];
                    delete anchor_map_revise['_s' + key_name_dep];
                }
            }
        }
        // End merge changes into anchor map

        //Begin attempt to update URI; revert if not successful
        try {
            $.uriAnchor.setAnchor( anchor_map_revise);
        } catch (error) {
            // replace URI with existing state
            $.uriAnchor.setAnchor( stateMap.anchor_map, null, true);
            bool_return = false;

        }
        return bool_return;

    };
    // End DOM method /changeAnchorPart/
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
    /**
     * Begin Event handler /onHashchange/
     * Purpose : Handles the hashchange event
     * @Action
     *      * Parses the URI anchor component
     *      * Compares proposed application state with current
     *      * Adjust the application only where proposed state differs from existing
     * @param event
     */
    onHashchange = function (event) {
        var anchor_map_previous = copyAnchorMap(),
            anchor_map_proposed,
            _s_chat_previous, _s_chat_proposed,s_chat_proposed;
        // atttempt to parse anchor
        try {
            anchor_map_proposed = $.uriAnchor.makeAnchorMap();
        } catch (error) {
            $.uriAnchor.setAnchor(anchor_map_previous, null, true);
            return false;
        }

        stateMap.anchor_map = anchor_map_proposed;

        //convenience vars
        _s_chat_previous = anchor_map_previous._s_chat;
        _s_chat_proposed = anchor_map_proposed._s_chat;

        // Begin adjust chat component if changed
        if ( !anchor_map_previous || _s_chat_previous !== _s_chat_proposed) {
            s_chat_proposed = anchor_map_proposed.chat;
            switch (s_chat_proposed) {
                case 'open' :
                    toggleChat(true);
                    break;
                case 'closed' :
                    toggleChat(false);
                    break;
                default :
                    toggleChat(false);
                    delete anchor_map_proposed.chat;
                    $.uriAnchor.setAnchor( anchor_map_proposed, null, true);
            }
        }
        return false;
    };
    onClickChat = function (event) {
        changeAnchorPart({
            chat : stateMap.is_chat_retracted ? 'open' : 'close'
        });
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

        // configure uriAnchor to use our schema
        $.uriAnchor.configModule({
            schema_map : configMap.anchor_schema_map
        });
        /**
         * Handle URI anchor change events
         * This is done /after/ all feature modules are configured
         * and initialized, otherwise they will not be ready to handle
         * the trigger event, which is used to ensure the anchor
         * is considered on-load
         */

        $(window).bind('hashchange', onHashchange)
            .trigger('hashchange');
    };
    //End public method /initModule/
    return {initModule : initModule};
    //----------------------- END PUBLIC METHODS---------------------------------
})();