'use strict';

/**
 * Module dependencies
 */
var commentsPolicy = require('../policies/comments.server.policy'),
  comments = require('../controllers/comments.server.controller');

module.exports = function(app) {
  // Comments Routes
  app.route('/api/projects/:projectId/comments').all(commentsPolicy.isAllowed)
    .get(comments.list)
    .post(comments.create);

  app.route('/api/projects/:projectId/comments/:commentId').all(commentsPolicy.isAllowed)
    .get(comments.read)
    .put(comments.update)
    .delete(comments.delete);

  // Finish by binding the Comment middleware
  app.param('commentId', comments.commentByID);
};
