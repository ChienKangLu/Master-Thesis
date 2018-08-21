"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tool_1 = require("../algorithm/Tool");
let random = Tool_1.default.getRandomInt(0, 165 - 1);
let random2 = Tool_1.default.getRandomIntWithout(0, 165 - 1, random);
console.log(random, ",", random2);
