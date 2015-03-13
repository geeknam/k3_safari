var KoganApp = angular.module('KoganApp', []);

function OptionsController($scope) {
    $scope.status = 'Save Changes';

    var options = localStorage[OPTIONS_KEY];

    if(!options){
        options = DEFAULT_OPTIONS;
        localStorage[OPTIONS_KEY] = JSON.stringify(options);
    }

    if(typeof options == 'string') {
        options = JSON.parse(options);
    }

    if (!options.version || options.version < DEFAULT_OPTIONS.version) {
        options = DEFAULT_OPTIONS;
        localStorage[OPTIONS_KEY] = JSON.stringify(options);
    }

    $scope.show_notification = options['show_notification'];
    $scope.poll_interval = options['poll_interval'];
    $scope.event_types = options['event_types'];
    $scope.frequency = options['frequency'];

    $scope.save_options = function() {
        var options = {
            'show_notification': this.show_notification,
            'poll_interval': this.poll_interval,
            'event_types': this.event_types,
            'frequency': this.frequency,
            'version': DEFAULT_OPTIONS.version
        };
        localStorage[OPTIONS_KEY] = JSON.stringify(options);
        $scope.status = 'Saved';
        setTimeout(function(){
            chrome.runtime.reload();
        }, 1000);
    };
}
