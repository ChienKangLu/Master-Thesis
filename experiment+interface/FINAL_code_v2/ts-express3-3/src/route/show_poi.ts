import * as express from 'express';
import * as path from 'path';
import { DB } from '../database/DB';
let router = express.Router();
router.get('/', (req, res, next) => {

  res.render(path.resolve(__dirname + '/../../views/show_poi'), {
  });
  res.end();

});
export default router;
