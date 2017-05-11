'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
  content: {
    type: String,
    default: '',
    required: 'Please post some comments',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  project: {
    type: Schema.ObjectId,
    ref: 'Project'
  }

});

mongoose.model('Comment', CommentSchema);
