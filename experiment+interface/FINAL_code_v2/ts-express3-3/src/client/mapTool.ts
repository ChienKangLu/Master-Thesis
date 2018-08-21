/**
 * google map api
 * https://developers.google.com/maps/documentation/javascript/examples/infowindow-simple?hl=zh-tw
 */
class mapTool{
    map:google.maps.Map;
    markers:Array<google.maps.Marker>=[];
    circles:Array<google.maps.Circle>=[];
    Pathes:Array<google.maps.Polyline>=[];
    areas:Array<google.maps.Polygon>=[];
    icon_url:any={
      // "green":"http://maps.google.com/mapfiles/ms/icons/green-dot.png",
      "green":"public/img/marker_green.svg",
      // "blue":"http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      "blue":"public/img/marker_blue.svg",
      // "red":"http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      "red":"public/img/marker_red.svg",
      // "yellow":"http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
      "yellow":"public/img/marker_yellow.svg",
      "black":"public/img/marker_black.svg",

      "green_small":"public/img/marker_green_small.svg",
      "blue_small":"public/img/marker_blue_small.svg",
      "red_small":"public/img/marker_red_small.svg",
      "yellow_small":"public/img/marker_yellow_small.svg",
      "black_small":"public/img/marker_black_small.svg",
      "marker_recomd_small":"public/img/marker_recomd_small.svg",
      "marker_thumbtack_small":"public/img/marker_thumbtack_small.svg"
    };
    color:any={
      "green":"#00FF66",
      "blue":"#0011FF",
      "red":"#FF0000",
      "yellow":"#DEFF00",
      "black":"#000000",
      "dark-green":"#2d5c29"

    }

    constructor(){
    }
    initMap(clickable:boolean):void{
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat:24.721234, lng:121.517273}, //{lat: 23.5, lng: 121},
        zoom: 11,//8,
        disableDefaultUI: true
      });
      if(clickable){
        this.map.addListener("click",(e)=>{
          this.addMarker(e.latLng.lat(),e.latLng.lng());
          console.log(e.latLng.lat(),e.latLng.lng());
        });
      }
    }
    addMarker(lat:number,lng:number,label?:string,content?:string,icon_color?:string,large_icon?:boolean,noDrop?:boolean):google.maps.Marker{


      let myLatLng = {lat: lat, lng: lng};
      let label_color = "black";
      if(icon_color == "black")
        label_color="white";
      let labelPoint:google.maps.Point;
      if(!large_icon){
        icon_color+="_small";
        labelPoint = new google.maps.Point(11,13);
      }else{
        labelPoint = new google.maps.Point(21,22)
      }
  
      let marker = new google.maps.Marker({
        position: myLatLng,
        map: this.map
        // ,
        // icon : {
        //   url:this.icon_url[icon_color],
        //   labelOrigin: new google.maps.Point(20,-10)
        // }
      });
      if(!noDrop){
        marker.setAnimation(google.maps.Animation.DROP);
      }
      if(label !=null){
        marker.setLabel({
            text:label,
            color:label_color,
            fontSize: "8px"
          });
      }
      if(icon_color!=null){
        marker.setIcon({
            url:this.icon_url[icon_color],
            labelOrigin: labelPoint,
          });
      }
      if(content!=null){
        let contentString:string=content;
        let infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        marker.addListener('click', ()=>{
          infowindow.open( this.map, marker);
        });
      }
      this.markers.push(marker);
      return marker;
    }
    addMarkerContent(lat:number,lng:number,content:string,color_str:string):google.maps.Marker{

      let contentString:string=content;
      let infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      let myLatLng = {lat: lat, lng: lng};
      let marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: myLatLng,
        map: this.map,
        icon: this.icon_url[color_str]
      });
      marker.addListener('click', ()=>{
        infowindow.open( this.map, marker);
      });
      this.markers.push(marker);
      return marker;
    }
    addSymbolContent(lat:number,lng:number,content:string):void{
      let contentString:string=content;
      let infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      let myLatLng = {lat: lat, lng: lng};
      let marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: myLatLng,
        map: this.map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 5
        }
      });
      marker.addListener('click', ()=>{
        infowindow.open( this.map, marker);
      });
      this.markers.push(marker);
    }
    addCircle(lat:number,lng:number,meter:number):void{
      let circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: this.map,
        center: {lat: lat, lng: lng},
        radius: meter
      });
      this.circles.push(circle);
    }
    
    drawPath(Coordinates:Array<any>,arrow?:boolean,edge_color?:string){
      // let flightPlanCoordinates = [
      //   {lat: 37.772, lng: -122.214},
      //   {lat: 21.291, lng: -157.821},
      //   {lat: -18.142, lng: 178.431},
      //   {lat: -27.467, lng: 153.027}
      // ];

      let detail:any={
        path: Coordinates,
        geodesic: true,
        // strokeColor: '#FF0000',
        strokeOpacity: 0.7,
        strokeWeight: 4//,        
        //  icons: [{
        //   icon: lineSymbol,
        //   offset: '100%'
        // }]
      }
      if(edge_color!=null){
        detail.strokeColor = this.color[edge_color]
      }
      if(arrow){
        let lineSymbol = {
          path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
        };
        detail.icons=[{
            icon: lineSymbol,
            offset: '100%'
        }]
      }
      let Path = new google.maps.Polyline(detail);
      
      Path.setMap(this.map);
      this.Pathes.push(Path);
    }
    drawPair(Coordinates:Array<any>):void{
      let Path = new google.maps.Polyline({
        path: Coordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 4//,
        //  icons: [{
        //   icon: lineSymbol,
        //   offset: '100%'
        // }]
      });
      Path.setMap(this.map);
      this.Pathes.push(Path);
    }
    deleteAllMarkers():void{
      for (let i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(null);
      }
    }
    deleteAllCircle():void{
      for (let i = 0; i < this.circles.length; i++) {
          this.circles[i].setMap(null);
      }
    }
    deleteAllPathes():void{
      for (let i = 0; i < this.Pathes.length; i++) {
          this.Pathes[i].setMap(null);
      }
    }
    deleteAllAreas():void{
      for (let i = 0; i < this.areas.length; i++) {
          this.areas[i].setMap(null);
      }
    }
    center(lat:number,lng:number):void{
      let myLatLng = {lat: lat, lng: lng};
      this.map.panTo(myLatLng);
      this.map.setCenter(new google.maps.LatLng(lat, lng));
      this.map.setZoom(12);//8//9//11
    }
    drawArea(ltop:any,rbottom:any,area_color?:string,fill_color?:string){
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
      console.log(areaCoords);
      // Construct the polygon.
      let polygon:any = {
        paths: areaCoords,
      }
      if(area_color){
        polygon.strokeColor = this.color[area_color],
        polygon.strokeOpacity = 0.8,
        polygon.strokeWeight = 2
      }else{
        polygon.strokeWeight = 0;
      }
      if(fill_color){
        polygon.fillColor = this.color[fill_color],
        polygon.fillOpacity = 0.35
      }
      var area = new google.maps.Polygon(polygon);
      area.setMap(this.map);
      this.areas.push(area);
      let areaData = {
        area:area,
        areaCoords:areaCoords
      }
      return areaData;
    }
    clear(){
      this.deleteAllMarkers();
      this.deleteAllPathes();
      this.deleteAllCircle();
      this.deleteAllAreas();
    }

    // clearByLatLng(lat:number,lng:number):void{
    //   for (let i = 0; i < this.markers.length; i++) {

    //       this.markers[i].setMap(null);
    //   }
    // }
}