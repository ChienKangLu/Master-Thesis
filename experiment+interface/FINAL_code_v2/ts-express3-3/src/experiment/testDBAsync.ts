import {DBAsync} from '../database/DBAsync';
// async function data() {
//     let db=await DBAsync.connectDBAsync("poitest");
//     let coll=await DBAsync.coll(db,"poi");
//     let data=await DBAsync.find(coll, {}, {});
//     await DBAsync.closeDB();
//     return data;
// }
// data();
async function a(){
    let db=await DBAsync.connectDBAsync("ttt");
        let coll=await DBAsync.coll(db,"yy");
        let exp:any={
            "path":[
                {"poi":{
                    "weekTime" : [ 
                        [ 
                            {
                                "status" : "Open24hours"
                            }
                        ], 
                        [ 
                            {
                                "status" : "Open24hours"
                            }
                        ], 
                        [ 
                            {
                                "status" : "Open24hours"
                            }
                        ], 
                        [ 
                            {
                                "status" : "Open24hours"
                            }
                        ], 
                        [ 
                            {
                                "status" : "Open24hours"
                            }
                        ], 
                        [ 
                            {
                                "status" : "Open24hours"
                            }
                        ], 
                        [ 
                            {
                                "status" : "Open24hours"
                            }
                        ]
                    ],
                    "global_attraction" : 0.9,
                    "original_global_attaction" : 4.1,
                    "name" : "石蓮園有機農場",
                    "_id" : "59e5a92cd63dcb19ac985b08",
                    "lat" : 24.6323268,
                    "lng" : 121.7190571,
                    "stay_time" : "1",
                    "z_global_attraction" : -1.14499699228239
                }
                }
            ]
        }
        await DBAsync.insert(coll,exp);
}
a();