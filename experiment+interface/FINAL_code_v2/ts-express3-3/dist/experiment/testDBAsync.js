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
const DBAsync_1 = require("../database/DBAsync");
function a() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield DBAsync_1.DBAsync.connectDBAsync("ttt");
        let coll = yield DBAsync_1.DBAsync.coll(db, "yy");
        let exp = {
            "path": [
                { "poi": {
                        "weekTime": [
                            [
                                {
                                    "status": "Open24hours"
                                }
                            ],
                            [
                                {
                                    "status": "Open24hours"
                                }
                            ],
                            [
                                {
                                    "status": "Open24hours"
                                }
                            ],
                            [
                                {
                                    "status": "Open24hours"
                                }
                            ],
                            [
                                {
                                    "status": "Open24hours"
                                }
                            ],
                            [
                                {
                                    "status": "Open24hours"
                                }
                            ],
                            [
                                {
                                    "status": "Open24hours"
                                }
                            ]
                        ],
                        "global_attraction": 0.9,
                        "original_global_attaction": 4.1,
                        "name": "石蓮園有機農場",
                        "_id": "59e5a92cd63dcb19ac985b08",
                        "lat": 24.6323268,
                        "lng": 121.7190571,
                        "stay_time": "1",
                        "z_global_attraction": -1.14499699228239
                    }
                }
            ]
        };
        yield DBAsync_1.DBAsync.insert(coll, exp);
    });
}
a();
