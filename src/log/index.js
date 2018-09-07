const bunyan = require('bunyan');

const getLogger = (name)=>{
    return bunyan.createLogger({
        name: name,
        streams: [
            {
                level: 'info',
                stream: process.stdout            // log INFO and above to stdout
            },
            {
                level: 'info',
                type: 'rotating-file',
                path: `./logs/${name}_info.log`,
                period: '1d',
                count: 3,
            },
            {
                level: 'error',
                type: 'rotating-file',
                path: `./logs/${name}_error.log`,
                period: '1d',
                count: 3,
            },
        ]
    });
};

module.exports = {
    getLogger
};