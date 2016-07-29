const express = require('express');
const consign = require('consign');
const cluster = require('cluster');

if(cluster.isMaster && process.env.NODE_ENV !== 'test') {
    const numWorkers = require('os').cpus().length;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for(let i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
    const app = express();

    app.use(express.static('public'));

    require('strict-mode')(function () {
      consign()
        .include('configs')
        .then('models')
        .then('system')
        .then('helpers')
        .then('drivers')
        .then('adapters')
        .then('routes')
        .then('notFound.js')
        .into(app);
    });

    app.listen(app.get('port'));

    module.exports = app;
}