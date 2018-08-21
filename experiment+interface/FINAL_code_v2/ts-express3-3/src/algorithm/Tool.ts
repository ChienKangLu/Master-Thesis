import { RandomSeed, create } from 'random-seed';
//checked 2018/1/10

class Tool{
    static FgWhite = "\x1b[37m";
    static BgBlue = "\x1b[44m"
    static BgYellow = "\x1b[43m";
    static Reset="\n\x1b[0m";
    static BgRed = "\x1b[41m";
    static testmsg:boolean=false;
    static detailtmsg:boolean=false;
    static seed = 'My Secret String Value';
    static seed_traffic_jam = 'My traffic jam';
    static rand:RandomSeed=create(Tool.seed);
    static rand_traffic_jam:RandomSeed=create(Tool.seed_traffic_jam);
    static getRandomInt(min:number, max:number) {
        return Tool.rand.intBetween(min,max);

        //can not set seed
        // min = Math.ceil(min);
        // max = Math.floor(max);
        // return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }
    static getRandomIntWithout(min:number, max:number,without:number){
        let random:number=Tool.rand.intBetween(min,max);
        while(random==without){
            random=Tool.rand.intBetween(min,max);
        }
        return random;
        // let random:number=Tool.getRandomInt(min,max);
        // while(random==without){
        //     random=Tool.getRandomInt(min,max);
        // }
        // return random;
    }
    static getRandomGaussion(mean:number,sd:number){
        let t:number = Tool.rand_traffic_jam.floatBetween(-2,2);//how many sd
        return mean+t*sd;
        // return (1.0/Math.pow(2*Math.PI*sd, 0.5))* Math.exp(-(Math.pow(t-mean,2))/(2*sd));
    }

    static mean(numbers:Array<number>):number{
        let m:number=0;
        for(let data of numbers){
            m+=data;
        }
        m=m/numbers.length;
        return m;
    }
    static variance(numbers:Array<number>,mean:number):number{
        let v:number=0;
        for(let data of numbers){
            v+=Math.pow(data-mean,2);
        }
        v=v/numbers.length;
        return v;
    }
    static sd(variance:number):number{
        let sd:number=0;
        sd=Math.pow(variance,0.5);
        return sd;
    }
    static normalize(number:number,mean:number,sd:number):number{
        return (number-mean)/sd;
    }
    static g_normal(x:number,mean:number,variance:number){
        return Math.exp(-(Math.pow(x-mean,2))/(2*variance));
    }
    static g_normal_2(x:number,mean:number,variance:number){
        return Math.exp(-(x-mean)/(2*variance));
    }
    static sysmsg(msg:string):void{
        if(Tool.testmsg)
            console.log(`${Tool.BgBlue}\n---|---|--- ${msg} ---|---|---\n${Tool.Reset}`);
    }
    static actionmsg(msg:string):void{
        if(Tool.testmsg)
            console.log(`${Tool.BgRed}\n--[${msg}]--\n${Tool.Reset}`);
    }
    static checkmsg(msg:string):void{
        if(Tool.testmsg)
            console.log(`${Tool.BgYellow}\n--[${msg}]--\n${Tool.Reset}`);
    }
    static rungmsg(msg:string):void{
        if(Tool.testmsg)
            console.log(`       ${msg}`);
    }
    static detailmsg(msg:string):void{
        if(Tool.detailtmsg)
            console.log(`       ${msg}`);
    }
    static datanmsg(msg:string):void{ 
        if(Tool.testmsg)
            console.log(`\n--${msg}\n`);
    }
    static expmsg(msg:string):void{
        console.log(`--${msg}\n`);
    }
    static deleteProperties(objectToClean:any) {
        for (var x in objectToClean) if (objectToClean.hasOwnProperty(x)) delete objectToClean[x];
      }

}


export default Tool;
// for(let i=0;i<10;i++){
//     console.log(Tool.getRandomGaussion(0.5,0.25));//假設塞車平均是0.5hr(30分鐘)，標準差為0.25hr(15分鐘)
// }