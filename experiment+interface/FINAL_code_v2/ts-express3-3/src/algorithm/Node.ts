import Vector from '../algorithm/Vector';
import POI from '../algorithm/POI';
import POImap from '../algorithm/POImap';
import Time from '../algorithm/Time';
import {weekTime,dayTime,timeStatus,timeString,detail} from '../algorithm/record';
import Astar from '../algorithm/Astar';
import Tool from '../algorithm/Tool';
//checked 2018/1/10

class Node{
    g:Vector;
    h:Vector;
    f:Vector;
    parent:Node;
    depth:number;
    index:number;
    poi:POI;
    serial_number:number;

    //dynamic variable
    arrive_time:Time;
    depart_time:Time;
    extra_time:number;
    correctTimestatus:timeStatus;
    travelFromPrevious:number;//for client showing data (millionseconds)
    disFromPrevious:number;//for client showing data (millionseconds)
    real_distance:boolean=true;
    real_traveltime:boolean=true;
    waitTime:detail;//for client showing data (millionseconds)
        
    //index
    static readonly index_attraction:number=0;
    static readonly index_travelTime:number=1;
    static readonly index_distance:number=2;
    static readonly index_edgeExcept:number=3;//2018_5_17
    static readonly index_num=4;//2018_5_17
    static readonly index_string:Array<string>=["attraction","time","distance","edgeExcept"];//2018_5_17
    
    constructor(depth?:number,index?:number,poi?:POI){
        if(depth!=null&&index!=null&&poi!=null){
            this.depth=depth;
            this.index=index;
            //this.poi=poi.copy();//very important!
            this.poi=poi;//used as reference
            this.initial();
        }else{
            //empty Node for minHeap array[0]
        }
    }
    copy(depth:number,index:number):Node{
        let CopyNode:Node= new Node(depth,index,this.poi);
        CopyNode.g=CopyNode.g.copy();
        CopyNode.h=CopyNode.h.copy();
        CopyNode.f=CopyNode.f.copy();
        return CopyNode;
    }

