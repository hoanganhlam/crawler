const makeNestedObjWithArrayItemsAsKeys = (arr, value) => {
    const reducer = (acc, item) => ({
        [item]: acc
    });
    return arr.reduceRight(reducer, value);
};

function deepFind(obj, path) {
    var paths = path.split('.')
        , current = obj
        , i;

    for (i = 0; i < paths.length; ++i) {
        if (current[paths[i]] == undefined) {
            return undefined;
        } else {
            current = current[paths[i]];
        }
    }
    return current;
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleep() {
    await timeout(3000);
}

module.exports = {
    makeNestedObjWithArrayItemsAsKeys,
    deepFind,
    sleep
}
