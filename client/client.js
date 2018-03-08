var PROTO_PATH = '../proto/getDB.proto';

var grpc = require('grpc');
var hello_proto = grpc.load(PROTO_PATH).getDB;

function main() {
  var client = new hello_proto.ReadDB('localhost:50051',
                                       grpc.credentials.createInsecure());
  // var user;
  // if (process.argv.length >= 3) {
  //   user = process.argv[2];
  // } else {
  //   user = 'world';
  // }
  client.getAccess({id: "1122"}, function(err, response) {
    console.log(response.message);
  });
}

main();
