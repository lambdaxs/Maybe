const log4js = require('log4js');
log4js.configure({
    appenders: {
        normal:{
            type: 'file', //文件输出
            filename: 'logs/access.log',
            maxLogSize: 1024,
            backups:3,
            category: 'normal'
        }
    },
    categories: {
        default: {
            appenders: ['normal'], level: 'debug'
        }
    }
});

const getLogger = (name)=>{
    return log4js.getLogger(name)
};

module.exports = {
    getLogger
};