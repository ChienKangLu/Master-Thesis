interface roundSlider extends JQuery {
    value:any;
    roundSlider(settings: any): any;
    roundSlider(settings: any,settings2: any): any;
    setValue(i:any):any;
}
class domEvent{
    // static sess:any;
    static maptool:mapTool;
    static Result:any;
    static userPath:Array<any>=[];
    constructor(maptool?:mapTool){
        domEvent.maptool = maptool;
        $(document).ready(function(){
            //强制让内容超过  
            // $('#main').css("height",window.innerHeight);  
            // $("body, html").animate({scrollTop: 100});
            //重置成新高度  
            // $("#main").css("height",window.innerHeight);
            // $('html, body').animate({scrollTop: 30}, 'slow');
            //非常重要，用于兼容不同机型，防止浏览器窗口移动
            // $('#main').on('touchmove', function (e) { e.preventDefault(); });  
            // document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);  

            console.log("ready");
            // console.log(domEvent.sess);
            // createDom.history_exp_search(domEvent.sess);
            $("#start_id").change(function () {
                let id = $(this).children(":selected").attr("id");
                // alert(id);
            });
            $("#search").click(function () {
                maptool.clear();
                let start_id: string = <string>$("#start_id").children(":selected").attr("id");
                let destination_id: string = <string>$("#destination_id").children(":selected").attr("id");
                let start_time = new Date(<string>$("#start_time").val());
                let end_time = new Date(<string>$("#end_time").val());
                let heuristic_gate:boolean = $("#heuristic_gate").is(':checked');
                let km15_gate:boolean = $("#km15_gate").is(':checked');
                let sort = [];
                if ($("#Attraction").val() != -1) {
                    sort[<number>$("#Attraction").val()] = 0;
                }
                if ($("#TravelTime").val() != -1) {
                    sort[<number>$("#TravelTime").val()] = 1;
                }
                if ($("#Distance").val() != -1) {
                    sort[<number>$("#Distance").val()] = 2;
                }
                let depthLimit: number = <number>$("#depthLimit").val();
                ajax.search(start_id, destination_id, start_time, end_time, sort, depthLimit,maptool,heuristic_gate,km15_gate);

            });
            $("#searchbyID").click(function () {
                maptool.clear();
                let start_id: string = <string>$("#fromid").val();
                let destination_id: string = <string>$("#toid").val();
                let start_time = new Date(<string>$("#start_time").val());
                let end_time = new Date(<string>$("#end_time").val());
                let heuristic_gate:boolean = $("#heuristic_gate").is(':checked');
                let km15_gate:boolean = $("#km15_gate").is(':checked');
                let sort = [];
                if ($("#Attraction").val() != -1) {
                    sort[<number>$("#Attraction").val()] = 0;
                }
                if ($("#TravelTime").val() != -1) {
                    sort[<number>$("#TravelTime").val()] = 1;
                }
                if ($("#Distance").val() != -1) {
                    sort[<number>$("#Distance").val()] = 2;
                }
                let depthLimit: number = <number>$("#depthLimit").val();
                ajax.search(start_id, destination_id, start_time, end_time, sort, depthLimit,maptool,heuristic_gate,km15_gate);

            })
            $("#show_query_str").click(function () {
                let icon_color: string = <string>$("#icon_color").children(":selected").attr("id");
                let query_str: string = <string>$("#query_str").val();
                let circle_gate:boolean = $("#circle_gate").is(':checked');
                let circle_km:number = <number>$("#circle_km").val();
                console.log(query_str);
                let data:any = {
                    type:1,
                    query_str:query_str,
                    color:icon_color,
                    circle_gate:circle_gate,
                    circle_km:circle_km
                }
                console.log(data);
                ajax.findpoi(maptool,data);
            })
            $("#show_query_byID_str").click(function () {
                let icon_color: string = <string>$("#icon_color").children(":selected").attr("id");
                let query_byID_str: string = <string>$("#query_byID_str").val();
                let circle_gate:boolean = $("#circle_gate").is(':checked');
                let circle_km:number = <number>$("#circle_km").val();
                console.log(query_byID_str);
                let data:any = {
                    type:2,
                    _id:query_byID_str,
                    color:icon_color,
                    circle_gate:circle_gate,
                    circle_km:circle_km
                }
                ajax.findpoi(maptool,data);
            })
            $("#clearMap").click(function () {
                maptool.clear();
            })
            $("#circle_gate").click(function () {
                console.log($("#circle_gate").is(':checked'));
            })
            $("#query_template").change(function(){
                let query_template_id: string = <string>$("#query_template").children(":selected").attr("id");
                if(query_template_id=="query_str_name")
                    $("#query_str").val(`{
        "name":"鷹石尖"
    }`
                    );
                if(query_template_id=="query_str_or")
                    $("#query_str").val(`{
        "$or":[{"name":"幾米主題公園"},{"name":"鷹石尖"}]
    }`
                    );
                if(query_template_id=="query_str_rating")
                    $("#query_str").val(`{"rating":{"$gte":4.7}}`
                    );
            });
            $("#show_pair").click(function () {
                let icon_color: string = <string>$("#icon_color").children(":selected").attr("id");
                let edge_color: string = <string>$("#edge_color").children(":selected").attr("id");
                let pair_from_id: string = <string>$("#pair_from_id").val();
                let pair_to_id: string = <string>$("#pair_to_id").val();
                let data:any = {
                    type:1,
                    pair_from_id:pair_from_id,
                    pair_to_id:pair_to_id,
                    icon_color:icon_color,
                    edge_color:edge_color
                }
                ajax.findpair(maptool,data);
            });
            $("#Showexp").click(function () {
                // maptool.clear();
                let icon_color: string = <string>$("#icon_color").children(":selected").attr("id");
                let edge_color: string = <string>$("#edge_color").children(":selected").attr("id");
                let dbName: string = <string>$("#dbName").val();
                let collName: string = <string>$("#collName").val();
                let index: number = <number>$("#index").val();
                let depth: number = <number>$("#depth").val();
                let data:any = {
                    type:1,
                    dbName:dbName,
                    collName:collName,
                    index:index,
                    depth:depth,
                    sess_add:true,
                    icon_color:icon_color,
                    edge_color:edge_color
                }
                // ajax.findexp(maptool,data);
                ajax.find_exp_google_route(maptool,data);
            });
            $("#ShowExceptEdge").click(function(){
                let icon_color: string = <string>$("#icon_color").children(":selected").attr("id");
                let edge_color: string = <string>$("#edge_color").children(":selected").attr("id");
                let exceptEdgeDB: string = <string>$("#exceptEdgeDB").val();
                let exceptEdgeColl: string = <string>$("#exceptEdgeColl").val();
                let exceptEdgeRange: string = <string>$("#exceptEdgeRange").val();
                console.log(exceptEdgeDB,exceptEdgeColl,exceptEdgeRange);
                /**
                 * exceptEdgeRange 還沒有解析(0,10)
                 */
                let exceptEdgeRangeSplit = exceptEdgeRange.split(",");
                let data:any = {
                    exceptEdgeDB:exceptEdgeDB,
                    exceptEdgeColl:exceptEdgeColl,
                    larger:exceptEdgeRangeSplit[0], //0
                    smaller:exceptEdgeRangeSplit[1], //10
                    icon_color:icon_color,
                    edge_color:edge_color
                }
                ajax.findExceptEdge(maptool,data);
            });
            $("#ShowVD").click(function(){
                ajax.findVD(maptool);
            });
            $("#ShowExceptArea").click(function(){
                let area_color: string = <string>$("#area_color").children(":selected").attr("id");
                let ltopString: string = <string>$("#ltop").val();
                let rbottomString: string = <string>$("#rbottom").val();
                let ltopArray = ltopString.split(",");
                let rbottomArray  = rbottomString.split(",");
                let ltop ={
                    lat:parseFloat(ltopArray[0]),
                    lng:parseFloat(ltopArray[1])
                };
                let rbottom ={
                    lat:parseFloat(rbottomArray[0]),
                    lng:parseFloat(rbottomArray[1])
                }
                maptool.drawArea(ltop,rbottom,area_color);
            });
            $("#myRange").on("input change", function() { 
                var r = $('#myRange');
                // var p = r.val();
                let p;
                p = r.val();
                bg(p);
                rangelabel(p);
                function bg(n:any){
                    console.log(n)
                    n = (n-2)*20 ;
                    r.css({
                        'background-image':'-webkit-linear-gradient(left ,var(--coverColor) 0%,var(--coverColor) '+n+'%,#fff '+n+'%, #fff 100%)'
                    });
                };
                function rangelabel(n:any){
                    // Set active label
                    $('.range-labels li').removeClass('active selected');
                    var curLabel = $('.range-labels').find('li:nth-child(' + (n-1) + ')');
                    curLabel.addClass('active selected');
                    curLabel.prevAll().addClass('selected');
                }
             });
            (<roundSlider>$("#slider-attracion")).roundSlider({
                sliderType: "min-range",
                width: 20,
                handleSize: "+13",
                radius: 100,
                value: 3.5,
                max: 5,
                min: 1,
                step: 0.1,
                editableTooltip: true,
                keyboardAction: false,
                startAngle: 90,
                handleShape: "dot",
                animation: false,
                tooltipFormat:(e:any)=>{
                    return e.value+"<div>" + "Attraction" + "</div>";
                },
                change: function (args:any) {
                    // handle the change event here
                }
            });
            (<roundSlider>$("#slider-distance")).roundSlider({
                sliderType: "min-range",
                width: 20,
                handleSize: "+13",
                radius: 100,
                value: 11,
                max: 40,
                min: 1,
                step: 0.1,
                editableTooltip: true,
                keyboardAction: false,
                startAngle: 90,
                handleShape: "dot",
                animation: false,
                tooltipFormat:(e:any)=>{
                    return e.value+" KM"+"<div>" + "Distance" + "</div>";
                },
                change: function (args:any) {
                    // handle the change event here
                }
            });
            (<roundSlider>$("#slider-traveltime")).roundSlider({
                sliderType: "min-range",
                width: 20,
                handleSize: "+13",
                radius: 100,
                value: 0.5,
                max: 2,
                min: 0.1,
                step: 0.1,
                editableTooltip: true,
                keyboardAction: false,
                startAngle: 90,
                handleShape: "dot",
                animation: false,
                tooltipFormat:(e:any)=>{
                    return e.value+" HR"+"<div>" + "TravelTime" + "</div>";
                },

                change: function (args:any) {
                    // handle the change event here
                }
            });
            // *  Replace all SVG images with inline SVG *
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
                    domEvent.addSvgEvent(id,maptool);
                }, 'xml');
            });
            $("#search-v3").click(function () {
                domEvent.gotTo("note");
                domEvent.loading();
                let start_id: string="";
                let destination_id: string ="";
                if($('.mobile-poi').css("display")=="block"){
                    start_id = <string>$("#start_id_mobile").children(":selected").attr("id");
                    destination_id = <string>$("#destination_id_mobile").children(":selected").attr("id");
                }
                if($('.pc-poi').css("display")=="block"){
                    start_id = <string>$(`option:contains("${$("#start_id_pc").val()}")`).attr("id");
                    destination_id = <string>$(`option:contains("${$("#destination_id_pc").val()}")`).attr("id");
                }
                console.log(start_id,destination_id);
                let start_time = new Date(<string>$("#start_time").val());
                let end_time = new Date(<string>$("#end_time").val());
                let depth =  $('#myRange').val();
                let s_attr = (<roundSlider>$('#slider-attracion')).roundSlider('getValue');
                let s_dis = (<roundSlider>$('#slider-distance')).roundSlider('getValue');
                let s_travel = (<roundSlider>$('#slider-traveltime')).roundSlider('getValue');
                let considerMustVisit_order:boolean = false;
                let considerMustNotVist:boolean = false;
                let mustVisit_order:Array<any> = undefined;//Array of visit_order
                let mustNotVist:Array<string> =undefined;

                let data:any = {
                    start_id:start_id,
                    destination_id:destination_id,
                    start_time:start_time, //0
                    end_time:end_time, //10
                    depth:depth,
                    s_attr:s_attr,
                    s_dis:s_dis,
                    s_travel:s_travel,
                    considerMustVisit_order:considerMustVisit_order,
                    considerMustNotVist:considerMustNotVist,
                    mustVisit_order:mustVisit_order,
                    mustNotVist:mustNotVist,
                }
                console.log(data);
                // alert(<string>$("#start_time").val());
                // alert(start_time);
                
                domEvent.beforeSearch();
                
                $("#recomd-area").empty();
                
                $("#delete-poi-area").empty();
                ajax.search_v3(maptool,data);
                // ajax.search(start_id, destination_id, start_time, end_time, sort, depthLimit,maptool,heuristic_gate,km15_gate);
            });
            domEvent.arrangeRoute();
            $("#recomd-area").on("click",".recomd-poi-block",function(){
                let poi_data = $(this).data("poi");
                let id = poi_data.id;
                let name = poi_data.name;
                let lat = poi_data.lat;
                let lng = poi_data.lng;
                let introduction = poi_data.introduction;
                console.log(id,name,lng,lat);
                
                let content = createDom.recomdContext(id,name,introduction);
                maptool.addMarker(lat,lng,null,content,"marker_recomd");
            });
            $("#start-plan").click(function(){
                domEvent.gotTo("datetime");
            })
            $(".understand").click(function(){
                $("#alert-area").addClass("hidden");
            })
            $("body").on("click"," .introduction-icon",function(){
                let poi_content_id = $(this).data("poi");
                  if(!$("#"+poi_content_id+" .introduction").hasClass("hidden")){
                    $("#"+poi_content_id+" .introduction").addClass("hidden");
                    $("#"+poi_content_id+" .introduction").css("opacity",0);
                  }else{
                    $("#"+poi_content_id+" .introduction").removeClass("hidden",1,function(){
                        $("#"+poi_content_id+" .introduction").animate({
                            opacity:1
                        })
                    });
                  }
                console.log(poi_content_id);
            });
            $("body").on("click"," .upmarker-icon",function(){
                let poi = $(this).data("poi");
                $("#recomd-area").append(createDom.recomd_poi_block(poi.name,poi.visit_hour,poi.rating,poi));

            });
            $("#login").click(function(){
                let account:string = <string>$("#account").val();
                let password:string = <string>$("#password").val();
                let data:any={
                    account:account,
                    password:password
                }
                ajax.login(maptool,data);
                // ajax.test();
            })
        });
        $("#userPath").hover(function(){
            $("#userPath").toggleClass("active");
            $(".userPath-area").toggleClass("hidden");
        })
        $("#loginBtn").click(function(){
            domEvent.login_area_hide();
        })
        $("#logoutBtn").click(function(){
            ajax.logout(maptool);
        })
        $(".userPath-area").on("click"," .path",function(){
            console.log("顯示旅遊紀錄");
            let index = $(this).data("index");
            let Result = domEvent.userPath[parseInt(index)].Result;
            console.log(Result);
            createDom.displayPath(Result,maptool);
        })

    }
    static active_svg:string="datetime";
    
    static area_map:any={
        "datetime":{
            open:["basic-area"],
            close:["basic-area"]
        },
        "poi":{
            open:["poi-area"],
            close:["poi-area"]
        },
        "gear":{
            open:["satf-area"],
            close:["satf-area"]
        },
        "note":{
            open:["route-area"],
            close:["route-area","recomd-area","delete-area"],
        },
        "analysis":{
            open:["analysis-area"],
            close:["analysis-area"]
        }
    };
    static addSvgEvent(id:string,maptool?:mapTool):void{
        // console.log($("#datetime").attr("id"));
        // console.log($("#datetime").get(0).tagName); 
        if(id=="datetime"){
            $("#datetime").click(function(){
                domEvent.active("datetime");
                console.log(domEvent.active_svg);
            });
        }
        if(id=="poi"){
            $("#poi").click(function(){
                domEvent.active("poi");
                console.log(domEvent.active_svg);
            });
        }
        if(id=="gear"){
            $("#gear").click(function(){
                domEvent.active("gear");
                console.log(domEvent.active_svg);
                
                let slider_attracion_value = (<roundSlider>$('#slider-attracion')).roundSlider('getValue');
                (<roundSlider>$('#slider-attracion')).roundSlider('setValue', 0);
                (<roundSlider>$('#slider-attracion')).roundSlider('setValue', slider_attracion_value);
                
                let slider_distance_value = (<roundSlider>$('#slider-distance')).roundSlider('getValue');
                (<roundSlider>$('#slider-distance')).roundSlider('setValue', 0);
                (<roundSlider>$('#slider-distance')).roundSlider('setValue', slider_distance_value);

                let slider_traveltime_value = (<roundSlider>$('#slider-traveltime')).roundSlider('getValue');
                (<roundSlider>$('#slider-traveltime')).roundSlider('setValue', 0);
                (<roundSlider>$('#slider-traveltime')).roundSlider('setValue', slider_traveltime_value);
            });

        }
        if(id=="note"){
            $("#note").click(function(){
                domEvent.active("note");
                console.log(domEvent.active_svg);
            });
        }
        if(id=="analysis"){
            $("#analysis").click(function(){
                domEvent.active("analysis");
                console.log(domEvent.active_svg);
            });
        }
        if(id=="pencil"){
            $("#pencil").click(function(){
                let disabled = $("#show_path").sortable( "option", "disabled" );
                if(disabled){
                    domEvent.editOpen();
                }else{
                    domEvent.editClose();
                }
            });
        }
        if(id=="explore"){
            $("#explore").click(function(){
                domEvent.clearRecomd();
                let start_id: string="";
                let destination_id: string ="";
                if($('.mobile-poi').css("display")=="block"){
                    start_id = <string>$("#start_id_mobile").children(":selected").attr("id");
                    destination_id = <string>$("#destination_id_mobile").children(":selected").attr("id");
                }
                if($('.pc-poi').css("display")=="block"){
                    start_id = <string>$(`option:contains("${$("#start_id_pc").val()}")`).attr("id");
                    destination_id = <string>$(`option:contains("${$("#destination_id_pc").val()}")`).attr("id");
                }
                let maxDistance:number = 3000;//m    
                let notInIds:Array<string>=[];
                $("#show_path .time-poi-block").each(function() {
                    notInIds.push($(this).attr("id").slice(0, -1));
                });
                console.log(notInIds);
                let data:any = {
                    start_id:start_id,
                    destination_id:destination_id,
                    maxDistance:maxDistance,
                    notInIds:notInIds
                }
                // $("#random-poi").removeClass("hidden");
                ajax.explore(maptool,data);
            });
        }
        if(id =="runAgain"){
            $("#runAgain").click(function(){
                console.log("runAgain");
                //由search-v3 事件更改
                let start_id: string="";
                let destination_id: string ="";
                // if($('.mobile-poi').css("display")=="block"){
                //     start_id = <string>$("#start_id_mobile").children(":selected").attr("id");
                //     destination_id = <string>$("#destination_id_mobile").children(":selected").attr("id");
                // }
                // if($('.pc-poi').css("display")=="block"){
                //     start_id = <string>$(`option:contains("${$("#start_id_pc").val()}")`).attr("id");
                //     destination_id = <string>$(`option:contains("${$("#destination_id_pc").val()}")`).attr("id");
                // }
                let start_time = new Date(<string>$("#start_time").val());
                let end_time = new Date(<string>$("#end_time").val());
                let depth =  $('#myRange').val();
                let s_attr = (<roundSlider>$('#slider-attracion')).roundSlider('getValue');
                let s_dis = (<roundSlider>$('#slider-distance')).roundSlider('getValue');
                let s_travel = (<roundSlider>$('#slider-traveltime')).roundSlider('getValue');

                let considerMustVisit_order:boolean = true;
                let considerMustNotVist:boolean = true;
                let mustVisit_order:Array<any> = [];//Array of visit_order
                let mustNotVist:Array<string> = [];
                let order:number = 0;
                let valid:boolean = true;
                $("#show_path .time-poi-block , #show_path .recomd-poi-block").each(function(){
                    console.log($(this).data("poi"));
                    let poi = $(this).data("poi");
                    let _id = poi.id;
                    let name = poi.name;
                    let visit_order:any = {
                        _id: _id,
                        order: order
                    }
                    if(order == 0 && _id =="random" || order == parseInt(<string>depth) && _id =="random"){
                        valid=false;
                    }
                    if(order == 0){
                        start_id = _id;
                    }
                    if(order == parseInt(<string>depth)){
                        destination_id = _id;
                    }
                    order+=1;
                    if(_id!="random")
                        mustVisit_order.push(visit_order);
                });
                $("#delete-poi-area .time-poi-block , #delete-area .recomd-poi-block").each(function(){
                    console.log($(this).data("poi"));
                    let poi = $(this).data("poi");
                    let _id = poi.id;
                    let name = poi.name;
                    mustNotVist.push(_id);
                });
                if(order == parseInt(<string>depth)+1){
                    if(valid){
                        console.log(mustVisit_order);
                        console.log(mustNotVist);
                        // console.log(start_id,destination_id);
                        if(mustVisit_order.length==0){
                            considerMustVisit_order = false;
                            mustVisit_order = undefined;//Array of visit_order
                        }
                        if(mustNotVist.length==0){
                            considerMustNotVist = false;
                            mustNotVist =undefined;
                        }
                        let data:any = {
                            start_id:start_id,
                            destination_id:destination_id,
                            start_time:start_time, //0
                            end_time:end_time, //10
                            depth:depth,
                            s_attr:s_attr,
                            s_dis:s_dis,
                            s_travel:s_travel,
                            considerMustVisit_order:considerMustVisit_order,
                            considerMustNotVist:considerMustNotVist,
                            mustVisit_order:mustVisit_order,
                            mustNotVist:mustNotVist,
                        }
                        console.log(data);
                        
                        domEvent.beforeSearch();
                        domEvent.loading();
                        ajax.search_v3(maptool,data);
                        console.log("重新搜尋路線");
                    }else{
                        console.log(mustVisit_order);
                        console.log("起點poi和終點poi不能是random");
                        let title="提示";
                        let describe="起始景點或終點景點不能放入「幫我推薦吧」。";
                        domEvent.showAlert(title,describe);
                    }
                }else{
                    console.log("深度不如預期");
                    let title="提示";
                    let num = parseInt(<string>depth)+1;
                    let describe=`您必須放入${num}個「景點」或是「幫我推薦吧」`;
                    domEvent.showAlert(title,describe);
                }
                
            });
        }
        if(id=="lens"){
            $("#lens").click(function(){
                console.log("lens");
                $(".recomd-area").toggleClass("hidden");
            });
        }
        if(id=="deletePoi"){
            $("#deletePoi").click(function(){
                $(".delete-area").toggleClass("hidden");
            });
        }
        if(id=="mapTool"){
            $("#mapTool").click(function(){
                console.log("mapTool click");
                function toggle(id:string){
                    let obj = $("#"+id);
                    let c = obj.attr("class");
                    let c_array:Array<string> = c.split(" ");
                    let index = c_array.indexOf("hidden");
                    if(index>-1){//mapArea exist
                        obj.attr("class","");
                    }else{
                        obj.attr("class","hidden");
                    }
                }
                toggle("mapArea");
                toggle("mapClear");
                // let mapArea = $("#mapArea");
                // let c = mapArea.attr("class");
                // let c_array:Array<string> = c.split(" ");
                // let index = c_array.indexOf("hidden");
                // if(index>-1){//mapArea exist
                //     mapArea.attr("class","");
                // }else{
                //     mapArea.attr("class","hidden");
                // }

            });
        }
        if(id=="mapArea"){
            $("#mapArea").click(function(){
                mapArea.addMapAreaListenr(maptool);
            });
        }
        if(id=="mapClear"){
            $("#mapClear").click(function(){
                mapArea.cleaMapArea()
            });
        }
        if(id=="save"){
            $("#save").click(function(){
                let pathName = $("#path-name").val();
                console.log(pathName,domEvent.Result);
                let data = {
                    pathName:pathName,
                    Result:JSON.stringify(domEvent.Result)
                }
                ajax.saveRoute(maptool,data);
            });

        }
    }

    static active(id:string):void{
        let c = $(`#${id}`).attr("class");
        // console.log(c);
        let exit:boolean=false;
        let c_array:Array<string> = c.split(" ");
        let index = c_array.indexOf("icon-active");
        if(index>-1){
            exit=true;
        }
        c_array.splice(index, 1);
        if(exit){//close
            $(`#${id}`).attr("class", c_array.join(" "));
            for(let area_id of domEvent.area_map[id].close){
                $(`.${area_id}`).addClass('hidden');
            }
            if(id == domEvent.active_svg){//close last active svg
                domEvent.active_svg = "";
            }
        }else{//open
            c += " icon-active";
            $(`#${id}`).attr("class", c);
            for(let area_id of domEvent.area_map[id].open){
                $(`.${area_id}`).removeClass('hidden');
            }
            if(id != domEvent.active_svg && domEvent.active_svg!=""){//close last active svg
                domEvent.active(domEvent.active_svg);
            }
            domEvent.active_svg = id;
        }
    }
    static addDynamicSvgEvent(id:string):void{
        console.log("addDynamicSvgEvent");
        if($("#"+id).attr("class").indexOf("path-poi")==0){
            console.log("hasClass path-poi");
            $("#"+id).click(function () {
                let loc = $(this).data("loc");
                let icon_color="yellow";
                console.log(loc.lat,loc.lng);
                let marker = domEvent.maptool.addMarker(loc.lat,loc.lng,null,null,icon_color,false,true);
                let t = setTimeout(function(){
                    console.log("remove");
                    marker.setMap(null);
                },400);
            });
        }
    }
    static arrangeRoute():void{
        $("#show_path").sortable({
            connectWith: ".connectedSortable",
            stop: function( event:any, ui:any ) {
                console.log($(ui.item).parent().attr("id"));//放下的位置
                console.log(this);//show_path
                let depth:number = parseInt(<string>$('#myRange').val());
                console.log("depthLimit:",depth)
                if($(ui.item).hasClass("random-poi")){
                    console.log("?");
                    console.log("numberOfPoi:",numberOfPoi());
                    console.log("depth:",depth+1);
                    if($(ui.item).parent().attr("id") == "show_path"){
                        if(numberOfPoi()>depth+1){
                            $(ui.item).remove();
                            console.log("remove");
                        }else{
                            $(ui.item).removeAttr("style");
                            $(ui.item).find(" .editElemt").show();
                        }
                    }
                    if($(ui.item).parent().attr("id") == "recomd-area" ||$(ui.item).parent().attr("id") == "delete-poi-area"){
                        $(this).sortable('cancel');
                        console.log("random 不能放到推薦區和刪除區");
                    }
                }

                //關掉edit
                if($(ui.item).parent().attr("id") == "recomd-area" || $(ui.item).parent().attr("id") == "delete-poi-area") {
                    console.log("close edit");
                    let id = $(ui.item).attr("id");
                    hideEditElemt(id);
                }
            },
            // cancel:".random-poi"
        })
        function showEditElemt(id:string){
            $("#"+id+" .editElemt").show();
        }
        function hideEditElemt(id:string,){
            $("#"+id+" .editElemt").hide();
        }
        $("#recomd-area").sortable({
            connectWith: ".connectedSortable",
            stop: function( event, ui ) {
                let depth:number = parseInt(<string>$('#myRange').val());
                console.log("numberOfPoi:",numberOfPoi());
                console.log("depth:",depth+1);
                if($(ui.item).parent().attr("id") == "recomd-area") {
                    console.log(numberOfPoi());
                    $(this).sortable('cancel');
                    console.log("推薦欄沒有順序性，不開放換位子");
                }
                if($(ui.item).parent().attr("id") == "show_path"){
                    if(numberOfPoi()<=depth+1){
                        let id = $(ui.item).attr("id");
                        showEditElemt(id);
                    }else{
                        console.log("超過景點上限");
                        $(this).sortable('cancel');
                    }
                }
            }
        })
        $("body").on("click",".remove",function(){
            let poiId = $(this).data("poi-id");
            console.log(poiId);
            let clone = $("#"+poiId).clone(true,true);
            console.log(clone);
            $("#"+poiId).hide("fade", function () {
                $("#"+poiId).remove();
                console.log("remove");
                $("#delete-poi-area").append(clone);
                $(clone).find(" .editElemt").hide();
                $("#delete-poi-area").sortable('refresh');
                // hideEditElemt(poiId);
            });
            // $("#recomd-area").append(clone);
            // $("#recomd-area").sortable('refresh');
        });
        $(".random-poi").draggable({
            connectToSortable: "#show_path",
            helper: "clone",
            start: function(event,ui){
                $(ui.helper).find(".random-remove").click(function(){
                        // console.log( $(this));
                        let parent = $(this).parent().parent();//(".random-poi");
                        parent.hide("fade", function () {
                            parent.remove();
                            console.log("remove");
                        });
                        console.log("remove");
                })
            }
        });
        function numberOfPoi():number{
            return $("#show_path .poi-block").length+$("#show_path .random-poi").length;
        }
        $("#delete-poi-area").sortable({
            connectWith: ".connectedSortable",
            stop: function( event, ui ) {
                let depth:number = parseInt(<string>$('#myRange').val());
                console.log("numberOfPoi:",numberOfPoi());
                console.log("depth:",depth+1);
                if($(ui.item).parent().attr("id") == "delete-poi-area") {
                    console.log(numberOfPoi());
                    $(this).sortable('cancel');
                }else if($(ui.item).parent().attr("id") == "show_path"){
                    if(numberOfPoi()<=depth+1){
                        let id = $(ui.item).attr("id");
                        showEditElemt(id);
                    }else{
                        console.log("超過景點上限");
                        $(this).sortable('cancel');
                    }
                }
            }
        })
        //一開始尚未打開編輯模式
        $( "#show_path" ).sortable( "disable" );
        
    }
    static beforeSearch():void{
        domEvent.path_empty(false);
        $("#show_path").addClass("hidden");
    }
    static path_empty(gate:boolean):void{
        if(gate){
            $("#show-path-empty").show();
        }else{
            $("#show-path-empty").hide();
        }
    }
    static clearResult():void{
        domEvent.maptool.clear();
        $("#show_path").empty();
        // $("#recomd-area").empty();
        // $("#random-poi").addClass("hidden");
        domEvent.editClose();
    }
    static clearRecomd():void{
        $("#recomd-area").empty();
    }
    static editOpen():void{
        $( "#show_path" ).sortable( "enable" );
        console.log("enable");
        $("#show_path .time-stamp").hide();
        $("#show_path .duration-time-stamp").hide();
        $("#show_path .path-poi").hide();
        $("#show_path .path-poi-num").hide();
        $("#show_path .editElemt").show();
        $(".path-block").addClass("path-block-edit");
    }
    static editClose():void{
        $( "#show_path" ).sortable( "disable" );
        console.log("disable");
        $("#show_path .time-stamp").show();
        $("#show_path .duration-time-stamp").show();
        $("#show_path .path-poi").show();
        $("#show_path .path-poi-num").show();
        $("#show_path .editElemt").hide();
        $(".path-block").removeClass("path-block-edit");
    }
    static showAlert(title:string,describe:string):void{
        $(".alert-title").text(title);
        $(".alert-describe").text(describe);
        $("#alert-area").removeClass("hidden");
    }
    static gotTo (id:string):void{
        $("#"+id).click();
    }
    static loading(){
        $("#loading").removeClass("hidden");
    }
    static loading_over(){
        // domEvent.clearResult();
        $("#loading").addClass("hidden");
        $("#show_path").removeClass("hidden");
    }
    static login_area_hide(){
        $("#login-area").toggleClass("hidden");
    }
}


