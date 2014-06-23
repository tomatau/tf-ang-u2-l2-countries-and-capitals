angular.module('ccApp')
    .config(function($routeProvider){
        $routeProvider.when('/countries', {
            templateUrl: './js/countries/list.html',
            controller: 'ListCtrl',
            resolve: { 
                countries: ['countryListRequest', 
                    function(countryListRequest){
                        // promise resolves to the countriesEntity
                        return countryListRequest();
                    }]
            }
        })
    })
    .controller('ListCtrl', function($scope, countries){
        $scope.countryList = countries.get();
    })
    ;