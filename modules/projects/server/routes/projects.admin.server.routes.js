'use strict';

/**
 * Module dependencies
 */
var projectsPolicy = require('../policies/projects.admin.server.policy'),
  projects = require('../controllers/projects.admin.server.controller');

module.exports = function(app) {
  // Projects Routes
  app.route('/api/admin/projects').all(projectsPolicy.isAllowed)
    .get(projects.list)
    .post(projects.create);

  app.route('/api/admin/projects/:projectId').all(projectsPolicy.isAllowed)
    .get(projects.read)
    .put(projects.update)
    .delete(projects.delete);

  // Finish by binding the Project middleware
  app.param('projectId', projects.projectByID);
};
