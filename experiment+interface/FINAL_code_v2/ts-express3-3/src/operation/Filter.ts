import { DB, pairData } from '../database/DB';
import { filterData } from '../algorithm/record';
export class Filter {
    static DBname: string ="finaldata";//poitest/finaldata
    static POIs: string ="POI_all";//poi/POI_all
    static pairWise: string ="yilanpairwise_all";//pairWise/yilanpairwise/yilanpairwise_all
    static run(query:any,callback: (filterData: filterData) => void): any {
        DB.connectDB(Filter.DBname, (db) => {
            DB.select(db, Filter.POIs, {}, query, (db, items) => {
                //計算直線距離
                // let PairWises = [];
                // for (let from of items) {
                //     for (let to of items) {
                //         let distance = DB.getDistance(from.lat, from.lng, to.lat, to.lng) / 1000;
                //         let velocity: number = 60;
                //         let pairWise: pairData = { from: from._id, to: to._id, distance: distance, travelTime: distance / velocity };
                //         PairWises.push(pairWise);
                //     }
                // }
                // let POIs = items;
                // let filterData: filterData = {
                //     POIs: POIs,
                //     PairWises: PairWises
                // }
                // callback(filterData);

                //直接用資料庫的
                let POIs=items;
                DB.select(db, Filter.pairWise, { from: 1, to: 1, distance: 1, travelTime: 1, lineDistance:1, lineTravelTime:1},{}, (db, items) => {
                    let PairWises=items;
                    let filterData:filterData={
                        POIs:POIs,
                        PairWises:PairWises
                    }
                    callback(filterData);
                });

            });
        });
    }
}