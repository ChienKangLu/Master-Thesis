import * as mongodb from 'mongodb';
import {DBAsync} from '../database/DBAsync';

export class FindGeometry{
    static async nearSphere(lng:number,lat:number,maxDistance:number,notInIds:Array<string>) {
        let notIn:Array< mongodb.ObjectID>=[];
        for(let notInId of notInIds){
            console.log("notInId:",notInId);
            let o_id = new mongodb.ObjectID(notInId);
            notIn.push(o_id);
        }
        // console.log(notIn);
        let db=await DBAsync.connectDBAsync("explore");//poitest/finaldata
        let coll=await DBAsync.coll(db,"geometry_poi");//poi/POI_all
        let pois=await DBAsync.find(coll, { 
            $and:[
                    {loc:
                        {
                          $nearSphere: {
                             $geometry: {
                                type : "Point",
                                coordinates : [ lng , lat ]
                             },
                             $maxDistance: maxDistance
                          }
                        }
                    },
                    {_id:
                        { 
                            $nin: notIn// [ ObjectId("59e5ab11d63dcb0a30d3afb2"),ObjectId("59e5ab11d63dcb0a30d3afb1"),ObjectId("59e5ab11d63dcb0a30d3afb0")] 
                            }
                    }
                ]
            }, {});
        await DBAsync.closeDB();
        return pois
    }
    static async polygon(coordinates:any){
        /** 
         * [[121.72052007031243,24.7634316818028],[121.84960942578118,24.7634316818028],[121.84960942578118,24.62306393638443],[121.72052007031243,24.62306393638443],[121.72052007031243,24.7634316818028]]
        */
        let db=await DBAsync.connectDBAsync("explore");//poitest/finaldata
        let coll=await DBAsync.coll(db,"geometry_poi");//poi/POI_all
        let pois=await DBAsync.find(coll, {
            loc:{
                $geoWithin:{
                    $polygon : coordinates
                }
            }
            }, {});
        await DBAsync.closeDB();
        return pois
    }
}