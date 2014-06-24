angular.module('geonames')
    .config(function($provide, GEOAPI){
        $provide.constant('NEIGHBOURS', GEOAPI + 'neighboursJSON');
    })

    .factory('neighborsListRequest', 
        function( gateway, NEIGHBOURS, $q, countriesEntity ){
            // decorates the given country with a neightbors array
            return function(country){
                var def = $q.defer()
                    ,countryInfo = countriesEntity.find(country) // hacky
                    ,params = {
                        geonameId: countryInfo.geonameId
                    }
                ;
                gateway(NEIGHBOURS, params)
                    .success(function(data){ // make this external
                        def.resolve(
                            angular.extend(countryInfo, {
                                neighbors: data.geonames
                            })
                        );
                    });
                return def.promise;
            }
        })
    ;