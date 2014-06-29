angular.module('geonames')
    .factory('countryRepo', 
        function( countryListRequest, capitalDataDecorator, neighborsDecorator, countriesEntity ){
            return function countryRepo(countryCode) {
                return countryListRequest()
                    .then(function(){
                        return countriesEntity.find(countryCode);
                    })
                    .then(function(country){
                        return capitalDataDecorator(country);
                    })
                    .then(function(country){
                        return neighborsDecorator(country);
                    });
            }
        }
    )
    // these two decorators are currently only internal to this reop
    // but they are built in such a way they could be extracted and reused easily
    .factory('capitalDataDecorator',
        function( capitalRequest, $q ){
            return function capitalDataDecorator(country){
                var def = $q.defer();
                if (country == null) throw Error('Country not found');
                capitalRequest(country)
                    .success(function(data){
                        def.resolve(
                            angular.extend(country, {
                                capitalData: data.geonames.pop()
                            })
                        );
                    });
                return def.promise;
            }
        }
    )
    .factory('neighborsDecorator', 
        function(neighborsListRequest, $q){
            return function neighborsDecorator(country){
                var def = $q.defer();
                if (country == null) throw Error('Country not found');
                neighborsListRequest(country)
                    .success(function(data){
                        def.resolve(
                            angular.extend(country, {
                                neighbors: data.geonames
                            })
                        );
                    });
                return def.promise;
            }
        }
    )
;