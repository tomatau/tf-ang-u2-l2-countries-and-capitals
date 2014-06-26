angular.module('geonames')
    .factory('countryRepo', 
        function( countryListRequest, capitalDataDecorator, neighborsDecorator ){
            return function countryRepo(countryCode) {
                return countryListRequest()
                    .then(function(){
                        return capitalDataDecorator(countryCode);
                    })
                    .then(function(){
                        return neighborsDecorator(countryCode);
                    });
            }
        }
    )
    // these two decorators are currently only internal to this reop
    // but they are built in such a way they could be extracted and reused easily
    .factory('capitalDataDecorator',
        function( capitalRequest, $q, countriesEntity ){
            return function capitalDataDecorator(countryCode){
                var def = $q.defer(),
                    country = countriesEntity.find(countryCode);
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
        function(neighborsListRequest, $q, countriesEntity){
            return function neighborsDecorator(countryCode){
                var def = $q.defer(),
                    country = countriesEntity.find(countryCode);
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