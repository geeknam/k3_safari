var KoganApp = angular.module('KoganApp', []);


KoganApp.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

function NotificationsController($scope, $http) {
    var notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS));
    if(notifications !== null) {
        $scope.notifications = notifications;
    }
    else {
        $http.get(API_URL).success(function(response){
            angular.forEach(response, function(value, key){
               value.data.url += UTM + '&utm_campaign=' + value.type ;
            });
            $scope.notifications = response;
            localStorage.setItem(NOTIFICATIONS, JSON.stringify(response));
        });
    }

    $scope.search = function() {
        var newTab = safari.application.activeBrowserWindow.openTab("background");
        newTab.url = "http://www.kogan.com/au/search/?keywords=" + $scope.keyword + '&' + UTM.slice(1);
    };
}


