require('dotenv').config();

const fastify = require('fastify')({
    logger: true
});

const path = require('path');

fastify.register(require('./routes'), { prefix: '/v1' });

const start = async() => {
    try {
        await fastify.listen({ port: 8000 }, err => {
            console.log(err);
        });
        // await fastify.listen(process.env.PORT);
        console.log('Server listening on ${fastify.server.address().port}');
    } catch (err) {
        console.log(err);
        process.exit(1)
    }
};

start();