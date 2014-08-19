angular.module('geonames')
    .factory('countryRepo', 
        function( 
            countryListRequest, 
            capitalDataDecorator, 
            neighborsDecorator, 
            countriesEntity,
            $q
        ){
            return function countryRepo(countryCode) {
                // convert to 'all' call
                return countryListRequest()
                    .then(function(){
                        var country = countriesEntity.find(countryCode);
                        return $q.all([
                            capitalDataDecorator(country), neighborsDecorator(country)
                        ]).then(function () {
                            return country;
                        });
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