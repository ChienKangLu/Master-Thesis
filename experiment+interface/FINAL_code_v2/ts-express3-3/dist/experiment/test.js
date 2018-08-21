"use strict";
function e(x, n) {
    let f = 1;
    if (n == 0)
        return 1;
    if (n == 1)
        return x;
    if (Math.floor(n / 2) != 0)
        return f *= e(x, Math.floor(n / 2)) * e(x, Math.floor(n / 2)) * e(x, n % 2);
}
for (let i = 0; i <= 20; i++) {
    let w = e(2, i);
    console.log(i, w);
}
