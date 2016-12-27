/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var  async = require('async');
async.series([
     function(callback){
        setTimeout(function(){
            callback(null, 1);
            console.log("one");
        }, 2000);
    },
     function(callback){
        setTimeout(function(){
            callback(null, 2);
            console.log("two");
        }, 1000);
    }
],
function(err, results) {
    // results is now equal to: {one: 1, two: 2}
});
