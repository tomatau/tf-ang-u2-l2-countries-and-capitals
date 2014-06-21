angular.module('entities', [])
    .factory('countriesEntity', function(){
        var countries = [];
        return {
            set: function(data){
                // do some stuff?
                countries = data;
            },
            get: function(){
                return countries;
            },
            push: countries.push
        }
    })