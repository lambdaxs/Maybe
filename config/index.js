const env = process.env.NODE_ENV;

const configMap = {
    "dev":require('./config-local'),
    "prod":require('./config-prod')
};

const configData = configMap[env];
module.exports = configData;