;(function(){
    var apiRoot = 'http://api.geonames.org/',
        geoRoot = 'http://www.geonames.org/'
        ;

    angular.module('geonames', [ 'entities' ])
        .constant('GEOAPI', apiRoot)
        .constant('GEOURL', geoRoot)
        .constant('FLAG', geoRoot + 'flags/x/{{ code | lowercase }}.gif')
        .constant('MAP', geoRoot + 'img/country/250/{{ code | uppercase }}.png')

        .factory('gateway', function($http){
            return function(url, params){
                params = angular.extend({
                        formatted: true,
                        username: 'tomatao'
                    }, params || {});
                return $http({
                    method: 'GET',
                    cache: true,
                    params: params,
                    url: url
                }).error(function(){
                    console.log('error', arguments);
                });
            }
        })
        ;

}());