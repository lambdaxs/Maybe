const redisClient = require('redis');
const config = require('../../../config');

let ClientMap = {};

const Init = ()=>{
  const {redis} = config;
  Object.keys(redis).forEach(name=>{
    const {addr} = redis[name];
    const client = redisClient.createClient({url:addr});
    ClientMap[name] = client;
    console.log(`redis client name:${name}  addr:${addr} connect success`)
  })
};

const getClient = (name)=>{
  return ClientMap[name];
};

class RedisCall {
  constructor({name}){
    this.name = name;
  }

  /**
   * 获取redis链接
   * @returns {*}
   * @constructor
   */
  Model(){
    return getClient(this.name);
  }

  /**
   * 关闭redis链接
   * @constructor
   */
  Close(){
    const client = getClient(this.name);
    client.close();
  }
}

module.exports = {
  Init,
  RedisCall
};