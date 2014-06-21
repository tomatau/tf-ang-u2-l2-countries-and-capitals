angular.module('ccApp')
    .config(function($routeProvider){
        $routeProvider.when('/list', {
            templateUrl: './js/list/list.html',
            controller: 'ListCtrl'
        })
    })
    .controller('ListCtrl', function($scope){

    });