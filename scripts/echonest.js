define(["lib/jquery", "lib/underscore"], function($, _) {
    var Echonest = function() {
//        this.artist_id = null;
//        this.artist_name = $("#artist-name").val();
//        this.suggest();
//
//        var _this = this;
//        $("#id-list").on("click", "a.suggest_artist", function(e) {
//            e.preventDefault();
//            _this.artist_id = $(this).attr("rel");
//            console.debug("set: " + _this.artist_id);
//        });


        this.on = false;
        this.search_data = {};
        this.search_sort = "";
        this.setSearch("loudness", null);
        this.setSearch("danceability", null);
        this.setSearch("energy", null);
        this.setSearch("liveness", null);
        this.setSearch("speechiness", null);
        this.setSearch("acousticness", null);


        var _this = this;
        $("#rdio-start").on("click", function() {
            _this.on = true;
            _this.search();
        });
    };

    Echonest.prototype = {
        saveName: function() {
            this.artist_name = $("#artist-name").val();
            this.suggest();
        },

        outputSuccess: function(data) {
            $("#output").html("SUCCESS<br/>" + JSON.stringify(data));
        },

        outputError: function(data) {
            $("#output").html("ERROR<br/>" + JSON.stringify(data));
        },

        setSearch: function(music_attr, music_value) {
            this.search_sort = music_attr
            if (!music_value) {
                this.search_data["min_" + music_attr] = null;
                this.search_data["max_" + music_attr] = null;
            } else {
                var min = (music_value - 50);
                if (min < 0) { min = 0;}
                var max = (music_value + 50);
                if (max > 1000) { max = 1000;}

                this.search_data["min_" + music_attr] = min / 1000;
                this.search_data["max_" + music_attr] = max / 1000;
            }
        },

        getSearchData: function() {
            var ret_val = {};

            for (var prop in this.search_data) {
                if (this.search_data[prop] !== null) {
                    ret_val[prop] = this.search_data[prop];
                }
            }

            return ret_val;
        },

        search: function() {
            if (this.on) {
                $.ajax({
                    url: "http://developer.echonest.com/api/v4/song/search",
                    data: $.extend(this.getSearchData(), {
                        api_key: "YXXK8FOBOLXWV5PWF",
                        format: "json",
                        sort: "danceability-desc"
                    }),
                    success: $.proxy(this.searchResults, this),
                    error: $.proxy(this.outputError, this)
                });
            }
        },

        searchResults: function(data) {
            if (data.response && data.response.songs.length) {
                this.play(data.response.songs[0]);
            } else {
                $("#output").html("NO MATCH");
            }
        },

        play: function(result) {
            $("#output").html("SUCCESS<br/>" +
                "Artist: " + result.artist_name + "<br/>" +
                "Song ID: " + result.id + "<br/>" +
                "Song Title: " + result.title + "<br/>");
        },

        suggest: function() {
            $.ajax({
                url: "http://developer.echonest.com/api/v4/artist/suggest",
                data: {
                    api_key: "YXXK8FOBOLXWV5PWF",
                    format: "json",
                    name: this.artist_name,
                    results: 15
                },
                success: $.proxy(this.suggestArtists, this),
                error: $.proxy(this.outputError, this)
            });
        },

        suggestArtists: function(data) {
            var suggestion_html = "";
            _.each(data.response.artists, function(artist) {
                suggestion_html += "<a href='#' class='suggest_artist' rel='" + artist.id + "'>" + artist.name + "</a><br/>";
            });

            $("#id-list").html(suggestion_html);
        },

        biographies: function() {
            if (this.artist_id) {
                $.ajax({
                    url: "http://developer.echonest.com/api/v4/artist/biographies",
                    data: {
                        api_key: "YXXK8FOBOLXWV5PWF",
                        format: "json",
                        id: this.artist_id
                    },
                    success: $.proxy(this.outputSuccess, this),
                    error: $.proxy(this.outputError, this)
                });
            } else {
                console.debug("Click an Artist first");
            }
        },

        images: function() {
            if (this.artist_id) {
                $.ajax({
                    url: "http://developer.echonest.com/api/v4/artist/images",
                    data: {
                        api_key: "YXXK8FOBOLXWV5PWF",
                        format: "json",
                        id: this.artist_id
                    },
                    success: $.proxy(this.showImages, this),
                    error: $.proxy(this.outputError, this)
                });
            } else {
                console.debug("Click an Artist first");
            }
        },

        showImages: function(data) {
            var image_html = "";
            _.each(data.response.images, function(image) {
                image_html += image.license.attribution +"<br/>";
                image_html += "<img src='" + image.url + "'/><br/><br/>";
            });

            $("#output").html(image_html);
        }
    };

    return Echonest;
});