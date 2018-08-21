//checked 2018/1/10

class HMM{
    N:number;
    T:number;
    A:Array<Array<number>>;
    score:Array<number>;
    beta:Array<Array<number>>=[];
    // pi:Array<number>;
    // B:Array<Array<number>>;
    // alpha:Array<Array<number>>=[];
    // delta:Array<Array<number>>=[];
    // psi:Array<Array<number>>=[];
    constructor(N:number,T:number,A:Array<Array<number>>,score:Array<number>){
        this.N=N;
        this.T=T;
        this.A=A;
        this.score=score;
        this.initial();
    }

    // constructor(N:number,T:number,pi:Array<number>,A:Array<Array<number>>,B:Array<Array<number>>,score:Array<number>){
    //     this.N=N;
    //     this.T=T;
    //     this.pi=pi;
    //     this.A=A;
    //     this.B=B;
    //     this.initial();
    // }
    
    initial():void{
        for(let t=0;t<this.T;t++){
            this.beta[t]=[];
            for(let n=0;n<this.N;n++){
                this.beta[t][n]=0;
            }
        }
        // for(let t=0;t<this.T;t++){
        //     this.alpha[t]=[];
        //     for(let n=0;n<this.N;n++){
        //         this.alpha[t][n]=0;
        //     }
        // }
        // for(let t=0;t<this.T;t++){
        //     this.delta[t]=[];
        //     for(let n=0;n<this.N;n++){
        //         this.delta[t][n]=0;
        //     }
        // }
        // for(let t=0;t<this.T;t++){
        //     this.psi[t]=[];
        //     for(let n=0;n<this.N;n++){
        //         this.psi[t][n]=0;
        //     }
        // }
    }
//error everything!!!!//error everything!!!!//error everything!!!!
//error everything!!!!//error everything!!!!//error everything!!!!
//error everything!!!!//error everything!!!!//error everything!!!!
//error everything!!!!//error everything!!!!//error everything!!!!
    back_expectation(start_idx:number,destination_idx:number):Array<Array<number>>{//error everything!!!!
        for(let t=this.T-1;t>=0;t--){//0 1 2 3
            for(let i=0;i<this.N;i++){
                if(t==this.T-1){//last
                    this.beta[t][destination_idx]=0;
                    break;
                }else if(t==this.T-2){//倒數第二
                    let p:number=0;
                    // p+=this.A[i][destination_idx]*this.score[destination_idx];
                    p+=this.score[destination_idx];
                    //p = 0;//2018/2/22
                    this.beta[t][i]=p+this.beta[t+1][destination_idx];//p+?
                }else if(t==0){//first
                    let p:number=0;
                    for(let j=0;j<this.N;j++){
                        p+=this.A[start_idx][j]*this.score[j];
                    }
                    this.beta[t][start_idx]=p+this.beta[t+1][start_idx];
                    break;
                }else{//middle
                    let p:number=0;
                    for(let j=0;j<this.N;j++){
                        p+=this.A[i][j]*this.score[j];
                    }
                    this.beta[t][i]=p+this.beta[t+1][i];
                }
            }
        }
        return this.beta;
    }
    backward_satisfied_expectation(start_idx:number,destination_idx:number):Array<Array<number>>{
        for(let t=this.T-1;t>=0;t--){//0 1 2 3
            for(let i=0;i<this.N;i++){
                if(t==this.T-1){//last
                    this.beta[t][destination_idx]=1;
                    break;
                }else if(t==this.T-2){//倒數第二
                    let p:number=1;
                    p+=this.score[destination_idx];
                    this.beta[t][i]=p+this.beta[t+1][destination_idx];//p+?
                }else if(t==0){//first
                    let p:number=0;
                    for(let j=0;j<this.N;j++){
                        p+=this.A[start_idx][j]*this.score[j];
                    }
                    this.beta[t][start_idx]=p+this.beta[t+1][start_idx];
                    break;
                }else{//middle
                    let p:number=0;
                    for(let j=0;j<this.N;j++){
                        p+=this.A[i][j]*this.score[j];
                    }
                    this.beta[t][i]=p+this.beta[t+1][i];
                }
            }
        }
        return this.beta;
    }
    // forward(o:Array<number>):number{
    //     for(let t=0;t<this.T;t++){
    //         for(let j=0;j<this.N;j++){
    //             if(t==0){
    //                 this.alpha[t][j]=this.pi[j]*this.B[j][o[t]];//初次期望值
    //             }else{
    //                 let p:number=0;
    //                 for(let i=0;i<this.N;i++){
    //                     p+=this.alpha[t-1][i]*this.A[i][j];
    //                 }
    //                 this.alpha[t][j]=p*this.B[j][o[t]];//連乘機率期望值
    //             }
    //         }
    //     }
    //     let p:number=0;
    //     for(let i=0;i<this.N;i++){
    //         p+=this.alpha[this.T-1][i];
    //     }
    //     return p;
    // }

    // backward(o:Array<number>):number{
    //     for(let t=this.T-1;t>=0;t--){
    //         for(let i=0;i<this.N;i++){
    //             if(t==this.T-1){
    //                 this.beta[t][i]=1;
    //             }else{
    //                 let p:number=0;
    //                 for(let j=0;j<this.N;j++){
    //                     p+=this.A[i][j]*this.B[j][o[t+1]]*this.beta[t+1][j];
    //                 }
    //                 this.beta[t][i]=p;
    //             }
    //         }
    //     }
    //     let p:number=0;
    //     for(let j=0;j<this.N;j++){
    //         p+=this.pi[j]*this.B[j][o[0]]*this.beta[0][j];
    //     }
    //     return p;
    // }
   
    // viterbi(o:Array<number>):Array<number>{
    //     for(let t=0;t<this.T;t++){
    //         for(let j=0;j<this.N;j++){
    //             if(t==0){
    //                 this.delta[t][j]=this.pi[j]*this.B[j][o[t]];//初次機率
    //             }else{
    //                 let p:number=Number.MIN_VALUE;
    //                 for(let i=0;i<this.N;i++){
    //                     let w=this.delta[t-1][i]*this.A[i][j];
    //                     if(w>p){
    //                         p=w;
    //                         this.psi[t][j]=i;
    //                     }
    //                 }
    //                 this.delta[t][j]=p*this.B[j][o[t]];//連乘機率
    //             }
    //         }
    //     }
    //     console.log(JSON.stringify(this.delta,null,4));
    //     let q:Array<number>=[];//max state(city) sequence
    //     let p:number=Number.MIN_VALUE;
    //     for (let j=0; j<this.N; j++){
    //         if (this.delta[this.T-1][j] > p){
    //             p = this.delta[this.T-1][j]; 
    //             q[this.T-1] = j;
    //         }
    //     }
    //     for (let t=this.T-1; t>0; t--)
    //         q[t-1] = this.psi[t][q[t]];
    //     return q;
    // }
}
export default HMM;