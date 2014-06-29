describe('Geonames - gateway', function () {
    var url = "test.url";
    
    beforeEach(module("geonames"));

    /*
    This file splits into 3 sections:
     - constants: a bunch of URL strings from the geonames API
     - the second section 'contracts' describes any agreements the gateway is making
        with other files that uses it.. kinda like a private api
     - third section 'http gateway' describes the specific http functionality
     */

    describe('Constants', function () {
        it('should provide constants for requests', function () {
            inject(function (GEOAPI, GEOURL, FLAG, MAP) {
                expect(GEOAPI).toStartWith('http'); // could be https still
                expect(GEOURL).toStartWith('http');
                // maybe checking for image file types using regex
                // but then we'll need to keep manually adding possible fo;e extensions
                //  that could be a good thing
                expect(FLAG).toBeNonEmptyString();
                expect(MAP).toBeNonEmptyString();
            })
        });
    });

    /**
     * Contracts
     *
     * implementation of interfaces 
     */
    describe('Contracts (Private API)', function () {
        xit('should return a promise', function () {
            inject(function( gateway, $httpBackend, $q ){
                $httpBackend.expectGET(/test\.url/).respond(200);
                expect(gateway(url)).toImplement($q.defer().promise);
                // if you're expecting _any_ http to happen, check it was what you expected
                $httpBackend.flush();
                $httpBackend.verifyNoOutstandingRequest();
            })
        });

        xit('should add success and error functions to the returned promise', function () {
            inject(function( gateway, $httpBackend ){
                var contract = {
                    success: function(){},
                    error: function(){}
                };
                $httpBackend.expectGET(/test\.url/).respond(200);
                expect(gateway(url)).toImplement(contract)
                $httpBackend.flush();
                $httpBackend.verifyNoOutstandingRequest();
            });
        });

        // Refactor, can just test it implements http instead of previous 2
        // have to make a request as the $http prototype doesn't expose the promise api
        it('should do what...', function (done) {
            inject(function( gateway, $httpBackend, $http ){
                $httpBackend.expectGET(/test\.url/).respond(200); // gateway on url
                $httpBackend.expectGET('').respond(200); // http on url
                expect(gateway(url)).toImplement($http.get(''));
                $httpBackend.flush();
                $httpBackend.verifyNoOutstandingRequest();
            });
        });
    });

    /*
        The Purpose of the Gateway in this application is to provide a single boundary,
        this gateway is also for HTTP, so it might be more suited with the name: HttpGateway
        but that would be an overkill right now.

        i.e. when this app communicates with the geonames API, it does it in one place, the gateway

        .: The gateway can be extended to add features for other data stores or swapped
            it just needs to keep to it's contracts (promise + success and error)

        So in the future, we might have a localStorageGateway or a WebSQL Gateway, maybe a
        CORS or an RPCgateway, PostMessageGateway, etc.. this could easily be swapped in;
        all we would need to do is:
             $provite.factory('gateway', function() { return RPCGateway; });
     */

    // Tests for the HTTP implementation
    describe('HTTP Gateway', function () {
        it('should perform GET request to URL with format and username', function () {
            inject(function($httpBackend, gateway){
                $httpBackend.expectGET(/test\.url/).respond(200);
                gateway(url);
                $httpBackend.flush();
                $httpBackend.verifyNoOutstandingExpectation();
            })
        });


        // The $http arguments tests are potentially all not needed.
        // 
        // We could suvive without them IMO
        describe('$http arguments', function () {
            var url = "test.url";

            /**
             * VERSION 1: stubbing http and checking the arguments
             *
             * Digs into the implementation of the gateway
             * but we can trust $http to require this implementation anyway
             */
            it('should accept params for the request', function () {
                // should really stub $http but our gateway http req only needs 'error()'
                var $httpStub = sinon.stub().returns( { error: function(){} } );
                //  could be worth making a test helper function to 'makePromiseStub()'
                module(function($provide){
                    $provide.factory('$http', function(){ return $httpStub; });
                })
                inject(function(gateway){
                    var params = { extra: "extra param" };
                    gateway(url, params);
                    expect( $httpStub.getCall(0).args[0].params.extra )
                        .toBe( params.extra )
                })
            });

            /**
             * VERSION 2: Manually stub out the http to inspect the full options structure
             *
             * Very verbose, it also depends quite a lot on the options choices,
             * version 1 works very similarly and again we coulc combine the two techniques
             *
             * This could be good or bad as we might wanna enforce GET and cache
             *     as well as the default params (formatted and username)
             *
             * We could combine version 1 and version 2 if necessary: 
             *     - either method of stubbing
             *     - either method of assertion
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
                            return {  error: function(){} };
                        }
                        return $http;
                    });
                });
                inject(function($http, gateway){
                    var params = {
                            extra: "extra param"
                        };
                    gateway(defaultOptions.url, params);
                    expect($http.call).toHaveBeenCalledWith(
                        getExpectedOptions(params)
                    );
                })
                /**
                 * Create and return an options object
                 * extend the default params (angular.extend is not deep) then
                 * add the params onto a copy of the default options
                 * 
                 * @return {object}        options object with new params
                 */
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