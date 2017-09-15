module.exports = {
  '/login/db': {
    'GET': ['customer'],
  },
//
  '/index/welcome': {
    '*': true,
  },
//
//  '/api/users/:id/name': {
//    '*': ['admin'],
//    'GET': ['user', 'admin'],
//    'POST': ['admin'],
//  },
//
//  '/api/users': {
//    '*': ['admin'],
//    'GET': ['user'],
//    'POST': ['user'],
//  },
//
//  '/api/user-only': {
//    '*': ['user'],
//  },
//
//  '/api/admin-only': {
//    '*': ['admin'], 
//  },
  '/login': {
    'GET': true, 
    'POST': true,
  },
    '/login/check': {
    'GET': true, 
    'POST':true,
  },
  '/': {
    'GET': ['admin','customer'], 
  },
}