    equals(node:Node):boolean{
        if(node!=null){
            if(node.hashCode()==this.hashCode()){
                return true;
            }
        }else{
            console.log(`This node does not exit,so it can not get Name`);
        }
        return false;
    }
    /**
     * Give initial value to g,h,f
     * g-->MAX
     * h-->0
     * f-->MAX
     */
    initial():void{
        let gData:Array<number>=[];
        let hData:Array<number>=[];
        let fData:Array<number>=[];
        for(let i=0;i<Vector.dim;i++){
            gData[i]=Number.MAX_SAFE_INTEGER;
            hData[i]=0;
            fData[i]=Number.MAX_SAFE_INTEGER;
        }
        this.g=new Vector(gData);
        this.h=new Vector(hData);
        this.f=new Vector(fData);
    }
    toString():string{
        /*
        return `${this.poi.name}(g:${this.g},h:${this.h},f:${this.f})`;
        */
        let s:string="";
        s+=`${this.poi.name},(${this.poi.global_attraction}),${this.depth},${this.g.toString()},${this.h.toString()},${this.f.toString()}`
        // s+=`${this.h.toString()}`;
        // s+=`,${this.poi.name}(${this.depth}`;
        // if(this.parent!=null)
        //     s+=`,${this.parent.poi.name}(${this.parent.h.toString()},${this.parent.depth},${this.parent.poi.original_global_attaction}))`;
        // else{
        //     s+=`,null)`;
        // }
        return s;
    }
    hashCode():string{
        let code:string="";
        let now:Node=this;
        while(now!=null){
            code+=now.depth+""+now.index;
            now=now.parent;
        }
        return code;
    }
    //contain parent and self
    getPathParent():Array<string>{
        let now:Node=this;
        let pathParent:Array<string>=[];
        while(now!=null){
            pathParent.push(now.poi._id);
            now=now.parent;
        }
        return pathParent;
    }
    backTrace():string{
        let path:Array<string>=[];
        let now:Node=this;
        while(now!=null){
            path.push(`${now.poi.name}(${now.poi.global_attraction}) `);
            now=now.parent;
        }
        path.reverse();
        return path.toString();
    }
    backTraceNode():Array<Node>{
        let path:Array<Node>=[];
        let now:Node=this;
        while(now!=null){
            path.push(now);
            now=now.parent;
        }
        return path;
    }
    // getRemainingBest(depth:number, depthLimit:number):number{//0 4
    //     let pathParent:Array<string>=this.getPathParent();
    //     let sum_RemainBest=0;
    //     let count:number=0;
    //     for(let sorted_data of POImap.sorted_GlobalAttraction){
    //         if(count == depthLimit-depth){//4
    //             break;
    //         }
    //         if(pathParent.indexOf(sorted_data._id)==-1){
    //             sum_RemainBest+=sorted_data.global_attraction;
    //             count++;
    //         }
    //     }
    //     return sum_RemainBest;
    // }
    getH(destination: Node,depth:number, depthLimit:number,attr_unit_mean:Array<number>,attr_unit_sd:Array<number>): Vector {
        let h_vector: Vector = new Vector();
        let pack:Array<number>=[];
        let attraction: number = 0;
        let distance: number =0;
        let travelTime: number =0;
        let edgeExcept:number =0;//2018_5_17
        //在backward的時候已經處理過user_specify的問題

        if(Vector.attr_position["attraction"]!=undefined)
            if(Astar.constraint.attraction_expect_heuristic){
                attraction = POImap.fc_dict[depth][this.poi._id];
            }else{
                attraction = 0;//best first search(bigger better)
            }

        if(Vector.attr_position["distance"]!=undefined)
            distance = POImap.getPairEdgeDistance(this.poi,destination.poi);
        if(Vector.attr_position["travelTime"]!=undefined)
            travelTime = POImap.getPairEdgeTravelTime(this.poi,destination.poi);
        if(Vector.attr_position["edgeExcept"]!=undefined)//2018_5_17
            edgeExcept = POImap.getPairEdgeExpect(this.poi,destination.poi);//2018_5_17
            

        if(Astar.constraint.user_specify){
            if(Vector.attr_position["distance"]!=undefined)
                distance =  POImap.user_specify(Node.index_distance,distance,attr_unit_mean[Vector.attr_position["distance"]],attr_unit_sd[Vector.attr_position["distance"]]);
            if(Vector.attr_position["travelTime"]!=undefined)
                travelTime =  POImap.user_specify(Node.index_travelTime,travelTime,attr_unit_mean[Vector.attr_position["travelTime"]],attr_unit_sd[Vector.attr_position["travelTime"]]);
            if(Vector.attr_position["edgeExcept"]!=undefined)//2018_5_17
                edgeExcept =  POImap.user_specify(Node.index_edgeExcept,edgeExcept,attr_unit_mean[Vector.attr_position["edgeExcept"]],attr_unit_sd[Vector.attr_position["edgeExcept"]]);//2018_5_17
        
        }
        if(Astar.constraint.distance_heuristic){}else
        {
            distance = 0;
        }
        if(Astar.constraint.travelTime_heuristic){}else
        {
            travelTime = 0;
        }
        if(Astar.constraint.edgeExcept_heuristic){}else//2018_5_17
        {
            edgeExcept = 0;//2018_5_17
        }
        pack=[attraction,travelTime,distance,edgeExcept];//2018_5_17
        
        for (let i = 0; i < Vector.dim; i++) {
            h_vector.data[i] = pack[Vector.orderIndex[i]];
        }
        return h_vector;
    }

