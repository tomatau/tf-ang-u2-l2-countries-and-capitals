describe('Application - Country Route', function () {
    var countryCode = "TEST",
        countryEntity = {},
        countryRepoStub = sinon.stub().returns(countryEntity);

    beforeEach(module("ccApp"));

    describe('Route', function () {
        beforeEach(function () {
            module(function($provide){
                $provide.factory('countryRepo', function(){
                    return countryRepoStub
                })
            });
        });

        it('should load the country template', function () {
            inject(function($route, $rootScope, $location, $httpBackend) {
                var templateReg = /country\.html$/;
                $httpBackend.when('GET', templateReg).respond("...");

                $rootScope.$apply(function() {
                    $location.path('/countries/' + countryCode + '/capital');
                });
                expect($route.current.templateUrl).toMatch(templateReg)
                expect($route.current.controller).toBe('CountryCtrl')
                expect(countryRepoStub).toHaveBeenCalled();
            });
        });
    });

    describe('Controller', function () {
        var ctrl, scope;
        beforeEach(inject(function($controller, $rootScope){
            scope = $rootScope.$new();
            ctrl = $controller('CountryCtrl', {
                $scope : scope,
                country: countryRepoStub(),
                FLAG: 'FLAGURL{{ code | lowercase }}',
                MAP: 'MAPURL{{ code | uppercase }}',
                COUNTRYURL: 'COUNTRYURL{{ code }}'
            })
        }));

        it('should load the countryList from the getFunction', function () {
            expect(scope.country).toBe( countryEntity );
        });

        it('should provide methods for each URL', function () {
            expect(scope.flagUrl(countryCode))
                .toEqual('FLAGURL' + countryCode.toLowerCase());
            expect(scope.mapUrl(countryCode))
                .toEqual('MAPURL' + countryCode.toUpperCase());
            expect(scope.countryUrl(countryCode))
                .toEqual('COUNTRYURL' + countryCode);
        });
    });
});