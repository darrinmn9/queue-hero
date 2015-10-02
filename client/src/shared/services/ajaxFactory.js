(function() {
  'use strict';

  angular.module('app')
  .factory('ajaxFactory', ['$http', function($http) {
    var serverUrl = 'http://localhost:3000';
    var ajaxObj = {};

    ajaxObj.getProfileData = function(username) {
      return $http({
        method: 'GET',
        url: serverUrl + '/choice',
        //params can be retrieved from server using req.query.username
        params: { username: username }
      });
    };

    ajaxObj.isOrderComplete = function(transactionId) {
      return $http({
        method: 'GET',
        url: serverUrl + '/order/details',
        params: { id: transactionId }
      });
    };

    ajaxObj.postSignUp = function (user) {
      return $http({
        method: 'POST',
        url: serverUrl + '/signUp',
        //user data can be retrieved from server using req.data.user
        data: { user: user }
      });
    };



    return ajaxObj;

  }]);

})();