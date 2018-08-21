"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const index_1 = require("./route/index");
const show_poi_1 = require("./route/show_poi");
const route_test_1 = require("./test/route_test");
const route_test_hmm_1 = require("./test/route_test_hmm");
const route_test_heap_1 = require("./test/route_test_heap");
const trip_1 = require("./route/trip");
const findpoi_1 = require("./route/findpoi");
const findpair_1 = require("./route/findpair");
const findexp_1 = require("./route/findexp");
const findExceptEdge_1 = require("./route/findExceptEdge");
const findVD_1 = require("./route/findVD");
const google_route_1 = require("./route/google_route");
const circleSlideTest_1 = require("./route/circleSlideTest");
const index_v2_1 = require("./route/index_v2");
const index_v3_1 = require("./route/index_v3");
const index_v4_1 = require("./route/index_v4");
const lineSliderTest_1 = require("./route/lineSliderTest");
const trip_v3_1 = require("./route/trip_v3");
const dragDropSortableTest_1 = require("./route/dragDropSortableTest");
const explore_1 = require("./route/explore");
const findAreaPois_1 = require("./route/findAreaPois");
const loginAPI_1 = require("./route/loginAPI");
const test_1 = require("./route/test");
const saveRoute_1 = require("./route/saveRoute");
const showRoute_1 = require("./route/showRoute");
const path = require("path");
class App {
    constructor() {
        this.express = express();
        this.middleware();
        this.set();
        this.routes();
    }
    set() {
        this.express.use('/public', express.static(path.resolve(__dirname + '/../public')));
        this.express.use('/js', express.static(path.resolve(__dirname + '/client')));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.set('view engine', 'jade');
        this.express.use(session({
            secret: "tripPlanning",
            resave: false,
            saveUninitialized: true,
        }));
    }
    middleware() {
    }
    routes() {
        this.express.use('/', index_1.default);
        this.express.use('/show_poi', show_poi_1.default);
        this.express.use('/route_test_heap', route_test_heap_1.default);
        this.express.use('/route_test_hmm', route_test_hmm_1.default);
        this.express.use('/route_test', route_test_1.default);
        this.express.use('/trip', trip_1.default);
        this.express.use('/findpoi', findpoi_1.default);
        this.express.use('/findpair', findpair_1.default);
        this.express.use('/findexp', findexp_1.default);
        this.express.use('/findExceptEdge', findExceptEdge_1.default);
        this.express.use('/findVD', findVD_1.default);
        this.express.use('/google_route', google_route_1.default);
        this.express.use('/circleSlideTest', circleSlideTest_1.default);
        this.express.use('/index_v2', index_v2_1.default);
        this.express.use('/index_v3', index_v3_1.default);
        this.express.use('/index_v4', index_v4_1.default);
        this.express.use('/lineSliderTest', lineSliderTest_1.default);
        this.express.use('/trip_v3', trip_v3_1.default);
        this.express.use('/dragDropSortableTest', dragDropSortableTest_1.default);
        this.express.use('/explore', explore_1.default);
        this.express.use('/findAreaPois', findAreaPois_1.default);
        this.express.use('/loginAPI', loginAPI_1.default);
        this.express.use('/test', test_1.default);
        this.express.use('/saveRoute', saveRoute_1.default);
        this.express.use('/showRoute', showRoute_1.default);
    }
}
exports.default = new App().express;
