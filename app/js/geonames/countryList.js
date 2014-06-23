angular.module('geonames')
    .config(function($provide, GEOAPI){
        $provide.constant('COUNTRYINFO', GEOAPI + 'countryInfoJSON');
    })

    .factory('countryListRequest', 
        function( gateway, COUNTRYINFO, $q, countriesEntity ){
            
            return function(params){
                var def = $q.defer();
                gateway(COUNTRYINFO, params)
                    .success(function(data){
                        countriesEntity.set(data.geonames)
                        def.resolve(countriesEntity)
                    })
                return def.promise;
            }
        })
    ;