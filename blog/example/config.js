module.exports = {
    '/login': {
        'GET': true,
        'POST': true,
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
       '/index/out': {
        'GET': ['customer'],
    },   '/index/in': {
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
}
