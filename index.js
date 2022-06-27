"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const outerPath = dynamicOuterPath();
function dynamicOuterPath() {
    const pathString = process.cwd();
    const solution = pathString.split("\\");
    const numOfOuts = solution.length - 1;
    let dynamicOuterPath = "";
    for (let i = 0; i < numOfOuts; i++) {
        dynamicOuterPath += "../";
    }
    return dynamicOuterPath;
}
let myFolders = fs_1.default.readdirSync(outerPath);
let dirInnercontent = [];
myFolders.forEach(element => {
    dirInnercontent.push(`${outerPath}${element}`);
});
myFolders = [];
myFolders.push(dirInnercontent[5]);
let myFiles = [];
let innerFiles = [];
let innerFolders = [];
function separateFilesFromFolders(innerContents, innerPath) {
    innerContents.forEach(element => {
        let dirPath = `${innerPath}/${element}`;
        let bool = fs_1.default.lstatSync(dirPath).isFile();
        if (bool) {
            innerFiles.push(dirPath);
        }
        else {
            innerFolders.push(dirPath);
        }
    });
}
function getItemsInDirectory() {
    while (myFolders.length !== 0) {
        for (let index = 0; index < myFolders.length; index++) {
            let innerPath = myFolders[index];
            let innerContents = fs_1.default.readdirSync(innerPath);
            separateFilesFromFolders(innerContents, innerPath);
        }
        myFolders = innerFolders;
        innerFolders = [];
        myFiles.push(...innerFiles);
        innerFiles = [];
    }
}
getItemsInDirectory();
// console.log("this are my folders", myFolders)
// console.log("this are my files", myFiles)
function getSizeOfDirectory() {
    let size = 0;
    myFiles.forEach(element => {
        let stats = fs_1.default.statSync(element).size / (1024 * 1024);
        size += stats;
    });
    console.log(Math.round(size));
}
getSizeOfDirectory();
