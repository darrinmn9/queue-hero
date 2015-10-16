(function() {
  'use strict';

  angular.module('app.choice', ['ngCookies'])
  .controller('ChoiceCtrl', ['choiceModel', 'profileFactory', '$state', '$cookies', 'heroFactory', 'requesterFactory', '$scope', function(choiceModel, profileFactory, $state, $cookies, heroFactory, requesterFactory, $scope) {
    var vm = this;

    if (!profileFactory.getProfile('facebookId')) {
      vm.facebookId = $cookies.get('com.queuehero');
      profileFactory.setProfile({ facebookId: vm.facebookId });
    } else {
      vm.facebookId = profileFactory.getProfile('facebookId');
    }
    $cookies.remove('com.queuehero');


    //when controller loads, fire GET request for user info if
    //there is a facebookId in the scope
    if(vm.facebookId) {
      choiceModel.getProfileData(vm.facebookId)
        .then(function successCallback(response) {
          //will be executed if status code is 200-299
          var data = response.data;

          //save profile information into factory for future use
          profileFactory.setProfile(data);
          heroFactory.setOrder({ queueHero: data.username });
          requesterFactory.setOrder({ requester: data.username });

          $scope.$broadcast('gotname');


        }, function errorCallback(response) {
          //will be exectcuted if status code is 300+
          var statusCode = response.status;
        });
    }

      vm.hero = function() {
        $state.go('hero_location');
      };

      vm.requester = function() {
        $state.go('requester_task');
      };

  }]);

})();
