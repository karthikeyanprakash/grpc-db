
var PROTO_PATH = '../proto/getDB.proto';

var grpc = require('grpc');
var hello_proto = grpc.load(PROTO_PATH).getDB;

var bluebird = require("bluebird")
var redis = require("redis"),
    client = redis.createClient();


client.on("error", function (err) {
    console.log("Error " + err);
});

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

console.log("-----------gRPC Server Started-----------\n");
var getfromDB = function(key, callback){

  client.hscan("access", "0","MATCH",key, function(err, reply){

    console.log("---------Search Result from DB-------\n");
    console.log(reply);
    console.log("--------------------------------------\n");

      return callback(reply[1]);
  });

}

function getAccess(call, callback) {

  console.log("-----------Request Received-----------\n");
  console.log("User ID: " + call.request.id);
  console.log("--------------------------------------\n");

getfromDB(call.request.id,function(response){
  console.log("-----------Reply Sent-----------\n");
  console.log(response[1])
  console.log("--------------------------------------\n");

  callback(null, {message:response[1]});
});



}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();
  server.addService(hello_proto.ReadDB.service, {getAccess: getAccess});
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
