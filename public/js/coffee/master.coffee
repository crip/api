# Angular
cpi = angular.module("cpi", [])

cpi.controller "CPIController", ( $scope, $http ) ->

  $http.get("http://localhost:1337/crips").success ( data ) ->
    console.log data
