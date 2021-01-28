// written by Seth Wheeler
const {nanoid} = require('nanoid');
const models = require('./dbModels.js');
const dbcon = require('./dbConnect.js');

dbcon.connect();

module.exports = {
  getPlayers(condition) {
    return models.player.find(condition).lean();
  },
  verifyPlayerStatus(condition, ign) {
    return new Promise(function(resolve, reject) {
      models.player.findOne(condition).then((player) => {
        if (player) {
          if (ign && player.ign !== ign) {
            models.player.findOneAndUpdate(condition, {
              $set: {
                ign: ign,
              }
            }, (updateErr) => {
              if (updateErr) {
                console.error(updateErr);
              }
            });
          }
          resolve({
            id: player.id,
            ign: (ign || player.ign),
            verified: player.verified,
            role: player.role,
            message: null,
            error: null,
            status: 200,
          });
        }
        resolve({
          id: null,
          ign: null,
          verified: false,
          role: null,
          message: 'Player not found',
          error: null,
          status: 404,
        });
      }).catch((err) => {
        reject({
          err: err,
          data: {
            id: null,
            ign: null,
            verified: false,
            role: null,
            message: null,
            error: 'Internal Server Error',
            status: 500,
          }
        });
      });
    });
  },
  getPlayerCode(id) {
    return new Promise(function(resolve, reject) {
      models.player.findOne({id}, {code: 1}).then(function (data) {
        resolve(data.code);
      }).catch(function (err) {
        reject(err);
      });
    });
  },
  createPlayer(id) {
    return new Promise(function(resolve, reject) {
      models.player.findOne({
         id,
      }).then((player) => {
        if (!player) {
          new models.player({
            id: id,
            uuid: null,
            ign: null,
            code: nanoid(8),
            verified: false,
            role: null,
            mute: false,
          }).save().then(() => {
            resolve({
              id: id,
              ign: null,
              verified: false,
              role: null,
              message: `Player with an id of ${id} will be created`,
              error: null,
              status: 202,
            });
          }).catch((err) => {
            reject({
              err: err,
              data: {
                id: id,
                ign: null,
                verified: false,
                role: null,
                message: null,
                error: 'Internal Server Error',
                status: 500,
              }
            });
          });
        } else {
          resolve({
            id: id,
            ign: null,
            verified: false,
            role: null,
            message: `Player with an id of ${id} already exsists`,
            error: null,
            status: 422,
          });
        }
      }).catch((err) => {
        reject({
          err: err,
          data: {
            id: id,
            ign: null,
            verified: false,
            role: null,
            message: null,
            error: 'Internal Server Error',
            status: 500,
          }
        });
      });
    });
  },
  updatePlayerRole(_player, _role) {
    return new Promise(function(resolve, reject) {
      let role = (_role === "none" ? null : _role);
      models.player.findOneAndUpdate({
      $or:[
            {ign: _player},
            {id: _player.toLowerCase()}
          ]
      }, {
      $set: {
          role,
        }
      }, { new: true }, (updateErr, player) => {
        if (updateErr) {
          reject({
            player: player,
            err: updateErr,
            data: {
              id: null,
              ign: null,
              verified: false,
              role: null,
              message: null,
              error: 'Internal Server Error',
              status: 500,
            }
          });
        }
        resolve({
          id: player.id,
          ign: player.ign,
          verified: player.verified,
          role: player.role,
          message: `Player role was changed.`,
          error: null,
          status: 200,
        });
      });
    });
  },
  resetPlayerCode(ign) {
    return new Promise(function(resolve, reject) {
      models.player.findOneAndUpdate({
        ign,
      }, {
        $set: {
          code: nanoid(8),
        }
      }, { new: true }, (updateErr, player) => {
        if (updateErr) {
          reject({
            err: updateErr,
            data: {
              id: null,
              ign: ign,
              verified: false,
              role: null,
              message: null,
              error: 'Internal Server Error',
              status: 500,
            }
          });
        }
        resolve({
          id: player.id,
          ign: ign,
          verified: player.verified,
          role: player.role,
          message: `Player code reset. New code is: ${player.code}`,
          error: null,
          status: 200,
        });
      });
    });
  },
  verify(id, code, ign, uuid) {
    let conditions = {id};
    return new Promise(function(resolve, reject) {
      models.player.findOne(conditions).then((player) => {
        if (player) {
          if (player.verified === true) {
            resolve({
              id: id,
              ign: player.ign,
              verified: true,
              role: player.role,
              message: null,
              error: `${id} is already verified`,
              status: 202,
            });
          }
          if (code === player.code) {
            models.player.findOneAndUpdate(conditions, {
              $set: {
                ign: ign,
                verified: true,
                role: null,
                uuid: uuid,
              }
            }, (updateErr) => {
              if (updateErr) {
                reject({
                  err: updateErr,
                  data: {
                    id: id,
                    ign: null,
                    verified: false,
                    role: null,
                    message: null,
                    error: 'Internal Server Error',
                    status: 500,
                  }
                });
              }
              resolve({
                id: player.id,
                ign: ign,
                verified: true,
                role: null,
                message: 'Player verified',
                error: null,
                status: 200,
              });
            });
          }
          resolve({
            id: player.id,
            ign: null,
            verified: false,
            role: null,
            message: 'Invalid Code',
            error: null,
            status: 422,
          });
        }
        resolve({
          id: id,
          ign: null,
          verified: false,
          role: null,
          message: 'Player not found',
          error: null,
          status: 404,
        });
      }).catch((err) => {
        reject({
          err: err,
          data: {
            id: id,
            ign: null,
            verified: false,
            role: null,
            message: null,
            error: 'Internal Server Error',
            status: 500,
          }
        });
      });
    });
  }
};
