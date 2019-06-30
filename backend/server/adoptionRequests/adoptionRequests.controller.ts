import * as bodyParser from 'body-parser';
import * as express from 'express';
// import * as expressJwt from 'express-jwt';

import adoptionRequestsModel from './adoptionRequests.model';

const router = express.Router();

// router.use(bodyParser.json());
// router.use(expressJwt({ secret: process.env.AUTH_SHARED_SECRET! }));

// router.get('/', async (req, res) => res.json(await animalsModel.listAll()));

// router.get('/available', async (req, res) =>
//   res.json(await animalsModel.listAllAvailable()),
// );

router.post('/', bodyParser.json(), async (req, res) =>
  res.json(await adoptionRequestsModel.create(req.body)),
);

// router.get('/:id', async (req, res) =>
//   res.json(await animalsModel.get(req.params.id)),
// );

// router.put('/:id', async (req, res) =>
//   res.json(await animalsModel.update(req.params.id, req.body)),
// );

export default router;