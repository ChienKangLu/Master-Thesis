"use strict";
class Time {
    static duration2detail(time, type) {
        let detail = {};
        let duration = time;
        if (type == "hr")
            duration = time * 60 * 60 * 1000;
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
    static toOneString(detail) {
        let timeString = "";
        if (detail.hours != 0)
            timeString = `${detail.hours} hr`;
        else if (detail.minutes != 0)
            timeString = `${detail.minutes} min`;
        else if (detail.seconds != 0)
            timeString = `${detail.seconds} sec`;
        else if (detail.milliseconds != 0)
            timeString = `${detail.milliseconds} msec`;
        return timeString;
    }
    static toAllString(detail) {
        let timeString = "";
        if (detail.hours != 0)
            timeString += `${Time.pad(detail.hours, 2)} hr `;
        if (detail.minutes != 0)
            timeString += `${Time.pad(detail.minutes, 2)} min `;
        if (detail.seconds != 0)
            timeString += `${Time.pad(detail.seconds, 2)} sec `;
        if (detail.milliseconds != 0)
            timeString += `${Time.pad(detail.milliseconds, 2)} msec `;
        return timeString;
    }
    static pad(n, width, z) {
        z = z || '0';
        let n_string = n + '';
        return n_string.length >= width ? n : new Array(width - n_string.length + 1).join(z) + n;
    }
}
