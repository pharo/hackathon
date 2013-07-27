define(["lib/underscore"], function(_) {
    var Rdio = function() {
//        this.getKey();
//        var rdioElem = $('#rdio');
//        var playbackToken = 'GAtPWC_S_____3E2OHhkZnNmNDQ1bTc1ZTVreWo5YjNxZWV4dHJlbXIuY29tlDFC1de55uBVc-UnoxxtZA==';
//
//        var rdio = rdioElem.rdio(playbackToken);
//        rdioElem.bind('ready.rdio', function () {
//            console.debug("ready");
//        });
//
//        console.debug("rdio");
//        console.debug(rdio);
//
//



console.debug($);
        console.debug("LOAD");
        console.debug(rdio);
        $('#api').bind('ready.rdio', function() {
            console.debug("here");
            $(this).rdio().play('a171827');
        });

        //init rdio
        $('#api').rdio('GAlNi78J_____zlyYWs5ZG02N2pkaHlhcWsyOWJtYjkyN2xvY2FsaG9zdEbwl7EHvbylWSWFWYMZwfc=');


        //init events
//        $("#rdio-play").on("click", function() {
//            console.debug("test");
//            $('#api').rdio().play();
//        });
    };

    Rdio.prototype = {
        outputSuccess: function(data) {
            $("#rdio-output").html("SUCCESS<br/>" + JSON.stringify(data));
        },

        outputError: function(data) {
            $("#rdio-output").html("ERROR<br/>" + JSON.stringify(data));
        },

        getKey: function() {
//            $.ajax({
//                url: "http://api.rdio.com/1/",
//                data: {
//                    api_key: "YXXK8FOBOLXWV5PWF",
//                    method: "getPlaybackToken"
//                },
//                success: $.proxy(this.outputSuccess, this),
//                error: $.proxy(this.outputError, this)
//            });
//
//            $.ajax({
////                url :"http://api.rdio.com/1/",
//                url: "http://api.rdio.com/oauth/request_token",
//                method: "POST",
//                data: {
//                    "method": "get",
//                    "keys": "cdem379gme8f66gzxhuxf58d"
//                },
//                success: $.proxy(this.outputSuccess, this),
//                error: $.proxy(this.outputError, this)
//            });
        }
    };

    return Rdio;
});