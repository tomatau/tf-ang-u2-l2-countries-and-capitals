angular.module('entities', [])
    .factory('countriesEntity', function($filter){
        var countries = [];
        return {
            // todo: manual caching (not necessary)
            set: function(data){
                countries = data;
            },
            get: function(){
                return countries;
            },
            find: function(code){
                return $filter('filter')(countries, { countryCode: code }).pop();
            }
        }
    })