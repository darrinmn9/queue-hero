;(function() {
  'use strict';

  angular.module('app')
    .factory('profileFactory', [function() {
      var profile = {
        username: undefined,
        password: undefined,
        facebookId: undefined,
        profilePhoto: undefined,
        firstName: undefined,
        lastName: undefined,
        phoneNumber: undefined,
        cardNumber: undefined,
        cvc: undefined,
        expirationDate: undefined,
        ratings: undefined,
        billingAddress: undefined,
        city: undefined,
        state: undefined,
        country: undefined
      };

      return {
        getProfile: getProfile,
        setProfile: setProfile
      };


      function getProfile(keys) {
        if (keys === undefined) {
          return profile;
        }

        if (angular.isArray(keys)) {
          var results = {};
          for (var i = 0; i < keys.length; i++) {
            if (keys[i] in profile) {
              results[keys[i]] = profile[keys[i]];
            } else {
              results[keys[i]] = null;
            }
          }
          return results;
        }

        if (angular.isString(keys)) {
          if (keys in profile) {
            return profile[keys];
          }
        }

        return null;
      }


      function setProfile(obj) {
        if (!angular.isObject(obj)) {
          return null;
        }
        var allValidKeys = true;
        for (var key in obj) {
          if (key in profile) {
            profile[key] = obj[key];
          } else {
            allValidKeys = false;
          }
        }
        return allValidKeys;
      }

  }]);

})();
