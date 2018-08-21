import {DBAsync} from '../database/DBAsync';

export class FindUser{
    static async find(query:any) {
        let db=await DBAsync.connectDBAsync("online");//poitest/finaldata
        let coll=await DBAsync.coll(db,"user");//poi/POI_all
        let user=await DBAsync.find(coll, query, {});
        await DBAsync.closeDB();
        return user;
    }
    static async insert(data:any) {
        let db=await DBAsync.connectDBAsync("online");//poitest/finaldata
        let coll=await DBAsync.coll(db,"user");//poi/POI_all
        await DBAsync.insert(coll,data);
        await DBAsync.closeDB();
    }
    static async findbyId(_id:string){
        let db=await DBAsync.connectDBAsync("online");//poitest/finaldata
        let coll=await DBAsync.coll(db,"user");//poi/POI_all
        let user=await DBAsync.findbyId(coll,_id);
        await DBAsync.closeDB();
        return user;
    }
}