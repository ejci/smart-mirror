var gulp = require('gulp');
var gutil = require('gulp-util');
var gulp = require('gulp-help')(require('gulp'));
var sftp = require('gulp-sftp');
var SSH = require('gulp-ssh')
var print = require('gulp-print');
var intercept = require('gulp-intercept');
var config = require('./.config.json')

var credentials = {
    host: config.host,
    user: config.user,
    password: config.password,
    remotePath: '~/'
};
var ssh = new SSH({
    ignoreErrors: true,
    sshConfig: credentials
});

//default task
gulp.task('default', false, function () {
    return gutil.log('Run gulp help for list of tasks.')
});

//copy server to rpi
gulp.task('copy-server', 'Copy relevant files to ' + config.user + '@' + config.host + ' (~/server/).', function () {
    return gulp.src(['server/**', '!server/node_modules', '!server/node_modules/**', '!server/.DS_Store', '!server/.gitignore'])
        .pipe(ssh.dest('server/'));
});

//copy splash to rpi
gulp.task('copy-splash', 'Copy relevant files to ' + config.user + '@' + config.host + ' (~/splash/).', function () {
    return gulp.src(['splash/**'])
        .pipe(ssh.dest('splash/'));
});

//copy sensor to rpi
gulp.task('copy-sensor', 'Copy relevant files to ' + config.user + '@' + config.host + ' (~/sensor/).', function () {
    return gulp.src(['sensor/**', '!sensor/node_modules', '!sensor/node_modules/**', '!sensor/.DS_Store', '!sensor/.gitignore'])
        .pipe(ssh.dest('sensor/'));
});

//copy airplay to rpi
gulp.task('copy-airplay', 'Copy relevant files to ' + config.user + '@' + config.host + ' (~/airplay/).', function () {
    return gulp.src(['airplay/**', '!airplay/node_modules', '!airplay/node_modules/**', '!airplay/.DS_Store', '!airplay/.gitignore'])
        .pipe(ssh.dest('airplay/'));

});

//copy google assistant to rpi
gulp.task('copy-google-assistant', 'Copy relevant files to ' + config.user + '@' + config.host + ' (~/googleAssitant/).', function () {
    return gulp.src(['googleAssistant/**', 'googleAssistant/googleAssistantPy/**', 'googleAssistant/googleAssistantPy/**', '!googleAssistant/.DS_Store', '!googleAssistant/.gitignore'])
        .pipe(ssh.dest('googleAssistant/'));

});

//copy main to rpi
gulp.task('copy-main', 'Copy main files to ' + config.user + '@' + config.host + ' (~/).', function () {
    return gulp.src(['autostart.sh', 'refresh.sh', 'start.sh', 'vnc.sh', 'permissions.sh', 'install.sh'])
        .pipe(ssh.dest('.ssh-temp'));
});

//copy all
gulp.task('copy', ['copy-main', 'copy-server', 'copy-sensor', 'copy-airplay', 'copy-google-assistant'], function () {
    return gulp.start('permissions');
});

gulp.task('npm-install', 'Run npm install in ~/server, ~/airplay & ~/sensor', function () {
    return ssh.exec(['cd ~/server && npm install', 'cd ~/sensor && npm install', 'cd ~/airplay && npm install']);
});

gulp.task('permissions', 'Fix permissions', function () {
    return ssh.exec(['mv ~/.ssh-temp/* ~/', 'chmod +x ~/permissions.sh', '~/permissions.sh']);
});

//remote rpi chrome refresh
gulp.task('rpi-refresh', 'Will restart node app (forever restartall) and will refresh chromium window (ctrl+r).', function () {
    return ssh
        .exec(['~/refresh.sh']);
});

//remote rpi chrome refresh
gulp.task('rpi-restart', 'Execute shutdown -r now on ' + config.user + '@' + config.host + ' [restart].', function () {
    return ssh
        .exec(['sudo shutdown -r now']);
});

//remote rpi shutdown
gulp.task('rpi-shutdown', 'Execute shutdown -h now on ' + config.user + '@' + config.host + ' [shutdown].', function () {
    return ssh
        .exec(['sudo shutdown -h now']);
});

//remote rpi chrome refresh
gulp.task('rpi-vnc', 'Will start the VNC server on rpi', function () {
    return ssh
        .exec(['~/vnc.sh']);
});

//copy and reload app + browser
gulp.task('refresh', ['copy', 'rpi-refresh']);

//copy and reload app + browser
gulp.task('deploy', ['copy', 'npm-install', 'rpi-refresh']);