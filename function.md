_toString：把val转为string类型  
toNumber：把val转为number, 若失败, 直接返回原值  
makeMap：根据str, 生成一个map, 然后返回一个方法, 这个方法的作用是, 判断一个值是否在这个生成的map中.  
isBuiltInTag：判断某个tag是否是slot, component  
remove$1：数组中删除一项  
hasOwn：判断对象中是否存在某个自有属性  
isPrimitive：判断value是不是原始值(string, number)  
cached：  
camelize：连字符转换为驼峰式  
capitalize：字符串首字母大写  
hyphenate：大写转换成连字符  
bind$1：bind绑定, 比原生的快  
toArray：类数组转化为数组, 有截取功能  
extend：合并两个对象  
isObject：快速检测是否为对象  
isPlainObject：判断是否是纯粹的对象  
toObject：把对象数组合并到对象中  
noop：空方法  
no：返回false  
identity：返回原本参数  
genStaticKeys：提取staticKeys值, 生成一个静态string类型的key  
looseEqual：判断两个值是否松散相等  
looseIndexOf：判断数组是否包含某个值, 若包含返回其位置, 否则返回-1  
  
isReserved：判断字符串是否以$或_开头  
def：定义一个对象属性, 将参数中属性添加到obj中  
parsePath：解析路径, 返回对象  
isNative：判断是否是原生存在的  
nextTick：dom更新之后, 异步执行的回调  
nextTickHandler：nextTick中, 执行回调函数  
warn：打印警告信息  
formatComponentName：格式化的组件名  
formatLocation：格式化的定位信息  
pushTarget：推送至目标队列  
popTarget：从目标队列推出  
Observer：观察者构造函数, 将观察者附加到每个被观察的对象中  
walk：遍历对象, 循环使用defineReactive$$1(下面), 为每个属性添加getter/setters  
defineReactive$$1：在对象上定义一个可修改的属性, getter/setters在此处加入  
observeArray：遍历循环使用observe(下面), 监控数组变化遍历循环使用observe  
observe：为一个值, 创建一个观察者  
protoAugment：使用__proto__拦截原型链, 来增加一个目标对象或者数组  
copyAugment：通过定义隐藏属性来增加目标对象或数组  
set$1：把属性设置到对象上, 如果属性不是已有的, 添加新属性并且触发更改通知  
del：删除某个属性, 必要情况触发更改通知  
dependArray：数组被访问的时候, 用dependArray来收集数组元素的依赖  
defaultStrat：默认选项重写策略  
mergeData：将两个数据对象合并到一起  
mergeHook：两个参数属性合并为数组  
mergeAssets：合并构造函数, 父类, 当前实例三者的options  
checkComponents：验证组件名  
normalizeProps：把属性值转化为基于对象的驼峰式  
normalizeDirectives：将原始函数指令转换为对象格式  
mergeOptions：将两个option对象合并成一个, 核心用于实例化和继承中  
resolveAsset：解决子实例访问祖先链中的资源的问题  
validateProp：  
getPropDefaultValue：获取属性的默认值  
assertProp：判断属性是否有效  
assertType：检验值的类型  
getType：获取函数类型  
isType：判断函数类型  
Object.freeze：阻止修改现有属性的特性和值，并阻止添加新属性  
initProxy：{  
    allowedGlobals：允许全局  
    warnNonPresent：未定义警告  
    hasProxy：是否有代理  
    hasHandler：是否有需要处理的key  
    getHandler：处理  
    initProxy：初始化  
}  
VNode：虚拟节点  
createEmptyVNode：创建一个空节点  
createTextVNode：创建一个text节点  
cloneVNode：克隆一个新虚拟节点  
cloneVNodes：克隆多个虚拟节点  
createComponent：创建（定义）组件  
createFunctionalComponent：新建功能性组件  
createComponentInstanceForVnode：为虚拟节点创建组件实例  
init：初始化  
prepatch：提前打补丁  
insert：插入节点  
destroy$1：销毁节点  
resolveAsyncComponent：解决组件异步问题  
extractProps：提取属性存入res（仅提取原生的）  
checkProp：提取属性key存入res  
mergeHooks：把钩子组件合并到节点上  
mergeHook$1：递归合并  
mergeVNodeHook：合并虚拟节点钩子  
normalizeEvent：事件规范化  
createEventHandle：新建事件处理  
updateListeners：更新监听  
simpleNormalizeChildren：标准化子组件  
normalizeChildren：标准化子模板  
normalizeArrayChildren：标准化数组类型子模板  
getFirstComponentChild：获取首个子组件  
createElement：新建一个元素  
_createElement：新建一个元素（私有）  
applyNS：  
initRender：初始化渲染  
renderMixin：渲染mixin  
markStatic：标记静态节点  
markStaticNode：标记静态节点  
resolveFilter：过滤器辅助  
renderList：v-for 渲染  
bindProps：v-bind绑定class、style等  
checkKeyCodes：校验v-on事件键值  
resolveSlots：父组件子组件之间的通信   
initEvents：事件初始化  
add$1：添加事件  
remove$2：移除事件  
updateComponentListeners：更新组件监听  
eventsMixin：mixin事件  
{  
    $on：载入hook事件  
    $once：使用一次  
    $off：移除事件  
    $emit：触发事件  
  
}  
initLifecycle：初始化生命周期  
lifecycleMixin：minxin生命周期  
{  
    _mount：mounted钩子函数  
    _update：更新vm  
    _updateFromParent：更新子vm  
    $forceUpdate：强制更新  
    $destroy：销毁dom  
  
}  
callHook：调用钩子函数  
resetSchedulerState：重置调度状态  
flushSchedulerQueue：刷新调度队列，并启动监听。  
queueWatcher：将一个观察者推入观察者队列  
Watcher：当一个表达式的值改变时，watcher就开始解析  
{  
    get：获取getter值  
    addDep：为指令添加Dep依赖  
    cleanupDeps：清除依赖  
    update：更新数据（判断，三种情况）  
    run：数据更新  
    evaluate：延迟模式下获取getter  
    depend：遍历依赖  
    teardown：watcher列表中移除自身  
}  
traverse：_traverse的对外接口  
_traverse：递归遍历  
initState：初始化状态（initMixin中使用）  
initProps：初始化属性，给每个属性添加getter/setter  
initData：初始化数据  
initComputed：初始化computed  
makeComputedGetter：new一个watcher，并返回getter值  
initMethods：初始化methods  
initWatch：初始化watcher（使用createWatcher）  
createWatcher：创建一个watcher（使用$watch）  
stateMixin：特殊处理flow  
proxy：添加get/set  
initMixin：{  
    _init：初始化Mixin  
}  
initInternalComponent：初始化内部组件  
resolveConstructorOptions：处理构造函数参数  
Vue$3：新建一个vue  
initUse：  
initMixin$1：实例化一个mixin  
initExtend：{  
    <!-- 初始化扩展 -->  
    extend：子构造函数  
}  
initAssetRegisters：初始化资源注入  
getComponentName：获取组件名  
matches：判断正则匹配/字符串包含关系  
pruneCache：cache中的key值全部置为null及销毁入口  
pruneCacheEntry：销毁cache入口  
initGlobalAPI：初始化全局api  
mustUseProp：标签binding时，是否必须带属性  
genClassForVnode：虚拟节点生成类名，使用genClassFromData  
mergeClassData：合并类名  
genClassFromData：生成类名  
concat：合并（类名）  
stringifyClass：数组或对象形式类名，转字符串形式  
isHTMLTag：html标签  
isSVG：svg标签  
isPreTag：是不是pre标签  
isReservedTag：是否是html保留的标签  
getTagNamespace：获取标签的命名空间  
isUnknownElement：是否是未知元素  
query：查找标签元素  
createElement$1：创建一个dom节点  
createElementNS：创建元素命名空间  
createTextNode：创建文本节点  
createComment：创建注释  
insertBefore：前置插入节点  
removeChild：移除子节点  
appendChild：插入节点  
parentNode：节点的父节点  
nextSibling：下一个兄弟节点  
tagName：标签名  
setTextContent：设置节点文本  
setAttribute：设置节点属性  
nodeOps：节点操作  
registerRef：  
isUndef：是否是未定义  
isDef：是否已定义  
sameVnode：是否是相同的虚拟节点  
createKeyToOldIdx：key转索引  
createPatchFunction：{  
    <!-- 创建补丁方法 -->  
    emptyNodeAt：置空虚拟节点中的某个元素  
    createRmCb：  
    removeNode：移除节点  
    createElm：新建一个节点  
    createComponent：新建一个组件  
    initComponent：初始化组件  
    reactivateComponent：激活组件  
    insert：插入元素  
    createChildren：创建子节点  
    isPatchable：是否可以打补丁  
    invokeCreateHooks：唤醒创建的钩子函数  
    setScope：设置scoped css  
    addVnodes：添加多个节点  
    invokeDestroyHook：唤醒销毁钩子函数  
    removeVnodes：移除节点  
    removeAndInvokeRemoveHook：唤醒移除钩子函数，移除节点  
    updateChildren：更新子节点  
    patchVnode：节点打补丁  
    invokeInsertHook：唤醒根节点插入的钩子函数  
    hydrate：  
    assertNodeMatch：节点是否匹配  
    patch：闭包  
}  
  
