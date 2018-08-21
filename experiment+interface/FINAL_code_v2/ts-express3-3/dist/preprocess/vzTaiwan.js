"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class vzTaiwan {
    static weekday_textParsing(open_time) {
        let weekTime = [];
        if (open_time != null) {
            let weekday_text = open_time.weekday_text;
            for (let i = 0; i < weekday_text.length; i++) {
                let dayTime = [];
                let splitDay = weekday_text[i].split(" ");
                splitDay.shift();
                if (splitDay.length == 1) {
                    let timeStatus = {};
                    timeStatus.status = "Closed";
                    dayTime[0] = timeStatus;
                }
                else if (splitDay.length == 3) {
                    let timeStatus = {};
                    timeStatus.status = "Open24hours";
                    dayTime[0] = timeStatus;
                }
                else {
                    let count = 0;
                    let timeStatus = {};
                    let open = {};
                    let close = {};
                    let time = "";
                    let stamp = "";
                    let regexp = new RegExp('[0-9]{1,}:[0-9]{1,}');
                    let length = splitDay.length;
                    let index = 0;
                    for (let j = 0; j < length; j++) {
                        let str = splitDay.pop();
                        if (str == "AM" || str == "PM") {
                            stamp = str;
                        }
                        else if (regexp.test(str)) {
                            time = str;
                        }
                        if (time != "") {
                            let timeSplit = time.split(":");
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
                            index++;
                            count = 0;
                        }
                    }
                }
                weekTime[i] = dayTime;
            }
        }
        else {
            for (let i = 0; i < 7; i++) {
                let dayTime = [];
                let timeStatus = {};
                timeStatus.status = "Open24hours";
                dayTime[0] = timeStatus;
                weekTime[i] = dayTime;
            }
        }
        return weekTime;
    }
}
exports.default = vzTaiwan;
