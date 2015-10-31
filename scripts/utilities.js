var names = ["brian", "colin"]
function forEach (array, callback) {
    for (i=0; i<array.length; i++) {
    callback(array[i]);
    }
    
}

function myCallBack (input) {
console.log(input + " is awesome");
}

forEach (names, myCallBack);
