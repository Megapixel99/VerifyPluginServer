const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  id: String,
  uuid: String,
  ign: String,
  code: String,
  verified: Boolean,
  role: String,
  mute: Boolean,
});

module.exports = {
  player: mongoose.model('player', playerSchema),
};
