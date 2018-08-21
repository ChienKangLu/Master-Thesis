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
const mongodb = require("mongodb");
const DBAsync_1 = require("../database/DBAsync");
class FindGeometry {
    static nearSphere(lng, lat, maxDistance, notInIds) {
        return __awaiter(this, void 0, void 0, function* () {
            let notIn = [];
            for (let notInId of notInIds) {
                console.log("notInId:", notInId);
                let o_id = new mongodb.ObjectID(notInId);
                notIn.push(o_id);
            }
            let db = yield DBAsync_1.DBAsync.connectDBAsync("explore");
            let coll = yield DBAsync_1.DBAsync.coll(db, "geometry_poi");
            let pois = yield DBAsync_1.DBAsync.find(coll, {
                $and: [
                    { loc: {
                            $nearSphere: {
                                $geometry: {
                                    type: "Point",
                                    coordinates: [lng, lat]
                                },
                                $maxDistance: maxDistance
                            }
                        }
                    },
                    { _id: {
                            $nin: notIn
                        }
                    }
                ]
            }, {});
            yield DBAsync_1.DBAsync.closeDB();
            return pois;
        });
    }
    static polygon(coordinates) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield DBAsync_1.DBAsync.connectDBAsync("explore");
            let coll = yield DBAsync_1.DBAsync.coll(db, "geometry_poi");
            let pois = yield DBAsync_1.DBAsync.find(coll, {
                loc: {
                    $geoWithin: {
                        $polygon: coordinates
                    }
                }
            }, {});
            yield DBAsync_1.DBAsync.closeDB();
            return pois;
        });
    }
}
exports.FindGeometry = FindGeometry;
