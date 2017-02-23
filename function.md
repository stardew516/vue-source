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
def: 定义一个对象属性
parsePath: 解析路径, 返回对象





















