const config = require('../../../config');
const redis = require('../redis/redis');

class MsgQueue {
    constructor({name}) {
        const {queue} = config;
        const queueMap = queue[name];
        if (!queueMap){
            return
        }
        this.msgKey = queueMap.key;
        const queueRedis = new redis.RedisCall({name:"queue"});
        this.client = queueRedis.Model();
    }


    /**
     * 生产一条消息
     * @param msg {object} 消息
     * @returns {Promise<number>} 队列当前长度
     * @constructor
     */
    Produce(msg) {
        return new Promise((s, f) => {
            if (!this.msgKey){
                return f(new Error('error queueu name'))
            }
            this.client.lpush(this.msgKey, JSON.stringify(msg), (err, reply) => {
                if (err) {
                    f(err)
                } else {
                    s(reply * 1)
                }
            })
        })
    }


    /**
     * 生产多条消息
     * @param msgList {array} 消息数组
     * @returns {Promise<boolean>} 插入成功
     * @constructor
     */
    ProduceMany(msgList) {//批量数据 分批插入
        return new Promise((s, f) => {
            if (!this.msgKey){
                return f(new Error('error queueu name'))
            }
            if (!Array.isArray(msgList)) {
                return f(new Error("msgList must be Array"))
            }
            const tasks = chunkList(msgList).map(task=>{
                task = task.map(v=>JSON.stringify(v));
                return new Promise((s,f)=>{
                    this.client.lpush(this.msgKey,task,(err,reply)=>{
                        if (err){
                            f(err)
                        }else {
                            s()
                        }
                    })
                })
            });
            Promise.all(tasks).then(_=>{
                s(true)
            }).catch(err=>{
                f(err)
            })
        });

    }

    /**
     * 消费消息
     * @returns {Promise<object>}
     * @constructor
     */
    Consume() {
        return new Promise((s,f)=>{
            if (!this.msgKey){
                return f(new Error('error queueu name'))
            }
            this.client.brpop(this.msgKey,1,(err,reply)=>{
                if (err){
                    f(err)
                }else {
                    if (Array.isArray(reply)){
                        const [_,msg] = reply;
                        s(JSON.parse(msg))
                    }else {
                        f(new Error('has no msg'))
                    }
                }
            })
        })
    }
}

const chunkList = (msgList,size=100)=>{
    const total_count = msgList.length;
    const chunk_size = size;
    const tasks = Math.ceil(total_count/chunk_size);
    const resultList = new Array(tasks.length);
    for (let i=0;i<tasks;i++){
        let msgChunk = [];
        for (let j=0;j<chunk_size;j++){
            const index = i*chunk_size+j;
            if (index < total_count){
                const msg = JSON.stringify(msgList[index]);
                msgChunk.push(msg)
            }
        }
        resultList[i] = msgChunk;
    }
    return resultList;
};

module.exports = {
    MsgQueue
};
