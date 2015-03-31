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
		}
  });

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.registerTask('default', 'jshint');
};