updateDirectives：更新指令（调用_update）  
_update：更新指令  
normalizeDirectives$1：指令标准化  
getRawDirName：获取原始指令名  
callHook$1：实例化钩子函数  
updateAttrs：更新属性  
setAttr：设置属性值  
updateClass：更新类名  
add$2：添加事件  
remove$3：移除事件  
updateDOMListeners：更新dom事件监听（调用updateListeners）  
updateDOMProps：更新dom属性  
shouldUpdateValue：是否需要更新值  
isDirty：是否是脏数据  
isInputChanged：input值是否发生改变  
normalizeStyleData：合并静态和动态样式（normalizeStyleBinding实现）  
normalizeStyleBinding：标准化array/string格式样式成对象格式  
getStyle：获取样式，对象  
setProp：设置样式属性  
updateStyle：更新样式  
addClass：添加class  
removeClass：移除样式  
  
nextFrame：下一帧？  
addTransitionClass：添加动画类  
removeTransitionClass：移除动画类  
whenTransitionEnds：动画结束，移除事件  
getTransitionInfo：获取动画信息  
getTimeout：超时  
toMs：  
enter：进入动画  
leave：离开动画  
resolveTransition：  
once：执行一次动画  
_enter：调用enter  
model：{  
    inserted：  
    componentUpdated：  
}  
setSelected：  
hasNoMatchingOption：没有相等的值  
getValue：获取值  
onCompositionStart：  
onCompositionEnd：  
trigger：事件触发  
locateNode：递归搜索  
show：{  
    bind：绑定  
    update：更新  
    unbind：解绑  
}  
getRealChild：  
extractTransitionData：导出过渡动画数据  
placeholder：  
hasParentTransition：父节点是否有过渡动画  
isSameChild：是否是同一个子节点  
Transition： {  
    render：渲染动画  
}  
TransitionGroup：{  
    render：渲染  
    beforeUpdate：更新前的一些操作  
    updated：视图更新  
    methods: {  
        hasMove：是否需要移动  
    }  
}  
  
