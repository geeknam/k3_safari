var poll_interval = 1; //minute

var last_state = null;
var last_state_time = null;
var unreadEvents = 0;
var _this;

var DOMAIN = 'https://www.kogan.com';
var API_URL = DOMAIN + '/au/api/events/';
var UTM = '?utm_source=kogan&utm_medium=chrome-extension';

var LAST_CHECK_KEY = 'last_checked';
var LAST_SHOWN_SUMMARY = 'last_shown_summary';
var NOTIFICATION_KEY = 'notification_key';
var NOTIFICATIONS = 'notifications';

var EVENT_TYPES = [
    {
        'name': 'Deals',
        'value': 'custom',
        'checked': true,
    }
];

var DEFAULT_OPTIONS = {
    'show_notification': '1',
    'poll_interval': '1',
    'event_types': EVENT_TYPES,
    'frequency': '1',
    'version': 1
};

var SEARCH_API_URL = DOMAIN + "/au/api/search/";
var COMPARE_API_URL = DOMAIN + "/au/api/events/compare/";


var Notifications = function(){
    _this = this;
    this.options = null;
    this.init();
};

Notifications.prototype.init = function(){
    this.init_options();
    var interval = this.get_poll_interval();

    if (typeof(localStorage) != 'undefined') {
        var checkInterval = setInterval(this.check_for_notification, interval * 6000);
        this.check_for_notification();
    }

    // Listen for messages from content script
    // this.listen();

};


Notifications.prototype.init_options = function() {
    this.options = localStorage["options"];

    if(!this.options){
        this.options = DEFAULT_OPTIONS;
        localStorage["options"] = JSON.stringify(this.options);
    }
    else{
        this.options = JSON.parse(this.options);

        if (!this.options.version || this.options.version < DEFAULT_OPTIONS.version) {
            this.options = DEFAULT_OPTIONS;
            localStorage["options"] = JSON.stringify(this.options);
        }
    }
};

Notifications.prototype.get_preferred_event_types = function() {
    var preferred = [];
    angular.forEach(this.options['event_types'], function(event, idx) {
        if(event.checked) {
            preferred.push(event.value);
        }
    });
    preferred.push('custom');  // allow future custom events
    return preferred;
};

Notifications.prototype.get_poll_interval = function() {
    if(!this.options) {
        return poll_interval;
    }
    return parseInt(this.options.poll_interval);
};

Notifications.prototype.listen = function() {
    console.log('listens');
    // chrome.runtime.onMessage.addListener(
    //     function(message, sender, sendResponse) {
    //         var product = message.product;
    //         var body;
    //         var title;
    //         if(message.cheaper) {
    //             body = product.title;
    //             title = 'Only $' + product.your_price + ' at Kogan';
    //         } else {
    //             body = "This happens very rarely but this price is even better than Kogan.";
    //             title = "We recommend you buy it";
    //         }
    //         var opt = {
    //             type: "image",
    //             title: title,
    //             message: body,
    //             iconUrl: 'icon.png',
    //             imageUrl: 'https://www.kogan.com/thumb/' + product.image + '?size=600x400'
    //         };
    //         notification_id = product.url + UTM + '&utm_campaign=price-match-' + message.competitor;
    //         chrome.notifications.create(notification_id, opt, function(notification_id){
    //             _this.discard_notification(notification_id);
    //         });
    //     }
    // );
};

Notifications.prototype.resetBadgeText = function(value) {
    console.log('reset badge');
    // if (value > 20) {
    //     chrome.browserAction.setBadgeText({text: '20+'});
    // } else if (value > 0) {
    //     chrome.browserAction.setBadgeText({text: value.toString()});
    // } else {
    //     chrome.browserAction.setBadgeText({text: ""});
    // }
    // unreadEvents = value;
};

Notifications.prototype.validate_notification = function(event) {
    var show_notification = this.options['show_notification'];
    var lastNotification = localStorage.getItem(NOTIFICATION_KEY);
    var preferred = this.get_preferred_event_types();
    if(lastNotification != event.data.url && show_notification == '1') {
        return preferred.indexOf(event.type) != -1;
    }
    return false;
};

Notifications.prototype.show_notification = function(event) {
    var url = event.data.url + UTM + '&utm_campaign=' + event.type;
    console.log('show notification');
    // chrome.notifications.create(url, {
    //     type: "basic",
    //     title: event.data.title,
    //     message: event.message,
    //     iconUrl: 'http:' + event.data.image_url
    // }, function(notification_id){
    //     _this.discard_notification(notification_id);
    // });
};

Notifications.prototype.fetch_latest_notification = function(show_popup, show_announcement) {
    $http.get(API_URL).success(function(data){
        // Show announcement even if daily summary is enabled
        if(show_announcement && data[0].type == 'custom') {
            _this.show_notification(data[0]);
        } else if (_this.validate_notification(data[0]) && show_popup) {
            _this.show_notification(data[0]);
            localStorage.setItem(NOTIFICATION_KEY, data[0].data.url);
        }

        angular.forEach(data, function(value, key){
           value.data.url += UTM + '&utm_campaign=' + value.type ;
        });

        localStorage.setItem(NOTIFICATIONS, JSON.stringify(data));
    });
};

Notifications.prototype.get_notifications = function(show_popup, show_announcement) {
    var count;
    var last_checked = localStorage.getItem(LAST_CHECK_KEY);

    $http.get(API_URL + "count/?timestamp=" + last_checked).success(function(data){
        count = data['count'];
        last_checked = data['timestamp'];
        if(count > 0) {
            _this.fetch_latest_notification(show_popup, show_announcement);
            _this.resetBadgeText(count);
        }
        localStorage.setItem(LAST_CHECK_KEY, last_checked);
    });
};

Notifications.prototype.check_for_notification = function() {
    console.log('check_for_notification');
    _this.get_notifications(true, false);
};

Notifications.prototype.to_date = function(date) {
    // Plain date without hours
    var str = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    return new Date(str);
};

Notifications.prototype.discard_notification = function(notification_id) {
    if(last_state == 'active'){
        setTimeout(function() {
            chrome.notifications.clear(notification_id, function(){});
        }, 1500000);
    }
    else {
        setInterval(function() {
            if(last_state == 'active') {
                setTimeout(function() {
                    chrome.notifications.clear(notification_id, function(){});
                }, 1000000);
                clearInterval(this);
            }
        }, 1000);
    }
};

new Notifications();


