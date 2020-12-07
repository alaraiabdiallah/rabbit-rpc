'use strict';

const amqp = require('amqplib/callback_api');
const url = require('url');

module.exports = class Server {
    _uri_connect = null;
    _connection = null;
    _exchange = {
        name: "",
        type: "direct"
    };
    _queue = {
        name: ""
    };
    _channel = null;
    _handlers = {};
    _max_connection = 0;

    constructor({uri_connect, exchange, queue, max_connection}){
        this._uri_connect = uri_connect;
        this._exchange = exchange;
        this._queue = queue;
        this._max_connection = max_connection || 5
    }

    _reply(message, response, callback){
        if (!this._channel) { 
            console.log('Cannot send response. Channel is not alive'); 
            callback({code: 0, message: 'Channel is not alive'}, message); 
            return; 
        }

        let {replyTo, correlationId} = message.properties;
        
        this._channel.sendToQueue(replyTo, new Buffer(response), { correlationId });
        callback(null, message);
    }

    _subscribe(){
        if (!this._channel) { console.log('Channel for RabbitRPC Server is not ready'); return; }
        console.log('RabbitRPC Server is listening..');
        this._channel.consume(queue_name, (message) => {

            let { routingKey } = message.fields;
            let string_body = message.content.toString();

            let handler = this._handlers[routingKey];
            if (!handler) { console.log(`undhandled message at route ${routingKey} with body:\n${string_body}`); ack(message); return; }

            handler(string_body, (err, result) => {
                if (!err && (typeof result  != "string")) { 
                    console.log(`Result from ${route} handler is not string`); 
                    this._channel.ack(message);
                    return; 
                }
                let response = err ? err : result;
                this._reply(message, response, (err, message) => {
                    if (err) console.log(err);
                    this._channel.ack(message);
                });
            });
        });
    }

    subscribe(routing_key, handler){
        _handlers[routing_key] = handler;
    }

    async _declare_exchange() {
        let {name, type} = this._exchange;
        await this._channel.assertExchange(name, type);
    }

    async _declare_queue() {
        let channel = this._channel;
        let {name:exchange_name} = this._exchange;
        let {name:queue_name} = this._queue;
        let queues = Object.keys(this._handlers).map(async (routing_key) =>{
            return await channel.bindQueue(queue_name, exchange_name, routing_key);
        })

        return Promise.all(queues);
    }

    async listen(){
        const uri = url.parse(this._uri_connect);
        this._connection = await amqp.connect(url_string, { servername: uri.hostname });
        this._channel = await this._connection.createChannel();
        await this._declare_exchange();
        await this._declare_queue();
        this._subscribe();
    }
}