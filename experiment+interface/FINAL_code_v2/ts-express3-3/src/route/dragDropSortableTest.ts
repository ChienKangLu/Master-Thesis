//reference https://jqueryui.com/sortable/
//reference https://jqueryui.com/draggable/#sortable
//reference https://api.jqueryui.com/draggable/#option-helper

import * as express from 'express';
import * as path from 'path';
let router = express.Router();
router.get('/', (req, res, next) => {

  res.render(path.resolve(__dirname + '/../../views/dragDropSortableTest'), {
  });
  res.end();

});
export default router;
