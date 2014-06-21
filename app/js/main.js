angular.module('ccApp', ['ngRoute', 'entities', 'geonames'])
    .config(function ($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    })
    ;