    getCost(previos: Node,attr_unit_mean:Array<number>,attr_unit_sd:Array<number>): Vector {

        let cost_vector: Vector = new Vector();
        let pack:Array<number>=[];
        let attraction: number = 0;
        let distance: number =0;
        let travelTime: number =0;
        let edgeExcept:number =0;//2018_5_17

        if(Vector.attr_position["attraction"]!=undefined)
            attraction = this.poi.global_attraction_cost;
        distance = POImap.getPairEdgeDistance(previos.poi,this.poi);
        travelTime = POImap.getPairEdgeTravelTime(previos.poi,this.poi);
        edgeExcept = POImap.getPairEdgeExpect(previos.poi,this.poi);//2018_5_17
        this.travelFromPrevious=travelTime*60*60*1000;
        this.disFromPrevious=distance;
        //更改標記而已，前端呈現使用
        if(POImap.pairEdge[previos.poi._id][this.poi._id].distance==null){
            this.real_distance=false;
        }
        if(POImap.pairEdge[previos.poi._id][this.poi._id].travelTime==null){
            this.real_traveltime=false;
        }

        if(Astar.constraint.user_specify){
            if(Vector.attr_position["attraction"]!=undefined)
                attraction =  POImap.user_specify(Node.index_attraction,attraction,attr_unit_mean[Vector.attr_position["attraction"]],attr_unit_sd[Vector.attr_position["attraction"]]);
            if(Vector.attr_position["distance"]!=undefined)
                distance =  POImap.user_specify(Node.index_distance,distance,attr_unit_mean[Vector.attr_position["distance"]],attr_unit_sd[Vector.attr_position["distance"]]);
            if(Vector.attr_position["travelTime"]!=undefined)
                travelTime =  POImap.user_specify(Node.index_travelTime,travelTime,attr_unit_mean[Vector.attr_position["travelTime"]],attr_unit_sd[Vector.attr_position["travelTime"]]);
            if(Vector.attr_position["edgeExcept"]!=undefined)//2018_5_17
                edgeExcept =  POImap.user_specify(Node.index_edgeExcept,edgeExcept,attr_unit_mean[Vector.attr_position["edgeExcept"]],attr_unit_sd[Vector.attr_position["edgeExcept"]]);//2018_5_17
        }

        pack=[attraction,travelTime,distance,edgeExcept];//2018_5_17

        for (let i = 0; i < Vector.dim; i++) {
            cost_vector.data[i] = pack[Vector.orderIndex[i]];
        }
        return cost_vector;
    }
    getSuccessor(depth:number,depthLimit:number,destination:Node,distanceLimit:boolean,withinDistance:number):Array<Node>{
        let temp:Array<Node>=[];
        if(this.poi._id==destination.poi._id || depth == depthLimit){
            return temp;
        }else if(depth == depthLimit-1){
            temp.push(new Node(depth+1,0,destination.poi));
            return temp;
        }
        let pathPrent:Array<string>=this.getPathParent();
        let index:number=0;
        for(let poi of POImap.pois){
            if(Astar.constraint.km15)
                if(POImap.pairEdge[this.poi._id][poi._id].distance==null){//2018/2/26
                    // Tool.detailmsg(`${this.poi.name}大於15公里或是無法抵達google無法搜尋(龜山島)`);
                    continue;
                }
            let exit:boolean=false;
            for (let parent of pathPrent) {
                if (poi._id==parent){
                    exit=true;
                }
            }

            //2018/2/21 除非深度是倒數最第二層，否則終點不會被加入successor
            if(poi._id==destination.poi._id && depth!=depthLimit-1){
                exit=true;
            }
            if(!exit){
                if(distanceLimit)
                    if(!this.withinCircle(this.poi,poi,withinDistance)){//local search
                        break;
                    }
                temp.push(new Node(depth+1,index,poi));
                index++;
            }
        }
        return temp;
    }

    withinCircle(now:POI,successor:POI,withinDistance:number):boolean{
        if(POImap.pairEdge[now._id][successor._id].distance<=withinDistance)
            return true;
        else
            return false;
    }

