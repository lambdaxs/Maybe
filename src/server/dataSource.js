const express = require('express');
const router = express.Router();
const mongo = require('../data/db/mongo');
const redis = require('../data/redis/redis');
const mq = require('../data/mq/queue');
const common = require('../common/funcName');
const check = require('../../config/check');


const Init = async()=>{
  await mongo.Init();
  redis.Init();
};

//middleware
const MongoMW = (req,res,next)=>{
  const {metadata={}} = req.body;
  const {name='',dbname='',colname='',cmd='',args=[]} = metadata;
  if (!check.isMongoName(name)){
    return res.json({code:1,msg:'mongo name param error'})
  }
  if (!check.isMongoDBName(name,dbname)){
    return res.json({code:1,msg:'mongo name dbname param error'})
  }
  if (!colname){
    return res.json({code:1,msg:'mongo colname param error'})
  }
  if (!common.isMongoFunc(cmd)){
    return res.json({code:1,msg:'mongo cmd param error'})
  }
  next()
};

const RedisMW = (req,res,next)=>{
  const {metadata = {}} = req.body;
  const {name='',cmd='',args=[]} = metadata;
  if (!check.isRedisName(name)){
    return res.json({code:2,msg:'redis name param error'});
  }
  if (!common.isRedisFunc(cmd)){
    return res.json({code:2,msg:'redis cmd param error'});
  }
  next()
};


//monogo call
router.post('/mongo', MongoMW,async function(req, res) {
  const {metadata={}} = req.body;
  const {name='',dbname='',colname='',cmd='',args=[]} = metadata;
  const model = new mongo.MongoCall({
    name,
    dbname,
    colname,
  }).Model();

  let task = null;
  if (cmd === 'find'){
   task = model[cmd](...args).toArray()
  }else {
    task = model[cmd](...args)
  }

  task.then(rs=>{
    return res.json({code:0,data:rs})
  }).catch(err=>{
    const {message=''} = err || {};
    return res.json({code:3,msg:`mongo cmd error ${message}`});
  });
});


//redis call
router.post('/redis', RedisMW,function(req, res) {
  const {metadata = {}} = req.body;
  const {name='',cmd='',args=[]} = metadata;
  const model = new redis.RedisCall({name}).Model();
  model[cmd](...args,(err,rs)=>{
    if (err){
      const {message=''} = err || {};
      return res.json({code:4,msg:`redis cmd error ${message}`});
    }else {
      return res.json({code:0,data:rs})
    }
  })
});

//mq call
router.post('/mq',function (req, res) {
  const {dataType='',cmd='',params=[],metadata={}} = req.body;
});

module.exports = {
  Init,
  router
};