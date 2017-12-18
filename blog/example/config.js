module.exports = {
    '/login': {
        'GET': true,
        'POST': true,
    },
    '/user': {
        'GET': true,
    },
    '/about': {
        'GET': true,
    },
    '/solution': {
        'GET': true,
    },
      '/treedist': {
        'GET': ['customer'],
    },
    '/product': {
        'GET': true,
    },
    '/login/db': {
        'GET': ['customer'],
    },
    '/login/dbinfo': {
        'POST': ['customer'],
    },
    '/login/getdbs': {
        'POST': ['customer'],
    },
    '/login/gettables': {
        'POST': ['customer'],
    },
    '/login/getcolumns': {
        'POST': ['customer'],
    },
    '/login/acceptfile': {
        'POST': ['customer'],
    },
    '/login/output': {
        'POST': ['customer'],
    },
    '/login/inputxlsx': {
        'POST': ['customer'],
    },
    '/login/check': {
        'GET': true,
        'POST': true,
    },
    '/': {
        'GET': ['admin', 'customer', null],
    },
    '/index/users': {
        'GET': ['customer'],
    },
    '/index/groups': {
        'GET': ['customer'],
    },
    '/index/codemng': {
        'GET': ['customer'],
    }, '/index/in': {
        'GET': ['customer'],
    },
    '/index/welcome': {
        'GET': ['customer'],
    },
    '/index/profile': {
        'GET': ['customer'],
    },
    '/index/topo': {
        'GET': ['customer'],
    },
    '/users/suggest/': {
        'GET': ['customer'],
        'POST': ['customer'],
    },
    '/users/edittable/': {
        'GET': ['customer'],
        'POST': ['customer'],
    },
    '/users/saveOpers/': {
        'GET': ['customer'],
        'POST': ['customer'],
    },
    '/users/process/': {
        'GET': ['customer'],
        'POST': ['customer'],
    },
    '/users/onemonth/': {
        'GET': true,
        'POST': true,
    },
    '/users/onlinehots/': {
        'GET': true,
        'POST': true,
    },
    '/users/offlinehots/': {
        'GET': true,
        'POST': true,
    },
    '/users/codemng/': {
        'GET': ['customer'],
    },
    '/users/saveCodemng/': {
        'POST': ['customer'],
    },
    '/home': {
        'GET': true,
    },
    '/tree/usersmng/': {
        'GET': ['customer'],
    },
    '/tree/groupsmng/': {
        'GET': ['customer'],
    },
    '/tree/passChange/': {
        'GET': true,
        'POST': true,
    },
    '/tree/passDelete/': {
        'GET': true,
        'POST': true,
    },
    '/tree/getAccess/': {
        'GET': true,
        'POST': true,
    },
    '/tree/commonSaveuser/': {
        'POST': ['customer'],
    },
    '/tree/commonSavegroup/': {
        'POST': ['customer'],
    }

}
