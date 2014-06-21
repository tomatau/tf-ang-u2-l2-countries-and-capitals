angular.module('ccApp', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    })
    ;