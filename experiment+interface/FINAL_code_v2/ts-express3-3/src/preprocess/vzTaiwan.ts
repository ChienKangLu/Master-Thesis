import {weekTime,dayTime,timeStatus,timeString} from '../algorithm/record';

class vzTaiwan{
    /**
     * for vzTaiwan+google,parsing the weekday_text fo vzTaiwan+google
     * 
     * ex:
     * POI:(園丁休閒花卉庭園咖啡:0,1)
            [
                [
                    {
                        "status": "Open24hours"
                    }
                ],
                [
                    {
                        "status": "Open24hours"
                    }
                ],
                [
                    {
                        "status": "Open24hours"
                    }
                ],
                [
                    {
                        "status": "Open24hours"
                    }
                ],
                [
                    {
                        "status": "Open24hours"
                    }
                ],
                [
                    {
                        "status": "Open24hours"
                    }
                ],
                [
                    {
                        "status": "Open24hours"
                    }
                ]
            ]
     *
     * POI:(河東堂獅子博物館:3.6,1)
            [
                [
                    {
                        "status": "Open",
                        "open": {
                            "hour": 9,
                            "minute": 0,
                            "stamp": "AM"
                        },
                        "close": {
                            "hour": 6,
                            "minute": 0,
                            "stamp": "PM"
                        }
                    }
                ],
                [
                    {
                        "status": "Open",
                        "open": {
                            "hour": 9,
                            "minute": 0,
                            "stamp": "AM"
                        },
                        "close": {
                            "hour": 6,
                            "minute": 0,
                            "stamp": "PM"
                        }
                    }
                ],
                [
                    {
                        "status": "Open",
                        "open": {
                            "hour": 9,
                            "minute": 0,
                            "stamp": "AM"
                        },
                        "close": {
                            "hour": 6,
                            "minute": 0,
                            "stamp": "PM"
                        }
                    }
                ],
                [
                    {
                        "status": "Open",
                        "open": {
                            "hour": 9,
                            "minute": 0,
                            "stamp": "AM"
                        },
                        "close": {
                            "hour": 6,
                            "minute": 0,
                            "stamp": "PM"
                        }
                    }
                ],
                [
                    {
                        "status": "Open",
                        "open": {
                            "hour": 9,
                            "minute": 0,
                            "stamp": "AM"
                        },
                        "close": {
                            "hour": 6,
                            "minute": 0,
                            "stamp": "PM"
                        }
                    }
                ],
                [
                    {
                        "status": "Open",
                        "open": {
                            "hour": 9,
                            "minute": 0,
                            "stamp": "AM"
                        },
                        "close": {
                            "hour": 6,
                            "minute": 0,
                            "stamp": "PM"
                        }
                    }
                ],
                [
                    {
                        "status": "Open",
                        "open": {
                            "hour": 9,
                            "minute": 0,
                            "stamp": "AM"
                        },
                        "close": {
                            "hour": 6,
                            "minute": 0,
                            "stamp": "PM"
                        }
                    }
                ]
            ]
     *
     * POI:(可達休閒羊場:3.8,1)
            [
                [
                    {
                        "status": "Open",
                        "open": {
                            "hour": 9,
                            "minute": 0,
                            "stamp": "AM"
                        },
                        "close": {
                            "hour": 5,
                            "minute": 0,
                            "stamp": "PM"
                        }
                    }
                ],
                [
                    {
                        "status": "Open",
                        "open": {
                            "hour": 9,
                            "minute": 0,
                            "stamp": "AM"
                        },
                        "close": {
                            "hour": 5,
                            "minute": 0,
                            "stamp": "PM"
                        }
                    }
                ],
                [
                    {
                        "status": "Open",
                        "open": {
                            "hour": 9,
                            "minute": 0,
                            "stamp": "AM"
                        },
                        "close": {
                            "hour": 5,
                            "minute": 0,
                            "stamp": "PM"
                        }
                    }
                ],
                [
                    {
                        "status": "Open",
                        "open": {
                            "hour": 9,
                            "minute": 0,
                            "stamp": "AM"
                        },
                        "close": {
                            "hour": 5,
                            "minute": 0,
                            "stamp": "PM"
                        }
                    }
                ],
                [
                    {
                        "status": "Open",
                        "open": {
                            "hour": 9,
                            "minute": 0,
                            "stamp": "AM"
                        },
                        "close": {
                            "hour": 5,
                            "minute": 0,
                            "stamp": "PM"
                        }
                    }
                ],
                [
                    {
                        "status": "Open",
                        "open": {
                            "hour": 9,
                            "minute": 0,
                            "stamp": "AM"
                        },
                        "close": {
                            "hour": 5,
                            "minute": 0,
                            "stamp": "PM"
                        }
                    }
                ],
                [
                    {
                        "status": "Open",
                        "open": {
                            "hour": 9,
                            "minute": 0,
                            "stamp": "AM"
                        },
                        "close": {
                            "hour": 5,
                            "minute": 0,
                            "stamp": "PM"
                        }
                    }
                ]
            ]
     * @param weekday_text 
     */

