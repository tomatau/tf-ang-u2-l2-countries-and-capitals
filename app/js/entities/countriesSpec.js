describe('Entity - countries', function () {
    beforeEach(module("entities"));

    it('should provide an empty array by default', function () {
        inject(function (countriesEntity) {
            expect(countriesEntity.get()).toEqual([]);
        })
    });
    
    it('should provide a set and get method', function () {
        inject(function (countriesEntity) {
            var testData = [];

            countriesEntity.set(testData);

            expect(countriesEntity.get()).toBe(testData);
        })
    });

    it('should find items by their countryCode', function () {
        inject(function(countriesEntity){
            var testData = [
                {countryCode: "ABC", key:"value"},
                {countryCode: "DEF", key:"value2"},
            ];
            
            countriesEntity.set(testData);

            expect(countriesEntity.find("DEF")).toBe(testData[1]);
            expect(countriesEntity.find("ABC")).toBe(testData[0]);
        })
    });
});