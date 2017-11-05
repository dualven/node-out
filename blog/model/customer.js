/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict'
var customer = function (sequelize, DataTypes) {
    var off = sequelize.define('customer', {
        customer_id: {
            type: DataTypes.INTEGER,
            field: 'id',
            primaryKey: true,
            references: {
                model: "online",
                key: "customer_id"
            },
        },
        customer_name: {
            type: DataTypes.STRING,
            field: 'name'}
    }, {
        freezeTableName: true,
        tableName: 'think_customer',
        'timestamps': false,
        createdAt: false,
        updatedAt: false,
        deletedAt: false,
//        indexes: [{
//                name: 'customer_hotId',
//                method: 'BTREE',
//                fields: ['id']
//            }]

    });
    return off;
};
module.exports = customer;