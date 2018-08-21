"use strict";
class Server {
}
Server.port = "3000";
Server.ip = "http://192.168.0.113" + ":" + Server.port;
class ajax {
    static search(start_id, destination_id, start_time, end_time, sort, depthLimit, maptool, heuristic_gate, km15_gate) {
        $.ajax({
            type: "GET",
            url: `${Server.ip}` + "/trip",
            dataType: "json",
            data: {
                start_id: start_id,
                destination_id: destination_id,
                start_time: start_time,
                end_time: end_time,
                sort: sort,
                depthLimit: depthLimit,
                heuristic_gate: heuristic_gate,
                km15_gate: km15_gate
            },
            success: function (final_data) {
                let Result = final_data.message;
                createDom.draw_trip_planning(Result, maptool);
            },
            error: function (jqXHR) {
                alert("發生錯誤: " + jqXHR.status);
            }
        });
    }
    static search_v3(maptool, data) {
        $.ajax({
            type: "GET",
            url: `${Server.ip}` + "/trip_v3",
            dataType: "json",
            data: data,
            success: function (final_data) {
                domEvent.loading_over();
                let Result = final_data.message;
                if (Result.description != "find a path") {
                    if (Result.description == "NOT FOUND ANY PATH AT ROOT(A)") {
                        domEvent.showAlert("抱歉", "查無符合的最佳路線，請調整設定");
                    }
                    else if (Result.description == "NOT FOUND OPTIMAL PATH OPTIMAL(B)") {
                        domEvent.showAlert("抱歉", "查無符合的最佳路線，請調整設定");
                    }
                    if ($("#show_path").text().trim() == "") {
                        domEvent.path_empty(true);
                    }
                }
                else {
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
                    console.log(final_data);
                    createDom.draw_trip_planning(Result, maptool, "green", data.edge_color);
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
            },
            error: function (jqXHR) {
                alert("發生錯誤: " + jqXHR.status);
            }
        });
    }
    static findpoi(maptool, data) {
        $.ajax({
            type: "GET",
            url: `${Server.ip}` + "/findpoi",
            dataType: "json",
            data: data,
            success: function (final_data) {
                let lat;
                let lng;
                let poi_num = 0;
                for (let poi of final_data.message) {
                    lat = poi.lat;
                    lng = poi.lng;
                    let content = createDom.markerContext(poi.name, poi.rating, poi.introduction, poi._id, poi.open_time, poi.address);
                    maptool.addMarkerContent(lat, lng, content, data.color);
                    if (data.circle_gate)
                        maptool.addCircle(lat, lng, Number(data.circle_km) * 1000);
                    poi_num++;
                }
                maptool.center(lat, lng);
            },
            error: function (jqXHR) {
                alert("發生錯誤: " + jqXHR.status);
            }
        });
    }
    static findpair(maptool, data) {
        console.log(data);
        $.ajax({
            type: "GET",
            url: `${Server.ip}` + "/findpair",
            dataType: "json",
            data: data,
            success: function (final_data) {
                let coordinates = [];
                let pair = final_data.message.pair[0];
                let from_poi = final_data.message.from_poi[0];
                let to_poi = final_data.message.to_poi[0];
                let content_from = createDom.markerContext(from_poi.name, from_poi.rating, from_poi.introduction, from_poi._id, from_poi.open_time, from_poi.address);
                maptool.addMarkerContent(from_poi.lat, from_poi.lng, content_from, data.icon_color);
                coordinates.push({ lat: from_poi.lat, lng: from_poi.lng });
                let content_to = createDom.markerContext(to_poi.name, to_poi.rating, to_poi.introduction, to_poi._id, to_poi.open_time, to_poi.address);
                maptool.addMarkerContent(to_poi.lat, to_poi.lng, content_to, data.icon_color);
                coordinates.push({ lat: to_poi.lat, lng: to_poi.lng });
                maptool.drawPath(coordinates, true, data.edge_color);
                let pairSymbol_lat = (from_poi.lat + to_poi.lat) / 2;
                let pairSymbol_lng = (from_poi.lng + to_poi.lng) / 2;
                let content_pairSymbol = createDom.pairSymbolContext(pair.distance, pair.travelTime, pair.lineDistance, pair.lineTravelTime);
                maptool.addSymbolContent(pairSymbol_lat, pairSymbol_lng, content_pairSymbol);
                maptool.center(from_poi.lat, from_poi.lng);
                $("#pair_console").html(`from:${from_poi.name}<br/>to:${to_poi.name}`);
            },
            error: function (jqXHR) {
                alert("發生錯誤: " + jqXHR.status);
            }
        });
    }
    static findexp(maptool, data, toDo) {
        console.log(data);
        $.ajax({
            type: "GET",
            url: `${Server.ip}` + "/findexp",
            dataType: "json",
            data: data,
            success: function (final_data) {
                console.log(final_data);
                createDom.draw_trip_planning(final_data.message.exp[0].Result, maptool, data.icon_color, data.edge_color);
                createDom.history_exp_search(final_data.message.sess);
                if (toDo != null)
                    toDo(final_data.message.exp[0].Result);
            },
            error: function (jqXHR) {
                alert("發生錯誤: " + jqXHR.status);
            }
        });
    }
    static findHistoryExp(maptool, id_str) {
        let icon_color = $("#icon_color").children(":selected").attr("id");
        let edge_color = $("#edge_color").children(":selected").attr("id");
        let dbName = $(`#${id_str}_dbName`).text();
        let collName = $(`#${id_str}_collName`).text();
        let index = $(`#${id_str}_index`).text();
        let depth = $(`#${id_str}_depth`).text();
        $("#dbName").val(dbName);
        $("#collName").val(collName);
        $("#index").val(index);
        $("#depth").val(depth);
        let data = {
            type: 1,
            dbName: dbName,
            collName: collName,
            index: index,
            depth: depth,
            sess_add: "false",
            icon_color: icon_color,
            edge_color: edge_color
        };
        console.log("findHistoryExp", data);
        ajax.find_exp_google_route(maptool, data);
    }
    static findExceptEdge(maptool, data) {
        console.log(data);
        $.ajax({
            type: "GET",
            url: `${Server.ip}` + "/findExceptEdge",
            dataType: "json",
            data: data,
            success: function (final_data) {
                console.log(final_data);
                for (let edge of final_data.message) {
                    console.log(edge);
                    let from = edge.from;
                    let to = edge.to;
                    let coordinates = [];
                    coordinates.push({ lat: from.lat, lng: from.lng });
                    coordinates.push({ lat: to.lat, lng: to.lng });
                    maptool.drawPath(coordinates, true, data.edge_color);
                }
            },
            error: function (jqXHR) {
                alert("發生錯誤: " + jqXHR.status);
            }
        });
    }
    static findVD(maptool) {
        $.ajax({
            type: "GET",
            url: `${Server.ip}` + "/findVD",
            dataType: "json",
            success: function (final_data) {
                console.log(final_data);
                for (let VD of final_data.message) {
                    let lng = parseFloat(VD.px);
                    let lat = parseFloat(VD.py);
                    let content = createDom.VDContext(VD._id, VD.count, VD.speed, VD.avg);
                    console.log(lat, lng, content);
                    maptool.addMarkerContent(lat, lng, content, "red");
                }
            },
            error: function (jqXHR) {
                alert("發生錯誤: " + jqXHR.status);
            }
        });
    }
    static google_route(maptool, data) {
        $.ajax({
            type: "GET",
            url: `${Server.ip}` + "/google_route",
            dataType: "json",
            data: data,
            success: function (final_data) {
                console.log(final_data);
                let latlngs = final_data.message;
                let coordinates = [];
                let lat;
                let lng;
                for (let latlng of latlngs) {
                    lat = parseFloat(latlng[0]);
                    lng = parseFloat(latlng[1]);
                    coordinates.push({ lat: lat, lng: lng });
                }
                maptool.drawPath(coordinates, false, data.edge_color);
            },
            error: function (jqXHR) {
                alert("發生錯誤: " + jqXHR.status);
            }
        });
    }
    static find_exp_google_route(maptool, data) {
        let edge_color = data.edge_color;
        ajax.findexp(maptool, data, (Result) => {
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
            let data = {
                origin: origin,
                destination: destination,
                waypoints: waypoints.join("|"),
                edge_color: edge_color
            };
            ajax.google_route(maptool, data);
        });
    }
    static explore(maptool, data) {
        console.log(data);
        $.ajax({
            type: "GET",
            url: `${Server.ip}` + "/explore",
            dataType: "json",
            data: data,
            success: function (final_data) {
                for (let poi of final_data.message) {
                    let data_poi = {
                        id: poi._id,
                        lat: poi.loc.lat,
                        lng: poi.loc.lng,
                        name: poi.name,
                        introduction: poi.introduction
                    };
                    console.log(data_poi.lng, data_poi.lat);
                    let visit_hour = poi.stay_time == null ? 1 : poi.stay_time;
                    let rating = poi.rating == null ? 0 : poi.rating;
                    let context = createDom.recomd_poi_block(poi.name, visit_hour, rating, data_poi);
                    $("#recomd-area").append(context);
                }
            },
            error: function (jqXHR) {
                alert("發生錯誤: " + jqXHR.status);
            }
        });
    }
    static findAreaPois(maptool, data) {
        console.log(data);
        $.ajax({
            type: "GET",
            url: `${Server.ip}` + "/findAreaPois",
            dataType: "json",
            data: data,
            success: function (final_data) {
                for (let poi of final_data.message) {
                    let visit_hour = poi.stay_time == null ? 1 : poi.stay_time;
                    let rating = poi.rating == null ? 0 : poi.rating;
                    let data_poi = {
                        id: poi._id,
                        lat: poi.loc.lat,
                        lng: poi.loc.lng,
                        name: poi.name,
                        visit_hour: visit_hour,
                        rating: rating,
                        introduction: poi.introduction
                    };
                    console.log(data_poi.lng, data_poi.lat, data_poi.name);
                    let content = createDom.recomdContext(data_poi.id, data_poi.name, data_poi.introduction, true, data_poi);
                    let marker = maptool.addMarker(data_poi.lat, data_poi.lng, null, content, data.color);
                    mapArea.markers.push(marker);
                }
            },
            error: function (jqXHR) {
                alert("發生錯誤: " + jqXHR.status);
            }
        });
    }
    static test() {
        $.ajax({
            type: "GET",
            url: `${Server.ip}` + "/test",
            dataType: "json",
            success: function (final_data) {
                console.log(final_data);
            },
            error: function (jqXHR) {
                alert("發生錯誤: " + jqXHR.status);
            }
        });
    }
    static login(maptool, data) {
        $.ajax({
            type: "POST",
            url: `${Server.ip}` + "/loginAPI/post",
            data: data,
            dataType: "json",
            success: function (final_data) {
                let message = final_data.message;
                let userClientData = message.userClientData;
                console.log(userClientData);
                if (userClientData.login) {
                    console.log("登入成功");
                    window.location.href = `${Server.ip}` + "/index_v4";
                }
                else {
                    console.log("登入失敗");
                }
            },
            error: function (jqXHR) {
                alert("發生錯誤: " + jqXHR.status);
            }
        });
    }
    static saveRoute(maptool, data) {
        console.log(data);
        $.ajax({
            type: "GET",
            url: `${Server.ip}` + "/saveRoute",
            dataType: "json",
            data: data,
            success: function (final_data) {
                console.log(final_data.message);
                ajax.showRoute(maptool, "!{sess._id}");
            },
            error: function (jqXHR) {
                alert("發生錯誤: " + jqXHR.status);
            }
        });
    }
    static showRoute(maptool, data) {
        console.log(data);
        $.ajax({
            type: "GET",
            url: `${Server.ip}` + "/showRoute",
            dataType: "json",
            data: data,
            success: function (final_data) {
                console.log("showRoute");
                $(".userPath-area").empty();
                console.log(final_data.message.results);
                let results = final_data.message.results;
                let index = 0;
                domEvent.userPath = [];
                for (let result of results) {
                    let context = createDom.path(result.pathName, index);
                    $(".userPath-area").append(context);
                    domEvent.userPath.push(result);
                    console.log("userPath加入", result.pathName);
                    index++;
                }
            },
            error: function (jqXHR) {
                alert("發生錯誤: " + jqXHR.status);
            }
        });
    }
    static logout(maptool) {
        $.ajax({
            type: "GET",
            url: `${Server.ip}` + "/loginAPI/logout",
            dataType: "json",
            success: function (final_data) {
                console.log("logout");
                window.location.href = `${Server.ip}` + "/index_v4";
            },
            error: function (jqXHR) {
                alert("發生錯誤: " + jqXHR.status);
            }
        });
    }
}
