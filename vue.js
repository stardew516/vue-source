/*!
 * Vue.js v2.1.10
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.Vue = factory());
}(this, (function() {
    'use strict';

    /*  */

    /**
     * Convert a value to a string that is actually rendered.
     * 作用: 把val转为string类型 ??? 为什么用== 不用 ===
     * 参数:
     * var: 需要转化的值
     */
    function _toString(val) {
        return val == null ?
            '' :
            typeof val === 'object' ?
            JSON.stringify(val, null, 2) :
            String(val)
    }

    /**
     * Convert a input value to a number for persistence.
     * If the conversion fails, return original string.
     * 作用: 把val转为number, 若失败, 直接返回原值
     * 参数:
     * val: 需要转化的值
     */
    function toNumber(val) {
        var n = parseFloat(val);
        return isNaN(n) ? val : n
    }

    /**
     * Make a map and return a function for checking if a key
     * is in that map.
     * 作用: 根据str, 生成一个map, 然后返回一个方法, 这个方法的作用是, 判断一个值是否在这个生成的map中.
     * 参数:
     * str: 用来生成map的字符串, 用','隔开
     * expectsLowerCase: 是否转小写
     *
     * eg: ?????
     */
    function makeMap(
        str,
        expectsLowerCase
    ) {
        var map = Object.create(null); // map: Object {}
        var list = str.split(',');
        for (var i = 0; i < list.length; i++) {
            map[list[i]] = true;
        }
        return expectsLowerCase ?

            function(val) { return map[val.toLowerCase()]; } :
            function(val) { return map[val]; }
    }

    /**
     * Check if a tag is a built-in tag.
     * 作用: 判断某个tag是否是slot, component
     */
    var isBuiltInTag = makeMap('slot,component', true);

    /**
     * Remove an item from an array
     * 作用: 数组中删除一项
     * 参数:
     * arr: 数组
     * item: 需要删除的项
     */
    function remove$1(arr, item) {
        if (arr.length) {
            var index = arr.indexOf(item);
            if (index > -1) {
                return arr.splice(index, 1)
            }
        }
    }

    /**
     * Check whether the object has the property.
     * 作用: 判断对象中是否存在某个自有属性
     * 参数:
     * obj: 对象
     * key: 属性
     */
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function hasOwn(obj, key) {
        return hasOwnProperty.call(obj, key)
    }

    /**
     * Check if value is primitive
     * 作用: 判断value是不是原始值(string, number)
     * 参数:
     * value: 需要判断的值
     * PS: 基本数据类型: Boolean, Number, String, undefined, null
     */
    function isPrimitive(value) {
        return typeof value === 'string' || typeof value === 'number'
    }

    /**
     * Create a cached version of a pure function.
     * 作用: ????
     * eg: var fn = function () {console.log(123)}
     * cached (fn)()
     * // output: 123
     */
    function cached(fn) {
        var cache = Object.create(null);
        return (function cachedFn(str) {
            var hit = cache[str];
            return hit || (cache[str] = fn(str))
        })
    }

    /**
     * Camelize a hyphen-delimited string.
     * 作用: 连字符转换为驼峰式
     * 参数:
     * camelizeRE: 横杠连字符
     * str: 字符串
     * eg: camelize("a-b-c")
     * // output: "aBC"
     */
    var camelizeRE = /-(\w)/g; // '-字符'
    var camelize = cached(function(str) {
        return str.replace(camelizeRE, function(_, c) { return c ? c.toUpperCase() : ''; })
    });

    /**
     * Capitalize a string.
     * 作用: 字符串首字母大写
     * eg: capitalize("abc")
     * // output: "Abc"
     */
    var capitalize = cached(function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    });

    /**
     * Hyphenate a camelCase string.
     * 作用: 大写转换成连字符
     * 参数:
     * hyphenateRE: 没有或有一个仅连着大写字符的'-' + 大写字符
     * eg: hyphenate("ABC")
     * // output: "a-b-c"
     */
    var hyphenateRE = /([^-])([A-Z])/g;
    var hyphenate = cached(function(str) {
        return str
            .replace(hyphenateRE, '$1-$2')
            .replace(hyphenateRE, '$1-$2')
            .toLowerCase()
    });

    /**
     * Simple bind, faster than native
     * 作用: 绑定bind, 比原生的快?????
     * 参数:
     * fn:
     * ctx:
     * eg: var fn = function () {console.log(arguments)}
     * bind$1(fn, {})(1,2)
     * // output: [1, 2]
     */
    function bind$1(fn, ctx) {
        function boundFn(a) {
            var l = arguments.length;
            // 不同参数个数的情况
            return l ?
                l > 1 ?
                fn.apply(ctx, arguments) :
                fn.call(ctx, a) :
                fn.call(ctx)
        }
        // record original fn length
        boundFn._length = fn.length;
        return boundFn
    }

    /**
     * Convert an Array-like object to a real Array.
     * 作用: 类数组转化为数组, 有截取功能
     * 参数:
     * list: 类数组
     * start: 开始位置
     * eg: toArray ([1,2,3,4,5,6], 3)
     * // output: [4, 5, 6]
     */
    function toArray(list, start) {
        start = start || 0;
        var i = list.length - start;
        var ret = new Array(i);
        while (i--) {
            ret[i] = list[i + start];
        }
        return ret
    }

    /**
     * Mix properties into target object.
     * 作用: 合并两个对象
     * 参数:
     * to: 目标对象
     * _from: 源对象
     */
    function extend(to, _from) {
        for (var key in _from) {
            to[key] = _from[key];
        }
        return to
    }

    /**
     * Quick object check - this is primarily used to tell
     * Objects from primitive values when we know the value
     * is a JSON-compliant type.
     * 作用: 快速检测是否为对象
     * 参数:
     * obj: 需要判断的数据
     */
    function isObject(obj) {
        return obj !== null && typeof obj === 'object'
    }

    /**
     * Strict object type check. Only returns true
     * for plain JavaScript objects.
     * 作用: 判断是否是纯粹的对象
     * 参数:
     * toString: 对象转字符串
     * eg: isPlainObject({a:1})
     * // output: true
     * isPlainObject([1,2])
     * output: false
     */
    var toString = Object.prototype.toString;
    var OBJECT_STRING = '[object Object]';

    function isPlainObject(obj) {
        return toString.call(obj) === OBJECT_STRING
    }

    /**
     * Merge an Array of Objects into a single Object.
     * 作用: 把对象数组合并到对象中
     * eg: toObject([{a:1,b:2,c:3,d:4}])
     * // output: Object {a: 1, b: 2, c: 3, d: 4}
     */
    function toObject(arr) {
        var res = {};
        for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
                extend(res, arr[i]);
            }
        }
        return res
    }

    /**
     * Perform no operation.
     * 作用: 空方法
     */
    function noop() {}

    /**
     * Always return false.
     * 作用: 返回false
     */
    var no = function() { return false; };

    /**
     * Return same value
     * 作用: 返回原本参数
     */
    var identity = function(_) { return _; };

    /**
     * Generate a static keys string from compiler modules.
     * 作用: 提取staticKeys值, 生成一个静态string类型的key ???
     * 参数:
     * reduce: 可以实现一个累加器的功能, 将数组的每个值（从左到右）将其降低到一个值.
     * eg: 求数组中同一元素的个数
     *  var arr = ['apple', 'orange', 'apple', 'orange', 'pear', 'orange'];
     *  function count(){
     *    return arr.reduce(function (key, m) {
     *      console.log('key', key, 'm', m);
     *        key[m] = (key[m] + 1) || 1;
     *        return key;
     *    },{});
     *  }
     *  // output:
     * key Object {} | m apple
     * key Object {apple: 1} m | orange
     * key Object {apple: 1, orange: 1} m | apple
     * key Object {apple: 2, orange: 1} m | orange
     * key Object {apple: 2, orange: 2} m | pear
     * key Object {apple: 2, orange: 2, pear: 1} m | orange
     * Object {apple: 2, orange: 3, pear: 1}
     *  参数: key为对象   m为元素
     * eg:
     * var modules = [
     * {
     *   staticKeys: ['staticClass'],
     *   a: 2
     * },
     * {
     *   staticKeys: ['staticStyle'],
     *   a: 3
     * }
     * ];
     * function genStaticKeys (modules) {
     *   return modules.reduce(function (keys, m) {
     *     return keys.concat(m.staticKeys || [])
     *   }, []).join(',')
     * }
     * genStaticKeys(modules);
     * // output: "staticClass,staticStyle"
     */
    function genStaticKeys(modules) {
        return modules.reduce(function(keys, m) {
            return keys.concat(m.staticKeys || [])
        }, []).join(',')
    }

    /**
     * Check if two values are loosely equal - that is,
     * if they are plain objects, do they have the same shape?
     * 作用: 判断两个值是否松散相等
     * 参数:
     * a, b: 两个需要比较的值
     */
    function looseEqual(a, b) {
        var isObjectA = isObject(a);
        var isObjectB = isObject(b);
        if (isObjectA && isObjectB) {
            // 对象核心是这句
            return JSON.stringify(a) === JSON.stringify(b)
        } else if (!isObjectA && !isObjectB) {
            // 其它核心是这句
            return String(a) === String(b)
        } else {
            return false
        }
    }

    /**
     * 作用: 判断数组是否包含某个值, 若包含返回其位置, 否则返回-1
     * 参数:
     * arr: 数组
     * val: 需要查找的值
     */
    function looseIndexOf(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (looseEqual(arr[i], val)) { return i }
        }
        return -1
    }

    /**
     * 作用: 一些基本配置信息
     */

    var config = {
        /**
         * Option merge strategies (used in core/util/options)
         * core/util/options 的选项合并策略
         */
        optionMergeStrategies: Object.create(null),

        /**
         * Whether to suppress warnings.
         * 是否抑制警告
         */
        silent: false,

        /**
         * Whether to enable devtools
         * 是否启用开发者模式 ??? "development" !== 'production'为什么单双引号
         */
        devtools: "development" !== 'production',

        /**
         * Error handler for watcher errors
         * 监控错误的错误处理
         */
        errorHandler: null,

        /**
         * Ignore certain custom elements
         * 忽略某些自定义元素
         */
        ignoredElements: [],

        /**
         * Custom user key aliases for v-on
         * v-on的自定义用户键别名
         */
        keyCodes: Object.create(null),

        /**
         * Check if a tag is reserved so that it cannot be registered as a
         * component. This is platform-dependent and may be overwritten.
         * 检测一个标签是否是保留字, 若是, 则不能被注册为组件. 与平台相关,可以被重写.
         */
        isReservedTag: no,

        /**
         * Check if a tag is an unknown element.
         * Platform-dependent.
         * 检查某个标签是否为未知元素, 依赖平台.
         */
        isUnknownElement: no,

        /**
         * Get the namespace of an element
         * 获取元素的命名空间
         */
        getTagNamespace: noop,

        /**
         * Parse the real tag name for the specific platform.
         * 解析特定平台的真实标签名
         */
        parsePlatformTagName: identity,

        /**
         * Check if an attribute must be bound using property, e.g. value
         * Platform-dependent.
         * 检查某个属性是否必须绑定使用属性, 例如: 值, 依赖平台.
         */
        mustUseProp: no,

        /**
         * List of asset types that a component can own.
         * 组件可以拥有的资产类型列表
         */
        _assetTypes: [
            'component',
            'directive',
            'filter'
        ],

        /**
         * List of lifecycle hooks.
         * 生命周期钩子: http://cn.vuejs.org/images/lifecycle.png
         * 参数:
         * beforeCreate: 组件实例刚被创建, 组件属性计算之前, 如data属性等
         * created: 组件实例创建完成, 属性已绑定, 但dom未生成$el属性还不存在
         * beforeMount: 模板编译/挂载之前
         * mounted: 模板编译/挂载之后 (不保证组件已经在document中)
         * beforeUpdate: 组件更新之前
         * updated: 组件更新之后
         * beforeDestroy: 组件销毁前调用
         * destroyed: 组件销毁后调用
         * activated: for keep-alive, 组件被激活时调用
         * deactivated: for keep-alive, 组件被移出时调用
         */

        _lifecycleHooks: [
            'beforeCreate',
            'created',
            'beforeMount',
            'mounted',
            'beforeUpdate',
            'updated',
            'beforeDestroy',
            'destroyed',
            'activated',
            'deactivated'
        ],

        /**
         * Max circular updates allowed in a scheduler flush cycle.
         * 调度程序刷新周期中允许的最大循环更新数目
         */
        _maxUpdateCount: 100
    };

    /*  */

    /**
     * Check if a string starts with $ or _
     * 作用: 判断字符串是否以$或_开头
     */
    function isReserved(str) {
        var c = (str + '').charCodeAt(0);
        return c === 0x24 || c === 0x5F
    }

    /**
     * Define a property.
     * 作用: 定义一个对象属性, 将参数中属性添加到obj中
     * 参数:
     * Object.defineProperty: 将属性添加到对象, 或修改现有属性的特性.
     * obj: 需要添加或修改的对象
     * key: 属性名称
     * val: 需要修改的值
     * enumerable: 是否可枚举
     */
    function def(obj, key, val, enumerable) {
        Object.defineProperty(obj, key, {
            value: val,
            enumerable: !!enumerable,
            writable: true,
            configurable: true
        });
    }

    /**
     * Parse simple path.
     * 作用: 解析路径, 返回对象
     */
    var bailRE = /[^\w.$]/; // 有空格的字符串
    function parsePath(path) {
        if (bailRE.test(path)) {
            return
        } else {
            var segments = path.split('.');
            return function(obj) {
                for (var i = 0; i < segments.length; i++) {
                    if (!obj) { return }
                    obj = obj[segments[i]];
                }
                return obj
            }
        }
    }

    /*  */
    /**
     *  globals MutationObserver
     *  全局 变化观察
     */

    // can we use __proto__? 能否使用__proto__
    var hasProto = '__proto__' in {};

    // Browser environment sniffing 浏览器环境探测
    // 是否在浏览器中
    var inBrowser = typeof window !== 'undefined';
    // 用户的userAgent
    var UA = inBrowser && window.navigator.userAgent.toLowerCase();
    // 是否是ie
    var isIE = UA && /msie|trident/.test(UA);
    // 是否是ie9
    var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
    // 是否是ieedge
    var isEdge = UA && UA.indexOf('edge/') > 0;
    // 是否是安卓
    var isAndroid = UA && UA.indexOf('android') > 0;
    // 是否是ios
    var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);

    // this needs to be lazy-evaled because vue may be required before
    // vue-server-renderer can set VUE_ENV
    // 在vue-server-renderer设置VUE_ENV之前, 就需要vue, 所以需要评估延迟.
    var _isServer;
    // 是否是服务端渲染
    var isServerRendering = function() {
        if (_isServer === undefined) {
            /* istanbul ignore if */
            /**
             *  istanbul ignore if
             *  Istanbul 是 JavaScript 程序的代码覆盖率工具
             *  忽略if
             */
            if (!inBrowser && typeof global !== 'undefined') {
                // detect presence of vue-server-renderer and avoid
                // 检测是否有vue-server-renderer, 若存在, 则避免
                // Webpack shimming the process
                // webpack的shimming过程
                // shimming: 解决兼容性问题
                _isServer = global['process'].env.VUE_ENV === 'server';
            } else {
                _isServer = false;
            }
        }
        return _isServer
    };

    // detect devtools
    /**
     * 检测开发者工具, 浏览器是否安装vue开发者工具
     * eg: , !!window.__VUE_DEVTOOLS_GLOBAL_HOOK__
     * 我的chrome安装了, 输出 // output: true
     * safari没有安装, 输出 //output: false
     */
    var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

    /* istanbul ignore next */
    /**
     * istanbul ignore next
     * 作用: 在文件首行加入 /*istanbul ignore next* /, 这样就可以忽略整个文件.
     * 忽略多个文件: `/* istanbul ignore next * /`(*后面故意加个空格, 注释方便)
     *
     */

    /**
     * 作用: 判断是否是原生存在的
     * eg: isNative(Promise) && isNative(MutationObserver) && isNative(Set)
     * output // true
     * isNative(window)
     * output // false
     * */
    function isNative(Ctor) {
        return /native code/.test(Ctor.toString())
    }

    /**
     * Defer a task to execute it asynchronously.
     * 作用: dom更新之后, 异步执行的回调. (推迟任务, 异步执行, 将回调延迟到下次DOM更新循环之后执行)
     * 描述: 一个闭包, 立即执行
     * 思想: 使用h5的MutationObserver监听dom的变化, pending记录dom操作是否结束,
     * 若结束使用promise进行异步回调
     *
     * 参数:
     * MutationObserver: h5, 当DOM发生变动会触发Mutation Observer事件, 异步触发.
     * DOM发生变动以后, 并不会马上触发, 而是要等到当前所有DOM操作都结束后才触发.
     * callbacks: 回调事件队列
     * pending: 为true时, 表示正在等待所有的DOM操作结束, 结束后, 调用nextTick传入的回调将会被推入队列,
     * 从而实现DOM更新后，才触发某个队列的回调; 为false时, 队列将被清空，从而继续实现队列功能.
     * timerFunc: 异步执行回调方法
     *
     */
    var nextTick = (function() {
        var callbacks = [];
        var pending = false;
        var timerFunc;

        // 执行回调函数
        function nextTickHandler() {
            pending = false;
            var copies = callbacks.slice(0);
            callbacks.length = 0;
            for (var i = 0; i < copies.length; i++) {
                copies[i]();
            }
        }

        /** the nextTick behavior leverages the microtask queue, which can be accessed
         * via either native Promise.then or MutationObserver.
         * MutationObserver has wider support, however it is seriously bugged in
         * UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
         * completely stops working after triggering a few times... so, if native
         * Promise is available, we will use it:
         */

        /**
         * nexttick可以使用原生的Promise.then, MutationObserver来访问微任务队列实现
         * MutationObserver支持的比较广泛, 但是它的UIWebView在触发touch事件处理的时候,
         * 在9.3.3以上的ios版本上, 还有严重的bug:在触发一段时间之后, 会完全停止工作...
         * 所以, 如果原生Promise支持, 我们尽量用原生Promise.
         * */

        /**
         * 如果Promise存在, 则使用Promise; Promise不存在, 则使用MutationObserver;
         * 否则, 使用setTimeout.
         * 作用: 得到timerFunc
         * */

        /* istanbul ignore if */
        if (typeof Promise !== 'undefined' && isNative(Promise)) {
            // 使用Promise
            var p = Promise.resolve();
            var logError = function(err) { console.error(err); };
            timerFunc = function() {
                p.then(nextTickHandler).catch(logError);
                /**
                 * in problematic UIWebViews, Promise.then doesn't completely break, but
                 * it can get stuck in a weird state where callbacks are pushed into the
                 * microtask queue but the queue isn't being flushed, until the browser
                 * needs to do some other work, e.g. handle a timer. Therefore we can
                 * "force" the microtask queue to be flushed by adding an empty timer.
                 * 在UIWebViews这个问题中, Promise.then也不是完全突破了, 但是, 它可以在回调被推进
                 * 微任务队列时, 停留在这么一个奇怪的状态: 直到浏览器需要做一些其它的事情之前(例如处理定时器), 队列都不刷新.
                 * 因此, 我们可以通过添加一个空的定时器,来强制刷新微任务队列.
                 *
                 */
                if (isIOS) { setTimeout(noop); }
            };
        } else if (typeof MutationObserver !== 'undefined' && (
                isNative(MutationObserver) ||
                // PhantomJS and iOS 7.x
                MutationObserver.toString() === '[object MutationObserverConstructor]'
            )) {
            // use MutationObserver where native Promise is not available,
            // native Promise不存在的时候, 使用MutationObserver
            // e.g. PhantomJS IE11, iOS7, Android 4.4
            // eg: 如下情况, PhantomJS IE11, iOS7, Android 4.4使用MutationObserver
            var counter = 1;
            var observer = new MutationObserver(nextTickHandler);
            var textNode = document.createTextNode(String(counter));
            observer.observe(textNode, {
                characterData: true
            });
            timerFunc = function() {
                counter = (counter + 1) % 2;
                textNode.data = String(counter);
            };
        } else {
            // fallback to setTimeout
            // 如果上述都不满足, 回退到setTimeout
            /* istanbul ignore next */
            timerFunc = function() {
                setTimeout(nextTickHandler, 0);
            };
        }

        return function queueNextTick(cb, ctx) {
            var _resolve;
            callbacks.push(function() {
                if (cb) { cb.call(ctx); }
                if (_resolve) { _resolve(ctx); }
            });
            if (!pending) {
                pending = true;
                timerFunc();
            }
            if (!cb && typeof Promise !== 'undefined') {
                return new Promise(function(resolve) {
                    _resolve = resolve;
                })
            }
        }
    })();
    // nexttick  到此结束

    // 带'_'的表示内部使用, 集合 ???
    var _Set;
    /* istanbul ignore if */
    if (typeof Set !== 'undefined' && isNative(Set)) {
        // use native Set when available.
        // 如果原生Set存在的话, 使用原生Set
        _Set = Set;
    } else {
        // a non-standard Set polyfill that only works with primitive keys.
        // 只能使用原始键来设置非标准的Set兼容器
        _Set = (function() {
            // 创建一个Set对象
            function Set() {
                this.set = Object.create(null);
            }
            // 判断是否含有某个key值
            Set.prototype.has = function has(key) {
                return this.set[key] === true
            };
            // 添加一个key值
            Set.prototype.add = function add(key) {
                this.set[key] = true;
            };
            // 清空所有key值
            Set.prototype.clear = function clear() {
                this.set = Object.create(null);
            };

            return Set;
        }());
    }

    // 初始化warn为一个空方法
    var warn = noop;
    // 规范组件名
    var formatComponentName;

    { // ??? {}的作用是当前作用域  这里的意思...
        // 是否有控制台打印功能
        var hasConsole = typeof console !== 'undefined';

        // 打印警告信息
        warn = function(msg, vm) {
            // config.silent默认false
            if (hasConsole && (!config.silent)) {
                console.error("[Vue warn]: " + msg + " " + (
                    vm ? formatLocation(formatComponentName(vm)) : ''
                ));
            }
        };

        // 格式化的组件名
        formatComponentName = function(vm) {
            if (vm.$root === vm) {
                return 'root instance'
            }
            var name = vm._isVue ?
                vm.$options.name || vm.$options._componentTag :
                vm.name;
            return (
                (name ? ("component <" + name + ">") : "anonymous component") +
                (vm._isVue && vm.$options.__file ? (" at " + (vm.$options.__file)) : '')
            )
        };

        // 格式化的定位信息
        var formatLocation = function(str) {
            if (str === 'anonymous component') {
                str += " - use the \"name\" option for better debugging messages.";
            }
            return ("\n(found in " + str + ")")
        };
    }

    /*  */


    var uid$1 = 0;

    /**
     * A dep is an observable that can have multiple
     * directives subscribing to it.
     * dep是可被观察的, 可以有多个指令订阅它.
     */
    var Dep = function Dep() {
        this.id = uid$1++;
        this.subs = [];
    };
    // 添加指令
    Dep.prototype.addSub = function addSub(sub) {
        this.subs.push(sub);
    };
    // 移除指令
    Dep.prototype.removeSub = function removeSub(sub) {
        remove$1(this.subs, sub);
    };
    // 指令依赖
    Dep.prototype.depend = function depend() {
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    };

    // 通知 更新
    Dep.prototype.notify = function notify() {
        // stablize the subscriber list first
        // 首先, 标准化订阅者列表
        var subs = this.subs.slice();
        for (var i = 0, l = subs.length; i < l; i++) {
            subs[i].update();
        }
    };

    /** the current target watcher being evaluated.
     * this is globally unique because there could be only one
     * watcher being evaluated at any time.
     * 评估当前的目标监视器, this全局唯一, 只能有一个. 监视器任何时间都可以被评估
     * */
    Dep.target = null;
    var targetStack = [];

    // 推送至目标队列
    function pushTarget(_target) {
        if (Dep.target) { targetStack.push(Dep.target); }
        Dep.target = _target;
    }

    // 从目标队列推出
    function popTarget() {
        Dep.target = targetStack.pop();
    }

    /*
     * not type checking this file because flow doesn't play well with
     * dynamically accessing methods on Array prototype
     * 不要在数组原型上, 检测当前文件的类型, 因为flow在动态访问方法中运行的并不理想
     */

    /**
     * Array.prototype包含方法如下:
     * concat, constructor, copyWithin, entries, every, fill, filter, find,
     * findIndex, forEach, includes, indexOf, join, keys, lastIndexOf, length,
     * map, pop, push, reduce, reduceRight, reverse, shift, slice, some, sort,
     * splice, toLocaleString, toString, unshift, Symbol
     */
    var arrayProto = Array.prototype;
    var arrayMethods = Object.create(arrayProto);
    // 遍历数组方法, 监控数据变化, 通知更新, 返回结果
    [
        'push',
        'pop',
        'shift',
        'unshift',
        'splice',
        'sort',
        'reverse'
    ].forEach(function(method) {
        // cache original method
        // 缓存原始方法
        var original = arrayProto[method];
        // def见508行, 对method中的方法进行改写
        def(arrayMethods, method, function mutator() {
            var arguments$1 = arguments;

            // avoid leaking arguments:
            // http://jsperf.com/closure-with-arguments
            // 避免参数泄露
            var i = arguments.length;
            var args = new Array(i);
            while (i--) {
                args[i] = arguments$1[i];
            }
            var result = original.apply(this, args);
            var ob = this.__ob__;
            var inserted;
            switch (method) {
                case 'push':
                    inserted = args;
                    break
                case 'unshift':
                    inserted = args;
                    break
                case 'splice':
                    inserted = args.slice(2);
                    break
            }
            // observeArray: 异步观察[]中数据变化的方法
            if (inserted) { ob.observeArray(inserted); }
            // notify change
            // 通知变化
            ob.dep.notify();
            return result
        });
    });

    /**
     * arrayKeys: arrayMethods对象自身属性的属性名
     * */

    var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

    /**
     * By default, when a reactive property is set, the new value is
     * also converted to become reactive. However when passing down props,
     * we don't want to force conversion because the value may be a nested value
     * under a frozen data structure. Converting it would defeat the optimization.
     * 默认情况下, 当设置了一个属性为可变时, 新的值也会转化为可变的. 但是，当向下级传递属性时,
     * 我们不想强制转换, 因为这个值可能是冻结数据结构下的嵌套值. 转换它将与优化背道而驰.
     */
    var observerState = {
        shouldConvert: true,
        isSettingProps: false
    };

    /**
     * Observer class that are attached to each observed
     * object. Once attached, the observer converts target
     * object's property keys into getter/setters that
     * collect dependencies and dispatches updates.
     * 观察者类将被附加到每一个被观察的对象中, 一但附加,
     * 观察者会将目标对象的属性键值转换为依赖集合的getter/setters, 并且派发更新.
     * 作用: 观察者构造函数, 将观察者附加到每个被观察的对象中
     */
    var Observer = function Observer(value) {
        this.value = value;
        this.dep = new Dep();
        this.vmCount = 0;
        def(value, '__ob__', this);
        if (Array.isArray(value)) {
            var augment = hasProto ?
                protoAugment :
                copyAugment;
            augment(value, arrayMethods, arrayKeys);
            this.observeArray(value);
        } else {
            this.walk(value);
        }
    };

    /**
     * Walk through each property and convert them into
     * getter/setters. This method should only be called when
     * value type is Object.
     * 遍历对象, 循环使用defineReactive$$1, 为每个属性添加getter/setters.
     * 这个方法只能当值为对象的时候调用.
     */
    Observer.prototype.walk = function walk(obj) {
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            defineReactive$$1(obj, keys[i], obj[keys[i]]);
        }
    };

    /**
     * Observe a list of Array items.
     * 遍历循环使用observe, 监控数组变化
     */
    Observer.prototype.observeArray = function observeArray(items) {
        for (var i = 0, l = items.length; i < l; i++) {
            observe(items[i]);
        }
    };

    // helpers

    /**
     * Augment an target Object or Array by intercepting
     * the prototype chain using __proto__
     * 作用: 使用__proto__拦截原型链, 来增加一个目标对象或者数组
     */
    function protoAugment(target, src) {
        /* eslint-disable no-proto */
        target.__proto__ = src;
        /* eslint-enable no-proto */
    }

    /**
     * Augment an target Object or Array by defining
     * hidden properties.
     * 通过定义隐藏属性来增加目标对象或数组
     */
    /* istanbul ignore next */
    function copyAugment(target, src, keys) {
        for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i];
            def(target, key, src[key]);
        }
    }

    /**
     * Attempt to create an observer instance for a value,
     * returns the new observer if successfully observed,
     * or the existing observer if the value already has one.
     * 尝试为某个值新建一个观察者实例, 如果监测成功, 返回一个新的观察者;
     * 或者如果这个值已经有了一个观察者实例, 使用已存在的.(单例模式)
     */
    function observe(value, asRootData) {
        if (!isObject(value)) {
            return
        }
        var ob;
        if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
            ob = value.__ob__;
        } else if (
            observerState.shouldConvert &&
            !isServerRendering() &&
            (Array.isArray(value) || isPlainObject(value)) &&
            Object.isExtensible(value) &&
            !value._isVue
        ) {
            ob = new Observer(value);
        }
        if (asRootData && ob) {
            ob.vmCount++;
        }
        return ob
    }

    /**
     * Define a reactive property on an Object.
     * 作用: 在对象上定义一个可修改的属性, getter/setter在此处加入
     */
    function defineReactive$$1(
        obj,
        key,
        val,
        customSetter
    ) {
        var dep = new Dep();

        var property = Object.getOwnPropertyDescriptor(obj, key);
        if (property && property.configurable === false) {
            return
        }

        // cater for pre-defined getter/setters
        var getter = property && property.get;
        var setter = property && property.set;

        var childOb = observe(val);
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function reactiveGetter() {
                var value = getter ? getter.call(obj) : val;
                if (Dep.target) {
                    dep.depend();
                    if (childOb) {
                        childOb.dep.depend();
                    }
                    if (Array.isArray(value)) {
                        dependArray(value);
                    }
                }
                return value
            },
            // 属性变更
            set: function reactiveSetter(newVal) {
                var value = getter ? getter.call(obj) : val;
                /* eslint-disable no-self-compare */
                if (newVal === value || (newVal !== newVal && value !== value)) {
                    return
                }
                /* eslint-enable no-self-compare */
                if ("development" !== 'production' && customSetter) {
                    customSetter();
                }
                if (setter) {
                    setter.call(obj, newVal);
                } else {
                    val = newVal;
                }
                childOb = observe(newVal);
                dep.notify();
            }
        });
    }

    /**
     * Set a property on an object. Adds the new property and
     * triggers change notification if the property doesn't
     * already exist.
     * 作用: 把属性设置到对象上, 如果属性不是已有的, 添加新属性并且触发更改通知
     * 参数:
     * obj: 需要设置数据的json
     * key: 对象中需要设置数据的序号
     * val: 修改的值
     * eg: Vue.set(vm.list, 0, { value: 'd' })
     */
    function set$1(obj, key, val) {
        // 主要使用splice来删除新增数组
        if (Array.isArray(obj)) {
            obj.length = Math.max(obj.length, key);
            obj.splice(key, 1, val);
            return val
        }
        // 如果是自身已有的属性, 直接赋值
        if (hasOwn(obj, key)) {
            obj[key] = val;
            return
        }
        var ob = obj.__ob__;
        if (obj._isVue || (ob && ob.vmCount)) {
            "development" !== 'production' && warn(
                'Avoid adding reactive properties to a Vue instance or its root $data ' +
                'at runtime - declare it upfront in the data option.'
            );
            return
        }
        if (!ob) {
            obj[key] = val;
            return
        }
        defineReactive$$1(ob.value, key, val);
        ob.dep.notify();
        return val
    }

    /**
     * Delete a property and trigger change if necessary.
     * 作用: 删除某个属性, 必要情况触发更改通知.
     */
    function del(obj, key) {
        var ob = obj.__ob__;
        if (obj._isVue || (ob && ob.vmCount)) {
            "development" !== 'production' && warn(
                'Avoid deleting properties on a Vue instance or its root $data ' +
                '- just set it to null.'
            );
            return
        }
        if (!hasOwn(obj, key)) {
            return
        }
        delete obj[key];
        if (!ob) {
            return
        }
        // 通知变更
        ob.dep.notify();
    }

    /**
     * Collect dependencies on array elements when the array is touched, since
     * we cannot intercept array element access like property getters.
     * 作用: 因为不能像getters属性那样拦截数组元素访问, 所以当某个数组被访问的时候,
     * 用dependArray来收集数组元素的依赖.
     * 参数:
     * e = (void 0): 为了得到undifined 好处: 1. 使用void 0比使用undefined能够减少3个字节
     * 2. undefined不是javascript的保留字, 可以用undefined作为变量名, 给它赋值
     * 总体来说: 使用void 0这种写法意义不大
     */
    function dependArray(value) {
        for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
            e = value[i];
            e && e.__ob__ && e.__ob__.dep.depend();
            // 递归
            if (Array.isArray(e)) {
                dependArray(e);
            }
        }
    }

    /*  */

    /**
     * Option overwriting strategies are functions that handle
     * how to merge a parent option value and a child option
     * value into the final value.
     * 选项重写策略是处理如何将父元素选项值和子元素选项值合并为最终值的函数
     */
    var strats = config.optionMergeStrategies; // 空对象

    /**
     * Options with restrictions
     * 受限选项
     */
    {
        strats.el = strats.propsData = function(parent, child, vm, key) {
            if (!vm) {
                warn(
                    "option \"" + key + "\" can only be used during instance " +
                    'creation with the `new` keyword.'
                );
            }
            return defaultStrat(parent, child)
        };
    }

    /**
     * Helper that recursively merges two data objects together.
     * 作用: 将两个数据对象合并到一起
     */
    function mergeData(to, from) {
        if (!from) { return to }
        var key, toVal, fromVal;
        var keys = Object.keys(from);
        for (var i = 0; i < keys.length; i++) {
            key = keys[i];
            toVal = to[key];
            fromVal = from[key];
            if (!hasOwn(to, key)) {
                // 非自有属性, 使用set
                set$1(to, key, fromVal);
            } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
                // 递归
                mergeData(toVal, fromVal);
            }
        }
        return to
    }

    /**
     * Data
     * 选项合并策略的数据
     */
    strats.data = function(
        parentVal,
        childVal,
        vm
    ) {
        if (!vm) {
            // in a Vue.extend merge, both should be functions
            // 在Vue.extend合并中，两者都应该是函数
            if (!childVal) {
                return parentVal
            }
            if (typeof childVal !== 'function') {
                "development" !== 'production' && warn(
                    'The "data" option should be a function ' +
                    'that returns a per-instance value in component ' +
                    'definitions.',
                    vm
                );
                return parentVal
            }
            if (!parentVal) {
                return childVal
            }
            /** when parentVal & childVal are both present,
             * we need to return a function that returns the
             * merged result of both functions... no need to
             * check if parentVal is a function here because
             * it has to be a function to pass previous merges.
             * 父选项和子选项都存在的时候, 需要返回一个能返回两种方法合并结果的函数...
             * 无需检验parentVal是否是一个方法因为在前期的合并中, 它必须是个方法.
             */
            return function mergedDataFn() {
                return mergeData(
                    childVal.call(this),
                    parentVal.call(this)
                )
            }
        } else if (parentVal || childVal) {
            // vm已经存在的情况下
            return function mergedInstanceDataFn() {
                // instance merge
                var instanceData = typeof childVal === 'function' ?
                    childVal.call(vm) :
                    childVal;
                var defaultData = typeof parentVal === 'function' ?
                    parentVal.call(vm) :
                    undefined;
                if (instanceData) {
                    return mergeData(instanceData, defaultData)
                } else {
                    return defaultData
                }
            }
        }
    };

    /**
     * Hooks and param attributes are merged as arrays.
     * 两个参数属性合并为数组
     */
    function mergeHook(
        parentVal,
        childVal
    ) {
        return childVal ?
            parentVal ?
            parentVal.concat(childVal) :
            Array.isArray(childVal) ?
            childVal : [childVal] :
            parentVal
    }

    // 遍历
    config._lifecycleHooks.forEach(function(hook) {
        strats[hook] = mergeHook;
    });

    /**
     * Assets
     * 断言
     * When a vm is present (instance creation), we need to do
     * a three-way merge between constructor options, instance
     * options and parent options.
     * 当vm已经存在的情况下(实例已经创建), 需要把构造函数的options, 实例的options和
     * 父类options这三者合并
     * 作用: 合并构造函数, 父类, 当前实例三者的options
     */
    function mergeAssets(parentVal, childVal) {
        var res = Object.create(parentVal || null);
        return childVal ?
            extend(res, childVal) :
            res
    }
    // 遍历
    config._assetTypes.forEach(function(type) {
        strats[type + 's'] = mergeAssets;
    });

    /**
     * Watchers.
     * 监视器
     * Watchers hashes should not overwrite one
     * another, so we merge them as arrays.
     * 观察者哈希不应该相互覆盖, 所以将它们合并为数组.
     */
    strats.watch = function(parentVal, childVal) {
        /* istanbul ignore if */
        if (!childVal) { return parentVal }
        if (!parentVal) { return childVal }
        var ret = {};
        extend(ret, parentVal);
        for (var key in childVal) {
            var parent = ret[key];
            var child = childVal[key];
            if (parent && !Array.isArray(parent)) {
                parent = [parent];
            }
            ret[key] = parent ?
                parent.concat(child) : [child];
        }
        return ret
    };

    /**
     * Other object hashes.
     * 其它对象hash
     */
    strats.props =
        strats.methods =
        strats.computed = function(parentVal, childVal) {
            if (!childVal) { return parentVal }
            if (!parentVal) { return childVal }
            var ret = Object.create(null);
            extend(ret, parentVal);
            extend(ret, childVal);
            return ret
        };

    /**
     * Default strategy.
     * 默认选项重写策略
     */
    var defaultStrat = function(parentVal, childVal) {
        return childVal === undefined ?
            parentVal :
            childVal
    };

    /**
     * Validate component names
     * 作用: 验证组件名
     */
    function checkComponents(options) {
        for (var key in options.components) {
            var lower = key.toLowerCase();
            if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
                warn(
                    'Do not use built-in or reserved HTML elements as component ' +
                    'id: ' + key
                );
            }
        }
    }

    /**
     * Ensure all props option syntax are normalized into the
     * Object-based format.
     * 确保所有的属性选项语法基于Object-based格式都是标准的
     * 作用: 把属性值转化为基于对象的驼峰式
     * eg: 驼峰式
     */
    function normalizeProps(options) {
        var props = options.props;
        if (!props) { return }
        var res = {};
        var i, val, name;
        if (Array.isArray(props)) {
            i = props.length;
            while (i--) {
                val = props[i];
                if (typeof val === 'string') {
                    name = camelize(val);
                    res[name] = { type: null };
                } else {
                    warn('props must be strings when using array syntax.');
                }
            }
        } else if (isPlainObject(props)) {
            for (var key in props) {
                val = props[key];
                name = camelize(key);
                res[name] = isPlainObject(val) ?
                    val : { type: val };
            }
        }
        options.props = res;
    }

    /**
     * Normalize raw function directives into object format.
     * 作用: 将原始函数指令转换为对象格式
     */
    function normalizeDirectives(options) {
        var dirs = options.directives;
        if (dirs) {
            for (var key in dirs) {
                var def = dirs[key];
                if (typeof def === 'function') {
                    dirs[key] = { bind: def, update: def };
                }
            }
        }
    }

    /**
     * Merge two option objects into a new one.
     * Core utility used in both instantiation and inheritance.
     * 作用: 将两个option对象合并成一个, 核心用于实例化和继承中.
     */
    function mergeOptions(
        parent,
        child,
        vm
    ) {
        {
            checkComponents(child);
        }
        normalizeProps(child);
        normalizeDirectives(child);
        var extendsFrom = child.extends;
        if (extendsFrom) {
            parent = typeof extendsFrom === 'function' ?
                mergeOptions(parent, extendsFrom.options, vm) :
                mergeOptions(parent, extendsFrom, vm);
        }
        if (child.mixins) {
            for (var i = 0, l = child.mixins.length; i < l; i++) {
                var mixin = child.mixins[i];
                if (mixin.prototype instanceof Vue$3) {
                    mixin = mixin.options;
                }
                parent = mergeOptions(parent, mixin, vm);
            }
        }
        var options = {};
        var key;
        for (key in parent) {
            mergeField(key);
        }
        for (key in child) {
            if (!hasOwn(parent, key)) {
                mergeField(key);
            }
        }

        function mergeField(key) {
            var strat = strats[key] || defaultStrat;
            options[key] = strat(parent[key], child[key], vm, key);
        }
        return options
    }

    /**
     * Resolve an asset.
     * 解决资源问题
     * This function is used because child instances need access
     * to assets defined in its ancestor chain.
     * 子实例需要访问祖先链中的资源
     * 作用: 解决子实例访问祖先链中的资源的问题
     * 参数: ?????
     * options: 父类资源的options对象
     * type: options的资源类型
     * id:
     * warnMissing:
     */
    function resolveAsset(
        options,
        type,
        id,
        warnMissing
    ) {
        /* istanbul ignore if */
        if (typeof id !== 'string') {
            return
        }
        var assets = options[type];
        // check local registration variations first
        // 首先检查本地注册的变化
        if (hasOwn(assets, id)) { return assets[id] }
        var camelizedId = camelize(id);
        if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
        var PascalCaseId = capitalize(camelizedId);
        if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
        // fallback to prototype chain
        // 回退到原型链
        var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
        if ("development" !== 'production' && warnMissing && !res) {
            warn(
                'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
                options
            );
        }
        return res
    }

    /**
     *
     *
     *
     * */

    function validateProp(
        key,
        propOptions,
        propsData,
        vm
    ) {
        var prop = propOptions[key];
        var absent = !hasOwn(propsData, key);
        var value = propsData[key];
        // handle boolean props
        // 处理boolean属性
        if (isType(Boolean, prop.type)) {
            if (absent && !hasOwn(prop, 'default')) {
                value = false;
            } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
                value = true;
            }
        }
        // check default value
        // 检查默认值
        if (value === undefined) {
            value = getPropDefaultValue(vm, prop, key);
            // since the default value is a fresh copy,
            // make sure to observe it.
            // 默认值是新的副本, 务必遵守.
            var prevShouldConvert = observerState.shouldConvert;
            observerState.shouldConvert = true;
            observe(value);
            observerState.shouldConvert = prevShouldConvert;
        } {
            assertProp(prop, key, value, vm, absent);
        }
        return value
    }

    /**
     * Get the default value of a prop.
     * 作用: 获取属性的默认值
     */
    function getPropDefaultValue(vm, prop, key) {
        // no default, return undefined
        // 不是默认的, 返回undefined
        if (!hasOwn(prop, 'default')) {
            return undefined
        }
        var def = prop.default;
        // warn against non-factory defaults for Object & Array
        // 警告对象和数组的非默认值
        if (isObject(def)) {
            "development" !== 'production' && warn(
                'Invalid default value for prop "' + key + '": ' +
                'Props with type Object/Array must use a factory function ' +
                'to return the default value.',
                vm
            );
        }
        // the raw prop value was also undefined from previous render,
        // return previous default value to avoid unnecessary watcher trigger
        // 原始属性值在未在先前的渲染中定义, 返回之前的默认值是为了避免触发不必要的观察者
        if (vm && vm.$options.propsData &&
            vm.$options.propsData[key] === undefined &&
            vm[key] !== undefined) {
            return vm[key]
        }
        // call factory function for non-Function types
        // 为非Function类型调用工厂方法
        return typeof def === 'function' && prop.type !== Function ?
            def.call(vm) :
            def
    }


    /**
     * Assert whether a prop is valid.
     * 判断属性是否有效
     * 
     * @param {any} prop 属性
     * @param {any} name 
     * @param {any} value 
     * @param {any} vm 
     * @param {any} absent 是否存在
     */
    function assertProp(
        prop,
        name,
        value,
        vm,
        absent
    ) {
        if (prop.required && absent) {
            warn(
                'Missing required prop: "' + name + '"',
                vm
            );
            return
        }
        if (value == null && !prop.required) {
            return
        }
        var type = prop.type;
        var valid = !type || type === true;
        var expectedTypes = [];
        if (type) {
            if (!Array.isArray(type)) {
                type = [type];
            }
            for (var i = 0; i < type.length && !valid; i++) {
                var assertedType = assertType(value, type[i]);
                expectedTypes.push(assertedType.expectedType || '');
                valid = assertedType.valid;
            }
        }
        if (!valid) {
            warn(
                'Invalid prop: type check failed for prop "' + name + '".' +
                ' Expected ' + expectedTypes.map(capitalize).join(', ') +
                ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.',
                vm
            );
            return
        }
        var validator = prop.validator;
        if (validator) {
            if (!validator(value)) {
                warn(
                    'Invalid prop: custom validator check failed for prop "' + name + '".',
                    vm
                );
            }
        }
    }

    /**
     * Assert the type of a value
     * 检验值的类型
     */
    function assertType(value, type) {
        var valid;
        var expectedType = getType(type);
        if (expectedType === 'String') {
            valid = typeof value === (expectedType = 'string');
        } else if (expectedType === 'Number') {
            valid = typeof value === (expectedType = 'number');
        } else if (expectedType === 'Boolean') {
            valid = typeof value === (expectedType = 'boolean');
        } else if (expectedType === 'Function') {
            valid = typeof value === (expectedType = 'function');
        } else if (expectedType === 'Object') {
            valid = isPlainObject(value);
        } else if (expectedType === 'Array') {
            valid = Array.isArray(value);
        } else {
            valid = value instanceof type;
        }
        return {
            valid: valid,
            expectedType: expectedType
        }
    }

    /**
     * Use function string name to check built-in types,
     * because a simple equality check will fail when running
     * across different vms / iframes.
     * 获取函数类型
     */
    function getType(fn) {
        var match = fn && fn.toString().match(/^\s*function (\w+)/);
        return match && match[1]
    }
    // 判断函数类型
    function isType(type, fn) {
        if (!Array.isArray(fn)) {
            return getType(fn) === getType(type)
        }
        for (var i = 0, len = fn.length; i < len; i++) {
            if (getType(fn[i]) === getType(type)) {
                return true
            }
        }
        /* istanbul ignore next */
        return false
    }


    // 阻止修改现有属性的特性和值，并阻止添加新属性
    var util = Object.freeze({
        defineReactive: defineReactive$$1,
        _toString: _toString,
        toNumber: toNumber,
        makeMap: makeMap,
        isBuiltInTag: isBuiltInTag,
        remove: remove$1,
        hasOwn: hasOwn,
        isPrimitive: isPrimitive,
        cached: cached,
        camelize: camelize,
        capitalize: capitalize,
        hyphenate: hyphenate,
        bind: bind$1,
        toArray: toArray,
        extend: extend,
        isObject: isObject,
        isPlainObject: isPlainObject,
        toObject: toObject,
        noop: noop,
        no: no,
        identity: identity,
        genStaticKeys: genStaticKeys,
        looseEqual: looseEqual,
        looseIndexOf: looseIndexOf,
        isReserved: isReserved,
        def: def,
        parsePath: parsePath,
        hasProto: hasProto,
        inBrowser: inBrowser,
        UA: UA,
        isIE: isIE,
        isIE9: isIE9,
        isEdge: isEdge,
        isAndroid: isAndroid,
        isIOS: isIOS,
        isServerRendering: isServerRendering,
        devtools: devtools,
        nextTick: nextTick,
        get _Set() { return _Set; },
        mergeOptions: mergeOptions,
        resolveAsset: resolveAsset,
        get warn() { return warn; },
        get formatComponentName() { return formatComponentName; },
        validateProp: validateProp
    });

    /* not type checking this file because flow doesn't play well with Proxy */

    var initProxy;

    {
        var allowedGlobals = makeMap(
            'Infinity,undefined,NaN,isFinite,isNaN,' +
            'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
            'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
            'require' // for Webpack/Browserify
        );

        var warnNonPresent = function(target, key) {
            warn(
                "Property or method \"" + key + "\" is not defined on the instance but " +
                "referenced during render. Make sure to declare reactive data " +
                "properties in the data option.",
                target
            );
        };

        var hasProxy =
            typeof Proxy !== 'undefined' &&
            Proxy.toString().match(/native code/);

        if (hasProxy) {
            var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta');
            config.keyCodes = new Proxy(config.keyCodes, {
                set: function set(target, key, value) {
                    if (isBuiltInModifier(key)) {
                        warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
                        return false
                    } else {
                        target[key] = value;
                        return true
                    }
                }
            });
        }
        // 处理
        var hasHandler = {
            has: function has(target, key) {
                var has = key in target;
                var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
                if (!has && !isAllowed) {
                    warnNonPresent(target, key);
                }
                return has || !isAllowed
            }
        };

        var getHandler = {
            get: function get(target, key) {
                if (typeof key === 'string' && !(key in target)) {
                    warnNonPresent(target, key);
                }
                return target[key]
            }
        };

        initProxy = function initProxy(vm) {
            if (hasProxy) {
                // determine which proxy handler to use
                var options = vm.$options;
                var handlers = options.render && options.render._withStripped ?
                    getHandler :
                    hasHandler;
                vm._renderProxy = new Proxy(vm, handlers);
            } else {
                vm._renderProxy = vm;
            }
        };
    }

    /* 
     * 虚拟节点
     */

    var VNode = function VNode(
        tag,
        data,
        children,
        text,
        elm,
        context,
        componentOptions
    ) {
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.text = text;
        this.elm = elm;
        this.ns = undefined;
        this.context = context;
        this.functionalContext = undefined;
        this.key = data && data.key;
        this.componentOptions = componentOptions;
        this.componentInstance = undefined;
        this.parent = undefined;
        this.raw = false;
        this.isStatic = false;
        this.isRootInsert = true;
        this.isComment = false;
        this.isCloned = false;
        this.isOnce = false;
    };

    // 原型访问器
    var prototypeAccessors = { child: {} };

    // DEPRECATED(deprecated反对): alias for componentInstance（实例组件） for backwards compat（反向编译）.
    /* istanbul ignore next */
    prototypeAccessors.child.get = function() {
        return this.componentInstance
    };

    Object.defineProperties(VNode.prototype, prototypeAccessors);

    var createEmptyVNode = function() {
        var node = new VNode();
        node.text = '';
        node.isComment = true;
        return node
    };

    function createTextVNode(val) {
        return new VNode(undefined, undefined, undefined, String(val))
    }

    // optimized shallow clone 优化浅复制
    // used for static nodes and slot nodes because they may be reused across
    // multiple renders, cloning them avoids errors when DOM manipulations rely
    // on their elm reference.
    // 克隆一个新虚拟节点
    function cloneVNode(vnode) {
        var cloned = new VNode(
            vnode.tag,
            vnode.data,
            vnode.children,
            vnode.text,
            vnode.elm,
            vnode.context,
            vnode.componentOptions
        );
        cloned.ns = vnode.ns;
        cloned.isStatic = vnode.isStatic;
        cloned.key = vnode.key;
        cloned.isCloned = true;
        return cloned
    }
    // 克隆多个虚拟节点
    function cloneVNodes(vnodes) {
        var res = new Array(vnodes.length);
        for (var i = 0; i < vnodes.length; i++) {
            res[i] = cloneVNode(vnodes[i]);
        }
        return res
    }

    /*  */

    var hooks = { init: init, prepatch: prepatch, insert: insert, destroy: destroy$1 };
    var hooksToMerge = Object.keys(hooks);

   /**
    * 创建一个组件
    */
    function createComponent(
    
    ) {
        if (!Ctor) {
            return
        }

        var baseCtor = context.$options._base;
        if (isObject(Ctor)) {
            Ctor = baseCtor.extend(Ctor);
        }

        if (typeof Ctor !== 'function') {
            {
                warn(("Invalid Component definition: " + (String(Ctor))), context);
            }
            return
        }

        // async component
        if (!Ctor.cid) {
            if (Ctor.resolved) {
                Ctor = Ctor.resolved;
            } else {
                Ctor = resolveAsyncComponent(Ctor, baseCtor, function() {
                    // it's ok to queue this on every render because
                    // $forceUpdate is buffered by the scheduler.
                    context.$forceUpdate();
                });
                if (!Ctor) {
                    // return nothing if this is indeed an async component
                    // wait for the callback to trigger parent update.
                    return
                }
            }
        }

        // resolve constructor options in case global mixins are applied after
        // component constructor creation
        // 处理构造参数，以免全局mixin在组件构造之后被使用
        resolveConstructorOptions(Ctor);

        data = data || {};

        // extract props
        var propsData = extractProps(data, Ctor);

        // functional component
        if (Ctor.options.functional) {
            return createFunctionalComponent(Ctor, propsData, data, context, children)
        }

        // extract listeners, since these needs to be treated as
        // child component listeners instead of DOM listeners
        var listeners = data.on;
        // replace with listeners with .native modifier
        data.on = data.nativeOn;

        if (Ctor.options.abstract) {
            // abstract components do not keep anything
            // other than props & listeners
            data = {};
        }

        // merge component management hooks onto the placeholder node
        mergeHooks(data);

        // return a placeholder vnode
        var name = Ctor.options.name || tag;
        var vnode = new VNode(
            ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
            data, undefined, undefined, undefined, context, { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }
        );
        return vnode
    }
    // 新建功能性组件
    function createFunctionalComponent(
        Ctor,
        propsData,
        data,
        context,
        children
    ) {
        var props = {};
        var propOptions = Ctor.options.props;
        if (propOptions) {
            for (var key in propOptions) {
                props[key] = validateProp(key, propOptions, propsData);
            }
        }
        // ensure the createElement function in functional components
        // gets a unique context - this is necessary for correct named slot check
        var _context = Object.create(context);
        var h = function(a, b, c, d) { return createElement(_context, a, b, c, d, true); };
        var vnode = Ctor.options.render.call(null, h, {
            props: props,
            data: data,
            parent: context,
            children: children,
            slots: function() { return resolveSlots(children, context); }
        });
        if (vnode instanceof VNode) {
            vnode.functionalContext = context;
            if (data.slot) {
                (vnode.data || (vnode.data = {})).slot = data.slot;
            }
        }
        return vnode
    }
    // 为虚拟节点创建组件实例
    function createComponentInstanceForVnode(
        vnode, // we know it's MountedComponentVNode but flow doesn't
        parent, // activeInstance in lifecycle state
        parentElm,
        refElm
    ) {
        var vnodeComponentOptions = vnode.componentOptions;
        var options = {
            _isComponent: true,
            parent: parent,
            propsData: vnodeComponentOptions.propsData,
            _componentTag: vnodeComponentOptions.tag,
            _parentVnode: vnode,
            _parentListeners: vnodeComponentOptions.listeners,
            _renderChildren: vnodeComponentOptions.children,
            _parentElm: parentElm || null,
            _refElm: refElm || null
        };
        // check inline-template render functions
        var inlineTemplate = vnode.data.inlineTemplate;
        if (inlineTemplate) {
            options.render = inlineTemplate.render;
            options.staticRenderFns = inlineTemplate.staticRenderFns;
        }
        return new vnodeComponentOptions.Ctor(options)
    }
    // 初始化
    function init(
        vnode,
        hydrating,
        parentElm,
        refElm
    ) {
        if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
            var child = vnode.componentInstance = createComponentInstanceForVnode(
                vnode,
                activeInstance,
                parentElm,
                refElm
            );
            child.$mount(hydrating ? vnode.elm : undefined, hydrating);
        } else if (vnode.data.keepAlive) {
            // kept-alive components, treat as a patch
            var mountedNode = vnode; // work around flow
            prepatch(mountedNode, mountedNode);
        }
    }
    // 打补丁
    function prepatch(
        oldVnode,
        vnode
    ) {
        var options = vnode.componentOptions;
        var child = vnode.componentInstance = oldVnode.componentInstance;
        child._updateFromParent(
            options.propsData, // updated props
            options.listeners, // updated listeners
            vnode, // new parent vnode
            options.children // new children
        );
    }
    // 插入节点
    function insert(vnode) {
        if (!vnode.componentInstance._isMounted) {
            vnode.componentInstance._isMounted = true;
            callHook(vnode.componentInstance, 'mounted');
        }
        if (vnode.data.keepAlive) {
            vnode.componentInstance._inactive = false;
            callHook(vnode.componentInstance, 'activated');
        }
    }
    // 销毁节点
    function destroy$1(vnode) {
        if (!vnode.componentInstance._isDestroyed) {
            if (!vnode.data.keepAlive) {
                vnode.componentInstance.$destroy();
            } else {
                vnode.componentInstance._inactive = true;
                callHook(vnode.componentInstance, 'deactivated');
            }
        }
    }
    // 解决组件异步问题
    function resolveAsyncComponent(
        factory,
        baseCtor,
        cb
    ) {
        if (factory.requested) {
            // pool callbacks
            factory.pendingCallbacks.push(cb);
        } else {
            factory.requested = true;
            var cbs = factory.pendingCallbacks = [cb];
            var sync = true;

            var resolve = function(res) {
                if (isObject(res)) {
                    res = baseCtor.extend(res);
                }
                // cache resolved
                factory.resolved = res;
                // invoke callbacks only if this is not a synchronous resolve
                // (async resolves are shimmed as synchronous during SSR)
                if (!sync) {
                    for (var i = 0, l = cbs.length; i < l; i++) {
                        cbs[i](res);
                    }
                }
            };

            var reject = function(reason) {
                "development" !== 'production' && warn(
                    "Failed to resolve async component: " + (String(factory)) +
                    (reason ? ("\nReason: " + reason) : '')
                );
            };

            var res = factory(resolve, reject);

            // handle promise
            if (res && typeof res.then === 'function' && !factory.resolved) {
                res.then(resolve, reject);
            }

            sync = false;
            // return in case resolved synchronously
            return factory.resolved
        }
    }
    // 提取属性存入res
    function extractProps(data, Ctor) {
        // we are only extracting（提取） raw values here.
        // validation and default values are handled in the child
        // component itself.
        var propOptions = Ctor.options.props;
        if (!propOptions) {
            return
        }
        var res = {};
        var attrs = data.attrs;
        var props = data.props;
        var domProps = data.domProps;
        if (attrs || props || domProps) {
            for (var key in propOptions) {
                var altKey = hyphenate(key);
                checkProp(res, props, key, altKey, true) ||
                    checkProp(res, attrs, key, altKey) ||
                    checkProp(res, domProps, key, altKey);
            }
        }
        return res
    }
    // 提取属性key存入res
    function checkProp(
        res,
        hash,
        key,
        altKey,
        preserve
    ) {
        if (hash) {
            if (hasOwn(hash, key)) {
                res[key] = hash[key];
                if (!preserve) {
                    delete hash[key];
                }
                return true
            } else if (hasOwn(hash, altKey)) {
                res[key] = hash[altKey];
                if (!preserve) {
                    delete hash[altKey];
                }
                return true
            }
        }
        return false
    }
    // 把钩子组件合并到节点上
    function mergeHooks(data) {
        if (!data.hook) {
            data.hook = {};
        }
        for (var i = 0; i < hooksToMerge.length; i++) {
            var key = hooksToMerge[i];
            var fromParent = data.hook[key];
            var ours = hooks[key];
            data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
        }
    }
    // 递归合并
    function mergeHook$1(one, two) {
        return function(a, b, c, d) {
            one(a, b, c, d);
            two(a, b, c, d);
        }
    }

    /**
     * 合并虚拟节点钩子
     */
    function mergeVNodeHook(def, hookKey, hook, key) {
        key = key + hookKey;
        var injectedHash = def.__injected || (def.__injected = {});
        if (!injectedHash[key]) {
            injectedHash[key] = true;
            var oldHook = def[hookKey];
            if (oldHook) {
                def[hookKey] = function() {
                    oldHook.apply(this, arguments);
                    hook.apply(this, arguments);
                };
            } else {
                def[hookKey] = hook;
            }
        }
    }

    /* 事件规范化 */

    var normalizeEvent = cached(function(name) {
        var once = name.charAt(0) === '~'; // Prefixed last, checked first
        name = once ? name.slice(1) : name;
        var capture = name.charAt(0) === '!';
        name = capture ? name.slice(1) : name;
        return {
            name: name,
            once: once,
            capture: capture
        }
    });
    // 新建事件处理
    function createEventHandle(fn) {
        var handle = {
            fn: fn,
            invoker: function() {
                var arguments$1 = arguments;

                var fn = handle.fn;
                if (Array.isArray(fn)) {
                    for (var i = 0; i < fn.length; i++) {
                        fn[i].apply(null, arguments$1);
                    }
                } else {
                    fn.apply(null, arguments);
                }
            }
        };
        return handle
    }
    // 更新监听
    function updateListeners(
        on,
        oldOn,
        add,
        remove$$1,
        vm
    ) {
        var name, cur, old, event;
        for (name in on) {
            cur = on[name];
            old = oldOn[name];
            event = normalizeEvent(name);
            if (!cur) {
                "development" !== 'production' && warn(
                    "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
                    vm
                );
            } else if (!old) {
                if (!cur.invoker) {
                    cur = on[name] = createEventHandle(cur);
                }
                add(event.name, cur.invoker, event.once, event.capture);
            } else if (cur !== old) {
                old.fn = cur;
                on[name] = old;
            }
        }
        for (name in oldOn) {
            if (!on[name]) {
                event = normalizeEvent(name);
                remove$$1(event.name, oldOn[name].invoker, event.capture);
            }
        }
    }

    /*  */

    // The template compiler attempts to minimize the need for normalization by
    // statically analyzing the template at compile time.
    //
    // For plain HTML markup, normalization can be completely skipped because the
    // generated render function is guaranteed to return Array<VNode>. There are
    // two cases where extra normalization is needed:

    // 1. When the children contains components - because a functional component
    // may return an Array instead of a single root. In this case, just a simple
    // nomralization is needed - if any child is an Array, we flatten the whole
    // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
    // because functional components already normalize their own children.
    // 模板编译器试图通过在编译时对模板进行静态编译来减少对规范化的需求。
    // 对于纯html标签，可以完全跳过标准化，因为生成的渲染函数保证会返回数组<VNode>。但还是有两种情况需要额外的规范化：
    // 1. 当子模板包含组件时——因为一个功能型组件可能会返回一个数组而不是一个简单的路径，这种情况下，只需要简单的标准化；如果子模板是数组的话，需要使用Array.prototype.concat来处理，因为功能组件已经规范了自己的子组件，所以它保证只有1级。
   
    // 标准化子组件
    function simpleNormalizeChildren(children) {
        for (var i = 0; i < children.length; i++) {
            if (Array.isArray(children[i])) {
                return Array.prototype.concat.apply([], children)
            }
        }
        return children
    }

    // 2. When the children contains constrcuts that always generated nested Arrays,
    // e.g. <template>, <slot>, v-for, or when the children is provided by user
    // with hand-written render functions / JSX. In such cases a full normalization
    // is needed to cater to all possible types of children values.
    // 当子模板包含经常需要生成嵌套数组的结构时，例如<template>, <slot>, v-for，或者当用户由手写渲染函数/JSX时。在这类情况下，需要完全标准化来满足子模板的所有可能。
    // 标准化子模板
    function normalizeChildren(children) {
        return isPrimitive(children) ? [createTextVNode(children)] :
            Array.isArray(children) ?
            normalizeArrayChildren(children) :
            undefined
    }
    // 标准化数组类型子模板
    function normalizeArrayChildren(children, nestedIndex) {
        var res = [];
        var i, c, last;
        for (i = 0; i < children.length; i++) {
            c = children[i];
            if (c == null || typeof c === 'boolean') { continue }
            last = res[res.length - 1];
            //  nested
            if (Array.isArray(c)) {
                // 递归
                res.push.apply(res, normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i)));
            } else if (isPrimitive(c)) {
                if (last && last.text) {
                    last.text += String(c);
                } else if (c !== '') {
                    // convert primitive to vnode
                    res.push(createTextVNode(c));
                }
            } else {
                if (c.text && last && last.text) {
                    res[res.length - 1] = createTextVNode(last.text + c.text);
                } else {
                    // default key for nested array children (likely generated by v-for)
                    if (c.tag && c.key == null && nestedIndex != null) {
                        c.key = "__vlist" + nestedIndex + "_" + i + "__";
                    }
                    res.push(c);
                }
            }
        }
        return res
    }

    /* 获取首个子组件 */

    function getFirstComponentChild(children) {
        return children && children.filter(function(c) { return c && c.componentOptions; })[0]
    }

    /*  */

    var SIMPLE_NORMALIZE = 1;
    var ALWAYS_NORMALIZE = 2;

    // wrapper function for providing a more flexible interface
    // without getting yelled at by flow
    // 新建一个元素：确定类型后调用_createElement
    function createElement(
        context,
        tag,
        data,
        children,
        normalizationType,
        alwaysNormalize
    ) {
        if (Array.isArray(data) || isPrimitive(data)) {
            normalizationType = children;
            children = data;
            data = undefined;
        }
        if (alwaysNormalize) { normalizationType = ALWAYS_NORMALIZE; }
        return _createElement(context, tag, data, children, normalizationType)
    }
    // 新建一个元素（私有）
    function _createElement(
        context,
        tag,
        data,
        children,
        normalizationType
    ) {
        if (data && data.__ob__) {
            "development" !== 'production' && warn(
                "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
                'Always create fresh vnode data objects in each render!',
                context
            );
            return createEmptyVNode()
        }
        if (!tag) {
            // in case of component :is set to falsy value
            return createEmptyVNode()
        }
        // support single function children as default scoped slot
        if (Array.isArray(children) &&
            typeof children[0] === 'function') {
            data = data || {};
            data.scopedSlots = { default: children[0] };
            children.length = 0;
        }
        if (normalizationType === ALWAYS_NORMALIZE) {
            children = normalizeChildren(children);
        } else if (normalizationType === SIMPLE_NORMALIZE) {
            children = simpleNormalizeChildren(children);
        }
        var vnode, ns;
        if (typeof tag === 'string') {
            var Ctor;
            ns = config.getTagNamespace(tag);
            if (config.isReservedTag(tag)) {
                // platform built-in elements
                vnode = new VNode(
                    config.parsePlatformTagName(tag), data, children,
                    undefined, undefined, context
                );
            } else if ((Ctor = resolveAsset(context.$options, 'components', tag))) {
                // component
                vnode = createComponent(Ctor, data, context, children, tag);
            } else {
                // unknown or unlisted namespaced elements
                // check at runtime because it may get assigned a namespace when its
                // parent normalizes children
                vnode = new VNode(
                    tag, data, children,
                    undefined, undefined, context
                );
            }
        } else {
            // direct component options / constructor
            vnode = createComponent(tag, data, context, children);
        }
        if (vnode) {
            if (ns) { applyNS(vnode, ns); }
            return vnode
        } else {
            return createEmptyVNode()
        }
    }
    // foreignObject：canvas的标签，可以直接在SVG内部嵌入XHTML元素。
    function applyNS(vnode, ns) {
        vnode.ns = ns;
        if (vnode.tag === 'foreignObject') {
            // use default namespace inside foreignObject
            return
        }
        if (vnode.children) {
            for (var i = 0, l = vnode.children.length; i < l; i++) {
                var child = vnode.children[i];
                if (child.tag && !child.ns) {
                    // 递归
                    applyNS(child, ns);
                }
            }
        }
    }

    /* 初始化渲染 */

    function initRender(vm) {
        vm.$vnode = null; // the placeholder node in parent tree 父节点下的占位节点
        vm._vnode = null; // the root of the child tree 子节点树的根
        vm._staticTrees = null;
        var parentVnode = vm.$options._parentVnode;
        var renderContext = parentVnode && parentVnode.context;
        vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext);
        vm.$scopedSlots = {};
        // bind the createElement fn to this instance 
        // 把创建节点的方法绑定到实例中
        // so that we get proper render context inside it. 
        // 这样我们就能在其内部获取到正确的渲染
        // args order: tag, data, children, normalizationType, alwaysNormalize
        // internal version is used by render functions compiled from templates 
        // 内部版本被用来渲染模板编译的方法
        vm._c = function(a, b, c, d) { return createElement(vm, a, b, c, d, false); };
        // normalization is always applied for the public version, used in
        // user-written render functions.
        vm.$createElement = function(a, b, c, d) { return createElement(vm, a, b, c, d, true); };
    }
    // 渲染mixin
    function renderMixin(Vue) {
        Vue.prototype.$nextTick = function(fn) {
            return nextTick(fn, this)
        };

        // 构建vnode
        Vue.prototype._render = function() {
            var vm = this;
            var ref = vm.$options;
            var render = ref.render;
            var staticRenderFns = ref.staticRenderFns;
            var _parentVnode = ref._parentVnode;

            if (vm._isMounted) {
                // clone slot nodes on re-renders
                for (var key in vm.$slots) {
                    vm.$slots[key] = cloneVNodes(vm.$slots[key]);
                }
            }

            if (_parentVnode && _parentVnode.data.scopedSlots) {
                vm.$scopedSlots = _parentVnode.data.scopedSlots;
            }

            if (staticRenderFns && !vm._staticTrees) {
                vm._staticTrees = [];
            }
            // set parent vnode. this allows render functions to have access
            // to the data on the placeholder node.
            vm.$vnode = _parentVnode;
            // render self
            var vnode;
            try {
                vnode = render.call(vm._renderProxy, vm.$createElement);
            } catch (e) {
                /* istanbul ignore else */
                if (config.errorHandler) {
                    config.errorHandler.call(null, e, vm);
                } else {
                    {
                        warn(("Error when rendering " + (formatComponentName(vm)) + ":"));
                    }
                    throw e
                }
                // return previous vnode to prevent render error causing blank component
                vnode = vm._vnode;
            }
            // return empty vnode in case the render function errored out
            if (!(vnode instanceof VNode)) {
                if ("development" !== 'production' && Array.isArray(vnode)) {
                    warn(
                        'Multiple root nodes returned from render function. Render function ' +
                        'should return a single root node.',
                        vm
                    );
                }
                vnode = createEmptyVNode();
            }
            // set parent
            vnode.parent = _parentVnode;
            return vnode
        };

        // toString for mustaches
        Vue.prototype._s = _toString;
        // convert text to vnode
        Vue.prototype._v = createTextVNode;
        // number conversion
        Vue.prototype._n = toNumber;
        // empty vnode
        Vue.prototype._e = createEmptyVNode;
        // loose equal
        Vue.prototype._q = looseEqual;
        // loose indexOf
        Vue.prototype._i = looseIndexOf;

        // render static tree by index
        // 通过索引渲染静态树 
        Vue.prototype._m = function renderStatic(
            index,
            isInFor
        ) {
            var tree = this._staticTrees[index];
            // if has already-rendered static tree and not inside v-for,
            // we can reuse the same tree by doing a shallow clone.
            if (tree && !isInFor) {
                return Array.isArray(tree) ?
                    cloneVNodes(tree) :
                    cloneVNode(tree)
            }
            // otherwise, render a fresh tree.
            tree = this._staticTrees[index] = this.$options.staticRenderFns[index].call(this._renderProxy);
            markStatic(tree, ("__static__" + index), false);
            return tree
        };

        // mark node as static (v-once)
        Vue.prototype._o = function markOnce(
            tree,
            index,
            key
        ) {
            markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
            return tree
        };
        // 标记静态节点  调用markStaticNode
        function markStatic(tree, key, isOnce) {
            if (Array.isArray(tree)) {
                for (var i = 0; i < tree.length; i++) {
                    if (tree[i] && typeof tree[i] !== 'string') {
                        markStaticNode(tree[i], (key + "_" + i), isOnce);
                    }
                }
            } else {
                markStaticNode(tree, key, isOnce);
            }
        }
        // 标记静态节点，一次
        function markStaticNode(node, key, isOnce) {
            node.isStatic = true;
            node.key = key;
            node.isOnce = isOnce;
        }

        // filter resolution helper
        // 过滤器辅助
        Vue.prototype._f = function resolveFilter(id) {
            // 解决子实例访问祖先实例资源的问题
            return resolveAsset(this.$options, 'filters', id, true) || identity
        };

        // render v-for
        // v-for 渲染  遍历各种情况
        Vue.prototype._l = function renderList(
            val,
            render
        ) {
            var ret, i, l, keys, key;
            if (Array.isArray(val) || typeof val === 'string') {
                ret = new Array(val.length);
                for (i = 0, l = val.length; i < l; i++) {
                    ret[i] = render(val[i], i);
                }
            } else if (typeof val === 'number') {
                ret = new Array(val);
                for (i = 0; i < val; i++) {
                    ret[i] = render(i + 1, i);
                }
            } else if (isObject(val)) {
                keys = Object.keys(val);
                ret = new Array(keys.length);
                for (i = 0, l = keys.length; i < l; i++) {
                    key = keys[i];
                    ret[i] = render(val[key], key, i);
                }
            }
            return ret
        };

        // renderSlot slot渲染
        Vue.prototype._t = function(
            name,
            fallback,
            props,
            bindObject
        ) {
            var scopedSlotFn = this.$scopedSlots[name];
            if (scopedSlotFn) { // scoped slot
                props = props || {};
                if (bindObject) {
                    extend(props, bindObject);
                }
                return scopedSlotFn(props) || fallback
            } else {
                var slotNodes = this.$slots[name];
                // warn duplicate slot usage
                if (slotNodes && "development" !== 'production') {
                    slotNodes._rendered && warn(
                        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
                        "- this will likely cause render errors.",
                        this
                    );
                    slotNodes._rendered = true;
                }
                return slotNodes || fallback
            }
        };

        // apply v-bind object
        // v-bind绑定class、style等
        Vue.prototype._b = function bindProps(
            data,
            tag,
            value,
            asProp
        ) {
            if (value) {
                if (!isObject(value)) {
                    "development" !== 'production' && warn(
                        'v-bind without argument expects an Object or Array value',
                        this
                    );
                } else {
                    if (Array.isArray(value)) {
                        value = toObject(value);
                    }
                    for (var key in value) {
                        if (key === 'class' || key === 'style') {
                            data[key] = value[key];
                        } else {
                            var type = data.attrs && data.attrs.type;
                            var hash = asProp || config.mustUseProp(tag, type, key) ?
                                data.domProps || (data.domProps = {}) :
                                data.attrs || (data.attrs = {});
                            hash[key] = value[key];
                        }
                    }
                }
            }
            return data
        };

        // check v-on keyCodes 校验v-on事件键值
        Vue.prototype._k = function checkKeyCodes(
            eventKeyCode,
            key,
            builtInAlias
        ) {
            var keyCodes = config.keyCodes[key] || builtInAlias;
            if (Array.isArray(keyCodes)) {
                return keyCodes.indexOf(eventKeyCode) === -1
            } else {
                return keyCodes !== eventKeyCode
            }
        };
    }
    // slot父组件子组件之间的通信
    function resolveSlots(
        children,
        context
    ) {
        var slots = {};
        if (!children) {
            return slots
        }
        var defaultSlot = [];
        var name, child;
        for (var i = 0, l = children.length; i < l; i++) {
            child = children[i];
            // named slots should only be respected if the vnode was rendered in the
            // same context.
            if ((child.context === context || child.functionalContext === context) &&
                child.data && (name = child.data.slot)) {
                var slot = (slots[name] || (slots[name] = []));
                if (child.tag === 'template') {
                    slot.push.apply(slot, child.children);
                } else {
                    slot.push(child);
                }
            } else {
                defaultSlot.push(child);
            }
        }
        // ignore single whitespace
        if (defaultSlot.length && !(
                defaultSlot.length === 1 &&
                (defaultSlot[0].text === ' ' || defaultSlot[0].isComment)
            )) {
            slots.default = defaultSlot;
        }
        return slots
    }

    /* 事件初始化 */

    function initEvents(vm) {
        vm._events = Object.create(null);
        vm._hasHookEvent = false;
        // init parent attached events
        var listeners = vm.$options._parentListeners;
        if (listeners) {
            updateComponentListeners(vm, listeners);
        }
    }

    var target;
    // 添加事件
    function add$1(event, fn, once) {
        if (once) {
            target.$once(event, fn);
        } else {
            target.$on(event, fn);
        }
    }
    // 移除事件
    function remove$2(event, fn) {
        target.$off(event, fn);
    }
    // 更新组件监听
    function updateComponentListeners(
        vm,
        listeners,
        oldListeners
    ) {
        target = vm;
        updateListeners(listeners, oldListeners || {}, add$1, remove$2, vm);
    }
    // mixin事件
    function eventsMixin(Vue) {
        var hookRE = /^hook:/;
        Vue.prototype.$on = function(event, fn) {
            var vm = this;
            (vm._events[event] || (vm._events[event] = [])).push(fn);
            // optimize hook:event cost by using a boolean flag marked at registration
            // instead of a hash lookup
            if (hookRE.test(event)) {
                vm._hasHookEvent = true;
            }
            return vm
        };

        Vue.prototype.$once = function(event, fn) {
            var vm = this;

            function on() {
                vm.$off(event, on);
                fn.apply(vm, arguments);
            }
            on.fn = fn;
            vm.$on(event, on);
            return vm
        };

        Vue.prototype.$off = function(event, fn) {
            var vm = this;
            // all
            if (!arguments.length) {
                vm._events = Object.create(null);
                return vm
            }
            // specific event
            var cbs = vm._events[event];
            if (!cbs) {
                return vm
            }
            if (arguments.length === 1) {
                vm._events[event] = null;
                return vm
            }
            // specific handler
            var cb;
            var i = cbs.length;
            while (i--) {
                cb = cbs[i];
                if (cb === fn || cb.fn === fn) {
                    cbs.splice(i, 1);
                    break
                }
            }
            return vm
        };

        Vue.prototype.$emit = function(event) {
            var vm = this;
            var cbs = vm._events[event];
            if (cbs) {
                cbs = cbs.length > 1 ? toArray(cbs) : cbs;
                var args = toArray(arguments, 1);
                for (var i = 0, l = cbs.length; i < l; i++) {
                    cbs[i].apply(vm, args);
                }
            }
            return vm
        };
    }

    /*  */

    var activeInstance = null;
    // 初始化生命周期
    function initLifecycle(vm) {
        var options = vm.$options;

        // locate first non-abstract parent
        var parent = options.parent;
        if (parent && !options.abstract) {
            while (parent.$options.abstract && parent.$parent) {
                parent = parent.$parent;
            }
            parent.$children.push(vm);
        }

        vm.$parent = parent;
        vm.$root = parent ? parent.$root : vm;

        vm.$children = [];
        vm.$refs = {};

        vm._watcher = null;
        vm._inactive = false;
        vm._isMounted = false;
        vm._isDestroyed = false;
        vm._isBeingDestroyed = false;
    }
    // minxin生命周期
    function lifecycleMixin(Vue) {
        Vue.prototype._mount = function(
            el,
            hydrating
        ) {
            var vm = this;
            vm.$el = el;
            if (!vm.$options.render) {
                vm.$options.render = createEmptyVNode; {
                    /* istanbul ignore if */
                    if (vm.$options.template && vm.$options.template.charAt(0) !== '#') {
                        warn(
                            'You are using the runtime-only build of Vue where the template ' +
                            'option is not available. Either pre-compile the templates into ' +
                            'render functions, or use the compiler-included build.',
                            vm
                        );
                    } else {
                        warn(
                            'Failed to mount component: template or render function not defined.',
                            vm
                        );
                    }
                }
            }
            // 先走beforeMount
            callHook(vm, 'beforeMount');
            vm._watcher = new Watcher(vm, function updateComponent() {
                // 通过render拿到了vnode，然后通过update对比vnode绘制到页面
                vm._update(vm._render(), hydrating);
            }, noop);
            hydrating = false;
            // manually mounted instance, call mounted on self
            // mounted is called for render-created child components in its inserted hook
            if (vm.$vnode == null) {
                vm._isMounted = true;
                // 调用mounted
                callHook(vm, 'mounted');
            }
            return vm
        };
        // 对比vnode，并渲染到页面中
        // 通过render拿到了vnode，然后通过update对比vnode绘制到页面
        Vue.prototype._update = function(vnode, hydrating) {
            var vm = this;
            // mounted完了调用beforeUpdate
            if (vm._isMounted) {
                callHook(vm, 'beforeUpdate');
            }
            var prevEl = vm.$el;
            var prevVnode = vm._vnode;
            var prevActiveInstance = activeInstance;
            activeInstance = vm;
            vm._vnode = vnode;
            // Vue.prototype.__patch__ is injected in entry points
            // based on the rendering backend used.
            if (!prevVnode) {
                // initial render
                vm.$el = vm.__patch__(
                    vm.$el, vnode, hydrating, false /* removeOnly */ ,
                    vm.$options._parentElm,
                    vm.$options._refElm
                );
            } else {
                // updates 更新补丁，用于对比新旧2个vnode
                vm.$el = vm.__patch__(prevVnode, vnode);
            }
            activeInstance = prevActiveInstance;
            // update __vue__ reference
            if (prevEl) {
                prevEl.__vue__ = null;
            }
            if (vm.$el) {
                vm.$el.__vue__ = vm;
            }
            // if parent is an HOC, update its $el as well
            if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
                vm.$parent.$el = vm.$el;
            }
            // updated hook is called by the scheduler to ensure that children are
            // updated in a parent's updated hook.
        };

        Vue.prototype._updateFromParent = function(
            propsData,
            listeners,
            parentVnode,
            renderChildren
        ) {
            var vm = this;
            var hasChildren = !!(vm.$options._renderChildren || renderChildren);
            vm.$options._parentVnode = parentVnode;
            vm.$vnode = parentVnode; // update vm's placeholder node without re-render
            if (vm._vnode) { // update child tree's parent
                vm._vnode.parent = parentVnode;
            }
            vm.$options._renderChildren = renderChildren;
            // update props
            if (propsData && vm.$options.props) {
                observerState.shouldConvert = false; {
                    observerState.isSettingProps = true;
                }
                var propKeys = vm.$options._propKeys || [];
                for (var i = 0; i < propKeys.length; i++) {
                    var key = propKeys[i];
                    vm[key] = validateProp(key, vm.$options.props, propsData, vm);
                }
                observerState.shouldConvert = true; {
                    observerState.isSettingProps = false;
                }
                vm.$options.propsData = propsData;
            }
            // update listeners
            if (listeners) {
                var oldListeners = vm.$options._parentListeners;
                vm.$options._parentListeners = listeners;
                updateComponentListeners(vm, listeners, oldListeners);
            }
            // resolve slots + force update if has children
            if (hasChildren) {
                vm.$slots = resolveSlots(renderChildren, parentVnode.context);
                vm.$forceUpdate();
            }
        };

        Vue.prototype.$forceUpdate = function() {
            var vm = this;
            if (vm._watcher) {
                vm._watcher.update();
            }
        };

        Vue.prototype.$destroy = function() {
            var vm = this;
            if (vm._isBeingDestroyed) {
                return
            }
            // 调用_updateFromParent
            callHook(vm, '_updateFromParent');
            vm._isBeingDestroyed = true;
            // remove self from parent
            var parent = vm.$parent;
            if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
                remove$1(parent.$children, vm);
            }
            // teardown watchers
            if (vm._watcher) {
                vm._watcher.teardown();
            }
            var i = vm._watchers.length;
            while (i--) {
                vm._watchers[i].teardown();
            }
            // remove reference from data ob
            // frozen object may not have observer.
            if (vm._data.__ob__) {
                vm._data.__ob__.vmCount--;
            }
            // call the last hook...
            vm._isDestroyed = true;
            // 销毁dom
            callHook(vm, 'destroyed');
            // turn off all instance listeners.
            vm.$off();
            // remove __vue__ reference
            if (vm.$el) {
                vm.$el.__vue__ = null;
            }
            // invoke destroy hooks on current rendered tree
            vm.__patch__(vm._vnode, null);
        };
    }
    // 调用钩子函数
    function callHook(vm, hook) {
        var handlers = vm.$options[hook];
        if (handlers) {
            for (var i = 0, j = handlers.length; i < j; i++) {
                handlers[i].call(vm);
            }
        }
        if (vm._hasHookEvent) {
            vm.$emit('hook:' + hook);
        }
    }

    /*  */


    var queue = [];
    var has$1 = {};
    var circular = {};
    var waiting = false;
    var flushing = false;
    var index = 0;

    /**
     * Reset the scheduler's state.
     * 重置调度状态
     */
    function resetSchedulerState() {
        queue.length = 0;
        has$1 = {}; {
            circular = {};
        }
        waiting = flushing = false;
    }

    /**
     * Flush both queues and run the watchers.
     * 刷新调度队列，并启动监听。
     */
    function flushSchedulerQueue() {
        flushing = true;
        var watcher, id, vm;

        // Sort queue before flush. 刷新之前先排序
        // This ensures that: 确保
        // 1. Components are updated from parent to child. (because parent is always
        //    created before the child)组件从父组件更新到子组件（父组件一般在子组件之前创建）
        // 2. A component's user watchers are run before its render watcher (because
        //    user watchers are created before the render watcher)
        // 组件的使用watchers一般在渲染watchers之前（使用一般在渲染之前创建）
        // 3. If a component is destroyed during a parent component's watcher run,
        //    its watchers can be skipped.
        // 如果组件销毁时，父组件还在运行，watchers会被跳过。
        queue.sort(function(a, b) { return a.id - b.id; });

        // do not cache length because more watchers might be pushed
        // as we run existing watchers
        for (index = 0; index < queue.length; index++) {
            watcher = queue[index];
            id = watcher.id;
            has$1[id] = null;
            watcher.run();
            // in dev build, check and stop circular updates.
            // 开发环境下，检查并暂停循环更新。
            if ("development" !== 'production' && has$1[id] != null) {
                circular[id] = (circular[id] || 0) + 1;
                if (circular[id] > config._maxUpdateCount) {
                    warn(
                        'You may have an infinite update loop ' + (
                            watcher.user ?
                            ("in watcher with expression \"" + (watcher.expression) + "\"") :
                            "in a component render function."
                        ),
                        watcher.vm
                    );
                    break
                }
            }
        }

        // call updated hooks
        index = queue.length;
        while (index--) {
            watcher = queue[index];
            vm = watcher.vm;
            if (vm._watcher === watcher && vm._isMounted) {
                callHook(vm, 'updated');
            }
        }

        // devtool hook
        /* istanbul ignore if */
        if (devtools && config.devtools) {
            devtools.emit('flush');
        }

        resetSchedulerState();
    }

    /**
     * Push a watcher into the watcher queue.
     * 将一个观察者推入观察者队列
     * Jobs with duplicate IDs will be skipped unless it's
     * pushed when the queue is being flushed.
     * 重复的id会被跳过，除非队列被刷新。
     */
    function queueWatcher(watcher) {
        var id = watcher.id;
        if (has$1[id] == null) {
            has$1[id] = true;
            if (!flushing) {
                queue.push(watcher);
            } else {
                // if already flushing, splice the watcher based on its id
                // if already past its id, it will be run next immediately.
                var i = queue.length - 1;
                while (i >= 0 && queue[i].id > watcher.id) {
                    i--;
                }
                queue.splice(Math.max(i, index) + 1, 0, watcher);
            }
            // queue the flush
            if (!waiting) {
                waiting = true;
                nextTick(flushSchedulerQueue);
            }
        }
    }

    /*  */

    var uid$2 = 0;

    /**
     * A watcher parses an expression, collects dependencies,
     * and fires callback when the expression value changes.
     * This is used for both the $watch() api and directives.
     * 当一个表达式的值改变时，watcher就开始解析这个表达式，集合依赖，和回调。
     * $watch() api 和 directives都适用
     */
    var Watcher = function Watcher(
        vm,
        expOrFn,
        cb,
        options
    ) {
        this.vm = vm;
        vm._watchers.push(this);
        // options
        if (options) {
            this.deep = !!options.deep;
            this.user = !!options.user;
            this.lazy = !!options.lazy;
            this.sync = !!options.sync;
        } else {
            this.deep = this.user = this.lazy = this.sync = false;
        }
        this.cb = cb;
        this.id = ++uid$2; // uid for batching
        this.active = true;
        this.dirty = this.lazy; // for lazy watchers
        this.deps = [];
        this.newDeps = [];
        this.depIds = new _Set();
        this.newDepIds = new _Set();
        this.expression = expOrFn.toString();
        // parse expression for getter
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = parsePath(expOrFn);
            if (!this.getter) {
                this.getter = function() {};
                "development" !== 'production' && warn(
                    "Failed watching path: \"" + expOrFn + "\" " +
                    'Watcher only accepts simple dot-delimited paths. ' +
                    'For full control, use a function instead.',
                    vm
                );
            }
        }
        this.value = this.lazy ?
            undefined :
            this.get();
    };

    /**
     * Evaluate the getter, and re-collect dependencies.
     * 求getter值，并且重新收集依赖。
     */
    Watcher.prototype.get = function get() {
        pushTarget(this);
        var value = this.getter.call(this.vm, this.vm);
        // "touch" every property so they are all tracked as
        // dependencies for deep watching
        // 遍历每一个属性，使它们被跟踪，且都被深度观察
        if (this.deep) {
            traverse(value);
        }
        popTarget();
        this.cleanupDeps();
        return value
    };

    /**
     * Add a dependency to this directive.
     * 为指令添加依赖
     */
    Watcher.prototype.addDep = function addDep(dep) {
        var id = dep.id;
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id);
            this.newDeps.push(dep);
            if (!this.depIds.has(id)) {
                dep.addSub(this);
            }
        }
    };

    /**
     * Clean up for dependency collection.
     * 清除依赖
     */
    Watcher.prototype.cleanupDeps = function cleanupDeps() {
        var this$1 = this;

        var i = this.deps.length;
        while (i--) {
            var dep = this$1.deps[i];
            if (!this$1.newDepIds.has(dep.id)) {
                dep.removeSub(this$1);
            }
        }
        var tmp = this.depIds;
        this.depIds = this.newDepIds;
        this.newDepIds = tmp;
        this.newDepIds.clear();
        tmp = this.deps;
        this.deps = this.newDeps;
        this.newDeps = tmp;
        this.newDeps.length = 0;
    };

    /**
     * Subscriber interface.用户接口
     * Will be called when a dependency changes.
     * 当依赖改变时，用户接口会被唤起。
     */
    Watcher.prototype.update = function update() {
        /* istanbul ignore else */
        if (this.lazy) {
            this.dirty = true;
        } else if (this.sync) {
            // 此处完成
            this.run();
        } else {
            queueWatcher(this);
        }
    };

    /**
     * Scheduler job interface.
     * Will be called by the scheduler.
     * 工作调度接口会被调起
     */
    Watcher.prototype.run = function run() {
        if (this.active) {
            var value = this.get();
            if (
                value !== this.value ||
                // Deep watchers and watchers on Object/Arrays should fire even
                // when the value is the same, because the value may
                // have mutated.
                isObject(value) ||
                this.deep
            ) {
                // set new value
                var oldValue = this.value;
                this.value = value;
                if (this.user) {
                    try {
                        this.cb.call(this.vm, value, oldValue);
                    } catch (e) {
                        /* istanbul ignore else */
                        if (config.errorHandler) {
                            config.errorHandler.call(null, e, this.vm);
                        } else {
                            "development" !== 'production' && warn(
                                ("Error in watcher \"" + (this.expression) + "\""),
                                this.vm
                            );
                            throw e
                        }
                    }
                } else {
                    this.cb.call(this.vm, value, oldValue);
                }
            }
        }
    };

    /**
     * Evaluate the value of the watcher.
     * This only gets called for lazy watchers.
     * 延迟监控时计算watcher中的值
     */
    Watcher.prototype.evaluate = function evaluate() {
        this.value = this.get();
        this.dirty = false;
    };

    /**
     * Depend on all deps collected by this watcher.
     * 遍历依赖
     */
    Watcher.prototype.depend = function depend() {
        var this$1 = this;

        var i = this.deps.length;
        while (i--) {
            this$1.deps[i].depend();
        }
    };

    /**
     * Remove self from all dependencies' subscriber list.
     * watcher列表中移除自身
     */
    Watcher.prototype.teardown = function teardown() {
        var this$1 = this;

        if (this.active) {
            // remove self from vm's watcher list
            // this is a somewhat expensive operation so we skip it
            // if the vm is being destroyed.
            if (!this.vm._isBeingDestroyed) {
                remove$1(this.vm._watchers, this);
            }
            var i = this.deps.length;
            while (i--) {
                this$1.deps[i].removeSub(this$1);
            }
            this.active = false;
        }
    };

    /**
     * Recursively traverse（递归遍历） an object to evoke（唤起） all converted
     * getters, so that every nested property inside the object
     * is collected as a "deep" dependency.
     * 递归遍历对象，来唤醒所有被转换的getters，使对象内的每一个嵌套属性都被
     * 作为一个deep依赖被收集
     */
    var seenObjects = new _Set();

    function traverse(val) {
        seenObjects.clear();
        _traverse(val, seenObjects);
    }

    function _traverse(val, seen) {
        var i, keys;
        var isA = Array.isArray(val);
        if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
            return
        }
        if (val.__ob__) {
            var depId = val.__ob__.dep.id;
            if (seen.has(depId)) {
                return
            }
            seen.add(depId);
        }
        if (isA) {
            i = val.length;
            while (i--) { _traverse(val[i], seen); }
        } else {
            keys = Object.keys(val);
            i = keys.length;
            while (i--) { _traverse(val[keys[i]], seen); }
        }
    }

    /*  */

    function initState(vm) {
        vm._watchers = [];
        var opts = vm.$options;
        if (opts.props) { initProps(vm, opts.props); }
        if (opts.methods) { initMethods(vm, opts.methods); }
        if (opts.data) {
            initData(vm);
        } else {
            observe(vm._data = {}, true /* asRootData */ );
        }
        if (opts.computed) { initComputed(vm, opts.computed); }
        if (opts.watch) { initWatch(vm, opts.watch); }
    }

    var isReservedProp = { key: 1, ref: 1, slot: 1 };

    // 初始化属性，给每个属性添加getter/setter
    function initProps(vm, props) {
        var propsData = vm.$options.propsData || {};
        var keys = vm.$options._propKeys = Object.keys(props);
        var isRoot = !vm.$parent;
        // root instance props should be converted
        observerState.shouldConvert = isRoot;
        var loop = function(i) {
            var key = keys[i];
            /* istanbul ignore else */
            {
                if (isReservedProp[key]) {
                    warn(
                        ("\"" + key + "\" is a reserved attribute and cannot be used as component prop."),
                        vm
                    );
                }
                defineReactive$$1(vm, key, validateProp(key, props, propsData, vm), function() {
                    if (vm.$parent && !observerState.isSettingProps) {
                        warn(
                            "Avoid mutating a prop directly since the value will be " +
                            "overwritten whenever the parent component re-renders. " +
                            "Instead, use a data or computed property based on the prop's " +
                            "value. Prop being mutated: \"" + key + "\"",
                            vm
                        );
                    }
                });
            }
        };

        for (var i = 0; i < keys.length; i++) loop(i);
        observerState.shouldConvert = true;
    }

    // 初始化数据（data中需return{}），使用proxy代理添加set/get，并加入观察者队列
    function initData(vm) {
        var data = vm.$options.data;
        data = vm._data = typeof data === 'function' ?
            data.call(vm) :
            data || {};
        if (!isPlainObject(data)) {
            data = {};
            "development" !== 'production' && warn(
                'data functions should return an object:\n' +
                'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
                vm
            );
        }
        // proxy data on instance
        var keys = Object.keys(data);
        var props = vm.$options.props;
        var i = keys.length;
        while (i--) {
            if (props && hasOwn(props, keys[i])) {
                "development" !== 'production' && warn(
                    "The data property \"" + (keys[i]) + "\" is already declared as a prop. " +
                    "Use prop default value instead.",
                    vm
                );
            } else {
                proxy(vm, keys[i]);
            }
        }
        // observe data
        observe(data, true /* asRootData */ );
    }

    var computedSharedDefinition = {
        enumerable: true,
        configurable: true,
        get: noop,
        set: noop
    };

    function initComputed(vm, computed) {
        for (var key in computed) {
            /* istanbul ignore if */
            if ("development" !== 'production' && key in vm) {
                warn(
                    "existing instance property \"" + key + "\" will be " +
                    "overwritten by a computed property with the same name.",
                    vm
                );
            }
            var userDef = computed[key];
            if (typeof userDef === 'function') {
                computedSharedDefinition.get = makeComputedGetter(userDef, vm);
                computedSharedDefinition.set = noop;
            } else {
                computedSharedDefinition.get = userDef.get ?
                    userDef.cache !== false ?
                    makeComputedGetter(userDef.get, vm) :
                    bind$1(userDef.get, vm) :
                    noop;
                computedSharedDefinition.set = userDef.set ?
                    bind$1(userDef.set, vm) :
                    noop;
            }
            Object.defineProperty(vm, key, computedSharedDefinition);
        }
    }
    // new一个watcher，并返回getter值
    function makeComputedGetter(getter, owner) {
        var watcher = new Watcher(owner, getter, noop, {
            lazy: true
        });
        return function computedGetter() {
            if (watcher.dirty) {
                watcher.evaluate();
            }
            if (Dep.target) {
                watcher.depend();
            }
            return watcher.value
        }
    }
    // 初始化methods
    function initMethods(vm, methods) {
        for (var key in methods) {
            vm[key] = methods[key] == null ? noop : bind$1(methods[key], vm);
            if ("development" !== 'production' && methods[key] == null) {
                warn(
                    "method \"" + key + "\" has an undefined value in the component definition. " +
                    "Did you reference the function correctly?",
                    vm
                );
            }
        }
    }
    // 初始化watcher
    function initWatch(vm, watch) {
        for (var key in watch) {
            var handler = watch[key];
            if (Array.isArray(handler)) {
                for (var i = 0; i < handler.length; i++) {
                    createWatcher(vm, key, handler[i]);
                }
            } else {
                createWatcher(vm, key, handler);
            }
        }
    }

    function createWatcher(vm, key, handler) {
        var options;
        if (isPlainObject(handler)) {
            options = handler;
            handler = handler.handler;
        }
        if (typeof handler === 'string') {
            handler = vm[handler];
        }
        vm.$watch(key, handler, options);
    }

    function stateMixin(Vue) {
        // flow somehow has problems with directly declared definition object
        // when using Object.defineProperty, so we have to procedurally build up
        // the object here.
        // 使用Object.defineProperty直接声明定义对象时，flow有问题，我们必须在这里程序化构建对象。
        var dataDef = {};
        dataDef.get = function() {
            return this._data
        }; {
            dataDef.set = function(newData) {
                warn(
                    'Avoid replacing instance root $data. ' +
                    'Use nested data properties instead.',
                    this
                );
            };
        }
        Object.defineProperty(Vue.prototype, '$data', dataDef);

        Vue.prototype.$set = set$1;
        Vue.prototype.$delete = del;

        Vue.prototype.$watch = function(
            expOrFn,
            cb,
            options
        ) {
            var vm = this;
            options = options || {};
            options.user = true;
            var watcher = new Watcher(vm, expOrFn, cb, options);
            if (options.immediate) {
                cb.call(vm, watcher.value);
            }
            return function unwatchFn() {
                watcher.teardown();
            }
        };
    }

    function proxy(vm, key) {
        if (!isReserved(key)) {
            Object.defineProperty(vm, key, {
                configurable: true,
                enumerable: true,
                get: function proxyGetter() {
                    return vm._data[key]
                },
                set: function proxySetter(val) {
                    vm._data[key] = val;
                }
            });
        }
    }

    /*  */

    var uid = 0;

    function initMixin(Vue) {
        Vue.prototype._init = function(options) {
            var vm = this;
            // a uid
            vm._uid = uid++;
            // a flag to avoid this being observed
            vm._isVue = true;
            // merge options
            if (options && options._isComponent) {
                // optimize internal component instantiation
                // since dynamic options merging is pretty slow, and none of the
                // internal component options needs special treatment.
                initInternalComponent(vm, options);
            } else {
                vm.$options = mergeOptions(
                    resolveConstructorOptions(vm.constructor),
                    options || {},
                    vm
                );
            }
            /* istanbul ignore else */
            {
                initProxy(vm);
            }
            // expose real self
            vm._self = vm;
            initLifecycle(vm);
            initEvents(vm);
            initRender(vm);
            callHook(vm, 'beforeCreate');
            initState(vm);
            callHook(vm, 'created');
            if (vm.$options.el) {
                vm.$mount(vm.$options.el);
            }
        };
    }

    function initInternalComponent(vm, options) {
        var opts = vm.$options = Object.create(vm.constructor.options);
        // doing this because it's faster than dynamic enumeration.
        opts.parent = options.parent;
        opts.propsData = options.propsData;
        opts._parentVnode = options._parentVnode;
        opts._parentListeners = options._parentListeners;
        opts._renderChildren = options._renderChildren;
        opts._componentTag = options._componentTag;
        opts._parentElm = options._parentElm;
        opts._refElm = options._refElm;
        if (options.render) {
            opts.render = options.render;
            opts.staticRenderFns = options.staticRenderFns;
        }
    }
    // 处理构造函数参数
    function resolveConstructorOptions(Ctor) {
        var options = Ctor.options;
        if (Ctor.super) {
            var superOptions = Ctor.super.options;
            var cachedSuperOptions = Ctor.superOptions;
            var extendOptions = Ctor.extendOptions;
            if (superOptions !== cachedSuperOptions) {
                // super option changed
                Ctor.superOptions = superOptions;
                extendOptions.render = options.render;
                extendOptions.staticRenderFns = options.staticRenderFns;
                extendOptions._scopeId = options._scopeId;
                options = Ctor.options = mergeOptions(superOptions, extendOptions);
                if (options.name) {
                    options.components[options.name] = Ctor;
                }
            }
        }
        return options
    }

    function Vue$3(options) {
        if ("development" !== 'production' &&
            !(this instanceof Vue$3)) {
            warn('Vue is a constructor and should be called with the `new` keyword');
        }
        this._init(options);
    }

    initMixin(Vue$3);
    stateMixin(Vue$3);
    eventsMixin(Vue$3);
    lifecycleMixin(Vue$3);
    renderMixin(Vue$3);

    /*  */

    function initUse(Vue) {
        Vue.use = function(plugin) {
            /* istanbul ignore if */
            if (plugin.installed) {
                return
            }
            // additional parameters
            var args = toArray(arguments, 1);
            args.unshift(this);
            if (typeof plugin.install === 'function') {
                plugin.install.apply(plugin, args);
            } else {
                plugin.apply(null, args);
            }
            plugin.installed = true;
            return this
        };
    }

    /*  */

    function initMixin$1(Vue) {
        Vue.mixin = function(mixin) {
            this.options = mergeOptions(this.options, mixin);
        };
    }

    /*  */

    function initExtend(Vue) {
        /**
         * Each instance constructor, including Vue, has a unique
         * cid. This enables us to create wrapped "child
         * constructors" for prototypal inheritance and cache them.
         * 每一个实例化的构造函数，包括vue，都有一个唯一的cid，
         * 这使我们能够为原型继承，创建“子构造函数”包，并缓存它们。
         */
        Vue.cid = 0;
        var cid = 1;

        /**
         * Class inheritance
         */
        Vue.extend = function(extendOptions) {
            extendOptions = extendOptions || {};
            var Super = this;
            var SuperId = Super.cid;
            var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
            if (cachedCtors[SuperId]) {
                return cachedCtors[SuperId]
            }
            var name = extendOptions.name || Super.options.name; {
                if (!/^[a-zA-Z][\w-]*$/.test(name)) {
                    warn(
                        'Invalid component name: "' + name + '". Component names ' +
                        'can only contain alphanumeric characters and the hyphen, ' +
                        'and must start with a letter.'
                    );
                }
            }
            var Sub = function VueComponent(options) {
                this._init(options);
            };
            Sub.prototype = Object.create(Super.prototype);
            Sub.prototype.constructor = Sub;
            Sub.cid = cid++;
            Sub.options = mergeOptions(
                Super.options,
                extendOptions
            );
            Sub['super'] = Super;
            // allow further extension/mixin/plugin usage
            Sub.extend = Super.extend;
            Sub.mixin = Super.mixin;
            Sub.use = Super.use;
            // create asset registers, so extended classes
            // can have their private assets too.
            // 创建注入资源，这样扩展类也可以拥有私有的资源
            config._assetTypes.forEach(function(type) {
                Sub[type] = Super[type];
            });
            // enable recursive self-lookup
            // 启用递归自查
            if (name) {
                Sub.options.components[name] = Sub;
            }
            // keep a reference to the super options at extension time.
            // later at instantiation we can check if Super's options have
            // been updated.
            // 扩展时，为父类的参数保留一个引用
            // 后期实例化中我们可以判断父类参数是否更新了
            Sub.superOptions = Super.options;
            Sub.extendOptions = extendOptions;
            // cache constructor
            cachedCtors[SuperId] = Sub;
            return Sub
        };
    }

    /*  */

    function initAssetRegisters(Vue) {
        /**
         * Create asset registration methods.
         */
        config._assetTypes.forEach(function(type) {
            Vue[type] = function(
                id,
                definition
            ) {
                if (!definition) {
                    return this.options[type + 's'][id]
                } else {
                    /* istanbul ignore if */
                    {
                        if (type === 'component' && config.isReservedTag(id)) {
                            warn(
                                'Do not use built-in or reserved HTML elements as component ' +
                                'id: ' + id
                            );
                        }
                    }
                    if (type === 'component' && isPlainObject(definition)) {
                        definition.name = definition.name || id;
                        definition = this.options._base.extend(definition);
                    }
                    if (type === 'directive' && typeof definition === 'function') {
                        definition = { bind: definition, update: definition };
                    }
                    this.options[type + 's'][id] = definition;
                    return definition
                }
            };
        });
    }

    /*  */

    var patternTypes = [String, RegExp];

    function getComponentName(opts) {
        return opts && (opts.Ctor.options.name || opts.tag)
    }

    function matches(pattern, name) {
        if (typeof pattern === 'string') {
            return pattern.split(',').indexOf(name) > -1
        } else {
            return pattern.test(name)
        }
    }
    // cache中的key值全部置为null及销毁入口
    function pruneCache(cache, filter) {
        for (var key in cache) {
            var cachedNode = cache[key];
            if (cachedNode) {
                var name = getComponentName(cachedNode.componentOptions);
                if (name && !filter(name)) {
                    pruneCacheEntry(cachedNode);
                    cache[key] = null;
                }
            }
        }
    }
    // 销毁cache入口实现
    function pruneCacheEntry(vnode) {
        if (vnode) {
            if (!vnode.componentInstance._inactive) {
                callHook(vnode.componentInstance, 'deactivated');
            }
            vnode.componentInstance.$destroy();
        }
    }

    var KeepAlive = {
        name: 'keep-alive',
        abstract: true,

        props: {
            include: patternTypes,
            exclude: patternTypes
        },

        created: function created() {
            this.cache = Object.create(null);
        },

        destroyed: function destroyed() {
            var this$1 = this;

            for (var key in this.cache) {
                pruneCacheEntry(this$1.cache[key]);
            }
        },

        watch: {
            include: function include(val) {
                pruneCache(this.cache, function(name) { return matches(val, name); });
            },
            exclude: function exclude(val) {
                pruneCache(this.cache, function(name) { return !matches(val, name); });
            }
        },

        render: function render() {
            var vnode = getFirstComponentChild(this.$slots.default);
            var componentOptions = vnode && vnode.componentOptions;
            if (componentOptions) {
                // check pattern
                var name = getComponentName(componentOptions);
                if (name && (
                        (this.include && !matches(this.include, name)) ||
                        (this.exclude && matches(this.exclude, name))
                    )) {
                    return vnode
                }
                var key = vnode.key == null
                    // same constructor may get registered as different local components
                    // so cid alone is not enough (#3269)
                    ?
                    componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '') :
                    vnode.key;
                if (this.cache[key]) {
                    vnode.componentInstance = this.cache[key].componentInstance;
                } else {
                    this.cache[key] = vnode;
                }
                vnode.data.keepAlive = true;
            }
            return vnode
        }
    };

    var builtInComponents = {
        KeepAlive: KeepAlive
    };

    /*  */

    function initGlobalAPI(Vue) {
        // config
        var configDef = {};
        configDef.get = function() { return config; }; {
            configDef.set = function() {
                warn(
                    'Do not replace the Vue.config object, set individual fields instead.'
                );
            };
        }
        Object.defineProperty(Vue, 'config', configDef);
        Vue.util = util;
        Vue.set = set$1;
        Vue.delete = del;
        Vue.nextTick = nextTick;

        Vue.options = Object.create(null);
        config._assetTypes.forEach(function(type) {
            Vue.options[type + 's'] = Object.create(null);
        });

        // this is used to identify the "base" constructor to extend all plain-object
        // components with in Weex's multi-instance scenarios.
        Vue.options._base = Vue;

        extend(Vue.options.components, builtInComponents);

        initUse(Vue);
        initMixin$1(Vue);
        initExtend(Vue);
        initAssetRegisters(Vue);
    }

    initGlobalAPI(Vue$3);

    Object.defineProperty(Vue$3.prototype, '$isServer', {
        get: isServerRendering
    });

    Vue$3.version = '2.1.10';

    /*  */

    // attributes that should be using props for binding
    var acceptValue = makeMap('input,textarea,option,select');
    var mustUseProp = function(tag, type, attr) {
        return (
            (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
            (attr === 'selected' && tag === 'option') ||
            (attr === 'checked' && tag === 'input') ||
            (attr === 'muted' && tag === 'video')
        )
    };

    var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

    var isBooleanAttr = makeMap(
        'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
        'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
        'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
        'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
        'required,reversed,scoped,seamless,selected,sortable,translate,' +
        'truespeed,typemustmatch,visible'
    );
    // XLink 定义在 XML 文档中创建超级链接的标准方法。
    var xlinkNS = 'http://www.w3.org/1999/xlink';
    // 判断链接是不是xlink
    var isXlink = function(name) {
        return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
    };
    // 获取xlink的属性
    var getXlinkProp = function(name) {
        return isXlink(name) ? name.slice(6, name.length) : ''
    };
    // 是否是无效/false数据
    var isFalsyAttrValue = function(val) {
        return val == null || val === false
    };

    /*  */
    // 虚拟节点生成类名，使用genClassFromData
    function genClassForVnode(vnode) {
        var data = vnode.data;
        var parentNode = vnode;
        var childNode = vnode;
        while (childNode.componentInstance) {
            childNode = childNode.componentInstance._vnode;
            if (childNode.data) {
                data = mergeClassData(childNode.data, data);
            }
        }
        while ((parentNode = parentNode.parent)) {
            if (parentNode.data) {
                data = mergeClassData(data, parentNode.data);
            }
        }
        return genClassFromData(data)
    }
    // 合并类名
    function mergeClassData(child, parent) {
        return {
            staticClass: concat(child.staticClass, parent.staticClass),
            class: child.class ? [child.class, parent.class] : parent.class
        }
    }
    // 生成类名
    function genClassFromData(data) {
        var dynamicClass = data.class;
        var staticClass = data.staticClass;
        if (staticClass || dynamicClass) {
            return concat(staticClass, stringifyClass(dynamicClass))
        }
        /* istanbul ignore next */
        return ''
    }

    function concat(a, b) {
        return a ? b ? (a + ' ' + b) : a : (b || '')
    }
    // 类名转字符串形式
    function stringifyClass(value) {
        var res = '';
        if (!value) {
            return res
        }
        if (typeof value === 'string') {
            return value
        }
        if (Array.isArray(value)) {
            var stringified;
            for (var i = 0, l = value.length; i < l; i++) {
                if (value[i]) {
                    if ((stringified = stringifyClass(value[i]))) {
                        res += stringified + ' ';
                    }
                }
            }
            return res.slice(0, -1)
        }
        if (isObject(value)) {
            for (var key in value) {
                if (value[key]) { res += key + ' '; }
            }
            return res.slice(0, -1)
        }
        /* istanbul ignore next */
        return res
    }

    /*  */

    var namespaceMap = {
        svg: 'http://www.w3.org/2000/svg',
        math: 'http://www.w3.org/1998/Math/MathML'
    };

    var isHTMLTag = makeMap(
        'html,body,base,head,link,meta,style,title,' +
        'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
        'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' +
        'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
        's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
        'embed,object,param,source,canvas,script,noscript,del,ins,' +
        'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
        'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
        'output,progress,select,textarea,' +
        'details,dialog,menu,menuitem,summary,' +
        'content,element,shadow,template'
    );

    // this map is intentionally selective, only covering SVG elements that may
    // contain child elements.
    var isSVG = makeMap(
        'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,' +
        'font-face,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
        'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
        true
    );

    var isPreTag = function(tag) { return tag === 'pre'; };

    var isReservedTag = function(tag) {
        return isHTMLTag(tag) || isSVG(tag)
    };

    function getTagNamespace(tag) {
        if (isSVG(tag)) {
            return 'svg'
        }
        // basic support for MathML
        // note it doesn't support other MathML elements being component roots
        if (tag === 'math') {
            return 'math'
        }
    }

    var unknownElementCache = Object.create(null);

    function isUnknownElement(tag) {
        /* istanbul ignore if */
        if (!inBrowser) {
            return true
        }
        if (isReservedTag(tag)) {
            return false
        }
        tag = tag.toLowerCase();
        /* istanbul ignore if */
        if (unknownElementCache[tag] != null) {
            return unknownElementCache[tag]
        }
        var el = document.createElement(tag);
        if (tag.indexOf('-') > -1) {
            // http://stackoverflow.com/a/28210364/1070244
            return (unknownElementCache[tag] = (
                el.constructor === window.HTMLUnknownElement ||
                el.constructor === window.HTMLElement
            ))
        } else {
            return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
        }
    }

    /*  */

    /**
     * Query an element selector if it's not an element already.
     * 查找标签元素
     */
    function query(el) {
        if (typeof el === 'string') {
            var selector = el;
            el = document.querySelector(el);
            if (!el) {
                "development" !== 'production' && warn(
                    'Cannot find element: ' + selector
                );
                return document.createElement('div')
            }
        }
        return el
    }

    /*  */

    function createElement$1(tagName, vnode) {
        var elm = document.createElement(tagName);
        if (tagName !== 'select') {
            return elm
        }
        if (vnode.data && vnode.data.attrs && 'multiple' in vnode.data.attrs) {
            elm.setAttribute('multiple', 'multiple');
        }
        return elm
    }

    function createElementNS(namespace, tagName) {
        return document.createElementNS(namespaceMap[namespace], tagName)
    }

    function createTextNode(text) {
        return document.createTextNode(text)
    }

    function createComment(text) {
        return document.createComment(text)
    }

    function insertBefore(parentNode, newNode, referenceNode) {
        parentNode.insertBefore(newNode, referenceNode);
    }

    function removeChild(node, child) {
        node.removeChild(child);
    }

    function appendChild(node, child) {
        node.appendChild(child);
    }

    function parentNode(node) {
        return node.parentNode
    }

    function nextSibling(node) {
        return node.nextSibling
    }

    function tagName(node) {
        return node.tagName
    }

    function setTextContent(node, text) {
        node.textContent = text;
    }

    function setAttribute(node, key, val) {
        node.setAttribute(key, val);
    }


    var nodeOps = Object.freeze({
        createElement: createElement$1,
        createElementNS: createElementNS,
        createTextNode: createTextNode,
        createComment: createComment,
        insertBefore: insertBefore,
        removeChild: removeChild,
        appendChild: appendChild,
        parentNode: parentNode,
        nextSibling: nextSibling,
        tagName: tagName,
        setTextContent: setTextContent,
        setAttribute: setAttribute
    });

    /*  */

    var ref = {
        create: function create(_, vnode) {
            registerRef(vnode);
        },
        update: function update(oldVnode, vnode) {
            if (oldVnode.data.ref !== vnode.data.ref) {
                registerRef(oldVnode, true);
                registerRef(vnode);
            }
        },
        destroy: function destroy(vnode) {
            registerRef(vnode, true);
        }
    };

    function registerRef(vnode, isRemoval) {
        var key = vnode.data.ref;
        if (!key) { return }

        var vm = vnode.context;
        var ref = vnode.componentInstance || vnode.elm;
        var refs = vm.$refs;
        if (isRemoval) {
            if (Array.isArray(refs[key])) {
                remove$1(refs[key], ref);
            } else if (refs[key] === ref) {
                refs[key] = undefined;
            }
        } else {
            if (vnode.data.refInFor) {
                if (Array.isArray(refs[key]) && refs[key].indexOf(ref) < 0) {
                    refs[key].push(ref);
                } else {
                    refs[key] = [ref];
                }
            } else {
                refs[key] = ref;
            }
        }
    }

    /**
     * Virtual DOM patching algorithm based on Snabbdom by
     * Simon Friis Vindum (@paldepind)
     * Licensed under the MIT License
     * https://github.com/paldepind/snabbdom/blob/master/LICENSE
     *
     * modified by Evan You (@yyx990803)
     *

    /*
     * Not type-checking this because this file is perf-critical and the cost
     * of making flow understand it is not worth it.
     */

    var emptyNode = new VNode('', {}, []);

    var hooks$1 = ['create', 'activate', 'update', 'remove', 'destroy'];

    function isUndef(s) {
        return s == null
    }

    function isDef(s) {
        return s != null
    }

    function sameVnode(vnode1, vnode2) {
        return (
            vnode1.key === vnode2.key &&
            vnode1.tag === vnode2.tag &&
            vnode1.isComment === vnode2.isComment &&
            !vnode1.data === !vnode2.data
        )
    }

    // [{key:'a'}, {key:'b'}] => {a: 0, b: 1}
    function createKeyToOldIdx(children, beginIdx, endIdx) {
        var i, key;
        var map = {};
        for (i = beginIdx; i <= endIdx; ++i) {
            key = children[i].key;
            if (isDef(key)) { map[key] = i; }
        }
        return map
    }
    // 打补丁
    function createPatchFunction(backend) {
        var i, j;
        var cbs = {};

        var modules = backend.modules;
        var nodeOps = backend.nodeOps;
        // 备注：hooks$1 = ['create', 'activate', 'update', 'remove', 'destroy'];
        for (i = 0; i < hooks$1.length; ++i) {
            cbs[hooks$1[i]] = [];
            for (j = 0; j < modules.length; ++j) {
                if (modules[j][hooks$1[i]] !== undefined) { cbs[hooks$1[i]].push(modules[j][hooks$1[i]]); }
            }
        }
        // cbs = {create:[],activate:[]...}

        /**
         *  VNode参数
         *  tag,
         *  data,
         *  children,
         *  text,
         *  elm,
         *  context,
         *  componentOptions
         */
        // 置空虚拟节点中的某个元素
        function emptyNodeAt(elm) {
            return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
        }
        // 创建
        function createRmCb(childElm, listeners) {
            function remove$$1() {
                if (--remove$$1.listeners === 0) {
                    removeNode(childElm);
                }
            }
            remove$$1.listeners = listeners;
            return remove$$1
        }
        // 移除节点（找到父节点，删除子节点）
        function removeNode(el) {
            var parent = nodeOps.parentNode(el);
            // element may have already been removed due to v-html / v-text
            if (parent) {
                nodeOps.removeChild(parent, el);
            }
        }

        var inPre = 0;

        function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested) {
            vnode.isRootInsert = !nested; // for transition enter check
            if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
                return
            }

            var data = vnode.data;
            var children = vnode.children;
            var tag = vnode.tag;
            if (isDef(tag)) {
                {
                    if (data && data.pre) {
                        inPre++;
                    }
                    if (!inPre &&
                        !vnode.ns &&
                        !(config.ignoredElements.length && config.ignoredElements.indexOf(tag) > -1) &&
                        config.isUnknownElement(tag)
                    ) {
                        warn(
                            'Unknown custom element: <' + tag + '> - did you ' +
                            'register the component correctly? For recursive components, ' +
                            'make sure to provide the "name" option.',
                            vnode.context
                        );
                    }
                }
                vnode.elm = vnode.ns ?
                    nodeOps.createElementNS(vnode.ns, tag) :
                    nodeOps.createElement(tag, vnode);
                setScope(vnode);

                /* istanbul ignore if */
                {
                    createChildren(vnode, children, insertedVnodeQueue);
                    if (isDef(data)) {
                        invokeCreateHooks(vnode, insertedVnodeQueue);
                    }
                    insert(parentElm, vnode.elm, refElm);
                }

                if ("development" !== 'production' && data && data.pre) {
                    inPre--;
                }
            } else if (vnode.isComment) {
                vnode.elm = nodeOps.createComment(vnode.text);
                insert(parentElm, vnode.elm, refElm);
            } else {
                vnode.elm = nodeOps.createTextNode(vnode.text);
                insert(parentElm, vnode.elm, refElm);
            }
        }

        function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
            var i = vnode.data;
            if (isDef(i)) {
                var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
                if (isDef(i = i.hook) && isDef(i = i.init)) {
                    i(vnode, false /* hydrating */ , parentElm, refElm);
                }
                // after calling the init hook, if the vnode is a child component
                // it should've created a child instance and mounted it. the child
                // component also has set the placeholder vnode's elm.
                // in that case we can just return the element and be done.
                // 调用init钩子之后，如果vnode是子组件，那么它应该已经创建好一个子实例并mounted了。
                // 这个子组件还应该设置vnode的元素占位符。在这种情况下，我们可以仅返回元素并完成。
                if (isDef(vnode.componentInstance)) {
                    initComponent(vnode, insertedVnodeQueue);
                    if (isReactivated) {
                        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
                    }
                    return true
                }
            }
        }

        function initComponent(vnode, insertedVnodeQueue) {
            if (vnode.data.pendingInsert) {
                insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
            }
            vnode.elm = vnode.componentInstance.$el;
            if (isPatchable(vnode)) {
                invokeCreateHooks(vnode, insertedVnodeQueue);
                setScope(vnode);
            } else {
                // empty component root.
                // skip all element-related modules except for ref (#3455)
                registerRef(vnode);
                // make sure to invoke the insert hook
                insertedVnodeQueue.push(vnode);
            }
        }
        // 激活组件
        function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
            var i;
            // hack for #4339: a reactivated component with inner transition
            // does not trigger because the inner node's created hooks are not called
            // again. It's not ideal to involve module-specific logic in here but
            // there doesn't seem to be a better way to do it.
            // 通过内部转换重新激活的组件不会触发，因为内部节点创建的钩子不会被再次调用。
            // 在这里，涉及特殊模块的逻辑并不理想，但似乎没有更好的方法来实现它。
            var innerNode = vnode;
            while (innerNode.componentInstance) {
                innerNode = innerNode.componentInstance._vnode;
                if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
                    for (i = 0; i < cbs.activate.length; ++i) {
                        cbs.activate[i](emptyNode, innerNode);
                    }
                    insertedVnodeQueue.push(innerNode);
                    break
                }
            }
            // unlike a newly created component,
            // a reactivated keep-alive component doesn't insert itself
            insert(parentElm, vnode.elm, refElm);
        }
        // 插入元素
        function insert(parent, elm, ref) {
            if (parent) {
                if (ref) {
                    nodeOps.insertBefore(parent, elm, ref);
                } else {
                    nodeOps.appendChild(parent, elm);
                }
            }
        }
        // 创建子节点
        function createChildren(vnode, children, insertedVnodeQueue) {
            if (Array.isArray(children)) {
                for (var i = 0; i < children.length; ++i) {
                    createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
                }
            } else if (isPrimitive(vnode.text)) {
                nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
            }
        }
        // 是否可以打补丁
        function isPatchable(vnode) {
            while (vnode.componentInstance) {
                vnode = vnode.componentInstance._vnode;
            }
            return isDef(vnode.tag)
        }
        // 唤醒创建的钩子函数
        function invokeCreateHooks(vnode, insertedVnodeQueue) {
            for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, vnode);
            }
            i = vnode.data.hook; // Reuse variable
            if (isDef(i)) {
                if (i.create) { i.create(emptyNode, vnode); }
                if (i.insert) { insertedVnodeQueue.push(vnode); }
            }
        }

        // set scope id attribute for scoped CSS.
        // this is implemented as a special case to avoid the overhead
        // of going through the normal attribute patching process.
        // 为scoped css设置scoped id，这里做了一个特殊的处理，是为了避免越过正常属性的补丁处理。
        function setScope(vnode) {
            var i;
            if (isDef(i = vnode.context) && isDef(i = i.$options._scopeId)) {
                nodeOps.setAttribute(vnode.elm, i, '');
            }
            if (isDef(i = activeInstance) &&
                i !== vnode.context &&
                isDef(i = i.$options._scopeId)) {
                nodeOps.setAttribute(vnode.elm, i, '');
            }
        }

        function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
            for (; startIdx <= endIdx; ++startIdx) {
                createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
            }
        }

        function invokeDestroyHook(vnode) {
            var i, j;
            var data = vnode.data;
            if (isDef(data)) {
                if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
                for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
            }
            if (isDef(i = vnode.children)) {
                for (j = 0; j < vnode.children.length; ++j) {
                    invokeDestroyHook(vnode.children[j]);
                }
            }
        }

        function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
            for (; startIdx <= endIdx; ++startIdx) {
                var ch = vnodes[startIdx];
                if (isDef(ch)) {
                    if (isDef(ch.tag)) {
                        removeAndInvokeRemoveHook(ch);
                        invokeDestroyHook(ch);
                    } else { // Text node
                        removeNode(ch.elm);
                    }
                }
            }
        }

        function removeAndInvokeRemoveHook(vnode, rm) {
            if (rm || isDef(vnode.data)) {
                var listeners = cbs.remove.length + 1;
                if (!rm) {
                    // directly removing
                    // 直接移除
                    rm = createRmCb(vnode.elm, listeners);
                } else {
                    // we have a recursively passed down rm callback
                    // increase the listeners count
                    rm.listeners += listeners;
                }
                // recursively invoke hooks on child component root node
                if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
                    removeAndInvokeRemoveHook(i, rm);
                }
                for (i = 0; i < cbs.remove.length; ++i) {
                    cbs.remove[i](vnode, rm);
                }
                if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
                    i(vnode, rm);
                } else {
                    rm();
                }
            } else {
                removeNode(vnode.elm);
            }
        }

        function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
            var oldStartIdx = 0;
            var newStartIdx = 0;
            var oldEndIdx = oldCh.length - 1;
            var oldStartVnode = oldCh[0];
            var oldEndVnode = oldCh[oldEndIdx];
            var newEndIdx = newCh.length - 1;
            var newStartVnode = newCh[0];
            var newEndVnode = newCh[newEndIdx];
            var oldKeyToIdx, idxInOld, elmToMove, refElm;

            // removeOnly is a special flag used only by <transition-group>
            // to ensure removed elements stay in correct relative positions
            // during leaving transitions
            var canMove = !removeOnly;

            while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                if (isUndef(oldStartVnode)) {
                    oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
                } else if (isUndef(oldEndVnode)) {
                    oldEndVnode = oldCh[--oldEndIdx];
                } else if (sameVnode(oldStartVnode, newStartVnode)) {
                    patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                    oldStartVnode = oldCh[++oldStartIdx];
                    newStartVnode = newCh[++newStartIdx];
                } else if (sameVnode(oldEndVnode, newEndVnode)) {
                    patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newEndVnode = newCh[--newEndIdx];
                } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
                    patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                    canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
                    oldStartVnode = oldCh[++oldStartIdx];
                    newEndVnode = newCh[--newEndIdx];
                } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
                    patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                    canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newStartVnode = newCh[++newStartIdx];
                } else {
                    if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
                    idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
                    if (isUndef(idxInOld)) { // New element
                        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
                        newStartVnode = newCh[++newStartIdx];
                    } else {
                        elmToMove = oldCh[idxInOld];
                        /* istanbul ignore if */
                        if ("development" !== 'production' && !elmToMove) {
                            warn(
                                'It seems there are duplicate keys that is causing an update error. ' +
                                'Make sure each v-for item has a unique key.'
                            );
                        }
                        if (sameVnode(elmToMove, newStartVnode)) {
                            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                            oldCh[idxInOld] = undefined;
                            canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
                            newStartVnode = newCh[++newStartIdx];
                        } else {
                            // same key but different element. treat as new element
                            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
                            newStartVnode = newCh[++newStartIdx];
                        }
                    }
                }
            }
            if (oldStartIdx > oldEndIdx) {
                refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
                addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
            } else if (newStartIdx > newEndIdx) {
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
            }
        }
        // 节点打补丁
        function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
            if (oldVnode === vnode) {
                return
            }
            // reuse element for static trees.
            // note we only do this if the vnode is cloned -
            // if the new node is not cloned it means the render functions have been
            // reset by the hot-reload-api and we need to do a proper re-render.
            // 静态树重用元素
            // 如果vnode被克隆了，会通知我们只需重用静态树元素。如果新节点没有被克隆，意味着渲染函数已经被API热加载重置了，我们需要适当的重新渲染。
            if (vnode.isStatic &&
                oldVnode.isStatic &&
                vnode.key === oldVnode.key &&
                (vnode.isCloned || vnode.isOnce)) {
                vnode.elm = oldVnode.elm;
                vnode.componentInstance = oldVnode.componentInstance;
                return
            }
            // 如果新节点没有被克隆，意味着渲染函数已经被API热加载重置了，我们需要适当的重新渲染。
            var i;
            var data = vnode.data;
            var hasData = isDef(data);
            if (hasData && isDef(i = data.hook) && isDef(i = i.prepatch)) {
                i(oldVnode, vnode);
            }
            var elm = vnode.elm = oldVnode.elm;
            var oldCh = oldVnode.children;
            var ch = vnode.children;
            if (hasData && isPatchable(vnode)) {
                for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
                if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
            }
            if (isUndef(vnode.text)) {
                if (isDef(oldCh) && isDef(ch)) {
                    if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
                } else if (isDef(ch)) {
                    if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
                    addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
                } else if (isDef(oldCh)) {
                    removeVnodes(elm, oldCh, 0, oldCh.length - 1);
                } else if (isDef(oldVnode.text)) {
                    nodeOps.setTextContent(elm, '');
                }
            } else if (oldVnode.text !== vnode.text) {
                nodeOps.setTextContent(elm, vnode.text);
            }
            if (hasData) {
                if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
            }
        }

        function invokeInsertHook(vnode, queue, initial) {
            // delay insert hooks for component root nodes, invoke them after the
            // element is really inserted
            // 组件根节点插入钩子函数时，需要延迟，所有元素都插入完成后再唤醒。
            if (initial && vnode.parent) {
                vnode.parent.data.pendingInsert = queue;
            } else {
                for (var i = 0; i < queue.length; ++i) {
                    queue[i].data.hook.insert(queue[i]);
                }
            }
        }

        var bailed = false;
        // list of modules that can skip create hook during hydration because they
        // are already rendered on the client or has no need for initialization
        // modules列表组合时可以跳过钩子函数创建，因为它们已经呈现在客户端上，或者不需要初始化。
        var isRenderedModule = makeMap('attrs,style,class,staticClass,staticStyle,key');

        // Note: this is a browser-only function so we can assume elms are DOM nodes.
        // 这个功能只用在浏览器上，所以我们可以假设元素全部是dom节点
        function hydrate(elm, vnode, insertedVnodeQueue) {
            {
                if (!assertNodeMatch(elm, vnode)) {
                    return false
                }
            }
            vnode.elm = elm;
            var tag = vnode.tag;
            var data = vnode.data;
            var children = vnode.children;
            if (isDef(data)) {
                if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */ ); }
                if (isDef(i = vnode.componentInstance)) {
                    // child component. it should have hydrated its own tree.
                    initComponent(vnode, insertedVnodeQueue);
                    return true
                }
            }
            if (isDef(tag)) {
                if (isDef(children)) {
                    // empty element, allow client to pick up and populate children
                    if (!elm.hasChildNodes()) {
                        createChildren(vnode, children, insertedVnodeQueue);
                    } else {
                        var childrenMatch = true;
                        var childNode = elm.firstChild;
                        for (var i$1 = 0; i$1 < children.length; i$1++) {
                            if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue)) {
                                childrenMatch = false;
                                break
                            }
                            childNode = childNode.nextSibling;
                        }
                        // if childNode is not null, it means the actual childNodes list is
                        // longer than the virtual children list.
                        if (!childrenMatch || childNode) {
                            if ("development" !== 'production' &&
                                typeof console !== 'undefined' &&
                                !bailed) {
                                bailed = true;
                                console.warn('Parent: ', elm);
                                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
                            }
                            return false
                        }
                    }
                }
                if (isDef(data)) {
                    for (var key in data) {
                        if (!isRenderedModule(key)) {
                            invokeCreateHooks(vnode, insertedVnodeQueue);
                            break
                        }
                    }
                }
            } else if (elm.data !== vnode.text) {
                elm.data = vnode.text;
            }
            return true
        }
        // 节点是否匹配
        function assertNodeMatch(node, vnode) {
            if (vnode.tag) {
                return (
                    vnode.tag.indexOf('vue-component') === 0 ||
                    vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
                )
            } else {
                return node.nodeType === (vnode.isComment ? 8 : 3)
            }
        }
        // 如果vnode不存在但是oldVnode存在，就意味着要销毁
        // 如果oldVnode不存在但是vnode存在，说明意图是要创建新节点
        // 当vnode和oldVnode都存在时，就需要更新
        return function patch(oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
            if (!vnode) {
                if (oldVnode) { invokeDestroyHook(oldVnode); }
                return
            }

            var isInitialPatch = false;
            var insertedVnodeQueue = [];

            if (!oldVnode) {
                // empty mount (likely as component), create new root element
                isInitialPatch = true;
                createElm(vnode, insertedVnodeQueue, parentElm, refElm);
            } else {
                var isRealElement = isDef(oldVnode.nodeType);
                if (!isRealElement && sameVnode(oldVnode, vnode)) {
                    // patch existing root node
                    patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
                } else {
                    if (isRealElement) {
                        // mounting to a real element
                        // check if this is server-rendered content and if we can perform
                        // a successful hydration.
                        if (oldVnode.nodeType === 1 && oldVnode.hasAttribute('server-rendered')) {
                            oldVnode.removeAttribute('server-rendered');
                            hydrating = true;
                        }
                        if (hydrating) {
                            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                                invokeInsertHook(vnode, insertedVnodeQueue, true);
                                return oldVnode
                            } else {
                                warn(
                                    'The client-side rendered virtual DOM tree is not matching ' +
                                    'server-rendered content. This is likely caused by incorrect ' +
                                    'HTML markup, for example nesting block-level elements inside ' +
                                    '<p>, or missing <tbody>. Bailing hydration and performing ' +
                                    'full client-side render.'
                                );
                            }
                        }
                        // either not server-rendered, or hydration failed.
                        // create an empty node and replace it
                        oldVnode = emptyNodeAt(oldVnode);
                    }
                    // replacing existing element
                    var oldElm = oldVnode.elm;
                    var parentElm$1 = nodeOps.parentNode(oldElm);
                    createElm(
                        vnode,
                        insertedVnodeQueue,
                        // extremely rare edge case: do not insert if old element is in a
                        // leaving transition. Only happens when combining transition +
                        // keep-alive + HOCs. (#4590)
                        oldElm._leaveCb ? null : parentElm$1,
                        nodeOps.nextSibling(oldElm)
                    );

                    if (vnode.parent) {
                        // component root element replaced.
                        // update parent placeholder node element, recursively
                        var ancestor = vnode.parent;
                        while (ancestor) {
                            ancestor.elm = vnode.elm;
                            ancestor = ancestor.parent;
                        }
                        if (isPatchable(vnode)) {
                            for (var i = 0; i < cbs.create.length; ++i) {
                                cbs.create[i](emptyNode, vnode.parent);
                            }
                        }
                    }

                    if (parentElm$1 !== null) {
                        removeVnodes(parentElm$1, [oldVnode], 0, 0);
                    } else if (isDef(oldVnode.tag)) {
                        invokeDestroyHook(oldVnode);
                    }
                }
            }

            invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
            return vnode.elm
        }
    }

    /*  */

    var directives = {
        create: updateDirectives,
        update: updateDirectives,
        destroy: function unbindDirectives(vnode) {
            updateDirectives(vnode, emptyNode);
        }
    };

    function updateDirectives(oldVnode, vnode) {
        if (oldVnode.data.directives || vnode.data.directives) {
            _update(oldVnode, vnode);
        }
    }
    // 通过update对比vnode绘制到页面
    function _update(oldVnode, vnode) {
        var isCreate = oldVnode === emptyNode;
        var isDestroy = vnode === emptyNode;
        var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
        var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

        var dirsWithInsert = [];
        var dirsWithPostpatch = [];

        var key, oldDir, dir;
        for (key in newDirs) {
            oldDir = oldDirs[key];
            dir = newDirs[key];
            if (!oldDir) {
                // new directive, bind
                callHook$1(dir, 'bind', vnode, oldVnode);
                if (dir.def && dir.def.inserted) {
                    dirsWithInsert.push(dir);
                }
            } else {
                // existing directive, update
                dir.oldValue = oldDir.value;
                callHook$1(dir, 'update', vnode, oldVnode);
                if (dir.def && dir.def.componentUpdated) {
                    dirsWithPostpatch.push(dir);
                }
            }
        }

        if (dirsWithInsert.length) {
            var callInsert = function() {
                for (var i = 0; i < dirsWithInsert.length; i++) {
                    callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
                }
            };
            if (isCreate) {
                mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert, 'dir-insert');
            } else {
                callInsert();
            }
        }

        if (dirsWithPostpatch.length) {
            mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function() {
                for (var i = 0; i < dirsWithPostpatch.length; i++) {
                    callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
                }
            }, 'dir-postpatch');
        }

        if (!isCreate) {
            for (key in oldDirs) {
                if (!newDirs[key]) {
                    // no longer present, unbind
                    callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
                }
            }
        }
    }

    var emptyModifiers = Object.create(null);

    function normalizeDirectives$1(
        dirs,
        vm
    ) {
        var res = Object.create(null);
        if (!dirs) {
            return res
        }
        var i, dir;
        for (i = 0; i < dirs.length; i++) {
            dir = dirs[i];
            if (!dir.modifiers) {
                dir.modifiers = emptyModifiers;
            }
            res[getRawDirName(dir)] = dir;
            dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
        }
        return res
    }

    function getRawDirName(dir) {
        return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
    }

    function callHook$1(dir, hook, vnode, oldVnode, isDestroy) {
        var fn = dir.def && dir.def[hook];
        if (fn) {
            fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
        }
    }

    var baseModules = [
        ref,
        directives
    ];

    /*  */

    function updateAttrs(oldVnode, vnode) {
        if (!oldVnode.data.attrs && !vnode.data.attrs) {
            return
        }
        var key, cur, old;
        var elm = vnode.elm;
        var oldAttrs = oldVnode.data.attrs || {};
        var attrs = vnode.data.attrs || {};
        // clone observed objects, as the user probably wants to mutate it
        if (attrs.__ob__) {
            attrs = vnode.data.attrs = extend({}, attrs);
        }

        for (key in attrs) {
            cur = attrs[key];
            old = oldAttrs[key];
            if (old !== cur) {
                setAttr(elm, key, cur);
            }
        }
        // #4391: in IE9, setting type can reset value for input[type=radio]
        /* istanbul ignore if */
        if (isIE9 && attrs.value !== oldAttrs.value) {
            setAttr(elm, 'value', attrs.value);
        }
        for (key in oldAttrs) {
            if (attrs[key] == null) {
                if (isXlink(key)) {
                    elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
                } else if (!isEnumeratedAttr(key)) {
                    elm.removeAttribute(key);
                }
            }
        }
    }

    function setAttr(el, key, value) {
        if (isBooleanAttr(key)) {
            // set attribute for blank value
            // e.g. <option disabled>Select one</option>
            if (isFalsyAttrValue(value)) {
                el.removeAttribute(key);
            } else {
                el.setAttribute(key, key);
            }
        } else if (isEnumeratedAttr(key)) {
            el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
        } else if (isXlink(key)) {
            if (isFalsyAttrValue(value)) {
                el.removeAttributeNS(xlinkNS, getXlinkProp(key));
            } else {
                el.setAttributeNS(xlinkNS, key, value);
            }
        } else {
            if (isFalsyAttrValue(value)) {
                el.removeAttribute(key);
            } else {
                el.setAttribute(key, value);
            }
        }
    }

    var attrs = {
        create: updateAttrs,
        update: updateAttrs
    };

    /*  */

    function updateClass(oldVnode, vnode) {
        var el = vnode.elm;
        var data = vnode.data;
        var oldData = oldVnode.data;
        if (!data.staticClass && !data.class &&
            (!oldData || (!oldData.staticClass && !oldData.class))) {
            return
        }

        var cls = genClassForVnode(vnode);

        // handle transition classes
        var transitionClass = el._transitionClasses;
        if (transitionClass) {
            cls = concat(cls, stringifyClass(transitionClass));
        }

        // set the class
        if (cls !== el._prevClass) {
            el.setAttribute('class', cls);
            el._prevClass = cls;
        }
    }

    var klass = {
        create: updateClass,
        update: updateClass
    };

    /*  */

    var target$1;

    function add$2(
        event,
        handler,
        once,
        capture
    ) {
        if (once) {
            var oldHandler = handler;
            var _target = target$1; // save current target element in closure
            handler = function(ev) {
                remove$3(event, handler, capture, _target);
                arguments.length === 1 ?
                    oldHandler(ev) :
                    oldHandler.apply(null, arguments);
            };
        }
        target$1.addEventListener(event, handler, capture);
    }

    function remove$3(
        event,
        handler,
        capture,
        _target
    ) {
        (_target || target$1).removeEventListener(event, handler, capture);
    }

    function updateDOMListeners(oldVnode, vnode) {
        if (!oldVnode.data.on && !vnode.data.on) {
            return
        }
        var on = vnode.data.on || {};
        var oldOn = oldVnode.data.on || {};
        target$1 = vnode.elm;
        updateListeners(on, oldOn, add$2, remove$3, vnode.context);
    }

    var events = {
        create: updateDOMListeners,
        update: updateDOMListeners
    };

    /*  */

    function updateDOMProps(oldVnode, vnode) {
        if (!oldVnode.data.domProps && !vnode.data.domProps) {
            return
        }
        var key, cur;
        var elm = vnode.elm;
        var oldProps = oldVnode.data.domProps || {};
        var props = vnode.data.domProps || {};
        // clone observed objects, as the user probably wants to mutate it
        if (props.__ob__) {
            props = vnode.data.domProps = extend({}, props);
        }

        for (key in oldProps) {
            if (props[key] == null) {
                elm[key] = '';
            }
        }
        for (key in props) {
            cur = props[key];
            // ignore children if the node has textContent or innerHTML,
            // as these will throw away existing DOM nodes and cause removal errors
            // on subsequent patches (#3360)
            if (key === 'textContent' || key === 'innerHTML') {
                if (vnode.children) { vnode.children.length = 0; }
                if (cur === oldProps[key]) { continue }
            }

            if (key === 'value') {
                // store value as _value as well since
                // non-string values will be stringified
                elm._value = cur;
                // avoid resetting cursor position when value is the same
                var strCur = cur == null ? '' : String(cur);
                if (shouldUpdateValue(elm, vnode, strCur)) {
                    elm.value = strCur;
                }
            } else {
                elm[key] = cur;
            }
        }
    }

    // check platforms/web/util/attrs.js acceptValue


    function shouldUpdateValue(
        elm,
        vnode,
        checkVal
    ) {
        return (!elm.composing && (
            vnode.tag === 'option' ||
            isDirty(elm, checkVal) ||
            isInputChanged(vnode, checkVal)
        ))
    }
    // 是否是脏数据
    function isDirty(elm, checkVal) {
        // return true when textbox (.number and .trim) loses focus and its value is not equal to the updated value
        // 失去焦点或者值不等于更新后的值时为true
        // document.activeElement 当前获得焦点的元素
        return document.activeElement !== elm && elm.value !== checkVal
    }
    // input值是否发生改变
    function isInputChanged(vnode, newVal) {
        var value = vnode.elm.value;
        var modifiers = vnode.elm._vModifiers; // injected by v-model runtime
        if ((modifiers && modifiers.number) || vnode.elm.type === 'number') {
            return toNumber(value) !== toNumber(newVal)
        }
        if (modifiers && modifiers.trim) {
            return value.trim() !== newVal.trim()
        }
        return value !== newVal
    }

    var domProps = {
        create: updateDOMProps,
        update: updateDOMProps
    };

    /*  */
    // 解析样式
    var parseStyleText = cached(function(cssText) {
        var res = {};
        var listDelimiter = /;(?![^(]*\))/g;
        var propertyDelimiter = /:(.+)/;
        cssText.split(listDelimiter).forEach(function(item) {
            if (item) {
                var tmp = item.split(propertyDelimiter);
                tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
            }
        });
        return res
    });

    // merge static and dynamic style data on the same vnode
    //
    function normalizeStyleData(data) {
        var style = normalizeStyleBinding(data.style);
        // static style is pre-processed into an object during compilation
        // and is always a fresh object, so it's safe to merge into it
        return data.staticStyle ?
            extend(data.staticStyle, style) :
            style
    }

    // normalize possible array / string values into Object
    // 标准化array/string格式样式成对象格式
    function normalizeStyleBinding(bindingStyle) {
        if (Array.isArray(bindingStyle)) {
            return toObject(bindingStyle)
        }
        if (typeof bindingStyle === 'string') {
            return parseStyleText(bindingStyle)
        }
        return bindingStyle
    }

    /**
     * parent component style should be after child's
     * so that parent component's style could override it
     * 父组件样式需要加在子组件后面，这样优先级高于子组件。
     */
    function getStyle(vnode, checkChild) {
        var res = {};
        var styleData;

        if (checkChild) {
            var childNode = vnode;
            while (childNode.componentInstance) {
                childNode = childNode.componentInstance._vnode;
                if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
                    extend(res, styleData);
                }
            }
        }

        if ((styleData = normalizeStyleData(vnode.data))) {
            extend(res, styleData);
        }

        var parentNode = vnode;
        while ((parentNode = parentNode.parent)) {
            if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
                extend(res, styleData);
            }
        }
        return res
    }

    /*  */

    var cssVarRE = /^--/;
    var importantRE = /\s*!important$/;
    // 设置样式属性
    var setProp = function(el, name, val) {
        /* istanbul ignore if */
        if (cssVarRE.test(name)) {
            el.style.setProperty(name, val);
        } else if (importantRE.test(val)) {
            el.style.setProperty(name, val.replace(importantRE, ''), 'important');
        } else {
            el.style[normalize(name)] = val;
        }
    };

    var prefixes = ['Webkit', 'Moz', 'ms'];

    var testEl;
    var normalize = cached(function(prop) {
        testEl = testEl || document.createElement('div');
        prop = camelize(prop);
        if (prop !== 'filter' && (prop in testEl.style)) {
            return prop
        }
        var upper = prop.charAt(0).toUpperCase() + prop.slice(1);
        for (var i = 0; i < prefixes.length; i++) {
            var prefixed = prefixes[i] + upper;
            if (prefixed in testEl.style) {
                return prefixed
            }
        }
    });
    // 更新样式
    function updateStyle(oldVnode, vnode) {
        var data = vnode.data;
        var oldData = oldVnode.data;

        if (!data.staticStyle && !data.style &&
            !oldData.staticStyle && !oldData.style) {
            return
        }

        var cur, name;
        var el = vnode.elm;
        var oldStaticStyle = oldVnode.data.staticStyle;
        var oldStyleBinding = oldVnode.data.style || {};

        // if static style exists, stylebinding already merged into it when doing normalizeStyleData
        var oldStyle = oldStaticStyle || oldStyleBinding;

        var style = normalizeStyleBinding(vnode.data.style) || {};

        vnode.data.style = style.__ob__ ? extend({}, style) : style;

        var newStyle = getStyle(vnode, true);

        for (name in oldStyle) {
            if (newStyle[name] == null) {
                setProp(el, name, '');
            }
        }
        for (name in newStyle) {
            cur = newStyle[name];
            if (cur !== oldStyle[name]) {
                // ie9 setting to null has no effect, must use empty string
                setProp(el, name, cur == null ? '' : cur);
            }
        }
    }

    var style = {
        create: updateStyle,
        update: updateStyle
    };

    /*  */

    /**
     * Add class with compatibility for SVG since classList is not supported on
     * SVG elements in IE
     */
    function addClass(el, cls) {
        /* istanbul ignore if */
        if (!cls || !cls.trim()) {
            return
        }

        /* istanbul ignore else */
        if (el.classList) {
            if (cls.indexOf(' ') > -1) {
                cls.split(/\s+/).forEach(function(c) { return el.classList.add(c); });
            } else {
                el.classList.add(cls);
            }
        } else {
            var cur = ' ' + el.getAttribute('class') + ' ';
            if (cur.indexOf(' ' + cls + ' ') < 0) {
                el.setAttribute('class', (cur + cls).trim());
            }
        }
    }

    /**
     * Remove class with compatibility for SVG since classList is not supported on
     * SVG elements in IE
     */
    function removeClass(el, cls) {
        /* istanbul ignore if */
        if (!cls || !cls.trim()) {
            return
        }

        /* istanbul ignore else */
        if (el.classList) {
            if (cls.indexOf(' ') > -1) {
                cls.split(/\s+/).forEach(function(c) { return el.classList.remove(c); });
            } else {
                el.classList.remove(cls);
            }
        } else {
            var cur = ' ' + el.getAttribute('class') + ' ';
            var tar = ' ' + cls + ' ';
            while (cur.indexOf(tar) >= 0) {
                cur = cur.replace(tar, ' ');
            }
            el.setAttribute('class', cur.trim());
        }
    }

    /*  */

    var hasTransition = inBrowser && !isIE9;
    var TRANSITION = 'transition';
    var ANIMATION = 'animation';

    // Transition property/event sniffing
    var transitionProp = 'transition';
    var transitionEndEvent = 'transitionend';
    var animationProp = 'animation';
    var animationEndEvent = 'animationend';
    if (hasTransition) {
        /* istanbul ignore if */
        if (window.ontransitionend === undefined &&
            window.onwebkittransitionend !== undefined) {
            transitionProp = 'WebkitTransition';
            transitionEndEvent = 'webkitTransitionEnd';
        }
        if (window.onanimationend === undefined &&
            window.onwebkitanimationend !== undefined) {
            animationProp = 'WebkitAnimation';
            animationEndEvent = 'webkitAnimationEnd';
        }
    }

    // binding to window is necessary to make hot reload work in IE in strict mode
    
    // requestAnimationFrame 绘图新技术 不同于settimeout 和 setinterval 优点多多
    var raf = inBrowser && window.requestAnimationFrame ?
        window.requestAnimationFrame.bind(window) :
        setTimeout;
    // 下一帧
    function nextFrame(fn) {
        raf(function() {
            raf(fn);
        });
    }

    function addTransitionClass(el, cls) {
        (el._transitionClasses || (el._transitionClasses = [])).push(cls);
        addClass(el, cls);
    }

    function removeTransitionClass(el, cls) {
        if (el._transitionClasses) {
            remove$1(el._transitionClasses, cls);
        }
        removeClass(el, cls);
    }

    function whenTransitionEnds(
        el,
        expectedType,
        cb
    ) {
        var ref = getTransitionInfo(el, expectedType);
        var type = ref.type;
        var timeout = ref.timeout;
        var propCount = ref.propCount;
        if (!type) { return cb() }
        var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
        var ended = 0;
        var end = function() {
            el.removeEventListener(event, onEnd);
            cb();
        };
        var onEnd = function(e) {
            if (e.target === el) {
                if (++ended >= propCount) {
                    end();
                }
            }
        };
        setTimeout(function() {
            if (ended < propCount) {
                end();
            }
        }, timeout + 1);
        el.addEventListener(event, onEnd);
    }

    var transformRE = /\b(transform|all)(,|$)/;

    function getTransitionInfo(el, expectedType) {
        var styles = window.getComputedStyle(el);
        var transitioneDelays = styles[transitionProp + 'Delay'].split(', ');
        var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
        var transitionTimeout = getTimeout(transitioneDelays, transitionDurations);
        var animationDelays = styles[animationProp + 'Delay'].split(', ');
        var animationDurations = styles[animationProp + 'Duration'].split(', ');
        var animationTimeout = getTimeout(animationDelays, animationDurations);

        var type;
        var timeout = 0;
        var propCount = 0;
        /* istanbul ignore if */
        if (expectedType === TRANSITION) {
            if (transitionTimeout > 0) {
                type = TRANSITION;
                timeout = transitionTimeout;
                propCount = transitionDurations.length;
            }
        } else if (expectedType === ANIMATION) {
            if (animationTimeout > 0) {
                type = ANIMATION;
                timeout = animationTimeout;
                propCount = animationDurations.length;
            }
        } else {
            timeout = Math.max(transitionTimeout, animationTimeout);
            type = timeout > 0 ?
                transitionTimeout > animationTimeout ?
                TRANSITION :
                ANIMATION :
                null;
            propCount = type ?
                type === TRANSITION ?
                transitionDurations.length :
                animationDurations.length :
                0;
        }
        var hasTransform =
            type === TRANSITION &&
            transformRE.test(styles[transitionProp + 'Property']);
        return {
            type: type,
            timeout: timeout,
            propCount: propCount,
            hasTransform: hasTransform
        }
    }

    function getTimeout(delays, durations) {
        /* istanbul ignore next */
        while (delays.length < durations.length) {
            delays = delays.concat(delays);
        }

        return Math.max.apply(null, durations.map(function(d, i) {
            return toMs(d) + toMs(delays[i])
        }))
    }

    function toMs(s) {
        return Number(s.slice(0, -1)) * 1000
    }

    /*  */

    function enter(vnode, toggleDisplay) {
        var el = vnode.elm;

        // call leave callback now
        if (el._leaveCb) {
            el._leaveCb.cancelled = true;
            el._leaveCb();
        }

        var data = resolveTransition(vnode.data.transition);
        if (!data) {
            return
        }

        /* istanbul ignore if */
        if (el._enterCb || el.nodeType !== 1) {
            return
        }

        var css = data.css;
        var type = data.type;
        var enterClass = data.enterClass;
        var enterToClass = data.enterToClass;
        var enterActiveClass = data.enterActiveClass;
        var appearClass = data.appearClass;
        var appearToClass = data.appearToClass;
        var appearActiveClass = data.appearActiveClass;
        var beforeEnter = data.beforeEnter;
        var enter = data.enter;
        var afterEnter = data.afterEnter;
        var enterCancelled = data.enterCancelled;
        var beforeAppear = data.beforeAppear;
        var appear = data.appear;
        var afterAppear = data.afterAppear;
        var appearCancelled = data.appearCancelled;

        // activeInstance will always be the <transition> component managing this
        // transition. One edge case to check is when the <transition> is placed
        // as the root node of a child component. In that case we need to check
        // <transition>'s parent for appear check.
        var context = activeInstance;
        var transitionNode = activeInstance.$vnode;
        while (transitionNode && transitionNode.parent) {
            transitionNode = transitionNode.parent;
            context = transitionNode.context;
        }

        var isAppear = !context._isMounted || !vnode.isRootInsert;

        if (isAppear && !appear && appear !== '') {
            return
        }

        var startClass = isAppear ? appearClass : enterClass;
        var activeClass = isAppear ? appearActiveClass : enterActiveClass;
        var toClass = isAppear ? appearToClass : enterToClass;
        var beforeEnterHook = isAppear ? (beforeAppear || beforeEnter) : beforeEnter;
        var enterHook = isAppear ? (typeof appear === 'function' ? appear : enter) : enter;
        var afterEnterHook = isAppear ? (afterAppear || afterEnter) : afterEnter;
        var enterCancelledHook = isAppear ? (appearCancelled || enterCancelled) : enterCancelled;

        var expectsCSS = css !== false && !isIE9;
        var userWantsControl =
            enterHook &&
            // enterHook may be a bound method which exposes
            // the length of original fn as _length
            (enterHook._length || enterHook.length) > 1;

        var cb = el._enterCb = once(function() {
            if (expectsCSS) {
                removeTransitionClass(el, toClass);
                removeTransitionClass(el, activeClass);
            }
            if (cb.cancelled) {
                if (expectsCSS) {
                    removeTransitionClass(el, startClass);
                }
                enterCancelledHook && enterCancelledHook(el);
            } else {
                afterEnterHook && afterEnterHook(el);
            }
            el._enterCb = null;
        });

        if (!vnode.data.show) {
            // remove pending leave element on enter by injecting an insert hook
            mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function() {
                var parent = el.parentNode;
                var pendingNode = parent && parent._pending && parent._pending[vnode.key];
                if (pendingNode &&
                    pendingNode.tag === vnode.tag &&
                    pendingNode.elm._leaveCb) {
                    pendingNode.elm._leaveCb();
                }
                enterHook && enterHook(el, cb);
            }, 'transition-insert');
        }

        // start enter transition
        beforeEnterHook && beforeEnterHook(el);
        if (expectsCSS) {
            addTransitionClass(el, startClass);
            addTransitionClass(el, activeClass);
            nextFrame(function() {
                addTransitionClass(el, toClass);
                removeTransitionClass(el, startClass);
                if (!cb.cancelled && !userWantsControl) {
                    whenTransitionEnds(el, type, cb);
                }
            });
        }

        if (vnode.data.show) {
            toggleDisplay && toggleDisplay();
            enterHook && enterHook(el, cb);
        }

        if (!expectsCSS && !userWantsControl) {
            cb();
        }
    }

    function leave(vnode, rm) {
        var el = vnode.elm;

        // call enter callback now
        if (el._enterCb) {
            el._enterCb.cancelled = true;
            el._enterCb();
        }

        var data = resolveTransition(vnode.data.transition);
        if (!data) {
            return rm()
        }

        /* istanbul ignore if */
        if (el._leaveCb || el.nodeType !== 1) {
            return
        }

        var css = data.css;
        var type = data.type;
        var leaveClass = data.leaveClass;
        var leaveToClass = data.leaveToClass;
        var leaveActiveClass = data.leaveActiveClass;
        var beforeLeave = data.beforeLeave;
        var leave = data.leave;
        var afterLeave = data.afterLeave;
        var leaveCancelled = data.leaveCancelled;
        var delayLeave = data.delayLeave;

        var expectsCSS = css !== false && !isIE9;
        var userWantsControl =
            leave &&
            // leave hook may be a bound method which exposes
            // the length of original fn as _length
            (leave._length || leave.length) > 1;

        var cb = el._leaveCb = once(function() {
            if (el.parentNode && el.parentNode._pending) {
                el.parentNode._pending[vnode.key] = null;
            }
            if (expectsCSS) {
                removeTransitionClass(el, leaveToClass);
                removeTransitionClass(el, leaveActiveClass);
            }
            if (cb.cancelled) {
                if (expectsCSS) {
                    removeTransitionClass(el, leaveClass);
                }
                leaveCancelled && leaveCancelled(el);
            } else {
                rm();
                afterLeave && afterLeave(el);
            }
            el._leaveCb = null;
        });

        if (delayLeave) {
            delayLeave(performLeave);
        } else {
            performLeave();
        }

        function performLeave() {
            // the delayed leave may have already been cancelled
            if (cb.cancelled) {
                return
            }
            // record leaving element
            if (!vnode.data.show) {
                (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
            }
            beforeLeave && beforeLeave(el);
            if (expectsCSS) {
                addTransitionClass(el, leaveClass);
                addTransitionClass(el, leaveActiveClass);
                nextFrame(function() {
                    addTransitionClass(el, leaveToClass);
                    removeTransitionClass(el, leaveClass);
                    if (!cb.cancelled && !userWantsControl) {
                        whenTransitionEnds(el, type, cb);
                    }
                });
            }
            leave && leave(el, cb);
            if (!expectsCSS && !userWantsControl) {
                cb();
            }
        }
    }

    function resolveTransition(def$$1) {
        if (!def$$1) {
            return
        }
        /* istanbul ignore else */
        if (typeof def$$1 === 'object') {
            var res = {};
            if (def$$1.css !== false) {
                extend(res, autoCssTransition(def$$1.name || 'v'));
            }
            extend(res, def$$1);
            return res
        } else if (typeof def$$1 === 'string') {
            return autoCssTransition(def$$1)
        }
    }

    var autoCssTransition = cached(function(name) {
        return {
            enterClass: (name + "-enter"),
            leaveClass: (name + "-leave"),
            appearClass: (name + "-enter"),
            enterToClass: (name + "-enter-to"),
            leaveToClass: (name + "-leave-to"),
            appearToClass: (name + "-enter-to"),
            enterActiveClass: (name + "-enter-active"),
            leaveActiveClass: (name + "-leave-active"),
            appearActiveClass: (name + "-enter-active")
        }
    });

    function once(fn) {
        var called = false;
        return function() {
            if (!called) {
                called = true;
                fn();
            }
        }
    }

    function _enter(_, vnode) {
        if (!vnode.data.show) {
            enter(vnode);
        }
    }

    var transition = inBrowser ? {
        create: _enter,
        activate: _enter,
        remove: function remove(vnode, rm) {
            /* istanbul ignore else */
            if (!vnode.data.show) {
                leave(vnode, rm);
            } else {
                rm();
            }
        }
    } : {};

    var platformModules = [
        attrs,
        klass,
        events,
        domProps,
        style,
        transition
    ];

    /*  */

    // the directive module should be applied last, after all
    // built-in modules have been applied.
    var modules = platformModules.concat(baseModules);

    var patch$1 = createPatchFunction({ nodeOps: nodeOps, modules: modules });

    /**
     * Not type checking this file because flow doesn't like attaching
     * properties to Elements.
     */

    var modelableTagRE = /^input|select|textarea|vue-component-[0-9]+(-[0-9a-zA-Z_-]*)?$/;

    /* istanbul ignore if */
    if (isIE9) {
        // http://www.matts411.com/post/internet-explorer-9-oninput/
        document.addEventListener('selectionchange', function() {
            var el = document.activeElement;
            if (el && el.vmodel) {
                trigger(el, 'input');
            }
        });
    }

    var model = {
        inserted: function inserted(el, binding, vnode) {
            {
                if (!modelableTagRE.test(vnode.tag)) {
                    warn(
                        "v-model is not supported on element type: <" + (vnode.tag) + ">. " +
                        'If you are working with contenteditable, it\'s recommended to ' +
                        'wrap a library dedicated for that purpose inside a custom component.',
                        vnode.context
                    );
                }
            }
            if (vnode.tag === 'select') {
                var cb = function() {
                    setSelected(el, binding, vnode.context);
                };
                cb();
                /* istanbul ignore if */
                if (isIE || isEdge) {
                    setTimeout(cb, 0);
                }
            } else if (vnode.tag === 'textarea' || el.type === 'text') {
                el._vModifiers = binding.modifiers;
                if (!binding.modifiers.lazy) {
                    if (!isAndroid) {
                        el.addEventListener('compositionstart', onCompositionStart);
                        el.addEventListener('compositionend', onCompositionEnd);
                    }
                    /* istanbul ignore if */
                    if (isIE9) {
                        el.vmodel = true;
                    }
                }
            }
        },
        componentUpdated: function componentUpdated(el, binding, vnode) {
            if (vnode.tag === 'select') {
                setSelected(el, binding, vnode.context);
                // in case the options rendered by v-for have changed,
                // it's possible that the value is out-of-sync with the rendered options.
                // detect such cases and filter out values that no longer has a matching
                // option in the DOM.
                var needReset = el.multiple ?
                    binding.value.some(function(v) { return hasNoMatchingOption(v, el.options); }) :
                    binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, el.options);
                if (needReset) {
                    trigger(el, 'change');
                }
            }
        }
    };

    function setSelected(el, binding, vm) {
        var value = binding.value;
        var isMultiple = el.multiple;
        if (isMultiple && !Array.isArray(value)) {
            "development" !== 'production' && warn(
                "<select multiple v-model=\"" + (binding.expression) + "\"> " +
                "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
                vm
            );
            return
        }
        var selected, option;
        for (var i = 0, l = el.options.length; i < l; i++) {
            option = el.options[i];
            if (isMultiple) {
                selected = looseIndexOf(value, getValue(option)) > -1;
                if (option.selected !== selected) {
                    option.selected = selected;
                }
            } else {
                if (looseEqual(getValue(option), value)) {
                    if (el.selectedIndex !== i) {
                        el.selectedIndex = i;
                    }
                    return
                }
            }
        }
        if (!isMultiple) {
            el.selectedIndex = -1;
        }
    }

    function hasNoMatchingOption(value, options) {
        for (var i = 0, l = options.length; i < l; i++) {
            if (looseEqual(getValue(options[i]), value)) {
                return false
            }
        }
        return true
    }

    function getValue(option) {
        return '_value' in option ?
            option._value :
            option.value
    }
    // 对于需要输入法编辑器的语言（中文、日文、韩文等），要注意的是，在 IME 字母组合窗口输入时 v-model 并不会更新。如果你想在此期间满足更新需求，请使用 input 事件。
    // 解决v-model中文输入问题
    function onCompositionStart(e) {
        e.target.composing = true;
    }

    function onCompositionEnd(e) {
        e.target.composing = false;
        trigger(e.target, 'input');
    }

    function trigger(el, type) {
        var e = document.createEvent('HTMLEvents');
        e.initEvent(type, true, true);
        el.dispatchEvent(e);
    }

    /*  */

    // recursively search for possible transition defined inside the component root
    // 递归搜索根组件内定义的可能的转换
    function locateNode(vnode) {
        return vnode.componentInstance && (!vnode.data || !vnode.data.transition) ?
            locateNode(vnode.componentInstance._vnode) :
            vnode
    }

    var show = {
        bind: function bind(el, ref, vnode) {
            var value = ref.value;

            vnode = locateNode(vnode);
            var transition = vnode.data && vnode.data.transition;
            var originalDisplay = el.__vOriginalDisplay =
                el.style.display === 'none' ? '' : el.style.display;
            if (value && transition && !isIE9) {
                vnode.data.show = true;
                enter(vnode, function() {
                    el.style.display = originalDisplay;
                });
            } else {
                el.style.display = value ? originalDisplay : 'none';
            }
        },

        update: function update(el, ref, vnode) {
            var value = ref.value;
            var oldValue = ref.oldValue;

            /* istanbul ignore if */
            if (value === oldValue) { return }
            vnode = locateNode(vnode);
            var transition = vnode.data && vnode.data.transition;
            if (transition && !isIE9) {
                vnode.data.show = true;
                if (value) {
                    enter(vnode, function() {
                        el.style.display = el.__vOriginalDisplay;
                    });
                } else {
                    leave(vnode, function() {
                        el.style.display = 'none';
                    });
                }
            } else {
                el.style.display = value ? el.__vOriginalDisplay : 'none';
            }
        },

        unbind: function unbind(
            el,
            binding,
            vnode,
            oldVnode,
            isDestroy
        ) {
            if (!isDestroy) {
                el.style.display = el.__vOriginalDisplay;
            }
        }
    };

    var platformDirectives = {
        model: model,
        show: show
    };

    /*  */

    // Provides transition support for a single element/component.
    // supports transition mode (out-in / in-out)

    var transitionProps = {
        name: String,
        appear: Boolean,
        css: Boolean,
        mode: String,
        type: String,
        enterClass: String,
        leaveClass: String,
        enterToClass: String,
        leaveToClass: String,
        enterActiveClass: String,
        leaveActiveClass: String,
        appearClass: String,
        appearActiveClass: String,
        appearToClass: String
    };

    // in case the child is also an abstract component, e.g. <keep-alive>
    // we want to recursively retrieve the real component to be rendered
    function getRealChild(vnode) {
        var compOptions = vnode && vnode.componentOptions;
        if (compOptions && compOptions.Ctor.options.abstract) {
            return getRealChild(getFirstComponentChild(compOptions.children))
        } else {
            return vnode
        }
    }
    // 导出过渡数据
    function extractTransitionData(comp) {
        var data = {};
        var options = comp.$options;
        // props
        for (var key in options.propsData) {
            data[key] = comp[key];
        }
        // events.
        // extract listeners and pass them directly to the transition methods
        var listeners = options._parentListeners;
        for (var key$1 in listeners) {
            data[camelize(key$1)] = listeners[key$1].fn;
        }
        return data
    }

    function placeholder(h, rawChild) {
        return /\d-keep-alive$/.test(rawChild.tag) ?
            h('keep-alive') :
            null
    }

    function hasParentTransition(vnode) {
        while ((vnode = vnode.parent)) {
            if (vnode.data.transition) {
                return true
            }
        }
    }

    function isSameChild(child, oldChild) {
        return oldChild.key === child.key && oldChild.tag === child.tag
    }

    var Transition = {
        name: 'transition',
        props: transitionProps,
        abstract: true,

        render: function render(h) {
            var this$1 = this;

            var children = this.$slots.default;
            if (!children) {
                return
            }

            // filter out text nodes (possible whitespaces)
            children = children.filter(function(c) { return c.tag; });
            /* istanbul ignore if */
            if (!children.length) {
                return
            }

            // warn multiple elements
            if ("development" !== 'production' && children.length > 1) {
                warn(
                    '<transition> can only be used on a single element. Use ' +
                    '<transition-group> for lists.',
                    this.$parent
                );
            }

            var mode = this.mode;

            // warn invalid mode
            if ("development" !== 'production' &&
                mode && mode !== 'in-out' && mode !== 'out-in') {
                warn(
                    'invalid <transition> mode: ' + mode,
                    this.$parent
                );
            }

            var rawChild = children[0];

            // if this is a component root node and the component's
            // parent container node also has transition, skip.
            if (hasParentTransition(this.$vnode)) {
                return rawChild
            }

            // apply transition data to child
            // use getRealChild() to ignore abstract components e.g. keep-alive
            var child = getRealChild(rawChild);
            /* istanbul ignore if */
            if (!child) {
                return rawChild
            }

            if (this._leaving) {
                return placeholder(h, rawChild)
            }

            // ensure a key that is unique to the vnode type and to this transition
            // component instance. This key will be used to remove pending leaving nodes
            // during entering.
            var id = "__transition-" + (this._uid) + "-";
            var key = child.key = child.key == null ?
                id + child.tag :
                isPrimitive(child.key) ?
                (String(child.key).indexOf(id) === 0 ? child.key : id + child.key) :
                child.key;
            var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
            var oldRawChild = this._vnode;
            var oldChild = getRealChild(oldRawChild);

            // mark v-show
            // so that the transition module can hand over the control to the directive
            if (child.data.directives && child.data.directives.some(function(d) { return d.name === 'show'; })) {
                child.data.show = true;
            }

            if (oldChild && oldChild.data && !isSameChild(child, oldChild)) {
                // replace old child transition data with fresh one
                // important for dynamic transitions!
                var oldData = oldChild && (oldChild.data.transition = extend({}, data));
                // handle transition mode
                if (mode === 'out-in') {
                    // return placeholder node and queue update when leave finishes
                    this._leaving = true;
                    mergeVNodeHook(oldData, 'afterLeave', function() {
                        this$1._leaving = false;
                        this$1.$forceUpdate();
                    }, key);
                    return placeholder(h, rawChild)
                } else if (mode === 'in-out') {
                    var delayedLeave;
                    var performLeave = function() { delayedLeave(); };
                    mergeVNodeHook(data, 'afterEnter', performLeave, key);
                    mergeVNodeHook(data, 'enterCancelled', performLeave, key);
                    mergeVNodeHook(oldData, 'delayLeave', function(leave) {
                        delayedLeave = leave;
                    }, key);
                }
            }

            return rawChild
        }
    };

    /*  */

    // Provides transition support for list items.
    // supports move transitions using the FLIP technique.

    // Because the vdom's children update algorithm is "unstable" - i.e.
    // it doesn't guarantee the relative positioning of removed elements,
    // we force transition-group to update its children into two passes:
    // in the first pass, we remove all nodes that need to be removed,
    // triggering their leaving transition; in the second pass, we insert/move
    // into the final disired state. This way in the second pass removed
    // nodes will remain where they should be.

    var props = extend({
        tag: String,
        moveClass: String
    }, transitionProps);

    delete props.mode;

    var TransitionGroup = {
        props: props,

        render: function render(h) {
            var tag = this.tag || this.$vnode.data.tag || 'span';
            var map = Object.create(null);
            var prevChildren = this.prevChildren = this.children;
            var rawChildren = this.$slots.default || [];
            var children = this.children = [];
            var transitionData = extractTransitionData(this);

            for (var i = 0; i < rawChildren.length; i++) {
                var c = rawChildren[i];
                if (c.tag) {
                    if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
                        children.push(c);
                        map[c.key] = c;
                        (c.data || (c.data = {})).transition = transitionData;
                    } else {
                        var opts = c.componentOptions;
                        var name = opts ?
                            (opts.Ctor.options.name || opts.tag) :
                            c.tag;
                        warn(("<transition-group> children must be keyed: <" + name + ">"));
                    }
                }
            }

            if (prevChildren) {
                var kept = [];
                var removed = [];
                for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
                    var c$1 = prevChildren[i$1];
                    c$1.data.transition = transitionData;
                    c$1.data.pos = c$1.elm.getBoundingClientRect();
                    if (map[c$1.key]) {
                        kept.push(c$1);
                    } else {
                        removed.push(c$1);
                    }
                }
                this.kept = h(tag, null, kept);
                this.removed = removed;
            }

            return h(tag, null, children)
        },

        beforeUpdate: function beforeUpdate() {
            // force removing pass
            this.__patch__(
                this._vnode,
                this.kept,
                false, // hydrating
                true // removeOnly (!important, avoids unnecessary moves)
            );
            this._vnode = this.kept;
        },

        updated: function updated() {
            var children = this.prevChildren;
            var moveClass = this.moveClass || ((this.name || 'v') + '-move');
            if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
                return
            }

            // we divide the work into three loops to avoid mixing DOM reads and writes
            // in each iteration - which helps prevent layout thrashing.
            children.forEach(callPendingCbs);
            children.forEach(recordPosition);
            children.forEach(applyTranslation);

            // force reflow to put everything in position
            var f = document.body.offsetHeight; // eslint-disable-line

            children.forEach(function(c) {
                if (c.data.moved) {
                    var el = c.elm;
                    var s = el.style;
                    addTransitionClass(el, moveClass);
                    s.transform = s.WebkitTransform = s.transitionDuration = '';
                    el.addEventListener(transitionEndEvent, el._moveCb = function cb(e) {
                        if (!e || /transform$/.test(e.propertyName)) {
                            el.removeEventListener(transitionEndEvent, cb);
                            el._moveCb = null;
                            removeTransitionClass(el, moveClass);
                        }
                    });
                }
            });
        },

        methods: {
            hasMove: function hasMove(el, moveClass) {
                /* istanbul ignore if */
                if (!hasTransition) {
                    return false
                }
                if (this._hasMove != null) {
                    return this._hasMove
                }
                addTransitionClass(el, moveClass);
                var info = getTransitionInfo(el);
                removeTransitionClass(el, moveClass);
                return (this._hasMove = info.hasTransform)
            }
        }
    };

    function callPendingCbs(c) {
        /* istanbul ignore if */
        if (c.elm._moveCb) {
            c.elm._moveCb();
        }
        /* istanbul ignore if */
        if (c.elm._enterCb) {
            c.elm._enterCb();
        }
    }

    function recordPosition(c) {
        c.data.newPos = c.elm.getBoundingClientRect();
    }

    function applyTranslation(c) {
        var oldPos = c.data.pos;
        var newPos = c.data.newPos;
        var dx = oldPos.left - newPos.left;
        var dy = oldPos.top - newPos.top;
        if (dx || dy) {
            c.data.moved = true;
            var s = c.elm.style;
            s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
            s.transitionDuration = '0s';
        }
    }

    var platformComponents = {
        Transition: Transition,
        TransitionGroup: TransitionGroup
    };

    /*  */

    // install platform specific utils
    Vue$3.config.isUnknownElement = isUnknownElement;
    Vue$3.config.isReservedTag = isReservedTag;
    Vue$3.config.getTagNamespace = getTagNamespace;
    Vue$3.config.mustUseProp = mustUseProp;

    // install platform runtime directives & components
    extend(Vue$3.options.directives, platformDirectives);
    extend(Vue$3.options.components, platformComponents);

    // install platform patch function
    Vue$3.prototype.__patch__ = inBrowser ? patch$1 : noop;

    // wrap mount
    Vue$3.prototype.$mount = function(
        el,
        hydrating
    ) {
        el = el && inBrowser ? query(el) : undefined;
        return this._mount(el, hydrating)
    };

    if ("development" !== 'production' &&
        inBrowser && typeof console !== 'undefined') {
        console[console.info ? 'info' : 'log'](
            "You are running Vue in development mode.\n" +
            "Make sure to turn on production mode when deploying for production.\n" +
            "See more tips at https://vuejs.org/guide/deployment.html"
        );
    }

    // devtools global hook
    /* istanbul ignore next */
    setTimeout(function() {
        if (config.devtools) {
            if (devtools) {
                devtools.emit('init', Vue$3);
            } else if (
                "development" !== 'production' &&
                inBrowser && !isEdge && /Chrome\/\d+/.test(window.navigator.userAgent)
            ) {
                console[console.info ? 'info' : 'log'](
                    'Download the Vue Devtools extension for a better development experience:\n' +
                    'https://github.com/vuejs/vue-devtools'
                );
            }
        }
    }, 0);

    /*  */

    // check whether current browser encodes a char inside attribute values
    function shouldDecode(content, encoded) {
        var div = document.createElement('div');
        div.innerHTML = "<div a=\"" + content + "\">";
        return div.innerHTML.indexOf(encoded) > 0
    }

    // #3663
    // IE encodes newlines inside attribute values while other browsers don't
    var shouldDecodeNewlines = inBrowser ? shouldDecode('\n', '&#10;') : false;

    /*  */

    var decoder;

    function decode(html) {
        decoder = decoder || document.createElement('div');
        decoder.innerHTML = html;
        return decoder.textContent
    }

    /*  */

    var isUnaryTag = makeMap(
        'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
        'link,meta,param,source,track,wbr',
        true
    );

    // Elements that you can, intentionally, leave open
    // (and which close themselves)
    // 会自闭合的标签
    var canBeLeftOpenTag = makeMap(
        'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source',
        true
    );

    // HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
    // Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
    // 非短语标签
    var isNonPhrasingTag = makeMap(
        'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
        'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
        'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
        'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
        'title,tr,track',
        true
    );

    /**
     * Not type-checking this file because it's mostly vendor code.
     */

    /*!
     * HTML Parser By John Resig (ejohn.org)
     * Modified by Juriy "kangax" Zaytsev
     * Original code by Erik Arvidsson, Mozilla Public License
     * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
     */

    // Regular Expressions for parsing tags and attributes
    var singleAttrIdentifier = /([^\s"'<>/=]+)/;
    var singleAttrAssign = /(?:=)/;
    var singleAttrValues = [
        // attr value double quotes
        /"([^"]*)"+/.source,
        // attr value, single quotes
        /'([^']*)'+/.source,
        // attr value, no quotes
        /([^\s"'=<>`]+)/.source
    ];
    var attribute = new RegExp(
        '^\\s*' + singleAttrIdentifier.source +
        '(?:\\s*(' + singleAttrAssign.source + ')' +
        '\\s*(?:' + singleAttrValues.join('|') + '))?'
    );

    // could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
    // but for Vue templates we can enforce a simple charset
    var ncname = '[a-zA-Z_][\\w\\-\\.]*';
    var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
    var startTagOpen = new RegExp('^<' + qnameCapture);
    var startTagClose = /^\s*(\/?)>/;
    var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
    var doctype = /^<!DOCTYPE [^>]+>/i;
    var comment = /^<!--/;
    var conditionalComment = /^<!\[/;

    var IS_REGEX_CAPTURING_BROKEN = false;
    'x'.replace(/x(.)?/g, function(m, g) {
        IS_REGEX_CAPTURING_BROKEN = g === '';
    });

    // Special Elements (can contain anything)
    var isScriptOrStyle = makeMap('script,style', true);
    var reCache = {};

    var ltRE = /&lt;/g;
    var gtRE = /&gt;/g;
    var nlRE = /&#10;/g;
    var ampRE = /&amp;/g;
    var quoteRE = /&quot;/g;

    function decodeAttr(value, shouldDecodeNewlines) {
        if (shouldDecodeNewlines) {
            value = value.replace(nlRE, '\n');
        }
        return value
            .replace(ltRE, '<')
            .replace(gtRE, '>')
            .replace(ampRE, '&')
            .replace(quoteRE, '"')
    }

    function parseHTML(html, options) {
        var stack = [];
        var expectHTML = options.expectHTML;
        var isUnaryTag$$1 = options.isUnaryTag || no;
        var index = 0;
        var last, lastTag;
        while (html) {
            last = html;
            // Make sure we're not in a script or style element
            if (!lastTag || !isScriptOrStyle(lastTag)) {
                var textEnd = html.indexOf('<');
                if (textEnd === 0) {
                    // Comment:
                    if (comment.test(html)) {
                        var commentEnd = html.indexOf('-->');

                        if (commentEnd >= 0) {
                            advance(commentEnd + 3);
                            continue
                        }
                    }

                    // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
                    if (conditionalComment.test(html)) {
                        var conditionalEnd = html.indexOf(']>');

                        if (conditionalEnd >= 0) {
                            advance(conditionalEnd + 2);
                            continue
                        }
                    }

                    // Doctype:
                    var doctypeMatch = html.match(doctype);
                    if (doctypeMatch) {
                        advance(doctypeMatch[0].length);
                        continue
                    }

                    // End tag:
                    var endTagMatch = html.match(endTag);
                    if (endTagMatch) {
                        var curIndex = index;
                        advance(endTagMatch[0].length);
                        parseEndTag(endTagMatch[1], curIndex, index);
                        continue
                    }

                    // Start tag:
                    var startTagMatch = parseStartTag();
                    if (startTagMatch) {
                        handleStartTag(startTagMatch);
                        continue
                    }
                }

                var text = (void 0),
                    rest$1 = (void 0),
                    next = (void 0);
                if (textEnd > 0) {
                    rest$1 = html.slice(textEnd);
                    while (!endTag.test(rest$1) &&
                        !startTagOpen.test(rest$1) &&
                        !comment.test(rest$1) &&
                        !conditionalComment.test(rest$1)
                    ) {
                        // < in plain text, be forgiving and treat it as text
                        next = rest$1.indexOf('<', 1);
                        if (next < 0) { break }
                        textEnd += next;
                        rest$1 = html.slice(textEnd);
                    }
                    text = html.substring(0, textEnd);
                    advance(textEnd);
                }

                if (textEnd < 0) {
                    text = html;
                    html = '';
                }

                if (options.chars && text) {
                    options.chars(text);
                }
            } else {
                var stackedTag = lastTag.toLowerCase();
                var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
                var endTagLength = 0;
                var rest = html.replace(reStackedTag, function(all, text, endTag) {
                    endTagLength = endTag.length;
                    if (stackedTag !== 'script' && stackedTag !== 'style' && stackedTag !== 'noscript') {
                        text = text
                            .replace(/<!--([\s\S]*?)-->/g, '$1')
                            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
                    }
                    if (options.chars) {
                        options.chars(text);
                    }
                    return ''
                });
                index += html.length - rest.length;
                html = rest;
                parseEndTag(stackedTag, index - endTagLength, index);
            }

            if (html === last && options.chars) {
                options.chars(html);
                break
            }
        }

        // Clean up any remaining tags
        parseEndTag();

        function advance(n) {
            index += n;
            html = html.substring(n);
        }

        function parseStartTag() {
            var start = html.match(startTagOpen);
            if (start) {
                var match = {
                    tagName: start[1],
                    attrs: [],
                    start: index
                };
                advance(start[0].length);
                var end, attr;
                while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                    advance(attr[0].length);
                    match.attrs.push(attr);
                }
                if (end) {
                    match.unarySlash = end[1];
                    advance(end[0].length);
                    match.end = index;
                    return match
                }
            }
        }

        function handleStartTag(match) {
            var tagName = match.tagName;
            var unarySlash = match.unarySlash;

            if (expectHTML) {
                if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
                    parseEndTag(lastTag);
                }
                if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
                    parseEndTag(tagName);
                }
            }

            var unary = isUnaryTag$$1(tagName) || tagName === 'html' && lastTag === 'head' || !!unarySlash;

            var l = match.attrs.length;
            var attrs = new Array(l);
            for (var i = 0; i < l; i++) {
                var args = match.attrs[i];
                // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
                if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
                    if (args[3] === '') { delete args[3]; }
                    if (args[4] === '') { delete args[4]; }
                    if (args[5] === '') { delete args[5]; }
                }
                var value = args[3] || args[4] || args[5] || '';
                attrs[i] = {
                    name: args[1],
                    value: decodeAttr(
                        value,
                        options.shouldDecodeNewlines
                    )
                };
            }

            if (!unary) {
                stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
                lastTag = tagName;
                unarySlash = '';
            }

            if (options.start) {
                options.start(tagName, attrs, unary, match.start, match.end);
            }
        }

        function parseEndTag(tagName, start, end) {
            var pos, lowerCasedTagName;
            if (start == null) { start = index; }
            if (end == null) { end = index; }

            if (tagName) {
                lowerCasedTagName = tagName.toLowerCase();
            }

            // Find the closest opened tag of the same type
            if (tagName) {
                for (pos = stack.length - 1; pos >= 0; pos--) {
                    if (stack[pos].lowerCasedTag === lowerCasedTagName) {
                        break
                    }
                }
            } else {
                // If no tag name is provided, clean shop
                pos = 0;
            }

            if (pos >= 0) {
                // Close all the open elements, up the stack
                for (var i = stack.length - 1; i >= pos; i--) {
                    if (options.end) {
                        options.end(stack[i].tag, start, end);
                    }
                }

                // Remove the open elements from the stack
                stack.length = pos;
                lastTag = pos && stack[pos - 1].tag;
            } else if (lowerCasedTagName === 'br') {
                if (options.start) {
                    options.start(tagName, [], true, start, end);
                }
            } else if (lowerCasedTagName === 'p') {
                if (options.start) {
                    options.start(tagName, [], false, start, end);
                }
                if (options.end) {
                    options.end(tagName, start, end);
                }
            }
        }
    }

    /*  */

    function parseFilters(exp) {
        var inSingle = false;
        var inDouble = false;
        var inTemplateString = false;
        var inRegex = false;
        var curly = 0;
        var square = 0;
        var paren = 0;
        var lastFilterIndex = 0;
        var c, prev, i, expression, filters;

        for (i = 0; i < exp.length; i++) {
            prev = c;
            c = exp.charCodeAt(i);
            if (inSingle) {
                if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
            } else if (inDouble) {
                if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
            } else if (inTemplateString) {
                if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
            } else if (inRegex) {
                if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
            } else if (
                c === 0x7C && // pipe
                exp.charCodeAt(i + 1) !== 0x7C &&
                exp.charCodeAt(i - 1) !== 0x7C &&
                !curly && !square && !paren
            ) {
                if (expression === undefined) {
                    // first filter, end of expression
                    lastFilterIndex = i + 1;
                    expression = exp.slice(0, i).trim();
                } else {
                    pushFilter();
                }
            } else {
                switch (c) {
                    case 0x22:
                        inDouble = true;
                        break // "
                    case 0x27:
                        inSingle = true;
                        break // '
                    case 0x60:
                        inTemplateString = true;
                        break // `
                    case 0x28:
                        paren++;
                        break // (
                    case 0x29:
                        paren--;
                        break // )
                    case 0x5B:
                        square++;
                        break // [
                    case 0x5D:
                        square--;
                        break // ]
                    case 0x7B:
                        curly++;
                        break // {
                    case 0x7D:
                        curly--;
                        break // }
                }
                if (c === 0x2f) { // /
                    var j = i - 1;
                    var p = (void 0);
                    // find first non-whitespace prev char
                    for (; j >= 0; j--) {
                        p = exp.charAt(j);
                        if (p !== ' ') { break }
                    }
                    if (!p || !/[\w$]/.test(p)) {
                        inRegex = true;
                    }
                }
            }
        }

        if (expression === undefined) {
            expression = exp.slice(0, i).trim();
        } else if (lastFilterIndex !== 0) {
            pushFilter();
        }

        function pushFilter() {
            (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
            lastFilterIndex = i + 1;
        }

        if (filters) {
            for (i = 0; i < filters.length; i++) {
                expression = wrapFilter(expression, filters[i]);
            }
        }

        return expression
    }

    function wrapFilter(exp, filter) {
        var i = filter.indexOf('(');
        if (i < 0) {
            // _f: resolveFilter
            return ("_f(\"" + filter + "\")(" + exp + ")")
        } else {
            var name = filter.slice(0, i);
            var args = filter.slice(i + 1);
            return ("_f(\"" + name + "\")(" + exp + "," + args)
        }
    }

    /*  */

    var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
    var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

    var buildRegex = cached(function(delimiters) {
        var open = delimiters[0].replace(regexEscapeRE, '\\$&');
        var close = delimiters[1].replace(regexEscapeRE, '\\$&');
        return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
    });

    function parseText(
        text,
        delimiters
    ) {
        var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
        if (!tagRE.test(text)) {
            return
        }
        var tokens = [];
        var lastIndex = tagRE.lastIndex = 0;
        var match, index;
        while ((match = tagRE.exec(text))) {
            index = match.index;
            // push text token
            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)));
            }
            // tag token
            var exp = parseFilters(match[1].trim());
            // _s: toString
            tokens.push(("_s(" + exp + ")"));
            lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return tokens.join('+')
    }

    /*  */

    function baseWarn(msg) {
        console.error(("[Vue parser]: " + msg));
    }

    function pluckModuleFunction(
        modules,
        key
    ) {
        return modules ?
            modules.map(function(m) { return m[key]; }).filter(function(_) { return _; }) : []
    }

    function addProp(el, name, value) {
        (el.props || (el.props = [])).push({ name: name, value: value });
    }

    function addAttr(el, name, value) {
        (el.attrs || (el.attrs = [])).push({ name: name, value: value });
    }

    function addDirective(
        el,
        name,
        rawName,
        value,
        arg,
        modifiers
    ) {
        (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
    }

    function addHandler(
        el,
        name,
        value,
        modifiers,
        important
    ) {
        // check capture modifier 捕获
        if (modifiers && modifiers.capture) {
            delete modifiers.capture;
            name = '!' + name; // mark the event as captured
        }
        // 一次
        if (modifiers && modifiers.once) {
            delete modifiers.once;
            name = '~' + name; // mark the event as once
        }
        var events;
        // native
        if (modifiers && modifiers.native) {
            delete modifiers.native;
            events = el.nativeEvents || (el.nativeEvents = {});
        } else {
            events = el.events || (el.events = {});
        }
        var newHandler = { value: value, modifiers: modifiers };
        var handlers = events[name];
        /* istanbul ignore if */
        if (Array.isArray(handlers)) {
            // 很重要   前插  否则  后插
            important ? handlers.unshift(newHandler) : handlers.push(newHandler);
        } else if (handlers) {
            events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
        } else {
            events[name] = newHandler;
        }
    }

    function getBindingAttr(
        el,
        name,
        getStatic
    ) {
        var dynamicValue =
            getAndRemoveAttr(el, ':' + name) ||
            getAndRemoveAttr(el, 'v-bind:' + name);
        if (dynamicValue != null) {
            return parseFilters(dynamicValue)
        } else if (getStatic !== false) {
            var staticValue = getAndRemoveAttr(el, name);
            if (staticValue != null) {
                return JSON.stringify(staticValue)
            }
        }
    }

    function getAndRemoveAttr(el, name) {
        var val;
        if ((val = el.attrsMap[name]) != null) {
            var list = el.attrsList;
            for (var i = 0, l = list.length; i < l; i++) {
                if (list[i].name === name) {
                    list.splice(i, 1);
                    break
                }
            }
        }
        return val
    }

    var len;
    var str;
    var chr;
    var index$1;
    var expressionPos;
    var expressionEndPos;

    /**
     * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
     *
     * for loop possible cases:
     *
     * - test
     * - test[idx]
     * - test[test1[idx]]
     * - test["a"][idx]
     * - xxx.test[a[a].test1[idx]]
     * - test.xxx.a["asa"][test1[idx]]
     *
     */

    function parseModel(val) {
        str = val;
        len = str.length;
        index$1 = expressionPos = expressionEndPos = 0;

        if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
            return {
                exp: val,
                idx: null
            }
        }

        while (!eof()) {
            chr = next();
            /* istanbul ignore if */
            if (isStringStart(chr)) {
                parseString(chr);
            } else if (chr === 0x5B) { // ascii 91 [
                parseBracket(chr);
            }
        }

        return {
            exp: val.substring(0, expressionPos),
            idx: val.substring(expressionPos + 1, expressionEndPos)
        }
    }

    function next() {
        return str.charCodeAt(++index$1)
    }

    function eof() {
        return index$1 >= len
    }

    // ascii 22 "  27 '
    function isStringStart(chr) {
        return chr === 0x22 || chr === 0x27
    }

    function parseBracket(chr) {
        var inBracket = 1;
        expressionPos = index$1;
        while (!eof()) {
            chr = next();
            if (isStringStart(chr)) {
                parseString(chr);
                continue
            }
            //  ASCII 5B [ 5D ]
            if (chr === 0x5B) { inBracket++; }
            if (chr === 0x5D) { inBracket--; }
            if (inBracket === 0) {
                expressionEndPos = index$1;
                break
            }
        }
    }

    function parseString(chr) {
        var stringQuote = chr;
        while (!eof()) {
            chr = next();
            if (chr === stringQuote) {
                break
            }
        }
    }

    /*  */

    // 匹配  v-   @   :
    var dirRE = /^v-|^@|^:/;
    // 匹配  空格（in|of） 空格
    var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
    // 匹配 迭代 ( ) { } [ ]
    var forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;
    // 匹配  :   v-bind:
    var bindRE = /^:|^v-bind:/;
    // 匹配 @  v-on:
    var onRE = /^@|^v-on:/;
    // 匹配 :.
    var argRE = /:(.*)$/;
    // 匹配 .
    var modifierRE = /\.[^.]+/g;

    var decodeHTMLCached = cached(decode);

    // configurable state
    var warn$1;
    var platformGetTagNamespace;
    var platformMustUseProp;
    var platformIsPreTag;
    var preTransforms;
    var transforms;
    var postTransforms;
    var delimiters;  // 分隔符

    /**
     * Convert HTML string to AST.
     * 抽象语法树(abstract syntax tree或者缩写为AST)
     */
    function parse(
        template,
        options
    ) {
        warn$1 = options.warn || baseWarn;
        platformGetTagNamespace = options.getTagNamespace || no;
        platformMustUseProp = options.mustUseProp || no;
        platformIsPreTag = options.isPreTag || no;
        preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
        transforms = pluckModuleFunction(options.modules, 'transformNode');
        postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');
        delimiters = options.delimiters;
        var stack = [];
        var preserveWhitespace = options.preserveWhitespace !== false;
        var root;
        var currentParent;
        var inVPre = false;
        var inPre = false;
        var warned = false;
        parseHTML(template, {
            expectHTML: options.expectHTML,
            isUnaryTag: options.isUnaryTag,
            shouldDecodeNewlines: options.shouldDecodeNewlines,
            start: function start(tag, attrs, unary) {
                // check namespace.
                // inherit parent ns if there is one
                var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

                // handle IE svg bug
                /* istanbul ignore if */
                if (isIE && ns === 'svg') {
                    attrs = guardIESVGBug(attrs);
                }

                var element = {
                    type: 1,
                    tag: tag,
                    attrsList: attrs,
                    attrsMap: makeAttrsMap(attrs),
                    parent: currentParent,
                    children: []
                };
                if (ns) {
                    element.ns = ns;
                }

                if (isForbiddenTag(element) && !isServerRendering()) {
                    element.forbidden = true;
                    "development" !== 'production' && warn$1(
                        'Templates should only be responsible for mapping the state to the ' +
                        'UI. Avoid placing tags with side-effects in your templates, such as ' +
                        "<" + tag + ">" + ', as they will not be parsed.'
                    );
                }

                // apply pre-transforms
                for (var i = 0; i < preTransforms.length; i++) {
                    preTransforms[i](element, options);
                }

                if (!inVPre) {
                    processPre(element);
                    if (element.pre) {
                        inVPre = true;
                    }
                }
                if (platformIsPreTag(element.tag)) {
                    inPre = true;
                }
                if (inVPre) {
                    processRawAttrs(element);
                } else {
                    processFor(element);
                    processIf(element);
                    processOnce(element);
                    processKey(element);

                    // determine whether this is a plain element after
                    // removing structural attributes
                    element.plain = !element.key && !attrs.length;

                    processRef(element);
                    processSlot(element);
                    processComponent(element);
                    for (var i$1 = 0; i$1 < transforms.length; i$1++) {
                        transforms[i$1](element, options);
                    }
                    processAttrs(element);
                }

                function checkRootConstraints(el) {
                    if ("development" !== 'production' && !warned) {
                        if (el.tag === 'slot' || el.tag === 'template') {
                            warned = true;
                            warn$1(
                                "Cannot use <" + (el.tag) + "> as component root element because it may " +
                                'contain multiple nodes:\n' + template
                            );
                        }
                        if (el.attrsMap.hasOwnProperty('v-for')) {
                            warned = true;
                            warn$1(
                                'Cannot use v-for on stateful component root element because ' +
                                'it renders multiple elements:\n' + template
                            );
                        }
                    }
                }

                // tree management
                if (!root) {
                    root = element;
                    checkRootConstraints(root);
                } else if (!stack.length) {
                    // allow root elements with v-if, v-else-if and v-else
                    if (root.if && (element.elseif || element.else)) {
                        checkRootConstraints(element);
                        addIfCondition(root, {
                            exp: element.elseif,
                            block: element
                        });
                    } else if ("development" !== 'production' && !warned) {
                        warned = true;
                        warn$1(
                            "Component template should contain exactly one root element:" +
                            "\n\n" + template + "\n\n" +
                            "If you are using v-if on multiple elements, " +
                            "use v-else-if to chain them instead."
                        );
                    }
                }
                if (currentParent && !element.forbidden) {
                    if (element.elseif || element.else) {
                        processIfConditions(element, currentParent);
                    } else if (element.slotScope) { // scoped slot
                        currentParent.plain = false;
                        var name = element.slotTarget || 'default';
                        (currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
                    } else {
                        currentParent.children.push(element);
                        element.parent = currentParent;
                    }
                }
                if (!unary) {
                    currentParent = element;
                    stack.push(element);
                }
                // apply post-transforms
                for (var i$2 = 0; i$2 < postTransforms.length; i$2++) {
                    postTransforms[i$2](element, options);
                }
            },

            end: function end() {
                // remove trailing whitespace
                var element = stack[stack.length - 1];
                var lastNode = element.children[element.children.length - 1];
                if (lastNode && lastNode.type === 3 && lastNode.text === ' ') {
                    element.children.pop();
                }
                // pop stack
                stack.length -= 1;
                currentParent = stack[stack.length - 1];
                // check pre state
                if (element.pre) {
                    inVPre = false;
                }
                if (platformIsPreTag(element.tag)) {
                    inPre = false;
                }
            },

            chars: function chars(text) {
                if (!currentParent) {
                    if ("development" !== 'production' && !warned && text === template) {
                        warned = true;
                        warn$1(
                            'Component template requires a root element, rather than just text:\n\n' + template
                        );
                    }
                    return
                }
                // IE textarea placeholder bug
                /* istanbul ignore if */
                if (isIE &&
                    currentParent.tag === 'textarea' &&
                    currentParent.attrsMap.placeholder === text) {
                    return
                }
                var children = currentParent.children;
                text = inPre || text.trim() ?
                    decodeHTMLCached(text)
                    // only preserve whitespace if its not right after a starting tag
                    :
                    preserveWhitespace && children.length ? ' ' : '';
                if (text) {
                    var expression;
                    if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
                        children.push({
                            type: 2,
                            expression: expression,
                            text: text
                        });
                    } else if (text !== ' ' || children[children.length - 1].text !== ' ') {
                        currentParent.children.push({
                            type: 3,
                            text: text
                        });
                    }
                }
            }
        });
        return root
    }

    function processPre(el) {
        if (getAndRemoveAttr(el, 'v-pre') != null) {
            el.pre = true;
        }
    }

    function processRawAttrs(el) {
        var l = el.attrsList.length;
        if (l) {
            var attrs = el.attrs = new Array(l);
            for (var i = 0; i < l; i++) {
                attrs[i] = {
                    name: el.attrsList[i].name,
                    value: JSON.stringify(el.attrsList[i].value)
                };
            }
        } else if (!el.pre) {
            // non root node in pre blocks with no attributes
            el.plain = true;
        }
    }

    function processKey(el) {
        var exp = getBindingAttr(el, 'key');
        if (exp) {
            if ("development" !== 'production' && el.tag === 'template') {
                warn$1("<template> cannot be keyed. Place the key on real elements instead.");
            }
            el.key = exp;
        }
    }

    function processRef(el) {
        var ref = getBindingAttr(el, 'ref');
        if (ref) {
            el.ref = ref;
            el.refInFor = checkInFor(el);
        }
    }

    function processFor(el) {
        var exp;
        if ((exp = getAndRemoveAttr(el, 'v-for'))) {
            var inMatch = exp.match(forAliasRE);
            if (!inMatch) {
                "development" !== 'production' && warn$1(
                    ("Invalid v-for expression: " + exp)
                );
                return
            }
            el.for = inMatch[2].trim();
            var alias = inMatch[1].trim();
            var iteratorMatch = alias.match(forIteratorRE);
            if (iteratorMatch) {
                el.alias = iteratorMatch[1].trim();
                el.iterator1 = iteratorMatch[2].trim();
                if (iteratorMatch[3]) {
                    el.iterator2 = iteratorMatch[3].trim();
                }
            } else {
                el.alias = alias;
            }
        }
    }

    function processIf(el) {
        var exp = getAndRemoveAttr(el, 'v-if');
        if (exp) {
            el.if = exp;
            addIfCondition(el, {
                exp: exp,
                block: el
            });
        } else {
            if (getAndRemoveAttr(el, 'v-else') != null) {
                el.else = true;
            }
            var elseif = getAndRemoveAttr(el, 'v-else-if');
            if (elseif) {
                el.elseif = elseif;
            }
        }
    }

    function processIfConditions(el, parent) {
        var prev = findPrevElement(parent.children);
        if (prev && prev.if) {
            addIfCondition(prev, {
                exp: el.elseif,
                block: el
            });
        } else {
            warn$1(
                "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
                "used on element <" + (el.tag) + "> without corresponding v-if."
            );
        }
    }

    function findPrevElement(children) {
        var i = children.length;
        while (i--) {
            if (children[i].type === 1) {
                return children[i]
            } else {
                if ("development" !== 'production' && children[i].text !== ' ') {
                    warn$1(
                        "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
                        "will be ignored."
                    );
                }
                children.pop();
            }
        }
    }

    function addIfCondition(el, condition) {
        if (!el.ifConditions) {
            el.ifConditions = [];
        }
        el.ifConditions.push(condition);
    }

    function processOnce(el) {
        var once = getAndRemoveAttr(el, 'v-once');
        if (once != null) {
            el.once = true;
        }
    }

    function processSlot(el) {
        if (el.tag === 'slot') {
            el.slotName = getBindingAttr(el, 'name');
            if ("development" !== 'production' && el.key) {
                warn$1(
                    "`key` does not work on <slot> because slots are abstract outlets " +
                    "and can possibly expand into multiple elements. " +
                    "Use the key on a wrapping element instead."
                );
            }
        } else {
            var slotTarget = getBindingAttr(el, 'slot');
            if (slotTarget) {
                el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
            }
            if (el.tag === 'template') {
                el.slotScope = getAndRemoveAttr(el, 'scope');
            }
        }
    }

    function processComponent(el) {
        var binding;
        if ((binding = getBindingAttr(el, 'is'))) {
            el.component = binding;
        }
        if (getAndRemoveAttr(el, 'inline-template') != null) {
            el.inlineTemplate = true;
        }
    }

    function processAttrs(el) {
        var list = el.attrsList;
        var i, l, name, rawName, value, arg, modifiers, isProp;
        for (i = 0, l = list.length; i < l; i++) {
            name = rawName = list[i].name;
            value = list[i].value;
            if (dirRE.test(name)) {
                // mark element as dynamic
                el.hasBindings = true;
                // modifiers
                modifiers = parseModifiers(name);
                if (modifiers) {
                    name = name.replace(modifierRE, '');
                }
                if (bindRE.test(name)) { // v-bind
                    name = name.replace(bindRE, '');
                    value = parseFilters(value);
                    isProp = false;
                    if (modifiers) {
                        if (modifiers.prop) {
                            isProp = true;
                            name = camelize(name);
                            if (name === 'innerHtml') { name = 'innerHTML'; }
                        }
                        if (modifiers.camel) {
                            name = camelize(name);
                        }
                    }
                    if (isProp || platformMustUseProp(el.tag, el.attrsMap.type, name)) {
                        addProp(el, name, value);
                    } else {
                        addAttr(el, name, value);
                    }
                } else if (onRE.test(name)) { // v-on
                    name = name.replace(onRE, '');
                    addHandler(el, name, value, modifiers);
                } else { // normal directives
                    name = name.replace(dirRE, '');
                    // parse arg
                    var argMatch = name.match(argRE);
                    if (argMatch && (arg = argMatch[1])) {
                        name = name.slice(0, -(arg.length + 1));
                    }
                    addDirective(el, name, rawName, value, arg, modifiers);
                    if ("development" !== 'production' && name === 'model') {
                        checkForAliasModel(el, value);
                    }
                }
            } else {
                // literal attribute
                {
                    var expression = parseText(value, delimiters);
                    if (expression) {
                        warn$1(
                            name + "=\"" + value + "\": " +
                            'Interpolation inside attributes has been removed. ' +
                            'Use v-bind or the colon shorthand instead. For example, ' +
                            'instead of <div id="{{ val }}">, use <div :id="val">.'
                        );
                    }
                }
                addAttr(el, name, JSON.stringify(value));
            }
        }
    }

    function checkInFor(el) {
        var parent = el;
        while (parent) {
            if (parent.for !== undefined) {
                return true
            }
            parent = parent.parent;
        }
        return false
    }

    function parseModifiers(name) {
        var match = name.match(modifierRE);
        if (match) {
            var ret = {};
            match.forEach(function(m) { ret[m.slice(1)] = true; });
            return ret
        }
    }

    function makeAttrsMap(attrs) {
        var map = {};
        for (var i = 0, l = attrs.length; i < l; i++) {
            if ("development" !== 'production' && map[attrs[i].name] && !isIE) {
                warn$1('duplicate attribute: ' + attrs[i].name);
            }
            map[attrs[i].name] = attrs[i].value;
        }
        return map
    }

    function isForbiddenTag(el) {
        return (
            el.tag === 'style' ||
            (el.tag === 'script' && (!el.attrsMap.type ||
                el.attrsMap.type === 'text/javascript'
            ))
        )
    }

    // xml namespace 命名空间
    // 作用是赋予命名空间一个唯一的名称。
    var ieNSBug = /^xmlns:NS\d+/;
    var ieNSPrefix = /^NS\d+:/;

    /* istanbul ignore next */
    function guardIESVGBug(attrs) {
        var res = [];
        for (var i = 0; i < attrs.length; i++) {
            var attr = attrs[i];
            if (!ieNSBug.test(attr.name)) {
                attr.name = attr.name.replace(ieNSPrefix, '');
                res.push(attr);
            }
        }
        return res
    }

    function checkForAliasModel(el, value) {
        var _el = el;
        while (_el) {
            if (_el.for && _el.alias === value) {
                warn$1(
                    "<" + (el.tag) + " v-model=\"" + value + "\">: " +
                    "You are binding v-model directly to a v-for iteration alias. " +
                    "This will not be able to modify the v-for source array because " +
                    "writing to the alias is like modifying a function local variable. " +
                    "Consider using an array of objects and use v-model on an object property instead."
                );
            }
            _el = _el.parent;
        }
    }

    /*  */

    var isStaticKey;
    var isPlatformReservedTag;

    var genStaticKeysCached = cached(genStaticKeys$1);

    /**
     * Goal of the optimizer: walk the generated template AST tree
     * and detect sub-trees that are purely static, i.e. parts of
     * the DOM that never needs to change.
     *
     * Once we detect these sub-trees, we can:
     *
     * 1. Hoist them into constants, so that we no longer need to
     *    create fresh nodes for them on each re-render;
     * 2. Completely skip them in the patching process.
     */
    // 优化器的目标：
    // 遍历已经生成的模板AST树，检测纯静态的子树，例如：
    //  永远不需要改变的DOM。
    //  一旦我们检测到这类子树，我们可以：
    //      1. 把它们变成常数，这样我们就不需要在任何一个需要重新渲染的节点上为它们创建新节点；
    //      2. 在patch过程中完全跳过它们
    function optimize(root, options) {
        if (!root) { return }
        isStaticKey = genStaticKeysCached(options.staticKeys || '');
        isPlatformReservedTag = options.isReservedTag || no;
        // first pass: mark all non-static nodes.
        markStatic(root);
        // second pass: mark static roots.
        markStaticRoots(root, false);
    }

    function genStaticKeys$1(keys) {
        return makeMap(
            'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
            (keys ? ',' + keys : '')
        )
    }

    function markStatic(node) {
        node.static = isStatic(node);
        if (node.type === 1) {
            // do not make component slot content static. this avoids
            // 1. components not able to mutate slot nodes
            // 2. static slot content fails for hot-reloading
            // 不用把slot（插槽）组件内容置为静态，会导致：
            // 1. 组件无法改变slot节点
            // 2. 静态slot内容无法热更新
            if (!isPlatformReservedTag(node.tag) &&
                node.tag !== 'slot' &&
                node.attrsMap['inline-template'] == null
            ) {
                return
            }
            for (var i = 0, l = node.children.length; i < l; i++) {
                var child = node.children[i];
                markStatic(child);
                if (!child.static) {
                    node.static = false;
                }
            }
        }
    }

    function markStaticRoots(node, isInFor) {
        if (node.type === 1) {
            if (node.static || node.once) {
                node.staticInFor = isInFor;
            }
            // For a node to qualify as a static root, it should have children that
            // are not just static text. Otherwise the cost of hoisting out will
            // outweigh the benefits and it's better off to just always render it fresh.
            // 要使一个节点有资格作为静态根，它应该包含除静态文本之外的子节点，
            // 否则，修改成本大意义不大，并且最好是经常重新渲染。
            if (node.static && node.children.length && !(
                    node.children.length === 1 &&
                    node.children[0].type === 3
                )) {
                node.staticRoot = true;
                return
            } else {
                node.staticRoot = false;
            }
            if (node.children) {
                for (var i = 0, l = node.children.length; i < l; i++) {
                    markStaticRoots(node.children[i], isInFor || !!node.for);
                }
            }
            if (node.ifConditions) {
                walkThroughConditionsBlocks(node.ifConditions, isInFor);
            }
        }
    }

    function walkThroughConditionsBlocks(conditionBlocks, isInFor) {
        for (var i = 1, len = conditionBlocks.length; i < len; i++) {
            markStaticRoots(conditionBlocks[i].block, isInFor);
        }
    }

    function isStatic(node) {
        if (node.type === 2) { // expression
            return false
        }
        if (node.type === 3) { // text
            return true
        }
        return !!(node.pre || (!node.hasBindings && // no dynamic bindings
            !node.if && !node.for && // not v-if or v-for or v-else
            !isBuiltInTag(node.tag) && // not a built-in
            isPlatformReservedTag(node.tag) && // not a component
            !isDirectChildOfTemplateFor(node) &&
            Object.keys(node).every(isStaticKey)
        ))
    }

    function isDirectChildOfTemplateFor(node) {
        while (node.parent) {
            node = node.parent;
            if (node.tag !== 'template') {
                return false
            }
            if (node.for) {
                return true
            }
        }
        return false
    }

    /*  */

    var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
    var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

    // keyCode aliases
    var keyCodes = {
        esc: 27,
        tab: 9,
        enter: 13,
        space: 32,
        up: 38,
        left: 37,
        right: 39,
        down: 40,
        'delete': [8, 46]
    };

    var modifierCode = {
        stop: '$event.stopPropagation();',
        prevent: '$event.preventDefault();',
        self: 'if($event.target !== $event.currentTarget)return;',
        ctrl: 'if(!$event.ctrlKey)return;',
        shift: 'if(!$event.shiftKey)return;',
        alt: 'if(!$event.altKey)return;',
        meta: 'if(!$event.metaKey)return;'
    };

    function genHandlers(events, native) {
        var res = native ? 'nativeOn:{' : 'on:{';
        for (var name in events) {
            res += "\"" + name + "\":" + (genHandler(name, events[name])) + ",";
        }
        return res.slice(0, -1) + '}'
    }

    function genHandler(
        name,
        handler
    ) {
        if (!handler) {
            return 'function(){}'
        } else if (Array.isArray(handler)) {
            return ("[" + (handler.map(function(handler) { return genHandler(name, handler); }).join(',')) + "]")
        } else if (!handler.modifiers) {
            return fnExpRE.test(handler.value) || simplePathRE.test(handler.value) ?
                handler.value :
                ("function($event){" + (handler.value) + "}")
        } else {
            var code = '';
            var keys = [];
            for (var key in handler.modifiers) {
                if (modifierCode[key]) {
                    code += modifierCode[key];
                } else {
                    keys.push(key);
                }
            }
            if (keys.length) {
                code = genKeyFilter(keys) + code;
            }
            var handlerCode = simplePathRE.test(handler.value) ?
                handler.value + '($event)' :
                handler.value;
            return 'function($event){' + code + handlerCode + '}'
        }
    }

    function genKeyFilter(keys) {
        return ("if(" + (keys.map(genFilterCode).join('&&')) + ")return;")
    }

    function genFilterCode(key) {
        var keyVal = parseInt(key, 10);
        if (keyVal) {
            return ("$event.keyCode!==" + keyVal)
        }
        var alias = keyCodes[key];
        return ("_k($event.keyCode," + (JSON.stringify(key)) + (alias ? ',' + JSON.stringify(alias) : '') + ")")
    }

    /*  */

    function bind$2(el, dir) {
        el.wrapData = function(code) {
            // _b v-bind绑定class、style等
            return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + (dir.modifiers && dir.modifiers.prop ? ',true' : '') + ")")
        };
    }

    /* 指令 */

    var baseDirectives = {
        bind: bind$2,
        cloak: noop
    };

    /*  */

    // configurable state
    var warn$2;
    var transforms$1;
    var dataGenFns;
    var platformDirectives$1;
    var isPlatformReservedTag$1;
    var staticRenderFns;
    var onceCount;
    var currentOptions;

    // ast: abstract syntax tree 抽象语法树
    function generate(
        ast,
        options
    ) {
        // save previous staticRenderFns so generate calls can be nested
        // 保存以前的staticRenderFns，以便生成调用可以嵌套
        var prevStaticRenderFns = staticRenderFns;
        var currentStaticRenderFns = staticRenderFns = [];
        var prevOnceCount = onceCount;
        onceCount = 0;
        currentOptions = options;
        warn$2 = options.warn || baseWarn;
        transforms$1 = pluckModuleFunction(options.modules, 'transformCode');
        dataGenFns = pluckModuleFunction(options.modules, 'genData');
        platformDirectives$1 = options.directives || {};
        isPlatformReservedTag$1 = options.isReservedTag || no;
        // _c: 创建元素 此处为创建div
        var code = ast ? genElement(ast) : '_c("div")';
        staticRenderFns = prevStaticRenderFns;
        onceCount = prevOnceCount;
        // with 语法 超级影响性能   很慢
        // var obj = {} obj.a = 'a' obj.b = 'b'
        // with (obj) { console.log(a, b)} // 输出 a b
        return {
            render: ("with(this){return " + code + "}"),
            staticRenderFns: currentStaticRenderFns
        }
    }

    function genElement(el) {
        if (el.staticRoot && !el.staticProcessed) {
            return genStatic(el)
        } else if (el.once && !el.onceProcessed) {
            return genOnce(el)
        } else if (el.for && !el.forProcessed) {
            return genFor(el)
        } else if (el.if && !el.ifProcessed) {
            return genIf(el)
        } else if (el.tag === 'template' && !el.slotTarget) {
            return genChildren(el) || 'void 0'
        } else if (el.tag === 'slot') {
            return genSlot(el)
        } else {
            // component or element
            var code;
            if (el.component) {
                code = genComponent(el.component, el);
            } else {
                var data = el.plain ? undefined : genData(el);

                var children = el.inlineTemplate ? null : genChildren(el, true);
                // _c: 创建元素 
                code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
            }
            // module transforms
            for (var i = 0; i < transforms$1.length; i++) {
                code = transforms$1[i](el, code);
            }
            return code
        }
    }

    // hoist static sub-trees out
    // 提升静态子树
    function genStatic(el) {
        el.staticProcessed = true;
        staticRenderFns.push(("with(this){return " + (genElement(el)) + "}"));
        // _m: render static tree by index
        // 通过索引渲染静态树
        return ("_m(" + (staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
    }

    // v-once
    //  v-once 指令，执行一次性地插值，当数据改变时，插值处的内容不会更新。
    function genOnce(el) {
        el.onceProcessed = true;
        if (el.if && !el.ifProcessed) {
            return genIf(el)
        } else if (el.staticInFor) {
            var key = '';
            var parent = el.parent;
            while (parent) {
                if (parent.for) {
                    key = parent.key;
                    break
                }
                parent = parent.parent;
            }
            if (!key) {
                "development" !== 'production' && warn$2(
                    "v-once can only be used inside v-for that is keyed. "
                );
                return genElement(el)
            }
            // _o: mark node as static (v-once)
            return ("_o(" + (genElement(el)) + "," + (onceCount++) + (key ? ("," + key) : "") + ")")
        } else {
            return genStatic(el)
        }
    }

    // v-if 一次性判断
    function genIf(el) {
        el.ifProcessed = true; // avoid recursion
        return genIfConditions(el.ifConditions.slice())
    }

    function genIfConditions(conditions) {
        if (!conditions.length) {
            // _e: empty vnode
            return '_e()'
        }

        var condition = conditions.shift();
        if (condition.exp) {
            return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions)))
        } else {
            return ("" + (genTernaryExp(condition.block)))
        }

        // v-if with v-once should generate code like (a)?_m(0):_m(1)
        // _m: render static tree by index
        // 通过索引渲染静态树
        function genTernaryExp(el) {
            return el.once ? genOnce(el) : genElement(el)
        }
    }

    function genFor(el) {
        var exp = el.for;
        var alias = el.alias;
        var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
        var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
        el.forProcessed = true; // avoid recursion
        // _l: render v-for
        // v-for 渲染  遍历各种情况
        return "_l((" + exp + ")," +
            "function(" + alias + iterator1 + iterator2 + "){" +
            "return " + (genElement(el)) +
            '})'
    }

    function genData(el) {
        var data = '{';

        // directives first.
        // directives may mutate the el's other properties before they are generated.
        var dirs = genDirectives(el);
        if (dirs) { data += dirs + ','; }

        // key
        if (el.key) {
            data += "key:" + (el.key) + ",";
        }
        // ref
        if (el.ref) {
            data += "ref:" + (el.ref) + ",";
        }
        if (el.refInFor) {
            data += "refInFor:true,";
        }
        // pre
        if (el.pre) {
            data += "pre:true,";
        }
        // record original tag name for components using "is" attribute
        if (el.component) {
            data += "tag:\"" + (el.tag) + "\",";
        }
        // module data generation functions
        for (var i = 0; i < dataGenFns.length; i++) {
            data += dataGenFns[i](el);
        }
        // attributes
        if (el.attrs) {
            data += "attrs:{" + (genProps(el.attrs)) + "},";
        }
        // DOM props
        if (el.props) {
            data += "domProps:{" + (genProps(el.props)) + "},";
        }
        // event handlers
        if (el.events) {
            data += (genHandlers(el.events)) + ",";
        }
        if (el.nativeEvents) {
            data += (genHandlers(el.nativeEvents, true)) + ",";
        }
        // slot target
        if (el.slotTarget) {
            data += "slot:" + (el.slotTarget) + ",";
        }
        // scoped slots
        if (el.scopedSlots) {
            data += (genScopedSlots(el.scopedSlots)) + ",";
        }
        // inline-template
        if (el.inlineTemplate) {
            var inlineTemplate = genInlineTemplate(el);
            if (inlineTemplate) {
                data += inlineTemplate + ",";
            }
        }
        data = data.replace(/,$/, '') + '}';
        // v-bind data wrap
        if (el.wrapData) {
            data = el.wrapData(data);
        }
        return data
    }

    function genDirectives(el) {
        var dirs = el.directives;
        if (!dirs) { return }
        var res = 'directives:[';
        var hasRuntime = false;
        var i, l, dir, needRuntime;
        for (i = 0, l = dirs.length; i < l; i++) {
            dir = dirs[i];
            needRuntime = true;
            var gen = platformDirectives$1[dir.name] || baseDirectives[dir.name];
            if (gen) {
                // compile-time directive that manipulates AST.
                // returns true if it also needs a runtime counterpart.
                // 操作AST的编译时指令。
                // 如果它还需要运行时对应项，则返回true
                needRuntime = !!gen(el, dir, warn$2);
            }
            if (needRuntime) {
                hasRuntime = true;
                res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
            }
        }
        if (hasRuntime) {
            return res.slice(0, -1) + ']'
        }
    }

    function genInlineTemplate(el) {
        var ast = el.children[0];
        if ("development" !== 'production' && (
                el.children.length > 1 || ast.type !== 1
            )) {
            warn$2('Inline-template components must have exactly one child element.');
        }
        if (ast.type === 1) {
            var inlineRenderFns = generate(ast, currentOptions);
            return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function(code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
        }
    }

    function genScopedSlots(slots) {
        return ("scopedSlots:{" + (Object.keys(slots).map(function(key) { return genScopedSlot(key, slots[key]); }).join(',')) + "}")
    }

    function genScopedSlot(key, el) {
        return key + ":function(" + (String(el.attrsMap.scope)) + "){" +
            "return " + (el.tag === 'template' ?
                genChildren(el) || 'void 0' :
                genElement(el)) + "}"
    }

    function genChildren(el, checkSkip) {
        var children = el.children;
        if (children.length) {
            var el$1 = children[0];
            // optimize single v-for
            // 优化v-for
            if (children.length === 1 &&
                el$1.for &&
                el$1.tag !== 'template' &&
                el$1.tag !== 'slot') {
                return genElement(el$1)
            }
            var normalizationType = getNormalizationType(children);
            return ("[" + (children.map(genNode).join(',')) + "]" + (checkSkip ?
                normalizationType ? ("," + normalizationType) : '' :
                ''))
        }
    }

    // determine the normalization needed for the children array.
    // 0: no normalization needed
    // 1: simple normalization needed (possible 1-level deep nested array)
    // 2: full normalization needed
    // 确定children数组所需的标准化。
    // 0：不需要标准化
    // 1：需要简单规标准化（或许是 1级 数组嵌套）
    // 2：需要完全标准化
    function getNormalizationType(children) {
        var res = 0;
        for (var i = 0; i < children.length; i++) {
            var el = children[i];
            if (el.type !== 1) {
                continue
            }
            if (needsNormalization(el) ||
                (el.ifConditions && el.ifConditions.some(function(c) { return needsNormalization(c.block); }))) {
                res = 2;
                break
            }
            if (maybeComponent(el) ||
                (el.ifConditions && el.ifConditions.some(function(c) { return maybeComponent(c.block); }))) {
                res = 1;
            }
        }
        return res
    }

    function needsNormalization(el) {
        return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
    }

    function maybeComponent(el) {
        return !isPlatformReservedTag$1(el.tag)
    }

    function genNode(node) {
        if (node.type === 1) {
            return genElement(node)
        } else {
            return genText(node)
        }
    }

    function genText(text) {
        // _v: convert text to vnode 转为虚拟节点
        return ("_v(" + (text.type === 2 ?
            text.expression // no need for () because already wrapped in _s()
            :
            transformSpecialNewlines(JSON.stringify(text.text))) + ")")
    }

    function genSlot(el) {
        var slotName = el.slotName || '"default"';
        var children = genChildren(el);
        // _t: renderSlot slot渲染
        var res = "_t(" + slotName + (children ? ("," + children) : '');
        var attrs = el.attrs && ("{" + (el.attrs.map(function(a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
        var bind$$1 = el.attrsMap['v-bind'];
        if ((attrs || bind$$1) && !children) {
            res += ",null";
        }
        if (attrs) {
            res += "," + attrs;
        }
        if (bind$$1) {
            res += (attrs ? '' : ',null') + "," + bind$$1;
        }
        return res + ')'
    }

    // componentName is el.component, take it as argument to shun flow's pessimistic refinement
    // componentName是el.component，将其作为顺流的悲观细化的参数（什么鬼这是😝）
    function genComponent(componentName, el) {
        var children = el.inlineTemplate ? null : genChildren(el, true);
        // _c: 创建元素 
        return ("_c(" + componentName + "," + (genData(el)) + (children ? ("," + children) : '') + ")")
    }

    function genProps(props) {
        var res = '';
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
        }
        return res.slice(0, -1)
    }

    // #3895, #4268 换行符\u2028 \u2029
    function transformSpecialNewlines(text) {
        return text
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029')
    }

    /*  */

    /**
     * Compile a template.
     * 编译模板
     */
    function compile$1(
        template,
        options
    ) {
        var ast = parse(template.trim(), options);
        optimize(ast, options);
        var code = generate(ast, options);
        return {
            ast: ast,
            render: code.render,
            staticRenderFns: code.staticRenderFns
        }
    }

    /*  */

    // operators like typeof, instanceof and in are allowed
    var prohibitedKeywordRE = new RegExp('\\b' + (
        'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
        'super,throw,while,yield,delete,export,import,return,switch,default,' +
        'extends,finally,continue,debugger,function,arguments'
    ).split(',').join('\\b|\\b') + '\\b');
    // check valid identifier for v-for 检查v-for的有效标识符
    var identRE = /[A-Za-z_$][\w$]*/;
    // strip strings in expressions 表达式中剥离字符串
    var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

    // detect problematic expressions in a template
    // 检测模板中有问题的表达式
    function detectErrors(ast) {
        var errors = [];
        if (ast) {
            checkNode(ast, errors);
        }
        return errors
    }

    function checkNode(node, errors) {
        if (node.type === 1) {
            for (var name in node.attrsMap) {
                if (dirRE.test(name)) {
                    var value = node.attrsMap[name];
                    if (value) {
                        if (name === 'v-for') {
                            checkFor(node, ("v-for=\"" + value + "\""), errors);
                        } else {
                            checkExpression(value, (name + "=\"" + value + "\""), errors);
                        }
                    }
                }
            }
            if (node.children) {
                for (var i = 0; i < node.children.length; i++) {
                    checkNode(node.children[i], errors);
                }
            }
        } else if (node.type === 2) {
            checkExpression(node.expression, node.text, errors);
        }
    }

    function checkFor(node, text, errors) {
        checkExpression(node.for || '', text, errors);
        checkIdentifier(node.alias, 'v-for alias', text, errors);
        checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
        checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
    }

    function checkIdentifier(ident, type, text, errors) {
        if (typeof ident === 'string' && !identRE.test(ident)) {
            errors.push(("- invalid " + type + " \"" + ident + "\" in expression: " + text));
        }
    }

    function checkExpression(exp, text, errors) {
        try {
            new Function(("return " + exp));
        } catch (e) {
            var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
            if (keywordMatch) {
                errors.push(
                    "- avoid using JavaScript keyword as property name: " +
                    "\"" + (keywordMatch[0]) + "\" in expression " + text
                );
            } else {
                errors.push(("- invalid expression: " + text));
            }
        }
    }

    /*  */

    function transformNode(el, options) {
        var warn = options.warn || baseWarn;
        var staticClass = getAndRemoveAttr(el, 'class');
        if ("development" !== 'production' && staticClass) {
            var expression = parseText(staticClass, options.delimiters);
            if (expression) {
                warn(
                    "class=\"" + staticClass + "\": " +
                    'Interpolation inside attributes has been removed. ' +
                    'Use v-bind or the colon shorthand instead. For example, ' +
                    'instead of <div class="{{ val }}">, use <div :class="val">.'
                );
            }
        }
        if (staticClass) {
            el.staticClass = JSON.stringify(staticClass);
        }
        var classBinding = getBindingAttr(el, 'class', false /* getStatic */ );
        if (classBinding) {
            el.classBinding = classBinding;
        }
    }

    function genData$1(el) {
        var data = '';
        if (el.staticClass) {
            data += "staticClass:" + (el.staticClass) + ",";
        }
        if (el.classBinding) {
            data += "class:" + (el.classBinding) + ",";
        }
        return data
    }

    var klass$1 = {
        staticKeys: ['staticClass'],
        transformNode: transformNode,
        genData: genData$1
    };

    /*  */

    function transformNode$1(el, options) {
        var warn = options.warn || baseWarn;
        var staticStyle = getAndRemoveAttr(el, 'style');
        if (staticStyle) {
            /* istanbul ignore if */
            {
                var expression = parseText(staticStyle, options.delimiters);
                if (expression) {
                    warn(
                        "style=\"" + staticStyle + "\": " +
                        'Interpolation inside attributes has been removed. ' +
                        'Use v-bind or the colon shorthand instead. For example, ' +
                        'instead of <div style="{{ val }}">, use <div :style="val">.'
                    );
                }
            }
            el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
        }

        var styleBinding = getBindingAttr(el, 'style', false /* getStatic */ );
        if (styleBinding) {
            el.styleBinding = styleBinding;
        }
    }

    function genData$2(el) {
        var data = '';
        if (el.staticStyle) {
            data += "staticStyle:" + (el.staticStyle) + ",";
        }
        if (el.styleBinding) {
            data += "style:(" + (el.styleBinding) + "),";
        }
        return data
    }

    var style$1 = {
        staticKeys: ['staticStyle'],
        transformNode: transformNode$1,
        genData: genData$2
    };

    var modules$1 = [
        klass$1,
        style$1
    ];

    /*  */

    var warn$3;

    function model$1(
        el,
        dir,
        _warn
    ) {
        warn$3 = _warn;
        var value = dir.value;
        var modifiers = dir.modifiers;
        var tag = el.tag;
        var type = el.attrsMap.type; {
            var dynamicType = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
            if (tag === 'input' && dynamicType) {
                warn$3(
                    "<input :type=\"" + dynamicType + "\" v-model=\"" + value + "\">:\n" +
                    "v-model does not support dynamic input types. Use v-if branches instead."
                );
            }
        }
        if (tag === 'select') {
            genSelect(el, value, modifiers);
        } else if (tag === 'input' && type === 'checkbox') {
            genCheckboxModel(el, value, modifiers);
        } else if (tag === 'input' && type === 'radio') {
            genRadioModel(el, value, modifiers);
        } else {
            genDefaultModel(el, value, modifiers);
        }
        // ensure runtime directive metadata
        return true
    }

    function genCheckboxModel(
        el,
        value,
        modifiers
    ) {
        if ("development" !== 'production' &&
            el.attrsMap.checked != null) {
            warn$3(
                "<" + (el.tag) + " v-model=\"" + value + "\" checked>:\n" +
                "inline checked attributes will be ignored when using v-model. " +
                'Declare initial values in the component\'s data option instead.'
            );
        }
        var number = modifiers && modifiers.number;
        var valueBinding = getBindingAttr(el, 'value') || 'null';
        var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
        var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
        // _q: loose equal
        addProp(el, 'checked',
            "Array.isArray(" + value + ")" +
            "?_i(" + value + "," + valueBinding + ")>-1" + (
                trueValueBinding === 'true' ?
                (":(" + value + ")") :
                (":_q(" + value + "," + trueValueBinding + ")")
            )
        );
        // _n: number conversion
        addHandler(el, 'click',
            "var $$a=" + value + "," +
            '$$el=$event.target,' +
            "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
            'if(Array.isArray($$a)){' +
            "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
            '$$i=_i($$a,$$v);' +
            "if($$c){$$i<0&&(" + value + "=$$a.concat($$v))}" +
            "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
            "}else{" + value + "=$$c}",
            null, true
        );
    }

    function genRadioModel(
        el,
        value,
        modifiers
    ) {
        if ("development" !== 'production' &&
            el.attrsMap.checked != null) {
            warn$3(
                "<" + (el.tag) + " v-model=\"" + value + "\" checked>:\n" +
                "inline checked attributes will be ignored when using v-model. " +
                'Declare initial values in the component\'s data option instead.'
            );
        }
        var number = modifiers && modifiers.number;
        var valueBinding = getBindingAttr(el, 'value') || 'null';
        // _n: number conversion
        // _q: loose equal
        valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
        addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
        addHandler(el, 'click', genAssignmentCode(value, valueBinding), null, true);
    }

    function genDefaultModel(
        el,
        value,
        modifiers
    ) {
        {
            if (el.tag === 'input' && el.attrsMap.value) {
                warn$3(
                    "<" + (el.tag) + " v-model=\"" + value + "\" value=\"" + (el.attrsMap.value) + "\">:\n" +
                    'inline value attributes will be ignored when using v-model. ' +
                    'Declare initial values in the component\'s data option instead.'
                );
            }
            if (el.tag === 'textarea' && el.children.length) {
                warn$3(
                    "<textarea v-model=\"" + value + "\">:\n" +
                    'inline content inside <textarea> will be ignored when using v-model. ' +
                    'Declare initial values in the component\'s data option instead.'
                );
            }
        }

        var type = el.attrsMap.type;
        var ref = modifiers || {};
        var lazy = ref.lazy;
        var number = ref.number;
        var trim = ref.trim;
        var event = lazy || (isIE && type === 'range') ? 'change' : 'input';
        var needCompositionGuard = !lazy && type !== 'range';
        var isNative = el.tag === 'input' || el.tag === 'textarea';

        var valueExpression = isNative ?
            ("$event.target.value" + (trim ? '.trim()' : '')) :
            trim ? "(typeof $event === 'string' ? $event.trim() : $event)" : "$event";
        valueExpression = number || type === 'number' ?
            ("_n(" + valueExpression + ")") :
            valueExpression;

        var code = genAssignmentCode(value, valueExpression);
        if (isNative && needCompositionGuard) {
            code = "if($event.target.composing)return;" + code;
        }

        // inputs with type="file" are read only and setting the input's
        // value will throw an error.
        if ("development" !== 'production' &&
            type === 'file') {
            warn$3(
                "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
                "File inputs are read only. Use a v-on:change listener instead."
            );
        }
        // _s: toString
        addProp(el, 'value', isNative ? ("_s(" + value + ")") : ("(" + value + ")"));
        addHandler(el, event, code, null, true);
        if (trim || number || type === 'number') {
            addHandler(el, 'blur', '$forceUpdate()');
        }
    }

    function genSelect(
        el,
        value,
        modifiers
    ) {
        {
            el.children.some(checkOptionWarning);
        }

        var number = modifiers && modifiers.number;
        var assignment = "Array.prototype.filter" +
            ".call($event.target.options,function(o){return o.selected})" +
            ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
            "return " + (number ? '_n(val)' : 'val') + "})" +
            (el.attrsMap.multiple == null ? '[0]' : '');

        var code = genAssignmentCode(value, assignment);
        addHandler(el, 'change', code, null, true);
    }

    function checkOptionWarning(option) {
        if (option.type === 1 &&
            option.tag === 'option' &&
            option.attrsMap.selected != null) {
            warn$3(
                "<select v-model=\"" + (option.parent.attrsMap['v-model']) + "\">:\n" +
                'inline selected attributes on <option> will be ignored when using v-model. ' +
                'Declare initial values in the component\'s data option instead.'
            );
            return true
        }
        return false
    }

    function genAssignmentCode(value, assignment) {
        var modelRs = parseModel(value);
        if (modelRs.idx === null) {
            return (value + "=" + assignment)
        } else {
            return "var $$exp = " + (modelRs.exp) + ", $$idx = " + (modelRs.idx) + ";" +
                "if (!Array.isArray($$exp)){" +
                value + "=" + assignment + "}" +
                "else{$$exp.splice($$idx, 1, " + assignment + ")}"
        }
    }

    /*  */

    function text(el, dir) {
        if (dir.value) {
            // _s: toString
            addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
        }
    }

    /*  */

    function html(el, dir) {
        if (dir.value) {
            // _s: toString
            addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
        }
    }

    var directives$1 = {
        model: model$1,
        text: text,
        html: html
    };

    /*  */

    var cache = Object.create(null);

    var baseOptions = {
        expectHTML: true,
        modules: modules$1,
        staticKeys: genStaticKeys(modules$1),
        directives: directives$1,
        isReservedTag: isReservedTag,
        isUnaryTag: isUnaryTag,
        mustUseProp: mustUseProp,
        getTagNamespace: getTagNamespace,
        isPreTag: isPreTag
    };

    function compile$$1(
        template,
        options
    ) {
        options = options ?
            extend(extend({}, baseOptions), options) :
            baseOptions;
        return compile$1(template, options)
    }

    function compileToFunctions(
        template,
        options,
        vm
    ) {
        var _warn = (options && options.warn) || warn;
        // detect possible CSP restriction
        /* istanbul ignore if */
        {
            try {
                new Function('return 1');
            } catch (e) {
                if (e.toString().match(/unsafe-eval|CSP/)) {
                    _warn(
                        'It seems you are using the standalone build of Vue.js in an ' +
                        'environment with Content Security Policy that prohibits unsafe-eval. ' +
                        'The template compiler cannot work in this environment. Consider ' +
                        'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
                        'templates into render functions.'
                    );
                }
            }
        }
        var key = options && options.delimiters ?
            String(options.delimiters) + template :
            template;
        if (cache[key]) {
            return cache[key]
        }
        var res = {};
        var compiled = compile$$1(template, options);
        res.render = makeFunction(compiled.render);
        var l = compiled.staticRenderFns.length;
        res.staticRenderFns = new Array(l);
        for (var i = 0; i < l; i++) {
            res.staticRenderFns[i] = makeFunction(compiled.staticRenderFns[i]);
        } {
            if (res.render === noop || res.staticRenderFns.some(function(fn) { return fn === noop; })) {
                _warn(
                    "failed to compile template:\n\n" + template + "\n\n" +
                    detectErrors(compiled.ast).join('\n') +
                    '\n\n',
                    vm
                );
            }
        }
        return (cache[key] = res)
    }

    function makeFunction(code) {
        try {
            return new Function(code)
        } catch (e) {
            return noop
        }
    }

    /*  */

    var idToTemplate = cached(function(id) {
        var el = query(id);
        return el && el.innerHTML
    });

    var mount = Vue$3.prototype.$mount;
    Vue$3.prototype.$mount = function(
        el,
        hydrating
    ) {
        el = el && query(el);

        /* istanbul ignore if */
        if (el === document.body || el === document.documentElement) {
            "development" !== 'production' && warn(
                "Do not mount Vue to <html> or <body> - mount to normal elements instead."
            );
            return this
        }

        var options = this.$options;
        // resolve template/el and convert to render function
        if (!options.render) {
            var template = options.template;
            if (template) {
                if (typeof template === 'string') {
                    if (template.charAt(0) === '#') {
                        template = idToTemplate(template);
                        /* istanbul ignore if */
                        if ("development" !== 'production' && !template) {
                            warn(
                                ("Template element not found or is empty: " + (options.template)),
                                this
                            );
                        }
                    }
                } else if (template.nodeType) {
                    template = template.innerHTML;
                } else {
                    {
                        warn('invalid template option:' + template, this);
                    }
                    return this
                }
            } else if (el) {
                template = getOuterHTML(el);
            }
            if (template) {
                var ref = compileToFunctions(template, {
                    warn: warn,
                    shouldDecodeNewlines: shouldDecodeNewlines,
                    delimiters: options.delimiters
                }, this);
                var render = ref.render;
                var staticRenderFns = ref.staticRenderFns;
                options.render = render;
                options.staticRenderFns = staticRenderFns;
            }
        }
        return mount.call(this, el, hydrating)
    };

    /**
     * Get outerHTML of elements, taking care
     * of SVG elements in IE as well.
     */
    function getOuterHTML(el) {
        if (el.outerHTML) {
            return el.outerHTML
        } else {
            var container = document.createElement('div');
            container.appendChild(el.cloneNode(true));
            return container.innerHTML
        }
    }

    Vue$3.compile = compileToFunctions;

    return Vue$3;

})));