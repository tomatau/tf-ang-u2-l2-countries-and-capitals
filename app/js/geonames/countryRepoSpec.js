describe('Geonames - countryRepo', function () {
    var countryListReqStub,
        capitalDataDecStub,
        neightborsDecStub;

    var countryCode = "ABC";

    beforeEach(module("geonames"));

    describe('API', function () {
        beforeEach(function () {
            module(function($provide){
                $provide.factory('countryListRequest', function(){ return countryListReqStub; });
            });
            inject(function($q){
                countryListReqStub = sinon.stub().returns( $q.defer().promise ),
                capitalDataDecStub = sinon.stub().returns( $q.defer().promise ),
                neightborsDecStub = sinon.stub().returns( $q.defer().promise );
            })
        });

        it('should return the countryListRequest promise', function () {
            inject(function ( countryRepo, countryListRequest, $q ) {
                expect(countryRepo(countryCode)).toImplement( countryListRequest() );
            });
        });
    });

    /**
     * This is kinda checking internals and not the main purpose of the thing
     *     would mean we need to write tests for decorators too
     */
    xit('should capitalDataDecorator and neighborsDecorator', function () {});

    describe('Creating a Country Entity', function () {
        /**
         * This test couples our Repo to the implamentation of using httpRequests
         *
         * We could alternatively check that the neighborsList and capital Requests are called
         */
        it('should add capitalData and neighbors to the countryEntity', function () {
            var expectedCountryEntity = {
                countryCode: countryCode,
                capitalData: { value: 'capital'},
                neighbors: []
            };
            inject(function( countryRepo, $httpBackend ){
                $httpBackend.whenGET(/countryInfoJSON/).respond({
                    geonames: [{
                        countryCode: countryCode
                    }]
                });
                $httpBackend.whenGET(/search/).respond({
                    geonames: [ expectedCountryEntity.capitalData ]
                });
                $httpBackend.whenGET(/neighboursJSON/).respond({
                    geonames: []
                });

                countryRepo(countryCode)
                    .then(function(countryEntity){
                        expect(countryEntity).toEqual(expectedCountryEntity)
                    });
                $httpBackend.flush();
                $httpBackend.verifyNoOutstandingRequest();
            });
        });        
    });


});