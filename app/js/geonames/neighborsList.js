angular.module('geonames')
    .config(function($provide, GEOAPI){
        $provide.constant('NEIGHBOURS', GEOAPI + 'neighboursJSON');
    })

    .factory('neighborsListRequest', 
        function( gateway, NEIGHBOURS, $q, countriesEntity ){

            return function(country){
                var def = $q.defer()
                    ,countryInfo = countriesEntity.find(country)
                    params = {
                        geonameId: countryInfo.geonameId
                    }
                ;
                gateway(NEIGHBOURS, params)
                    .success(function(data){
                        def.resolve(
                            angular.extend(countryInfo, {
                                neighbors: data.geonames
                            })
                        )
                    })
                return def.promise;
            }
        })
    ;