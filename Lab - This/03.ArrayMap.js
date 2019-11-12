function solve(arr, fn) {
    return arr.reduce((a, e) => { return a.concat(fn(e)) }, []);
}
let func = (x) => x * 2;

console.log(
    solve([1, 2, 3, 4], func)
)
