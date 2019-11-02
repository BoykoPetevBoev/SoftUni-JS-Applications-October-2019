String.prototype.ensureStart = function (str) {
    if (this.startsWith(str)) {
        return `${str}${this}`;
    }
    return `${this}`;
}
String.prototype.ensureEnd = function (str) {
    if (this.endsWith(str)) {
        return `${this}${str}`;
    }
    return `${this}`;
}

String.prototype.isEmpty = function () {
    return this.toString() === 0;
}
String.prototype.truncate = function (n) {
    if (n < 4) {

    }
    if (n >= this.length) {

    }
}
String.prototype.format = function (string, ...params) {

}

    (function () {

    }())


let str = 'my string';
str = str.ensureStart('my');
str = str.ensureStart('hello ');
str = str.truncate(16);
str = str.truncate(14);
str = str.truncate(8);
str = str.truncate(4);
str = str.truncate(2);
str = String.format('The {0} {1} fox', 'quick', 'brown');
str = String.format('jumps {0} {1}', 'dog');

