"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const POImap_1 = require("../algorithm/POImap");
const DBAsync_1 = require("../database/DBAsync");
const Astar_1 = require("./Astar");
class Expectation {
    constructor(N, depth_limit, start_id, destination_id) {
        this.id = [];
        this.name = [];
        this.id_index = {};
        this.dis = [];
        this.dis_m = [];
        this.dis_f = [];
        this.dis_p = [];
        this.dis_sum = 0;
        this.dis_mean = 0;
        this.dis_variance = 0;
        this.a = [];
        this.c = [];
        this.s = [];
        this.s_p = [];
        this.E = [];
        this.fc = [];
        this.fc_dict = [];
        this.Q = [];
        this.E_Q = [];
        this.dbName = "Expectation";
        this.N = N;
        this.depth_max = depth_limit;
        this.start_id = start_id;
        this.destination_id = destination_id;
        this.ini_name_id_id_index_c_s_sp();
        this.ini_dis();
        this.ini_dis_mean_dis_variance();
        this.ini_dis_m_f_p();
        this.backward_expectation(this.dis_p, this.s);
        this.futrue_cost();
        this.fc_dictionary();
    }
    ini_name_id_id_index_c_s_sp() {
        let s_sum = 0;
        for (let i = 0; i < this.N; i++) {
            this.name[i] = POImap_1.default.pois[i].name;
            this.id[i] = POImap_1.default.pois[i]._id;
            this.id_index[this.id[i]] = i;
            this.a[i] = POImap_1.default.pois[i].global_attraction;
            this.c[i] = POImap_1.default.pois[i].global_attraction_cost;
            this.s[i] = this.epx_(this.c[i]);
            s_sum += this.s[i];
        }
        for (let i = 0; i < this.N; i++) {
            this.s_p[i] = this.s[i] / s_sum;
        }
    }
    ini_dis() {
        for (let from in POImap_1.default.pairEdge) {
            let from_idx = this.id_index[from];
            this.dis[from_idx] = [];
            for (let to in POImap_1.default.pairEdge[from]) {
                let distance = POImap_1.default.pairEdge[from][to].distance;
                if (distance == null) {
                    distance = POImap_1.default.pairEdge[from][to].lineDistance;
                }
                let travelTime = POImap_1.default.pairEdge[from][to].travelTime;
                if (travelTime == null) {
                    travelTime = POImap_1.default.pairEdge[from][to].lineTravelTime;
                }
                let to_idx = this.id_index[to];
                this.dis[from_idx][to_idx] = distance;
            }
        }
    }
    ini_dis_mean_dis_variance() {
        for (let i = 0; i < this.N; i++) {
            for (let j = 0; j < this.N; j++) {
                this.dis_sum += this.dis[i][j];
            }
        }
        this.dis_mean = this.dis_sum / (this.N * this.N);
        for (let i = 0; i < this.N; i++) {
            for (let j = 0; j < this.N; j++) {
                this.dis_variance += Math.pow(this.dis[i][j] - this.dis_mean, 2);
            }
        }
        this.dis_variance = this.dis_variance / (this.N * this.N);
    }
    ini_dis_m_f_p() {
        for (let i = 0; i < this.N; i++) {
            this.dis_m[i] = [];
            this.dis_f[i] = [];
            this.dis_p[i] = [];
            let sum_dis_f = 0;
            for (let j = 0; j < this.N; j++) {
                if (Astar_1.default.constraint.attraction_expect_square)
                    this.dis_m[i][j] = this.normal_square(this.dis[i][j], this.dis_mean, this.dis_variance);
                if (Astar_1.default.constraint.attraction_expect_square_sign)
                    this.dis_m[i][j] = this.normal_square_sign(this.dis[i][j], this.dis_mean, this.dis_variance);
                this.dis_f[i][j] = this.epx_(this.dis_m[i][j]);
                sum_dis_f += this.dis_f[i][j];
            }
            for (let j = 0; j < this.N; j++) {
                this.dis_p[i][j] = this.dis_f[i][j] / sum_dis_f;
            }
        }
    }
    backward_expectation(A, p) {
        let start_idx = this.id_index[this.start_id];
        let destination_idx = this.id_index[this.destination_id];
        for (let d = this.depth_max; d >= 0; d--) {
            this.E[d] = [];
            this.Q[d] = [];
            for (let i = 0; i < this.N; i++) {
                if (d == this.depth_max) {
                    this.E[d][destination_idx] = 1;
                    this.Q[d][destination_idx] = 1;
                    break;
                }
                else if (d == this.depth_max - 1) {
                    this.E[d][i] = A[i][destination_idx] * p[destination_idx];
                    this.Q[d][i] = A[i][destination_idx];
                }
                else if (d == 0) {
                    let sum = 0;
                    let sum_Q = 0;
                    for (let j = 0; j < this.N; j++) {
                        sum += A[start_idx][j] * p[j] * this.E[d + 1][j];
                        sum_Q += A[start_idx][j] * this.Q[d + 1][j];
                    }
                    this.E[d][start_idx] = sum;
                    this.Q[d][start_idx] = sum_Q;
                }
                else {
                    let sum = 0;
                    let sum_Q = 0;
                    for (let j = 0; j < this.N; j++) {
                        sum += A[i][j] * p[j] * this.E[d + 1][j];
                        sum_Q += A[i][j] * this.Q[d + 1][j];
                    }
                    this.E[d][i] = sum;
                    this.Q[d][i] = sum_Q;
                }
            }
        }
    }
    viterbi_expectation(A, p) {
        let start_idx = this.id_index[this.start_id];
        let destination_idx = this.id_index[this.destination_id];
        for (let d = this.depth_max; d >= 0; d--) {
            this.E[d] = [];
            for (let i = 0; i < this.N; i++) {
                if (d == this.depth_max) {
                    this.E[d][destination_idx] = 1;
                    break;
                }
                else if (d == this.depth_max - 1) {
                    this.E[d][i] = 1;
                }
                else if (d == 0) {
                    let max = Number.MIN_VALUE;
                    let max_j_index = -1;
                    for (let j = 0; j < this.N; j++) {
                        let w = A[start_idx][j] * p[j];
                        if (w > max) {
                            max = w;
                            max_j_index = j;
                        }
                    }
                    this.E[d][start_idx] = max * this.E[d + 1][max_j_index];
                }
                else {
                    let max = Number.MIN_VALUE;
                    let max_j_index = -1;
                    for (let j = 0; j < this.N; j++) {
                        let w = A[i][j] * p[j];
                        if (w > max) {
                            max = w;
                            max_j_index = j;
                        }
                    }
                    this.E[d][i] = max * this.E[d + 1][max_j_index];
                }
            }
        }
    }
    futrue_cost() {
        for (let d = 0; d <= this.depth_max; d++) {
            this.fc[d] = [];
            this.E_Q[d] = [];
            for (let i = 0; i < this.N; i++) {
                this.E_Q[d][i] = this.E[d][i] / this.Q[d][i];
                this.fc[d][i] = this.E2fc(this.E_Q[d][i]);
            }
        }
    }
    fc_dictionary() {
        for (let d = 0; d <= this.depth_max; d++) {
            let poi_fc = {};
            for (let i = 0; i < this.N; i++) {
                poi_fc[this.id[i]] = this.fc[d][i];
            }
            this.fc_dict[d] = poi_fc;
        }
    }
    epx_(attraction_cost) {
        return Math.exp(-attraction_cost);
    }
    E2fc(E) {
        if (E == null)
            return null;
        return -Math.log(E);
    }
    normal_square(x, mean, variance) {
        return (Math.pow(x - mean, 2)) / (2 * variance);
    }
    normal_square_sign(x, mean, variance) {
        let symbol = 1;
        let n = x - mean;
        if (n < 0)
            symbol = -1;
        return symbol * (Math.pow(x - mean, 2)) / (2 * variance);
    }
    saveDB() {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield DBAsync_1.DBAsync.connectDBAsync(this.dbName);
            let coll = yield DBAsync_1.DBAsync.coll(db, "a");
            let datas = [];
            for (let i = 0; i < this.N; i++) {
                let data = {
                    index: i,
                    id: this.id[i],
                    name: this.name[i],
                    a: this.a[i],
                    c: this.c[i],
                    s: this.s[i],
                    s_p: this.s_p[i]
                };
                datas.push(data);
            }
            yield DBAsync_1.DBAsync.insertMany(coll, datas);
            coll = yield DBAsync_1.DBAsync.coll(db, "dis_sum_mean_variance");
            let data = {
                dis_sum: this.dis_sum,
                dis_mean: this.dis_mean,
                dis_variance: this.dis_variance
            };
            yield DBAsync_1.DBAsync.insert(coll, data);
            coll = yield DBAsync_1.DBAsync.coll(db, "dis");
            datas = [];
            for (let i = 0; i < this.N; i++) {
                for (let j = 0; j < this.N; j++) {
                    let data = {
                        i: i,
                        i_name: this.name[i],
                        j: j,
                        j_name: this.name[j],
                        dis: this.dis[i][j],
                        dis_m: this.dis_m[i][j],
                        dis_f: this.dis_f[i][j],
                        dis_p: this.dis_p[i][j],
                        s: this.s[j]
                    };
                    datas.push(data);
                }
            }
            yield DBAsync_1.DBAsync.insertMany(coll, datas);
            coll = yield DBAsync_1.DBAsync.coll(db, "E");
            datas = [];
            for (let d = 0; d <= this.depth_max; d++) {
                for (let i = 0; i < this.N; i++) {
                    let data = {
                        d: d,
                        i: i,
                        name: this.name[i],
                        E: this.E[d][i],
                        fc: this.fc[d][i]
                    };
                    datas.push(data);
                }
            }
            yield DBAsync_1.DBAsync.insertMany(coll, datas);
            coll = yield DBAsync_1.DBAsync.coll(db, "Q");
            datas = [];
            for (let d = 0; d <= this.depth_max; d++) {
                for (let i = 0; i < this.N; i++) {
                    let data = {
                        d: d,
                        i: i,
                        name: this.name[i],
                        E: this.E[d][i],
                        Q: this.Q[d][i],
                        E_Q: this.E_Q[d][i],
                    };
                    datas.push(data);
                }
            }
            yield DBAsync_1.DBAsync.insertMany(coll, datas);
            yield DBAsync_1.DBAsync.closeDB();
        });
    }
}
exports.default = Expectation;
