'use strict';
//newspai.org c04b53bafee4499dba5218367450c1af
//openweathermap.org f503abd5782fc05b029565d9a7a305b4
//quandl.com R7JxEaf9cSmxNCEsULi7

angular.module('components', []).component('clock', {
    templateUrl: 'templates/clock.html',
    controller: function ($interval) {
        var comp = this;
        comp.colon = true;
        var tick = function () {
            comp.date = new Date();
            comp.colon = (Math.round(comp.date.getTime() / 1000) % 2) === 0;
            //console.log(Math.round(comp.date.getTime()/1000),comp.colon);
        };
        tick();
        $interval(tick, 1 * 1000);
    }
}).component('airplay', {
    templateUrl: 'templates/airplay.html',
    controller: function () {
        var comp = this;
        comp.playing = false;
        comp.meta = {
            album: '',
            artist: '',
            title: ''
        };
        var socket = io();
        socket.on('airplay', function (msg) {
            console.log('IO:airplay', msg);
            if (msg.meta) {
                comp.playing = true;
                comp.meta = msg.meta;
            }
            if (msg.command === 'start') {
                comp.playing = true;
            }
            if (msg.command === 'stop') {
                comp.playing = false;
                comp.meta = {
                    album: '',
                    artist: '',
                    title: ''
                };
            }
        });

    }
}).component('temperature', {
    templateUrl: 'templates/temperature.html',
    controller: function ($http, $interval) {
        var comp = this;
        comp.temperature = '-';
        comp.humidity = '-';
        var tick = function () {
            $http({
                method: 'GET',
                url: 'api/room/temperature'
            }).
                success(function (data, status, headers, config) {
                    comp.status = 'Ok';
                    comp.temperature = data.temperature;
                    comp.humidity = data.humidity;
                }).
                error(function (data, status, headers, config) {
                    comp.articles = [];
                    comp.temperature = '-';
                    comp.humidity = '-';
                });
        };
        tick();
        $interval(tick, 10 * 1000);
    }
}).component('news', {
    templateUrl: 'templates/news.html',
    controller: function ($http, $interval) {
        var comp = this;
        comp.status = false;
        comp.articles = [];
        var tick = function () {
            $http({
                method: 'GET',
                url: 'api/news'
            }).
                success(function (data, status, headers, config) {
                    comp.status = 'Ok';
                    comp.articles = data.articles;
                }).
                error(function (data, status, headers, config) {
                    comp.articles = [];
                    comp.status = false;
                    comp.error = 'Something went wrong...';
                });
        };
        tick();
        $interval(tick, 60 * 1000);
    }
}).component('weather', {
    templateUrl: 'templates/weather.html',
    controller: function ($http, $interval) {
        var comp = this;
        comp.weather = {};
        comp.main = {};
        comp.wind = {};
        comp.icon = 'refresh';
        comp.status = false;
        var tick = function () {
            $http({
                method: 'GET',
                url: 'api/weather'
            }).
                success(function (data, status, headers, config) {
                    CONST.weatherIcons
                    var code = data.weather[0].id;
                    var icon = CONST.weatherIcons[code].icon;
                    var hour = (new Date()).getHours();
                    var prefix
                    if (hour > 6 && hour < 20) {
                        prefix = 'day-';
                    } else {
                        prefix = 'night-';
                        if (icon == 'sunny') {
                            icon = 'clear';
                        }
                    }
                    if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
                        icon = prefix + '' + icon;
                    }
                    comp.icon = icon;
                    comp.weather = data.weather[0];
                    comp.main = data.main;
                    comp.wind = data.wind;

                }).
                error(function (data, status, headers, config) {
                    comp.weather = {};
                    comp.icon = 'na';
                    comp.status = false;
                    comp.error = 'Something went wrong...';

                });
        };
        tick();
        $interval(tick, 60 * 1000);
    }
}).component('quote', {
    templateUrl: 'templates/quote.html',
    controller: function ($http, $interval) {
        var comp = this;
        comp.quote = '';
        comp.author = '';
        comp.image = '';
        comp.length = 0;
        var tick = function () {
            $http({
                method: 'GET',
                url: 'api/quote'
            }).
                success(function (data, status, headers, config) {
                    comp.quote = data.contents.quotes[0].quote;
                    comp.author = data.contents.quotes[0].author;
                    comp.image = data.contents.quotes[0].bckgrounf;
                    comp.length = data.contents.quotes[0].length;
                }).
                error(function (data, status, headers, config) {
                    comp.quote = '';
                    comp.author = '';
                    comp.image = '';
                    comp.length = 0;
                });
        };
        tick();
        $interval(tick, 60 * 1000);
    }
}).component('nest', {
    templateUrl: 'templates/nest.html',
    controller: function ($interval) {
        var comp = this;
        var tick = function () {
        };
        tick();
        $interval(tick, 1 * 1000);
    }
});
