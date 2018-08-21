import {DBAsync} from '../database/DBAsync';
import * as mongodb from 'mongodb';
export class FindPair{
    static async find(pair_from_id:string,pair_to_id:string) {

        let pair_from_o_id = new mongodb.ObjectID(pair_from_id);
        let pair_to_o_id = new mongodb.ObjectID(pair_to_id);
        let query = {
            "$and":[{"from":pair_from_o_id},{"to":pair_to_o_id}]
        }

        let db=await DBAsync.connectDBAsync("finaldata");//poitest/finaldata
        let coll=await DBAsync.coll(db,"yilanpairwise_all");//pairWise/yilanpairwise/yilanpairwise_all
        let pair=await DBAsync.find(coll, query, {});
        await DBAsync.closeDB();
        return pair;
    }
}