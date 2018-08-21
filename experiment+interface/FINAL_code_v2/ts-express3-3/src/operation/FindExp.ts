import {DBAsync} from '../database/DBAsync';
import * as mongodb from 'mongodb';
export class FindExp{
    static async find(dbName:string,collName:string,index:number,depth:number) {
        let query = {
            "$and":[{"index":Number(index)},{"depth":Number(depth)}]
        }
        let db=await DBAsync.connectDBAsync(dbName);//poitest/finaldata
        let coll=await DBAsync.coll(db,collName);//pairWise/yilanpairwise/yilanpairwise_all
        let exp=await DBAsync.find(coll, query, {});
        await DBAsync.closeDB();
        return exp;
    }
}