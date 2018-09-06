const systemUtil = {
    map: function (array, f) {
        return array.map(f)
    },
    filter: function (array, f) {
        return array.filter(f)
    },
    reduce: function (array, f, init) {
        return array.reduce(f.init)
    },
    sort: function (array, f) {
        return array.sort(f)
    },
    find: function (array, f) {
        return array.find(f)
    },
    join: function (array, str) {
        return array.join(str)
    },
    value:function (value,f) {
        return f(value)
    }
};

const SystemCmd = (cmd)=>{
    return systemUtil[cmd]
};

module.exports = SystemCmd;