function solve() {
    return {
        elements: [],
        size: this.elements.length,
        add: function (element) {
            this.elements
                .push(element)
                .sort((a, b) => a - b);
            this.size++;
        },
        remove: function (index) {
            if (index < 0 || this.elements.length <= index) {
                throw new Error('Invalid index!');
            }
            this.elements.splice(index, 1);
            this.size--;
        },
        get: function (index) {
            if (index < 0 || this.elements.length <= index) {
                throw new Error('Invalid index!');
            }
            return this.elements[index];
        }
    }
}
