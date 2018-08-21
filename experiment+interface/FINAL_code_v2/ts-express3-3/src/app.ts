import * as express from 'express';
import * as session from "express-session";
import * as bodyParser from "body-parser";
import index from './route/index';
import show_poi from './route/show_poi';
import route_test from './test/route_test';
import route_test_hmm from './test/route_test_hmm';
import route_test_heap from './test/route_test_heap';
import trip from './route/trip';
import findpoi from './route/findpoi';
import findpair from './route/findpair';
import findexp from './route/findexp';
import findExceptEdge from './route/findExceptEdge';
import findVD from './route/findVD';
import google_route from './route/google_route';
import circleSlideTest from './route/circleSlideTest';
import index_v2 from './route/index_v2';
import index_v3 from './route/index_v3';
import index_v4 from './route/index_v4';
import lineSliderTest from './route/lineSliderTest';
import trip_v3 from './route/trip_v3';
import dragDropSortableTest from './route/dragDropSortableTest';
import explore from './route/explore';
import findAreaPois from './route/findAreaPois';
import loginAPI from './route/loginAPI';
import test from './route/test';
import saveRoute from './route/saveRoute';
import showRoute from './route/showRoute';
import * as path from 'path';


// Creates and configures an ExpressJS web server.
class App {
  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.set();
    this.routes();
  }

  private set():void{
    //this.express.set('views',path.join(__dirname,'views'));
    //console.log(path.join(__dirname, 'public'));
    //this.express.use(express.static(path.join(__dirname, 'public')));
    this.express.use('/public',express.static(path.resolve(__dirname+'/../public')));//express3-3/public
    this.express.use('/js',express.static(path.resolve(__dirname+'/client')));//express3-3/dist/client
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({extended:false}));

    // console.log(path.resolve(__dirname));
    //app.use(express.static(path.join(__dirname, 'public')));
    this.express.set('view engine','jade');
    
    //set session
    this.express.use(session({
      secret: "tripPlanning",
      resave: false,
      saveUninitialized: true,
      // cookie: { maxAge: 3600000,secure: false, httpOnly: true }
    }))
  
  }

  // Configure Express middleware.
  private middleware(): void {
  }

  // Configure API endpoints.
  private routes(): void {
    this.express.use('/', index);
    this.express.use('/show_poi', show_poi);
    this.express.use('/route_test_heap', route_test_heap);
    this.express.use('/route_test_hmm', route_test_hmm);
    this.express.use('/route_test', route_test);
    this.express.use('/trip', trip);
    this.express.use('/findpoi', findpoi);
    this.express.use('/findpair', findpair);
    this.express.use('/findexp', findexp);
    this.express.use('/findExceptEdge', findExceptEdge);
    this.express.use('/findVD', findVD);
    this.express.use('/google_route', google_route);
    this.express.use('/circleSlideTest', circleSlideTest);
    this.express.use('/index_v2', index_v2);
    this.express.use('/index_v3', index_v3);
    this.express.use('/index_v4', index_v4);
    this.express.use('/lineSliderTest', lineSliderTest);
    this.express.use('/trip_v3', trip_v3);
    this.express.use('/dragDropSortableTest', dragDropSortableTest);
    this.express.use('/explore', explore);
    this.express.use('/findAreaPois', findAreaPois);
    this.express.use('/loginAPI', loginAPI);
    this.express.use('/test', test);
    this.express.use('/saveRoute', saveRoute);
    this.express.use('/showRoute', showRoute);
  }
}
export default new App().express;//用 export 可以指派 function, objects 或 變數 給外部檔案引用。