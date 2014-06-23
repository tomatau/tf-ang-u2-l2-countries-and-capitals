angular.module('ccApp')
    .config(function($routeProvider){
        $routeProvider.when('/countries/:country', {
            templateUrl: './js/countries/country.html',
            controller: 'CountryCtrl',
            resolve: { 
                country: ['countryListRequest', 'capitalRequest', '$route',
                    function(countryListRequest, capitalRequest, $route){
                        return countryListRequest() // make sure we have all countries
                        .then(function(){
                            // decorate the country with capital
                            return capitalRequest($route.current.params.country)
                            .then(function(country){
                                return country;
                            });
                        });
                    }]
            }
        })
    })
    .controller('CountryCtrl', function($scope, country, $routeParams){
        $scope.country = country;
    })
    ;