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
                        return { success: function(){} }
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
         * Nice, although: this is tieing us to the implementation that makes a httpRequest
         *     the gateway is another unit and shouldn't affect this test..
         *         the gateway is used by the countryList and now changing the gateway
         *         will potentially break this test
         *         The gateway is another important module we use a lot
         *             it has agreed to give us a success method in it's API
         *             it never agreed to make a httpRequest, it might use localStorage...
         *     We can't see that impl from here in this test but we're not stubbing it out
         */
        xit('should return a deferred object', function () {
            inject(function (countryListRequest, $q, $httpBackend) {
                $httpBackend.whenGET(/^http\S*countryInfoJSON/).respond(200);
                expect(countryListRequest()).toImplement(
                    $q.defer().promise
                );
            })
        });

        /**
         * VERSION 3 Mocking out the gateway with sinon
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
         * We know that this should set the countriesEntity
         *
         * but we have to either stub out the request or the gateway call
         * otherwise we'll depend on the API working for this test to pass...
         *     this is testing this unit, not the integration!
         */
        
        /**
         * VERSION 1: stubbing out the http request
         *
         * This is a quick and simple way to prevent the request to the API
         *     but what if the countryListRequest uses JSONP or localStorage?..
         *     this unit uses the gateway, not the $http
         *
         * we also don't really have a choice but to couple ourselves to the data structure
         *
         * Another point is thay we test the use of the COUNTRYINFO url in another test
         *     so we don't really need to do it here, we just need to make sure
         *     that the resolve from the gateway's promise sets the entity!
         */
        xit('should set the countriesEntity to array from countryInfoJSON', function () {
            inject(function( countriesEntity, countryListRequest, $httpBackend ){
                var data = { geonames: [] };
                $httpBackend.whenGET(/^http\S*countryInfoJSON/).respond(200, data);
                spyOn(countriesEntity, 'set');

                countryListRequest();
                $httpBackend.flush();
                
                expect( countriesEntity.set ).toHaveBeenCalledWith( data.geonames );
            })
        });


        /**
         * VERSION 2: stub out the gateway with jasmine
         * 
         * this is very verbose and complicated
         * but it is making sure that the gateway's resolve is used to set the entity
         */
        xit('should set the countriesEntity to array from gateway call', function () {
            var gateway, def, data = { geonames: []};
            module(function($provide){
                $provide.factory('gateway', function($q){
                    def = $q.defer();
                    gateway = function(){
                        return def.promise;
                    }
                    def.promise.success = def.promise.then;
                    return gateway;
                });
            });
            inject(function (countryListRequest, countriesEntity, $rootScope){
                spyOn(countriesEntity, 'set');

                countryListRequest()
                // we need to resolve and digest it to make the success happen 
                def.resolve(data);
                $rootScope.$digest();

                expect( countriesEntity.set ).toHaveBeenCalledWith( data.geonames );
            });
        });

        /**
         * VERSION 3: stub out the gateway with sinon
         *
         * this is still very verbose, testing the success callback is just a pain!
         */
        it('should set the countriesEntity to array from gateway call', function () {
            var data = { geonames: []},
                successFn,
                gatewayStub = sinon.stub().returns({
                    success: function(fn){
                        successFn = fn;
                    } });
            module(function($provide){
                $provide.factory('gateway', function(){ return gatewayStub; });
            });
            inject(function(countryListRequest, countriesEntity){
                var spy = sinon.spy(countriesEntity, 'set');

                countryListRequest();
                successFn(data);
                expect( countriesEntity.set ).toHaveBeenCalledWith( data.geonames );
            })
        });
    });

    /**
     * Tests for how this module works with the gateway
     *
     * We may wish to use something other than the gateway in the future
     *     but we need to trust something... either $http or gateway
     *     and gateway is being used as a layer of protection 
     *     as we can make diferent gateways and change $provider's reference
     *         e.g. $provider.factory('gateway', -> localStorageGateway)
     */
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
                expect( gateway.call ).toHaveBeenCalledWith( COUNTRYINFO, params );
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