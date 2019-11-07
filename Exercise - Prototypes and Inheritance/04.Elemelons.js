function solve() {
    class Melon {
        constructor(weight, melonSort) {
            if (new.target === Melon) {
                throw new Error('Abstract class cannot be instantiated directly');
            }
            this.weight = weight;
            this.melonSort = melonSort;
        }
    }
    class Watermelon extends Melon {
        constructor(weight, melonSort) {
            super(weight, melonSort);
            this._elementIndex = this.weight * this.melonSort.length;
        }
        get elementIndex() {
            return this._elementIndex;
        }
        toString() {
            return `Element: Water\nSort: ${this.melonSort}\nElement Index: ${this.elementIndex}`;
        }
    }
    class Firemelon extends Melon {
        constructor(weight, melonSort) {
            super(weight, melonSort);
            this._elementIndex = this.weight * this.melonSort.length;
        }
        get elementIndex() {
            return this._elementIndex;
        }
        toString() {
            return `Element: Fire\nSort: ${this.melonSort}\nElement Index: ${this.elementIndex}`;
        }
    }
    class Earthmelon extends Melon {
        constructor() {
            super(weight, melonSort);
            this._elementIndex = this.weight * this.melonSort.length;
        }
        get elementIndex() {
            return this._elementIndex;
        }
        toString() {
            return `Element: Earth\nSort: ${this.melonSort}\nElement Index: ${this.elementIndex}`;
        }
    }
    class Airmelon extends Melon {
        constructor() {
            super(weight, melonSort);
            this._elementIndex = this.weight * this.melonSort.length;
        }
        get elementIndex() {
            return this._elementIndex;
        }
        toString() {
            return `Element: Air\nSort: ${this.melonSort}\nElement Index: ${this.elementIndex}`;
        }
    }
    class Melolemonmelon extends Watermelon {
        constructor(weight, melonSort) {
            super(weight, melonSort);
            this.element = 'Water';
            this._elements = ['Fire','Earth', 'Air', 'Water'];
        }
        morph(){
            this.element = this._elements.shift();
            this._elements.push(this.element);
        }
        toString() {
            return `Element: ${this.element}\nSort: ${this.melonSort}\nElement Index: ${this.elementIndex}`;
        }
    }
    return {
        Melon,
        Watermelon,
        Firemelon,
        Earthmelon,
        Airmelon,
        Melolemonmelon
    }
}
