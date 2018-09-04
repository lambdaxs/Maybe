const mongoClient = require('mongodb').MongoClient;
const config = require('../../../config');

let DBMap = {};
let ClientMap = {};

//初始化mongo链接
const Init = async () => {
  const {mongos} = config;
  const names = Object.keys(mongos);
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const value = mongos[name];
    const {addr, dbnames} = value;
    const client = await createMongoClient(addr);
    dbnames.forEach(dbname => {
      ClientMap[name] = client;
      DBMap[`${name}$${dbname}`] = client.db(dbname);
      console.log(`mongodb:${addr} db:${dbname} connect success`)
    })
  }
};

const createMongoClient = (url) => {
  return new Promise((s, f) => {
    mongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
      if (err) {
        f(err)
      } else {
        s(client)
      }
    })
  });
};

const getCol = (name, dbname, colname) => {
  return DBMap[`${name}$${dbname}`].collection(colname)
};

const closeAll = () => {
  Object.keys(ClientMap).forEach(k => {
    const client = ClientMap[k];
    if (client) {
      client.close();
      ClientMap[k] = null;
    }
  })
};

class MongoCall {
  constructor({name, dbname, colname}) {
    this.name = name;
    this.dbname = dbname;
    this.colname = colname;
  }

  /**
   * 获取集合表model
   * @returns {*} colModel
   * @constructor
   */
  Model() {
    return getCol(this.name, this.dbname, this.colname)
  }


  /**
   * 关闭客户端链接
   * @constructor
   */
  Close() {
    const client = ClientMap[this.name];
    if (client) {
      client.close()
    }
  }

}

module.exports = {
  MongoCall,
  Init,
  closeAll
};