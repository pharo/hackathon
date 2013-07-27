define([], function() {
    requirejs.config({
        shim: {
//            'lib/jquery': {
//                exports: '$'
//            },
            'lib/underscore': {
                exports: '_'
            },
//            'lib/swfobject': {
//                exports: 'swfobject'
//            },
//            'lib/rdio': {
//                exports: 'rdio'
//            }
        }
    });

    //App logic
    requirejs(["lib/swfobject", 'echonest', 'rdioapi'],
        function (swfobject, Echonest, Rdio) {
//            var echonest = new Echonest();
//            $("#artist-name").on("keyup", $.proxy(echonest.saveName, echonest));
//            $("#biographies").on("click", $.proxy(echonest.biographies, echonest));
//            $("#images").on("click", $.proxy(echonest.images, echonest));



//            swfobject.registerObject("rdio-player", "9.0.0", "assets/expressInstall.swf");
//            console.debug(swfobject);


            console.debug("MAKE RDIO");
            var rdio = new Rdio();

//            console.debug(rdio);
        });
});