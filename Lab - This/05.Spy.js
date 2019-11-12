function Spy(obj, method) {
    let originalFunction = obj[method];
    let invoked = {
        count: 0
    }
    obj[method] = function(){
        invoked.count++;
        return originalFunction.apply(this, arguments)
    }
    return invoked;
}
let obj = {
    method:()=>"invoked"
}
let spy = Spy(obj,"method");

obj.method();
obj.method();
obj.method();

console.log(spy) // { count: 3 }
let spy1 = Spy(console,"log");

console.log(spy1); // { count: 1 }
console.log(spy1); // { count: 2 }
console.log(spy1); // { count: 3 }
