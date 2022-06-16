import { Stats } from "fs";
import fsPromise from "fs/promises";
import { constants } from "node:fs";
import path from "path";

const outerPath = dynamicOuterPath()
async function rdirectory () {
  
  /*
  > system volume .. has no read access yet that's not caught by fs.access? with mode?
  > the recycle.bin is a hidden file which when read returns some weird characters
  > I've an empty hidden folder which is successfully read and returns an empty array
  */
  // get the content of the directory
  let folders = await fsPromise.readdir(outerPath);
  // path to directory. nests during loop
  for (let outerloops = 0; outerloops <= 1; outerloops++) {
    let dirArray = [outerPath, `${folders[outerloops+1]}/`]
    //loops to get nested directories testing for whether content is file/directory
    recursedirectory(folders, dirArray, outerloops);
  }
}
rdirectory();

async function recursedirectory(folders: any, dirArray: any, outerloops: number) {
  // while the element is still a folder recurse.
  // if there is another folder in the deepest directory then loop it too afterwhich we'll start moving upwards.
  
  let trydir = await fsPromise.stat(dirArray.join(""))
  for (let loops = 0; loops <= 5; loops++) {
    // dirArray = [outerPath, `${folders[loops+1]}/`]
    //a new path is created in each tree level
    //just a precaution to make sure the while loop doesnt run forever
    let numOfNests = 0;
    try {
      while (trydir.isDirectory()) {
        // assign a new value to the new nested directory
        console.log("start ", numOfNests);
        folders = await fsPromise.readdir(dirArray.join(""));
        // create the new array which will be used to create a new path
        dirArray.push(`${folders[loops]}/`)
        // new path from the new array and for the new nested directory
        trydir = await fsPromise.stat(dirArray.join(""))
        // debugger
        numOfNests++;
        console.log("end ", numOfNests);
        if(numOfNests === 15) break;
      }
      console.log(`\nLOOPING ${dirArray.slice(0, dirArray.length-1).join("")}\n`)
      if(numOfNests > 0)getSingleFiles(folders, dirArray, trydir);
      

    } catch (error: any) {
      console.log(error.message);
      
    }
  }
}

// function that retrieves the last folder

// the loop that logs the value of each file in the nested directory.
async function getSingleFiles(folders: string[], dirArray: string[], trydir: Stats) {
  folders.forEach(async (element: any) => {
    const newArr = dirArray.slice(0, dirArray.length-1)
    const singleFolderPath = path.join(newArr.join(""), element);
    try {
      const properties = await fsPromise.stat(singleFolderPath);
      let num = properties.size/(1024*1024);
      console.log(element, roundToTwo(num));
    } catch (error: any) {
      console.log(error.message)
    }
  });
  // prepare for a loop
  dirArray = dirArray.slice(0, dirArray.length-1)
  folders = await fsPromise.readdir(dirArray.join(""));
  trydir = await fsPromise.stat(dirArray.join(""))
  console.log(`\nLOOP DONE. NEXT ${dirArray.join("")}\n`)
}
// impressive function that's been used to round file size to 2 dp.
function roundToTwo(num: Number){
  const newLocal = num + "e+2";
  return +(Math.round(newLocal) + "e-2")
}

// function that dynamically derives an path to the main directory
function dynamicOuterPath() {
  const pathString = process.cwd()
  const solution = pathString.split("\\")
  const numOfOuts = solution.length-1;
  let dynamicOuterPath = ""
  for (let i = 0; i < numOfOuts; i++) {
    dynamicOuterPath += "../";
  }
  return dynamicOuterPath;
}