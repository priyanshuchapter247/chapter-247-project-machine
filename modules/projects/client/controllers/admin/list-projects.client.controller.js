(function () {
  'use strict';

  angular
    .module('projects.admin')
    .controller('ProjectsAdminListController', ProjectsAdminListController);

  ProjectsAdminListController.$inject = ['ProjectAdminService'];

  function ProjectsAdminListController(ProjectAdminService) {
    var vm = this;

    vm.projects = ProjectAdminService.query();
  }
}());
