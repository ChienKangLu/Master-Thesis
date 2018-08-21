import Node from '../algorithm/Node';
import Tool from '../algorithm/Tool';
import {attr_position} from '../algorithm/record';
//checked 2018/1/10

class Vector{
    //how to decide order
    public static dim:number=1;//must set by manual
    public static orderIndex:Array<number>=[];// distance:1 traveltime:2 attraction:0
    public static attr_position:attr_position={};

    data:Array<number>=[];
    constructor(data?:Array<number>){
        if(data!=null)
            this.data=data;
        else{
            this.initial();
        }
    }
    static clear(){
        Vector.dim=1;//must set by manual
        Vector.orderIndex=[];// distance:1 traveltime:2 attraction:0 
        // Vector.orderIndex.length = 0;
        Vector.attr_position={};
        // Tool.deleteProperties(Vector.attr_position);
    }
    copy():Vector{
        let CopyVector=new Vector(this.data.slice(0));
        return CopyVector;
    }
    add(vector:Vector):Vector{
        let result:Array<number>=[];
        for(let i=0;i<Vector.dim;i++){
            result[i]=this.data[i]+vector.data[i];
        }
        return new Vector(result);
    }

    minus(vector:Vector):Vector{
        let result:Array<number>=[];
        for(let i=0;i<Vector.dim;i++){
            result[i]=this.data[i]-vector.data[i];
        }
        return new Vector(result);
    }
    divide(denominator:number):Vector{//mean 的除法
        let result:Array<number>=[];
        for(let i=0;i<Vector.dim;i++){
            result[i]=this.data[i]/denominator;
        }
        return new Vector(result);
    }
    divide_wise(sd:Vector){//向量除向量標準差
        let result:Array<number>=[];
        for(let i=0;i<Vector.dim;i++){
            result[i]=this.data[i]/sd.data[i];
        }
        return new Vector(result);
    }
    mutiple(value:number){//向量除向量標準差
        let result:Array<number>=[];
        for(let i=0;i<Vector.dim;i++){
            result[i]=this.data[i]*value;
        }
        return new Vector(result);
    }
    mutiple_wise(weight:Vector){//向量乘上權重
        let result:Array<number>=[];
        for(let i=0;i<Vector.dim;i++){
            result[i]=this.data[i]*weight.data[i];
        }
        return new Vector(result);
    }
    pow(power:number):Vector{
        let result:Array<number>=[];
        for(let i=0;i<Vector.dim;i++){
            result[i]=Math.pow(this.data[i],power);
        }
        return new Vector(result);
    }

    initial():void{
        for(let i=0;i<Vector.dim;i++){
            this.data[i]=0;
        }
    }
    public static setOrder(orderIndex:Array<number>):void{
        Vector.dim = orderIndex.length;//3
        Vector.orderIndex = orderIndex;//[Node.index_distance, Node.index_attraction, Node.index_time];//[1, 0, 2]
        Tool.datanmsg(`orderIndex:[${Vector.orderIndexToString()}]`);
    }
    public static setAttr_position():void{
        for (let i = 0; i < Vector.dim; i++) {
            if(Vector.orderIndex[i]==Node.index_distance)
                Vector.attr_position["distance"]=i;
            else if(Vector.orderIndex[i]==Node.index_attraction)
                Vector.attr_position["attraction"]=i;
            else if(Vector.orderIndex[i]==Node.index_travelTime)
                Vector.attr_position["travelTime"]=i;
            else if(Vector.orderIndex[i]==Node.index_edgeExcept)//2018_5_17
                Vector.attr_position["edgeExcept"]=i//2018_5_17
        }
    }
    public static orderIndexToString():Array<string>{
        let str:Array<string>=[];
        for(let index of Vector.orderIndex){
            str.push(Node.index_string[index]);
        }
        return str;
    }

    toString():string{
        let s:string="";
        this.data.forEach(function(element,index){
            if(index!=0){
                s+=",";
            }
            if(element==Number.MAX_SAFE_INTEGER){
                s+="∞";
            }else if(element==0){
                s+="0";
            }else{
                s+=element.toPrecision(5);
            }
        })
        return "["+s+"]";
        // return this.data.toString();
    }
    static findIndex(v:Vector,orderIndex:number):number{
        let index:number=-1;
        for(let i=0;i<Vector.dim;i++){
            if(Vector.orderIndex[i]==orderIndex){
                index=i;
            }
        }
        return index;
    }

}
export default Vector;