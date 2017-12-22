class AccessMng {

    constructor() {
        this.rules = {};
        this.finished = false;
        this.store = false;
        var xxx = require('./genAccess');
        xxx(this);
        console.log('user constructor');
    }
    static getIns()
    {
        if (!AccessMng.ins) {
            AccessMng.ins = new AccessMng();
        }
        return AccessMng.ins;
    }
    //  static db = 'b';
    toString() {
//    return '(' + this.x + ', ' + this.y + ')';
    }
    refreshPermission() {
        var xxx = require('./genAccess');
        xxx(this);
        this.store = false;//让permission 自己去解析
    }
}
;

//console.log(AccessMng.getIns().toString());
module.exports = AccessMng;