describe('Application - Intro Route', function () {

    beforeEach(module("ccApp"));

    it('should load the intro template', function () {
        inject(function($route, $rootScope, $location, $httpBackend) {
            var templateReg = /intro\.html$/;
            $httpBackend.when('GET', templateReg).respond("...");

            $rootScope.$apply(function() {
                $location.path('/');
            });
            expect($route.current.templateUrl).toMatch(templateReg)
            expect($route.current.controller).toBe('IntroCtrl')
        });
    });
});