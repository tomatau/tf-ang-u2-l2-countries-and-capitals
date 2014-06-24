angular.module('ccApp', [
  'ngRoute',
  'ngAnimate',
  'entities',
  'geonames'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/error', { template: 'Error during route change' }).otherwise({ redirectTo: '/' });
  }
]).run([
  '$rootScope',
  '$timeout',
  '$location',
  function ($rootScope, $timeout, $location) {
    $rootScope.$on('$routeChangeError', function (e) {
      $location.path('/error');
    });
    $rootScope.$on('$routeChangeStart', function () {
      $rootScope.isLoading = true;
    });
    $rootScope.$on('$routeChangeSuccess', function () {
      $timeout(function () {
        $rootScope.isLoading = false;
      }, 300);
    });
    $rootScope.activePage = function (page) {
      return page === ($location.path().substring(1) || '/');
    };
  }
]);
;
angular.module('entities', []).factory('countriesEntity', [
  '$filter',
  function ($filter) {
    var countries = [];
    return {
      set: function (data) {
        countries = data;
      },
      get: function () {
        return countries;
      },
      find: function (code) {
        return $filter('filter')(countries, { countryCode: code }).pop();
      }
    };
  }
]);
;
;
(function () {
  var apiRoot = 'http://api.geonames.org/', geoRoot = 'http://www.geonames.org/';
  ;
  angular.module('geonames', ['entities']).constant('GEOAPI', apiRoot).constant('GEOURL', geoRoot).constant('FLAG', geoRoot + 'flags/x/{{ code | lowercase }}.gif').constant('MAP', geoRoot + 'img/country/250/{{ code | uppercase }}.png').factory('gateway', [
    '$http',
    function ($http) {
      return function (url, params) {
        params = angular.extend({
          username: 'tomatao',
          formatted: true
        }, params || {});
        return $http({
          method: 'GET',
          url: url,
          params: params,
          cache: true
        }).error(function () {
          console.log('error', arguments);
        });
      };
    }
  ]);
  ;
}());
angular.module('geonames').config([
  '$provide',
  'GEOAPI',
  function ($provide, GEOAPI) {
    $provide.constant('COUNTRYINFO', GEOAPI + 'countryInfoJSON');
  }
]).factory('countryListRequest', [
  'gateway',
  'COUNTRYINFO',
  '$q',
  'countriesEntity',
  function (gateway, COUNTRYINFO, $q, countriesEntity) {
    return function (params) {
      var def = $q.defer();
      gateway(COUNTRYINFO, params).success(function (data) {
        countriesEntity.set(data.geonames);
        def.resolve(countriesEntity);
      });
      return def.promise;
    };
  }
]);
;
angular.module('geonames').config([
  '$provide',
  'GEOAPI',
  function ($provide, GEOAPI) {
    $provide.constant('CAPITALINFO', GEOAPI + 'search');
  }
]).factory('capitalRequest', [
  'gateway',
  'CAPITALINFO',
  function (gateway, CAPITALINFO) {
    return function (countryEntity) {
      return gateway(CAPITALINFO, {
        country: countryEntity.countryCode,
        name_equals: countryEntity.capital,
        type: 'json',
        featureCode: 'PPLC'
      });
    };
  }
]);
;
angular.module('geonames').config([
  '$provide',
  'GEOAPI',
  function ($provide, GEOAPI) {
    $provide.constant('NEIGHBOURS', GEOAPI + 'neighboursJSON');
  }
]).factory('neighborsListRequest', [
  'gateway',
  'NEIGHBOURS',
  function (gateway, NEIGHBOURS) {
    return function (countryEntity) {
      return gateway(NEIGHBOURS, { geonameId: countryEntity.geonameId });
    };
  }
]);
;
angular.module('geonames').factory('countryRepo', [
  'countryListRequest',
  'capitalDataDecorator',
  'neighborsDecorator',
  function (countryListRequest, capitalDataDecorator, neighborsDecorator) {
    return function countryRepo(countryCode) {
      return countryListRequest().then(function () {
        return capitalDataDecorator(countryCode);
      }).then(function () {
        return neighborsDecorator(countryCode);
      });
    };
  }
]).factory('capitalDataDecorator', [
  'capitalRequest',
  '$q',
  'countriesEntity',
  function (capitalRequest, $q, countriesEntity) {
    return function capitalDataDecorator(countryCode) {
      var def = $q.defer(), country = countriesEntity.find(countryCode);
      if (country == null)
        throw Error('Country not found');
      capitalRequest(country).success(function (data) {
        def.resolve(angular.extend(country, { capitalData: data.geonames.pop() }));
      });
      return def.promise;
    };
  }
]).factory('neighborsDecorator', [
  'neighborsListRequest',
  '$q',
  'countriesEntity',
  function (neighborsListRequest, $q, countriesEntity) {
    return function neighborsDecorator(countryCode) {
      var def = $q.defer(), country = countriesEntity.find(countryCode);
      if (country == null)
        throw Error('Country not found');
      neighborsListRequest(country).success(function (data) {
        def.resolve(angular.extend(country, { neighbors: data.geonames }));
      });
      return def.promise;
    };
  }
]);
;
angular.module('ccApp').config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: './js/intro/intro.html',
      controller: 'IntroCtrl'
    });
  }
]).controller('IntroCtrl', [
  '$scope',
  function ($scope) {
  }
]);
;
angular.module('ccApp').config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/countries', {
      templateUrl: './js/countries/list.html',
      controller: 'ListCtrl',
      resolve: {
        countries: [
          'countryListRequest',
          function (countryListRequest) {
            return countryListRequest();
          }
        ]
      }
    });
  }
]).controller('ListCtrl', [
  '$scope',
  'countries',
  '$location',
  '$interpolate',
  'COUNTRYURL',
  function ($scope, countries, $location, $interpolate, COUNTRYURL) {
    $scope.countryList = countries.get();
    $scope.goToCountry = function (countryCode) {
      $location.path($interpolate(COUNTRYURL)({ code: countryCode }));
    };
  }
]);
;
angular.module('ccApp').constant('COUNTRYURL', '/countries/{{ code }}/capital').config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/countries/:code/capital', {
      templateUrl: './js/countries/country.html',
      controller: 'CountryCtrl',
      resolve: {
        country: [
          'countryRepo',
          '$route',
          function (countryRepo, $route) {
            return countryRepo($route.current.params.code);
          }
        ]
      }
    });
  }
]).controller('CountryCtrl', [
  '$scope',
  'country',
  '$interpolate',
  'FLAG',
  'MAP',
  'COUNTRYURL',
  function ($scope, country, $interpolate, FLAG, MAP, COUNTRYURL) {
    $scope.country = country;
    function goTo(url, countryCode) {
      return $interpolate(url)({ code: countryCode });
    }
    $scope.countryUrl = goTo.bind(this, COUNTRYURL);
    $scope.flagUrl = goTo.bind(this, FLAG);
    $scope.mapUrl = goTo.bind(this, MAP);
  }
]);
;