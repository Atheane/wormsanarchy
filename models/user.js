'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    avatar: {type: String, required: true},
    pseudo: {type: String, required: true, min: 3, max: 100, unique: true},
    dateInscription: {type: Date},
    active: {type: Boolean, required: true},
    maxScore: {type: Number}
  }, {collection: 'users'}
);

module.exports = mongoose.model('User', UserSchema);
