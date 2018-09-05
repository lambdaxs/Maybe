const express = require('express');
const router = express.Router();
const mongo = require('../data/db/mongo');
const redis = require('../data/redis/redis');
const mq = require('../data/mq/queue');
const common = require('../common/funcName');
const check = require('../../config/check');
const util = require('../data/db/util');


const Init = async () => {
    await mongo.Init();
    redis.Init();
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

const RedisMW = (req, res, next) => {
    const {metadata = {}} = req.body;
    const {name = '', cmd = '', args = []} = metadata;
    if (!check.isRedisName(name)) {
        return res.json({code: 200, msg: 'redis name param error'});
    }
    if (!common.isRedisFunc(cmd)) {
        return res.json({code: 200, msg: 'redis cmd param error'});
    }
    if (args.length === 0){
        return res.json({code: 200, msg: 'redis args param error'})
    }
    next()
};

const MqMW = (req,res,next)=>{
    const {metadata = {}} = req.body;
    const {name = '', cmd = '', args = []} = metadata;
    if (!check.isQueueName(name)){
        return res.json({code: 300, msg: 'mq name param error'});
    }
    if (['Consume','Produce','ProduceMany'].indexOf(cmd) === -1){
        return res.json({code: 300, msg: 'mq cmd param error'});
    }
    next();
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

//mongo join call
router.post('/mongo/join',MongoMW,async(req,res)=>{
    
});


//redis call
router.post('/redis', RedisMW, function (req, res) {
    const {metadata = {}} = req.body;
    const {name = '', cmd = '', args = []} = metadata;
    const model = new redis.RedisCall({name}).Model();
    model[cmd](...args, (err, rs) => {
        if (err) {
            return res.json({code: 201, msg: `redis op error ${err.message}`});
        } else {
            return res.json({code: 0, data: rs})
        }
    })
});

//mq call
router.post('/mq',MqMW, async function (req, res) {
    const {metadata = {}} = req.body;
    const {name='',cmd='',args=[]} = metadata;
    const model = new mq.MsgQueue({name});
    model[cmd](...args).then(data=>{
        return res.json({code:0,data});
    }).catch(err=>{
        return res.json({code:301,msg:'mq op error '+err.message});
    })
});

module.exports = {
    Init,
    router
};