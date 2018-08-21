import {DBAsync} from '../database/DBAsync';

export class FindVD{
    static async find() {
        let db=await DBAsync.connectDBAsync("chapter7");//poitest/finaldata
        let coll=await DBAsync.coll(db,"VD_12");//poi/POI_all
        let VD=await DBAsync.find(coll, {}, {});
        await DBAsync.closeDB();
        return VD;
    }
}