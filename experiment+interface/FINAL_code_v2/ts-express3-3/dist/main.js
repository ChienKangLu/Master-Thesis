"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const App_1 = require("./App");
const Tool_1 = require("./algorithm/Tool");
const port = 3000;
App_1.default.set('port', port);
const server = http.createServer(App_1.default);
server.listen(port);
server.on('listening', onListening);
function onListening() {
    Tool_1.default.sysmsg(`Listening on port ${port}`);
}
