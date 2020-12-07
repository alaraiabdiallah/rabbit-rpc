'use strict';

const {Server} = require('./index');

const rpcServer = new Server({
   uri_connect: "amqp://root:root@localhost:5672/",
   exchange: {name:"rpc", type: "topic"}
});

// Subscribe success
rpcServer.subscribe('rpc.test', (stringBody, callback) => {
    var users = [{id: 0, email: 'someemail'}];
    callback(null, JSON.stringify(users)); 
});

// Subscribe error
rpcServer.subscribe('rpc.test2', (stringBody, callback) => {
    try {
        var users = [{id: 0, email: 'someemail'}];
        throw new Error("ada error");
        return callback(null, JSON.stringify(users));    
    } catch (error) {
        return callback({code:0, message: error.message}, null);
    }
     
});

// Subscribe when timeout
rpcServer.subscribe('rpc.test3', (stringBody, callback) => {
    setTimeout(() => {
        var users = [{id: 0, email: 'someemail'}];
        callback(null, JSON.stringify(users));
    }, 6000)
});

rpcServer.listen();