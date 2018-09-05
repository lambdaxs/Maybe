const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const log4js = require('log4js');
const logger = require('../log/index');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(log4js.connectLogger(logger.getLogger('normal'),{level:log4js.levels.INFO}));

const router = express.Router();

/**
 * 创建服务器
 * @param options
 * @returns {{app: *, router: *}}
 */
const createHttpServer = (options = {}) => {
  const { port } = options;
  app.listen(port, err => {
    if (err) {
      console.log(err);
    } else {
      console.log(`http server start at:${port}`);
    }
  });
  return {
    app,
    router
  };
};

module.exports = {
  createHttpServer
};
