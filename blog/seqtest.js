/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';
var main = require('./lib');//want to hander database

//var config = require('./model');
var config = require('./model/offaddress.js');
var Sequelize = require('sequelize');
var db = {
    sequelize: new Sequelize(config.sequelize.database, config.sequelize.username, config.sequelize.password, config.sequelize)
};
//db.Seq = db.sequelize.import('./model/seqtest.js');// get db conect
db.Seq = db.sequelize.import('./model/onlinehots.js');// get db conect

db.onlinehots = db.sequelize.import('./model/onlinehots.js');// get db conect
db.customer = db.sequelize.import('./model/customer.js');// get db conect
db.onlinehots.hasOne(db.customer, {foreignKey: 'id'});
//
//db.onlinehots.findAndCountAll({include: [{model:db.customer,attributes:['customer_name'],required: true}]
////    ,
////    attributes:['gw_id','customer_id']
//})
//        .then(function (result) {
//    console.log(result);
//    console.log(result.rows[0]['gw_id']);
////    (result.rows[0]).customer_name = result.rows[0]['customer']['customer_name'];
//    console.log(result.rows[0]);
//    console.log(result.rows[0].get({'plain': true}));
////  console.log(result.get({'plain': true}));//for findOne
//});
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
//db.sequelize.transaction(function (t) {
//    console.log("+++++++++++++++++++");
//    return db.Seq.create(saveUser, {
//        transaction: t
//    }).then(function (result) {
//        console.log("insert ok");
//    }).catch(function (err) {
//        console.log("发生错误：" + err);
//    });
//})
var Promise = require('bluebird');
var Builder = require('./lib/builder.js');
var req = require('./lib/base.json');
var expected = {order: [['id', 'ASC']], offset: 0, limit: 2};
Promise.promisifyAll(db.Seq.findAndCountAll);
var builder = new Builder(db.Seq, req);
var con = builder.getParams();
console.log(con);
builder.fetchResults().then(function () {
    var response = builder.getResponse();
    console.log('now I get *******', response);
});
