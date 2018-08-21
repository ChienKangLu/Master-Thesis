import * as mongodb from 'mongodb';
import Tool from '../algorithm/Tool';

export class DB{
    static connectDB(dbname:string,afterConnext:(db:mongodb.Db)=>void):void{//poitest
        let MongoClient = mongodb.MongoClient;
        // Connect to the db
        MongoClient.connect("mongodb://localhost:27017/"+dbname, function (err, db) {
            if (err) throw err;
            //Write databse Insert/Update/Query code here..
            Tool.sysmsg("mongodb is running!");
            afterConnext(db);
            // db.close(); //關閉連線
        });
    }
    static select(db:mongodb.Db,collection:string,field:any,query:any,afterSelect:(db:mongodb.Db,items:Array<any>)=>void):void{
        db.collection(collection,function(err,collection){
            collection.find(query,field).toArray(function(err,items){
                if(err) throw err;
                afterSelect(db,items);
            });
        });
    }
    static aggregate(db:mongodb.Db,collection:string,field:string,afterAggregate:(db:mongodb.Db,items:Array<any>)=>void):void{
        db.collection(collection,function(err,collection){
            collection.aggregate([{$unwind:`$${field}`},{"$group" : {_id:`$${field}`, count:{$sum:1}}}],(err,items)=>{
                afterAggregate(db,items);
            });
        });
    }

    static insert(db:mongodb.Db,collection:string,data:any,afterInsert:(db:mongodb.Db)=>void):void{
        db.collection(collection, function (err, collection) {
            collection.insertMany(data, function (err, res) {
                if (err) throw err;
                console.log("Number of documents inserted: " + res.insertedCount);
                afterInsert(db);
            });
        });
    }
    static closeDB(db:mongodb.Db):void{
        db.close();
        Tool.sysmsg("mongodb is closed!");
    }
    static getDistance(lat1:number, lng1:number, lat2:number, lng2:number):number { //公尺
        var dis:number = 0;
        var radLat1:number = this.toRadians(lat1);
        var radLat2:number = this.toRadians(lat2);
        var deltaLat:number = radLat1 - radLat2;
        var deltaLng:number = this.toRadians(lng1) - this.toRadians(lng2);
        var dis:number = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
        return dis * 6378137;
    }
    static toRadians(d:number):number {  return d * Math.PI / 180;}
}
export interface pairData {
    from:string;
    to:string;
    distance:number;
    travelTime:number;
}