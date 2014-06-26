describe('Geonames - countryList', function () {
    var gatewaySpy, successSpy;

    beforeEach(module("geonames"));

    describe('API', function () {
        beforeEach(module(function($provide){
            gatewaySpy = jasmine.createSpy('$http');
            successSpy = jasmine.createSpy('success');

            // turn gateway into a spy that returns a success spy
            $provide.factory('gateway', function(){
                var gateway = function(url, params){
                    gateway.call = gatewaySpy;
                    gateway.call(url, params);
                    return {
                        success: successSpy
                    }
                }
                return gateway;
            });
        }));

        it('should return a deferred object', function () {
            inject(function (countryListRequest, $q) {
                expect(countryListRequest()).toImplement(
                    $q.defer().promise
                );
            })
        });
    });

    describe('Entity', function () {
        it('should set the countriesEntity to array from gateway call', function () {
            inject(function( countriesEntity, countryListRequest, $httpBackend ){
                var data = { geonames: [] };
                $httpBackend.whenGET(/^http/).respond(200, data);
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

    it('should accept params to customise gateway request', function () {
        // var gateway;
        // module(function($provide){
        //     $provide.factory('gateway', function(){
        //         gateway = function(){
        //              gateway.call = jasmine.createSpy('gateway');
        //              gateway.call.apply(gateway, arguments)
        //              return {
        //                 success: function(){}
        //              }
        //         }
        //         return gateway;
        //     });
        // })
        var stub = sinon.stub().returns({success: function(){}});
        module(function($provide){
            $provide.factory('gateway', function(){
                return stub;
            });
        });
        inject(function( countryListRequest, COUNTRYINFO ){
            var params = {};

            countryListRequest(params);

            expect(stub).toHaveBeenCalledWith(COUNTRYINFO, params);
            // expect(stub.calledWith(COUNTRYINFO, params)).toEqual(true);
            // expect(gateway).toHaveBeenCalledWith(COUNTRYINFO, params);
        });
    });
});