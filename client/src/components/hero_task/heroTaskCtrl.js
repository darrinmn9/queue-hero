(function() {
  'use strict';

  angular.module('app.hero_task', [])
    .controller('HeroTaskCtrl', ['ajaxFactory', '$state', 'heroFactory', function(ajaxFactory, $state, heroFactory) {
      var vm = this;
      vm.displayId = 0;
      vm.confirmView = false;
      vm.vendorYelpId = heroFactory.getOrder('vendorYelpId');
      vm.vendor = heroFactory.getOrder('vendor');


      ajaxFactory.getOpenRequests(vm.vendorYelpId)
        .then(function(response) {
          vm.orders = response.data;
        }, function(response) {
          console.log(response.status);
        });

      vm.removeFromQueue = function() {
        ajaxFactory.removeFromQueue(heroFactory.getOrder('username'))
          .then(function(response) {
            heroFactory.setOrder({
              meetingLocation: undefined,
              meetingLocationLatLong: undefined,
              status: undefined,
              vendor: undefined,
              vendorYelpId: undefined
            });
            $state.go('hero_location');
          }, function(response) {
            console.log(response.status);
          });
      };

      //show previous order in orders array
      vm.previous = function() {
        vm.displayId--;
        vm.confirmView = false;
      };

      //show previous order in orders array
      vm.next = function() {
        vm.displayId++;
        vm.confirmView = false;
      };

      //remove order from orders array, and decrement displayId unless there is only one order left
      vm.remove = function(id) {
        if(vm.displayId === vm.orders.length - 1 && vm.orders.length !== 1){
          vm.displayId--;
        }
        vm.orders.splice(id, 1);
      };

      vm.accept = function(id) {
        ajaxFactory.confirmRequest(vm.orders[id]._id, heroFactory.getOrder('queueHero'))
          .then(function(response) {
            //save current transaction to heroFactory
            heroFactory.setOrder(vm.orders[id]);
            heroFactory.setOrder({ transactionId: vm.orders[id]._id });
            $state.go('hero_order');
          }, function(response) {
            console.log(response.status);

          });
      };

    }]);

})();
