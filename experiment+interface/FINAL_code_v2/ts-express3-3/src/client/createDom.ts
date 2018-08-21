class createDom{
    static start_time(time:any):string{
        let timeString:string=new Date(time).toTimeString().split(" ")[0];
        let domstr=`<div class=" col-xs-12">`+
                        `<div class="time-line start-time-line"></div>`+
                        `<div class="time-block start-time"> ${timeString}</div>`+
                    `</div>`;
        return domstr;
    }
    static escapeHtml(text:string) {
        interface map{
            [index:string]:string;
        }
        var map:map = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
      }
    static data2html(data_poi:any){
        data_poi.name = createDom.escapeHtml( data_poi.name);
        data_poi.name = data_poi.name.replace(/\s/g,"@");
        if(data_poi.introduction){
            data_poi.introduction = createDom.escapeHtml(data_poi.introduction);
            data_poi.introduction = data_poi.introduction.replace(/\s/g,"@");
        }
        return data_poi;
    }
    static data_poi_string(data_poi:any):string{
        return JSON.stringify(data_poi).substr(1).slice(0,-1);
    }
    static recomd_poi_block(poi_title:string,visit_hour:number,poi_rating:number,data_poi:any):string{
        let data_poi_id= data_poi.id+"_";
        data_poi=createDom.data2html(data_poi);
        console.log(JSON.stringify(data_poi));
        let domstr=`<div id="${data_poi_id}" class="recomd-poi-block" data-poi={${createDom.data_poi_string(data_poi)}}>`+
                        `<div class="poi-block">`+
                            `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="remove" x="0px" y="0px" width="24.809px" height="24.808px" viewBox="0 0 24.809 24.808" xml:space="preserve" data-poi-id="${data_poi_id}" class="editElemt remove">`+
                                `<circle style="fill:#E72C19;" cx="12.404" cy="12.404" r="12.404"></circle>`+
                                `<g>`+
                                    `<rect x="3.904" y="10.841" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -5.1377 12.4045)" style="fill:#FFFFFF;" width="17" height="3.125"></rect>`+
                                    `<rect x="3.904" y="10.841" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 12.4043 29.9458)" style="fill:#FFFFFF;" width="17" height="3.125"></rect>`+
                                `</g>`+
                            `</svg>`+
                            `<div class="poi-title"> ${poi_title}</div>`+
                            `<div class="poi-top-info visit-hour push"> ${visit_hour} hr</div>`+
                            `<div class="poi-top-info poi-rating"> ${poi_rating}</div>`+
                        `</div>`+
                    `</div>`;
                return domstr;
    }
    static time_poi_block(arrive_time:Date,depart_time:Date,poi_title:string,visit_hour:number,poi_rating:number,data_poi:any,label:string):string{
        let arrive_time_String:string=new Date(arrive_time).toTimeString().split(" ")[0];
        let depart_time_String:string=new Date(depart_time).toTimeString().split(" ")[0];
        let data_poi_id= data_poi.id+"_";
        data_poi=createDom.data2html(data_poi);
        let domstr=`<div id="${data_poi_id}" class="time-poi-block" data-poi={${createDom.data_poi_string(data_poi)}}>`+
                        createDom.path_poi(label,data_poi.lat,data_poi.lng)+
                        `<div class="time-stamp time-stamp-top">`+
                            `<div class="time-block time-block-green"> ${arrive_time_String}</div>`+
                            `<div class="time-line time-line-green"></div>`+
                        `</div>`+
                        `<div class="time-stamp time-stamp-bottom">`+
                            `<div class="time-block time-block-green"> ${depart_time_String}</div>`+
                            `<div class="time-line time-line-green"></div>`+
                        `</div>`+
                        `<div class="poi-block">`+
                            `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="remove" x="0px" y="0px" width="24.809px" height="24.808px" viewBox="0 0 24.809 24.808" xml:space="preserve" data-poi-id="${data_poi_id}" class="editElemt remove">`+
                                `<circle style="fill:#E72C19;" cx="12.404" cy="12.404" r="12.404">`+
                                `</circle>`+
                                `<g>`+
                                    `<rect x="3.904" y="10.841" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -5.1377 12.4045)" style="fill:#FFFFFF;" width="17" height="3.125"></rect>`+
                                    `<rect x="3.904" y="10.841" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 12.4043 29.9458)" style="fill:#FFFFFF;" width="17" height="3.125"></rect>`+
                                `</g>`+
                            '</svg>'+
                            `<div class="poi-title"> ${poi_title}</div>`+
                            `<div class="poi-top-info visit-hour push"> ${visit_hour} hr</div>`+
                            `<div class="poi-top-info poi-rating"> ${poi_rating}</div>`+
                        `</div>`+
                    `</div>`;
        return domstr;
    }
    static path_poi(label:string,lat:number,lng:number):string{
        let img="";
        if(label=="S"||label=="D"){
            img = "marker_black_small_no_border.svg";
        }else{
            img = "marker_green_small_no_border.svg";
        }
        let domstr=`<img id="path-poi${label}"  class="path-poi" src="public/img/${img}" data-loc={"type":"${label}","lat":${lat},"lng":${lng}}></img>`+
                   `<div class="path-poi-num">${label}</div>`;
        return domstr;
        
    }
    static duration_time_stamp(travel_time:number,disFromPrevious:number,real_distance:boolean,real_traveltime:boolean):string{
        let detail:any=Time.duration2detail(travel_time,"milloonsecond");
        let timeString:string=Time.toOneString(detail);
        let color_travel:string =(real_traveltime)?"travel-duration":"travel-not-real";
        let color_distance:string =(real_distance)?"travel-duration":"travel-not-real";
        let domstr=`<div class="duration-time-stamp">`+
                        `<div class="time-line right-line travel-time-line"></div>`+
                        `<div class="duration ${color_travel}"> ${timeString}</div>`+
                        `<div class="duration ${color_distance}"> ${disFromPrevious.toFixed(1)}km</div>`+
                    `</div>`;
        return domstr;
    }
    static wait_time(wait_time_detail:any):string{
        let timeString:string=Time.toOneString(wait_time_detail);
        let domstr=`<div class="duration-time-stamp">`+
                        `<div class="time-line right-line wait-time-line"></div>`+
                        `<div class="duration wait-duration"> ${timeString}</div>`+
                    `</div>`;
        return domstr;
    }
    static markerContext(name:string,rating:string,introduction:string,_id:string,open_time:any,address:string):string{
        let  weekday_text:string="";
        if(open_time!=null){
            weekday_text+=JSON.stringify(open_time.weekday_text,null,2)
        }
        else
            weekday_text="null";
        let content=`
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
    static VDContext(_id:string,count:string,speed:number,avg:number):string{
        let content=`
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
    static recomdContext(_id:string,name:string,introduction:string,useUpmarker?:boolean,data_poi?:any):string{
        let upmarker:string="";
        if(useUpmarker){
            if(data_poi){
                data_poi=createDom.data2html(data_poi);
            }
            if(introduction){
                introduction = introduction.replace(/@/g," ");
            }
            upmarker = `<svg data-poi={${JSON.stringify(data_poi).substr(1).slice(0,-1)}} class = "upmarker-icon" version="1.1" id="&#x5716;&#x5C64;_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                            y="0px" width="12.401px" height="12.401px" viewBox="0 0 12.401 12.401" style="enable-background:new 0 0 12.401 12.401;"
                            xml:space="preserve">`+
                            `<g>`+
                                `<circle style="fill:#555555;" cx="6.201" cy="6.201" r="6.201"/>`+
                                `<g>`+
                                    `<rect x="5.701" y="2.678" style="fill:#FFFFFF;" width="1" height="7.912"/>`+
                                    `<g>`+
                                        `<polygon style="fill:#FFFFFF;" points="2.929,5.329 3.515,5.875 6.2,2.985 8.886,5.875 9.472,5.329 6.2,1.811 			"/>`+
                                    `</g>`+
                                `</g>`+
                            `</g>`+
                        `</svg>`;
        }
        let content=`<div id="${_id+"-"+"introduction-icon"}" class="poi-content">`+
                        `<div class="poi-content-title">`+
                            `<div class="name">${name.replace(/@/g," ")}</div>`+
                            `<svg data-poi="${_id+"-"+"introduction-icon"}" class = "introduction-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                                y="0px" width="12.401px" height="12.401px" viewBox="0 0 12.401 12.401" style="enable-background:new 0 0 12.401 12.401;"
                                xml:space="preserve">`+
                                `<circle style="fill:#555555;" cx="6.201" cy="6.201" r="6.201"/>`+
                                `<g>`+
                                    `<path style="stroke:#FFFFFF;stroke-width:0.9327;stroke-miterlimit:10;" d="M6.196,10.485c-0.135,0-0.249-0.047-0.342-0.142
                                        c-0.093-0.095-0.139-0.208-0.139-0.339c0-0.142,0.046-0.259,0.139-0.35c0.093-0.091,0.207-0.136,0.342-0.136
                                        c0.138,0,0.255,0.045,0.35,0.136c0.095,0.091,0.142,0.208,0.142,0.35c0,0.131-0.046,0.244-0.139,0.339
                                        C6.455,10.438,6.338,10.485,6.196,10.485z M6.447,8.004h-0.52L5.862,1.916h0.65L6.447,8.004z"/>`+
                               ` </g>`+
                            `</svg>`+
                            upmarker
                            +
                        `</div>`+
                        `<div class="introduction hidden">${introduction}</>`+
                        // `<div>${introduction}</div>`+
                    `</div>`;
        return content;
    }
    static pairSymbolContext(distance:number,travelTime:number,lineDistance:number,lineTravelTime:number):string{
        let dis:string=(distance!=null)?distance.toFixed(2):"null";
        let tra:string=(travelTime!=null)?travelTime.toFixed(2):"null";
        let linedis:string=(lineDistance!=null)?lineDistance.toFixed(2):"null";
        let linetra:string=(lineTravelTime!=null)?lineTravelTime.toFixed(2):"null";
        let content=`
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
    static draw_trip_planning(Result:any,maptool:mapTool,icon_color?:string,edge_color?:string,straight_line?:boolean):void{
        $("#show_path").empty();
        let lat;
        let lng;
        let poi_num:number=0;
        let coordinates=[];
        let nodeNum:number=Result.path.length;
        $("#id_search_from_name").html(`${Result.start.poi.name}`);
        $("#id_search_to_name").html(`${Result.destination.poi.name}`);
        // $("#show_path").append(createDom.start_time(Result.start_time.time));
        let index=0;
        for(let node of Result.path){
            let poi:any=node.poi;
            lat=poi.lat;
            lng=poi.lng;
            let label = ""+poi_num;
            let data_poi={
                id:poi._id,
                lat:lat,
                lng:lng,
                name:poi.name,
                introduction:poi.introduction
            }
            let content = createDom.recomdContext(poi._id,poi.name,poi.introduction,);
            if(index==0||index==nodeNum-1){
                if(index==0)
                    label = "S";
                else if (index==nodeNum-1)
                    label = "D";
                maptool.addMarker(lat,lng,label,content,"black");
            }else{
                maptool.addMarker(lat,lng,label,content,icon_color);
            }
            // maptool.addMarkerContent(lat,lng,content,"red");
            poi_num++;
            coordinates.push({lat:lat,lng:lng});
            if(index!=0)
                $("#show_path").append(createDom.duration_time_stamp(node.travelFromPrevious,node.disFromPrevious,node.real_distance,node.real_traveltime));
            if(node.waitTime!=null)
            $("#show_path").append(createDom.wait_time(node.waitTime));
            index++;
            $("#show_path").append(createDom.time_poi_block(node.arrive_time.time,node.depart_time.time,poi.name,poi.stay_time,poi.global_attraction,data_poi,label));
            
        }
        createDom.img2svg();
        // maptool.center(lat,lng);
        if(straight_line)
            maptool.drawPath(coordinates,null,edge_color);

        let excutionTime=Time.toAllString(Time.duration2detail(Result.excutionTime,"milloonsecond"));
        $("#excutionTime").text(excutionTime);
        let total_attraction=Result.totalAttraction.toFixed(2);
        $("#total_attraction").text(total_attraction);
        let total_distance=Result.totalDistance.toFixed(2);
        $("#total_distance").text(total_distance+" km");
        let total_travelTime=Time.toAllString(Time.duration2detail(Result.totalTravelTime,"hr"));
        $("#total_travelTime").text(total_travelTime);
        let trip_duration=Time.toAllString(Time.duration2detail(Result.trip_Duration,"milloonsecond"));
        $("#trip_duration").text(trip_duration);
    }
    static img2svg(){
        $('img[src$=".svg"]').each(function() {
            let $img = jQuery(this);
            let imgURL = $img.attr('src');
            let id = $img.attr('id');
            
            let attributes = $img.prop("attributes");
            $.get(imgURL, function(data) {
                // Get the SVG tag, ignore the rest
                let $svg = jQuery(data).find('svg');
    
                // Remove any invalid XML tags
                $svg = $svg.removeAttr('xmlns:a');
    
                // Loop through IMG attributes and apply on SVG
                $.each(attributes, function() {
                    $svg.attr(this.name, this.value);
                });
                // Replace IMG with SVG
                $img.replaceWith($svg);
                domEvent.addDynamicSvgEvent(id);
            }, 'xml');
        });
    }
    static displayPath(Result:any,maptool:mapTool):void{
        
        domEvent.gotTo("note");
        domEvent.path_empty(false);
        domEvent.clearResult();
        domEvent.clearRecomd();
        $("#delete-poi-area").empty();
        let num :number = Result.path.length;
        domEvent.Result = Result;
        let start = Result.path[0].poi;
        let destimnation = Result.path[num-1].poi;
        $("#start_id_pc").attr("value",start.name);
        $("#destination_id_pc").attr("value",destimnation.name);
        let center:any={
            lat:(start.lat+destimnation.lat)/2,
            lng:(start.lng+destimnation.lng)/2
        }
        center.lng = center.lng - 0.08892059326171875*0.9;
        maptool.center(center.lat,center.lng); 
        domEvent.clearResult();
        createDom.draw_trip_planning(Result,maptool,"green");
        //google route
        let path:Array<any> = Result.path;
        let origin:string ="";
        let destination:string = "";
        let waypoints:Array<string> =[];
        for(let i=0;i<path.length;i++){
            let latlng:string = path[i].poi.lat+","+path[i].poi.lng;
            if(i==0){
                origin = latlng;
            }else if(i==path.length-1){
                destination = latlng;
            }else{
                waypoints.push(latlng);
            }
        }
        let data_coord:any = {
            origin:origin,
            destination:destination,
            waypoints:waypoints.join("|"),
            edge_color:"blue"
        };
        ajax.google_route(maptool,data_coord);
    }
    static history_exp_search(sess:any):void{
        let dbName=sess.dbName;
        let collName=sess.collName;
        let depth=sess.depth;
        let index=sess.index;
        let size = dbName.length;
        let Html="";
        for(let i = 0 ;i<size;i++){
            Html+=`<tr>`;
            Html+=`<td id="exp_search_again_li${i}_dbName">${dbName[i]}</td>`;
            Html+=`<td id="exp_search_again_li${i}_collName">${collName[i]}</td>`;
            Html+=`<td id="exp_search_again_li${i}_depth">${depth[i]}</td>`;
            Html+=`<td id="exp_search_again_li${i}_index">${index[i]}</td>`;
            Html+=`<td id="exp_search_again_li${i}" onclick='ajax.findHistoryExp(maptool,"exp_search_again_li${i}")'>
                        <a class="list-group-item exp_history_li" type="submit">
                            <span class="glyphicon glyphicon-search icon" aria-hidden="true"></span>
                        </a>
                    </td>`;
            Html+=`</tr>`; 
        }
        
        $("#exp_history_table").html(Html);
        /*
        let dbNameHtml="";
        let collNameHtml="";
        let depthHtml="";
        let indexHtml="";
        let exp_search_againHtml="";
        for(let i = 0 ;i<size;i++){
            dbNameHtml+=`<li id="exp_search_again_li${i}_dbName" class="list-group-item">${dbName[i]}</li>`;
            collNameHtml+=`<li id="exp_search_again_li${i}_collName" class="list-group-item">${collName[i]}</li>`;
            depthHtml+=`<li id="exp_search_again_li${i}_depth" class="list-group-item">${depth[i]}</li>`;
            indexHtml+=`<li id="exp_search_again_li${i}_index" class="list-group-item">${index[i]}</li>`;
            exp_search_againHtml+=`
                <li id="exp_search_again_li${i}" onclick='ajax.findHistoryExp(maptool,"exp_search_again_li${i}")'>
                    <a class="list-group-item exp_history_li" type="submit">
                        <span class="glyphicon glyphicon-search icon" aria-hidden="true"></span>
                    </a>
                </li>
            `;
        }

        $("#exp_dbName").html(dbNameHtml);
        $("#exp_collName").html(collNameHtml);
        $("#exp_index").html(indexHtml);
        $("#exp_depth").html(depthHtml);
        $("#exp_search_again").html(exp_search_againHtml);
        */
    }
    static path(pathName:string,index:number){
        let domstr= `<div class="path" data-index="${index}">${pathName}</div>`;
        return domstr;
    }
}
/**
 * 2017/12/3 17:50
 * 設計參考http://www.playpcesor.com/2017/01/funliday-app.html
 * http://www.playpcesor.com/2017/01/top-9-travler-app.html
 */