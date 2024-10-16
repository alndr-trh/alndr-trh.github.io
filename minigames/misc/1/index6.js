!function() {
    function base64toArrayBuffer(_) {
        var e = window.atob(_.substring(_.indexOf(",") + 1));
        let o = e.length;
        for (var a = new Uint8Array(o); o--; )
            a[o] = e.charCodeAt(o);
        return a.buffer
    }
    function __adapter_unzip() {
        console.time("load resource");
        try {
            var _ = base64toArrayBuffer(window.__adapter_zip__)
              , e = pako.inflate(_, {
                to: "string"
            });
            window.__adapter_resource__ = JSON.parse(e),
            __adapter_exec_js()
        } catch (_) {
            throw console.error(_),
            _
        }
        console.timeEnd("load resource")
    }
    function __adapter_exec_js() {
        window.__adapter_js__ = {};
        for (const e in window.__adapter_resource__) {
            var _ = e.split(".");
            "js" === _[_.length - 1] && (window.__adapter_js__[e] = window.__adapter_resource__[e])
        }
        __adapter_success()
    }
    function __adapter_console() {
        window.__adapter_js__["vconsole.min.js"] && (eval(window.__adapter_js__["vconsole.min.js"]),
        delete window.__adapter_js__["vconsole.min.js"],
        window.VConsole) && (window.vConsole = new VConsole)
    }
    function __adapter_success() {
        __adapter_console(),
        window.__adapter_init && window.__adapter_init()
    }
    window.pako ? __adapter_unzip() : __adapter_exec_js()
}();
