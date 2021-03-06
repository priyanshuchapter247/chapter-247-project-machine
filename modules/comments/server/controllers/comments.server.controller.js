'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Comment = mongoose.model('Comment'),
  Project = mongoose.model('Project'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Comment
 */
exports.create = function(req, res) {
  // var comment = new Comment(req.body);
  // comment.user = req.user;
  //
  // comment.save(function(err) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.jsonp(comment);
  //   }
  // });

  var comment = new Comment({
      content : req.body.content,
      project    : req.params.projectId,
      user    : req.user
    });
    console.log(req.params.projectId);
    console.log(comment) ;
    comment.save(function(err, comment) {
      if (err) return res.send(err);
      Project.findById(req.params.projectId, function(err, project) {
        if (err) return res.send(err);
        project.comments.push(comment);
        project.save(function(err) {
          if (err) return res.send(err);
          res.json({ status : 'done' });
        });
      });
    });

};

/**
 * Show the current Comment
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var comment = req.comment ? req.comment.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  comment.isCurrentUserOwner = req.user && comment.user && comment.user._id.toString() === req.user._id.toString();

  res.jsonp(comment);
};

/**
 * Update a Comment
 */
exports.update = function(req, res) {
  var comment = req.comment;

  comment = _.extend(comment, req.body);

  comment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(comment);
    }
  });
};

/**
 * Delete an Comment
 */
exports.delete = function(req, res) {
  var comment = req.comment;

  comment.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(comment);
    }
  });
};

/**
 * List of Comments
 */
exports.list = function(req, res) {
  Comment.find({ project: req.project }).sort('-created').populate('user', 'displayName designation profileImageURL').populate('project', 'name').exec(function(err, comments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(comments);
    }
  });
};

/**
 * Comment middleware
 */
exports.commentByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Comment is invalid'
    });
  }

  Comment.findById(id).populate('user', 'displayName designation profileImageURL').populate('project', 'name').exec(function (err, comment) {
    if (err) {
      return next(err);
    } else if (!comment) {
      return res.status(404).send({
        message: 'No Comment with that identifier has been found'
      });
    }
    req.comment = comment;
    next();
  });
};
