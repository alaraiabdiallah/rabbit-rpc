# RabbitRPC Wrapper

# Thanks to
inspired by: [kumangxxx](https://github.com/kumangxxx)
visit the [repo](https://github.com/kumangxxx/gits-rabbit-rpc-server)

This is a simple helper library to manage your RabbitMQ RPC Server. It make use of RabbitMQ 'topic' exchange.

# Installation
```
$ npm install --save gits-rabbit-rpc-server
```

# How to use
```
const server = require('gits-rabbit-rpc-server');
...
server.handleRoute('user.api.all', function(stringBody, callback) {
    var users = [{id: 0, email: 'someemail'}];
    callback(null, JSON.stringify(users)); // --> callback result must be a string
});
...
server.start('amqps://user:password@host', 'queue_name', max_connection, function(err) {
    rabbit_server.declareExchange({name: 'rpc_service', type: 'topic', durable: true});
    rabbit_server.bindExchangeToQueue({routingKey: 'rpc.api.test'});
    console.log('RabbitMQ RPC Server is running');
});

```
