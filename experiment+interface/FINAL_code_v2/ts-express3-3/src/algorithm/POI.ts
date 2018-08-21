import Tool from '../algorithm/Tool';
import Time from '../algorithm/Time';
import {weekTime,dayTime,timeStatus,timeString} from '../algorithm/record';
//checked 2018/1/10

class POI{
    _id:string;
    name:string;
    global_attraction_cost:number;//global_attraction
    global_attraction:number;//original//original_global_attaction
    lat:number;
    lng:number;
    stay_time:number;//hour
    weekTime:weekTime=[];
    introduction:string;

    z_global_attraction:number;

    static initial_global_attraction:number=0;
    static initial_stay_time:number=1;

    constructor(name:string,global_attraction:number,_id:string,lat:number,lng:number,stay_time:number,weekTime:weekTime,introduction?:string){
        this.global_attraction=this.check_global_attraction(global_attraction);
        // this.original_global_attaction=this.global_attraction_cost;
        this.name=name;
        this._id=_id;
        // this.personal_attraction=Tool.getRandomInt(5,10);
        // this.original_personal_attraction=this.personal_attraction;
        this.lat=lat;
        this.lng=lng;
        this.stay_time=this.check_stay_time(stay_time);
        this.weekTime=weekTime;
        if(introduction !=null){
            this.introduction=introduction;
        }
    }
    check_global_attraction(global_attraction:number):number{
        if(global_attraction==null){
            global_attraction=POI.initial_global_attraction;//可能可以改用平均
        }
        return global_attraction;
    }
    check_stay_time(stay_time:number):number{
        if(stay_time==null||stay_time==0){
            stay_time=POI.initial_stay_time;//假設停留一個小時
        }
        return stay_time;
    }
    set_realTime(start_time:Time):void{
        Time.realTime(this.weekTime,start_time);
    }
    copy():POI{
        return new POI(this.name,this.global_attraction,this._id,/*this.personal_attraction*/this.lat,this.lng,this.stay_time,this.weekTime);
    }
    toString():string{
        return `(${this.name}:${this.global_attraction_cost})`;
        // return JSON.stringify(this, null, 4);
    }

}
export default POI;
