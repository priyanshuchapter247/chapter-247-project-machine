(function () {
  'use strict';

  angular
    .module('projects')
    .controller('ProjectsController', ProjectsController);

  ProjectsController.$inject = ['$scope', '$state', 'projectResolve', 'Authentication', '$window', 'Notification', '$stateParams', 'commentResolve', 'CommentsService'];

  function ProjectsController($scope,$state, project, Authentication, $window, Notification, $stateParams, comment, CommentsService, comments ) {
    var vm = this;

    vm.project = project;
    vm.authentication = Authentication;
    vm.comment = comment;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;



    vm.comments = CommentsService.query();
    console.log(vm.comments);

    // Remove existing Comment
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.comment.$remove($state.go('comments.list'));
      }
    }

    // Save Comment
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.commentForm');
        return false;
      }
      console.log(vm.comment);
      // TODO: move create/update logic to service
      if (vm.comment._id) {
        vm.comment.$update(successCallback, errorCallback);
      } else {
        vm.comment.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        // $state.reload();
        vm.comments = CommentsService.query();


        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> comment saved successfully!' });
      }

      function errorCallback(res) {
      Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Project save error!' });
      }
    }


  }
}());
