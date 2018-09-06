const express = require('express');
const router = express.Router();
const redis = require('../data/redis/redis');
const common = require('../common/funcName');
const check = require('../../config/check');


const Init = async () => {
    redis.Init();
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

module.exports = {
    Init,
    router
};