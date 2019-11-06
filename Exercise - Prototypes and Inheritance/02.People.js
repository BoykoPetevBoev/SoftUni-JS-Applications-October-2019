function solve() {
    class Employee {
        constructor(name, age) {
            if (new.target === Employee) {
                throw new Error('Error!');
            }
            this.name = name;
            this.age = age;
            this._salary = 0;
            this.tasks = [];
        }
        get salary(){
            return this._salary;
        }
        set salary(value){
            return this._salary = value;
        }
        work() {
            let task = this.tasks.shift();
            console.log(task);
            this.tasks.push(task);
        }
        collectSalary() {
            console.log(`${this.name} received ${this.getSalary()} this month.`);
        }
    }
    class Junior extends Employee {
        constructor(name, age) {
            super(name, age);
            this.tasks.push(`${this.name} is working on a simple task.`);
        }
        getSalary() {
            return this.salary;
        }
    }
    class Senior extends Employee {
        constructor(name, age) {
            super(name, age);
            this.tasks.push(`${this.name} is working on a complicated task.`);
            this.tasks.push(`${this.name} is taking time off work.`);
            this.tasks.push(`${this.name} is supervising junior workers.`);
        }
        getSalary() {
            return this.salary;
        }
    }
    class Manager extends Employee {
        constructor(name, age) {
            super(name, age);
            this.dividend = 0;
            this.tasks.push(`${this.name} scheduled a meeting.`);
            this.tasks.push(`${this.name} is preparing a quarterly report.`);
        }
        getSalary() {
            return this.salary + this.dividend;
        }
    }
    return {
        Employee,
        Junior,
        Senior,
        Manager
    }
}
