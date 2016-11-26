/*global angular, firebase*/
/*jslint node:true*/
'use strict';

angular
.module('hosaApp')
.controller('adminCtrl', ['$firebaseArray', '$scope', '$state', 'Auth', 'NAV_LINKS',
function ($firebaseArray, $scope, $state, Auth, NAV_LINKS) {
  $scope.siteNavLinks = NAV_LINKS.internal;
  
  $scope.user = Auth.$getAuth();
  $scope.signOut = function () {
    Auth.$signOut();
    $scope.user = null;
    Auth.$onAuthStateChanged(function (firebaseUser) {
      if (firebaseUser) {
        $scope.user = firebaseUser;
        $scope.errorNotice = 'Unable to sign out.';
      } else {
        $state.go('home');
      }
    });
  };
  $scope.noticeSuccess = null;
  
  var importantDatesRef = firebase.database().ref('home/importantDates');
  $scope.importantDates = $firebaseArray(importantDatesRef);
  
  $scope.addDate = function () {    
    var utc = new Date().toJSON().slice(0,10);
    
    var newDate = {
      name: '--------',
      location: '--------',
      startDate: '--------',
      endDate: '--------',
      description: '--------',
    };
    
    $scope.importantDates.$add(newDate)
    .then(function (ref) {
      var data = ref;
      console.log('Added new record with id ' + ref.key);
    });
  };
  
  $scope.refreshBindings = function () {
    var importantDatesRef = firebase.database().ref('home/importantDates');
    $scope.importantDates = $firebaseArray(importantDatesRef);
  };
}]);