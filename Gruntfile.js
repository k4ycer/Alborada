module.exports = function(grunt){
    grunt.initConfig({
        clean: {
            build: "build"
        },
        copy: {
            debug: {
                files: [
                    {
                        expand: true,
                        cwd: "public/",
                        src: ["css/**"],
                        dest: "build/"
                    },
                    {
                        expand: true,
                        cwd: "public/",
                        src: ["js/vendor/**"],
                        dest: "build/"
                    },
                    {
                        expand: true,
                        cwd: "public/",
                        src: ["*.html"],
                        dest: "build/"
                    },
                    {
                        expand: true,
                        cwd: "public/",
                        src: ["img/**"],
                        dest: "build/"
                    },
                    {
                        expand: true,
                        cwd: "public/",
                        src: ["fonts/**"],
                        dest: "build/"
                    }
                ]
            }
        },
        ts: {
            default: {
                tsconfig: './tsconfig.json'
            }
        },
        uglify: {
            release: {
                src: 'build/tsc.js',
                dest: 'build/bundle.min.js'
            }
        },
        watch: {
            // lint js files when they change, and then copy them over to build directory
            ts: {
              files: ['public/js/**/*.ts'],
              tasks: ['build:debug']
            },
      
            // run the less:debug task if a less file changes
            css: {
              files: ['public/css/**/*.css'],
              tasks: ['copy:debug']
            },
      
            // run the jade:debug task if a jade file changes
            html: {
              files: ['public/*.html'],
              tasks: ['copy:debug']
            },
      
            // run the whole build again if the process changes
            rebuild: {
              files: ['Gruntfile.js'],
              tasks: ['build:debug']
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask("build:debug", "clean, compile typescript, copy", ["clean", "ts", "copy:debug"]);
    grunt.registerTask("build:release", "clean, compile typescript, copy, optimize", ["clean", "ts", "copy:debug", "uglify:release"]);

    grunt.registerTask("dev", ["build:debug", "watch"]);
}