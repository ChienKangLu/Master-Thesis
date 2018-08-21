import Node from '../algorithm/Node';
import PriorityQueue from '../algorithm/PriorityQueue';
import Vector from '../algorithm/Vector';
import POImap from '../algorithm/POImap';
import Time from '../algorithm/Time';
import { Result, Path, request, constraint, visit_order, pruned_count } from '../algorithm/record';
import Tool from '../algorithm/Tool';
import MinHeap from '../algorithm/MinHeap';
//checked 2018/1/10
/**
 * 假設vector[attraction,distance,traveltime]
 * 
 * Vector.dim=3
 * 
 * Vector.orderIndex=[0,1,2];
 * 
 */
class Astar {
    openlist:any;
    // openlist:MinHeap;
    // openlist: PriorityQueue;
    closelist: Array<Node> = [];
    start: Node;
    destination: Node;
    depthLimit: number;

    //extra time constraint
    start_time: Time;
    end_time: Time;

    //constraint
    static constraint: constraint;

    //(1)consider visit or not vist
    mustVist: Array<string>;
    mustVisit_order: Array<visit_order>;
    mustNotVist: Array<string>;
    mustNotVisit_order: Array<visit_order>;

    ////for experiment
    timer:boolean=false
    exp_wait:number=0;//millionseconds
    nodeLimit:boolean=false
    nodeLimitNumber:number=0;
    nodeNum:number=0;
    distanceLimit:boolean=false;
    withinDistance:number=0;//km
    
    //for sorting in minheap
    serial_number:number = 0;

    //user specify
    attr_unit_mean:Array<number>;
    attr_unit_sd:Array<number>;

    //tuning
    r:number;
    Result: Result = {};

    pruned_count:pruned_count={
        openOrClose:0,
        completeOrNot:0,
        reasonable:0
    }

