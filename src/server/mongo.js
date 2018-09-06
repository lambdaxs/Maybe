const express = require('express');
const router = express.Router();
const mongo = require('../data/db/mongo');
const common = require('../common/funcName');
const check = require('../../config/check');
const util = require('../lib/util');


const Init = async () => {
    await mongo.Init();
};

//middleware
const MongoMW = (req, res, next) => {
    const {metadata = {}} = req.body;
    const {name = '', dbname = '', colname = '', cmd = '', args = []} = metadata;
    if (!check.isMongoName(name)) {
        return res.json({code: 100, msg: 'mongo name param error'})
    }
    if (!check.isMongoDBName(name, dbname)) {
        return res.json({code: 100, msg: 'mongo name dbname param error'})
    }
    if (!colname) {
        return res.json({code: 100, msg: 'mongo colname param error'})
    }
    if (!common.isMongoFunc(cmd)) {
        return res.json({code: 100, msg: 'mongo cmd param error'})
    }
    if (args.length === 0){
        return res.json({code: 100, msg: 'mongo args param error'})
    }else {
        if (typeof args[0] !== 'object'){
            return res.json({code: 100, msg: 'mongo args param is not object error'})
        }
    }
    next()
};

//monogo call
router.post('/mongo', MongoMW, async function (req, res) {
    const {metadata = {}} = req.body;
    const {name = '', dbname = '', colname = '', cmd = '', args = []} = metadata;
    const model = new mongo.MongoCall({
        name,
        dbname,
        colname,
    }).Model();

    //format query
    args[0] = util.format_query(args[0]);

    let task = null;
    if (cmd === 'find') {
        task = model[cmd](...args).toArray()
    } else {
        task = model[cmd](...args)
    }

    task.then(rs => {
        return res.json({code: 0, data: rs})
    }).catch(err => {
        return res.json({code: 101, msg: `mongo op error ${err.message}`});
    });
});

module.exports = {
    Init,
    router
};