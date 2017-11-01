define('lib/editor', function () {

    var editor = function (cfg) {
        if (!this instanceof editor) {
            return new editor(cfg)
        }
        $.extend(this.cfg, cfg);
        this.init();
    };

    editor.prototype = {
        constructor : editor,
        textLength : 0,
        setTextLength : function(num){
            var me = this;
            me.textLength = num;
            me.$textLength.text(num);
            if (me.cfg.counter) {
                if (num > this.cfg.maxTextLength) {
                    me.$counter.addClass('error').find('#error-msg').text('内容字数已超过'+(num - this.cfg.maxTextLength));
                } else {
                    me.$counter.removeClass('error');
                }
            }
        },
        cfg: {
            change : null,
            maxTextLength : 50000,
            selector : '.editor-wrap',
            rangeId: 'editor-range',
            videoSupport: true,
            imageUploadDomain : 'http://img.saihuitong.com/',
            imageUpToken : '/m/rest/upload/img/token',
            imageUploadId : 'editor-upload-img',
            videoUploadId : 'editor-upload-video',
            videoUploadDomain : 'http://v.saihuitong.com/',
            videoUpToken : '/m/rest/bbs/upload/token/forum',
            videoTokenData : null, //获取token
            vGetUpTokenCallback : null, //获取token的回调
            counter: true //计数器
        },
        init: function () {
            var me = this,
                config = me.cfg;
            var $obj = me.$obj = $(config.selector);
            if ($obj.length == 0) {
                console.error('There is no selector "' + config.selector + '" for editor');
                return false;
            }

            $obj.append('<div class="simpleEditor" contenteditable="true"></div>');
            var $editor = me.$editor = me.$obj.find('.simpleEditor');
            me.historyText = me.getText();
            me.historyHtml = me.getContent();

            if (config.counter) {
                $obj.append('<div class="editor-counter"><span id="textLength">0</span>/<span id="max-length">' +
                    config.maxTextLength + '</span><span id="error-msg" class="fr error"></span></div>');
                me.$textLength = $('#textLength');
                me.$counter = $('.editor-counter');

                //change div做的编辑器不支持原生change方法 手机第三方输入法不触发keyup事件
                setInterval(function(){
                    var html = me.getContent();
                    if (html != me.historyHtml) {
                        me.historyHtml = html;
                        me.setTextLength(html.length);
                    }
                },300);
            }

            //toolbar
            $obj.append('<ul class="editor-toolbar">' +
                            '<li><a href="javascript:" class="upload-img c9" id="editor-upload-img">' +
                                '<i class="icon icon-photo f30"></i></a></li>' +
                            uploadVideoHtml() +
                        '</ul>');
            function uploadVideoHtml() {
                return config.videoSupport ? ( '<li><a href="javascript:" class="upload-video c9" id="editor-upload-video">' +
                '<i class="icon icon-video f30"></i></a></li>') : '';
            }
            //记录光标
            $editor.blur(function () {
                try {
                    var range = window.getSelection().getRangeAt(0);
                    var tempNode = $('<span id="editor-range"></span>')[0];
                    range.insertNode(tempNode);
                } catch (e) {}

            });
            //移除历史光标
            $editor.focus(function(){
                $(this).find('#editor-range').remove()
            });

            setTimeout(function () {
                if (!window.Qiniu) {
                    console.error('缺少上传js')
                    return;
                }
                var imageUploader = Qiniu.uploader({
                    browse_button: config.imageUploadId,
                    domain: config.imageUploadDomain,
                    uptoken_url: config.imageUpToken,
                    multi_selection : false,
                    filters: {
                        mime_types : '',
                        max_file_size: "30mb",
                        prevent_duplicates: true
                    },
                    init: {
                        FilesAdded: function(up, files) {
                            files.forEach(function (file) {
                                me.insertMedia(file.id, 'image')
                            })
                        },
                        FileUploaded: function(up, file, info) {
                            var result = JSON.parse(info);
                            var src = config.imageUploadDomain + result.key;
                            $editor.find('#'+file.id).html('<img src="'+src+'">');
                        }
                    }
                });
                
                if (!config.videoSupport) {
                    return;
                }
                var videoUploader = Qiniu.uploader({
                    browse_button: config.videoUploadId,
                    domain: config.videoUploadDomain,
                    uptoken_url: config.videoUpToken,
                    getTokenData : config.videoTokenData,
                    getUpTokenCallback : config.vGetUpTokenCallback,
                    multi_selection: false,
                    max_file_size: "100mb",
                    filters: {
                        mime_types : [{title : "Video files", extensions : "flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4"}],
                        // mime_types : '',
                        max_file_size: "100mb",
                        prevent_duplicates: true
                    },
                    init: {
                        FilesAdded: function(up, files) {
                            files.forEach(function (file) {
                                me.insertMedia(file.id, 'video')
                            })
                        },
                        FileUploaded: function(up, file, info) {
                            var result = JSON.parse(info);
                            me.videoUploaded(file.id, {
                                src : config.videoUploadDomain + result.key
                            });
                            //$editor.find('#'+file.id).html('<i class="icon icon-video"></i><img src="'+src+'?vframe/jpg/offset/5/w/540/h/300">');
                        }
                    }
                })
            }, 1)
        },
        find : function(selector){
            return this.$obj.find(selector);
        },
        html : function (str) {
            return this.$editor.html(str || void 0)
        },
        getContent: function () {
            return this.$editor.html();
        },
        getText: function () {
            return this.$editor.text();
        },
        isUploaded : function () {
            return this.$editor.find('.j-loading-media').length == 0;
        },
        getError: function() {
            var $errorInfo = this.find('#error-msg');
            if ($errorInfo.css('visibility') == 'visible') {
                return $errorInfo.text()
            }
            return "";
        },
        /**
         * 在上次失去焦点的地方插入内容, 如果没有则在尾部插入
         */
        insert: function (html) {
            var me = this;
            var $range = me.$editor.find('#editor-range');
            if ($range.length != 0) {
                $range.before($(html))
            } else {
                me.$editor.append($(html));
            }
        },
        insertMedia: function(id, type){
            if (type == 'image') {
                this.insert('<span id="'+id+'"><i class="icon icon-photo j-loading-media"></i></span>')
            } else if(type == 'video') {
                this.insert('<br><span id="'+id+'" class="editor-video-wrap"><i class="icon icon-video j-loading-media"></i></span><br>')
            }
        },
        videoUploaded : function (id, data) {
            this.find('#'+id).html('<video src="'+data.src+'" poster="'+data.src+

                '?vframe/jpg/offset/5/w/540" controls style="width:100%; min-width:600px;margin-top:20px; min-height: 380px; background-color:#000;"></video><br>');
/*            var cover = new Image,
                iconImg = new Image;
            cover.src = data.src;
            iconImg.src = '/res/m/img/video-icon.png';
            var canvas = $('.'+id)[0];
            var cxt = canvas.getContext('2d');
            cover.onload = function () {
                cxt.drawImage(cover, 0, 0);
                cxt.drawImage(iconImg, 225, 115)
            };*/
        }
    };

    return editor;
});
