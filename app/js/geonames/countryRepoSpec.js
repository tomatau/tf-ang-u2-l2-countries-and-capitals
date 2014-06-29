describe('Geonames - countryRepo', function () {
    var countryCode = "ABC",
        countryEntity = {
            countryCode: countryCode,
            capitalData: { value: 'capital'},
            neighbors: []
        };

    beforeEach(module("geonames"));

    var countryListReqStub,
        capitalRequestStub,
        neighborsListRequestStub,
        countriesEntityStub;

    // problem:
    // We want to stub out things we use in this component:
    //  this component doesn't mention anything about the $http directive
    //  this component _does_ use other services, these services return a $http promise
    // so we want to make stubs that adhere to the $http promise...
    // angular makes this painful unfortunately so... this simple test is super complex
    beforeEach(function () {

        module(function($provide){
            $provide.factory('countryListRequest', function(){
                return function(){ return countryListReqStub.promise; }
            });
            $provide.factory('capitalRequest', function(){
                return function(){ return capitalRequestStub.promise; }
            });
            $provide.factory('neighborsListRequest', function(){
                return function(){ return neighborsListRequestStub.promise; }
            });
            $provide.factory('countriesEntity', function(){
                return countriesEntityStub;
            });
        });
        inject(function($q){
            countryListReqStub = makeHttpStub($q);
            capitalRequestStub = makeHttpStub($q);
            neighborsListRequestStub = makeHttpStub($q);
            countriesEntityStub = { find: function(){ return countryEntity } };
        })
    });
    // 
    // to make this less painful, we have introduced a function to help with tests:
    //  makeHttpStub

    // would be nice to make a file full of common test helper functions
    /**
     * Creates a promise object and extends with the success and error functions
     * @param  {promise library} $q
     */
    function makeHttpStub($q) {
        var def = $q.defer(),
            promise = def.promise;
        angular.extend(promise, {
            success : function(fn) {
                promise.then(function(response) {
                    fn(response)
                    // fn(response.data, response.status, response.headers);
                });
                return promise;
            },
            error : function(fn) {
                promise.then(null, function(response) {
                    fn(response.data, response.status, response.headers);
                });
                return promise;
            }
        });
        return def;
    }

    /*
        The API tests descript the contracts of the component
     */
    describe('API', function () {
        // VERSION 1:
        // 
        // this has been commented as it conflicts with the working 'beforeEach'
        // 
        // here we stub out the internal decortates, this is easier than the test we want
        // 
        // problem is, we don't want to tie ourselves to the decorators... they're internal
        // we do want to stub the requests, they're tested
        // 
        // if we took the decorators out, we could then stub them.. 
        // but they'd then benefit from having tests too... which we don't need!
        // 
        // NB: both version 1 and version 2 use the same it block, just diff setups
        // 
        // beforeEach(function () {
        //     module(function($provide){
        //         $provide.factory('countryListRequest', function(){ return countryListReqStub; });
        //         $provide.factory('capitalDataDecorator', function(){ return capitalDataDecStub; });
        //         $provide.factory('neighborsDecorator', function(){ return neightborsDecStub; });
        //         $provide.factory('countriesEntity', function(){ return countriesEntityStub; });
        //     });
        //     inject(function($q){
        //         countryListReqStub = sinon.stub().returns( $q.defer().promise ),
        //         capitalDataDecStub = sinon.stub().returns( $q.defer().promise ),
        //         neightborsDecStub = sinon.stub().returns( $q.defer().promise ),
        //         countriesEntityStub = { find: function(){ return countryEntity } };
        //     })
        // });

        // VERSION 2:  stub out the request services
        // 
        // this repo uses 3 request services and so we have to do a lot of stubbing
        //      see the top level beforeEach o_O
        // 
        it('should return the a promise interface', function () {
            inject(function ( countryRepo, countryListRequest, $q ) {
                expect(countryRepo(countryCode)).toImplement( $q.defer().promise );
            });
        });
    });

    /**
     * There is no need to test the decorators.. they are internal to this component
     *
     * So I didn't bother writing a test for it, no other components use them and they are
     * untested
     */
    xit('should call capitalDataDecorator and neighborsDecorator', function () {});

    // This is the area that tests the actual purpose, the other test was just for the API
    describe('Creating a Country Entity', function () {

        /**
         * So with all the stubbing in place, this is ok, we have to fake the request response
         *
         * you may be asking 'why not just use httpBackend?', well... 
         * the countryRepo doesn't have the word $http in it anywhere.. 
         * so using $httpBackend is making assumptions that we can avoid
         *
         * however we are using the 'success' and 'error' contracts
         */
        it('should add capitalData and neighbors to the countryEntity', function () {
            inject(function( countryRepo, $rootScope ){
                countryRepo(countryCode)
                    .then(function(countryEntity){
                        expect(countryEntity).toEqual(countryEntity)
                    });
                $rootScope.$apply(function(){ // $q resolve needs to be digested
                    countryListReqStub.resolve({ countryCode: countryCode });
                    capitalRequestStub.resolve({ geonames: [ countryEntity.capitalData ] });
                    neighborsListRequestStub.resolve({ geonames: [ countryEntity.capitalData ] });
                });
            });
        });
    });

});