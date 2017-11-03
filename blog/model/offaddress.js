/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict'
var address = {
    sequelize:{
        username: 'root',
        password: '123456',
        database: 'gwifi',
        host: "10.60.0.206",
        dialect: 'mysql',
        define: {
            underscored: false,
            timestamps: true,
            paranoid: true
        }
    }
};
module.exports = address;