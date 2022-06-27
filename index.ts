import fs from "fs"

const outerPath: string = dynamicOuterPath()
function dynamicOuterPath(): string {
  const pathString: string = process.cwd()
  const solution: string[] = pathString.split("\\")
  const numOfOuts: number = solution.length-1;
  let dynamicOuterPath: string = ""
  for (let i: number = 0; i < numOfOuts; i++) {
    dynamicOuterPath += "../";
  }
  return dynamicOuterPath;
}

let myFolders: string[] = fs.readdirSync(outerPath)
let dirInnercontent: string[] = []
myFolders.forEach(element => {
  dirInnercontent.push(`${outerPath}${element}`)
});
myFolders = [];
myFolders.push(dirInnercontent[5]);
let myFiles: string[] = []
let innerFiles: string[] = [];
let innerFolders: string[] = []

function separateFilesFromFolders(innerContents: string[], innerPath: string): void{
  innerContents.forEach(element => {
    let dirPath: string = `${innerPath}/${element}`
    let bool: boolean = fs.lstatSync(dirPath).isFile()
    if(bool){
      innerFiles.push(dirPath)
    } else {
      innerFolders.push(dirPath)
    }
  });
}
function getItemsInDirectory(): void{
  while(myFolders.length !== 0){
    for (let index: number = 0; index < myFolders.length; index++) {
      let innerPath: string = myFolders[index];
      let innerContents: string[] = fs.readdirSync(innerPath)
      separateFilesFromFolders(innerContents, innerPath)
    }
    myFolders = innerFolders;
    innerFolders = [];
    myFiles.push(...innerFiles);
    innerFiles = [];
  }
}
getItemsInDirectory()
// console.log("this are my folders", myFolders)
// console.log("this are my files", myFiles)

function getSizeOfDirectory(): void{
  let size: number = 0;
  myFiles.forEach(element => {
    let stats: number = fs.statSync(element).size/(1024*1024)
    size+=stats;
  });
  console.log(Math.round(size))
}
getSizeOfDirectory()