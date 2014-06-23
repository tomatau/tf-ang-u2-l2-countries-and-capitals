(function(){
    var apiRoot = 'http://api.geonames.org/',
        geoRoot = 'http://www.geonames.org/'
        ;

    angular.module('geonames', [ 'entities' ])
        .constant('GEOAPI', apiRoot)
        .constant('GEOURL', geoRoot)

        // .constant('NEIGHBOURS', apiRoot + 'neighboursJSON')
        // .constant('FLAGS', geoRoot + '/flags/x/{{ code }}.gif')

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
                    console.log('error', arguments)
                })
            }
        })
        ;

}());