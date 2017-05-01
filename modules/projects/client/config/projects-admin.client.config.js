(function () {
  'use strict';

  // Configuring the Projects Admin module
  angular
    .module('projects.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Projects',
      state: 'projects',
      type: 'dropdown',
      roles: ['admin']
    });

    Menus.addSubMenuItem('topbar', 'projects', {
      title: 'Manage Projects',
      state: 'admin.projects.list',
      roles: ['admin']
    });

    Menus.addSubMenuItem('topbar', 'projects', {
      title: 'Create Projects',
      state: 'admin.projects.create',
      roles: ['admin']
    });
  }
}());
