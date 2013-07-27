define(["lib/jquery", "lib/underscore"], function($, _) {
    var Echonest = function() {
        this.artist_id = null;
        this.artist_name = $("#artist-name").val();
        this.suggest();

        var _this = this;
        $("#id-list").on("click", "a.suggest_artist", function(e) {
            e.preventDefault();
            _this.artist_id = $(this).attr("rel");
            console.debug("set: " + _this.artist_id);
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