var DOMAIN = 'https://www.kogan.com';
var API_URL = DOMAIN + '/au/api/events/';
var interval = 1;

var last_checked = localStorage.getItem("last_checked");


function createSafariNotification(url, title, message, imageUrl) {
    var _this = this;
    // check for notification compatibility
    if(!window.Notification) {
        // if browser version is unsupported, be silent
        return;
    }
    // log current permission level
    // if the user has not been asked to grant or deny notifications from this domain
    if(Notification.permission === 'default') {
        Notification.requestPermission(function() {
            // callback this function once a permission level has been set
            _this.createSafariNotification(url, title, message, imageUrl);
        });
    }
    // if the user has granted permission for this domain to send notifications
    else if(Notification.permission === 'granted') {
        var n = new Notification(
                    title,
                    {
                      'body': message,
                      // prevent duplicate notifications
                      'tag' : 'unique string',
                      'icon': imageUrl
                    }
                );
        // remove the notification from Notification Center when it is clicked
        n.onclick = function() {
            console.log(safari.application);
            var newTab = safari.application.activeBrowserWindow.openTab("background");
            newTab.url = url;
        };
        // callback function when the notification is closed
        n.onclose = function() {};
    }
    // if the user does not want notifications to come from this domain
    else if(Notification.permission === 'denied') {
        // be silent
        return;
    }
}

function fetchNotification() {
    $.getJSON(API_URL, function(data) {
        var event = data[0];
        createSafariNotification(
            'https://www.kogan.com' + event.data.url,
            event.data.title, event.message,
            'https:' + event.data.image_url
        );
    });

}

function check_new() {
    $.getJSON(API_URL + "count/?timestamp=" + last_checked, function(data) {
        localStorage.setItem("last_checked", data.timestamp);
        if(data.count > 0) {
            fetchNotification();
        }
    });
}

var checkInterval = setInterval(check_new, interval * 60000);

check_new();
