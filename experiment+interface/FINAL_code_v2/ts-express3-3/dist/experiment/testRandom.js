"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tool_1 = require("../algorithm/Tool");
for (let i = 0; i < 100; i++) {
    let random1 = Tool_1.default.getRandomInt(0, 145);
    let random2 = Tool_1.default.getRandomIntWithout(0, 145, random1);
    console.log(random1, ",", random2);
}
