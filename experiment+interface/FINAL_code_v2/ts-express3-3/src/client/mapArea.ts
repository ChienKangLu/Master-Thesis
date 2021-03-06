
class mapArea{
    static mapAreaClickListner:google.maps.MapsEventListener;
    static mapArearClickNum:number = 0;
    static mapAreaFirstPoint:any;
    static mapAreaSecondPoint:any;
    
    static markers:Array<google.maps.Marker>=[];
    static areas:Array<google.maps.Polygon>=[];

    static active():void{        
        console.log("active");
        $("#mapArea .bg").css("fill","#404040");
        $("#mapArea .line polyline").css("stroke","white");
        $("#mapArea .line line").css("stroke","white");
        $("#mapArea .face").css("fill","white");
    }
    static over():void{
        console.log("over");
        $("#mapArea .bg").css("fill","#FFFFFF");
        $("#mapArea .line polyline").css("stroke","#404040");
        $("#mapArea .line line").css("stroke","#404040");
        $("#mapArea .face").css("fill","#404040");
    }
    static addMapAreaListenr(maptool:mapTool){
        mapArea.active();
        mapArea.mapAreaClickListner = maptool.map.addListener("click",(e)=>{
            if(mapArea.mapArearClickNum==0){
                mapArea.mapAreaFirstPoint={
                    lat:e.latLng.lat(),
                    lng:e.latLng.lng()
                };
            }else if(mapArea.mapArearClickNum==1){
                mapArea.mapAreaSecondPoint={
                    lat:e.latLng.lat(),
                    lng:e.latLng.lng()
                };
            }
            let marker = maptool.addMarker(e.latLng.lat(),e.latLng.lng(),null,null,"marker_thumbtack");
            mapArea.markers.push(marker);
            console.log(e.latLng.lat(),e.latLng.lng());
            mapArea.mapArearClickNum+=1;
            if(mapArea.mapArearClickNum==2){
                console.log("mapArea已經再map上放上兩的座標點嚕~移除mapAreaClickListner");
                google.maps.event.removeListener(mapArea.mapAreaClickListner);
                mapArea.over();
                let areaData= maptool.drawArea(mapArea.mapAreaFirstPoint,mapArea.mapAreaSecondPoint,null,"red"); // mapArea.areaCoords(mapArea.mapAreaFirstPoint,mapArea.mapAreaSecondPoint); 
                let area= areaData.area;
                let areaCoords =areaData.areaCoords ;
                let areaCoordsArray = [];
                for(let areaCoord of areaCoords){
                    areaCoordsArray.push([areaCoord.lng,areaCoord.lat]);
                }
                console.log(areaCoordsArray);
                mapArea.mapArearClickNum=0;
                let data:any = {
                    coordinates:areaCoordsArray,
                    color:"yellow"
                }
                mapArea.areas.push(area);
                ajax.findAreaPois(domEvent.maptool,data);
            }
          });

    }
    static areaCoords(ltop:any,rbottom:any):Array<any>{
        let rtop = {
            lat :  ltop.lat,
            lng :  rbottom.lng,
        };
        let lbottom = {
            lat :  rbottom.lat,
            lng :  ltop.lng
        };
    
        // Define the LatLng coordinates for the polygon's path.
        var areaCoords = [
            ltop,
            rtop,
            rbottom,
            lbottom,
            ltop
        ];
        return areaCoords;
    }
    static cleaMapArea(){
        for (let i = 0; i < this.markers.length; i++) {
            mapArea.markers[i].setMap(null);
        }
        for (let i = 0; i < this.areas.length; i++) {
            mapArea.areas[i].setMap(null);
        }
    }
}