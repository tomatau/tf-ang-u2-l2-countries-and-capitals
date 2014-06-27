angular.module('ccApp')
    .config(function($routeProvider){
        $routeProvider.when('/countries', {
            templateUrl: './js/countries/list.html',
            controller: 'ListCtrl',
            resolve: { 
                countries: [
                    'countryListRequest', 
                    function(countryListRequest){
                        return countryListRequest();
                    }]
            }
        })
    })
    .controller('ListCtrl', 
            function($scope, countries, $location, $interpolate, COUNTRYURL){
        $scope.countryList = countries.get();
        $scope.goToCountry = function(countryCode){
            $location.path(
                $interpolate(COUNTRYURL)({ code: countryCode })
            );
        };
    })
    ;