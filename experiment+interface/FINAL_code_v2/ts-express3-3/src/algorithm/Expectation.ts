import POImap from '../algorithm/POImap';
import Tool from '../algorithm/Tool';
import {string_number_array,poi_fc,depth_poi_fc} from '../algorithm/record';
import {DBAsync} from '../database/DBAsync';
import Astar from './Astar';

class Expectation{
    N:number;
    depth_max:number;
    start_id :string;
    destination_id:string;

    id:Array<string> = [];
    name:Array<string> = [];
    id_index:string_number_array ={};//建立id對index的索引
    dis:Array<Array<number>> = [];
    dis_m: Array<Array<number>> = []; //distance approach to mean is better 
    dis_f: Array<Array<number>> = []; //distance feasibility
    dis_p: Array<Array<number>> = []; //distance probability 
    dis_sum:number=0;
    dis_mean:number=0;
    dis_variance:number=0;
    a: Array<number> = []; //global_attraction 
    c: Array<number> = []; //global_attraction_cost 
    s: Array<number> = []; //satisfied 
    s_p: Array<number> = []; //satisfied probability 
    E:Array<Array<number>>=[]; //expectation
    fc:Array<Array<number>>=[]; //future cost
    fc_dict:depth_poi_fc = [];
    Q:Array<Array<number>> = [];//path probability
    E_Q:Array<Array<number>> = [];//E divided by Q
    dbName:string="Expectation";

    constructor(N:number,depth_limit: number,start_id: string ,destination_id: string){
        this.N=N;
        this.depth_max=depth_limit;
        this.start_id=start_id;
        this.destination_id=destination_id;
        this.ini_name_id_id_index_c_s_sp();
        this.ini_dis();
        this.ini_dis_mean_dis_variance();
        this.ini_dis_m_f_p();
        this.backward_expectation(this.dis_p,this.s);
        // this.viterbi_expectation(this.dis_p,this.s);
        this.futrue_cost();
        this.fc_dictionary();
        // this.saveDB();
    }
    ini_name_id_id_index_c_s_sp():void{
        //1. global_attraction_cost -->satisfied
        let s_sum:number=0;
        for (let i = 0; i < this.N; i++) {
            this.name[i] = POImap.pois[i].name;
            this.id[i] = POImap.pois[i]._id;
            this.id_index[this.id[i]]=i;
            this.a[i] = POImap.pois[i].global_attraction;
            this.c[i] = POImap.pois[i].global_attraction_cost;
            this.s[i] = this.epx_(this.c[i]);
            s_sum+=this.s[i];
        }
        //2. satisfied-->satisfied probability
        for (let i = 0; i < this.N; i++) {
            this.s_p[i] = this.s[i]/s_sum;
        }

    }
    /*pairEdge是key->value的資料結構，轉為index->value，演算法用index來撰寫較為方便*/
    ini_dis():void{
        for (let from in POImap.pairEdge) {
            let from_idx:number = this.id_index[from];
            this.dis[from_idx] = [];
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
                this.dis[from_idx][to_idx] = distance;
            }
        }
    }
    ini_dis_mean_dis_variance():void{
        for(let i=0;i<this.N;i++){
            for(let j=0;j<this.N;j++){
                this.dis_sum+=this.dis[i][j];
            }
        }
        this.dis_mean=this.dis_sum/(this.N*this.N);
        for(let i=0;i<this.N;i++){
            for(let j=0;j<this.N;j++){
                this.dis_variance+=Math.pow(this.dis[i][j]-this.dis_mean,2);
            }
        }
        this.dis_variance=this.dis_variance/(this.N*this.N);
    }
    ini_dis_m_f_p():void{
        for(let i=0;i<this.N;i++){
            this.dis_m[i]=[];
            this.dis_f[i]=[];
            this.dis_p[i]=[];
            let sum_dis_f = 0;
            for(let j=0;j<this.N;j++){
                if(Astar.constraint.attraction_expect_square)
                    this.dis_m[i][j] = this.normal_square(this.dis[i][j],this.dis_mean,this.dis_variance);//teacher
                if(Astar.constraint.attraction_expect_square_sign)
                    this.dis_m[i][j] = this.normal_square_sign(this.dis[i][j],this.dis_mean,this.dis_variance);//me
                this.dis_f[i][j]= this.epx_(this.dis_m[i][j]);
                sum_dis_f+=this.dis_f[i][j];
            }
            for(let j=0;j<this.N;j++){
                this.dis_p[i][j] = this.dis_f[i][j]/sum_dis_f;
            }
        }

    }
    backward_expectation(A:Array<Array<number>>,p:Array<number>):void{
        let start_idx:number = this.id_index[this.start_id];
        let destination_idx:number = this.id_index[this.destination_id];
        for(let d=this.depth_max;d>=0;d--){
            this.E[d]=[];
            this.Q[d]=[];
            for(let i=0;i<this.N;i++){
                if(d==this.depth_max){//last
                    this.E[d][destination_idx]=1;
                    this.Q[d][destination_idx]=1;
                    break;
                }else if(d==this.depth_max-1){
                    // this.E[d][i]=1;
                    // this.Q[d][i]=1;
                    this.E[d][i]=A[i][destination_idx]*p[destination_idx];
                    this.Q[d][i]=A[i][destination_idx];
                }else if(d==0){
                    let sum:number=0;
                    let sum_Q:number = 0;
                    for(let j:number=0;j<this.N;j++){
                        sum+=A[start_idx][j]*p[j]*this.E[d+1][j];
                        sum_Q += A[start_idx][j]*this.Q[d+1][j];
                    }              
                    this.E[d][start_idx]=sum;
                    this.Q[d][start_idx]=sum_Q;
                }else{//middle
                    let sum:number=0;
                    let sum_Q:number = 0;
                    for(let j:number=0;j<this.N;j++){
                        sum+=A[i][j]*p[j]*this.E[d+1][j];
                        sum_Q += A[i][j]*this.Q[d+1][j];
                    }
                    this.E[d][i]=sum;
                    this.Q[d][i]=sum_Q;
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
                    this.E[d][i]=1;
                }else if(d==0){
                    let max:number=Number.MIN_VALUE;
                    let max_j_index=-1;
                    for(let j:number=0;j<this.N;j++){
                        let w:number = A[start_idx][j]*p[j];
                        if(w>max){
                            max=w;
                            max_j_index = j;
                        }
                        // sum+=A[start_idx][j]*p[j]*this.E[d+1][j];
                    }              
                    this.E[d][start_idx]=max*this.E[d+1][max_j_index];
                }else{//middle
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
    futrue_cost():void{
        for(let d=0;d<=this.depth_max;d++){
            this.fc[d] = [];
            this.E_Q[d] = [];
            for(let i=0;i<this.N;i++){
                this.E_Q[d][i]=this.E[d][i]/this.Q[d][i];
                this.fc[d][i]=this.E2fc(this.E_Q[d][i]);
            }
        }
    }
    fc_dictionary(): void {
        for(let d=0;d<=this.depth_max;d++){
            let poi_fc:poi_fc = {};
            for(let i=0;i<this.N;i++){
                poi_fc[this.id[i]]=this.fc[d][i];
            }
            this.fc_dict[d]=poi_fc;
        }
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

    // idx2dic
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
                s:this.s[i],
                s_p:this.s_p[i]
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

}

export default Expectation;