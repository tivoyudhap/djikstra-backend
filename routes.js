const djikstra = require('./modules/djikstra_controller');

async function routes(fastify, options) {
    fastify.get("/get", djikstra.get);
}

module.exports = routes;