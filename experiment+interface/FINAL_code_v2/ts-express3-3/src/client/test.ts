import Tool from '../algorithm/Tool';

let random: number = Tool.getRandomInt(0, 165 - 1);
let random2: number = Tool.getRandomIntWithout(0, 165 - 1, random);
console.log(random,",",random2);