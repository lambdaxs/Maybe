//init mongo
//init redis
//init service
const config = require('../config');
const server = require('./server/http');
const dataSource = require('./server/dataSource');
const adminApi = require('./server/admin');

async function main() {

  await dataSource.Init();
  const {app,router} = server.createHttpServer({port:3000});
  //load data api
  app.use('/base/data',dataSource.router);

  //load admin api
    app.use('/admin',adminApi.router)


}

main();


