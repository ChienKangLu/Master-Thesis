import Vector from '../algorithm/Vector';
class Node{
    num:number;
    priority:string;
    idx:number
    constructor(num?:number,priority?:string,idx?:number){
        if(num!=null&&priority!=null&&idx!=null){
            this.num = num;
            this.priority = priority;
            this.idx=idx;
        }
    }
    toString(){
        return `${this.num}(${this.priority})`;
    }
}
class MinHeap {
    /*
     index 0 1 2 3 4 5 6
     value x 3 5 6 7 8 4

     size = 6
     */
    data: Array<Node> = [new Node()];
    size: number = 0;

    comparator:(left:Node,right:Node)=>boolean;

    constructor() {
    }
    setComparator(comparator:(left:Node,right:Node)=>boolean){
        this.comparator=comparator;
    }

    //important
    add(element:Node){
        this.data.push(element);
        this.size++;
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

        this.minHeapify(1);

        return min;
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

    // toString(): string {
    //     let str: string = "";
    //     return JSON.stringify(this.data);
    // }
    toString(all:boolean):string{
        let s:string="";
        if(all){
            for(let i=1;i<this.data.length;i++){
                if(i!=1){
                    s+=",";
                }
                // s+=element.toString();
                s+=this.data[i].toString()
            }
        }
        else
            s+=this.size;
        return "["+s+"]";
    }

    // findPosition(value:number):number{
    //     let idx=0;
    //     for(let i=1;i<=this.size;i++){
    //         if(this.data[i]==value){
    //             idx=i;
    //         }
    //     }
    //     return idx;
    // }
}


function comparator_heap(left: Node, right: Node): boolean {
    for (let i = 0; i < Vector.dim; i++) {
        if (left.num == right.num) {
            if(left.idx < right.idx){
                return true; // swap left small than right
            }
            return false;
        }else if(left.num < right.num){
            return true;// swap left small than right
        }else{
            return false;
        }
    }
    return false;
}
let node:Array<Node> = [
                            new Node(5,"A",1),
                            new Node(5,"B",2),
                            new Node(5,"C",3),
                            new Node(5,"D",4),
                            new Node(3,"A",5),
                            new Node(2,"A",6),
                            new Node(1,"A",7)
                        ];


let openlist:MinHeap = new MinHeap();
openlist.setComparator(comparator_heap);
for(let i=0;i<node.length;i++){
    openlist.add(node[i]);
    console.log(`insert ${i}:${openlist.toString(true)}`);
}
for(let i=0;i<node.length;i++){
    console.log(`pop:${openlist.pop()}`);
    console.log(`${openlist.toString(true)}`);
}
