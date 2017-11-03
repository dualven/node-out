/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';
var main = require('./lib');//want to hander database

var config = require('./model');
var Sequelize = require('sequelize');
var db = {
    sequelize: new Sequelize(config.sequelize.database, config.sequelize.username, config.sequelize.password, config.sequelize)
};
db.Seq = db.sequelize.import('./model/seqtest.js');// get db conect

// force create; not force 
//db.sequelize.sync({force: false}).then(function () {
//    console.log("Server successed to start");
//}).catch(function (err) {
//    console.log("Server failed to start due to error: %s", err);
//});
var saveUser = {
    name: 'dxw',
    age: 19,
    height: 182,
    weight: 138
};
db.sequelize.transaction(function (t) {
    console.log("+++++++++++++++++++");
    return db.Seq.create(saveUser, {
        transaction: t
    }).then(function (result) {
        console.log("insert ok");
    }).catch(function (err) {
        console.log("发生错误：" + err);
    });
})
var Promise = require('bluebird');
var Builder = require('./lib/builder.js');
var req = require('./lib/base.json');
var expected = {order: [['id', 'ASC']], offset: 0, limit: 2};
Promise.promisifyAll(db.Seq.findAndCountAll);
var builder = new Builder(db.Seq, req);
    console.log(builder.getParams());
builder.fetchResults().then(function () {
    var response = builder.getResponse();
    console.log('now I get *******',response);
});

//db.Seq.findAndCountAll(expected).then(function(results){
//    console.log(results.count, results.rows);
//  });