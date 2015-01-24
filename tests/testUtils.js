var architect = require('architect'),
    path = require('path'),
    app,
    sutil = require('util'),
    async = require('async');
    
describe('utils', function() {
    before(function(done) {
        var configPath = path.join(__dirname, "testconfig.js");
        var config = architect.loadConfig(configPath);

        architect.createApp(config, function (err, arch) {
            if (err) {
                console.log("error was encountered", err);
                done(err);
            } else {
                // console.log(sutil.inspect(arch));
                app = arch;
                done();
            }
        });
    });
    describe("#walkFs", function() {
        it("should walk the file system correctly", function(done) {
            var serviceObject = app.getService("utils");
            app.services.utils.walkFs(path.join(__dirname, "testdir"), function(err, file) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log("final file = ", file);
                    done();
                }
                // console.log(file);
                // done();
            });
        });
    });
    describe("#pathsToFileTree", function() {
        it("should walk the file system correctly", function(done) {
            var serviceObject = app.getService("utils");
            app.services.utils.walkFs(path.join(__dirname, "testdir"), function(err, fileArray) {
                if (err) {
                    console.log(err);
                } else {
                    app.services.utils.pathsToFileTree(fileArray, path.join(__dirname, "testdir"), function(err, fileTree) {
                        if (err) {
                            console.error(err);
                        } 
                        console.log("file tree = ", fileTree);
                        done();
                    });
                }
                // console.log(file);
                // done();
            });
        });
    });
    describe("#urlFromPathComponents", function() {
        it("should create a url from path components", function(done) {
            var serviceObject = app.getService("utils");
            app.services.utils.walkFs(path.join(__dirname, "testdir"), function(err, fileArray) {
                if (err) {
                    console.log(err);
                    done();
                } else {
                    app.services.utils.pathsToFileTree(fileArray, path.join(__dirname, "testdir"), function(err, fileTree) {
                        if (err) {
                            console.error(err);
                            done();
                        } else {
                            var routes = [];
                            async.each(fileTree, function(item, cb) {
                                app.services.utils.urlFromPathComponents(item, "/", function(route) {
                                    routes.push(route);
                                    cb();
                                })
                            }, function(err) {
                                console.log(routes);
                                done();
                            })
                        }
                    });
                }
                // console.log(file);
                // done();
            });
        });
    });        
});
