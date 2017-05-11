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

  created_by: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  team_member: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
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

  start_date : {
    type : Date
   },
   deadline : {
    type : Date
   },
   technology: {
    type: [{
      type: String,
      enum: ['PHP', 'JAVA','NODE JS','ANGULAR JS','MYSQL','MEAN STACK','WORDPRESS']
    }],
    default: ['PHP'],
    required: 'Please provide at least one phase'
  },

  login_creds: {
    type: String,
    default: '',
    trim: true
  },
  comments : [{
    type: Schema.ObjectId,
    ref: 'Comment'
  }],
  progress : {
    type : Number,
    default : 0
  },
  active:{
    type : Boolean,
    default: true
  }
});

mongoose.model('Project', ProjectSchema);
