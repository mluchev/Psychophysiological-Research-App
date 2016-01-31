// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

    .run(function ($ionicPlatform, $rootScope, $window) {
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                $rootScope.hideBackButton = false;
                if (toState.name === 'app.taskResults'
                    || toState.name === 'app.tasks') {
                    $rootScope.hideBackButton = true;
                } else {
                    $rootScope.hideBackButton = false;
                }
            })
//        $ionicPlatform.ready(function () {
//            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//            // for form inputs)
//            if (window.cordova && window.cordova.plugins.Keyboard) {
//                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//                cordova.plugins.Keyboard.disableScroll(true);
//
//            }
//            if (window.StatusBar) {
//                // org.apache.cordova.statusbar required
//                StatusBar.styleDefault();
//            }
//        });
//
//
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.views.maxCache(0);
        $ionicConfigProvider.views.forwardCache(true);

        $stateProvider
            .state('app', {
                cache: false,
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })
            .state('app.tasks', {
                cache: false,
                url: '/tasks',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/tasks.html',
                        controller: 'TasksCtrl',
                        controllerAs: 'vm'
                    }
                }
            })

            .state('app.taskConfig', {
                url: '/tasks/:taskId/config',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/config.html',
                        controller: 'TaskConfigCtrl',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.taskExecute', {
                cache: false,
                url: '/tasks/:taskId/execute',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/taskExecute.html',
                        controller: 'TaskExecuteCtrl',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    taskParams: null
                }
            })
            .state('app.taskResults', {
                url: '/tasks/:taskId/results',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/taskResults.html',
                        controller: 'TaskResultsCtrl',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    taskParams: null,
                    taskResults: null
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/tasks');
    });
