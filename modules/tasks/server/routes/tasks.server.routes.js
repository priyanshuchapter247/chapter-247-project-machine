'use strict';

/**
 * Module dependencies
 */
var tasksPolicy = require('../policies/tasks.server.policy'),
  tasks = require('../controllers/tasks.server.controller');

module.exports = function(app) {
  // Tasks Routes
  app.route('/api/projects/:projectId/tasks').all(tasksPolicy.isAllowed)
    .get(tasks.list)
    .post(tasks.create);

  app.route('/api/projects/:projectId/tasks/:taskId').all(tasksPolicy.isAllowed)
    .get(tasks.read)
    .put(tasks.update)
    .delete(tasks.delete);

  // Finish by binding the Task middleware
  app.param('taskId', tasks.taskByID);
};
