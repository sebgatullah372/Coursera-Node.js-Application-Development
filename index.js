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
    console.log("Area= ", rectmod.area(l,b));
    console.log("perimeter= ", rectmod.perimeter(l,b))

}
solveRect(2,3);
solveRectMod(2,3);