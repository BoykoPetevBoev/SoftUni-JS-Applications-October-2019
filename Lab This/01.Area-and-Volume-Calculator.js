function solve(area, vol, data) {
    let result = JSON.parse(data)
        .map(obj => {
            return {
                area: Math.abs(area.call(obj)),
                volume: Math.abs(vol.call(obj))
            }
        })
    return result;
}
function area() {
    return this.x * this.y;
};

function vol() {
    return this.x * this.y * this.z;
};
console.log(
    solve(area, vol, '[{"x":"10","y":"-22","z":"10"},{"x":"47","y":"7","z":"-5"},{"x":"55","y":"8","z":"0"},{"x":"100","y":"100","z":"100"},{"x":"55","y":"80","z":"250"}]')
);
console.log([
    { area: 220, volume: 2200 },
    { area: 329, volume: 1645 },
    { area: 440, volume: 0 },
    { area: 10000, volume: 1000000 },
    { area: 4400, volume: 1100000 }
  ])