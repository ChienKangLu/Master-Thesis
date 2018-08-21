import Time from '../algorithm/Time';
import Node from '../algorithm/Node';
import POI from '../algorithm/POI';
export interface edgeDictionary {
    [index: string]: edge;
}
export interface edge {
    [index: string]: edgeData;
}
export interface edgeData {
    distance: number;//km
    travelTime: number;//hr
    // z_distance?:number;
    // z_travelTime?:number;
    lineTravelTime?:number;
    lineDistance?:number;
    edgeExcept?:number;//2018_5_17
    // jam_traffic:number;//hr
}
export interface weekTime extends Array<dayTime> {//一~日
    [index: number]: dayTime;
}
export interface dayTime extends Array<timeStatus> {//1,2
    [index: number]: timeStatus;
}
export interface timeStatus {//7:00,AM,–,12:00,PM,,1:00,–,11:00,PM
    status?: string;
    open?: timeString;
    close?: timeString;
}
export interface timeString {
    hour?: number;
    minute?: number;
    stamp?: string;
    time?: Time/**convert hour,minute,stamp to Time */
}
export interface detail {
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
}
export interface Result {
    path?: Path;
    start?: Node;
    destination?: Node;
    start_time?: Time;
    end_time?: Time;
    finishTime?: Time;
    totalDistance?: number;//km
    totalAttraction?: number;
    totalTravelTime?: number;//millionseconds
    excutionTime?: number;//millionseconds
    depthLimit?: number;
    trip_Duration?:number;//millionseconds
    description?:string;
    pathString?:string;
    nodeNum?:number;
    extraTime?:number;
    internalAttraction?:number;
    type?:string;

}
export interface Path extends Array<Node> {
    [index: number]: Node;
}

export interface request {//data
    //basic request
    start_time: Time;
    end_time: Time;
    start_id: string;
    destination_id: string;
    orderIndex: Array<number>;
    depthLimit: number;

    //advanced request
    //(1) visit or not vist
    mustVist?:Array<string>;
    mustVisit_order?:Array<visit_order>;
    mustNotVist?:Array<string>;
    mustNotVisit_order?:Array<visit_order>;

    //for experiment
    exp_wait?:number;
    withinDistance?:number;
    nodeLimitNumber?:number;

    //user specify
    attr_unit_mean?:Array<number>;
    attr_unit_sd?:Array<number>;

    //tuning 
    r?:number;
}
export interface visit_order{
    _id:string;
    order:number;
}
export interface constraint {//boolean gate
    //basic
    considerWeekTime?:boolean;
    considerReasonable?:boolean;
    considerMustVist?:boolean;
    considerMustVisit_order?:boolean;
    considerMustNotVist?:boolean;
    considerMustNotVisit_order?:boolean;
    validateEnd?:boolean;
    
    //for experiment
    timer?:boolean;
    distanceLimit?:boolean;

    // attraction_non_heuristic?:boolean;
    attraction_expect_heuristic?:boolean;
    distance_heuristic?:boolean;
    travelTime_heuristic?:boolean;
    expect_heuristic?:boolean;
    edgeExcept_heuristic?:boolean;//2018_5_17
    structure_openlist?:boolean;
    structure_minheap?:boolean;

    comparator?:boolean;
    comparator_heap?:boolean;
    comparator_heap_normalize_gaussian?:boolean;
    comparater_heap_sigmoid?:boolean;
    comparater_heap_normal_sigmoid?:boolean;
    comparater_heap_sum?:boolean;

    km15?:boolean;
    nodeLimit?:boolean;

    attraction_expect_square?:boolean;
    attraction_expect_square_sign?:boolean;
    attraction_expect_userSpecify?:boolean;
    user_specify?:boolean;
    tuning?:boolean;
}
export interface filterData{
    POIs:Array<any>;
    PairWises:Array<any>
}
export interface sorted_GlobalAttraction_data{
    _id:string;
    original_global_attaction:number;
    global_attraction:number;
}
export interface time_poi_expectation extends Array<poi_expectation>{
    [index: number]: poi_expectation;
}
export interface poi_expectation{
    [key: string]: number;
}
export interface expSetting{
    DBname:string;
    expName:string;
    attribution:Array<number>;
    attraction_heuristic:boolean;
    distance_heuristic:boolean;
    travelTime_heuristic:boolean;
    edgeExcept_heuristic:boolean;
    attraction_expect_type?:string;
    dataStructure:string;
    openlist_comparator:string;
    km15:boolean;
    nodeLimitNumber:number;
    considerWeekTime:boolean;
    considerReasonable:boolean;
    validateEnd:boolean;
    user_specify:boolean;
    //user specify
    attr_unit_mean?:Array<number>;
    attr_unit_sd?:Array<number>;

    //start time and duration
    start_time:number;
    duration:number

    //tuning
    tuning:boolean;
    r?:number;


}
export interface experiment{
    index?:number;
    Result?:Result;
    depth?:number;
    withinDistance?:number;
    expSetting:expSetting;
}
export interface random_pair{
    from_idx:number;
    to_idx:number;
}
export interface testDataNames extends Array<testDataName>{
    [index: number]: testDataName;
}
export interface testDataName{
    index:number,
    startName:string,
    destinationName:string
}
export interface string_number_array{
    [index: string]: number;
}
export interface depth_poi_fc extends Array<poi_fc>{
    [index: number]: poi_fc;
}
export interface poi_fc{
    [key: string]: number;
}
export interface pruned_count{
    openOrClose:number;
    completeOrNot:number;
    reasonable:number;
}
export interface MySession extends Express.Session {
    dbName:Array<string>;
    collName:Array<string>;
    index:Array<number>;
    depth:Array<number>;
}
export interface attr_position{
    [index:string]:number;//[attr_index]:pos
}
export interface introductions{
    [index: string]: string;
}
export interface userSession extends Express.Session {
    _id:string,
    login:boolean,
    name:string
}
// export interface testData_ids extends Array<testData_id>{
//     [index: number]: testData_id;
// }
// export interface testData_id{
//     index:number,
//     start_id:string,
//     destination_id:string
// }