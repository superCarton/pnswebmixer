/**
 * Created by remy on 30/11/15.
 */

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        express: {
            options: {
                port: 4000
            },
            build: {
                options: {
                    script: 'bin/pns_drone_delivery_server.js'
                }
            }
        },

        watch: {
            all: {
                files: ['./**/*.js'],
                tasks: ['express:build:stop', 'express:build'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.registerTask('serve', function(){
        grunt.task.run(['express:build','watch']);
    });
};