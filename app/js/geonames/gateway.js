(function(){
    var apiRoot = 'http://api.geonames.org/',
        geoRoot = 'http://www.geonames.org/'
        ;

    angular.module('geonames', [ 'entities' ])

        .constant('COUNTRYINFO', apiRoot + 'countryInfoJSON')
        .constant('NEIGHBOURS', apiRoot + 'neighboursJSON')
        .constant('SEARCH', apiRoot + 'search')
        .constant('FLAGS', geoRoot + '/flags/x/{{ code }}.gif')

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

        .factory('countryInfoRequest', 
            function(gateway, COUNTRYINFO, $q, countriesEntity){
                return function(params){
                    var def = $q.defer();
                    gateway(COUNTRYINFO, params)
                        .success(function(data){
                            // this could be trouble as use this service for indiv cities??
                            countriesEntity.set(data.geonames)
                            def.resolve(countriesEntity)
                        })
                    return def.promise;
                }
            })
        ;

}());