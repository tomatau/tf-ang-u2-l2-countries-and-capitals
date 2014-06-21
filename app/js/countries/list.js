angular.module('ccApp')
    .config(function($routeProvider){
        $routeProvider.when('/countries', {
            templateUrl: './js/countries/list.html',
            controller: 'ListCtrl',
            resolve: { 
                countries: ['countryInfoRequest', 
                    function(countryInfoRequest){
                        // promise resolves to the countriesEntity
                        return countryInfoRequest();
                    }]
            }
        })
    })
    .controller('ListCtrl', function($scope, countries){
        // console.log(countries.get())
        $scope.countryList = countries.get();
        // countries.then(function(){
        //     console.log(arguments);
        // })
    });