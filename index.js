"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const outerPath = dynamicOuterPath();
function rdirectory() {
    return __awaiter(this, void 0, void 0, function* () {
        /*
        > system volume .. has no read access yet that's not caught by fs.access? with mode?
        > the recycle.bin is a hidden file which when read returns some weird characters
        > I've an empty hidden folder which is successfully read and returns an empty array
        */
        // get the content of the directory
        let folders = yield promises_1.default.readdir(outerPath);
        // path to directory. nests during loop
        for (let outerloops = 0; outerloops <= 1; outerloops++) {
            let dirArray = [outerPath, `${folders[outerloops + 1]}/`];
            //loops to get nested directories testing for whether content is file/directory
            recursedirectory(folders, dirArray, outerloops);
        }
    });
}
rdirectory();
function recursedirectory(folders, dirArray, outerloops) {
    return __awaiter(this, void 0, void 0, function* () {
        // while the element is still a folder recurse.
        // if there is another folder in the deepest directory then loop it too afterwhich we'll start moving upwards.
        let trydir = yield promises_1.default.stat(dirArray.join(""));
        for (let loops = 0; loops <= 5; loops++) {
            // dirArray = [outerPath, `${folders[loops+1]}/`]
            //a new path is created in each tree level
            //just a precaution to make sure the while loop doesnt run forever
            let numOfNests = 0;
            try {
                while (trydir.isDirectory()) {
                    // assign a new value to the new nested directory
                    console.log("start ", numOfNests);
                    folders = yield promises_1.default.readdir(dirArray.join(""));
                    // create the new array which will be used to create a new path
                    dirArray.push(`${folders[loops]}/`);
                    // new path from the new array and for the new nested directory
                    trydir = yield promises_1.default.stat(dirArray.join(""));
                    // debugger
                    numOfNests++;
                    console.log("end ", numOfNests);
                    if (numOfNests === 15)
                        break;
                }
                console.log(`\nLOOPING ${dirArray.slice(0, dirArray.length - 1).join("")}\n`);
                if (numOfNests > 0)
                    getSingleFiles(folders, dirArray, trydir);
            }
            catch (error) {
                console.log(error.message);
            }
        }
    });
}
// function that retrieves the last folder
// the loop that logs the value of each file in the nested directory.
function getSingleFiles(folders, dirArray, trydir) {
    return __awaiter(this, void 0, void 0, function* () {
        folders.forEach((element) => __awaiter(this, void 0, void 0, function* () {
            const newArr = dirArray.slice(0, dirArray.length - 1);
            const singleFolderPath = path_1.default.join(newArr.join(""), element);
            try {
                const properties = yield promises_1.default.stat(singleFolderPath);
                let num = properties.size / (1024 * 1024);
                console.log(element, roundToTwo(num));
            }
            catch (error) {
                console.log(error.message);
            }
        }));
        // prepare for a loop
        dirArray = dirArray.slice(0, dirArray.length - 1);
        folders = yield promises_1.default.readdir(dirArray.join(""));
        trydir = yield promises_1.default.stat(dirArray.join(""));
        console.log(`\nLOOP DONE. NEXT ${dirArray.join("")}\n`);
    });
}
// impressive function that's been used to round file size to 2 dp.
function roundToTwo(num) {
    const newLocal = num + "e+2";
    return +(Math.round(newLocal) + "e-2");
}
// function that dynamically derives an path to the main directory
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
