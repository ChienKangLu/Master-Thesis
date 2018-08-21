"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Time {
    constructor(time, year, month, date, hour, minute, second) {
        if (year != null && month != null && date != null && hour != null && minute != null && second != null)
            this.time = new Date(year, month, date, hour, minute, second);
        if (time != null)
            this.time = new Date(time);
    }
    copy() {
        return new Time(this.time);
    }
    minus(other, abs) {
        let duration;
        if (abs == true)
            duration = Math.abs(this.time.getTime() - other.time.getTime());
        else
            duration = this.time.getTime() - other.time.getTime();
        return duration;
    }
    add(duration, type) {
        let newTime = new Time();
        if (type == "milloonsecond") {
            newTime.time = new Date(this.time.getTime() + duration);
        }
        if (type == "second") {
            newTime.time = new Date(this.time.getTime() + duration * 1000);
        }
        if (type == "minute") {
            newTime.time = new Date(this.time.getTime() + duration * 60 * 1000);
        }
        if (type == "hour") {
            newTime.time = new Date(this.time.getTime() + duration * 60 * 60 * 1000);
        }
        return newTime;
    }
    static millionToDetail(duration) {
        let detail = {};
        let milliseconds = 0;
        if (duration > 1000)
            milliseconds = Math.round((duration % 1000) / 100);
        else {
            milliseconds = duration / 100;
        }
        let seconds = Math.trunc((duration / 1000) % 60);
        let minutes = Math.trunc((duration / (1000 * 60)) % 60);
        let hours = Math.trunc((duration / (1000 * 60 * 60)) % 24);
        detail.hours = hours;
        detail.minutes = minutes;
        detail.seconds = seconds;
        detail.milliseconds = milliseconds;
        return detail;
    }
    static realTime(weekTime, start_time) {
        for (let dayTime_index in weekTime) {
            for (let timeStatus_index in weekTime[dayTime_index]) {
                let timeStatus = weekTime[dayTime_index][timeStatus_index];
                if (timeStatus.status == "Open24hours" || timeStatus.status == "Closed") {
                    continue;
                }
                if (timeStatus.open != null && timeStatus.close != null) {
                    let open = timeStatus.open;
                    open.time = this.timeString2realTime(open, start_time);
                    let close = timeStatus.close;
                    close.time = this.timeString2realTime(close, start_time);
                    if (open.stamp == "PM" && close.stamp == "AM") {
                        close.time.time.setDate(close.time.time.getDate() + 1);
                    }
                    if (open.stamp == "AM" && close.stamp == "AM" && open.hour > close.hour) {
                        close.time.time.setDate(close.time.time.getDate() + 1);
                    }
                }
            }
        }
    }
    static timeString2realTime(timeString, start_time) {
        let tempTime = start_time.copy();
        if (timeString.hour != null && timeString.minute != null) {
            let hour = timeString.hour;
            if (timeString.stamp == "PM")
                hour += 12;
            tempTime.time.setHours(hour);
            tempTime.time.setMinutes(timeString.minute);
            tempTime.time.setSeconds(0);
            tempTime.time.setMilliseconds(0);
        }
        return tempTime;
    }
    static whichTimeStatus(dayTime, arrive_time) {
        let temp = {};
        for (let timeStatus_index in dayTime) {
            let timeStatus = dayTime[timeStatus_index];
            if (timeStatus.status == "Open24hours") {
                temp = timeStatus;
                return temp;
            }
            if (timeStatus.status == "Open") {
                if (timeStatus.open != null && timeStatus.close != null) {
                    if (timeStatus.open.time != null && timeStatus.close.time != null) {
                        let arrive_close = arrive_time.minus(timeStatus.close.time, false);
                        if (arrive_close < 0) {
                            temp = timeStatus;
                            return temp;
                        }
                    }
                }
            }
        }
        return null;
    }
    toString() {
        return this.time.toString();
    }
}
exports.default = Time;
