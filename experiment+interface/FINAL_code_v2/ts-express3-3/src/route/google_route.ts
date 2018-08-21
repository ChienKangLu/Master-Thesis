import * as express from 'express';
import * as path from 'path';
import * as https from 'https';
let polyUtil: any = require('polyline-encoded');


let router = express.Router();
router.get('/', async (req, res, next) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    /**
     * Directions API
     * 
     * 兩點之間找route
     * call --> https://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&key=YOUR_API_KEY
     * api key --> AIzaSyBVp3HY509JeYQRkHidsYOgRdNzcqJij8c
     * 官網 --> https://developers.google.com/maps/documentation/directions/intro?hl=zh-tw#GeocodedWaypoints
     * 
     * 兩點之間依序經過途經點
     * https://maps.googleapis.com/maps/api/directions/json?origin=Boston,MA&destination=Concord,MA&waypoints=Charlestown,MA|Lexington,MA&key=YOUR_API_KEY
     * 根據預設，路線規劃服務會依照按指定順序提供的途經地點來計算路線。或者，您可以
     * 傳遞 optimize:true 做為 waypoints 參數內的第一個引數，讓路線規劃服務以最有
     * 效的順序重新安排途經地點，將提供的路線最佳化。（此最佳化是旅行推銷員問題的應
     * 用。）旅行時間是最佳化的主要因素，但在決定最有效的路線時，也會將其他因素（例如
     * 距離、轉彎次數等）納入考量。如果要讓路線規劃服務最佳化路線，所有途經地點都必須是中途停留點。
     */
    let origin:string=req.query.origin;
    let destination:string=req.query.destination;
    let waypoints:string=req.query.waypoints;
    let API_KEY:string = "AIzaSyBVp3HY509JeYQRkHidsYOgRdNzcqJij8c";
    let http_str = `https://maps.googleapis.com/maps/api/directions/json?`;
    http_str += `origin=${origin}&`;//24.748622,121.7821319
    http_str += `destination=${destination}&`;//24.71721,121.82701
    http_str += `waypoints=${waypoints}&`//24.7402126,121.7806237|24.7267703,121.8066301
    http_str += `key=${API_KEY}`;

    https.get(http_str, (resp) => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });
       
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            
            let encoded:string = JSON.parse(data).routes[0].overview_polyline.points;
            var latlngs = polyUtil.decode(encoded);
            // console.log(latlngs);
            console.log(`google_route.ts:get a lot of latlngs`)
            res.json({
                message: latlngs
            });
            // res.end(data)

        });
       
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
    console.log("good job");
    res.end;

});

export default router;