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
  project_owners: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
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
      enum: ['Planning', 'Start', 'Designing', 'Development', 'Testing', 'Final', 'Complete', 'Launched', 'Delivered']
    }],
    default: ['Planning'],
    required: 'Please provide at least one phase'
  },

  start_date: {
    type: Date
  },
  deadline: {
    type: Date
  },
  technology: {
    type: [{
      type: String,
      enum: ['PHP', 'JAVA', 'NODE JS', 'ANGULAR JS', 'MYSQL', 'MEAN STACK', 'WORDPRESS']
    }],
    default: ['PHP'],
    required: 'Please provide at least one phase'
  },

  login_creds: {
    type: String,
    default: '',
    trim: true
  },
  comments: [{
    type: Schema.ObjectId,
    ref: 'Comment'
  }],
  tasks: [{
    type: Schema.ObjectId,
    ref: 'Task'
  }],
  progress: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  important_link: {
    type: String
  },
  project_files:[{
    url:{
      type: String,
      trim: true,
      required: true
    },
    original_name: {
      type: String,
      trim: true,
      required: true
    },
    upload_by: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    date_uploaded:{
      type: Date,
      default: Date.now
    },
    file_type:{
      type: String
    }
  }]
});

ProjectSchema.pre('remove', function(next) {
    // Remove all the assignment docs that reference the removed project.
    this.model('Comment').remove({ project: this._id }, next);
});

mongoose.model('Project', ProjectSchema);
