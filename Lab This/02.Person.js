class Person {
    constructor(first, last) {
        this._first = first;
        this._last = last;
    }
    get firstName() {
        return this._first;
    }
    set firstName(name) {
        return this._first = name;
    }
    get lastName() {
        return this._last;
    }
    set lastName(name){
        return this._last = name;
    }
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    set fullName(name){
        let [first, last] = name.split(' ');
        if(first !== undefined && last !== undefined){
            this._first = first;
            this._last = last;
        }
        return `${this.firstName} ${this.lastName}`;
    }
}
let person = new Person("Albert", "Simpson");
console.log(person.fullName);//Albert Simpson
person.firstName = "Simon";
console.log(person.fullName);//Simon Simpson
person.fullName = "Peter";
console.log(person.firstName) // Simon
console.log(person.lastName) 
