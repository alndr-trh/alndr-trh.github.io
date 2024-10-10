"use strict";
window.__adapter_init = function() {
    function base64ToBlob(e, t) {
        e = e.split(",");
        let r = t;
        2 === e.length && (n = e.shift(),
        a = new RegExp(":(.*?);"),
        n = n.match(a),
        r = (n && 1 < n.length ? n[1] : t) || t);
        var a = e.shift()
          , o = window.atob(a)
          , n = new ArrayBuffer(o.length)
          , _ = new Uint8Array(n);
        for (let e = 0; e < o.length; e++)
            _[e] = o.charCodeAt(e);
        return new Blob([n],{
            type: r
        })
    }
    function base64toArrayBuffer(e) {
        var t = window.atob(e.substring(e.indexOf(",") + 1));
        let r = t.length;
        for (var a = new Uint8Array(r); r--; )
            a[r] = t.charCodeAt(r);
        return a.buffer
    }
    class AdapterFetch {
        constructor() {
            this.response = null,
            this.status = 200,
            this.responseType = "",
            this.onload = function() {
                console.log("onload")
            }
        }
        open(e, t) {
            var r = __adapter_get_resource(t);
            r ? this.response = r : console.log("res", r, t)
        }
        send() {
            switch (this.responseType) {
            case "json":
                this.response = JSON.parse(this.response);
                break;
            case "text":
                this.response = this.response;
                break;
            case "arraybuffer":
                this.response = base64toArrayBuffer(this.response);
                break;
            default:
                this.response = this.response
            }
            this.onload()
        }
    }
    function __adapter_eval(name) {
        window.__adapter_js__[name] ? (eval(window.__adapter_js__[name]),
        delete window.__adapter_js__[name]) : console.warn("window.__adapter_js__ is not found ", name)
    }
    function __adapter_get_base_url() {
        var e = "undefined" != typeof document;
        let t;
        return (t = e && (e = document.querySelector("base[href]")) ? e.href : t) || "undefined" == typeof location || -1 !== (e = (t = location.href.split("#")[0].split("?")[0]).lastIndexOf("/")) && (t = t.slice(0, e + 1)),
        t || ""
    }
    function __adapter_get_res_path(e, t) {
        if (t[e])
            return e;
        for (var r in t) {
            var a = e.indexOf(r);
            if (-1 !== a && a + r.length === e.length)
                return r
        }
        return null
    }
    function __adapter_get_resource(e) {
        return window.__adapter_resource__[__adapter_get_res_path(e, window.__adapter_resource__)]
    }
    function __adapter_get_imports() {
        return JSON.parse(__adapter_get_resource("src/import-map.json")).imports
    }
    function __adapter_get_script(e) {
        if (-1 !== e.indexOf("bullet.wasm"))
            for (var t in window.__adapter_js__)
                if (-1 !== t.indexOf("bullet.cocos")) {
                    e = t;
                    break
                }
        var r = __adapter_get_res_path(e, window.__adapter_js__)
          , a = window.__adapter_js__[r];
        return a && delete window.__adapter_js__[r],
        a
    }
    function __adapter_init_http() {
        window.adapterFetch = AdapterFetch;
        const a = window.fetch;
        window.fetch = function(t, e) {
            const r = __adapter_get_resource(t);
            if (r) {
                let e = {
                    ok: !0,
                    status: 200,
                    statusText: "OK",
                    headers: {
                        get: function(e) {
                            if ("content-type" === e) {
                                if (-1 !== t.indexOf(".json"))
                                    return "application/json";
                                if (-1 !== t.indexOf(".css"))
                                    return "text/css";
                                if (-1 !== t.indexOf(".wasm"))
                                    return "application/wasm"
                            }
                            return "application/javascript"
                        }
                    },
                    url: t,
                    clone: function() {
                        return e
                    },
                    text: function() {
                        return Promise.resolve(r)
                    },
                    json: function() {
                        return Promise.resolve(JSON.parse(r))
                    },
                    arrayBuffer: function() {
                        return Promise.resolve(base64toArrayBuffer(r))
                    }
                };
                return Promise.resolve(e)
            }
            return a(t, e)
        }
    }
    function __adapter_init_js() {
        const r = System.__proto__.createScript;
        System.__proto__.createScript = function(e) {
            var t = __adapter_get_script(e.replace(__adapter_get_base_url(), ""));
            return t ? (t = new Blob([t],{
                type: "text/javascript"
            }),
            r.call(this, URL.createObjectURL(t))) : (console.error(e + " 找不到资源"),
            r.call(this, e))
        }
    }
    function __adapter_init_cc() {
        if (!window.__adapter_cc_initialized__) {
            if (window.__adapter_cc_initialized__ = !0,
            cc.internal.VideoPlayerImplManager) {
                const getImpl = cc.internal.VideoPlayerImplManager.getImpl;
                cc.internal.VideoPlayerImplManager.getImpl = function(e) {
                    e = getImpl.call(this, e);
                    const r = e.createVideoPlayer;
                    return e.createVideoPlayer = function(e) {
                        var t = __adapter_get_resource(e);
                        return t ? (t = base64ToBlob(t),
                        t = URL.createObjectURL(t),
                        r.call(this, t)) : r.call(this, e)
                    }
                    ,
                    e
                }
            }
            const downloaderList = {
                ".js": loadScript,
                ".font": loadFont,
                ".eot": loadFont,
                ".ttf": loadFont,
                ".woff": loadFont,
                ".svg": loadFont,
                ".ttc": loadFont,
                ".png": loadImage,
                ".jpg": loadImage,
                ".bmp": loadImage,
                ".jpeg": loadImage,
                ".gif": loadImage,
                ".ico": loadImage,
                ".tiff": loadImage,
                ".webp": loadImage,
                ".image": loadImage,
                ".mp4": loadVideo,
                ".avi": loadVideo,
                ".mov": loadVideo,
                ".mpg": loadVideo,
                ".mpeg": loadVideo,
                ".rm": loadVideo,
                ".rmvb": loadVideo,
                ".txt": loadText,
                ".xml": loadText,
                ".vsh": loadText,
                ".fsh": loadText,
                ".atlas": loadText,
                ".tmx": loadText,
                ".tsx": loadText,
                ".plist": loadText,
                ".fnt": loadText,
                ".pvr": loadArrayBuffer,
                ".pkm": loadArrayBuffer,
                ".astc": loadArrayBuffer,
                ".binary": loadArrayBuffer,
                ".bin": loadArrayBuffer,
                ".dbbin": loadArrayBuffer,
                ".skel": loadArrayBuffer,
                bundle: loadBundle,
                default: loadText
            };
            function loadScript(url, options, onComplete) {
                let scriptStr = __adapter_get_resource(url);
                scriptStr || console.error(url + " isn't load"),
                eval(scriptStr),
                onComplete && onComplete(null)
            }
            function loadJson(e, t, r) {
                r(null, JSON.parse(__adapter_get_resource(e)))
            }
            function loadBundle(r, e, a) {
                var t = new RegExp("^(?:w+://|.+/).+")
                  , o = cc.path.basename(r)
                  , t = (t.test(r) || (r = "assets/" + o),
                e.version || cc.assetManager.downloader.bundleVers[o]);
                let n = 0
                  , _ = null
                  , s = null;
                loadJson(r + `/config.${t ? t + "." : ""}json`, e, function(e, t) {
                    e && (s = e),
                    (_ = t) && (_.base = r + "/"),
                    2 === ++n && a && a(s, _)
                }),
                loadScript(r + `/index.${t ? t + "." : ""}js`, e, function(e) {
                    e && (s = e),
                    2 === ++n && a && a(s, _)
                })
            }
            function loadFont(e, t, r) {
                const a = e.split("/").pop().split(".")[0];
                var o = __adapter_get_resource(e);
                null == o ? r() : (o = new FontFace(a,"url(" + o + ")"),
                document.fonts.add(o),
                o.load(),
                o.loaded.then(function() {
                    r(null, a)
                }, function() {
                    console.error("url(" + e + ") load fail"),
                    r(null, a)
                }))
            }
            function loadImage(e, t, r) {
                var a = __adapter_get_resource(e);
                a || console.error(e + " isn't load");
                let o = new Image;
                const n = function() {
                    o.removeEventListener("load", n),
                    o.removeEventListener("error", _),
                    r && r(null, o)
                }
                  , _ = function() {
                    o.removeEventListener("load", n),
                    o.removeEventListener("error", _),
                    r && r(new Error(cc.debug.getError(4930, e)))
                };
                return o.addEventListener("load", n),
                o.addEventListener("error", _),
                o.src = a,
                o
            }
            function loadVideo(e, t, r) {
                var a = document.createElement("video")
                  , o = document.createElement("source")
                  , n = (a.appendChild(o),
                __adapter_get_resource(e));
                n ? (n = base64ToBlob(n),
                n = URL.createObjectURL(n),
                o.src = n,
                r(null, a)) : r(new Error(e + "(no response)"))
            }
            function loadText(e, t, r) {
                t.responseType = "text",
                r(null, __adapter_get_resource(e))
            }
            function loadArrayBuffer(e, t, r) {
                r(null, base64toArrayBuffer(__adapter_get_resource(e)))
            }
            cc.assetManager.downloader.downloadScript = loadScript,
            Object.keys(downloaderList).forEach(e => {
                cc.assetManager.downloader.register(e, downloaderList[e])
            }
            )
        }
    }
    function __adapter_init_plugins() {
        window.__adapter_plugins__ && 0 !== window.__adapter_plugins__.length && window.__adapter_plugins__.forEach(e => {
            __adapter_eval("src/" + e)
        }
        )
    }
    function __adapter_get_path(e) {
        for (var t in window.__adapter_resource__)
            if (0 == t.indexOf(e))
                return t;
        throw Error("no find " + e)
    }
    __adapter_init_http(),
    console.log('adapter init http successfully passed!'),
    __adapter_eval(__adapter_get_path("src/polyfills.bundle")),
    console.log('adapter eval polyfills successfully passed!'),
    __adapter_eval(__adapter_get_path("src/system.bundle")),
    console.log('adapter eval system successfully passed!'),
    __adapter_init_js(),
    console.log('adapter init js successfully passed!');
    let prepareLoad = Promise.resolve();
    const importsKeys = Object.keys(__adapter_get_imports());
    for (let index = importsKeys.length - 1; 0 <= index; index--) {
        const key = importsKeys[index];
        prepareLoad = prepareLoad.then( () => System.import(key).catch(e => {
            console.error(e)
        }
        ))
    }
    prepareLoad.then( () => {
        __adapter_init_cc(),
        console.log('adapter init cc successfully passed!'),
        __adapter_init_plugins(),
        console.log('adapter init plugins successfully passed!'),
        System.import("./" + __adapter_get_path("index")).catch(e => {
            console.error(e)
        }
        )
    }
    )
}
;
