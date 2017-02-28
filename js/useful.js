var latitude
var longitude
var place_id


function getWeather() {
    $("#weather").html("")
    $("#weather").append("<tr><td> Current weather: <br><br>")
    var $table = $("<p>")
    j = $('#zipCode').val()
    $.ajax('http://api.wunderground.com/api/dd53adf2370f476e/conditions/q/' + j + '.json').done(function (stuff){
        var people = stuff.results
        $table.html($table.html() + "<tr><td>" + stuff["current_observation"]["display_location"]["full"] + "<br>"
                + stuff["current_observation"]["weather"] + "<br>"
                + '<img src="' + stuff["current_observation"]["icon_url"] + '"><br>'
                + "Temp: " + stuff["current_observation"]["temp_f"] + " F" + "<br>"
                + "Feels like: " + stuff["current_observation"]["feelslike_f"] + " F" + "<br>"
                + "Humidity: " + stuff["current_observation"]["relative_humidity"])
        $('#weather').append($table)
        $('#weatherTag1').html(stuff["current_observation"]["weather"])
        $('#lastUpdate').html(stuff["current_observation"]["observation_time"])
        latitude = stuff["current_observation"]["display_location"]["latitude"]
        longitude = stuff["current_observation"]["display_location"]["longitude"]
        directions()
        companies()
    })
}


function directions(){
    $("#directions").html("")
    $("#directions").append("<tr><td>Distance from The Iron Yard: <br><br>")
    var $directions = $("<p>")
    $.ajax('https://maps.googleapis.com/maps/api/directions/json?origin=334+Blackwell+St+Durham&destination='
            + latitude + ',' + longitude).done(function (data){
        $directions.html($directions.html() + "<tr><td>" + "Distance: "
                                            + data['routes'][0]['legs'][0]['distance']['text'] + '<br>'
                                            + "Driving duration: " + data['routes'][0]['legs'][0]['duration']['text'])
        $('#directions').append($directions)
    })
}


function companies(){
    $("#companies").html("")
    $("#companies").append("<tr><td>Companies: <br><br>")
    var $companies = $("<p>")
    $.ajax('https://maps.googleapis.com/maps/api/place/radarsearch/json?location='
            + latitude + ',' + longitude + "&radius=5000&type=company&keyword=software|python|development&key=AIzaSyB6UnGTKVEIBUmCUjjB_iQVtooMae2qfRI").done(function (data){
        for(i = 0; i < data.results.length; i++){
            place_id = data.results[i]['place_id']
            $.ajax('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + place_id + '&key=AIzaSyB6UnGTKVEIBUmCUjjB_iQVtooMae2qfRI').done(function (stuff){
                $companies.html($companies.html() + "<tr><td>" + stuff.result['name'] + '<br>' + "Address: "
                                                    + stuff.result['formatted_address'] + '<br>'
                                                    + stuff.result['formatted_phone_number'] + '<br>'
                                                    + "Website: " + "<a href='" + stuff.result['website'] + "'>" + stuff.result['website'] + '</a><br>')
            })
        }
        $('#companies').append($companies)
    })
}


$("#searchButton").click(getWeather)
