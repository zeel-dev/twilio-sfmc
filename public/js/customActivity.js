define([
    'postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    var lastStepEnabled = false;
    var steps = [ // initialize to the same value as what's set in config.json for consistency
        { "label": "Create SMS Message", "key": "step1" }
    ];
    var currentStep = steps[0].key;

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', save);
    //connection.on('clickedBack', onClickedBack);
    //connection.on('gotoStep', onGotoStep);

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
    }

  function initialize(data) {
        console.log("Initializing data data: "+ JSON.stringify(data));
        if (data) {
            payload = data;
        }    

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
         );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log('Has In arguments: '+JSON.stringify(inArguments));

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {

                if (key === 'body') {
                    $('#messageBody').val(val);
                }                                                               

                if (key === 'eventDefinitionKey') {
                    $('#eventDefinitionKey').val(val);
                }

                if (key === 'isSendToKustomer') {
                    $('#isSendToKustomer').prop('checked', val);
                }
            })
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });

    }

    function onGetTokens (tokens) {
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        console.log("Tokens function: "+JSON.stringify(tokens));
        //authTokens = tokens;
    }

    function onGetEndpoints (endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        console.log("Get End Points function: "+JSON.stringify(endpoints));
    }

    function save() {
        console.log("Begin save in custom activity");
        var accountSid = $('#accountSID').val();
        var authToken = $('#authToken').val();
        var messagingService = $('#messagingService').val();
        var body = $('#messageBody').val();
        var eventDefinitionKey = $('#eventDefinitionKey').val();
        var isSendToKustomer = $('#isSendToKustomer').prop('checked') || false;

        payload['arguments'].execute.inArguments = [{
            "accountSid": accountSid,
            "authToken": authToken,
            "messagingService": messagingService,
            "body": body,
            "eventDefinitionKey":eventDefinitionKey,
            "contact_key":"{{Contact.Key}}",
            "recipient":"{{Event." + eventDefinitionKey + "}}",
            "isSendToKustomer" : isSendToKustomer
        }];
        //"to": "{{Contact.Email}}"
        payload['metaData'].isConfigured = true;

        console.log("Payload on SAVE function: "+JSON.stringify(payload));
        connection.trigger('updateActivity', payload);

    }                    

});
