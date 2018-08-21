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
const Tool_1 = require("../algorithm/Tool");
class DBAsync {
    static connectDBAsync(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            let MongoClient = mongodb.MongoClient;
            DBAsync.db = yield MongoClient.connect(`mongodb://localhost:27017/${dbName}`);
            Tool_1.default.sysmsg("mongodb is running!");
            return DBAsync.db;
        });
    }
    static coll(db, collName) {
        return __awaiter(this, void 0, void 0, function* () {
            let coll = db.collection(collName);
            return coll;
        });
    }
    static find(coll, query, field) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield coll.find(query, field).toArray();
            return data;
        });
    }
    static findbyId(coll, _id) {
        return __awaiter(this, void 0, void 0, function* () {
            let o_id = new mongodb.ObjectID(_id);
            let data = yield coll.find({ "_id": o_id }).toArray();
            return data;
        });
    }
    static insert(coll, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield coll.insertOne(data);
        });
    }
    static insertMany(coll, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield coll.insertMany(data);
        });
    }
    static create_field(coll, _id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let o_id = new mongodb.ObjectID(_id);
            yield coll.updateOne({ "_id": o_id }, { "$set": data });
        });
    }
    static push_field(coll, _id, fieldName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let o_id = new mongodb.ObjectID(_id);
            yield coll.update({ "_id": o_id }, { "$push": {
                    [fieldName]: data
                }
            });
        });
    }
    static drop(coll) {
        return __awaiter(this, void 0, void 0, function* () {
            yield coll.drop();
        });
    }
    static closeDB() {
        return __awaiter(this, void 0, void 0, function* () {
            yield DBAsync.db.close();
            Tool_1.default.sysmsg("mongodb is closed!");
        });
    }
}
exports.DBAsync = DBAsync;
