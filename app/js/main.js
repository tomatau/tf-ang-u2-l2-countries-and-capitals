angular.module('ccApp', ['ngRoute', 'ngAnimate', 'entities', 'geonames'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/error', {
                template: "Error during route change"
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .run(function($rootScope, $timeout, $location){
        $rootScope.$on('$routeChangeError', function(e){
            $location.path('/error');
        });
        $rootScope.$on('$routeChangeStart', function(){
            $rootScope.isLoading = true;
        });
        $rootScope.$on('$routeChangeSuccess', function(){
            $timeout(function(){
                $rootScope.isLoading = false;
            }, 400);
        });
        $rootScope.activePage = function(page) {
            return (page === ($location.path().substring(1) || '/'));
        }
    })
    ;