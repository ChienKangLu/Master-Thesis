import * as mongodb from 'mongodb';
import Tool from '../algorithm/Tool';

export class DBAsync{
    static db:mongodb.Db;
    static async connectDBAsync(dbName:string){
        let MongoClient = mongodb.MongoClient;
        DBAsync.db = await MongoClient.connect(`mongodb://localhost:27017/${dbName}`);
        Tool.sysmsg("mongodb is running!");

        return DBAsync.db;
    }
    static async coll(db:mongodb.Db,collName:string){
        let coll = db.collection(collName);
        return coll;
    }
    static async find(coll:mongodb.Collection,query:any,field:any){
        let data = await coll.find(query,field).toArray();
        return data;
    }
    static async findbyId(coll:mongodb.Collection,_id:string){
        let o_id = new mongodb.ObjectID(_id);
        let data = await coll.find({"_id":o_id}).toArray();
        return data;
    }
    static async insert(coll:mongodb.Collection,data:any){
        await coll.insertOne(data);
    }
    static async insertMany(coll:mongodb.Collection,data:Array<any>){
        await coll.insertMany(data);
    }
    static async create_field(coll:mongodb.Collection,_id:string,data:any){
        let o_id = new mongodb.ObjectID(_id);
        await coll.updateOne({"_id":o_id},{"$set": data});
        // await coll.updateOne({"_id":o_id},{"$set": { "size.uom": "cm"}});
    }
    static async push_field(coll:mongodb.Collection,_id:string,fieldName:string,data:any){
        let o_id = new mongodb.ObjectID(_id);
        await coll.update({"_id":o_id},{"$push":{
                                                    [fieldName]:data
                                                }
                                            });
        // db.getCollection('user').update(
        //     { _id:ObjectId("5b6fd49d96f7c91340948761")}, 
        //     {$push: {results:{}}}
        // )
    }
    static async drop(coll:mongodb.Collection){
        await coll.drop();
    }
    static async closeDB(){
        await DBAsync.db.close();
        Tool.sysmsg("mongodb is closed!");
    }

    // static aggregate(db:mongodb.Db,collection:string,field:string,afterAggregate:(db:mongodb.Db,items:Array<any>)=>void):void{
    //     db.collection(collection,function(err,collection){
    //         collection.aggregate([{$unwind:`$${field}`},{"$group" : {_id:`$${field}`, count:{$sum:1}}}],(err,items)=>{
    //             afterAggregate(db,items);
    //         });
    //     });
    // }

    // static insert(db:mongodb.Db,collection:string,data:any,afterInsert:(db:mongodb.Db)=>void):void{
    //     db.collection(collection, function (err, collection) {
    //         collection.insertMany(data, function (err, res) {
    //             if (err) throw err;
    //             console.log("Number of documents inserted: " + res.insertedCount);
    //             afterInsert(db);
    //         });
    //     });
    // }
}
