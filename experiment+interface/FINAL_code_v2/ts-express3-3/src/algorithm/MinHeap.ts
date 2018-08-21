import Node from '../algorithm/Node';
import Vector from '../algorithm/Vector';
import Astar from '../algorithm/Astar';
//checked 2018/1/10

class MinHeap {
    /*
     index 0 1 2 3 4 5 6
     value x 3 5 6 7 8 4

     size = 6
     */
    data: Array<Node> = [new Node()];
    size: number = 0;

    static sum:Vector;
    static x_2:Vector;
    static mean: Vector;
    static variance:Vector;


    comparator:(left:Node,right:Node)=>boolean;

    constructor() {
        MinHeap.reset();
        //for normalize
        if(Astar.constraint.comparator_heap_normalize_gaussian||
            Astar.constraint.comparater_heap_sigmoid||
            Astar.constraint.comparater_heap_normal_sigmoid){
        }
    }
    setComparator(comparator:(left:Node,right:Node)=>boolean){
        this.comparator=comparator;
    }

    static reset(){
        //for normalize
        MinHeap.sum = new Vector;
        MinHeap.x_2 = new Vector;
        MinHeap.mean = new Vector;
        MinHeap.variance = new Vector;
        
    }

    //important
    add(element:Node){
        this.data.push(element);
        this.size++;
        if(Astar.constraint.comparator_heap_normalize_gaussian||
            Astar.constraint.comparater_heap_sigmoid||
            Astar.constraint.comparater_heap_normal_sigmoid){
            //for normalize
            //need to calculate before shipUp, because the comparator need the new mean and variance
            this.sum_add(element);
            this.x_2_add(element);
            this.mean();
            this.variance();
        }
        this.shipUp();
    }
    //important
    pop():any{//popMin
        if(!this.isEmpty){
            return null;
        }
        let min:Node=this.minimum();

        this.data[1]=this.data[this.size];//last to first
        this.data.pop();//remove first
        this.size--;

        if(Astar.constraint.comparator_heap_normalize_gaussian||
            Astar.constraint.comparater_heap_sigmoid||
            Astar.constraint.comparater_heap_normal_sigmoid){
            //for normalize
            //need to calculate before shipUp, because the comparator need the new mean and variance
            this.sum_minus(min);
            this.x_2_minus(min);
            this.mean();
            this.variance();
        }


        this.minHeapify(1);

        return min;
    }
    sum_add(element:Node){
        MinHeap.sum=MinHeap.sum.add(element.f);
    }
    sum_minus(element:Node){
        MinHeap.sum=MinHeap.sum.minus(element.f);
    }
    x_2_add(element:Node){
        MinHeap.x_2=MinHeap.x_2.add(element.f.pow(2));
    }
    x_2_minus(element:Node){
        MinHeap.sum=MinHeap.sum.minus(element.f.pow(2));
    }
    mean(){
        MinHeap.mean = MinHeap.sum.divide(this.size);
    }
    variance(){
        MinHeap.variance = (MinHeap.x_2.divide(this.size)).minus(MinHeap.mean.pow(2));
    }
    //me
    static normalize(element:Node):Vector{
        let normal:Vector=new Vector();
        normal=(element.f.minus(MinHeap.mean)).divide_wise(MinHeap.variance.pow(0.5));
        return normal;
    }
    //teacher
    static normaliz_Gaussion(element:Node):Vector{
        let normal:Vector=new Vector();
        normal=((element.f.minus(MinHeap.mean)).pow(2)).divide_wise(MinHeap.variance);
        for(let i=0;i<Vector.dim;i++){
            if(element.f.data[i]<MinHeap.mean.data[i]){
                normal.data[i]=0;
            }
        }
        return normal;
    }
    static sigmoid(element:Node):Vector{
        let value:Vector=new Vector();
        for(let i=0;i<Vector.dim;i++){
            value.data[i]=MinHeap.sigmoid_function(element.f.data[i]-MinHeap.mean.data[i]);
        }
        return value;
    }
    static sigmoid_normal(element:Node):Vector{
        let value:Vector=new Vector();
        for(let i=0;i<Vector.dim;i++){
            let normal = 0;
            normal = (element.f.data[i]-MinHeap.mean.data[i])/Math.pow(MinHeap.variance.data[i],0.5);
            value.data[i]=MinHeap.sigmoid_function(normal);
        }
        return value;
    }
    static sigmoid_function(x:number):number{
        // return Math.exp(-x+mean)/(1+Math.exp(-x+mean));
        return 1/(1+Math.exp(-x));
    }

    getParentNode(index:number){
        return Math.floor(index / 2);
    }

    shipUp(){
        let index = this.size;
        //this.data[this.getParentNode(index)]>this.data[index]
        while(index>1 && this.comparator(this.data[index],this.data[this.getParentNode(index)])){
            this.swap(index,this.getParentNode(index));
            index=this.getParentNode(index);
        }
    }

    isEmpty():boolean{
        return (this.size==0);
    }

    minimum():Node{
        return this.data[1];
    }


    swap(i:number,j:number){
        let temp = this.data[i];
        this.data[i] = this.data[j];
        this.data[j] = temp;
    }

    minHeapify(root:number){
        let left:number=2*root;
        let right:number=2*root+1;
        let smallest:number=-1;
        if(left<=this.size && this.comparator(this.data[left],this.data[root])){//this.data[left]<this.data[root]
            smallest=left;
        }else{
            smallest=root;
        }

        if(right<=this.size && this.comparator(this.data[right],this.data[smallest])){//this.data[right]<this.data[smallest]
            smallest=right;
        }

        if(smallest!=root){
            this.swap(smallest,root);
            this.minHeapify(smallest);
        }
    }

    buildMinHeap(){
        let start:number=Math.floor(this.size / 2);
        for(let i=start;i>=1;i--){
            this.minHeapify(i);
        }
    }
    /*
        toString(): string {
            let str: string = "";
            return JSON.stringify(this.data);
        }
    */
    toString(all:boolean):string{
        let s:string="";
        if(all){
            for(let i=1;i<this.data.length;i++){
                if(i!=1){
                    s+=",";
                }
                // s+=element.toString();
                s+=this.data[i].f.data[0].toFixed(2);
            }
        }
        else
            s+=this.size;
        return "["+s+"]";
    }
    /*
        findPosition(value:number):number{
            let idx=0;
            for(let i=1;i<=this.size;i++){
                if(this.data[i]==value){
                    idx=i;
                }
            }
            return idx;
        }
    */
}
export default MinHeap;