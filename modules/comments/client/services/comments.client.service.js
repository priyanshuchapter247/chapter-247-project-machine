// Comments service used to communicate Comments REST endpoints
(function () {
  'use strict';

  angular
    .module('comments')
    .factory('CommentsService', CommentsService);

  CommentsService.$inject = ['$resource', '$stateParams'];
  function CommentsService($resource, $stateParams) {

    return $resource('/api/projects/:projectId/comments/:commentId', {
      projectId: function id() {
               return    $stateParams.projectId
      },
      commentId: '@_id'
    }, {
      update: {
        method: 'PUT'
              }
    });
  }
}());
