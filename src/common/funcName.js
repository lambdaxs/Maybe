const redisFunc = {
  key: ['del','dump','exists','expire','expireat','keys','migrate','move','object','persist','pexpire','pexpireat','pttl','randomkey','rename','renamenx','restore','sort','ttl','type','scan'],
  string:['append','bitcount','bitop','bitfield','decr','decrby','get','getbit','getrange','getset','incr','incrby','incrbyfloat','mget','mset','msetnx','psetex','set','setbit','setex','setnx','setrange','strlen'],
  hash:['hdel','hexists','hget','hgetall','hincrby','hincrbyfloat','hkeys','hlen','hmget','hmset','hset','hsetnx','hvals','hscan','hstrlen'],
  list:['blpop','brpop','brpoplpush','lindex','linsert','llen','lpop','lpush','lpushx','lrange','lrem','lset','ltrim','rpop','rpoplpush','rpush','rpushx'],
  set:['sadd','scard','sdiff','sdiffstore','sinter','sinterstore','sismember','smembers','smove','spop','srandmember','srem','sunion','sunionstore','sscan'],
  zset:['zadd','zcard','zcount','zincrby','zrange','zrangebyscore','zrank','zrem','zremrangebyrank','zremrangebyscore','zrevrange','zrevrangebyscore','zrevrank','zscore','zunionstore','zinterstore','zscan','zrangebylex','zlexcount','zremrangebylex']
};

const mongoFunc = {
  create:['insertOne','insertMany'],
  update:['updateOne','updateMany','findOneAndUpdate'],
  find:['find','findOne'],
  delete:['deleteOne','deleteMany','findOneAndDelete'],
  analysis:['count','distinct','aggregate']
};

let mongoFuncSet = [];
let redisFuncSet = [];

(()=>{
  mongoFuncSet = Object.keys(mongoFunc).map(key=>{
    return mongoFunc[key]
  }).reduce((a,b)=>{
    return a.concat(b);
  });
  redisFuncSet = Object.keys(redisFunc).map(key=>{
    return redisFunc[key]
  }).reduce((a,b)=>{
    return a.concat(b);
  })

})();

const isMongoFunc = (funcName)=>{
  return mongoFuncSet.indexOf(funcName) !== -1;
};

const isRedisFunc = (funcName)=>{
  return redisFuncSet.indexOf(funcName) !== -1;
};

const getMongoFuncs = ()=>{
  return mongoFuncSet
};

const getRedisFuncs = ()=>{
  return redisFuncSet;
};

module.exports = {
  isMongoFunc,
  isRedisFunc,
  getRedisFuncs,
  getMongoFuncs,
};