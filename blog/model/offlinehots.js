/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict'
var offlinehots = function(sequelize,DataTypes){
    var off = sequelize.define('think_hotspot',{
        gw_id:{
             type:DataTypes.INTEGER
        },
        name:{
            type:DataTypes.STRING
        },
        street_address:{
            type:DataTypes.STRING
        },
        last_heartbeat_at:{
            type:DataTypes.DATE
        },
        customer_id:{
            type:DataTypes.INTEGER
        },
         local_name:{
            type:DataTypes.STRING
        }
    },{
        freezeTableName: true,
         'timestamps': false,
         createdAt:false,
         updatedAt:false,
         deletedAt:false

    });
    return off;
};
module.exports = offlinehots;