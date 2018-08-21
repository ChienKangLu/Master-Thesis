"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../database/DB");
class Filter {
    static run(query, callback) {
        DB_1.DB.connectDB(Filter.DBname, (db) => {
            DB_1.DB.select(db, Filter.POIs, {}, query, (db, items) => {
                let POIs = items;
                DB_1.DB.select(db, Filter.pairWise, { from: 1, to: 1, distance: 1, travelTime: 1, lineDistance: 1, lineTravelTime: 1 }, {}, (db, items) => {
                    let PairWises = items;
                    let filterData = {
                        POIs: POIs,
                        PairWises: PairWises
                    };
                    callback(filterData);
                });
            });
        });
    }
}
Filter.DBname = "finaldata";
Filter.POIs = "POI_all";
Filter.pairWise = "yilanpairwise_all";
exports.Filter = Filter;
