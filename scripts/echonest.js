define(["lib/jquery", "lib/underscore"], function($, _) {
    var Echonest = function() {
        this.artist_id = null;
        this.song_id = null;
        this.artist_name = $("#artist-name").val();
        this.suggest();

        var _this = this;
        $("#id-list").on("click", "a.suggest_artist", function(e) {
            e.preventDefault();
            _this.artist_id = $(this).attr("rel");
            _this.songs();
            console.debug("set: " + _this.artist_id);
        });
        $("#song-id-list").on("click", "a.suggest_song", function(e) {
            e.preventDefault();
            _this.song_id = $(this).attr("rel");
            _this.getSongData();
            console.debug("set: " + _this.song_id);
        });

        this.scale = 50;
        this.on = false;
        this.search_data = {};
        this.search_sort = "";
        this.setSearch("loudness", null, 200);
        this.setSearch("danceability", null, 1000);
        this.setSearch("energy", null, 1000);
        this.setSearch("liveness", null, 1000);
        this.setSearch("speechiness", null, 1000);
        this.setSearch("acousticness", null, 1000);


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

        setSearch: function(music_attr, music_value, max_value) {
            this.search_sort = music_attr
            if (!music_value) {
                this.search_data["min_" + music_attr] = null;
                this.search_data["max_" + music_attr] = null;
            } else {
                var min = (music_value - (max_value / this.scale));
                if (min < 0) { min = 0;}
                var max = (music_value + (max_value / this.scale));
                if (max > max_value) { max = max_value;}

                this.search_data["min_" + music_attr] = min / max_value;
                this.search_data["max_" + music_attr] = max / max_value;
            }

            console.debug(this.search_data);
//            console.debug(JSON.stringify(this.search_data));
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

        getSongData: function() {
            $.ajax({
                url: "http://developer.echonest.com/api/v4/song/profile",
                data: {
                    api_key: "YXXK8FOBOLXWV5PWF",
                    format: "json",
                    id: this.song_id,
                    bucket: "audio_summary"
                },
                success: $.proxy(this.setSongData, this),
                error: $.proxy(this.outputError, this)
            });
        },

        setSongData: function(data) {
            knobs["loudness"].setValue(data.response.songs[0].audio_summary.loudness * 1000);
            knobs["danceability"].setValue(data.response.songs[0].audio_summary.danceability * 1000);
            knobs["energy"].setValue(data.response.songs[0].audio_summary.energy * 1000);
            knobs["liveness"].setValue(data.response.songs[0].audio_summary.liveness * 1000);
            knobs["speechiness"].setValue(data.response.songs[0].audio_summary.speechiness * 1000);
            knobs["acousticness"].setValue(data.response.songs[0].audio_summary.acousticness * 1000);
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
        },

        songs: function() {
            if (this.artist_id) {
                $.ajax({
                    url: "http://developer.echonest.com/api/v4/artist/songs",
                    data: {
                        api_key: "YXXK8FOBOLXWV5PWF",
                        format: "json",
                        id: this.artist_id,
                        results: 100
                    },
                    success: $.proxy(this.showSongs, this),
                    error: $.proxy(this.outputError, this)
                });
            } else {
                console.debug("Click an Artist first");
            }
        },

        getTrack: function(track_id) {
//            $.ajax({
//                url: "http://developer.echonest.com/api/v4/song/profile",
//                data: {
//                    api_key: "YXXK8FOBOLXWV5PWF",
//                    format: "json",
//                    id: track_id
//                },
//                success: $.proxy(this.outputSuccess, this),
//                error: $.proxy(this.outputError, this)
//            });
        },

        showSongs: function(data) {
            var suggestion_html = "";
            _.each(data.response.songs, function(song) {
                suggestion_html += "<a href='#' class='suggest_song' rel='" + song.id + "'>" + song.title + "</a><br/>";
            });

            $("#song-id-list").html(suggestion_html);
        }
    };

    return Echonest;
});