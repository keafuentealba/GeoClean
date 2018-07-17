var map = L.map('map').fitWorld();

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(map);

function onLocationFound(e) {
	var radius = e.accuracy / 2;

	L.marker(e.latlng).addTo(map)

  getNearPlaces(e.latlng.lat, e.latlng.lng, map);
}

function onLocationError(e) {
	alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

map.locate({setView: true, maxZoom: 16});

window.getNearPlaces = (lat, long, map) => {
	lat = -33.4883118;
	long = -70.5100325;
  return fetch('http://159.65.98.171/v1/places/'+ lat + ','+ long)
  .then((responses) => {
    return responses.json();
  }).then((responses) => {
		var greenIcon = L.icon({
	    iconUrl: 'img/leaf-green.png',
	    shadowUrl: 'img/leaf-shadow.png',

	    iconSize:     [38, 95], // size of the icon
	    shadowSize:   [50, 64], // size of the shadow
	    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
	    shadowAnchor: [4, 62],  // the same for the shadow
	    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
		});

		var yellowIcon = L.icon({
	    iconUrl: 'img/leaf-yellow.png',
	    shadowUrl: 'img/leaf-shadow.png',

	    iconSize:     [38, 95], // size of the icon
	    shadowSize:   [50, 64], // size of the shadow
	    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
	    shadowAnchor: [4, 62],  // the same for the shadow
	    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
		});

		var redIcon = L.icon({
	    iconUrl: 'img/leaf-red.png',
	    shadowUrl: 'img/leaf-shadow.png',

	    iconSize:     [38, 95], // size of the icon
	    shadowSize:   [50, 64], // size of the shadow
	    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
	    shadowAnchor: [4, 62],  // the same for the shadow
	    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
		});


		responses.forEach((place) => {
			if(place.status == 'green'){
				L.marker(place.location.coordinates, {icon: greenIcon}).addTo(map)
					.bindPopup('<b>' + place.name + '</b><br><b>type:</b> ' + place.type + '<br><b>difficulty:</b> ' +place.difficulty+ '<br><button type="button" class="btn btn-primary" onClick="getEvents()">Eventos</button>');
			}
			if(place.status == 'yellow'){
				L.marker(place.location.coordinates, {icon: yellowIcon}).addTo(map)
					.bindPopup('<b>' + place.name + '</b><br><b>type:</b> ' + place.type + '<br><b>difficulty:</b> ' +place.difficulty+ '<br><button type="button" class="btn btn-primary" onClick="getEvents()">Eventos</button>');
			}
			if(place.status == 'red'){
				L.marker(place.location.coordinates, {icon: redIcon}).addTo(map)
					.bindPopup('<b>' + place.name + '</b><br><b>type:</b> ' + place.type + '<br><b>difficulty:</b> ' +place.difficulty+ '<br><button type="button" class="btn btn-primary" onClick="getEvents()">Eventos</button>');
			}
		})
    console.log(responses);
  });

};

window.getEvents = (slug) => {
	fetch('http://159.65.98.171/v1/places/quebrada-macul/events')
	.then((result) => {
		return result.json();
	})
	.then((events) => {
		let html = '';
		events.forEach((event) => {
			html += '<h1>'+event.name+'</h1>';
			html += '<b>Start Date: </b>'+event.start_date+'<br>';
			html += '<b>End Date: </b>'+event.end_date+'<br>';
			html += '<p>'+event.description+'</p>';
			html += '<h2>Voluntarios</h2>';
			html += '<ul>';
			event.volunteers.forEach((volunteer) => {
				html += '<li>'+volunteer.name+', '+volunteer.age+'</li>';
			});
			html += '</ul>'
			let data = document.getElementById('eventData');
			console.log(data);
			data.innerHTML = html;
			$('#eventsModal').modal({'show':true});
		});
	});
};

window.checkLoginState = () => {
  FB.getLoginStatus(function(response) {
    loadMap(response);
  });
};


window.onload = (e) => {
	FB.getLoginStatus(function(response) {
    loadMap(response);
	});
}

window.loadMap = (FacebookResponse) => {
	if(FacebookResponse.status === 'connected'){
		login = document.getElementById('loginFirst');
		data = document.getElementById('principal');

		login.classList.add('hidden');
		data.classList.remove('hidden');
		map.invalidateSize();
		map.locate({'setView': true});
	}
}
