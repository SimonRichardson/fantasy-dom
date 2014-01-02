module.exports = function (grunt) {
    var config = {
            pkg: grunt.file.readJSON('package.json'),
            jshint: {
                all: [
                    'src/*.js',
                    'src/output/*.js'
                ]
            },
            nodeunit: {
                all: [
                    //'test/*.js',
                    'test/output/io.js'
                ]
            }
        };

    grunt.initConfig(config);
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.registerTask('default', ['jshint', 'nodeunit']);
};
