angular.module('geonames')
    .config(function($provide, GEOAPI){
        $provide.constant('CAPITALINFO', GEOAPI + 'search');
    })

    .factory('capitalRequest', 
        function( gateway, CAPITALINFO ){
            return function(countryEntity){
                return gateway(CAPITALINFO, {
                        country: countryEntity.countryCode,
                        name_equals: countryEntity.capital,
                        type: 'json',
                        featureCode: 'PPLC'
                    });
            }
        })
;