var cpi;

cpi = angular.module("cpi", []);

cpi.controller("CPIController", function($scope, $http) {
  return $http.get("http://localhost:1337/crips").success(function(data) {
    return console.log(data);
  });
});
