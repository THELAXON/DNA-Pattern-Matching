"use strict"; // do not modify or delete this line

//Task 1
//data is a string, patterns is an array of patterns
function find(data, patterns) {
  const findOccurence = (data, pattern, occurences) =>                    //Nested function taking in data, pattern and occurences
  {
    if (data.search(pattern) !== -1)                                      //If statement checks if pattern occurs in data
    {
      occurences.push(data.search(pattern));                              //Takes the offset of pattern in the data and stores it in occurences using push
      return findOccurence(data.replace(pattern, "0" + pattern.slice(1)),pattern,occurences,); //This replaces the first character of the data where the pattern occurs with a 0 so it is marked as checked
    } 
    else 
    {
      return occurences;                                                  //Returns occurences if there is no more patern in the string
    }
  };
  const frequencies = {};                                                 //Object used to store the occurences of a pattern in the data
  const offsets = {};                                                     //Object used to store the offset of where the pattern occurs in data
  Array.from(patterns).forEach((pattern) => {                             //Creates a new array using pattern array and iterates over it
    frequencies[pattern] = findOccurence(data, pattern, []).length;       //Uses findoccurence with the data and the pattern to use find with and an empty array to store the frequency of the pattern
    offsets[pattern] = findOccurence(data, pattern, []);                  //Uses findoccurence with the data and the pattern to use find with and an empty array to store the offsets of the pattern
  });

  return { frequencies, offsets }; // returns frequencies and offsets.
}


//use these for results of analyse1, analyse2 and analyse3
const results1 = {};
const results2 = {};
const results3 = {};

//Task 2
const fs = require('fs'); 

function analyse1(dataFile, patternFile) { 
  fs.readFile(patternFile, 'utf8', (err, data) => {                       //This line uses the `fs` module to read the `patternFile` and pass the data to a callback function.
    if (err) {
      console.error(err);                                                 //Print the error to the console and return from the function.
      return;
    }
    const patterns = data.split(/\r?\n/);                                 //This line splits the data from the `patternFile`.

    fs.readFile(dataFile, 'utf8', (err, data) => {                        //This line uses the `fs` module to read the `dataFile` and pass the data to a callback function.
      if (err) {
        console.error(err);                                               //Print the error to the console and return from the function.
        return;
      }
      const dataLines = data.split(/\r?\n/);                              //This line splits the data from the `patternFile`.
      dataLines.forEach(line => {                                         //This line iterates over the elements in the dataLines
        const result = find(line, patterns);                              //This line calls the `find` function with the current itterated line and passes the pattern array into it.
        results1[line] = result;                                          //This adds result which was returned into the results 1 const.
      });
    });
  });
}



//Task 3

const readFilePromise = (filePath) => {
  return new Promise((resolve, reject) => {                               //Returns a new promise obj that takes resolve and reject as arguements
    fs.readFile(filePath, 'utf8', (err, data) => {                        //The line uses fs to read file at the file path
      if (err) {                                                          //If an error occurs it rejects
        reject(err);
      } else {                                                            //If no error then it resolves the data 
        resolve(data);
      }
    });
  });
};

function analyse2(dataFile, patternFile){
	readFilePromise(patternFile)                                            // it called the readfile function with the pattern file as the arguement.
    .then(patternData => {                                                //This then() block is executed when the `Promise` returned by the `readFilePromise` function.
      const patterns = patternData.split(/\r?\n/);                        //this line splits the data from the `patternData`.
      return readFilePromise(dataFile).then(data => ({ data, patterns }));// return calls readfilepromise and passes the data file.
    })
    .then(({ data, patterns }) => {                                       // This then()  is executed when the Promise returned by the readFilePromise function.                        
      const dataLines = data.split(/\r?\n/);                              // This line splits the data from the `Data`.
      dataLines.forEach(line => {                                         // This line iterates over the elements in the dataLines.
        const result = find(line, patterns);                              // This line calls the find function with the current line in iteration and passes the arguements.
        results2[line] = result;                                          // This adds result which was returned into the results 2 const.
      });
    })
    .catch(err => {                                                       // Used to catch error
      console.error(err);                                                 // Prints it in console
    });
}

//Task 4 

//your implementation for analyse3 goes here
async function analyse3(dataFile, patternFile) {           
  const data = await readFilePromise(dataFile);                          //This line calls the readFilePromise function with the dataFile parameter, and waits for the result to be returned. 
  const dataLines = data.split(/\r?\n/);                                 //This line splits the data string into an array of lines.
  const patterns = (await readFilePromise(patternFile)).split(/\r?\n/);  //This line calls the readFilePromise function with the patternFile parameter, and waits for the result to be returned and splits it, then stores it in patterns.

  dataLines.forEach(line => {                                            //This line   iterates over each element in the dataLines array.
    const result = find(line, patterns);                                 //calls the file function and checks the patterns with the lines and stores it in results
    results3[line] = result;                                             // The result is then stored in results 3.
  });
}

//-------------------------------------------------------------------------------
//do not modify this function
function print(){
	console.log("Printing results...");
	Object.keys(results).forEach(function(elem){
		console.log("sequence: ", elem);
		console.log("frequencies are: ", results[elem].frequencies);
		console.log("offsets are: ", results[elem].offsets);
		console.log("---------------------------");
	});
}
//--------------- export the find function (required for the marking script)
module.exports ={find}; //do not modify this line
