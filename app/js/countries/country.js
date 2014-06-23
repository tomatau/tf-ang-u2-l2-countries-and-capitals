angular.module('ccApp')
    .constant('COUNTRYURL', '/countries/{{ code }}')
    .config(function($routeProvider){
        $routeProvider.when('/countries/:country', {
            templateUrl: './js/countries/country.html',
            controller: 'CountryCtrl',
            resolve: { 
                // todo: build into 1 service
                country: [ 
                    'countryListRequest',
                    'capitalRequest',
                    'neighborsListRequest', 
                    '$route',
                    function(countryListRequest, capitalRequest, neighborsListRequest, $route){
                        var cntry = $route.current.params.country;

                        // make sure we have all countries (hopefully from cache)
                        return countryListRequest()
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
                                        return country; // resolve's return
                                    })
                            });
                    }]
            }
        })
    })
    .controller('CountryCtrl', function($scope, country, $interpolate, FLAG, MAP, COUNTRYURL){
        $scope.country = country;
        function goTo(url, countryCode){
            return $interpolate(url)({ code: countryCode });
        }
        $scope.countryUrl = goTo.bind(this, COUNTRYURL);
        $scope.flagUrl = goTo.bind(this, FLAG);
        $scope.mapUrl = goTo.bind(this, MAP);
    })
    ;