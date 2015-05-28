/* global module:false */
module.exports = function(grunt) {

  // Project configuration.
	grunt.initConfig({
    jshint: {
			all: {
				options: {
					jshintrc: ".jshintrc"
				},

				src: ['Gruntfile.js', '*.js']
			}
		},
	qunit: {
			files: ['test/qunit/**/*.html']
		}
  });

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.registerTask('default', ['jshint', 'qunit']);
};