    arrive(from?:Node,start_time?:Time){
        if(from==null&&start_time!=null){
            this.arrive_time=start_time.copy();
        }else if(from!=null){
            this.arrive_time=from.depart_time.add(POImap.getPairEdgeTravelTime(from.poi,this.poi),"hour");
        }
    }
    openOrClose():boolean{
        if(this.correctTimestatus!=null)/*時間推移已經完成，最終goal檢查 */
            return true;
        /*consider weekTime [step 1]*/
        //(a)find the nearest timeStatus[this.correctTimestatus]
        let nowWeek:number=this.arrive_time.time.getDay();
        let dayTime:dayTime=this.poi.weekTime[nowWeek];
        this.correctTimestatus=Time.whichTimeStatus(dayTime,this.arrive_time);
        if(this.correctTimestatus!=null)
            return true;
        return false;
        /*consider weekTime [step 1]*/
    }
    updateArriveTime():void{//和動態node有關
        //only Open or Open24hours will come here!! so no need to consider the Closed

        //(b)update the arrive time but Open24hours no need to update the arrive time
        if(this.correctTimestatus.status!="Open24hours"){
            let open:Time=<Time>(<timeString>(<timeStatus>this.correctTimestatus).open).time;
            let arrive_open:number=this.arrive_time.minus(open,false);
            if(arrive_open<0){
                //wait until open
                this.arrive_time=open.copy();
                this.waitTime=Time.millionToDetail(Math.abs(arrive_open));
            }else{
                //generally,the poi is open,just start form original arrive_time
            }
        }
        /*consider weekTime [step 2]*/
    }
    depart():void{
        this.depart_time=this.arrive_time.add(this.poi.stay_time,"hour");
    }
    completeOrNot():boolean{
        /*consider weekTime [step 3]*/
        //need to check whether the depart_time is early than close_time or not, except Open24hours
        if(this.correctTimestatus.status!="Open24hours"){
            let close:Time=<Time>(<timeString>(<timeStatus>this.correctTimestatus).close).time;
            let depart_close:number=this.depart_time.minus(close,false);
            if(depart_close>0){
                //fail to complete visiting because of the close time
                return false;
            }
        }
        return true;
        /*consider weekTime [step 3]*/
    }
    withinTimeBuget(end_time:Time):boolean{
        let depart_end:number=this.depart_time.minus(end_time,false);
            if(depart_end>0){
                return false;
            }
        return true;
    }
    extraTime(end_time:Time){
        this.extra_time = end_time.minus(this.depart_time,false);
    }
    reasonable(destination_poi:POI,end_time:Time,depthLimit:number):boolean{//和靜態POI有關
        /*
            由於根據getSuccessor的定義，終點必為深度depthLimit-1的唯一successor，
            已經抵達此深度的節點必為終點，沒有必要判斷合理性
        */
        if(this.depth!=depthLimit){
            let general_pois_count:number = depthLimit - this.depth - 1;
            let general_visit:number = general_pois_count * 1;//POImap.min_stay_time,1 hr,至少玩一個小時
            let general_travel:number = (general_pois_count+1) * 0;//POImap.min_travel_time,最小的可能性是在旁邊，不用travel
            let general_depart_time:Time = this.depart_time.add(general_visit+general_travel,"hour");

            let simulate_end_node:Node = new Node(-1,-1,destination_poi); 
            //[simulate arrive]
            // simulate_end_node.arrive_time=this.depart_time.add(general_visit+general_travel,"hour");//error
            simulate_end_node.arrive_time=general_depart_time;

            //[simulate openOrClose]
            if (!simulate_end_node.openOrClose()){
                // console.log(general_visit,general_travel,general_depart_time.toString());
                // console.log("openOrClose");
                return false;
            }
            
            //[simulate updateArriveTime]
            simulate_end_node.updateArriveTime();

            //[simulate depart]
            simulate_end_node.depart();//basic
            //[simulate completeOrNot]
            if (!simulate_end_node.completeOrNot()){
                // console.log(general_depart_time.toString());
                // console.log("completeOrNot");
                return false;
            }
            // else{
            //     console.log(simulate_end_node.depart_time.toString());
            // }

            //if "this node" can achieve here, it means that "this node" can pass through "general_pois_count" pois at least.
        }
        return true;
    }
    setSerialNumber(serial_number:number){
        this.serial_number=serial_number;
    }

}
export default Node;