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
			.bindPopup("You are within " + radius + " meters from this point").openPopup();

		L.circle(e.latlng, radius).addTo(map);
    alert(radius);
    alert(e.latlng.lat);
    alert(e.latlng.lng);
    getNearPlaces(e.latlng.lat, e.latlng.lng);
	}

	function onLocationError(e) {
		alert(e.message);
	}

  function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
  }


	map.on('locationfound', onLocationFound);
	map.on('locationerror', onLocationError);
  map.on('click', onMapClick);

	map.locate({setView: true, maxZoom: 16});

  window.getNearPlaces = (lat, long) => {
    return fetch('http://159.65.98.171/v1/places/'+ lat + ','+ long)
    .then((responses) => {
      console.log(responses);
      return responses.json();
    }).then((responses) => {
      console.log(responses);
    });

  };
