angular.module('ccApp')
    .constant('COUNTRYURL', '/countries/{{ code }}/capital')
    
    .config(function($routeProvider){
        $routeProvider.when('/countries/:code/capital', {
            templateUrl: './js/countries/country.html',
            controller: 'CountryCtrl',
            resolve: { 
                country: [ 
                    'countryRepo',
                    '$route',
                    function(countryRepo, $route){
                        return countryRepo(
                            $route.current.params.code
                        );
                    }]
            }
        })
    })
    .controller('CountryCtrl', 
            function($scope, country, $interpolate, FLAG, MAP, COUNTRYURL){
        $scope.country = country;
        function goTo(url, countryCode){
            return $interpolate(url)({ code: countryCode });
        }
        $scope.countryUrl = goTo.bind(this, COUNTRYURL);
        $scope.flagUrl = goTo.bind(this, FLAG);
        $scope.mapUrl = goTo.bind(this, MAP);
    })
    ;