const users = [
    {"id": 1, "name": "a"},
    {"id": 2, "name": "b"},
    {"id": 3, "name": "e"},
    {"id": 4, "name": "c"},
    {"id": 5, "name": "d"},
];

const item_logs = [
    {"id": 100, "op": "add", "uid": 1, "item_id": 1},
    {"id": 101, "op": "add", "uid": 2, "item_id": 1},
    {"id": 102, "op": "add", "uid": 3, "item_id": 2},
];

const new_item_logs = item_logs.map(v => {
    const user = users.find(u => {
        return v.uid === u.id
    }) || {};
    v.name = user.name;
    return v
});

const join = () => {
    const itemList = item_logs.filter(v => v.item_id === 1);
    const uids = itemList.map(v => v.uid);
    const userList = users.filter(v => uids.indexOf(v.id) !== -1)
};

const c1 = {
    cal: 'db',
    metadata: {
        name: "db1",
        dbname: "test",
        colname: "item_log",
        cmd: "find",
        args: [{item_id: 1}, {}],
    },
    context: 'itemList'
};

const c2 = {
    cal: 'cal',
    metadata: {
        cmd: 'map',
        args: ['context.itemList', '(v)=>{v.uid}']
    },
    context: 'uids'
};

const c3 = {
    cal: 'db',
    metadata: {
        name: "db1",
        dbname: "test",
        colname: "user",
        cmd: "find",
        args: [{_id: {$in: 'context.uids'}}, {}],
    },
    context: 'users'
};

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

const usersUtil = {};

const dbFind = async (name, dbname, colname) => {
    return [{
        name,
        dbname,
        colname
    }]
};

const exec = async (ops) => {
    const context = {};
    for (let i = 0; i < ops.length; i++) {
        const {cal = '', metadata = {}, context: context_key = ''} = ops[i];
        let {cmd = '', args = []} = metadata;


        if (cal === 'db') {//预编译解码
            const {name, dbname, colname} = metadata;
            args = util.format_args_query(context,args[0]={});
            context[context_key] = await dbFind(name, dbname, colname)
        } else if (cal === 'cal') {//cmd 可定义扩展 系统自带 map filter reduce sort find join
            const cal_func = systemUtil[cmd];
            if (!cal_func) {
                throw new Error(`op[${i}]计算单元错误，cmd：${cmd}错误，找不到对应cal_func`)
            }
            args = args.map(exp=>{//预编译解码args中的数据变量
                if (typeof exp === 'string'){
                    return eval(exp);
                }else {
                    return exp;
                }
            });
            context[context_key] = cal_func(...args);
        }
    }
    console.log(context)
};

