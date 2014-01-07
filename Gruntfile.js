module.exports = function (grunt) {
    var config = {
            pkg: grunt.file.readJSON('package.json'),
            jshint: {
                all: [
                    'src/*.js',
                    'src/events/*.js',
                    'src/output/*.js',
                    'src/selectors/*.js'
                ]
            },
            nodeunit: {
                all: [
                    'test/*.js',
                    'test/events/*.js',
                    'test/output/*.js',
                    'test/selectors/*.js'
                ]
            }
        };

    grunt.initConfig(config);
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.registerTask('default', ['jshint', 'nodeunit']);
};
