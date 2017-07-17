/* ====== FOURSQUARE ======= */
var fourSqr = {
    setVenueContent: function(query, id, callback) {
        // Create new Handler and Template to avoid a race condition
        new Handler(new TemplateAssembler())
            .resolve(query, id, callback);
    }
};

        // The handler starts resolution by requesting the venue to FourSquare
var Handler = function(template) {
    var obj = {};

    obj.resolve = function(id, query, callback) {
        // Resolution finishes when the callback is called
        this.requestVenue(connector.getVenueURL(query), id, callback);
    };


    obj.template = template;

    obj.apologizeToClient = function(callback) {
        template.setVenueHTML();
        callback(template.html());
    };

    obj.photo = function(url, callback) {
        var self = this;
        $.get(url, function(data, status) {
            if (status === 'success' && data.response.photos.items.length > 0)
                template.setPhotoHTML(data.response.photos.items[0]);
            callback(template.html());
        }).catch(function() {
            self.apologizeToClient(callback);
        });
    };

    obj.requestVenue = function(url, id, callback) {
        var self = this;

        $.get(url, function(data, status) {
            if (status === 'success') {
                var place = find(id, data);
                template.setVenueHTML(place);
                // TODO: store info for reuse during current session
                if (place)
                    self.photo(connector.getPhotoURL(id), callback);
                else
                    callback(template.html());
            } else
                self.apologizeToClient(callback);
            // TODO: Support photo request even if venue request was not a success
        }).catch(function() {
            self.apologizeToClient(callback);
        });

        // inner function to find the right venue in Four Square's response
        var find = function(id, data) {
            for (var i = 0; i < data.response.venues.length; i++)
                if (data.response.venues[i].id === id)
                    return data.response.venues[i];
            return null;
        };
    };

    return obj;
};

var TemplateAssembler = function() {
    var obj = {};

    obj.top = '';
    obj.center = '';
    obj.bottom = '';
    obj.htmlTemplate = {
        header: '<h3 class="info-venue-title">' + '#NAME#' + '</h3>',
        img: '<img src="' + '#PREFIX#' + '180' + '#SUFFIX#' + '">',
        phone: '<p class="info-venue-content"><strong>Phone</strong>: ' + '#PHONE#' + '</p>',
        address: '<p class="info-venue-content"><strong>Address</strong>: ' + '#ADDRESS#' + '</p>',
        fourSqrLink: '<p><a href="' + 'https://foursquare.com/v/' + '#ID#' + '?ref=' + connector.clientID +
        '" target="_blank" class="info-venue-content">Checkout more at FourSquare></a></p>'
    };

    obj.setVenueHTML = function(venue) {
        if (venue) {
            this.top = this.htmlTemplate.header.replace('#NAME#', venue.name);
            if (venue.contact.phone)
                this.bottom = this.htmlTemplate.phone.replace('#PHONE#', venue.contact.phone);
            if (venue.location.address)
                this.bottom += this.htmlTemplate.address.replace('#ADDRESS#', venue.location.address);
            this.bottom += this.htmlTemplate.fourSqrLink.replace('#ID#', venue.id);
        } else {
            this.top = '<h2>Sorry!</h2>';
            this.bottom = '<p>No info could be found for this location</p>';
        }
    };

    obj.setPhotoHTML = function(photo) {
        if (photo)
            this.center = this.htmlTemplate.img.replace('#PREFIX#', photo.prefix).replace('#SUFFIX#', photo.suffix);
    };

    obj.html = function() {
        return this.top + this.center + this.bottom;
    };

    return obj;
};

var connector = {
    clientID: 'GHE2SLTC2WDUUN2V0NGQ2JJUZW12DNKABZWYWPM1AU5PNO2V',
    clientSecret: 'WRW1ETHIVCIU12KR05BRIUVCDITOLGMD2PTYZMRZ42FFZ3ZS',
    APIVersionDate: '20161016',
    getVenueURL: function(query) {
        return "https://api.foursquare.com/v2/venues/search?client_id=" +
            this.clientID + "&client_secret=" + this.clientSecret + "&" + "&ll=40.7,-74&query="+ query; + "v=" +
            this.APIVersionDate + "m=foursquare"
    },
    getPhotoURL: function(id) {
        return "https://api.foursquare.com/v2/venues/" + id +
            "/photos?client_id=" + this.clientID +
            "&client_secret=" + this.clientSecret +
            "&v=" + this.APIVersionDate;
    }
};