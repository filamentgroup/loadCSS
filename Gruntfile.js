/* global module:false */
module.exports = function(grunt) {

	require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

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
		concat: {
			dist: {
				files: {
					'dist/loadCSS.js': ['src/loadCSS.js'],
					'dist/cssrelpreload.js': ['src/cssrelpreload.js'],
					'dist/onloadCSS.js': ['src/onloadCSS.js']
				}
			}
		},
		uglify: {
      options: {
					preserveComments: /^\!/
			},
			dist: {
				files: {
					'dist/loadCSS.min.js': ['src/loadCSS.js'],
					'dist/cssrelpreload.min.js': ['src/cssrelpreload.js'],
					'dist/onloadCSS.min.js': ['src/onloadCSS.js']
				}
			}
		},
		qunit: {
			files: ['test/qunit/**/*.html']
		}
  });

	grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
	grunt.registerTask('stage', ['default']);

};
