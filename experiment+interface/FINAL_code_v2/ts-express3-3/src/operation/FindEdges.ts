import {DBAsync} from '../database/DBAsync';

export class FindEdges{
    static async find(dbName:string,collName:string,smaller:number,larger:number) {
        let db=await DBAsync.connectDBAsync(dbName);//poitest/finaldata
        let coll=await DBAsync.coll(db,collName);//poi/POI_all
        let edges=await DBAsync.find(coll, {$and:[{except:{ $gte : larger}},{except:{ $lte : smaller }}]}, {});
        // console.log( {$and:[{except:{ $gte : larger}},{except:{ $lte : smaller }}]});
        console.log(`larger:${larger}`);
        console.log(`smaller:${smaller}`);
        // let edges=await DBAsync.find(coll, {}, {});
        await DBAsync.closeDB();
        return edges;
    }
}