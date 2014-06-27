describe('Application - List Route', function () {
    var countryList = [],
        getFunction = function() { return countryList },
        countryListRequestStub = sinon.stub().returns({
            get: getFunction
        });

    beforeEach(module("ccApp"));

    describe('Route', function () {
        beforeEach(function () {
            module(function($provide){
                $provide.factory('countryListRequest', function(){
                    return countryListRequestStub
                })
            });
        });

        it('should load the list template', function () {
            inject(function($route, $rootScope, $location, $httpBackend) {
                var templateReg = /list\.html$/;
                $httpBackend.when('GET', templateReg).respond("...");

                $rootScope.$apply(function() {
                    $location.path('/countries');
                });
                expect($route.current.templateUrl).toMatch(templateReg)
                expect($route.current.controller).toBe('ListCtrl')
                expect(countryListRequestStub).toHaveBeenCalled();
            });
        });
    });

    ddescribe('Controller', function () {
        var ctrl, scope;
        beforeEach(inject(function($controller, $rootScope){
            scope = $rootScope.$new();
            ctrl = $controller('ListCtrl', {
                $scope : scope,
                countries: countryListRequestStub(),
                COUNTRYURL: 'someURL{{ code }}'
            })
        }));

        it('should load the countryList from the getFunction', function () {
            expect(scope.countryList).toBe( countryList );
        });

        it('should provide the goToCountry method', function () {
            inject(function($location, $rootScope){
                var testCode = "Code";
                scope.goToCountry(testCode);
                $rootScope.$digest();
                expect($location.path()).toEqual('/someURL' + testCode);
            })
        });
    });
});