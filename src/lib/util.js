const ObjectId = require('mongodb').ObjectID;

const format_query = (query) => {
    const obj = {};
    Object.keys(query).forEach(key => {
        if (key === '$and' || key === '$or') {
            obj[key] = query[key].map(function (data) {
                //递归解析and和or
                return format_query(data);
            });
        } else if (key === '_id') {
            const value = query[key];
            if (typeof value === 'string') {
                obj[key] = ObjectId(value);
            } else if (typeof value === 'object') {//$in $or
                if (value['$in']) {
                    const ids = value['$in'].map(v => ObjectId(v));
                    obj[key] = {$in: ids}
                } else if (value['$nin']) {
                    const ids = value['$nin'].map(v => ObjectId(v));
                    obj[key] = {$nin: ids}
                } else {
                    console.log('parse query _id error 2')
                }
            } else {
                console.log('parse query _id error 1');
            }
        } else {
            obj[key] = query[key];
        }
    });
    return obj
};

const format_args_query = (context,params, query) => {
    const obj = {};
    Object.keys(query).forEach(key => {
        if (key === '$and' || key === '$or') {//递归解析and和or
            obj[key] = query[key].map(function (data) {
                return format_args_query(context,params, data);
            });
        } else if (typeof query[key] === 'object') {//继续递归解析
            obj[key] = format_args_query(context,params, query[key])
        } else if (typeof query[key] === 'string') {//
            let value = query[key];
            if (value.startsWith('context.')) {
                obj[key] = eval(value)
            }else if (value.startsWith('params.')){
                obj[key] = eval(value)
            }
        } else {
            obj[key] = query[key];
        }
    });
    return obj
};

module.exports = {
    format_query,
    format_args_query
};