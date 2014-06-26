describe('Geonames - gateway', function () {
    beforeEach(module("geonames"));

    describe('Constants', function () {
        it('should provide constants for requests', function () {
            inject(function (GEOAPI, GEOURL, FLAG, MAP) {
                expect(GEOAPI).toStartWith('http'); // could be https still
                expect(GEOURL).toStartWith('http');
                // maybe checking for image type (regex)
                // but then we'll need to keep manually adding possible extensions
                //  that could be a good thing
                expect(FLAG).toBeNonEmptyString();
                expect(MAP).toBeNonEmptyString();
            })
        });
    });

    describe('Contractual Agreement with APP', function () {
        it('should return a promise', function () {
            
        });

        it('should addsuccess and error functions to the returned promise', function () {
            
        });
    });

    // this implementation is specifically HTTP but our app shouldn't care
    //  maybe it could care at a congig stage but only need to include the word HTTPGateway
    //  Once .
    describe('HTTP Gateway', function () {
        // this could easily change, localStorage, WebSQL, IndexedDB
        it('should perform GET request to URL with format and username', function () {
            inject(function($httpBackend, gateway){
                var url = "test.url";
                $httpBackend
                    .expectGET(/test\.url/)
                    .respond(200);

                gateway(url);
                $httpBackend.verifyNoOutstandingExpectation();
            })
        });

        // maybe don't need any of these... making sure we use HTTP
        //  support that's the current impl here
        //  
        //  On a side note:
        //  in the app config stage we could provide 'gateway' to be this (httpGateway)
        //  
        describe('$http arguments', function () {
            // not sure about this... lots of internals
            //  especially 
            // these could be important though, depends!
            // could just check that an object includes
            var url = "test.url";
                defaultOptions = {
                method: 'GET',
                cache: true,
                params: {
                    formatted: true,
                    username: 'tomatao'
                },
                url: url // not default but we're using url var
            };

            beforeEach(module(function($provide){
                /* HORRIBLE HACK!!! AHHHH!!!! WHY MUST I DO THIS!?!?!!?!!!!! */
                /* give me mocha and sinon back :'( */
                $provide.factory('$http', function(){
                    var $http = function(args){
                        $http.call = jasmine.createSpy('$http');
                        $http.call(args);
                        return {
                            error: function(){}
                        }
                    }
                    return $http;
                });
            }));

            it('should accept params for the request', function () {
                inject(function($httpBackend, $http, gateway){
                    var params = {
                            extra: "extra param"
                        };

                    gateway(defaultOptions.url, params);

                    expect($http.call).toHaveBeenCalledWith(
                        getExpectedOptions(params)
                    );
                })
            });

            function getExpectedOptions(params){
                var expectedParams = angular.extend(
                        defaultOptions.params, params
                    ),
                    expectOptions = angular.copy(defaultOptions);

                expectOptions.params = expectedParams;
                return expectOptions;
            }
        });
    });
});