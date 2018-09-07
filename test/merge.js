const c1 = {
    cal: 'db',
    metadata: {
        name: "db1",
        dbname: "test1",
        colname: "items",
        cmd: "find",
        args: [{}, {}],
    },
    context: 'itemList'
};

const c2 = {
    cal: 'cal',
    metadata: {
        cmd: 'map',
        args: ['context.itemList', 'v=>v.uid']
    },
    context: 'uids'
};

const c3 = {
    cal: 'db',
    metadata: {
        name: "db1",
        dbname: "test1",
        colname: "user",
        cmd: "find",
        args: [{_id: {$in: 'context.uids'}}, {}],
    },
    context: 'users'
};

const c4 = {
    cal:'cal',
    metadata:{
        cmd:'value',
        args:['context',`(c)=>{
            let {users,itemList} = c;
            itemList = itemList.map(v=>{
                const user = users.find(u=>u._id.toString() === v.uid)||{name:''};
                v.userName = user.name;
                return v;
            })
            return itemList;
        }`]
    },
    context:'result'
};

const c5 = {
  cal:'cal',
  metadata:{
      cmd:'value',
      args:['context.result',`v=>v`]
  }
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
    },
    value:function (v,f) {
        return f(v);
    }
};

const usersUtil = {};
const mongo = require('../src/data/db/mongo');
const redis = require('../src/data/redis/redis');
const util  = require('../src/lib/util');

const exec = async (ops) => {

    await mongo.Init();
    redis.Init();

    const context = {};
    for (let i = 0; i < ops.length; i++) {
        const {cal = '', metadata = {}, context: context_key = ''} = ops[i];
        let {cmd = '', args = []} = metadata;


        if (cal === 'db') {//预编译解码
            const {name, dbname, colname} = metadata;
            let [query={},option={}] = args;
            query = util.format_query(util.format_args_query(context,query));
            const model = new mongo.MongoCall({name,dbname,colname}).Model();
            try{
                if (cmd === 'find'){
                    context[context_key] = await model[cmd](query,option).toArray();
                }else {
                    context[context_key] = await model[cmd](query,option);
                }
            }catch (err){
                console.log('db op err '+err.message);
                break
            }
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
            const result = cal_func(...args);
            if (context_key){
                context[context_key] = result;
            }else {
                return result
            }
        }else if (cal === 'redis'){
            const {name} = metadata;
            args = args.map(exp=>{//预编译解码args中的数据变量
                if (typeof exp === 'string'){
                    return eval(exp);
                }else {
                    return exp;
                }
            });
            const model = new redis.RedisCall({name}).Model();
            try{
                const func = ()=>{
                    return new Promise((s,f)=>{
                        model[cmd](query,option).then(

                        )
                    })
                };
                context[context_key] = await ;
            }catch (err){
                console.log('db op err '+err.message);
                break
            }
        }
    }
    return context;
};

(async()=>{
    const rs = await exec([c1,c2,c3,c4,c5]);
    console.log(rs);
})();
