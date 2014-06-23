angular.module('ccApp')
    .constant('COUNTRYURL', '#/countries/{{ code }}')
    .config(function($routeProvider){
        $routeProvider.when('/countries/:country', {
            templateUrl: './js/countries/country.html',
            controller: 'CountryCtrl',
            resolve: { 
                // could be built into 1 service
                country: [ 'countryListRequest', 'capitalRequest', 'neighborsListRequest', '$route',
                    function(countryListRequest, capitalRequest, neighborsListRequest, $route){
                        var cntry = $route.current.params.country;

                        return countryListRequest() // make sure we have all countries
                            // decorate request country with capital and neighbors 
                            .then(function(){
                                return capitalRequest(cntry)
                                    .then(function(country){
                                        return country;
                                    });
                            })
                            .then(function(country){
                                return neighborsListRequest(cntry)
                                    .then(function(country){
                                        return country; // FINAL RETURN
                                    })
                            });
                    }]
            }
        })
    })
    .controller('CountryCtrl', function($scope, country, $interpolate, FLAG, MAP, COUNTRYURL){
        $scope.country = country;
        $scope.countryUrl = function(code){
            return $interpolate(COUNTRYURL)({ code: code });
        };
        $scope.flagUrl = function(code){
            return $interpolate(FLAG)({ code: code });
        };
        $scope.mapUrl = function(code){
            return $interpolate(MAP)({ code: code });
        };
    })
    ;