    static weekday_textParsing(open_time:any): weekTime {
        let weekTime:weekTime=[];
        if(open_time!=null){
            let weekday_text: Array<string>=open_time.weekday_text;
            for (let i = 0; i < weekday_text.length; i++) {//一~日
                //console.log(`${day}`);
                let dayTime: dayTime = [];
                let splitDay: Array<string> = weekday_text[i].split(" ");
                splitDay.shift();
                /**
                 * ex:
                 * sample->array length
                 * 
                 * Closed->1
                 * Open,24,hours->3
                 * 1:00,–,7:00,PM->4
                 * 9:00,AM,–,5:30,PM->5
                 * 
                 * 
                 * 7:00,AM,–,12:00,PM,,1:00,–,11:00,PM->9
                 * 7:00,AM,–,12:00,PM,,1:00,PM,–,12:00,AM->10
                 */

                //console.log(`${splitDay}->${splitDay.length}`);
                if (splitDay.length == 1) {
                    //Closed
                    let timeStatus: timeStatus = {};
                    timeStatus.status = "Closed";
                    dayTime[0] = timeStatus;
                } else if (splitDay.length == 3) {
                    //Open,24,hours->3                
                    let timeStatus: timeStatus = {};
                    timeStatus.status = "Open24hours";
                    dayTime[0] = timeStatus;
                } else {
                    let count: number = 0;
                    let timeStatus: timeStatus = {};
                    let open: timeString = {};
                    let close: timeString = {};
                    let time: string = "";
                    let stamp: string = "";
                    let regexp: RegExp = new RegExp('[0-9]{1,}:[0-9]{1,}');
                    let length: number = splitDay.length;
                    let index:number=0;
                    for (let j = 0; j < length; j++) {
                        let str: string = <string>splitDay.pop();

                        if (str == "AM" || str == "PM") {
                            stamp = str;
                        } else if (regexp.test(str)) {
                            time = str;
                        }

                        if (time != "") {
                            let timeSplit: Array<string> = time.split(":");
                            if (count == 0)
                                close = { hour: Number(timeSplit[0]), minute: Number(timeSplit[1]), stamp: stamp };
                            else
                                open = { hour: Number(timeSplit[0]), minute: Number(timeSplit[1]), stamp: stamp };
                            time = "";
                            count++;
                        }
                        if (count == 2) {
                            timeStatus.status = "Open";
                            timeStatus.open = open;
                            timeStatus.close = close;
                            dayTime[index] = timeStatus;
                            // console.log(JSON.stringify(timeStatus));
                            index++;
                            count = 0;
                        }

                    }
                }
                weekTime[i] = dayTime;
            }        
        }else{//without time information --> assume Open24hours
            for(let i=0;i<7;i++){
                let dayTime: dayTime = [];
                let timeStatus: timeStatus = {};
                timeStatus.status = "Open24hours";
                dayTime[0] = timeStatus;
                weekTime[i] = dayTime;
            }
        }
        return weekTime;
    }
}
export default vzTaiwan;