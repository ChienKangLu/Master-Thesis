"use strict";
class mapTool {
    constructor() {
        this.markers = [];
        this.circles = [];
        this.Pathes = [];
        this.areas = [];
        this.icon_url = {
            "green": "public/img/marker_green.svg",
            "blue": "public/img/marker_blue.svg",
            "red": "public/img/marker_red.svg",
            "yellow": "public/img/marker_yellow.svg",
            "black": "public/img/marker_black.svg",
            "green_small": "public/img/marker_green_small.svg",
            "blue_small": "public/img/marker_blue_small.svg",
            "red_small": "public/img/marker_red_small.svg",
            "yellow_small": "public/img/marker_yellow_small.svg",
            "black_small": "public/img/marker_black_small.svg",
            "marker_recomd_small": "public/img/marker_recomd_small.svg",
            "marker_thumbtack_small": "public/img/marker_thumbtack_small.svg"
        };
        this.color = {
            "green": "#00FF66",
            "blue": "#0011FF",
            "red": "#FF0000",
            "yellow": "#DEFF00",
            "black": "#000000",
            "dark-green": "#2d5c29"
        };
    }
    initMap(clickable) {
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 24.721234, lng: 121.517273 },
            zoom: 11,
            disableDefaultUI: true
        });
        if (clickable) {
            this.map.addListener("click", (e) => {
                this.addMarker(e.latLng.lat(), e.latLng.lng());
                console.log(e.latLng.lat(), e.latLng.lng());
            });
        }
    }
    addMarker(lat, lng, label, content, icon_color, large_icon, noDrop) {
        let myLatLng = { lat: lat, lng: lng };
        let label_color = "black";
        if (icon_color == "black")
            label_color = "white";
        let labelPoint;
        if (!large_icon) {
            icon_color += "_small";
            labelPoint = new google.maps.Point(11, 13);
        }
        else {
            labelPoint = new google.maps.Point(21, 22);
        }
        let marker = new google.maps.Marker({
            position: myLatLng,
            map: this.map
        });
        if (!noDrop) {
            marker.setAnimation(google.maps.Animation.DROP);
        }
        if (label != null) {
            marker.setLabel({
                text: label,
                color: label_color,
                fontSize: "8px"
            });
        }
        if (icon_color != null) {
            marker.setIcon({
                url: this.icon_url[icon_color],
                labelOrigin: labelPoint,
            });
        }
        if (content != null) {
            let contentString = content;
            let infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            marker.addListener('click', () => {
                infowindow.open(this.map, marker);
            });
        }
        this.markers.push(marker);
        return marker;
    }
    addMarkerContent(lat, lng, content, color_str) {
        let contentString = content;
        let infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        let myLatLng = { lat: lat, lng: lng };
        let marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            position: myLatLng,
            map: this.map,
            icon: this.icon_url[color_str]
        });
        marker.addListener('click', () => {
            infowindow.open(this.map, marker);
        });
        this.markers.push(marker);
        return marker;
    }
    addSymbolContent(lat, lng, content) {
        let contentString = content;
        let infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        let myLatLng = { lat: lat, lng: lng };
        let marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            position: myLatLng,
            map: this.map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5
            }
        });
        marker.addListener('click', () => {
            infowindow.open(this.map, marker);
        });
        this.markers.push(marker);
    }
    addCircle(lat, lng, meter) {
        let circle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: this.map,
            center: { lat: lat, lng: lng },
            radius: meter
        });
        this.circles.push(circle);
    }
    drawPath(Coordinates, arrow, edge_color) {
        let detail = {
            path: Coordinates,
            geodesic: true,
            strokeOpacity: 0.7,
            strokeWeight: 4
        };
        if (edge_color != null) {
            detail.strokeColor = this.color[edge_color];
        }
        if (arrow) {
            let lineSymbol = {
                path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
            };
            detail.icons = [{
                    icon: lineSymbol,
                    offset: '100%'
                }];
        }
        let Path = new google.maps.Polyline(detail);
        Path.setMap(this.map);
        this.Pathes.push(Path);
    }
    drawPair(Coordinates) {
        let Path = new google.maps.Polyline({
            path: Coordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 4
        });
        Path.setMap(this.map);
        this.Pathes.push(Path);
    }
    deleteAllMarkers() {
        for (let i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
    }
    deleteAllCircle() {
        for (let i = 0; i < this.circles.length; i++) {
            this.circles[i].setMap(null);
        }
    }
    deleteAllPathes() {
        for (let i = 0; i < this.Pathes.length; i++) {
            this.Pathes[i].setMap(null);
        }
    }
    deleteAllAreas() {
        for (let i = 0; i < this.areas.length; i++) {
            this.areas[i].setMap(null);
        }
    }
    center(lat, lng) {
        let myLatLng = { lat: lat, lng: lng };
        this.map.panTo(myLatLng);
        this.map.setCenter(new google.maps.LatLng(lat, lng));
        this.map.setZoom(12);
    }
    drawArea(ltop, rbottom, area_color, fill_color) {
        let rtop = {
            lat: ltop.lat,
            lng: rbottom.lng,
        };
        let lbottom = {
            lat: rbottom.lat,
            lng: ltop.lng
        };
        var areaCoords = [
            ltop,
            rtop,
            rbottom,
            lbottom,
            ltop
        ];
        console.log(areaCoords);
        let polygon = {
            paths: areaCoords,
        };
        if (area_color) {
            polygon.strokeColor = this.color[area_color],
                polygon.strokeOpacity = 0.8,
                polygon.strokeWeight = 2;
        }
        else {
            polygon.strokeWeight = 0;
        }
        if (fill_color) {
            polygon.fillColor = this.color[fill_color],
                polygon.fillOpacity = 0.35;
        }
        var area = new google.maps.Polygon(polygon);
        area.setMap(this.map);
        this.areas.push(area);
        let areaData = {
            area: area,
            areaCoords: areaCoords
        };
        return areaData;
    }
    clear() {
        this.deleteAllMarkers();
        this.deleteAllPathes();
        this.deleteAllCircle();
        this.deleteAllAreas();
    }
}
