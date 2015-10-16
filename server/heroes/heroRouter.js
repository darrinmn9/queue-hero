var heroCtrl = require('./heroCtrl.js');

module.exports = function(app) {
  // need to add specific method to call for each route
  // app.get('/location', heroCtrl.doThis);

  // req: browser nav. location
  // res: map and location options
  app.get('/location', heroCtrl.getLocationOptions);

  // req: option chosen / location of hero
  // res: 201 or error
  app.post('/location', heroCtrl.setLocation);

  // req: browser nav. location
  // map and location options
  app.get('/task', heroCtrl.getOpenRequests);

  // req: obj with order details from the controller
  // res: 201 or error
  app.post('/task', heroCtrl.acceptRequest);


  app.post('/task/removal', heroCtrl.removeFromCheckin);

  // req: rating, requester, transactionId
  // res: 201 or error
  app.post('/order/rate', heroCtrl.rateRequester);
};
