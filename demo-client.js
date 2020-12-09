const {Client} = require('./index');

const client = new Client({
    uri_connect: "amqp://root:root@localhost:5672/",
})

const someFunc = async(i) => {
    const data = await client.publish('rpc.test', `Hallo ${i}`);
    console.log(`Loop ${i}: ${data}`);
}

const test = async () => {
    let concurrent = []
    for(let i = 1; i <= 100; i++){
        await someFunc(i);
    }
}
test();
