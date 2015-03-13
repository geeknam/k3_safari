var DOMAIN = 'https://www.kogan.com';
var API_URL = DOMAIN + '/au/api/events/';
var UTM = '?utm_source=kogan&utm_medium=chrome-extension';

var LAST_CHECK_KEY = 'last_checked';
var LAST_SHOWN_SUMMARY = 'last_shown_summary';
var NOTIFICATION_KEY = 'notification_key';
var NOTIFICATIONS = 'notifications';
var OPTIONS_KEY = 'options';

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
