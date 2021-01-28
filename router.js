// written by Seth Wheeler
const router = require('express').Router();
require('./env.js');
const methods = require('./methods.js');
const axios = require('axios');
const bearerAuth = require('./bearerAuth.js');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

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

router.get('/', (req, res) => {
  methods.getPlayers({}).then((players) => {
    let template = handlebars.compile(fs.readFileSync(path.resolve(`./viewStudents.hbs`)).toString());
    console.log({players});
    res.send(template({players}));
  }).catch((err) => {
    console.error(err.err);
    res.status(err.data.status).send("An Internal Server Error has occured, please look at the server logs for further information");
  });
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

router.post('/formstack', async (req, res) => {
  if (Number(req.body.FormID) === Number(process.env.FORM_ID)) {
    res.sendStatus(202);
    let ign = req.body['What is your minecraft username?'].split("\nfield_type")[0].replace(/\s+/g, '').split('=')[1];
    let id = req.body.Email.split("\nfield_type")[0].replace(/\s+/g, '').split('=')[1].split("@")[0];
    let code = null;
    try {
      let newPlayer = (await methods.createPlayer(id));
      code = (await methods.getPlayerCode(id));
      if (newPlayer.status === 202) {
        let userData = (await axios.post('https://api.mojang.com/profiles/minecraft', [ign])).data[0];
        if (userData) {
          let uuid = userData.id;
          if (!uuid.includes('-')) {
            uuid = uuid.substr(0,8)+"-"+uuid.substr(8,4)+"-"+uuid.substr(12,4)+"-"+uuid.substr(16,4)+"-"+uuid.substr(20);
          }
          await methods.verify(id, code, ign, uuid);
        }
      }
    } catch (e) {
      console.log('An error occured while creating the student');
      console.log({
        id,
        code,
        ign,
        error: e
      });
    }
  } else {
    res.sendStatus(403);
  }
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
