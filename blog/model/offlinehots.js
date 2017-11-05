/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict'
var offlinehots = function (sequelize, DataTypes) {
    var off = sequelize.define('think_hotspot', {
       gw_id:{
            type:DataTypes.STRING,
            field: 'gw_id',
            unique: true,   
           
            
        },
        gw_name:{
            type:DataTypes.STRING,
             field: 'name',
        },
        street:{
            type:DataTypes.STRING,
             field: 'street_address',
        },
        offlinetime:{
            type:DataTypes.DATE,
             field: 'last_heartbeat_at',
        },
        customer_id:{
            type:DataTypes.INTEGER,
             unique: true,   
              primaryKey: true
             
        },
    }, {
        freezeTableName: true,
        'timestamps': false,
        createdAt: false,
        updatedAt: false,
        deletedAt: false

    });
    return off;
};
module.exports = offlinehots;