(function () {
  'use strict';

  angular
    .module('projects')
    .controller('ProjectsListController', ProjectsListController);

  ProjectsListController.$inject = ['ProjectsService', 'Authentication'];

  function ProjectsListController(ProjectsService, Authentication) {
    var vm = this;

    vm.projects = ProjectsService.query();
    vm.authentication = Authentication;

  }
}());