    constructor(request: request, constraint: constraint) {
        this.start = new Node(0, 0, POImap.findFromPOImap(request.start_id));
        this.destination = new Node(0, 0, POImap.findFromPOImap(request.destination_id));

        this.depthLimit = request.depthLimit;
        this.start_time = request.start_time;
        this.end_time = request.end_time;

        // POImap.setUp(request.start_time,this.depthLimit,this.start.poi._id,this.destination.poi._id);
        this.startmsg();
        Vector.setOrder(request.orderIndex);
        Vector.setAttr_position();
        this.setConstraint(constraint);
        this.setConstraintDetail(request);
        POImap.setUp(request.start_time,this.depthLimit,this.start.poi._id,this.destination.poi._id,this.attr_unit_mean,this.attr_unit_sd,this.r);

        if(Astar.constraint.structure_minheap)
            this.openlist =new MinHeap();
        if(Astar.constraint.structure_openlist)
            this.openlist = new PriorityQueue();//改成minHeap
        this.setComparator();
        this.ini_pruned_count();
        this.destination.poi.global_attraction_cost=0;//2018/2/21 把終點的cost設為0
    }
    search(): Result {
        Tool.sysmsg('search start');

        let index:number = 1;
        let timer_start: Time = new Time(new Date());
        let timer_now:Time;
        if (!this.validate(this.start, undefined, this.start_time)) {
            Tool.rungmsg(`NOT FOUND ANY PATH AT ROOT(A)`);
            this.endmsg(this.start, this.Result, "NOT FOUND ANY PATH AT ROOT(A)","A");
            return this.Result;
        }
        this.start.g.initial();//set all to zero
        this.start.g = this.start.g.add(this.start.getCost(this.start,this.attr_unit_mean,this.attr_unit_sd))//2018-3-10 加上g的初始(差在attraction cost 不會是0)
        this.start.h = this.start.getH(this.destination,0,this.depthLimit,this.attr_unit_mean,this.attr_unit_sd);
        this.start.f = this.start.g.add(this.start.h);
        this.giveSerialNumber(this.start);
        this.openlist.add(this.start,this.serial_number);
        this.nodeNum++;
        while (!this.openlist.isEmpty()) {
            timer_now = new Time(new Date());
            let now: Node = this.openlist.pop();
            Tool.rungmsg(`index:${index}`);
            index++;
            Tool.rungmsg(`openlist:${this.openlist.toString(false)}`);
            Tool.rungmsg(`depth:${now.depth}`);
            Tool.rungmsg(`now:${now.toString()}`);
            if (now.parent != null) {
                Tool.rungmsg(`parent:${now.parent.toString()}`);
                if (now.parent.parent != null)
                    Tool.rungmsg(`parent of parant:${now.parent.parent.toString()}`);
            }
            this.closelist.push(now);
            //測試存在的路徑 start
            // let path: Array<Node> = now.backTraceNode();
            // path.reverse();
            // for(let node of path){
            //     if(node.depth == 1){
            //         let name = node.poi.name;
            //         if(name=="噶瑪蘭大飯店國際渡假村"){
            //             console.log("!!!!!!!!!!!!!!!!1",node.poi.name);
            //         }
            //     }
            // }
            //測試存在的路徑 end
            if (this.goal(now, now.depth)) {
                this.endmsg(now, this.Result, "find a path", "good");
                return this.Result;//return true;
            }

            let succesors: Array<Node> = now.getSuccessor(now.depth, this.depthLimit, this.destination, this.distanceLimit, this.withinDistance);
            
            Tool.rungmsg(`successors:${succesors.length}`);
            
            for (let S of succesors) {
                if (!this.validate(S, now, undefined)) {
                    continue;
                }
                let vectorG: Vector = now.g.add(S.getCost(now,this.attr_unit_mean,this.attr_unit_sd));
                let vectorH: Vector = S.getH(this.destination, S.depth, this.depthLimit,this.attr_unit_mean,this.attr_unit_sd);
                let vectorF: Vector = vectorG.add(vectorH);
                S.g = vectorG;
                S.h = vectorH;
                S.f = vectorF;
                S.parent = now;
                
                this.giveSerialNumber(S);
                this.openlist.add(S,this.serial_number);
                this.nodeNum++;
            }
            Tool.rungmsg(`successors reserved:${succesors.length - this.pruned_count.completeOrNot - this.pruned_count.openOrClose - this.pruned_count.reasonable}`);
            // for(let S of succesors){
            //     Tool.rungmsg(S.toString());
            // }
            this.print_pruned_count();
            this.ini_pruned_count();
            
            // if(index>=1)
            //     break;
            
            Tool.rungmsg(`--------------------------------`);
            

            if(this.nodeNum>=this.nodeLimitNumber && this.nodeLimit){
                Tool.rungmsg(`NODENUM MORE THAN ${this.nodeLimitNumber} NODES, NOT FOUND ANY PATH(D)`);
                this.endmsg(now, this.Result, `NODENUM MORE THAN ${this.nodeLimitNumber} NODES, NOT FOUND ANY PATH(D)`,"D");
                return this.Result;
            }
            if (timer_now.minus(timer_start, true) >= this.exp_wait && this.timer) {
                Tool.rungmsg(`EXCEEDING ${this.exp_wait} MILLIONS, NOT FOUND ANY PATH(C)`);
                this.endmsg(now, this.Result, `EXCEEDING ${this.exp_wait} MILLIONS, NOT FOUND ANY PATH(C)`,"C");
                return this.Result;//return false;
            }
        }
        Tool.rungmsg(`NOT FOUND OPTIMAL PATH OPTIMAL(B)`);
        this.endmsg(this.start, this.Result, "NOT FOUND OPTIMAL PATH OPTIMAL(B)","B");
        return this.Result;//return false;
    }
    ini_pruned_count(){
        this.pruned_count.completeOrNot = 0;
        this.pruned_count.openOrClose = 0;
        this.pruned_count.reasonable = 0;
    }
    print_pruned_count(){
        Tool.rungmsg(`[pruning]`);
        Tool.rungmsg(`  --completeOrNot:${this.pruned_count.completeOrNot}`);
        Tool.rungmsg(`  --openOrClose:${this.pruned_count.openOrClose}`);
        Tool.rungmsg(`  --reasonable:${this.pruned_count.reasonable}`);
    }
    validate(now: Node, from?: Node, start_time?: Time): boolean {
        if (now.poi._id == this.start.poi._id)
            from = undefined;
        /*v must be visited at certain depth*/ //2018-7-22 I want to use this function
        if (Astar.constraint.considerMustVisit_order)
            if (!this.consider_Vist_order(now, this.mustVisit_order, true)){
                return false;
            }
        /*must not be visited*/ //2018-7-22 I want to use this function
        if (Astar.constraint.considerMustNotVist)
            if (!this.consider_Vist(now, this.mustNotVist, false))
                return false;

        /*v must not be visited at certain depth*/
        if (Astar.constraint.considerMustNotVisit_order)
            if (!this.consider_Vist_order(now, this.mustNotVisit_order, false))
                return false;
        /*time*/
        if (Astar.constraint.considerWeekTime) {
            now.arrive(from, start_time);
            if (!now.openOrClose()) {//今天是否有適當的營業
                // Tool.detailmsg(`${now.poi.name} -> pruned: because openOrClose`); 
                this.pruned_count.openOrClose++;
                return false;
            }
            now.updateArriveTime();//判斷是否需要更新抵達時間(因為提早到)
            now.depart();
            if (!now.completeOrNot()) {
                // Tool.detailmsg(`${now.poi.name} -> pruned: because completeOrNot`);
                this.pruned_count.completeOrNot++;
                return false;
            }
            if(!now.withinTimeBuget(this.end_time)){//判斷是否在時限之內
                return false;
            }
            now.extraTime(this.end_time);
        }
        if (Astar.constraint.considerReasonable) {
            if (!now.reasonable(this.destination.poi, this.end_time,this.depthLimit)) {
                 Tool.detailmsg(`${now.poi.name} -> pruned: because reasonable`);
                    this.pruned_count.reasonable++;
                return false;
            }
        }
        /*time*/
        return true;
    }
    validate_end(now: Node, from?: Node, start_time?: Time): boolean {
        if (now.poi._id == this.start.poi._id)
            from = undefined;
        /*time*/
        now.arrive(from, start_time);//basic
        if (!now.openOrClose())//今天是否有適當的營業
            return false;
        now.updateArriveTime();//判斷是否需要更新抵達時間(因為提早到)
        now.depart();//basic
        if (!now.completeOrNot())
            return false;
        if(!now.withinTimeBuget(this.end_time))
            return false;
        now.extraTime(this.end_time);
        if (!now.reasonable(this.destination.poi, this.end_time,this.depthLimit)) {
           return false;
       }
        /*time*/
        return true;
    }
    consider_Vist(now: Node, visit_orders: Array<string>, go: boolean): boolean {
        let gate: boolean = false;
        for (let visit_order of visit_orders) {
            if (now.poi._id == visit_order) {
                gate = true;//vist under order
                break;
            }
        }
        if (gate == go) {
            return true;//有達成條件
        } else {
            return false;//沒達成條件,不加入openlist
        }
    }
    consider_Vist_order(now: Node, visit_orders: Array<visit_order>, go: boolean): boolean {
        let include: boolean = false;
        let gate: boolean = false;
        for (let visit_order of visit_orders) {
            if(now.depth == visit_order.order){
                include=true;
                if (now.poi._id == visit_order._id && now.depth == visit_order.order) {
                    gate = true;//vist under order
                    break;
                }
            }
        }
        if(include == true){
            if (gate == go) {
                return true;//有達成條件
            } else {
                return false;//沒達成條件,不加入openlist
            }
        }else{
            return true;
        }
    }
/*
    comparator_heap(left: Node, right: Node): boolean {
        for (let i = 0; i < Vector.dim; i++) {
            
                // 2018_2_22
                // <=
                // 因為放入minheap的時候，會先把新的node放置在heap tree的最後面，
                // 當旋轉到深度1時，如果當前新的node比跟舊的node一樣小，視為新的更小於舊的!
                // 不然早就找到的答案會被埋在後面
                // (跟heap 有關的comparator需要做調整)

                // 2018_3_18
                // <
                // 以舊的為優先
            
            if (left.f.data[i] <= right.f.data[i]) { 
                return true;
            }else{
                return false;
            }
        }
        return false;
    }
*/
    comparator_heap(left: Node, right: Node): boolean {
        for (let i = 0; i < Vector.dim; i++) {
            if (left.f.data[i] == right.f.data[i]) {
                if(left.serial_number < right.serial_number){
                    return true; // swap left small than right
                }
                return false;
            }else if(left.f.data[i] < right.f.data[i]){
                    return true; // swap left small than right
            }else{
                return false;
            }
        }
        // if (left.num == right.num) {
        //     if(left.idx < right.idx){
        //         return true; // swap left small than right
        //     }
        //     return false;
        // }else if(left.num < right.num){
        //     return true;// swap left small than right
        // }else{
        //     return false;
        // }
        return false;
    }
    comparator_heap_normalize(left: Node, right: Node): boolean {
        let left_normal_f:Vector = MinHeap.normalize(left);
        let right_normal_f:Vector = MinHeap.normalize(right);
        
        let compare:Vector=left_normal_f.minus(right_normal_f);
        let compate_sum:number=0;
        for (let i = 0; i < Vector.dim; i++) {
            compate_sum+=compare.data[i];
        }
        if(compate_sum<0){
            return true;
        }else if(compate_sum>0){
            return false;
        }else if(compate_sum == 0){
            if(left.serial_number < right.serial_number){
                return true; // swap left small than right
            }
        }
        return false;
    }
    
