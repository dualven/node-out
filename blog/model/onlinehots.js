/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict'
var onlinehots = function (sequelize, DataTypes) {
    var User = sequelize.define('online', {
        gw_id: {
            type: DataTypes.STRING,
            field: 'gw_id',
            unique: true,

        },
        gw_name: {
            type: DataTypes.STRING,
            field: 'name',
        },
        street: {
            type: DataTypes.STRING,
            field: 'street_address',
        },
        onlinetime: {
            type: DataTypes.INTEGER,
            field: 'last_heartbeat_at',
        },
        customer_id: {
            type: DataTypes.INTEGER,
            unique: true,
            primaryKey: true

        },
        created_at_time: {
            type: DataTypes.DATEONLY,
            field: 'created_at',

        }
    }, {
        freezeTableName: true,
        tableName: 'think_hotspot',
        'timestamps': false,
        createdAt: false,
        updatedAt: false,
        deletedAt: false
    });
    return User;
};
module.exports = onlinehots;