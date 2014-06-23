angular.module('entities', [])
    // .factory('capitalEntity', function($filter){
    //     var countries = [];
    //     return {
    //         set: function(data){
    //             // manual caching here
    //             countries = data;
    //         },
    //         get: function(){
    //             return countries;
    //         },
    //         find: function(code){
    //             return $filter('filter')(countries, {
    //                 countryCode: code
    //             }).pop();
    //         },
    //         push: countries.push
    //     }
    // })