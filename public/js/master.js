var cpi;

cpi = angular.module("cpi", []);

cpi.controller("CripController", function($scope, $http) {
  $scope.copydate = function(elem) {
    var currentYear;
    currentYear = (new Date).getFullYear();
    return elem.text(currentYear);
  };
  return $http.get("http://localhost:1337/crips").success(function(data) {});
});
