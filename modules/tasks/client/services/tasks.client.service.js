// Tasks service used to communicate Tasks REST endpoints
(function () {
  'use strict';

  angular
    .module('tasks')
    .factory('TasksService', TasksService);

  TasksService.$inject = ['$resource', '$stateParams'];

  function TasksService($resource, $stateParams) {
    return $resource('/api/projects/:projectId/tasks/:taskId', {
      projectId: '@projectId' ,
      taskId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
