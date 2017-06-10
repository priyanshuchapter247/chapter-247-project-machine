(function () {
  'use strict';

  angular
    .module('projects')
    .controller('ProjectsController', ProjectsController);

  ProjectsController.$inject = ['$scope', '$state', 'Upload', 'projectResolve', 'Authentication', '$window', 'Notification', '$stateParams', 'commentResolve', 'CommentsService', '$timeout', '$http', '$location', '$anchorScroll'];

  function ProjectsController($scope, $state, Upload, project, Authentication, $window, Notification, $stateParams, comment, CommentsService, $timeout, $http, $location, $anchorScroll) {
    var vm = this;

    vm.project = project;
    vm.authentication = Authentication;
    vm.comment = comment;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.comments = [];

    $scope.gotoBottom = function() {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash('bottom');

            // call $anchorScroll()
            $anchorScroll();
          };

// file uploadfile
$scope.uploadFiles = function (files) {
        $scope.files = files;
        if (files && files.length) {
            Upload.upload({
                url: '/api/projects/'+ $stateParams.projectId +'/upload',
                data: {
                    files : files
                }
            }).then(function (response) {
                $timeout(function () {
                    $scope.result = response.data;
                });
            }, function (response) {
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + response.data;
                }
            }, function (evt) {
                $scope.progress =
                    Math.min(100, parseInt(100.0 * evt.loaded / evt.total));


                  setTimeout(function(){
                    $scope.getProjectFilesByID = function() {
                $http.get("/api/projects/" + $stateParams.projectId).then(function(response){
                    console.log("get");
                    vm.project.project_files = response.data.project_files;
                });
                }
                  $scope.getProjectFilesByID();

                  },1000);
            });
        }
    };
// comment module create
    vm.comments = CommentsService.query();
    console.log(vm.comments);

    // Remove existing Comment
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.comment.$remove();
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
        setTimeout(function () {
        //   vm.comments = CommentsService.query();
        $scope.commentById = function() {
          $http.get("/api/projects/" + $stateParams.projectId +"/comments").then(function(response){
              console.log("get");
        vm.comments = response.data;
              });
         }
      $scope.commentById();
         }, 1000);
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> comment saved successfully!' });

      }

      function errorCallback(res) {
      Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Project save error!' });
      }
    }


  }
}());
