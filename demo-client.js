const {Client} = require('./index');

const client = async() => {
    return await Client({
        uri_connect: "amqp://root:root@localhost:5672/",
    })
}

const someFunc = async(i, tries = 1) => {
    try {
        const rabbit = await client();
        const data = await rabbit.publish('rpc.test', `Hallo ${i}`);
        return data;    
    } catch (error) {
        return tries <= 3 ? someFunc(i, tries + 3): null;
    }
    
}

const test = async () => {
    let concurrent = []
    for(let i = 1; i <= 500; i++){
        concurrent.push(someFunc(i));
    }
    const datum = await Promise.all(concurrent);
    const success = datum.filter(e => e != null);
    const failure = datum.filter(e => e == null);
    console.log("Success ", success.length);
    console.log("failure ", failure.length);
    
}
test();
