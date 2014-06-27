describe('Application - main', function () {

    beforeEach(module("ccApp"));

    it('should load error page', function () {
        inject(function($route, $rootScope, $location) {
            $rootScope.$apply(function() {
                $location.path('/nonesenseroutedoesntexist');
            });
            expect($route.current.template).toMatch(/Error/)
            expect($route.current.originalPath).toEqual('/error')
        });
    });

    it('should set loading on a route change start', function () {
        inject(function($rootScope){
            $rootScope.$broadcast('$routeChangeStart', {});
            expect($rootScope.isLoading).toEqual(true);
        });
    });

    it('should set loading false eventually on routeChangeSuccess', function () {
        inject(function($rootScope, $timeout){
            $rootScope.$broadcast('$routeChangeStart', {});

            runs(function() {
                $rootScope.$broadcast('$routeChangeSuccess', {});
                $timeout.flush()
            });
            
            waitsFor(function(){
                return ($rootScope.isLoading === false)
            }, "isLoading should be false on routeChangeSuccess", 400);
            // runs(function(){ expect($rootScope.isLoading).toEqual(false); })
        })
    });

    it('should provide an activePage function', function () {
        inject(function($rootScope, $location){
            $rootScope.$apply(function() {
                $location.path('/anycurrentPage');
            });
            expect($rootScope.activePage('anycurrentPage')).toBeTrue()
            expect($rootScope.activePage('notcurrentpage')).toBeFalse()
        });
    });

});