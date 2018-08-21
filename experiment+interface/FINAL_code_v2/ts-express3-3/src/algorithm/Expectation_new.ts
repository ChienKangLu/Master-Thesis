import POImap from '../algorithm/POImap';
import Tool from '../algorithm/Tool';
import {string_number_array,poi_fc,depth_poi_fc} from '../algorithm/record';
import {DBAsync} from '../database/DBAsync';
import Astar from './Astar';
import Node from '../algorithm/Node';
import Vector from '../algorithm/Vector';
class Expectation{
    N:number;
    depth_max:number;
    start_id :string;
    destination_id:string;

    id:Array<string> = [];
    name:Array<string> = [];
    id_index:string_number_array ={};//建立id對index的索引
    
    dbName:string="Expectation2";
    saveGate:boolean = false;

    attr_unit_mean:Array<number>=[];
    attr_unit_sd:Array<number>=[];

    fc_dict:depth_poi_fc;
    constructor(N:number,depth_limit: number,start_id: string ,destination_id: string,attr_unit_mean:Array<number>,attr_unit_sd:Array<number>,r:number){
        this.N=N;
        this.depth_max=depth_limit;
        this.start_id=start_id;
        this.destination_id=destination_id;
        if(Astar.constraint.user_specify){
            this.attr_unit_mean= attr_unit_mean;
            this.attr_unit_sd=attr_unit_sd;
        }

        let cs_datas = this.ini_name_id_id_index_c_s();
        let dis = this.ini_dis();
        let mv_datas=this.ini_dis_mean_dis_variance(dis);
        let dis_p = this.ini_dis_m_f_p(dis,mv_datas.dis_mean,mv_datas.dis_variance);
        
        let E_Q = this.create_normal_E(dis_p,cs_datas.s);
        
        if(Astar.constraint.tuning){
            //計算變異數
            let s2 = this.ini_s2(cs_datas.s);
            let E_Q_s2 = this.create_normal_E(dis_p,s2);
            let E_Q_var = this.E_Q_var(E_Q,E_Q_s2);
            //根據r調小經驗值，必須大於0
            this.tuning(E_Q,E_Q_var,r);
            
            this.save("E_Q_s2",null,E_Q_s2);
            this.save("E_Q_var",null,E_Q_var);
            this.save("E_Q_tuning",null,E_Q);
        }else{
            this.save("E_Q",null,E_Q);
        }
        let fc = this.futrue_cost(E_Q);
        let fc_dict = this.fc_dictionary(fc);
        this.fc_dict=fc_dict;
        // this.saveDB();
    }
    create_normal_E(A:Array<Array<number>>,p:Array<number>):Array<Array<number>>{
        let be_datas = this.backward_expectation(A,p);
        let E = be_datas.E;
        let Q = be_datas.Q;
        let E_Q = this.normal_E(E,Q);
        return E_Q;
    }
    E_Q_var(E_Q:Array<Array<number>>,E_Q_s2:Array<Array<number>>):Array<Array<number>>{
        let E_Q_var:Array<Array<number>>=[]; //future cost
        for(let d=0;d<=this.depth_max;d++){
            E_Q_var[d] = [];
            for(let i=0;i<this.N;i++){
                E_Q_var[d][i] = E_Q_s2[d][i] - Math.pow(E_Q[d][i],2);
            }
        }
        return E_Q_var;
    }
    tuning(E_Q:Array<Array<number>>,E_Q_var:Array<Array<number>>,r:number){
        console.log("--Expectation_new.ts -->tuning:",r,"\n");
        for(let d=0;d<=this.depth_max;d++){
            for(let i=0;i<this.N;i++){
                // E_Q[d][i] = E_Q[d][i] - r * E_Q_var[d][i];//r =1 2 3 4 5
                E_Q[d][i] = E_Q[d][i] - r * Math.pow(E_Q_var[d][i],0.5);
                if(E_Q[d][i]<0){
                    console.log(`Expectation_new.ts : E_Q[d][i] 值不得低於0!!請確認!!`,d,i,E_Q[d][i]);
                    E_Q[d][i] = 0;
                }
            }
        }
    }
    ini_name_id_id_index_c_s():{c:Array<number>,s:Array<number>}{
        //1. global_attraction_cost -->satisfied
        //let s_sum:number=0;
        let a: Array<number> = []; //global_attraction 
        let c: Array<number> = []; //global_attraction_cost 
        let s: Array<number> = []; //satisfied 
        for (let i = 0; i < this.N; i++) {
            this.name[i] = POImap.pois[i].name;
            this.id[i] = POImap.pois[i]._id;
            this.id_index[this.id[i]]=i;
            a[i] = POImap.pois[i].global_attraction;
            if(Astar.constraint.user_specify){
                c[i] = POImap.user_specify(Node.index_attraction,POImap.pois[i].global_attraction_cost,this.attr_unit_mean[Vector.attr_position["attraction"]],this.attr_unit_sd[Vector.attr_position["attraction"]]);
            }else
                c[i] = POImap.pois[i].global_attraction_cost;
            s[i] = this.epx_(c[i]);
            //s_sum+=this.s[i];
        }
        return {c:c,s:s};
        //2. satisfied-->satisfied probability
        /*
        for (let i = 0; i < this.N; i++) {
            this.s_p[i] = this.s[i]/s_sum;
        }
        */
    }
    ini_s2(s:Array<number>):Array<number>{
        let s2: Array<number> = []; //global_attraction_cost 
        for (let i = 0; i < this.N; i++) {
            s2[i] = Math.pow(s[i],2);
        }
        return s2;
    }
    /*pairEdge是key->value的資料結構，轉成index形式*/
    ini_dis():Array<Array<number>>{
        let dis:Array<Array<number>>=[];
        for (let from in POImap.pairEdge) {
            let from_idx:number = this.id_index[from];
            dis[from_idx] = [];
            for (let to in POImap.pairEdge[from]) {
                let distance: number = POImap.pairEdge[from][to].distance;//可能有null(15km限制)
                if(distance==null){
                    distance = <number>POImap.pairEdge[from][to].lineDistance;
                }
                let travelTime: number = POImap.pairEdge[from][to].travelTime;//可能有null(15km限制)
                if(travelTime==null){
                    travelTime = <number>POImap.pairEdge[from][to].lineTravelTime;
                }
                let to_idx:number = this.id_index[to];
                dis[from_idx][to_idx] = distance;
            }
        }
        return dis;
    }
    ini_dis_mean_dis_variance(dis:Array<Array<number>>):{"dis_mean":number,"dis_variance":number}{
        let dis_sum:number=0;
        let dis_mean:number=0;
        let dis_variance:number=0;
        for(let i=0;i<this.N;i++){
            for(let j=0;j<this.N;j++){
                dis_sum+=dis[i][j];
            }
        }
        dis_mean=dis_sum/(this.N*this.N);
        for(let i=0;i<this.N;i++){
            for(let j=0;j<this.N;j++){
                dis_variance+=Math.pow(dis[i][j]-dis_mean,2);
            }
        }
        dis_variance=dis_variance/(this.N*this.N);
        return {"dis_mean":dis_mean,"dis_variance":dis_variance}
    }
    ini_dis_m_f_p(dis:Array<Array<number>>,dis_mean:number,dis_variance:number):Array<Array<number>>{
        let start_idx:number = this.id_index[this.start_id];
        let destination_idx:number = this.id_index[this.destination_id];
        let dis_m: Array<Array<number>> = []; //distance approach to mean is better
        let dis_f: Array<Array<number>> = []; //distance feasibility
        let dis_p: Array<Array<number>> = []; //distance probability
        for(let i=0;i<this.N;i++){
            if(i==destination_idx)
                continue;
            dis_m[i]=[];
            dis_f[i]=[];
            dis_p[i]=[];
            let sum_dis_f = 0;
            for(let j=0;j<this.N;j++){
                if(j==start_idx||j==destination_idx)
                    continue;
                if(Astar.constraint.attraction_expect_square)
                    dis_m[i][j] = this.normal_square(dis[i][j],dis_mean,dis_variance);//teacher
                if(Astar.constraint.attraction_expect_square_sign)
                    dis_m[i][j] = this.normal_square_sign(dis[i][j],dis_mean,dis_variance);//me
                if(Astar.constraint.attraction_expect_userSpecify)
                    dis_m[i][j] = this.expect_userSpecify(dis[i][j],this.attr_unit_mean[Vector.attr_position["distance"]],this.attr_unit_sd[Vector.attr_position["distance"]]);//me
                dis_f[i][j]= this.epx_(dis_m[i][j]);
                sum_dis_f+=dis_f[i][j];
            }
            for(let j=0;j<this.N;j++){
                if(j==start_idx||j==destination_idx)
                    continue;
                dis_p[i][j] = dis_f[i][j]/sum_dis_f;
            }
        }
        return dis_p;
    }
    backward_expectation(A:Array<Array<number>>,p:Array<number>):{E:Array<Array<number>>,Q:Array<Array<number>>}{
        let E:Array<Array<number>>=[]; //expectation
        let Q:Array<Array<number>> = [];//path probability
        let start_idx:number = this.id_index[this.start_id];
        let destination_idx:number = this.id_index[this.destination_id];
        for(let d=this.depth_max;d>=0;d--){
            E[d]=[];
            Q[d]=[];
            for(let i=0;i<this.N;i++){
                if(d==this.depth_max){//last
                    E[d][destination_idx]=1;
                    Q[d][destination_idx]=1;
                    break;
                }else if(d==this.depth_max-1){
                    if(i==start_idx||i==destination_idx)
                        continue;
                    E[d][i]=1*p[destination_idx];
                    Q[d][i]=1;
                }else if(d==0){
                    let sum:number=0;
                    let sum_Q:number = 0;
                    for(let j:number=0;j<this.N;j++){
                        if(j==start_idx||j==destination_idx)
                            continue;
                        sum+=A[start_idx][j]*p[j]*E[1][j];
                        sum_Q += A[start_idx][j]*[1][j];
                    }              
                    E[d][start_idx]=sum;
                    Q[d][start_idx]=sum_Q;
                    break;
                }else{//middle
                    if(i==start_idx||i==destination_idx)
                        continue;
                    let sum:number=0;
                    let sum_Q:number = 0;
                    for(let j:number=0;j<this.N;j++){
                        if(j==start_idx||j==destination_idx)
                            continue;
                        sum+=A[i][j]*p[j]*E[d+1][j];
                        sum_Q += A[i][j]*Q[d+1][j];
                    }
                    E[d][i]=sum;
                    Q[d][i]=sum_Q;
                }
            }
        }
        return {"E":E,"Q":Q};
        //print E
        // for(let d=0;d<=this.depth_max;d++){
        //     for(let i=0;i<this.N;i++){
        //         console.log(d,i,this.E[d][i]);                
        //     }
        // }
    }
    /*
        viterbi_expectation(A:Array<Array<number>>,p:Array<number>):void{
            let start_idx:number = this.id_index[this.start_id];
            let destination_idx:number = this.id_index[this.destination_id];
            for(let d=this.depth_max;d>=0;d--){
                this.E[d]=[];
                for(let i=0;i<this.N;i++){
                    if(d==this.depth_max){//last
                        this.E[d][destination_idx]=1;
                        break;
                    }else if(d==this.depth_max-1){
                        if(i==start_idx||i==destination_idx)
                            continue;
                        this.E[d][i]=1*p[destination_idx];;
                    }else if(d==0){
                        let max:number=Number.MIN_VALUE;
                        let max_j_index=-1;
                        for(let j:number=0;j<this.N;j++){
                            if(j==start_idx||j==destination_idx)
                                continue;
                            let w:number = A[start_idx][j]*p[j];
                            if(w>max){
                                max=w;
                                max_j_index = j;
                            }
                            // sum+=A[start_idx][j]*p[j]*this.E[d+1][j];
                        }              
                        this.E[d][start_idx]=max*this.E[1][max_j_index];
                    }else{//middle
                        if(i==start_idx||i==destination_idx)
                            continue;
                        let max:number=Number.MIN_VALUE;
                        let max_j_index=-1;
                        for(let j:number=0;j<this.N;j++){
                            let w:number = A[i][j]*p[j];
                            if(w>max){
                                max=w;
                                max_j_index = j;
                            }
                            // sum+=A[i][j]*p[j]*this.E[d+1][j];
                        }
                        this.E[d][i]=max*this.E[d+1][max_j_index];
                    }
                }
            }
            //print E
            // for(let d=0;d<=this.depth_max;d++){
            //     for(let i=0;i<this.N;i++){
            //         console.log(d,i,this.E[d][i]);                
            //     }
            // }
        }
    */
    normal_E(E:Array<Array<number>>,Q:Array<Array<number>>):Array<Array<number>>{
        let E_Q:Array<Array<number>> = [];//E divided by Q
        for(let d=0;d<=this.depth_max;d++){
            E_Q[d] = [];
            for(let i=0;i<this.N;i++){
                E_Q[d][i]=E[d][i]/Q[d][i];
            }
        }
        return E_Q;
    }
    futrue_cost(E_Q:Array<Array<number>>):Array<Array<number>>{
        let fc:Array<Array<number>>=[]; //future cost
        for(let d=0;d<=this.depth_max;d++){
            fc[d] = [];
            for(let i=0;i<this.N;i++){
                fc[d][i]=this.E2fc(E_Q[d][i]);
            }
        }
        return fc;
    }
    fc_dictionary(fc:Array<Array<number>>): depth_poi_fc {
        let fc_dict:depth_poi_fc = [];
        for(let d=0;d<=this.depth_max;d++){
            let poi_fc:poi_fc = {};
            for(let i=0;i<this.N;i++){
                poi_fc[this.id[i]]=fc[d][i];
            }
            fc_dict[d]=poi_fc;
        }
        return fc_dict;
    }
    epx_(attraction_cost:number):number{
        return Math.exp(-attraction_cost);
    }
    E2fc(E:number):number|any{
        if(E==null)
            return null;
        return -Math.log(E);
    }
    normal_square(x:number,mean:number,variance:number){//teacher
        return (Math.pow(x-mean,2))/(2*variance);
    }
    normal_square_sign(x:number,mean:number,variance:number){//me
        let symbol:number = 1;
        let n:number = x-mean;
        if(n<0)
            symbol=-1;
        return symbol*(Math.pow(x-mean,2))/(2*variance);
    }
    expect_userSpecify(x:number,mean:number,sd:number){
        return (x-mean)/sd;
    }

