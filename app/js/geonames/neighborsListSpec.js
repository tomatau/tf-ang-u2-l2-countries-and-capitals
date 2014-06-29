describe('Geonames - neighborsList', function () {
    var gatewayStub = sinon.stub().returns( { success: function(){} } );
    var countryEntity = { geonameId: 'value' };

    beforeEach(module("geonames"));

    afterEach(function () { gatewayStub.reset(); });

    beforeEach(function () {
        module(function($provide){
            $provide.factory('gateway', function(){ return gatewayStub; });
        });
    });

    it('should return a the gateway promise object', function () {
        inject(function ( neighborsListRequest, gateway ) {
            expect(neighborsListRequest(countryEntity)).toImplement( gateway() );
        })
    });

    it('should send geonameId params to gateway request', function () {
        inject(function( neighborsListRequest, NEIGHBOURS ){
            var expectedParams = { geonameId: countryEntity.geonameId };
            neighborsListRequest(countryEntity);
            expect(gatewayStub).toHaveBeenCalledWith(NEIGHBOURS, expectedParams);
        });
    });
});