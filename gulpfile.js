var gulp = require('gulp');
var gutil = require('gulp-util');
var gulp = require('gulp-help')(require('gulp'));
var sftp = require('gulp-sftp');
var SSH = require('gulp-ssh')
var config = require('./.config.json')

var ssh = new SSH({
    ignoreErrors: false,
    sshConfig: {
        host: config.host,
        user: config.user,
        password: config.password
    }
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

//copy sensor to rpi
gulp.task('copy-main', 'Copy main files to ' + config.user + '@' + config.host + ' (~/).', function () {
    return gulp.src(['autostart.sh','refresh.sh','start.sh'])
        .pipe(ssh.dest('~/'));
});

//copy all
gulp.task('copy', ['copy-server','copy-sensor','copy-airplay'],function(){
    return gulp.start('permissions');
});

gulp.task('npm-install', 'Run npm install in ~/server, ~/airplay & ~/sensor', function () {
    return ssh.exec(['cd ~/server && npm install','cd ~/sensor && npm install','cd ~/airplay && npm install']);
});

gulp.task('permissions', 'Fix permissions', function () {
    return ssh.exec(['chmod +x ~/permissions.sh','~/permissions.sh']);
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

//copy and reload app + browser
gulp.task('refresh', ['copy', 'rpi-refresh']);