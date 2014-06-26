describe('Geonames - neighborsList', function () {
    var gatewayStub = sinon.stub().returns( { success: function(){} } );
    var countryEntity = { geonameId: 'value' };

    beforeEach(module("geonames"));

    afterEach(function () {
        gatewayStub.reset();
    });

    it('should return a the gateway promise object', function () {
        module(function($provide){
            $provide.factory('gateway', function(){ return gatewayStub; });
        });
        inject(function ( neighborsListRequest, $q, $httpBackend, gateway ) {
            expect(neighborsListRequest(countryEntity)).toImplement( gateway() );
        })
    });

    it('should send geonameId params to gateway request', function () {
        module(function($provide){
            $provide.factory('gateway', function(){ return gatewayStub; });
        });
        inject(function( neighborsListRequest, NEIGHBOURS ){
            var expectedParams = { geonameId: countryEntity.geonameId };
            neighborsListRequest(countryEntity);
            expect(gatewayStub).toHaveBeenCalledWith(NEIGHBOURS, expectedParams);
        });
    });
});