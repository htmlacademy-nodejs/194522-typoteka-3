'use strict';

const {Server} = require(`socket.io`);
const {HttpMethod, DefaultPort} = require(`../constants`);

const port = process.env.FRONT_PORT || DefaultPort.FRONT;

module.exports = (server) => {
  return new Server(server, {
    cors: {
      origins: [`localhost:${port}`],
      methods: [HttpMethod.GET]
    }
  });
};
