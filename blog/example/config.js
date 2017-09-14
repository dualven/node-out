module.exports = {
//  '/api/login': {
//    'GET': false,
//  },
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
    'GET': ['admin'], 
    'POST': ['admin'],
  },
    '/login/check': {
    'GET': true, 
    'POST':['admin'],
  },
  '/': {
    'GET': ['admin'], 
    'POST': ['admin'],
  },
}
