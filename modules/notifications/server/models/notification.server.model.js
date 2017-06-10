'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Notification Schema
 */
var NotificationSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Notification name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  users: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  msg: {
    type: String,
    default: '',
    required: 'Please fill Notification message',
    trim: true
  },
  href: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: false
  }
});

mongoose.model('Notification', NotificationSchema);
