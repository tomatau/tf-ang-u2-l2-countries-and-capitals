describe('Geonames - gateway', function () {
    beforeEach(module("geonames"));

    /*
    This file splits into 3 sections:
     - constance: a bunch of URL strings the API expects this gateway to provide
     - the first section 'contracts' describes any agreements the gateway is making
        with anyone who uses it.. kinda like a 'public api'
     - second section http gateway describes the specific http functionality it needs to perform
     */

    describe('Constants', function () {
        it('should provide constants for requests', function () {
            inject(function (GEOAPI, GEOURL, FLAG, MAP) {
                expect(GEOAPI).toStartWith('http'); // could be https still
                expect(GEOURL).toStartWith('http');
                // maybe checking for image type (regex)
                // but then we'll need to keep manually adding possible extensions
                //  that could be a good thing
                expect(FLAG).toBeNonEmptyString();
                expect(MAP).toBeNonEmptyString();
            })
        });
    });

    describe('Contractual Agreement with APP', function () {
        it('should return a promise', function () {
            
        });

        it('should addsuccess and error functions to the returned promise', function () {
            
        });
    });

    // this implementation is specifically HTTP but our app shouldn't care
    //  maybe it could care at a congig stage but only need to include the word HTTPGateway
    //  Once .
    describe('HTTP Gateway', function () {
        // this could easily change, localStorage, WebSQL, IndexedDB
        it('should perform GET request to URL with format and username', function () {
            inject(function($httpBackend, gateway){
                var url = "test.url";
                $httpBackend.expectGET(/test\.url/).respond(200);
                gateway(url);
                $httpBackend.verifyNoOutstandingExpectation();
            })
        });

        // maybe don't need any of these... making sure we use HTTP
        //  support that's the current impl here
        //  
        //  On a side note:
        //  in the app config stage we could provide 'gateway' to be this (httpGateway)
        //  
        describe('$http arguments', function () {
            // not sure about this... lots of internals
            //  especially 
            // these could be important though, depends!
            // could just check that an object includes
            var url = "test.url";

            /**
             * VERSION 1: stubbing http and checking the arguments
             *
             * Digs into the implementation of the gateway
             * but we can trust $http to require this implementation anyway
             */
            it('should accept params for the request', function () {
                // unfortunately our stub needs to meet the promise requirements
                //  could be worth making a test helper function to 'make promise stub'
                var $httpStub = sinon.stub().returns({error: function(){}});
                module(function($provide){
                    $provide.factory('$http', function(){ return $httpStub; });
                })
                inject(function(gateway){
                    var params = {
                            extra: "extra param"
                        };
                    gateway(url, params);
                    // save the params, we know it's an object with a params key
                    expect($httpStub.getCall(0).args[0].params.extra).toBe(
                        params.extra
                    )
                })
            });

            /**
             * VERSION 2: Manually stub out the http to inspect the full options structure
             *
             * Very verbose, it also depends quite a lot on the options implamentation
             *
             * This could be good or bad as we might wanna enforce GET and cache
             *     as well as the default params (formatted and username)
             *
             * We could combine version 1 and version 2 if necessary
             */
            xit('should accept params for the request', function () {
                var defaultOptions = {
                    method: 'GET',
                    cache: true,
                    params: {
                        formatted: true,
                        username: 'tomatao'
                    },
                    url: url // not default but we're using url var
                };
                module(function($provide){
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
                });
                inject(function($httpBackend, $http, gateway){
                    var params = {
                            extra: "extra param"
                        };
                    gateway(defaultOptions.url, params);
                    expect($http.call).toHaveBeenCalledWith(
                        getExpectedOptions(params)
                    );
                })

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
});