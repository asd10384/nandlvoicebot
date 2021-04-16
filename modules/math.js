
module.exports = {
    randm
};

function randm(min = 0, max = 9) {
    return Math.floor(Math.random() * (max+1 - min)) + min;
}
