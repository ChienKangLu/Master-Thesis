import {DBAsync} from '../database/DBAsync';

export class SaveRoute{
    static async save(_id:string,data:any) {
        let db=await DBAsync.connectDBAsync("online");//poitest/finaldata
        let coll=await DBAsync.coll(db,"user");//poi/POI_all
        let user=await DBAsync.push_field(coll,_id,"results",data);
        await DBAsync.closeDB();
        return user;
    }
}