describe('Geonames - gateway', function () {
    beforeEach(module("geonames"));

    describe('Constants', function () {
        it('should provide constants for requests', function () {
            inject(function (GEOAPI, GEOURL, FLAG, MAP) {
                expect(GEOAPI).toStartWith('http');
                expect(GEOURL).toStartWith('http');
                expect(FLAG).toBeNonEmptyString();
                expect(MAP).toBeNonEmptyString();
            })
        });
    });

    describe('Gateway', function () {
        it('should perform GET request to URL with format and username', function () {
            inject(function($httpBackend, gateway){
                var url = "test.url";
                $httpBackend
                    .expectGET(url + "?formatted=true&username=tomatao")
                    .respond(200);

                gateway(url);
                $httpBackend.verifyNoOutstandingExpectation();
            })
        });

        describe('$http arguments', function () {
            var defaultOptions = {
                method: 'GET',
                cache: true,
                params: {
                    formatted: true,
                    username: 'tomatao'
                },
                url: "test.url"
            };

            beforeEach(module(function($provide){
                /* HORRIBLE HACK!!! AHHHH!!!! WHY MUST I DO THIS!?!?!!?!!!!! */
                /* give me mocha and sinon back :'( */
                $provide.factory('$http', function(){
                    var $http = function(args){
                        $http.call = jasmine.createSpy('$http');
                        $http.call(args);
                        return {
                            error: function(){}
                        }
                    }
                    return $http;
                });
            }));

            it('should accept params for the request', function () {
                inject(function($httpBackend, $http, gateway){
                    var params = {
                            extra: "extra param"
                        };

                    gateway(defaultOptions.url, params);

                    expect($http.call).toHaveBeenCalledWith(
                        getExpectedOptions(params)
                    );
                })
            });

            function getExpectedOptions(params){
                var expectedParams = angular.extend(
                        defaultOptions.params, params
                    ),
                    expectOptions = angular.copy(defaultOptions);

                expectOptions.params = expectedParams;
                return expectOptions;
            }
        });
    });
});