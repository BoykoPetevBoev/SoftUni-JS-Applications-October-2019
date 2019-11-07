function solve() {
    let obj = {
        extend: function (template) {
            Object
                .keys(template)
                .forEach(parentProp => {
                    typeof (template[parentProp]) == "function"
                        ? Object.getPrototypeOf(obj)[parentProp] = template[parentProp]
                        : obj[parentProp] = template[parentProp];
                });
        }
    }
    return obj;
}
