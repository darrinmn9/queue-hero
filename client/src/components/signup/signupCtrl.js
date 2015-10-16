(function() {
  'use strict';

  angular.module('app.signup', [])

  .controller('SignupCtrl', ['$state', 'signupModel', '$cookies', 'profileFactory', 'heroFactory', 'requesterFactory', function($state, signupModel, $cookies, profileFactory, heroFactory, requesterFactory) {
    var vm = this;
    vm.user =  profileFactory.getProfile() || {};

    vm.user.facebookId = profileFactory.getProfile('facebookId') || $cookies.get('com.queuehero');
    profileFactory.setProfile({ facebookId: vm.user.facebookId });
    vm.welcomeView = false;
    vm.user.country = 'US';


    vm.update = function() {
      $cookies.remove('com.queuehero');
      signupModel.postSignUp(vm.user)
        //will be executed if status code is 200-299
        .then(function successCallback(response) {
          profileFactory.setProfile(vm.user);
          heroFactory.setOrder({ queueHero: vm.user.facebookId });
          requesterFactory.setOrder({ requester: vm.user.facebookId });
          vm.welcomeView = true;
        //will be exectcuted if status code is 300+
        }, function errorCallback(response) {
          var statusCode = response.status;
        });
    };

    vm.goToChoice = function() {
      $state.go('choice');
    };

  }]);

})();

