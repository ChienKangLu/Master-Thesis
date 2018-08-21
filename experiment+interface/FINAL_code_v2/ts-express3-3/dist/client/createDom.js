"use strict";
class createDom {
    static start_time(time) {
        let timeString = new Date(time).toTimeString().split(" ")[0];
        let domstr = `<div class=" col-xs-12">` +
            `<div class="time-line start-time-line"></div>` +
            `<div class="time-block start-time"> ${timeString}</div>` +
            `</div>`;
        return domstr;
    }
    static escapeHtml(text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function (m) { return map[m]; });
    }
    static data2html(data_poi) {
        data_poi.name = createDom.escapeHtml(data_poi.name);
        data_poi.name = data_poi.name.replace(/\s/g, "@");
        if (data_poi.introduction) {
            data_poi.introduction = createDom.escapeHtml(data_poi.introduction);
            data_poi.introduction = data_poi.introduction.replace(/\s/g, "@");
        }
        return data_poi;
    }
    static data_poi_string(data_poi) {
        return JSON.stringify(data_poi).substr(1).slice(0, -1);
    }
    static recomd_poi_block(poi_title, visit_hour, poi_rating, data_poi) {
        let data_poi_id = data_poi.id + "_";
        data_poi = createDom.data2html(data_poi);
        console.log(JSON.stringify(data_poi));
        let domstr = `<div id="${data_poi_id}" class="recomd-poi-block" data-poi={${createDom.data_poi_string(data_poi)}}>` +
            `<div class="poi-block">` +
            `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="remove" x="0px" y="0px" width="24.809px" height="24.808px" viewBox="0 0 24.809 24.808" xml:space="preserve" data-poi-id="${data_poi_id}" class="editElemt remove">` +
            `<circle style="fill:#E72C19;" cx="12.404" cy="12.404" r="12.404"></circle>` +
            `<g>` +
            `<rect x="3.904" y="10.841" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -5.1377 12.4045)" style="fill:#FFFFFF;" width="17" height="3.125"></rect>` +
            `<rect x="3.904" y="10.841" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 12.4043 29.9458)" style="fill:#FFFFFF;" width="17" height="3.125"></rect>` +
            `</g>` +
            `</svg>` +
            `<div class="poi-title"> ${poi_title}</div>` +
            `<div class="poi-top-info visit-hour push"> ${visit_hour} hr</div>` +
            `<div class="poi-top-info poi-rating"> ${poi_rating}</div>` +
            `</div>` +
            `</div>`;
        return domstr;
    }
    static time_poi_block(arrive_time, depart_time, poi_title, visit_hour, poi_rating, data_poi, label) {
        let arrive_time_String = new Date(arrive_time).toTimeString().split(" ")[0];
        let depart_time_String = new Date(depart_time).toTimeString().split(" ")[0];
        let data_poi_id = data_poi.id + "_";
        data_poi = createDom.data2html(data_poi);
        let domstr = `<div id="${data_poi_id}" class="time-poi-block" data-poi={${createDom.data_poi_string(data_poi)}}>` +
            createDom.path_poi(label, data_poi.lat, data_poi.lng) +
            `<div class="time-stamp time-stamp-top">` +
            `<div class="time-block time-block-green"> ${arrive_time_String}</div>` +
            `<div class="time-line time-line-green"></div>` +
            `</div>` +
            `<div class="time-stamp time-stamp-bottom">` +
            `<div class="time-block time-block-green"> ${depart_time_String}</div>` +
            `<div class="time-line time-line-green"></div>` +
            `</div>` +
            `<div class="poi-block">` +
            `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="remove" x="0px" y="0px" width="24.809px" height="24.808px" viewBox="0 0 24.809 24.808" xml:space="preserve" data-poi-id="${data_poi_id}" class="editElemt remove">` +
            `<circle style="fill:#E72C19;" cx="12.404" cy="12.404" r="12.404">` +
            `</circle>` +
            `<g>` +
            `<rect x="3.904" y="10.841" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -5.1377 12.4045)" style="fill:#FFFFFF;" width="17" height="3.125"></rect>` +
            `<rect x="3.904" y="10.841" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 12.4043 29.9458)" style="fill:#FFFFFF;" width="17" height="3.125"></rect>` +
            `</g>` +
            '</svg>' +
            `<div class="poi-title"> ${poi_title}</div>` +
            `<div class="poi-top-info visit-hour push"> ${visit_hour} hr</div>` +
            `<div class="poi-top-info poi-rating"> ${poi_rating}</div>` +
            `</div>` +
            `</div>`;
        return domstr;
    }
    static path_poi(label, lat, lng) {
        let img = "";
        if (label == "S" || label == "D") {
            img = "marker_black_small_no_border.svg";
        }
        else {
            img = "marker_green_small_no_border.svg";
        }
        let domstr = `<img id="path-poi${label}"  class="path-poi" src="public/img/${img}" data-loc={"type":"${label}","lat":${lat},"lng":${lng}}></img>` +
            `<div class="path-poi-num">${label}</div>`;
        return domstr;
    }
    static duration_time_stamp(travel_time, disFromPrevious, real_distance, real_traveltime) {
        let detail = Time.duration2detail(travel_time, "milloonsecond");
        let timeString = Time.toOneString(detail);
        let color_travel = (real_traveltime) ? "travel-duration" : "travel-not-real";
        let color_distance = (real_distance) ? "travel-duration" : "travel-not-real";
        let domstr = `<div class="duration-time-stamp">` +
            `<div class="time-line right-line travel-time-line"></div>` +
            `<div class="duration ${color_travel}"> ${timeString}</div>` +
            `<div class="duration ${color_distance}"> ${disFromPrevious.toFixed(1)}km</div>` +
            `</div>`;
        return domstr;
    }
    static wait_time(wait_time_detail) {
        let timeString = Time.toOneString(wait_time_detail);
        let domstr = `<div class="duration-time-stamp">` +
            `<div class="time-line right-line wait-time-line"></div>` +
            `<div class="duration wait-duration"> ${timeString}</div>` +
            `</div>`;
        return domstr;
    }
    static markerContext(name, rating, introduction, _id, open_time, address) {
        let weekday_text = "";
        if (open_time != null) {
            weekday_text += JSON.stringify(open_time.weekday_text, null, 2);
        }
        else
            weekday_text = "null";
        let content = `
        <table class="poi-content">
            <tr>
                <td class="name">${name}(${rating})</td>
            </tr>
            <tr>
                <td class="id">${_id}</td>
            </tr>
            <tr>
                <td class="id">${address}</td>
            </tr>
            <tr>
                <!--<td><div class="into">${introduction}</div></td>-->
                <!--<td class="time">${weekday_text}</td>-->
                <td class="time"><pre>${weekday_text}</pre></td>
            </tr>
        </table>
        `;
        return content;
    }
    static VDContext(_id, count, speed, avg) {
        let content = `
        <table class="poi-content">
            <tr>
                <td>id</td>
                <td class="name">${_id}</td>
            </tr>
            <tr>
                <td>count</td>
                <td class="name">${count}</td>
            </tr>
            <tr>
                <td>speed</td>
                <td class="name">${speed}</td>
            </tr>
            <tr>
                <td>avg</td>
                <td class="name">${avg}</td>
            </tr>
        </table>
        `;
        return content;
    }
    static recomdContext(_id, name, introduction, useUpmarker, data_poi) {
        let upmarker = "";
        if (useUpmarker) {
            if (data_poi) {
                data_poi = createDom.data2html(data_poi);
            }
            if (introduction) {
                introduction = introduction.replace(/@/g, " ");
            }
            upmarker = `<svg data-poi={${JSON.stringify(data_poi).substr(1).slice(0, -1)}} class = "upmarker-icon" version="1.1" id="&#x5716;&#x5C64;_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                            y="0px" width="12.401px" height="12.401px" viewBox="0 0 12.401 12.401" style="enable-background:new 0 0 12.401 12.401;"
                            xml:space="preserve">` +
                `<g>` +
                `<circle style="fill:#555555;" cx="6.201" cy="6.201" r="6.201"/>` +
                `<g>` +
                `<rect x="5.701" y="2.678" style="fill:#FFFFFF;" width="1" height="7.912"/>` +
                `<g>` +
                `<polygon style="fill:#FFFFFF;" points="2.929,5.329 3.515,5.875 6.2,2.985 8.886,5.875 9.472,5.329 6.2,1.811 			"/>` +
                `</g>` +
                `</g>` +
                `</g>` +
                `</svg>`;
        }
        let content = `<div id="${_id + "-" + "introduction-icon"}" class="poi-content">` +
            `<div class="poi-content-title">` +
            `<div class="name">${name.replace(/@/g, " ")}</div>` +
            `<svg data-poi="${_id + "-" + "introduction-icon"}" class = "introduction-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                                y="0px" width="12.401px" height="12.401px" viewBox="0 0 12.401 12.401" style="enable-background:new 0 0 12.401 12.401;"
                                xml:space="preserve">` +
            `<circle style="fill:#555555;" cx="6.201" cy="6.201" r="6.201"/>` +
            `<g>` +
            `<path style="stroke:#FFFFFF;stroke-width:0.9327;stroke-miterlimit:10;" d="M6.196,10.485c-0.135,0-0.249-0.047-0.342-0.142
                                        c-0.093-0.095-0.139-0.208-0.139-0.339c0-0.142,0.046-0.259,0.139-0.35c0.093-0.091,0.207-0.136,0.342-0.136
                                        c0.138,0,0.255,0.045,0.35,0.136c0.095,0.091,0.142,0.208,0.142,0.35c0,0.131-0.046,0.244-0.139,0.339
                                        C6.455,10.438,6.338,10.485,6.196,10.485z M6.447,8.004h-0.52L5.862,1.916h0.65L6.447,8.004z"/>` +
            ` </g>` +
            `</svg>` +
            upmarker
            +
                `</div>` +
            `<div class="introduction hidden">${introduction}</>` +
            `</div>`;
        return content;
    }
    static pairSymbolContext(distance, travelTime, lineDistance, lineTravelTime) {
        let dis = (distance != null) ? distance.toFixed(2) : "null";
        let tra = (travelTime != null) ? travelTime.toFixed(2) : "null";
        let linedis = (lineDistance != null) ? lineDistance.toFixed(2) : "null";
        let linetra = (lineTravelTime != null) ? lineTravelTime.toFixed(2) : "null";
        let content = `
        <table class="poi-content">
            <tr>
                <td>real distance</td>
                <td class="name">${dis} km</td>
            </tr>
            <tr>
                <td>real traveltime</td>
                <td class="name">${tra} hr</td>
            </tr>
            <tr>
                <td>line distance</td>
                <td class="name">${linedis} km</td>
            </tr>
            <tr>
                <td>line traveltime</td>
                <td class="name">${linetra} hr</td>
            </tr>
        </table>
        `;
        return content;
    }
    static draw_trip_planning(Result, maptool, icon_color, edge_color, straight_line) {
        $("#show_path").empty();
        let lat;
        let lng;
        let poi_num = 0;
        let coordinates = [];
        let nodeNum = Result.path.length;
        $("#id_search_from_name").html(`${Result.start.poi.name}`);
        $("#id_search_to_name").html(`${Result.destination.poi.name}`);
        let index = 0;
        for (let node of Result.path) {
            let poi = node.poi;
            lat = poi.lat;
            lng = poi.lng;
            let label = "" + poi_num;
            let data_poi = {
                id: poi._id,
                lat: lat,
                lng: lng,
                name: poi.name,
                introduction: poi.introduction
            };
            let content = createDom.recomdContext(poi._id, poi.name, poi.introduction);
            if (index == 0 || index == nodeNum - 1) {
                if (index == 0)
                    label = "S";
                else if (index == nodeNum - 1)
                    label = "D";
                maptool.addMarker(lat, lng, label, content, "black");
            }
            else {
                maptool.addMarker(lat, lng, label, content, icon_color);
            }
            poi_num++;
            coordinates.push({ lat: lat, lng: lng });
            if (index != 0)
                $("#show_path").append(createDom.duration_time_stamp(node.travelFromPrevious, node.disFromPrevious, node.real_distance, node.real_traveltime));
            if (node.waitTime != null)
                $("#show_path").append(createDom.wait_time(node.waitTime));
            index++;
            $("#show_path").append(createDom.time_poi_block(node.arrive_time.time, node.depart_time.time, poi.name, poi.stay_time, poi.global_attraction, data_poi, label));
        }
        createDom.img2svg();
        if (straight_line)
            maptool.drawPath(coordinates, null, edge_color);
        let excutionTime = Time.toAllString(Time.duration2detail(Result.excutionTime, "milloonsecond"));
        $("#excutionTime").text(excutionTime);
        let total_attraction = Result.totalAttraction.toFixed(2);
        $("#total_attraction").text(total_attraction);
        let total_distance = Result.totalDistance.toFixed(2);
        $("#total_distance").text(total_distance + " km");
        let total_travelTime = Time.toAllString(Time.duration2detail(Result.totalTravelTime, "hr"));
        $("#total_travelTime").text(total_travelTime);
        let trip_duration = Time.toAllString(Time.duration2detail(Result.trip_Duration, "milloonsecond"));
        $("#trip_duration").text(trip_duration);
    }
    static img2svg() {
        $('img[src$=".svg"]').each(function () {
            let $img = jQuery(this);
            let imgURL = $img.attr('src');
            let id = $img.attr('id');
            let attributes = $img.prop("attributes");
            $.get(imgURL, function (data) {
                let $svg = jQuery(data).find('svg');
                $svg = $svg.removeAttr('xmlns:a');
                $.each(attributes, function () {
                    $svg.attr(this.name, this.value);
                });
                $img.replaceWith($svg);
                domEvent.addDynamicSvgEvent(id);
            }, 'xml');
        });
    }
    static displayPath(Result, maptool) {
        domEvent.gotTo("note");
        domEvent.path_empty(false);
        domEvent.clearResult();
        domEvent.clearRecomd();
        $("#delete-poi-area").empty();
        let num = Result.path.length;
        domEvent.Result = Result;
        let start = Result.path[0].poi;
        let destimnation = Result.path[num - 1].poi;
        $("#start_id_pc").attr("value", start.name);
        $("#destination_id_pc").attr("value", destimnation.name);
        let center = {
            lat: (start.lat + destimnation.lat) / 2,
            lng: (start.lng + destimnation.lng) / 2
        };
        center.lng = center.lng - 0.08892059326171875 * 0.9;
        maptool.center(center.lat, center.lng);
        domEvent.clearResult();
        createDom.draw_trip_planning(Result, maptool, "green");
        let path = Result.path;
        let origin = "";
        let destination = "";
        let waypoints = [];
        for (let i = 0; i < path.length; i++) {
            let latlng = path[i].poi.lat + "," + path[i].poi.lng;
            if (i == 0) {
                origin = latlng;
            }
            else if (i == path.length - 1) {
                destination = latlng;
            }
            else {
                waypoints.push(latlng);
            }
        }
        let data_coord = {
            origin: origin,
            destination: destination,
            waypoints: waypoints.join("|"),
            edge_color: "blue"
        };
        ajax.google_route(maptool, data_coord);
    }
    static history_exp_search(sess) {
        let dbName = sess.dbName;
        let collName = sess.collName;
        let depth = sess.depth;
        let index = sess.index;
        let size = dbName.length;
        let Html = "";
        for (let i = 0; i < size; i++) {
            Html += `<tr>`;
            Html += `<td id="exp_search_again_li${i}_dbName">${dbName[i]}</td>`;
            Html += `<td id="exp_search_again_li${i}_collName">${collName[i]}</td>`;
            Html += `<td id="exp_search_again_li${i}_depth">${depth[i]}</td>`;
            Html += `<td id="exp_search_again_li${i}_index">${index[i]}</td>`;
            Html += `<td id="exp_search_again_li${i}" onclick='ajax.findHistoryExp(maptool,"exp_search_again_li${i}")'>
                        <a class="list-group-item exp_history_li" type="submit">
                            <span class="glyphicon glyphicon-search icon" aria-hidden="true"></span>
                        </a>
                    </td>`;
            Html += `</tr>`;
        }
        $("#exp_history_table").html(Html);
    }
    static path(pathName, index) {
        let domstr = `<div class="path" data-index="${index}">${pathName}</div>`;
        return domstr;
    }
}
