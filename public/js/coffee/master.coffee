# Angular
cpi = angular.module("cpi", [])

cpi.controller "CripController", ( $scope, $http ) ->

  $scope.copydate = (elem) ->
    currentYear = (new Date).getFullYear()
    return elem.text currentYear

  $http.get("http://localhost:1337/crips").success ( data ) ->
