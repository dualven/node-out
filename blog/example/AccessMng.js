class AccessMng {
  
   constructor() {
     this.rules= {};
    var xxx = require('./genAccess');
    xxx(this);
    console.log('user constructor');
  }
  static getIns()
  {
      if(!AccessMng.ins){
          AccessMng.ins = new AccessMng();
      }
      return AccessMng.ins;
  }
      //  static db = 'b';
  toString() {
//    return '(' + this.x + ', ' + this.y + ')';
  }
  genit(){
      AccessMng.bbb = 'b';
  }
};

//console.log(AccessMng.getIns().toString());
module.exports = AccessMng;