'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Project name',
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
  description: {
    type: String,
    default: '',
    trim: true
  },
  phase: {
    type: [{
      type: String,
      enum: ['Planning', 'Start','Designing','Development','Testing & Changes','Final Edits','Complete/Launched','Launched/Fixes','Delivered/Archived']
    }],
    default: ['Planning'],
    required: 'Please provide at least one phase'
  },
   deadline : {
    type : Date
   },
   team : {
    type : [{
      type : Schema.ObjectId,
      ref: 'User'
    }]
   }
});

mongoose.model('Project', ProjectSchema);
