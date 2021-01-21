// written by Seth Wheeler
const router = require('express').Router();
require('./env.js');
const methods = require('./methods.js');
const bearerAuth = require('./bearerAuth.js');

router.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

router.get('/pong', (req, res) => {
  res.status(200).send('ping');
});

router.get('/beep', (req, res) => {
  res.status(200).send('boop');
});

router.get('/boop', (req, res) => {
  res.status(200).send('beep');
});

router.get('/verify/status/id/:id', bearerAuth, (req, res) => {
  methods.verifyPlayerStatus({id: req.params.id}, req.query.ign).then((data) => {
    res.status(data.status).send(data);
  }).catch((err) => {
    console.error(err.err);
    res.status(err.data.status).send(err.data);
  });
});

router.get('/verify/status/ign/:ign', bearerAuth, (req, res) => {
  methods.verifyPlayerStatus({ign: req.params.ign}, req.query.ign).then((data) => {
    res.status(data.status).send(data);
  }).catch((err) => {
    console.error(err.err);
    res.status(err.data.status).send(err.data);
  });
});

router.get('/verify/status/uuid/:uuid', bearerAuth, (req, res) => {
  methods.verifyPlayerStatus({uuid: req.params.uuid}, req.query.ign).then((data) => {
    res.status(data.status).send(data);
  }).catch((err) => {
    console.error(err.err);
    res.status(err.data.status).send(err.data);
  });
});

router.post('/add/id/:id', bearerAuth, (req, res) => {
  methods.createPlayer(req.params.id.toLowerCase()).then((data) => {
    res.status(data.status).send(data);
  }).catch((err) => {
    console.error(err.err);
    res.status(err.data.status).send(err.data);
  });
});

router.put("/change/role/:role/player/:player", bearerAuth, (req, res) => {
  methods.updatePlayerRole(req.params.player, req.params.role).then((data) => {
    res.status(data.status).send(data);
  }).catch((err) => {
    console.error(`${err.player} had: ${err.err}`);
    res.status(err.data.status).send(err.data);
  });
});

router.put('/verify/reset/code/ign/:ign', bearerAuth, (req, res) => {
  methods.resetPlayerCode(req.params.ign).then((data) => {
    res.status(data.status).send(data);
  }).catch((err) => {
    console.error(err.err);
    res.status(err.data.status).send(err.data);
  });
});

router.put('/verify/id/:id/code/:code/ign/:ign/uuid/:uuid', bearerAuth, (req, res) => {
  methods.verify(req.params.id, req.params.code, req.params.ign, req.params.uuid).then((data) => {
    res.status(data.status).send(data);
  }).catch((err) => {
    console.error(err.err);
    res.status(err.data.status).send(err.data);
  });
});

module.exports = router;
