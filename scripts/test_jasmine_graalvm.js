load( "lib/jasmine-core/jasmine.js");
load( "lib/jasmine-core/boot0.js");
load( "lib/jasmine-core/boot1.js");


console.log("HEy !");

describe("a simple suite", function() {
    it("may failed", function() {
        console.log("inside jasmine test ! ");
        expect( 10 ).toBeGreaterThan(100);
    });
});

describe("another simple suite", function() {
    it("may  pass", function() {
        console.log("inside jasmine test 2 ! ");
        expect( 20 ).toBeGreaterThan(2);
    });
});

describe("another suite with error", function() {
    it("may  pass", function() {
        console.log("inside jasmine test 3 ! ");
        //
    });
});

const env = jasmine.getEnv();

env.configure({stopOnSpecFailure:false, random : false, stopSpecOnExpectationFailure:false, autoCleanClosures:false});

const later = env.execute();

// wait until execution ends.. 
later.then( 
    done  => console.log( "OK => " + JSON.stringify(done)),
    error => console.log( "KO => " + JSON.stringify(error))
);

console.log("script end.");