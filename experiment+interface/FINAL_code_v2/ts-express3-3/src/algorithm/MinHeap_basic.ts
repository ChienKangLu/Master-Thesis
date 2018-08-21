import Node from '../algorithm/Node';
import Vector from '../algorithm/Vector';
class Minheap {
    /*
     index 0 1 2 3 4 5 6
     value x 3 5 6 7 8 4

     size = 6
     */
    data: Array<number> = [0];
    size: number = 0;
    constructor() {
    }

    //important
    insert(value:number){
        this.data.push(value);
        this.size++;
        this.shipUp();
    }
    //important
    popMin(){
        if(this.isHeapEmpity()){
            return null;
        }
        let min:number=this.minimum();
        this.data[1]=this.data[this.size];
        this.data.pop();
        this.size--;
        this.minHeapify(1);
        return min;
    }
    getParentNode(index:number){
        return Math.floor(index / 2);
    }

    shipUp(){
        let index = this.size;
        while(index>1 && this.data[this.getParentNode(index)]>this.data[index]){
            this.swap(index,this.getParentNode(index));
            index=this.getParentNode(index);
        }
    }

    isHeapEmpity():boolean{
        return (this.size==0);
    }

    minimum():number{
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
        if(left<=this.size && this.data[left]<this.data[root]){
            smallest=left;
        }else{
            smallest=root;
        }

        if(right<=this.size && this.data[right]<this.data[smallest]){
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

    toString(): string {
        let str: string = "";
        return JSON.stringify(this.data);
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
export default Minheap;