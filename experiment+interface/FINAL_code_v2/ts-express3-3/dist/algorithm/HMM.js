"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HMM {
    constructor(N, T, A, score) {
        this.beta = [];
        this.N = N;
        this.T = T;
        this.A = A;
        this.score = score;
        this.initial();
    }
    initial() {
        for (let t = 0; t < this.T; t++) {
            this.beta[t] = [];
            for (let n = 0; n < this.N; n++) {
                this.beta[t][n] = 0;
            }
        }
    }
    back_expectation(start_idx, destination_idx) {
        for (let t = this.T - 1; t >= 0; t--) {
            for (let i = 0; i < this.N; i++) {
                if (t == this.T - 1) {
                    this.beta[t][destination_idx] = 0;
                    break;
                }
                else if (t == this.T - 2) {
                    let p = 0;
                    p += this.score[destination_idx];
                    this.beta[t][i] = p + this.beta[t + 1][destination_idx];
                }
                else if (t == 0) {
                    let p = 0;
                    for (let j = 0; j < this.N; j++) {
                        p += this.A[start_idx][j] * this.score[j];
                    }
                    this.beta[t][start_idx] = p + this.beta[t + 1][start_idx];
                    break;
                }
                else {
                    let p = 0;
                    for (let j = 0; j < this.N; j++) {
                        p += this.A[i][j] * this.score[j];
                    }
                    this.beta[t][i] = p + this.beta[t + 1][i];
                }
            }
        }
        return this.beta;
    }
    backward_satisfied_expectation(start_idx, destination_idx) {
        for (let t = this.T - 1; t >= 0; t--) {
            for (let i = 0; i < this.N; i++) {
                if (t == this.T - 1) {
                    this.beta[t][destination_idx] = 1;
                    break;
                }
                else if (t == this.T - 2) {
                    let p = 1;
                    p += this.score[destination_idx];
                    this.beta[t][i] = p + this.beta[t + 1][destination_idx];
                }
                else if (t == 0) {
                    let p = 0;
                    for (let j = 0; j < this.N; j++) {
                        p += this.A[start_idx][j] * this.score[j];
                    }
                    this.beta[t][start_idx] = p + this.beta[t + 1][start_idx];
                    break;
                }
                else {
                    let p = 0;
                    for (let j = 0; j < this.N; j++) {
                        p += this.A[i][j] * this.score[j];
                    }
                    this.beta[t][i] = p + this.beta[t + 1][i];
                }
            }
        }
        return this.beta;
    }
}
exports.default = HMM;
