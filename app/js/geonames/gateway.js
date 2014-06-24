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
                        username: 'tomatao',
                        formatted: true
                    }, params || {});
                return $http({
                    method: 'GET',
                    url: url,
                    params: params,
                    cache: true
                }).error(function(){
                    console.log('error', arguments);
                });
            }
        })
        ;

}());