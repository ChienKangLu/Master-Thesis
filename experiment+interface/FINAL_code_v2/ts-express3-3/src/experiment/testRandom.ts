// import { RandomSeed, create } from 'random-seed';
// let seed = 'My Secret String Value';
// let rand1:RandomSeed=create(seed);
// console.log(rand1.intBetween(0,100),",",rand1.intBetween(0,100));
// console.log(rand1.intBetween(0,100),",",rand1.intBetween(0,100));
// console.log(rand1.intBetween(0,100),",",rand1.intBetween(0,100));
// console.log(rand1.intBetween(0,100),",",rand1.intBetween(0,100));
// console.log(rand1.intBetween(0,100),",",rand1.intBetween(0,100));
// console.log(rand1.intBetween(0,100),",",rand1.intBetween(0,100));

import Tool from '../algorithm/Tool';
for(let i=0;i<100;i++){
    let random1=Tool.getRandomInt(0,145);
    let random2=Tool.getRandomIntWithout(0,145,random1);
    console.log(random1,",",random2);
}