    comparator_heap_normalize_gaussian(left: Node, right: Node): boolean {
        let left_normal_f:Vector = MinHeap.normaliz_Gaussion(left);
        let right_normal_f:Vector = MinHeap.normaliz_Gaussion(right);
        
        let compare:Vector=left_normal_f.minus(right_normal_f);
        //trade off
        // let trade_off:Vector=new Vector([0.5,0.5]);
        // compare=compare.mutiple_wise(trade_off);
        //trade off    
        let compate_sum:number=0;
        for (let i = 0; i < Vector.dim; i++) {
            compate_sum+=compare.data[i];
        }
        if(compate_sum<0){
            return true;
        }else if(compate_sum>0){
            return false;
        }
        return false;
    }    
    comparater_heap_sigmoid(left: Node, right: Node): boolean {
        let left_normal_f:Vector = MinHeap.sigmoid(left);
        let right_normal_f:Vector = MinHeap.sigmoid(right);
        let compare:Vector=left_normal_f.minus(right_normal_f);
        let compare_sum:number=0;
        for (let i = 0; i < Vector.dim; i++) {
            compare_sum+=compare.data[i];
        }
        if(compare_sum==0){
            if(left.serial_number < right.serial_number){
                return true; // swap left small than right
            }
            return false;
        }
        if(compare_sum<0){
            return true;
        }else if(compare_sum>0){
            return false;
        }
        return false;
    }
    comparater_heap_normal_sigmoid(left: Node, right: Node): boolean {
        let left_normal_f:Vector = MinHeap.sigmoid_normal(left);
        let right_normal_f:Vector = MinHeap.sigmoid_normal(right);
        let compare:Vector=left_normal_f.minus(right_normal_f);
        let compare_sum:number=0;
        for (let i = 0; i < Vector.dim; i++) {
            compare_sum+=compare.data[i];
        }
        if(compare_sum==0){
            if(left.serial_number < right.serial_number){
                return true; // swap left small than right
            }
            return false;
        }
        if(compare_sum<0){
            return true;
        }else if(compare_sum>0){
            return false;
        }
        return false;
    }
    comparater_heap_sum(left: Node, right: Node): boolean {
        let sumLeft:number = 0;
        let sumRight:number = 0;
        for (let i = 0; i < Vector.dim; i++) {
            sumLeft+=left.f.data[i];
            sumRight+=right.f.data[i];
        }
        let compare:number = sumLeft-sumRight;

        if(compare==0){
            if(left.serial_number < right.serial_number){
                return true; // swap left small than right
            }
            return false;
        }
        if(compare<0){
            return true; // swap left small than right
        }else if(compare>0){
            return false;
        }
        return false;
    }
    comparator(left: Node, right: Node): number {
        for (let i = 0; i < Vector.dim; i++) {
            if (left.f.data[i] < right.f.data[i]) {
                return 1;
            } else if (left.f.data[i] > right.f.data[i]) {
                return -1;
            }
        }
        return 0;
    }
    goal(now: Node, depth: number): boolean {
        /*must be visited,it should be validated at goal*/
        // this.consider_Vist(now,this.mustVist,true);
        if (Astar.constraint.considerMustVist)
            if (!this.consider_Vist(now, this.mustVist, true))
                return false;
        if (depth == this.depthLimit && now.poi._id == this.destination.poi._id) {  
            let pathNode: Array<Node> = now.backTraceNode();
            pathNode.reverse();
            if (Astar.constraint.validateEnd) {
                /*在goal時才做時間的推移以及最終goal檢查*/
                let parent: Node;
                let child: Node;
                for(let i=0;i<pathNode.length;i++){
                    let node:Node = pathNode[i];
                    parent = node.parent;
                    child = node;
                    if(i==0){
                        if (!this.validate_end(child, parent, this.start_time)) {
                            return false;
                        }
                    }else{
                        if (!this.validate_end(child, parent, undefined)) {
                            return false;
                        }
                    }
                }
                /*在goal時才做時間的推移以及最終goal檢查*/
            }else{
                /*時間推移已經完成，最終goal檢查 */
                for(let i=0;i<pathNode.length;i++){
                    let node:Node = pathNode[i];
                    if (!now.openOrClose())
                        return false;
                    if (!now.completeOrNot())
                        return false;
                    if(!now.withinTimeBuget(this.end_time))
                        return false;
                }
                /*時間推移已經完成，最終goal檢查 */
            }
            return true;
        }
        return false;
    }

