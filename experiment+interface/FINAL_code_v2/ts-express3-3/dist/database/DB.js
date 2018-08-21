"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = require("mongodb");
const Tool_1 = require("../algorithm/Tool");
class DB {
    static connectDB(dbname, afterConnext) {
        let MongoClient = mongodb.MongoClient;
        MongoClient.connect("mongodb://localhost:27017/" + dbname, function (err, db) {
            if (err)
                throw err;
            Tool_1.default.sysmsg("mongodb is running!");
            afterConnext(db);
        });
    }
    static select(db, collection, field, query, afterSelect) {
        db.collection(collection, function (err, collection) {
            collection.find(query, field).toArray(function (err, items) {
                if (err)
                    throw err;
                afterSelect(db, items);
            });
        });
    }
    static aggregate(db, collection, field, afterAggregate) {
        db.collection(collection, function (err, collection) {
            collection.aggregate([{ $unwind: `$${field}` }, { "$group": { _id: `$${field}`, count: { $sum: 1 } } }], (err, items) => {
                afterAggregate(db, items);
            });
        });
    }
    static insert(db, collection, data, afterInsert) {
        db.collection(collection, function (err, collection) {
            collection.insertMany(data, function (err, res) {
                if (err)
                    throw err;
                console.log("Number of documents inserted: " + res.insertedCount);
                afterInsert(db);
            });
        });
    }
    static closeDB(db) {
        db.close();
        Tool_1.default.sysmsg("mongodb is closed!");
    }
    static getDistance(lat1, lng1, lat2, lng2) {
        var dis = 0;
        var radLat1 = this.toRadians(lat1);
        var radLat2 = this.toRadians(lat2);
        var deltaLat = radLat1 - radLat2;
        var deltaLng = this.toRadians(lng1) - this.toRadians(lng2);
        var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
        return dis * 6378137;
    }
    static toRadians(d) { return d * Math.PI / 180; }
}
exports.DB = DB;
