describe('Geonames - countryList', function () {
    // this is internal to the implementation
    // possibly a bad idea but we need to stub something to make the tests pass
    //  alternatively stub the httpRequest but then changing the gateway could break
    //  these tests...
    var gatewayStub = sinon.stub().returns({success: function(){}});

    // CONCLUSION:
    // We need to use both the http request in the tests as well as the gateway
    // because the gateway makes the request
    // so.. to avoid completely coupling ourselves to both of these implementation facts
    // we can.. make some tests mock stub gateway and some stub the request
    // this way we have only coupled part of the test suite to each
    // taking control of the situation and giving explicit parts

    beforeEach(module("geonames"));

    afterEach(function () {
        gatewayStub.reset();
    });

    /*
     * Each of the tests have been made with just jasmine and also with sinon-jasmine
     * the final test on this file shows also just sinon without the extra s-j assertions
     */

    describe('API Of Module', function () {

        /**
         * VERSION 1: Mocking out the gateway manually
         * 
         * Can't use jasmine spies as we need to return the success function
         *
         * This approach is very verbose for what we want...
         */
        xit('should return a deferred object', function () {
            module(function($provide){
                $provide.factory('gateway', function(){
                    return function(){
                        return {
                            success: function(){}
                        }
                    };
                });
            });
            inject(function (countryListRequest, $q) {
                expect(countryListRequest()).toImplement(
                    $q.defer().promise
                );
            })
        });

        /**
         * VERSION 2: Mocking out the httpRequest
         *
         * This is tieing us to the implementation that makes a httpRequest
         *     the gateway is another unit and shouldn't affect this test..
         *         the gateway is used by the countryList and now changing it
         *         will potentially break this test
         *         The gateway is another important module we use a lot
         *             it has agreed to give us a success method in it's API
         *             it never agreed to make a httpRequest, we might use localStorage...
         *     We can't see that impl from here in this test but we're not stubbing it out
         */
        it('should return a deferred object', function () {
            inject(function (countryListRequest, $q, $httpBackend) {
                $httpBackend.whenGET(/^http\S*countryInfoJSON/).respond(200);
                expect(countryListRequest()).toImplement(
                    $q.defer().promise
                );
            })
        });

        /**
         * VERSION 2: Mocking out the gateway with sinon
         *
         * Nice, we dont depend on the gateway's impl and it's cleaner than manual
         *     As long as it returns a success method it can do anything
         *     Also we can use the stub if necessary
         *     
         * Still exposing internal of using gateway depencency (success function)
         */
        it('should return a deferred object', function () {
            module(function($provide){
                $provide.factory('gateway', function(){ return gatewayStub; });
            });
            inject(function (countryListRequest, $q, $httpBackend) {
                expect(countryListRequest()).toImplement(
                    $q.defer().promise
                );
            })
        });
    });

    describe('Entity From API', function () {
        /**
         *
         * Set the 
         */
        it('should set the countriesEntity to array', function () {
            inject(function( countriesEntity, countryListRequest, $httpBackend ){
                var data = { geonames: [] };
                $httpBackend.whenGET(/^http\S*countryInfoJSON/).respond(200, data);
                spyOn(countriesEntity, 'set');

                countryListRequest();
                $httpBackend.flush();
                
                expect(countriesEntity.set).toHaveBeenCalledWith(data.geonames);
            })
        });

        xit('should set the countriesEntity to array from gateway call', function () {
            var gateway, def;
            // instead of all this, we can resolve the whenGET for COUNTRYINFO
            // then just asset the entity was set
            module(function($provide){
                $provide.factory('gateway', function($q){
                    def = $q.defer();
            // stub out the gateway to just return a promise
                    gateway = function(){
                        return def.promise;
                    }
            // make the promise pretend to be a $http one
            //      this is horrible it exposes internals
                    def.promise.success = def.promise.then;
                    return gateway;
                });
            });
            // now we can spy on the entity to make sure it was set
            inject(function (countryListRequest, countriesEntity, $rootScope){
                spyOn(countriesEntity, 'set');

                countryListRequest()
                // we need to resolve and digest it to make the success happen 
                def.resolve(1);
                $rootScope.$digest();

                expect(countriesEntity.set).toHaveBeenCalled()
            });
        });
    });

    describe('Request Using Gateway', function () {
        /**
         * VERSION 1: Mocking out the gateway using jasmine
         * 
         * This approach is good to mock the gateway... but hacky with jasmine :(
         * Using jasmine-matchers to improve assertions
         *
         * See below for improvements
         */
        xit('should accept params to customise the gateway request', function (done) {
            var gateway;
            module(function($provide){
                $provide.factory('gateway', function(){
                    gateway = function(){
                         gateway.call = jasmine.createSpy('gateway');
                         gateway.call.apply(gateway, arguments)
                         return {
                            success: function(){}
                         }
                    }
                    return gateway;
                });
            });
            inject(function( countryListRequest, COUNTRYINFO ){
                var params = {};
                countryListRequest(params);
                expect(gateway.call).toHaveBeenCalledWith(COUNTRYINFO, params);
            });
        });
        
        /**
         *  VERSION 2: Mocking out the gateway using sinon! <3
         * 
         * This approach requires just the sinon library to be loaded in the files list
         *
         * See next test for final improvement
         */
        xit('should accept params to customise gateway request', function () {
            module(function($provide){
                $provide.factory('gateway', function(){ return gatewayStub; });
            });
            inject(function( countryListRequest, COUNTRYINFO ){
                var params = {};
                countryListRequest(params);
                expect(gatewayStub.calledWith(COUNTRYINFO, params)).toEqual(true);
            });
        });
        
        /** 
         * VERSION 3: Using the jasmine sinon library for assertions
         *
         * Here we improve the assertions of sinon for jasmine
         *
         * NB. you must include version 0.3.* of jasmine sinon as karma-jasmine legacy
         */
        it('should accept params to customise gateway request', function () {
            module(function($provide){
                $provide.factory('gateway', function(){ return gatewayStub; });
            });
            inject(function( countryListRequest, COUNTRYINFO ){
                var params = {};
                countryListRequest(params);
                expect(gatewayStub).toHaveBeenCalledWith(COUNTRYINFO, params);
            });
        });
    });
    
});