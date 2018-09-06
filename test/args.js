const util = require('../src/data/db/util');

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
    }
};

const test = () => {
    const context = {
        itemList: [1, 2, 3, 4, 5]
    };
    const cmd = 'map';
    let args = ['context.itemList', '(v)=>v*2'];
    args = args.map(exp=>{
        if (typeof exp === 'string'){
            return eval(exp);
        }else {
            return exp;
        }
    });
    return systemUtil[cmd](...args)
};

const runDB = ()=>{
    const context = {
        uids:[1,2,3,4,5,6],
        aids:[1,2],
    };
    return util.format_args_query(context,{})
};



// console.log(test());

console.time("a");
console.log(test());
console.timeEnd("a");

