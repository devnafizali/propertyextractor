import fs from "fs";
// (() => {
    const myArray = JSON.parse(fs.readFileSync("latest.json", "utf8"));
    console.log(myArray.length)
// })