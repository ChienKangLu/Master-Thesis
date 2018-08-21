"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const random_seed_1 = require("random-seed");
class Tool {
    static getRandomInt(min, max) {
        return Tool.rand.intBetween(min, max);
    }
    static getRandomIntWithout(min, max, without) {
        let random = Tool.rand.intBetween(min, max);
        while (random == without) {
            random = Tool.rand.intBetween(min, max);
        }
        return random;
    }
    static getRandomGaussion(mean, sd) {
        let t = Tool.rand_traffic_jam.floatBetween(-2, 2);
        return mean + t * sd;
    }
    static mean(numbers) {
        let m = 0;
        for (let data of numbers) {
            m += data;
        }
        m = m / numbers.length;
        return m;
    }
    static variance(numbers, mean) {
        let v = 0;
        for (let data of numbers) {
            v += Math.pow(data - mean, 2);
        }
        v = v / numbers.length;
        return v;
    }
    static sd(variance) {
        let sd = 0;
        sd = Math.pow(variance, 0.5);
        return sd;
    }
    static normalize(number, mean, sd) {
        return (number - mean) / sd;
    }
    static g_normal(x, mean, variance) {
        return Math.exp(-(Math.pow(x - mean, 2)) / (2 * variance));
    }
    static g_normal_2(x, mean, variance) {
        return Math.exp(-(x - mean) / (2 * variance));
    }
    static sysmsg(msg) {
        if (Tool.testmsg)
            console.log(`${Tool.BgBlue}\n---|---|--- ${msg} ---|---|---\n${Tool.Reset}`);
    }
    static actionmsg(msg) {
        if (Tool.testmsg)
            console.log(`${Tool.BgRed}\n--[${msg}]--\n${Tool.Reset}`);
    }
    static checkmsg(msg) {
        if (Tool.testmsg)
            console.log(`${Tool.BgYellow}\n--[${msg}]--\n${Tool.Reset}`);
    }
    static rungmsg(msg) {
        if (Tool.testmsg)
            console.log(`       ${msg}`);
    }
    static detailmsg(msg) {
        if (Tool.detailtmsg)
            console.log(`       ${msg}`);
    }
    static datanmsg(msg) {
        if (Tool.testmsg)
            console.log(`\n--${msg}\n`);
    }
    static expmsg(msg) {
        console.log(`--${msg}\n`);
    }
    static deleteProperties(objectToClean) {
        for (var x in objectToClean)
            if (objectToClean.hasOwnProperty(x))
                delete objectToClean[x];
    }
}
Tool.FgWhite = "\x1b[37m";
Tool.BgBlue = "\x1b[44m";
Tool.BgYellow = "\x1b[43m";
Tool.Reset = "\n\x1b[0m";
Tool.BgRed = "\x1b[41m";
Tool.testmsg = false;
Tool.detailtmsg = false;
Tool.seed = 'My Secret String Value';
Tool.seed_traffic_jam = 'My traffic jam';
Tool.rand = random_seed_1.create(Tool.seed);
Tool.rand_traffic_jam = random_seed_1.create(Tool.seed_traffic_jam);
exports.default = Tool;
