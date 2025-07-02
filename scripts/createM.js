// L = "apple,banana,orange,grape,peach,kiwi"

// L.replace(",", "、")
// const array3 = L.split("、")
// console.log(typeof array3);
// // for (let i = 0; i < 10; i++) {
// //     console.log(array3[i]);
// // }
// console.log(array3);
// const jsonString = JSON.stringify(array3, null, 1);
// console.log("OK");

let L = "apple,banana,orange,grape,peach,kiwi";

L = L.replaceAll(",", "、"); // ここでLを更新！
const array3 = L.split("、");

console.log(typeof array3);
console.log(array3); // ["apple", "banana", "orange", "grape", "peach", "kiwi"] と出力されるはずです。

const jsonString = JSON.stringify(array3, null, 1);
console.log(jsonString); // JSON形式の文字列が出力されます
console.log("OK");