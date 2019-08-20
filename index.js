//The first thing to worry about is requiring the fs module
const fs = require('fs')

/* Second is how are you going to specify the full file path
 * Will it be a
 * - String?
 * - Buffer?
 * - URL object using the file: protocol?
 *
 * Let's look at the String.
*/

//For path cross-compatibility between UNIX & Windows, use Node's path module
const path = require('path')

//To obtain the home path, use Node's process module
const process = require('process');
let homePath = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;
console.log(`home path: ${homePath}`)

//To obtain the current working directory of the Node.js process, use Node's process module
let cwd = process.cwd()
console.log(`cwd: ${cwd}`)
//Now you can safely build a cross-platform path to a specific file (e.g. input.txt at the working directory)

//A relative file path is relative to the current working directory (cwd)
let relativeFilePath = "input.txt"
console.log(`relative file path: ${relativeFilePath}`)
let filePathObject = path.parse(relativeFilePath)
console.log(filePathObject)

//use path.format to turn a path object into a string
relativeFilePath = path.format(filePathObject)
console.log(`relative file path: ${relativeFilePath}`)

//use path.join to insert platform-specific separators (/ for UNIX, \\ for Windows) between the path segments
let absoluteFilePath = path.join(cwd, "input.txt")
console.log(`absolute file path: ${absoluteFilePath}`)

//use path.parse to turn a path string into an object with the following structure
/*
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
*/
filePathObject = path.parse(absoluteFilePath)
console.log(filePathObject)

//use path.format to turn a path object into a string
absoluteFilePath = path.format(filePathObject)
console.log(`absolute file path: ${absoluteFilePath}`)

/* As expected there are synchronous and asynchronous calls */
let filePath = relativeFilePath

/* File Descriptor
 *
 * On POSIX systems, for every process, the kernel maintains a table of currently open files and resources.
 * Each open file is assigned a simple numeric identifier called a file descriptor.
 * At the system-level, all file system operations use these file descriptors to identify and track each specific file.
 * Windows systems use a different but conceptually similar mechanism for tracking resources.
 * To simplify things for users, Node.js abstracts away the specific differences between operating systems and assigns all open files a numeric file descriptor.
 *
 * Some asynchronous methods return a file descriptor as a second argument in their callbacks.
 * The first argument is always reserved for an exception.
 * If the operation runs successfully, then the first argument will be null or undefined.
*/
filePath = "input.txt"
fs.open(filePath, 'r', (err, fd) => {
	if (err) throw err
	
	console.log(`successfully opened file ${filePath} with descriptor ${fd}`)
	
	//Print file metadata asynchronously
	fs.fstat(fd, (err, stat) => {
		if (err) throw err
		
		console.log(stat)
		
		//Copy file asynchronously
		let copiedFilePath = "toBeDeleted"+filePath
		fs.copyFile(filePath, copiedFilePath, (err) => {
			if (err) throw err
			
			console.log(`${filePath} was copied to ${copiedFilePath}`)
			
			//Delete file asynchronously.
			fs.unlink(copiedFilePath, (err) => {
				if (err) throw err
				
				//Always close the file descriptor after you're done!
				fs.close(fd, (err) => {
					if (err) throw err
					
					console.log(`successfully closed file descriptor ${fd}`)
				})
				
				console.log(`successfully deleted ${copiedFilePath}`)
			})
		})
	})
})

//fs.readFile internally opens and closes a file descriptor for reading
let filePath2 = "input2.txt"
fs.readFile(filePath2, 'utf8', (err, data) => {
	if (err) throw err
	
	console.log(`readFile ${filePath2}: ${data}`)
})

//fs.writeFile internally opens and closes a file descriptor for creating and rewriting the file
let filePath3 = "input3.txt"
let data3 = new Date().getSeconds()
fs.writeFile(filePath3, data3, 'utf8', (err) => {
	if (err) throw err
	
	console.log(`writeFile ${filePath3}: ${data3}`)
})

//fs.appendFile internally opens and closes a file descriptor for creating and writing to the end of the file
let filePath4 = "input4.txt"
let data4 = new Date().getSeconds()
fs.appendFile(filePath4, data4, (err) => {
	if (err) throw err

	console.log(`appendFile ${filePath4}: ${data4}`)
})

fs.readdir(cwd, (err, files) => {
	if (err) throw err
	
	console.log("fs.readdir")
	console.log(files)
})