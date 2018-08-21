class Time{
    static duration2detail(time:number,type:string){
        let detail:any={};
        let duration = time;
        if (type == "hr")
            duration = time * 60 * 60 * 1000;//hour to millionseconds

        let milliseconds: number = 0;
        if (duration > 1000)
            milliseconds = Math.round((duration % 1000) / 100);
        else {
            milliseconds = duration / 100;
        }
        let seconds: number = Math.trunc((duration / 1000) % 60);//秒 分
        let minutes: number = Math.trunc((duration / (1000 * 60)) % 60);//分 時
        let hours: number = Math.trunc((duration / (1000*60*60))%24);//時 日

        detail.hours=hours;
        detail.minutes=minutes;
        detail.seconds=seconds;
        detail.milliseconds=milliseconds;
        return detail;
    }
    static toOneString(detail:any){//only one
        let timeString:string="";
        if(detail.hours!=0)
            timeString=`${detail.hours} hr`;
        else if(detail.minutes!=0)
            timeString=`${detail.minutes} min`;
        else if(detail.seconds!=0)
            timeString=`${detail.seconds} sec`;
        else if(detail.milliseconds!=0)
            timeString=`${detail.milliseconds} msec`;
        return timeString;
    }

    static toAllString(detail:any){//all
        let timeString:string="";
        if(detail.hours!=0)
            timeString+=`${Time.pad(detail.hours,2)} hr `;
        if(detail.minutes!=0)
            timeString+=`${Time.pad(detail.minutes,2)} min `;
        if(detail.seconds!=0)
            timeString+=`${Time.pad(detail.seconds,2)} sec `;
        if(detail.milliseconds!=0)
            timeString+=`${Time.pad(detail.milliseconds,2)} msec `;
        return timeString;
    }

    //https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
    static pad(n:number, width:number, z?:string) {
        z = z || '0';
        let n_string = n + '';
        return n_string.length >= width ? n : new Array(width - n_string.length + 1).join(z) + n;
      }
}