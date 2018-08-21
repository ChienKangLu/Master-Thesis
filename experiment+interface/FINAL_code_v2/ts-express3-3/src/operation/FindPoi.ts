import {DBAsync} from '../database/DBAsync';

export class FindPoi{
    static async find(query:any) {
        let db=await DBAsync.connectDBAsync("finaldata");//poitest/finaldata
        let coll=await DBAsync.coll(db,"POI_all");//poi/POI_all
        let pois=await DBAsync.find(coll, query, {});
        await DBAsync.closeDB();
        return pois
    }
    static async findbyId(_id:string) {
        let db=await DBAsync.connectDBAsync("finaldata");//poitest/finaldata
        let coll=await DBAsync.coll(db,"POI_all");//poi/POI_all
        let pois=await DBAsync.findbyId(coll,_id);
        await DBAsync.closeDB();
        return pois
    }
}