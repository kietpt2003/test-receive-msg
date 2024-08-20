const { Connection } = require('rabbitmq-client');

// Initialize:
const rabbit = new Connection('amqp://myadmin:mypassword@kietpt.online:5672');
rabbit.on('error', (err) => {
    console.log('RabbitMQ connection error', err);
});
rabbit.on('connection', () => {
    console.log('Connection successfully (re)established');
});

(async () => {
    try {
        // Consume messages from a queue:
        const sub = rabbit.createConsumer({
            queue: 'test-queue',
            queueOptions: { durable: true, autoDelete: true },
            qos: { prefetchCount: 2 },
            exchanges: [{ exchange: 'test-exchange', type: 'topic' }],
            queueBindings: [{ exchange: 'test-exchange', routingKey: '#' }],
        }, async (msg) => {
            console.log('received message (user-events)', msg.body.toString("utf-8"));
        });

        sub.on('error', (err) => {
            console.log('consumer error (user-events)', err);
        });

        // // Declare a publisher
        // const pub = rabbit.createPublisher({
        //     confirm: true,
        //     maxAttempts: 2,
        //     exchanges: [{ exchange: 'my-events', type: 'topic' }]
        // });

        // // Publish a message to a custom exchange
        // await pub.send(
        //     { exchange: 'my-events', routingKey: 'users.visit' },
        //     { id: 1, name: 'Alan Turing' }
        // );

        // // Or publish directly to a queue
        // await pub.send('user-events', { id: 1, name: 'Alan Turing' });

        // // Clean up when you receive a shutdown signal
        // async function onShutdown() {
        //     await pub.close();
        //     await sub.close();
        //     await rabbit.close();
        //     console.log('RabbitMQ connection and channels closed gracefully');
        // }

        // process.on('SIGINT', onShutdown);
        // process.on('SIGTERM', onShutdown);

    } catch (error) {
        console.error('Error in RabbitMQ setup:', error);
        await rabbit.close();
    }
})();