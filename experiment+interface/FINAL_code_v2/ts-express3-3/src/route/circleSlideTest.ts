import * as express from 'express';
import * as path from 'path';
let router = express.Router();
router.get('/', (req, res, next) => {

  res.render(path.resolve(__dirname + '/../../views/circleSlideTest'), {
  });
  res.end();

});
export default router;
