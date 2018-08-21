import Node from '../algorithm/Node';
import Vector from '../algorithm/Vector';
//checked 2018/1/10

class PriorityQueue{
    data: Array<Node> = [];
    size:number=0;
    comparator:(left:Node,right:Node)=>number
    constructor() {
    }
    setComparator(comparator:(left:Node,right:Node)=>number){
        this.comparator=comparator;
    }

    add(element:Node,):void{
        this.data.push(element);
        this.data.sort(this.comparator);
        this.size++;
    }
    pop():Node{
        this.size--;
        return <Node>this.data.pop();
    }
    isEmpty():boolean{
        return this.size == 0;
    }
    toString(all:boolean):string{
        let s:string="";
        if(all){
            for(let i=0;i<this.data.length;i++){
                if(i!=0){
                    s+=",";
                }
                // s+=element.toString();
                s+=this.data[i].f.data[0].toFixed(2);
            }
        }
        else
            s+=this.data.length;
        return "["+s+"]";
    }

    // contain(array: Array<Node>, target: Node): boolean {
    //     for (let item of array) {
    //         if (item.equals(target)) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    // find(array: Array<Node>, target: Node): number {
    //     for (let index = 0; index < array.length; index++) {
    //         if (array[index].equals(target)) {
    //             return index;
    //         }
    //     }
    //     return -1;
    // }
    // remove(array: Array<Node>, target: Node): boolean {
    //     let index = this.find(array, target);
    //     if (index != -1) {
    //         array.splice(index, 1);//在index刪除1個元素
    //         return true;
    //     }
    //     this.size--;
    //     return false;
    // }

    // sumF():Array<number>{
    //     let sumF:Array<number>=[];
    //     for(let j=0;j<Vector.dim;j++){
    //         sumF[j]=0;
    //         for(let i=0;i<this.data.length;i++){
    //             sumF[j]+=this.data[i].f.data[j];
    //         }
    //     }
    //     return sumF;
    // }
    // meanF(sumF:Array<number>):Array<number>{
    //     let mean:Array<number>=[];
    //     for(let j=0;j<Vector.dim;j++){
    //         mean[j]=sumF[j]/this.data.length;
    //     }
    //     return mean;
    // }
    // varianceF(meanF:Array<number>):Array<number>{
    //     let varianceH:Array<number>=[];
    //     for(let j=0;j<Vector.dim;j++){
    //         varianceH[j]=0;
    //         for(let i=0;i<this.data.length;i++){
    //             varianceH[j]+=Math.pow(this.data[i].f.data[j]-meanF[j],2);
    //         }
    //         varianceH[j]=varianceH[j]/this.data.length;
    //     }
    //     return varianceH;
    // }
    // sdF(varianceF:Array<number>):Array<number>{
    //     let sdF:Array<number>=[];
    //     for(let j=0;j<Vector.dim;j++){
    //         sdF[j]=Math.pow(varianceF[j],0.5);
    //     }
    //     return sdF;
    // }

}
export default PriorityQueue;