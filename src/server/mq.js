const mq = require('../data/mq/queue');
const check = require('../../config/check');
const log = require('../log');

const logger = log.getLogger('mq');

const mw = (req,res,next)=>{
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

//mq call
const call = async function (req, res) {
    const {metadata = {}} = req.body;
    const {name='',cmd='',args=[]} = metadata;
    const model = new mq.MsgQueue({name});
    model[cmd](...args).then(data=>{
        logger.info({metadata,result:data});
        return res.json({code:0,data});
    }).catch(err=>{
        logger.error({metadata,error:err.message});
        return res.json({code:301,msg:'mq op error '+err.message});
    })
};

module.exports = {
    mw,
    call
};