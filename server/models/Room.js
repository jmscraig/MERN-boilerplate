const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Default name"
  },
  address: {
    type: String,
    default: "123 Street"
  }
});

module.exports = mongoose.model('Room', RoomSchema);
