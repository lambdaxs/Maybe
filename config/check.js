const config = require('./index');

const mongoNames = Object.keys(config.mongos);
const mongoDBNames = Object.keys(config.mongos).map(name=>{
  const {dbnames=[]} = config.mongos[name];
  return dbnames.map(dbname=>{
    return `${name}$${dbname}`
  });
}).reduce((a,b)=>{
  return [...a,...b];
});

const redisNames = Object.keys(config.redis);

const isMongoName = (name)=>{
  return mongoNames.indexOf(name) !== -1;
};

const isMongoDBName = (name,dbname)=>{
  return mongoDBNames.indexOf(`${name}$${dbname}`) !== -1;
};

const isRedisName = (name)=>{
  return redisNames.indexOf(name) !== -1;
};

module.exports = {
  isMongoName,
  isMongoDBName,
  isRedisName,
};