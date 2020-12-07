const {Client} = require('./index');

const client = new Client({
    uri_connect: "amqp://root:root@localhost:5672/",
})

const test = async () => {
    const getData = await client.publish('rpc.test3', "hallo");
    console.log(getData)
}

test();