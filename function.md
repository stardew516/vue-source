_toString: 把val转为string类型
toNumber: 把val转为number, 若失败, 直接返回原值
makeMap: 根据str, 生成一个map, 然后返回一个方法, 这个方法的作用是, 判断一个值是否在这个生成的map中.
isBuiltInTag: 判断某个tag是否是slot, component
remove$1: 数组中删除一项
hasOwn: 判断对象中是否存在某个自有属性
isPrimitive: 判断value是不是原始值(string, number)
cached:
camelize: 连字符转换为驼峰式
capitalize: 字符串首字母大写
hyphenate: 大写转换成连字符
bind$1: bind绑定, 比原生的快
toArray: 类数组转化为数组, 有截取功能
extend: 合并两个对象
isObject: 快速检测是否为对象
isPlainObject: 判断是否是纯粹的对象
toObject: 把对象数组合并到对象中
noop: 空方法
no: 返回false
identity: 返回原本参数
genStaticKeys: 提取staticKeys值, 生成一个静态string类型的key
looseEqual: 判断两个值是否松散相等
looseIndexOf: 判断数组是否包含某个值, 若包含返回其位置, 否则返回-1

isReserved: 判断字符串是否以$或_开头
def: 定义一个对象属性, 将参数中属性添加到obj中
parsePath: 解析路径, 返回对象
isNative: 判断是否是原生存在的
nextTick: dom更新之后, 异步执行的回调
nextTickHandler: nextTick中, 执行回调函数
warn: 打印警告信息
formatComponentName: 格式化的组件名
formatLocation: 格式化的定位信息
pushTarget: 推送至目标队列
popTarget: 从目标队列推出
Observer: 观察者构造函数, 将观察者附加到每个被观察的对象中
walk: 遍历对象, 循环使用defineReactive$$1(下面), 为每个属性添加getter/setters
defineReactive$$1: 在对象上定义一个可修改的属性, getter/setters在此处加入
observeArray: 遍历循环使用observe(下面), 监控数组变化遍历循环使用observe
observe: 为一个值, 创建一个观察者
protoAugment: 使用__proto__拦截原型链, 来增加一个目标对象或者数组
copyAugment: 通过定义隐藏属性来增加目标对象或数组
set$1: 把属性设置到对象上, 如果属性不是已有的, 添加新属性并且触发更改通知
del: 删除某个属性, 必要情况触发更改通知
dependArray: 数组被访问的时候, 用dependArray来收集数组元素的依赖
defaultStrat: 默认选项重写策略
mergeData: 将两个数据对象合并到一起
mergeHook: 两个参数属性合并为数组
mergeAssets: 合并构造函数, 父类, 当前实例三者的options
checkComponents: 验证组件名
normalizeProps: 把属性值转化为基于对象的驼峰式
normalizeDirectives: 将原始函数指令转换为对象格式
mergeOptions: 将两个option对象合并成一个, 核心用于实例化和继承中
resolveAsset: 解决子实例访问祖先链中的资源的问题
validateProp:
getPropDefaultValue: 获取属性的默认值





