    async save(collName:string,rawArrayData?:Array<number>,raw2dArrayData?:Array<Array<number>>){
        if(this.saveGate){
            let db=await DBAsync.connectDBAsync(this.dbName);
            let coll=await DBAsync.coll(db,collName);
            let datas:Array<any>=[];
            if(rawArrayData!=null){
                for(let i=0;i<this.N;i++){
                    let data:any={
                        index:i,
                        name:this.name[i],
                        value:rawArrayData[i]
                    }
                    datas.push(data);
                }
            }
            if(raw2dArrayData!=null){
                for(let d=0;d<=this.depth_max;d++){
                    for(let i=0;i<this.N;i++){
                        let data:any = {
                            i:i,
                            i_name:this.name[i],
                            d:d,
                            value:raw2dArrayData[d][i]
                        }
                        // await DBAsync.insert(coll,data);
                        datas.push(data);
                    }
                }
            }
            await DBAsync.insertMany(coll,datas);
        }
        // console.log(collName);
        // await DBAsync.closeDB();
    }
    // idx2dic
    /*
        async saveDB(){
            let db=await DBAsync.connectDBAsync(this.dbName);

            let coll=await DBAsync.coll(db,"a");
            let datas:Array<any>=[];
            for(let i=0;i<this.N;i++){
                let data:any = {
                    index:i,
                    id:this.id[i],
                    name:this.name[i],
                    a:this.a[i],
                    c:this.c[i],
                    s:this.s[i]//,
                    //s_p:this.s_p[i]
                }
                // await DBAsync.insert(coll,data);
                datas.push(data);
            }
            await DBAsync.insertMany(coll,datas);

            coll=await DBAsync.coll(db,"dis_sum_mean_variance");
            let data:any = {
                dis_sum:this.dis_sum,
                dis_mean:this.dis_mean,
                dis_variance:this.dis_variance
            }
            await DBAsync.insert(coll,data);

            coll=await DBAsync.coll(db,"dis");
            datas=[];
            for(let i=0;i<this.N;i++){
                for(let j=0;j<this.N;j++){
                    let data:any = {
                        i:i,
                        i_name:this.name[i],
                        j:j,
                        j_name:this.name[j],
                        dis:this.dis[i][j],
                        dis_m:this.dis_m[i][j],
                        dis_f:this.dis_f[i][j],
                        dis_p:this.dis_p[i][j],
                        s:this.s[j]
                    }
                    // await DBAsync.insert(coll,data);
                    datas.push(data);
                }
            }
            await DBAsync.insertMany(coll,datas);

            coll=await DBAsync.coll(db,"E");
            datas=[];
            for(let d=0;d<=this.depth_max;d++){
                for(let i=0;i<this.N;i++){
                    let data:any = {
                        d:d,
                        i:i,
                        name:this.name[i],
                        E:this.E[d][i],
                        fc:this.fc[d][i]
                    }
                    // await DBAsync.insert(coll,data);
                    datas.push(data);
                }
            }
            await DBAsync.insertMany(coll,datas);

            coll=await DBAsync.coll(db,"Q");
            datas=[];
            for(let d=0;d<=this.depth_max;d++){
                for(let i=0;i<this.N;i++){
                    let data:any = {
                        d:d,
                        i:i,
                        name:this.name[i],
                        E:this.E[d][i],
                        Q:this.Q[d][i],
                        E_Q:this.E_Q[d][i],
                    }
                    // await DBAsync.insert(coll,data);
                    datas.push(data);
                }
            }
            await DBAsync.insertMany(coll,datas);

            await DBAsync.closeDB();
        }
    */

}

export default Expectation;