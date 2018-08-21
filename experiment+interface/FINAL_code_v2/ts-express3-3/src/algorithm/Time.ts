import {weekTime,dayTime,timeStatus,timeString} from '../algorithm/record';
import {detail} from '../algorithm/record';
//checked 2018/1/10

class Time{
    time:Date;

    constructor(time?:Date,year?:number,month?:number,date?:number,hour?:number,minute?:number,second?:number){
        if(year!=null&&month!=null&&date!=null&&hour!=null&&minute!=null&&second!=null)
            this.time=new Date(year, month, date, hour, minute, second);
        if(time!=null)
            this.time=new Date(time);
    }

    copy():Time{
        return new Time(this.time);
    } 
    /**
     * 
     * unit is million seconds
     * @param other 
     */
    minus(other:Time,abs:boolean):number{
        let duration:number;
        if(abs==true)
            duration=Math.abs(this.time.getTime()-other.time.getTime());//get million seconds,1 millisecond=0.001 s
        else
            duration=this.time.getTime()-other.time.getTime();//get million seconds,1 millisecond=0.001 s
        
        return duration;
    }
    /**
     * choose one:
     * milloonsecond
     * second
     * minute
     * hour
     * @param duration 
     * @param type milloonsecond
     */
    add(duration:number,type:string):Time{
        let newTime:Time=new Time();
        if(type=="milloonsecond"){
            newTime.time=new Date(this.time.getTime()+duration);//一毫秒
        }
        if(type=="second"){
            newTime.time=new Date(this.time.getTime()+duration*1000);//一秒==1000毫秒
        }
        if(type=="minute"){
            newTime.time=new Date(this.time.getTime()+duration*60*1000);//一分鐘==60秒,一秒==1000毫秒
        }
        if(type=="hour"){
            newTime.time=new Date(this.time.getTime()+duration*60*60*1000);//一小時==60分鐘,一分鐘==60秒,一秒==1000毫秒
        }
        return newTime;
    }
    
    /**
     * [hours,minutes,seconds,milliseconds]
     * @param duration 
     */
    static millionToDetail(duration:number):detail{
        let detail:detail={};
        let milliseconds:number=0;
        if(duration>1000)
            milliseconds=Math.round((duration%1000)/100);
        else{
            milliseconds=duration/100;
        }
        let seconds:number=Math.trunc((duration/1000)%60);//秒 分
        let minutes:number=Math.trunc((duration/(1000*60))%60);//分 時
        let hours:number=Math.trunc((duration/(1000*60*60))%24);//時 日

        detail.hours=hours;
        detail.minutes=minutes;
        detail.seconds=seconds;
        detail.milliseconds=milliseconds;

        return detail;
    }

    //根據開始的日期時間，來計算每個poi的相對開關門時間
    static realTime(weekTime:weekTime,start_time:Time):void{
        for(let dayTime_index in weekTime){
            for(let timeStatus_index in weekTime[dayTime_index]){
                let timeStatus:timeStatus=weekTime[dayTime_index][timeStatus_index];
                if(timeStatus.status=="Open24hours"||timeStatus.status=="Closed"){
                    continue;
                }
                if(timeStatus.open!=null&&timeStatus.close!=null){
                    let open:timeString=timeStatus.open;
                    open.time=this.timeString2realTime(open,start_time);
                    let close:timeString=timeStatus.close;
                    close.time=this.timeString2realTime(close,start_time);
                    if(open.stamp=="PM"&&close.stamp=="AM"){
                        close.time.time.setDate(close.time.time.getDate()+1);
                    }
                    if(open.stamp=="AM"&&close.stamp=="AM"&&(<number>open.hour) > (<number>close.hour)){//來來釣蝦場
                        close.time.time.setDate(close.time.time.getDate()+1);
                    }
                }
            }
        }

    }
    static timeString2realTime(timeString:timeString,start_time:Time):Time{
        let tempTime:Time=start_time.copy();//very important
        if(timeString.hour!=null&&timeString.minute!=null){
            let hour:number=timeString.hour;
            if(timeString.stamp=="PM")
                hour+=12;
            tempTime.time.setHours(hour);
            tempTime.time.setMinutes(timeString.minute);
            tempTime.time.setSeconds(0);
            tempTime.time.setMilliseconds(0);
        }
        return tempTime;
    }
    static whichTimeStatus(dayTime:dayTime,arrive_time:Time):timeStatus | any{
        let temp:timeStatus={};
        for(let timeStatus_index in dayTime){
            let timeStatus:timeStatus=dayTime[timeStatus_index];
            if(timeStatus.status=="Open24hours"){
                temp=timeStatus;
                return temp;
            }
            if(timeStatus.status=="Open"){
                if(timeStatus.open!=null&&timeStatus.close!=null){
                    if(timeStatus.open.time!=null&&timeStatus.close.time!=null){
                        let arrive_close:number=arrive_time.minus(timeStatus.close.time,false);
                        // console.log(arrive_time.toString());
                        // console.log(timeStatus.close.time.toString());
                        // console.log(arrive_close);
                        //if A<C
                        //  temp=timeStatus
                        //  return temp
                        if(arrive_close<0){
                            temp=timeStatus;
                            return temp;
                        }
                    }
                }
            }
            
        }
        return null;
    }
    
    toString():string{
        return this.time.toString();
    }
}
export default Time;