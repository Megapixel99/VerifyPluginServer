// written by Seth Wheeler
const express = require('express');
require('./env.js');
const {nanoid} = require('nanoid');
const models = require('./dbModels.js');
const dbcon = require('./dbConnect.js');
const bearerAuth = require('./bearerAuth.js');
const app = express();

dbcon.connect();

app.set('json spaces', 2);
app.use(require('helmet')());

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

app.get('/pong', (req, res) => {
  res.status(200).send('ping');
});

app.get('/beep', (req, res) => {
  res.status(200).send('boop');
});

app.get('/boop', (req, res) => {
  res.status(200).send('beep');
});

app.get('/verify/status/id/:id', bearerAuth, (req, res) => {
  models.player.findOne({
    id: req.params.id.toLowerCase(),
  }).then((player) => {
    if (player) {
      res.status(200).json({
        id: player.id,
        ign: player.ign,
        verified: player.verified,
        role: player.role,
        message: null,
        error: null,
        status: 200,
      });
      return;
    }
    res.status(404).json({
      id: req.params.id.toLowerCase(),
      ign: null,
      verified: false,
      role: null,
      message: 'Player not found',
      error: null,
      status: 404,
    });
  }).catch((err) => {
    res.status(500).json({
      id: req.params.id,
      ign: null,
      verified: false,
      role: null,
      message: null,
      error: 'Internal Server Error',
      status: 500,
    });
  });
});

app.get('/verify/status/ign/:ign', bearerAuth, (req, res) => {
  models.player.findOne({
    ign: req.params.ign,
  }).then((player) => {
    if (player) {
      res.status(200).json({
        id: player.id,
        ign: player.ign,
        verified: player.verified,
        role: player.role,
        message: null,
        error: null,
        status: 200,
      });
      return;
    }
    res.status(404).json({
      id: req.params.id,
      ign: null,
      verified: false,
      role: null,
      message: 'Player not found',
      error: null,
      status: 404,
    });
  }).catch((err) => {
    res.status(500).json({
      id: req.params.id,
      ign: null,
      verified: false,
      role: null,
      message: null,
      error: 'Internal Server Error',
      status: 500,
    });
  });
});

app.get('/verify/status/uuid/:uuid', bearerAuth, (req, res) => {
  const conditions = { uuid: req.params.uuid };
  models.player.findOne(conditions).then((player) => {
    if (player) {
      res.status(200).json({
        id: player.id,
        ign: player.ign,
        verified: player.verified,
        role: player.role,
        message: null,
        error: null,
        status: 200,
      });
      if (player.ign !== req.query.ign && req.query.ign) {
        models.player.findOneAndUpdate(conditions, {
          $set: {
            ign: req.query.ign,
          }
        }, (updateErr) => {
          if (updateErr) {
            console.error(updateErr);
          }
        });
      }
      return;
    }
    res.status(404).json({
      id: req.params.id,
      ign: null,
      verified: false,
      role: null,
      message: 'Player not found',
      error: null,
      status: 404,
    });
  }).catch((err) => {
    res.status(500).json({
      id: req.params.id,
      ign: null,
      verified: false,
      role: null,
      message: null,
      error: 'Internal Server Error',
      status: 500,
    });
  });
});

app.post('/add/id/:id', bearerAuth, (req, res) => {
  models.player.findOne({
     id: req.params.id.toLowerCase()
  }).then((player) => {
    if (!player) {
      res.status(202).json({
        id: req.params.id.toLowerCase(),
        ign: null,
        verified: false,
        role: null,
        message: `Player with an id of ${req.params.id} will be created`,
        error: null,
        status: 202,
      });
      new models.player({
        id: req.params.id.toLowerCase(),
        uuid: null,
        ign: null,
        code: nanoid(8),
        verified: false,
        role: null,
        mute: false,
      }).save();
      return;
    }
    res.status(422).json({
      id: req.params.id,
      ign: null,
      verified: false,
      role: null,
      message: `Player with an id of ${req.params.id} already exsists`,
      error: null,
      status: 422,
    });
  }).catch((err) => {
    console.error(err);
    res.status(500).json({
      id: req.params.id,
      ign: null,
      verified: false,
      role: null,
      message: null,
      error: 'Internal Server Error',
      status: 500,
    });
  });
});

