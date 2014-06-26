angular.module('geonames')
    .config(function($provide, GEOAPI){
        $provide.constant('NEIGHBOURS', GEOAPI + 'neighboursJSON');
    })

    .factory('neighborsListRequest', 
        function( gateway, NEIGHBOURS ){
            return function(countryEntity){
                return gateway(NEIGHBOURS, {
                        geonameId: countryEntity.geonameId
                    });
            }
        })
    ;