var knobs = [];

define([], function() {
    requirejs.config({
        shim: {
            'lib/jquery': {
                exports: '$'
            },
            'lib/underscore': {
                exports: '_'
            },
            'lib/swfobject': {
                exports: 'swfobject'
            },
            'lib/rdio': {
                exports: 'rdio'
            }
        }
    });

    //App logic
    requirejs(["lib/swfobject", 'echonest', 'rdioapi', 'knob'],
        function (swfobject, Echonest, Rdio, Knob) {
            var echonest = new Echonest();
            $("#artist-name").on("change", $.proxy(echonest.saveName, echonest));

            //set up the knobs
            $("#interface").find(".knob").each(function() {
                knobs[$(this).data("attribute")]  = new Knob(echonest, $(this), $(this).data("attribute"));
            });
        });
});