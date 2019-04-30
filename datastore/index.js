const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');


var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

// Use the unique id generated by getNextUniqueId to create a 
// file path inside the dataDir. Each time a POST request is
//  made to the collection route, save a file with the todo
//   item in this folder. Only save the todo text in the file,
//    the id of the todo item is encoded into its filename -- 
//    DO NOT STORE AN OBJECT.
exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    //create file path inside dataDir
    //id is file name
    if (err) {
      //console.log('INSIDE GETNEXTUNIQUEID ERROR')
      callback('Error getNextUniq', id);
    } else {
      // console.log('create id: ', id);
      var filePath = path.join(exports.dataDir, id + '.txt');
      //console.log(filePath);
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback('error on create file', id);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });


};

// Next, refactor the readAll function by returning an array of 
// todos to client app whenever a GET request to the collection 
// route occurs. To do this, you will need to read the dataDir
//  directory and build a list of files. Remember, the id of
//   each todo item is encoded in its filename.
exports.readAll = (callback) => {

  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });



  //read each file on the dataDir
  fs.readdir(exports.dataDir, function (err, files) {
    //handling error
    if (err) {
      //console.log('Unable to scan directory: ' + err);
      callback('Error', []);
    } else {
      //get name of file
      // set an object with id and text to be file name and push
      var arrObjs = [];

      files.forEach(function (file) {

        fs.readFile(exports.dataDir+'/'+file, (err ,text) => {
          if (err) {
            callback('error on read file', id);
          } else {
            var fileName = path.basename(file, '.txt');
            var fileTxt = text.toString();
            var tuple = {id: fileName, text: fileTxt};
            console.log(tuple);
            arrObjs.push(tuple);

            //callback(null, { id, text });
          }
        })
        
      });
      console.log(arrObjs);
      callback(null, arrObjs);


    }
    /*
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log("Inside files for each", file);
        fs.readFile(exports.dataDir+'/'+file, (err ,text) => {
          if (err) {
            //callback('error on create file', id);
          } else {
            console.log(text.toString());
            //callback(null, { id, text });
          }
        })
        
    });*/
  });
        


  

  
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }

  fs.readFile(exports.dataDir + '/' + id + '.txt', (err, text) => {
    if (err) {
      //callback('error on create file', id);
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {id, text: text.toString() });
      
      
    }
  });



};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
  console.log('export update id:', id);
  console.log('export update text:', text);
  

  exports.readOne(id, (err, data) =>{
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text });
        }
      });

    }

  });
 

  


};

exports.delete = (id, callback) => {
  // var item = items[id];
  // console.log(id);
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }

  var filePath = exports.dataDir + '/' + id + '.txt';
  fs.unlink(filePath, (err, data) => {
    if (err) {
      callback(err, null)
    } else {
      callback(null, data);
    }
  })
  /*
  The asynchronous one is fs.unlink().
  The synchronous one is fs.unlinkSync().
  */
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