callPendingCbs：调用pending回调  
recordPosition：记录元素位置  
applyTranslation：动画  
$mount：  
shouldDecode：是否需要解码  
shouldDecodeNewlines：新行解码  
decode：解码  
decodeAttr：解析内容  
parseHTML：解析html  
advance：截取部分  
parseStartTag：解析开始标签  
handleStartTag：处理开始标签  
parseEndTag：解析结束标签  
parseFilters：解析过滤器  
pushFilter：推进过滤器  
wrapFilter：包装过滤器  
parseText：解析text  
baseWarn：vue警告  
pluckModuleFunction：module提取  
addProp：添加属性（固有属性）  
addAttr：添加属性（自定义属性）  
addDirective：添加指令  
addHandler：添加事件处理  
getBindingAttr：获取绑定的属性  
getAndRemoveAttr：获取或者移除属性  
parseModel：解析model  
next：下一个ascii码  
eof：索引是否超出总长度  
isStringStart：是否是以 " 或者 ' 开始  
parseBracket：解析类（调用parseString）  
parseString：解析string  
parse：{ html解析为抽象语法树  
    start: {  
        checkRootConstraints: 是否包含el  
    }  
    end: {  
  
    }  
    chars: {  
          
    }  
}  
processPre：是否包含v-pre  
processRawAttrs：处理raw attrs  
processKey：处理 key  
processRef：处理ref  
processFor：处理for  
processIf：处理if（调用addIfCondition）  
processIfConditions：处理if条件（调用addIfCondition）  
findPrevElement：找到前一个元素  
addIfCondition：添加if限制  
processOnce：处理一次  
processSlot：处理slot  
processComponent：处理组件  
processAttrs：处理属性attr  
checkInFor：检验是否有for  
parseModifiers：解析修饰符  
makeAttrsMap：attr 转 map  
isForbiddenTag：是否是禁止使用的标签  
guardIESVGBug：监控ie的svg bug  
checkForAliasModel：v-model是否使用在v-for的别名中  
optimize：优化  
genStaticKeys$1：获取静态树键值  
markStatic：把节点状态置为静态  
markStaticRoots：置为静态根目录  
walkThroughConditionsBlocks：遍历  
isStatic：是否是静态节点  
isDirectChildOfTemplateFor：是否是template的直属子节点，并且有for循环  
genHandlers：处理key（调用genHandler）  
genHandler： 处理改变的key值 
genKeyFilter：生成key值过滤  
genFilterCode：过滤键值  
bind$2：v-bind绑定class、style等  
generate：生成render  
genElement：生成页面元素  
genStatic：生成静态树  
genOnce：一次性插值  
genIf：生成if元素  
genIfConditions：生成if条件  
genFor：生成for元素  
genData：生成data  
genDirectives：生成指令  
genInlineTemplate：生成行内模板  
genScopedSlots：调用genScopedSlot  
genScopedSlot：生成slot  
genChildren：生成子元素  
getNormalizationType：获取标准化类型  
needsNormalization：元素是否需要标准化  
maybeComponent：（非保留tag标签）是否是组件  
genNode：生成节点（包括元素和文本节点）  
genText：生成文本节点  
genSlot：生成插槽  
genComponent：生成组件  
genProps：生成属性  
transformSpecialNewlines：换行  
compile$1：编译模板  
detectErrors：探测错误  
checkNode：检查node错误  
checkFor：检查v-for的错误  
checkIdentifier：检查标志符  
checkExpression：检查表达式  
transformNode：节点转换（绑定class）  
genData$1：生成（class）data  
transformNode$1：节点转换（绑定style）  
genData$2：生成(style)data  
model$1：生成动态model（v-bind:）  
genCheckboxModel：生成checkbox model  
genRadioModel：生成radio model  
genDefaultModel：生成默认的model  
genSelect：生成select model  
checkOptionWarning：检查option错误  
genAssignmentCode：生成任务码  
text：text节点  
html：html节点  
compile$$1：编译  
compileToFunctions：编译function  
makeFunction：生成一个function  
idToTemplate：el转模板  
$mount：渲染完成  
getOuterHTML：获取outer html  
