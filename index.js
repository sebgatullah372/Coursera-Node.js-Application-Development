var rectmod = require('./rectangle')

var rect = {
    perimeter: (x,y) => (2*(x+y)),
    area: (x,y)=>(x*y)
}

function solveRect(l,b){
    console.log("Area= ", rect.area(l,b));
    console.log("perimeter= ", rect.perimeter(l,b))

}
function solveRectMod(l,b){
    console.log("Solving for rectangle with l = "
                + l + " and b = " + b);
        rectmod(l,b, (err,rectangle) => {
        if (err) {
	        console.log("ERROR: ", err.message);
	    }
        else {
            console.log("The area of the rectangle of dimensions l = "
                + l + " and b = " + b + " is " + rectangle.area());
            console.log("The perimeter of the rectangle of dimensions l = "
                + l + " and b = " + b + " is " + rectangle.perimeter());
        }
    });
    console.log("This statement after the call to rect()");

}
solveRect(2,3);
solveRectMod(2,3);
solveRectMod(-2,0);