    startmsg(): void {
        Tool.datanmsg(`start_time:${this.start_time.toString()}`);
        Tool.datanmsg(`end_time:${this.end_time.toString()}`);
        Tool.datanmsg(`start:${this.start.poi.name}`);
        Tool.datanmsg(`destination:${this.destination.poi.name}`);
        Tool.datanmsg(`depthLimit:${this.depthLimit}`);
    }
    endmsg(now: Node, Result: Result, description:string, type:string): void {
        /**
         * type:["good","A","B","C","D"]
         * "good": find a path
         * "A": NOT FOUND ANY PATH AT ROOT(A)
         * "B": NOT FOUND OPTIMAL PATH OPTIMAL(B)
         * "C": EXCEEDING ? MINUTES, NOT FOUND ANY PATH(C)
         * "D": NODENUM MORE THAN 30000 NODES, NOT FOUND ANY PATH(D)
         */

        Tool.sysmsg(`search over`);
        let pathString:string=now.backTrace();
        Tool.datanmsg(`path:[${pathString}]`);
        let path: Array<Node> = now.backTraceNode();
        path.reverse();

        if(type == "C"){
            this.Result.description = description;
            this.Result.type = type;
            this.Result.path = path;
            return;
        }

        Tool.datanmsg(`g:${now.g}`);
        Tool.datanmsg(`h:${now.h}`);
        Tool.datanmsg(`f:${now.f}`);
        // let totalDistance = this.original(now.g, Node.index_distance);
        // let totalAtraction = this.original(now.g, Node.index_attraction);
        // let totalTravelTime = this.original(now.g, Node.index_travelTime) * 60 * 60 * 1000;//hr-->millionseconds
        let totalDis_Atr_Tra:any=this.totalDis_Atr_Tra(path);
        Tool.datanmsg(`totalDis_Atr_Tra:${JSON.stringify(totalDis_Atr_Tra)}`);
        let totalDistance = totalDis_Atr_Tra.totalDistance;
        let totalAtraction= totalDis_Atr_Tra.totalAtraction;
        let totalTravelTime = totalDis_Atr_Tra.totalTravelTime;
        let trip_Duration = this.start_time.minus(now.depart_time, true);//millionseconds
        let extraTime = path[path.length-1].extra_time;
        let internalAttraction = totalAtraction - path[0].poi.global_attraction-path[path.length-1].poi.global_attraction
        Tool.datanmsg(`internalAttraction:${internalAttraction}`);
        Tool.datanmsg(`trip duration:${JSON.stringify(Time.millionToDetail(trip_Duration))}`);
        Tool.datanmsg(`finish trip time:${now.depart_time.toString()}`);
        Tool.datanmsg(`extra_time:${JSON.stringify(Time.millionToDetail(extraTime))}`);
        Tool.datanmsg(`totalAtraction:${totalAtraction}`);
        Tool.datanmsg(`nodeNum:${this.nodeNum}`);
        this.Result = {
            path: path,//Array<Node>
            start: this.start,//Node
            destination: this.destination,//Node
            start_time: this.start_time,//Time
            end_time: this.end_time,//Time
            finishTime: now.depart_time,//Time
            totalDistance: totalDistance,//km
            totalAttraction: totalAtraction,//number
            totalTravelTime: totalTravelTime,//hr
            depthLimit: this.depthLimit,//number
            trip_Duration: trip_Duration,//millionseconds
            description: description,
            pathString:pathString,
            nodeNum: this.nodeNum,
            extraTime: extraTime,
            internalAttraction: internalAttraction,
            type : type
        };
    }

