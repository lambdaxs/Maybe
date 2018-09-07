const express = require('express');
const router = express.Router();
const mongo = require('../data/db/mongo');
const redis = require('../data/redis/redis');
const mongoHandler = require('./mongo');
const redisHandler = require('./redis');
const mqHandler = require('./mq');

const Init = async () => {
    await mongo.Init();
    redis.Init();
};

router.post('/mongo',mongoHandler.mw,mongoHandler.call);
router.post('/redis',redisHandler.mw,redisHandler.call);
router.post('/mq',mqHandler.mw,mqHandler.call);

module.exports = {
    Init,
    router
};