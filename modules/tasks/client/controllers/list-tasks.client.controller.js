(function () {
  'use strict';

  angular
    .module('tasks')
    .controller('TasksListController', TasksListController);

  TasksListController.$inject = ['TasksService', 'Authentication'];

  function TasksListController(TasksService, Authentication) {
    var vm = this;

    vm.tasks = TasksService.query();
    vm.authentication = Authentication ; 
  }
}());
