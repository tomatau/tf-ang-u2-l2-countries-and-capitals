tf-ang-u2-l2-countries-and-capitals
===================================

Thinkful curriculum Angular Development curriculum, unit 2 lesson 2 assignment 3 application

[https://tomatau.github.com/tf-ang-u2-l2-countries-and-capitals/build](https://tomatau.github.com/tf-ang-u2-l2-countries-and-capitals/build)

This is using jasmine 1.3 for some reason even though I ran karma init. Should really be jasmine 2.0!!  We want 'done' callbacks for async tests not the silly 'run' blocks!

The Specs for testing are each next to their respective file:

######tests make use of:
- jasmine-expect for exta assertions on strings, etc... 
- sinonjs a mocking library to give more control over spies and stubs
- jasmine.sinon to integrate the assertions of sinon into jasmine

####geonames/countrListSpec
- contains 3 versions of most tests showing various approaches
- many comments throughout the file discussing the problems and benefits of each

####geonames/gatewaySpec
- contains many comments dicussing tests
- final $http tests have 2 versions to discuss benefits of sinon.js