//init mongo
//init redis
//init service
const config = require('../config');
const server = require('./server/http');
const dataSource = require('./server/dataSource');

async function main() {

  await dataSource.Init();
  const {app,router} = server.createHttpServer({port:3000});
  //load data api
  app.use('/base/data',dataSource.router);


}

main();


