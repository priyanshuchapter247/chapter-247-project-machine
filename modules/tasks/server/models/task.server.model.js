'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Task Schema
 */
var TaskSchema = new Schema({
  task_name: {
    type: String,
    default: '',
    required: 'Please fill Task name',
    trim: true
  },
  task_description: {
    type: String,
    default: '',
    required: 'Please fill Task name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  assigned_by: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  assigned_to: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  project: {
    type: Schema.ObjectId,
    ref: 'Project'
  },
  modified_on: {
    type: Date
  },
  status:{
    type: String,
    enum: ['completed', 'not completed'],
    default: ['not completed']
  }

});

mongoose.model('Task', TaskSchema);
