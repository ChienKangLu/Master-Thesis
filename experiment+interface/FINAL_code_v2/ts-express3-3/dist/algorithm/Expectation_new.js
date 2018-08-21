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
const Node_1 = require("../algorithm/Node");
const Vector_1 = require("../algorithm/Vector");
class Expectation {
    constructor(N, depth_limit, start_id, destination_id, attr_unit_mean, attr_unit_sd, r) {
        this.id = [];
        this.name = [];
        this.id_index = {};
        this.dbName = "Expectation2";
        this.saveGate = false;
        this.attr_unit_mean = [];
        this.attr_unit_sd = [];
        this.N = N;
        this.depth_max = depth_limit;
        this.start_id = start_id;
        this.destination_id = destination_id;
        if (Astar_1.default.constraint.user_specify) {
            this.attr_unit_mean = attr_unit_mean;
            this.attr_unit_sd = attr_unit_sd;
        }
        let cs_datas = this.ini_name_id_id_index_c_s();
        let dis = this.ini_dis();
        let mv_datas = this.ini_dis_mean_dis_variance(dis);
        let dis_p = this.ini_dis_m_f_p(dis, mv_datas.dis_mean, mv_datas.dis_variance);
        let E_Q = this.create_normal_E(dis_p, cs_datas.s);
        if (Astar_1.default.constraint.tuning) {
            let s2 = this.ini_s2(cs_datas.s);
            let E_Q_s2 = this.create_normal_E(dis_p, s2);
            let E_Q_var = this.E_Q_var(E_Q, E_Q_s2);
            this.tuning(E_Q, E_Q_var, r);
            this.save("E_Q_s2", null, E_Q_s2);
            this.save("E_Q_var", null, E_Q_var);
            this.save("E_Q_tuning", null, E_Q);
        }
        else {
            this.save("E_Q", null, E_Q);
        }
        let fc = this.futrue_cost(E_Q);
        let fc_dict = this.fc_dictionary(fc);
        this.fc_dict = fc_dict;
    }
    create_normal_E(A, p) {
        let be_datas = this.backward_expectation(A, p);
        let E = be_datas.E;
        let Q = be_datas.Q;
        let E_Q = this.normal_E(E, Q);
        return E_Q;
    }
    E_Q_var(E_Q, E_Q_s2) {
        let E_Q_var = [];
        for (let d = 0; d <= this.depth_max; d++) {
            E_Q_var[d] = [];
            for (let i = 0; i < this.N; i++) {
                E_Q_var[d][i] = E_Q_s2[d][i] - Math.pow(E_Q[d][i], 2);
            }
        }
        return E_Q_var;
    }
    tuning(E_Q, E_Q_var, r) {
        console.log("--Expectation_new.ts -->tuning:", r, "\n");
        for (let d = 0; d <= this.depth_max; d++) {
            for (let i = 0; i < this.N; i++) {
                E_Q[d][i] = E_Q[d][i] - r * Math.pow(E_Q_var[d][i], 0.5);
                if (E_Q[d][i] < 0) {
                    console.log(`Expectation_new.ts : E_Q[d][i] 值不得低於0!!請確認!!`, d, i, E_Q[d][i]);
                    E_Q[d][i] = 0;
                }
            }
        }
    }
    ini_name_id_id_index_c_s() {
        let a = [];
        let c = [];
        let s = [];
        for (let i = 0; i < this.N; i++) {
            this.name[i] = POImap_1.default.pois[i].name;
            this.id[i] = POImap_1.default.pois[i]._id;
            this.id_index[this.id[i]] = i;
            a[i] = POImap_1.default.pois[i].global_attraction;
            if (Astar_1.default.constraint.user_specify) {
                c[i] = POImap_1.default.user_specify(Node_1.default.index_attraction, POImap_1.default.pois[i].global_attraction_cost, this.attr_unit_mean[Vector_1.default.attr_position["attraction"]], this.attr_unit_sd[Vector_1.default.attr_position["attraction"]]);
            }
            else
                c[i] = POImap_1.default.pois[i].global_attraction_cost;
            s[i] = this.epx_(c[i]);
        }
        return { c: c, s: s };
    }
    ini_s2(s) {
        let s2 = [];
        for (let i = 0; i < this.N; i++) {
            s2[i] = Math.pow(s[i], 2);
        }
        return s2;
    }
    ini_dis() {
        let dis = [];
        for (let from in POImap_1.default.pairEdge) {
            let from_idx = this.id_index[from];
            dis[from_idx] = [];
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
                dis[from_idx][to_idx] = distance;
            }
        }
        return dis;
    }
    ini_dis_mean_dis_variance(dis) {
        let dis_sum = 0;
        let dis_mean = 0;
        let dis_variance = 0;
        for (let i = 0; i < this.N; i++) {
            for (let j = 0; j < this.N; j++) {
                dis_sum += dis[i][j];
            }
        }
        dis_mean = dis_sum / (this.N * this.N);
        for (let i = 0; i < this.N; i++) {
            for (let j = 0; j < this.N; j++) {
                dis_variance += Math.pow(dis[i][j] - dis_mean, 2);
            }
        }
        dis_variance = dis_variance / (this.N * this.N);
        return { "dis_mean": dis_mean, "dis_variance": dis_variance };
    }
    ini_dis_m_f_p(dis, dis_mean, dis_variance) {
        let start_idx = this.id_index[this.start_id];
        let destination_idx = this.id_index[this.destination_id];
        let dis_m = [];
        let dis_f = [];
        let dis_p = [];
        for (let i = 0; i < this.N; i++) {
            if (i == destination_idx)
                continue;
            dis_m[i] = [];
            dis_f[i] = [];
            dis_p[i] = [];
            let sum_dis_f = 0;
            for (let j = 0; j < this.N; j++) {
                if (j == start_idx || j == destination_idx)
                    continue;
                if (Astar_1.default.constraint.attraction_expect_square)
                    dis_m[i][j] = this.normal_square(dis[i][j], dis_mean, dis_variance);
                if (Astar_1.default.constraint.attraction_expect_square_sign)
                    dis_m[i][j] = this.normal_square_sign(dis[i][j], dis_mean, dis_variance);
                if (Astar_1.default.constraint.attraction_expect_userSpecify)
                    dis_m[i][j] = this.expect_userSpecify(dis[i][j], this.attr_unit_mean[Vector_1.default.attr_position["distance"]], this.attr_unit_sd[Vector_1.default.attr_position["distance"]]);
                dis_f[i][j] = this.epx_(dis_m[i][j]);
                sum_dis_f += dis_f[i][j];
            }
            for (let j = 0; j < this.N; j++) {
                if (j == start_idx || j == destination_idx)
                    continue;
                dis_p[i][j] = dis_f[i][j] / sum_dis_f;
            }
        }
        return dis_p;
    }
    backward_expectation(A, p) {
        let E = [];
        let Q = [];
        let start_idx = this.id_index[this.start_id];
        let destination_idx = this.id_index[this.destination_id];
        for (let d = this.depth_max; d >= 0; d--) {
            E[d] = [];
            Q[d] = [];
            for (let i = 0; i < this.N; i++) {
                if (d == this.depth_max) {
                    E[d][destination_idx] = 1;
                    Q[d][destination_idx] = 1;
                    break;
                }
                else if (d == this.depth_max - 1) {
                    if (i == start_idx || i == destination_idx)
                        continue;
                    E[d][i] = 1 * p[destination_idx];
                    Q[d][i] = 1;
                }
                else if (d == 0) {
                    let sum = 0;
                    let sum_Q = 0;
                    for (let j = 0; j < this.N; j++) {
                        if (j == start_idx || j == destination_idx)
                            continue;
                        sum += A[start_idx][j] * p[j] * E[1][j];
                        sum_Q += A[start_idx][j] * [1][j];
                    }
                    E[d][start_idx] = sum;
                    Q[d][start_idx] = sum_Q;
                    break;
                }
                else {
                    if (i == start_idx || i == destination_idx)
                        continue;
                    let sum = 0;
                    let sum_Q = 0;
                    for (let j = 0; j < this.N; j++) {
                        if (j == start_idx || j == destination_idx)
                            continue;
                        sum += A[i][j] * p[j] * E[d + 1][j];
                        sum_Q += A[i][j] * Q[d + 1][j];
                    }
                    E[d][i] = sum;
                    Q[d][i] = sum_Q;
                }
            }
        }
        return { "E": E, "Q": Q };
    }
    normal_E(E, Q) {
        let E_Q = [];
        for (let d = 0; d <= this.depth_max; d++) {
            E_Q[d] = [];
            for (let i = 0; i < this.N; i++) {
                E_Q[d][i] = E[d][i] / Q[d][i];
            }
        }
        return E_Q;
    }
    futrue_cost(E_Q) {
        let fc = [];
        for (let d = 0; d <= this.depth_max; d++) {
            fc[d] = [];
            for (let i = 0; i < this.N; i++) {
                fc[d][i] = this.E2fc(E_Q[d][i]);
            }
        }
        return fc;
    }
    fc_dictionary(fc) {
        let fc_dict = [];
        for (let d = 0; d <= this.depth_max; d++) {
            let poi_fc = {};
            for (let i = 0; i < this.N; i++) {
                poi_fc[this.id[i]] = fc[d][i];
            }
            fc_dict[d] = poi_fc;
        }
        return fc_dict;
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
    expect_userSpecify(x, mean, sd) {
        return (x - mean) / sd;
    }
    save(collName, rawArrayData, raw2dArrayData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.saveGate) {
                let db = yield DBAsync_1.DBAsync.connectDBAsync(this.dbName);
                let coll = yield DBAsync_1.DBAsync.coll(db, collName);
                let datas = [];
                if (rawArrayData != null) {
                    for (let i = 0; i < this.N; i++) {
                        let data = {
                            index: i,
                            name: this.name[i],
                            value: rawArrayData[i]
                        };
                        datas.push(data);
                    }
                }
                if (raw2dArrayData != null) {
                    for (let d = 0; d <= this.depth_max; d++) {
                        for (let i = 0; i < this.N; i++) {
                            let data = {
                                i: i,
                                i_name: this.name[i],
                                d: d,
                                value: raw2dArrayData[d][i]
                            };
                            datas.push(data);
                        }
                    }
                }
                yield DBAsync_1.DBAsync.insertMany(coll, datas);
            }
        });
    }
}
exports.default = Expectation;