    original(g: Vector, index: number): number | any {
        let true_index: number = Vector.findIndex(g, index);
        if (true_index != -1)
            if (index == Node.index_attraction)
                return (g.data[true_index] + this.start.poi.global_attraction_cost) * -1 + (this.depthLimit + 1) * POImap.maxGlobalAttraction;
            else
                return g.data[true_index];
        else
            return undefined;
    }
    totalDis_Atr_Tra(path: Array<Node>):any{
        let totalDistance = 0;
        let totalAtraction= 0;
        let totalTravelTime = 0;
        for(let i=0;i<path.length-1;i++){//length=6-->0 1 2 3 4 (5)
            let from =path[i].poi;
            let to =path[i+1].poi;
            totalDistance+=POImap.getPairEdgeDistance(from, to);//POImap.pairEdge[from._id][to._id].distance;
            totalTravelTime+=POImap.getPairEdgeTravelTime(from, to);//POImap.pairEdge[from._id][to._id].travelTime;
            totalAtraction+=from.global_attraction*10;
        }
        totalAtraction+=path[path.length-1].poi.global_attraction*10;
        totalAtraction=totalAtraction/10
        let pack={
            totalDistance:totalDistance,
            totalAtraction:totalAtraction,
            totalTravelTime:totalTravelTime,
        }
        return pack;
    }
    setConstraint(constraint: constraint): void {
        Astar.constraint = constraint;
    }
    setConstraintDetail(request: request):void{
        /*must be visited at certain depth*/
        if (Astar.constraint.considerMustVisit_order)
            this.mustVisit_order=<Array<visit_order>>request.mustVisit_order;
        /*must not be visited*/
        if (Astar.constraint.considerMustNotVist)
            this.mustNotVist=<Array<string>>request.mustNotVist;
        /*must not be visited at certain depth*/
        if (Astar.constraint.considerMustNotVisit_order)
            this.mustNotVisit_order=<Array<visit_order>>request.mustNotVisit_order;
        /*must be visited,it should be validated at goal*/
        if (Astar.constraint.considerMustVist)
            this.mustVist=<Array<string>>request.mustVist;
        
        //for experiment
        if(Astar.constraint.timer){
            this.timer=true;
            this.exp_wait=<number>request.exp_wait;//60*1000
        }
        if(Astar.constraint.nodeLimit){
            this.nodeLimit=true;
            this.nodeLimitNumber=<number>request.nodeLimitNumber;
        }
        if(Astar.constraint.distanceLimit){
            this.distanceLimit=true;
            this.withinDistance=<number>request.withinDistance;
        }
        if(Astar.constraint.user_specify){
            this.attr_unit_mean=request.attr_unit_mean as Array<number>;
            this.attr_unit_sd=request.attr_unit_sd as Array<number>;
            for(let i=0;i<Vector.dim;i++){
                if(Vector.orderIndex[i]==Node.index_attraction){
                    this.attr_unit_mean[i]=POImap.maxGlobalAttraction-this.attr_unit_mean[i];
                    // console.log(POImap.maxGlobalAttraction,JSON.stringify(this.attr_unit_mean));
                }
                // console.log(i,Vector.orderIndex[i]);
            }
        }
        if(Astar.constraint.tuning){
            this.r = request.r;
        }
    }
    setComparator():void{
        if(Astar.constraint.comparator)
            this.openlist.setComparator(this.comparator);
        if(Astar.constraint.comparator_heap)
            this.openlist.setComparator(this.comparator_heap);
        if(Astar.constraint.comparator_heap_normalize_gaussian)
            this.openlist.setComparator(this.comparator_heap_normalize_gaussian);
        if(Astar.constraint.comparater_heap_sigmoid)
            this.openlist.setComparator(this.comparater_heap_sigmoid);
        if(Astar.constraint.comparater_heap_normal_sigmoid)
            this.openlist.setComparator(this.comparater_heap_normal_sigmoid);
        if(Astar.constraint.comparater_heap_sum)
            this.openlist.setComparator(this.comparater_heap_sum);
            
        // this.openlist = new PriorityQueue(this.comparator);//改成minHeap
        // this.openlist =new MinHeap(this.comparator_heap_normalize);
        // this.openlist =new MinHeap(this.comparator_heap);v
        // this.openlist =new MinHeap(this.comparator_heap_normalize_gaussian);
    }
    giveSerialNumber(node:Node){
        node.setSerialNumber(this.serial_number);
        this.serial_number++;
    }

    
}
export default Astar;