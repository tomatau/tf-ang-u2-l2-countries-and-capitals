angular.module('geonames')
    .config(function($provide, GEOAPI){
        $provide.constant('CAPITALINFO', GEOAPI + 'search');
    })

    .factory('capitalRequest', 
        function( gateway, CAPITALINFO, $q, countriesEntity ){
            // decorates the given country with a capitalData object
            return function(country){
                var def = $q.defer()
                    ,countryInfo = countriesEntity.find(country) // hacky
                    ,params = {
                        country: country,
                        name_equals: countryInfo.capital,
                        type: 'json',
                        featureCode: 'PPLC'
                    };
                gateway(CAPITALINFO, params)
                    .success(function(data){ // make this external
                        def.resolve(
                            angular.extend(countryInfo, {
                                capitalData: data.geonames.pop()
                            })
                        );
                    });
                return def.promise;
            }
        })
    ;