// contentEditable=true 的元素双向绑定的实现
/**
 * E6-8使用onselectionchange(后退,删除,剪切,粘贴,注意它是绑在document上), onkeyup(输入新内容), onfous(开始监听), onblur(中止监听)
 标准浏览器,包括IE9+, 如果支持DOMCharacterDataModified，优先使用DOMCharacterDataModified
 不支持DOMCharacterDataModified的，使用oninput， 比如IE9+就不能使用oninput

 webkit有个事件webkitEditableContentChanged更好

 https://github.com/RubyLouvre/avalon/issues/647
 */
var duplexContenteditable = new function () {
    var useDOMCharacterDataModified = false, target
    if (document.attachEvent && document.addEventListener) {
        document.attachEvent("onselectionchange", function () {
            if (target && target.duplexCallback) {
                target.duplexCallback()
            }
        })
    }
    if ("MutationEvent" in window) {
        var test = document.createElement("div")
        var root = document.body || document.documentElement
        root.appendChild(test)
        test.addEventListener("DOMCharacterDataModified", function (e) {
            useDOMCharacterDataModified = true
        })
        try {
            //http://www.programcreek.com/java-api-examples/index.php?api=org.w3c.dom.events.MutationEvent
            var event = document.createEvent("MutationEvents");
            event.initMutationEvent("DOMCharacterDataModified", true, false, null, "x", "y", null, 0);
            test.dispatchEvent(event)
        } catch (e) {
        }
        setTimeout(function () {
            root.removeChild(test)
        })
    }
    return function (element, callback) {
        function cb() {
            var curValue = element.innerHTML
            if (curValue !== oldValue) {
                oldValue = curValue
                callback.call(element)
            }
        }

        if (element.addEventListener) {
            if (useDOMCharacterDataModified) {//基本上所有浏览器都支持

                if ("WebkitAppearance" in root.style) {
                    // http://code.metager.de/source/xref/WebKit/LayoutTests/fast/events/
                    // https://bugs.webkit.org/show_bug.cgi?id=110742
                    element.addEventListener("webkitEditableContentChanged", cb)
                } else {
                    element.addEventListener("keyup", cb)
                }
                //DOMCharacterDataModified不能监听第一次变动, 需要使用keyup辅助
                element.addEventListener("DOMCharacterDataModified", cb)
            } else {
                element.addEventListener("input", cb)
            }
        } else {
            var oldValue = NaN
            element.attachEvent("onfocus", function (e) {
                target = element
            })
            element.attachEvent("onblur", function (e) {
                target = null
                oldValue = NaN
            })

            element.duplexCallback = cb
            element.attachEvent("onkeyup", cb)
        }
    }
}

// 精简为 现在浏览器版本, 不考虑兼容

var duplexContenteditable2 = function (element, callback) {
    if ("WebkitAppearance" in document.body.style) {
        element.addEventListener("webkitEditableContentChanged", cb)
    } else {
        element.addEventListener("DOMCharacterDataModified", cb)
    }

    function cb() {
        callback.call(element)
    }
}
