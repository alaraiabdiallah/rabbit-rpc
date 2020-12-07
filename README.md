# RabbitMQ RPC

# Thanks to

inspired by: [kumangxxx](https://github.com/kumangxxx)
visit the [repo](https://github.com/kumangxxx/gits-rabbit-rpc-server)



## Description

This is a simple helper library to manage use RABBITMQ as RPC.

# Installation

```
$ npm install --save rabbitmq-rpc
```

# How to use

## As Server

```javascript
'use strict';

const {Server} = require('rabbitmq-rpc');

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
```

## As Client

```javascript
const {Client} = require('rabbitmq-rpc');

const client = new Client({
    uri_connect: "amqp://root:root@localhost:5672/",
})

const test = async () => {
    const getData = await client.publish('rpc.test3', "hallo");
    console.log(getData)
}

test();
```

# 