app.put("/change/role/:role/player/:player", bearerAuth, (req, res) => {
  let role = (req.params.role === "none" ? null : req.params.role);
  models.player.findOneAndUpdate({
  $or:[
        {ign: req.params.player},
        {id: req.params.player.toLowerCase()}
      ]
  }, {
  $set: {
      role,
    }
  }, { new: true }, (updateErr, player) => {
    console.log(player);
    console.log(updateErr);
    if (updateErr) {
      res.status(500).json({
        id: null,
        ign: req.params.ign,
        verified: false,
        role: null,
        message: null,
        error: 'Internal Server Error',
        status: 500,
      });
      return;
    }
    res.status(200).json({
      id: player.id,
      ign: req.params.ign,
      verified: player.verified,
      role: player.role,
      message: `Player role was changed.`,
      error: null,
      status: 200,
    });
  });
});

app.put('/verify/reset/code/ign/:ign', bearerAuth, (req, res) => {
  let code = nanoid(8);
  models.player.findOneAndUpdate({
    ign: req.params.ign
  }, {
    $set: {
      code
    }
  }, { new: true }, (updateErr, player) => {
    if (updateErr) {
      res.status(500).json({
        id: null,
        ign: req.params.ign,
        verified: false,
        role: null,
        message: null,
        error: 'Internal Server Error',
        status: 500,
      });
      return;
    }
    res.status(200).json({
      id: player.id,
      ign: req.params.ign,
      verified: player.verified,
      role: player.role,
      message: `Player code reset. New code is: ${code}`,
      error: null,
      status: 200,
    });
  });
});

app.put('/verify/id/:id/code/:code/ign/:ign/uuid/:uuid', bearerAuth, (req, res) => {
  let conditions = { id: req.params.id };
  models.player.findOne(conditions).then((player) => {
    if (player) {
      if (player.verified === true) {
        res.status(202).json({
          id: req.params.id,
          ign: player.ign,
          verified: true,
          role: player.role,
          message: null,
          error: `${req.params.id} is already verified`,
          status: 202,
        });
        return;
      }
      if (req.params.code === player.code) {
        models.player.findOneAndUpdate(conditions, {
          $set: {
            ign: req.params.ign,
            verified: true,
            role: null,
            uuid: req.params.uuid,
          }
        }, (updateErr) => {
          if (updateErr) {
            res.status(500).json({
              id: req.params.id,
              ign: null,
              verified: false,
              role: null,
              message: null,
              error: 'Internal Server Error',
              status: 500,
            });
            return;
          }
          res.status(200).json({
            id: player.id,
            ign: req.params.ign,
            verified: true,
            role: null,
            message: 'Player verified',
            error: null,
            status: 200,
          });
        });
        return;
      }
      res.status(422).json({
        id: player.id,
        ign: null,
        verified: false,
        role: null,
        message: 'Invalid Code',
        error: null,
        status: 422,
      });
      return;
    }
    res.status(404).json({
      id: req.params.id,
      ign: null,
      verified: false,
      role: null,
      message: 'Player not found',
      error: null,
      status: 404,
    });
  }).catch((err) => {
    res.status(500).json({
      id: req.params.id,
      ign: null,
      verified: false,
      role: null,
      message: null,
      error: 'Internal Server Error',
      status: 500,
    });
  });
});

app.use((req, res) => {
  res.status(404);

  if (req.accepts('json')) {
    res.json({
      status: 404,
      message: 'Page Not found',
    });
    return;
  }

  res.type('txt').send('Page Not found');
});

app.listen(3000);
