import Vector from '../algorithm/Vector';
import Node from '../algorithm/Node';
import POI from '../algorithm/POI';
import POImap from '../algorithm/POImap';
import PriorityQueue from '../algorithm/PriorityQueue';
import Astar from '../algorithm/Astar';
import {DB,pairData} from '../database/DB';
import Time from '../algorithm/Time';
import {Result,detail} from '../algorithm/record';
import vzTaiwan from '../preprocess/vzTaiwan';
import {weekTime,dayTime,timeStatus,timeString,request,constraint} from '../algorithm/record';
import Tool from '../algorithm/Tool';

export class Test{
    constructor(){
    }
    run(callback: (Result: Result) => void): void {
        DB.connectDB("poitest",(db) => {
            DB.select(db, `poi`, {},{}, (db, items) => {
                let poi_num: number = 0;
                
                for (let poi of items) {
                    let weekTime: weekTime = vzTaiwan.weekday_textParsing(poi.open_time);
                    let now: POI = new POI(poi.name, poi.rating, poi._id/*, 0*/, poi.lat, poi.lng, poi.stay_time, weekTime);
                    POImap.insertPoi(now);
                    poi_num++;
                }
                Tool.actionmsg('get POIs from mongodb over');
                Tool.datanmsg(`number of poi:${poi_num}`);
                DB.select(db, `pairWise`, { from: 1, to: 1, distance: 1, travelTime: 1 }, {},(db, items) => {
                    let pairWises_num: number = 0;
                    for (let pairWise of items) {
                        POImap.insertPairEdge(pairWise.from, pairWise.to, pairWise.distance, pairWise.travelTime);
                        pairWises_num++;
                    }
                    Tool.actionmsg('get pairWises from mongodb over');
                    Tool.datanmsg(`number of pairWise:${pairWises_num}`);
                    DB.closeDB(db);
                    
                    let request:request={
                        start_time: new Time(undefined, 2017, 10, 30, 8, 0, 0),
                        end_time: new Time(undefined, 2017, 10, 30,22,30,0),
                        start_id: "59cde0b1d63dcb07700d1c39",//香草星空休閒農場
                        destination_id: "59cde0b3d63dcb07700d1c54",//棲蘭森林遊樂區
                        orderIndex: [Node.index_attraction/*,Node.index_distance/*, Node.index_travelTime*/],//priority
                        depthLimit: 10,
                        mustVisit_order:[{_id:"59cde0b3d63dcb07700d1c54",order:10}]//終點是已經決定好的
                        // mustNotVisit_order:[{_id:"59cde0b4d63dcb07700d1c65",order:1}]
                        // mustVist:["59cde0b1d63dcb07700d1c30"]// 太久
                        // mustNotVist:["59cde0b4d63dcb07700d1c65"]

                    }
                    let constraint:constraint={
                        considerWeekTime:true,
                        // considerMustNotVisit_order:true
                        considerMustVisit_order:true
                        // considerMustVist:true// 太久
                        // considerMustNotVist:true
                    }
                    
                    let astar: Astar = new Astar(request,constraint);
                    //---for testing---
                    let run_start: Date = new Date;
                    let Result: Result = astar.search();
                    let run_end: Date = new Date;
                    POImap.clear();//very important, because it is static
                    Vector.clear();
                    Tool.datanmsg(`run time:${JSON.stringify(Time.millionToDetail(run_end.getTime() - run_start.getTime()))}`);
                    Result.excutionTime = run_end.getTime() - run_start.getTime();//millionseconds
                    callback(Result);
                });
            });
        });
    }
    test():void{
        // //test Vector
        // console.log("----test Vector----")
        // Vector.dim=3;
        // let v:Vector =new Vector([1,2,3]);
        // console.log(`v:${v.toString()}`);
        // let vCopy=v.copy();
        // console.log(`v copy:${vCopy.toString()}`);
        // vCopy.data[2]=1;
        // vCopy.data[1]=2;
        // vCopy.data[0]=3;
        // console.log(`v:${v.toString()}`);
        // console.log(`v copy edit:${vCopy.toString()}`);
        // let vAdd=v.add(vCopy);
        // console.log(`v add vCopy:${vAdd.toString()}`);
        // Vector.orderIndex=[0,1,2];
        // let dominate:boolean=v.dominate(vCopy);
        // console.log(`v dominate vCopy:${dominate}`);

        // //test poi
        // console.log("----test POI----")
        // let A:POI=new POI("A",10,"1",0,0,0,1);
        // let B:POI=new POI("B",10,"2",0,0,0,1);
        // let C:POI=new POI("C",10,"3",0,0,0,1);
        // let D:POI=new POI("D",10,"4",0,0,0,1);
        // console.log(`POI A:${A.toString()}`);
        // console.log(`POI B:${B.toString()}`);
        // console.log(`POI C:${C.toString()}`);
        // console.log(`POI D:${D.toString()}`);
        
        // //test POImap
        // console.log("----test POImap----")
        // POImap.clear();
        // POImap.insertPoi(A);
        // POImap.insertPoi(B);
        // POImap.insertPoi(C);
        // POImap.insertPoi(D);
        // let velocity:number=3;//km/hr
        // POImap.insertPairEdge(A._id,B._id,10,10/velocity);
        // POImap.insertPairEdge(A._id,C._id,20,20/velocity);
        // POImap.insertPairEdge(A._id,D._id,30,30/velocity);

        // POImap.insertPairEdge(B._id,A._id,40,40/velocity);
        // POImap.insertPairEdge(B._id,C._id,50,50/velocity);
        // POImap.insertPairEdge(B._id,D._id,60,60/velocity);

        // POImap.insertPairEdge(C._id,A._id,70,70/velocity);
        // POImap.insertPairEdge(C._id,B._id,80,80/velocity);
        // POImap.insertPairEdge(C._id,D._id,90,90/velocity);
        
        // POImap.insertPairEdge(D._id,A._id,100,100/velocity);
        // POImap.insertPairEdge(D._id,B._id,110,110/velocity);
        // POImap.insertPairEdge(D._id,C._id,120,120/velocity);

        // POImap.insertPairEdge(A._id,A._id,0,0);
        // POImap.insertPairEdge(B._id,B._id,0,0);
        // POImap.insertPairEdge(C._id,C._id,0,0);
        // POImap.insertPairEdge(D._id,D._id,0,0);
        
        // console.log("print PairEdge")
        // POImap.printPairEdge();

        // //test Node
        // console.log("----test Node----")
        // let node:Node=new Node(0,0,A);
        // console.log(`node:${node.toString()}`);
        // let nodeCopy:Node=node.copy(1,0);
        // console.log(`nodeCopy:${nodeCopy.toString()}`);
        // nodeCopy.f.data[0]=30;
        // console.log(`node:${node.toString()}`);
        // console.log(`node copy edit:${nodeCopy.toString()}`);
        // let start:Node=new Node(0,0,A);
        // let node1_0:Node=new Node(1,0,B);
        // let node1_1:Node=new Node(1,1,C);
        // node1_0.parent=start;
        // node1_1.parent=start;
        // console.log(`start hashCode:${start.hashCode()}`);
        // console.log(`node1_0 hashCode:${node1_0.hashCode()}`);
        // console.log(`node1_1 hashCode:${node1_1.hashCode()}`);
        // let node1_1_getPathParent:string="";
        // node1_1.getPathParent().forEach(function(element){node1_1_getPathParent+=element+" "});
        // console.log(`node1_1 getPathParent:${node1_1_getPathParent}`);
        // let node1_1_getSuccessor:Array<Node>=node1_1.getSuccessor(2,node1_0);
        // let node1_1_successor:string="";
        // node1_1_getSuccessor.forEach(function(element){node1_1_successor+=element+" "});
        // console.log(`node1_1 successor:${node1_1_successor}`);
        

        // //test PriorityQueue
        // console.log("----test PriorityQueue----")
        // let nodeA:Node=new Node(1,0,A);
        // nodeA.f.data=[1,3,4];
        // let nodeB:Node=new Node(1,1,B);
        // nodeB.f.data=[2,2,5];
        // let nodeC:Node=new Node(1,2,C);
        // nodeC.f.data=[3,1,3];
        
        // let list1:PriorityQueue=new PriorityQueue();
        // Vector.orderIndex=[0,1,2];
        // list1.add(nodeA,this.comparator);
        // list1.add(nodeB,this.comparator);
        // list1.add(nodeC,this.comparator);
        // console.log(`list1([${Vector.orderIndex}]):${list1.toString(true)}`);
        
        // let list2:PriorityQueue=new PriorityQueue();
        // Vector.orderIndex=[2,1,0];
        // list2.add(nodeA,this.comparator);
        // list2.add(nodeB,this.comparator);
        // list2.add(nodeC,this.comparator);
        // console.log(`list2([${Vector.orderIndex}]):${list2.toString(true)}`);
        
        // let list3:PriorityQueue=new PriorityQueue();
        // Vector.orderIndex=[1,0,2];
        // list3.add(nodeA,this.comparator);
        // list3.add(nodeB,this.comparator);
        // list3.add(nodeC,this.comparator);
        // console.log(`list3([${Vector.orderIndex}]):${list3.toString(true)}`);

        // let nodeD:Node=new Node(1,0,A);
        // nodeD.f.data=[1,3,4];
        // let nodeE:Node=new Node(1,1,B);
        // nodeE.f.data=[1,5,6];
        // let nodeF:Node=new Node(1,2,C);
        // nodeF.f.data=[1,5,7];
        // let list4:PriorityQueue=new PriorityQueue();
        // Vector.orderIndex=[0,1,2];
        // list4.add(nodeD,this.comparator);
        // list4.add(nodeE,this.comparator);
        // list4.add(nodeF,this.comparator);
        // console.log(`list4([${Vector.orderIndex}]):${list4.toString(true)}`);
        
        // //test Astar
        // console.log("----test Astar----")
        // let A_:POI=new POI("A_",10,"1",0,0,0,1);
        // let B_:POI=new POI("B_",50,"2",0,0,0,1);
        // let C_:POI=new POI("C_",40,"3",0,0,0,1);
        // let D_:POI=new POI("D_",20,"4",0,0,0,1);
        // console.log(`POI A_:${A_.toString()}`);
        // console.log(`POI B_:${B_.toString()}`);
        // console.log(`POI C_:${C_.toString()}`);
        // console.log(`POI D_:${D_.toString()}`);

        
        // POImap.clear();

        // POImap.insertPoi(A_);
        // POImap.insertPoi(B_);
        // POImap.insertPoi(C_);
        // POImap.insertPoi(D_);

        // let velocity_:number=3;//km/hr
        // POImap.insertPairEdge(A_._id,B_._id,10,10/velocity_);
        // POImap.insertPairEdge(A_._id,C_._id,20,20/velocity_);
        // POImap.insertPairEdge(A_._id,D_._id,30,30/velocity_);

        // POImap.insertPairEdge(B_._id,A_._id,40,40/velocity_);
        // POImap.insertPairEdge(B_._id,C_._id,50,50/velocity_);
        // POImap.insertPairEdge(B_._id,D_._id,60,60/velocity_);

        // POImap.insertPairEdge(C_._id,A_._id,70,70/velocity_);
        // POImap.insertPairEdge(C_._id,B_._id,80,80/velocity_);
        // POImap.insertPairEdge(C_._id,D_._id,90,90/velocity_);
        
        // POImap.insertPairEdge(D_._id,A_._id,100,100/velocity_);
        // POImap.insertPairEdge(D_._id,B_._id,110,110/velocity_);
        // POImap.insertPairEdge(D_._id,C_._id,120,120/velocity_);

        // POImap.insertPairEdge(A_._id,A_._id,0,0);
        // POImap.insertPairEdge(B_._id,B_._id,0,0);
        // POImap.insertPairEdge(C_._id,C_._id,0,0);
        // POImap.insertPairEdge(D_._id,D_._id,0,0);
        
        // console.log(POImap.toString());

        // Vector.dim=3
        // console.log(`Vector dimension:${Vector.dim}`);
        // Vector.orderIndex=[0,1,2];
        // console.log(`Vector orderIndex:${Vector.orderIndex}`);
        // console.log(`POImap maxGlobalAttraction:${Vector.orderIndex,POImap.maxGlobalAttraction}`);
        // console.log(`POImap maxPersonalAttraction:${Vector.orderIndex,POImap.maxPersonalAttraction}`);
        // POImap.reverseAttraction();
        // console.log(`After reverse`);
        // console.log(`POI A_:${A_.toString()}`);
        // console.log(`POI B_:${B_.toString()}`);
        // console.log(`POI C_:${C_.toString()}`);
        // console.log(`POI D_:${D_.toString()}`);
        
        // let start_:Node=new Node(0,0,A_);
        // let destination_:Node=new Node(0,0,D_);
        // let start_time_:Time=new Time(undefined,2017,10,30,8,0,0);
        // let end_time_:Time=new Time(undefined,2017,10,30,20,0,0);;
        // let astar:Astar=new Astar(start_,destination_,2,start_time_,end_time_);
        // astar.search();
    }
    process():void{
        //test MongoDB
        console.log("----test MongoDB + Astar----")
        POImap.clear();
        let insertRun: boolean = false;
        if (insertRun) {
            console.log(`select all poi, and insert pairWise ,velocity is set 70km/hr`);
            DB.connectDB("poitest",(db) => {
                DB.select(db, `poi`, { name: 1, lat: 1, lng: 1 },{}, (db, items) => {
                    let insertObj: Array<pairData> = [];
                    let index: number = 0;
                    for (let from of items) {
                        for (let to of items) {
                            let distance = DB.getDistance(from.lat, from.lng, to.lat, to.lng) / 1000;
                            let velocity: number = 70;
                            let temp: pairData = { from: from._id, to: to._id, distance: distance, travelTime: distance / velocity };
                            insertObj[index] = temp;
                            index++
                        }
                    }
                    DB.insert(db, 'pairWise', insertObj, (db => {
                        DB.closeDB(db);
                    }));
                });
            });
        }

                
        console.log(`select all poi(open_time.weekday_text)`);
        let timeJudge = false;
        if (timeJudge) {
            DB.connectDB("poitest",(db) => {
                DB.select(db, `poi`, { 'open_time.weekday_text': 1 },{}, (db, items) => {
                    let index: number = 0;
                    let stringArray: Array<string> = [];

                    for (let poi of items) {
                        if (poi.open_time != null) {
                            //console.log(poi.open_time.weekday_text);
                            // stringArray[index]=poi.open_time.weekday_text;
                            for (let day of poi.open_time.weekday_text) {
                                let temp: Array<string> = day.split(" ");
                                temp.shift();
                                let saveS: string = "";
                                for (let s of temp) {
                                    saveS += s;
                                }
                                stringArray.push(saveS);
                            }
                            index++;
                        }
                    }
                    // console.log(stringArray.toString());
                    stringArray.sort();
                    for (let s of stringArray) {
                        console.log(s);
                    }
                    console.log(`stringArray length:${stringArray.length}`);
                    console.log(`number of poi not null open_time:${index}/${items.length}`);
                    DB.closeDB(db);
                });
            });
        }

        //test Time
        /*
        console.log("----test Time----")
        let t1:Time=new Time(undefined,2017,10,30,18,20,0);
        console.log(`t1:${t1.toString()}`);
        let copyt1:Time=t1.copy();
        console.log(`ti copy:${copyt1.toString()}`);
        console.log(`copyt1 edit `);
        copyt1.time.setMinutes(50);
        console.log(`t1:${t1.toString()}`);
        console.log(`t1 copy edit:${copyt1.toString()}`);
        let t1Add3hour:Time=t1.add(3,"hour");
        console.log(`t1Add3hour:${t1Add3hour.toString()}`);
        let t1Add30min:Time=t1.add(30,"minute");
        console.log(`t1Add30min:${t1Add30min.toString()}`);
        let t1Add30sec:Time=t1.add(30,"second");
        console.log(`t1Add30sec:${t1Add30sec.toString()}`);
        let duration:number=t1Add30min.minus(t1,true);
        console.log(`t1Add30min-t1:${JSON.stringify(Time.millionToDetail(duration))}`);

    
        // console.log(`copy from add 30 minutes`);
        // copyFrom.add(30,"minute");
        */
        //return this.value+" [Leo dealt with it already]";
    }
    comparator(left:Node,right:Node):number{
        for(let i=0;i<Vector.dim;i++){
            if(left.f.data[Vector.orderIndex[i]]<right.f.data[Vector.orderIndex[i]]){
                //console.log( "comparing " + left.poi.name + ",  " + right.poi.name +"-->"+1);
                return 1;
            }else if(left.f.data[Vector.orderIndex[i]]>right.f.data[Vector.orderIndex[i]]){
                //console.log( "comparing " + left.poi.name + ",  " + right.poi.name +"-->"+-1);
                return -1;
            }
        }
        //console.log( "comparing " + left.poi.name + ",  " + right.poi.name +"-->"+0);
        return 0;
    }
}
