const redisClient = require('redis');
const config = require('../../../config');

let ClientMap = {};

const Init = () => {
    const {redis} = config;
    Object.keys(redis).forEach(name => {
        const {addr} = redis[name];
        const client = redisClient.createClient({url: addr});
        client.on('end',()=>{
            console.log(`redis:${name} close success`)
        });
        ClientMap[name] = client;
        console.log(`redis client name:${name}  addr:${addr} connect success`)
    })
};

const getClient = (name) => {
    return ClientMap[name];
};

const closeAll = () => {
    Object.keys(ClientMap).forEach(k => {
        const client = ClientMap[k];
        if (client) {
            client.quit();
            ClientMap[k] = null;
        }
    })
};

class RedisCall {
    constructor({name}) {
        this.name = name;
    }

    /**
     * 获取redis链接
     * @returns {*}
     * @constructor
     */
    Model() {
        return getClient(this.name);
    }

    /**
     * 关闭redis链接
     * @constructor
     */
    Close() {
        const client = getClient(this.name);
        client.quit();
    }
}

module.exports = {
    Init,
    RedisCall,
    closeAll,
};