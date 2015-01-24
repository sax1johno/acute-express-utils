/**
 * acute-express-utils contains common utilities that are used throughout
 * the acute framework.  This is a place to put common utilities that 
 * don't really have another place to go.
 **/
var _ = require('underscore'),
    async = require('async'),
    sutil = require('util'),
    path = require('path');
   
/**
 * Walks the file system and directories, starting at @baseDir and returns
 * the file tree as an object.
 * 
 * Optionally ignores file names or directories starting with anything in 
 * @ignoreArray
 * 
 * @param baseDir the base directory that acts as the root of the tree
 * @param ignoreArray (optional) an array of filename prefixes to ignore
 * @param fn a callback with (err, tree) that contains the file tree
 **/
var walkFs = function(baseDir, ignoreArray, fn) {
  var sutil = require('util'),
      files = [];
  
  // If ignoreArray is a function then it was not specified and probably intended
  // to be the callback function.
  if (_.isFunction(ignoreArray)) {
    fn = ignoreArray;
    ignoreArray == [];
  }
  else if (!sutil.isArray(ignoreArray)) {
    fn("ignoreArray should be an array or undefined.");
    return;
  }
  
  var finder = require('findit')(baseDir || ".")
  var path = require('path');

  finder.on('directory', function (dir, stat, stop) {
      var base = path.basename(dir);
      if (base === '.') stop()
      // else console.log("directory found: ", dir + '/')
  });
  
  finder.on('file', function (file, stat) {
    files.push(file);
  });

  // finder.find(baseDir, function (file) {  
  //   //
  //   // This function is called each time a file is enumerated in the dir tree
  //   //
  //   console.log(file);
  // });
 
  finder.on('end', function() {
    console.log("Walk was completed");
    fn(null, files);
  });
  
  finder.on('error', function(err) {
    console.log("An error was encountered: ", err);
    fn(err.path);
  })
};

/** 
 * Takes an array of files names and a base directory and creates a file tree
 * using the path components.
 * @param fileArray an array of files
 * @param basedir the root of the file tree
 * @param fn a callback with the signature (err, tree)
 **/
var pathsToFileTree = function(files, basedir, fn) {
  var tree = [];
  async.each(files, function(file, cb) {
    
    var relativePath = path.relative(basedir, file);
    // var base = path.dirname(file);
    var pathComponents = relativePath.split(path.sep);
    // to reverse this, call pathComponents.join(path.sep);
    
    // console.log("pathComponents = ", pathComponents);
    tree.push(pathComponents);
    cb();
  }, function(err) {
    if (err) {
      fn(err);
    } else {
      fn(null, tree);
    }
  });
}

/**
 * Converts path components in an array to a path.
 * @param pathComponents the array that describes the file path.
 * @param fn a callback with the signature (path)
 **/
var urlFromPathComponents = function(pathComponents, basedir, fn) {
  // Pop the file name off of the end.
  pathComponents.pop();
  fn("/" + pathComponents.join("/"));
}
    // This snippet of code can search through a relative path to get the directory
    // structure and separate them out into separate path components
    // var relativePath = path.relative(baseDir, file);
    // var pathComponents = relativePath.split(path.sep);
    // // console.log("path components", pathComponents);
    // if (pathComponents.length > 1) {
    //   async.reduce(pathComponents, returnFile, function(memo, item, callback){
    //     console.log(memo);
    //     if (_.isUndefined(memo[item])) {
    //       memo[item] = {};
    //     }
    //     callback(null, memo[item])
    //   }, function(err, result){
    //     console.log("end of reduce method");
    //       // result is now equal to the last value of memo, which is 6
    //       result[pathComponents[-1]] = file;
    //       console.log(sutil.inspect(returnFile));
    //   });
    // }

/**
 * @options is the hash of options the user passes in when creating an instance
 * of the plugin.
 * @imports is a hash of all services this plugin consumes.
 * @register is the callback to be called when the plugin is done initializing.
 */
module.exports = function setup(options, imports, register) {
    var async = require('async'),
        fs = require('fs'),
        config = require('../config');  // Default configuration
    var app = imports.app;
  
  register(null, {
    utils: {
      walkFs: walkFs,
      pathsToFileTree: pathsToFileTree,
      urlFromPathComponents: urlFromPathComponents
    }
  });
};