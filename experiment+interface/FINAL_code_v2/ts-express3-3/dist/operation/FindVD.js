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
class FindVD {
    static find() {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield DBAsync_1.DBAsync.connectDBAsync("chapter7");
            let coll = yield DBAsync_1.DBAsync.coll(db, "VD_12");
            let VD = yield DBAsync_1.DBAsync.find(coll, {}, {});
            yield DBAsync_1.DBAsync.closeDB();
            return VD;
        });
    }
}
exports.FindVD = FindVD;
