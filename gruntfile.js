module.exports = function(grunt) {
  "use strict";
  require("load-grunt-tasks")(grunt);
  require("time-grunt")(grunt);


  var source = ["*.js", "lib/**/*.js", "spec/**/*.js", "package.json", "conf/*.json"],
      pkgJSON = grunt.file.readJSON("package.json"),
      buildVer = pkgJSON.version + (grunt.option("buildNumber") ? "-" + grunt.option("buildNumber") : "");
  
  grunt.initConfig({
    pkg: pkgJSON,
    ver: buildVer,
    jshint: {
      src: source
    },
    jasmine_node: {
      all: ["spec/"]
    },
    clean: {
      testOutput: ["_SpecRunner.html", "*.log"],
      generatedDocs: ["docs/phoenix"],
      package: ["dist", "*.tar.gz"]
    },
    copy: {
      app: {
        files: [
          {expand: true, src: ["package.json", "app.js"], dest: "dist/"},
          {expand: true, src: ["lib/**", "conf/**"], dest: "dist/"}
        ],
        options: {
           process: function(content, srcpath) {
              if(srcpath === "package.json") {
                 var distPkg = JSON.parse(content);
                 distPkg.version = buildVer;
                 return JSON.stringify(distPkg, null, "\t");
              }
              else {
                 return content;
              }
           }
        }
      }
    },
    exec: {
      dist_npm_install: {
        cwd: "dist/",
        cmd: "npm install --production --no-optional"
      }
    },
    compress: {
      app: {
        options: {
          mode: "tgz",
          pretty: true,
          archive: "<%= pkg.name %>_<%= ver %>.tar.gz"
        },
        files: [
          {expand: true, cwd: "dist/", src: ["**/*"], dest: "phoenix"}
        ]
      }
    }
  });

  grunt.registerTask("test", ["jshint", "jasmine_node", "clean:testOutput"]);
  grunt.registerTask("package", ["copy:app", "compress:app"]);
  grunt.registerTask("release", ["clean", "test", "package"]);

  // alias default to test since that's most likely what we want to do.
  grunt.registerTask("default", ["test"]);
};
