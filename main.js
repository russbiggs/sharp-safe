
(function() {



    var southWest = L.latLng(34.8,-107),
    northEast = L.latLng(35.28,-106.3),
    bounds = L.latLngBounds(southWest, northEast);

    var map = L.map('map', {maxBounds: bounds}).setView([35.1,-106.577001], 13);



    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoicnVzc2JpZ2dzIiwiYSI6ImNqejVvaTNhNDBjYXQzYnF3dW5rN2xjMTcifQ.PfG98OH4GydoDSuiQXh04g'
    }).addTo(map);
    
    var disposals = [];
    var loc;
    var findBtn = document.querySelector('.find-btn');
    map.locate({setView: true, maxZoom: 13});
    
    function onLocationFound(e) {
        loc = [e.latlng.lat,e.latlng.lng];
        L.marker(e.latlng).addTo(map)
        L.circle(e.latlng).addTo(map); 
        findBtn.disabled = false;
    }
    
    map.on('locationfound', onLocationFound);
    
    var icon = L.icon({
        iconUrl: 'pin.png',
        shadowUrl: 'shadow.png',
        iconSize:     [48, 48], 
        iconAnchor:   [22, 48], 
        shadowAnchor: [22, 52],  
        popupAnchor:  [-3, -46] 
    });
    fetch('data.geojson').then(data => data.json()).then(points => {
        disposals= points;
        L.geoJSON(points, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: icon});
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<h3>'+feature.properties.name+'</h3><p>'+feature.properties.address+'</p>');
              }
        }).addTo(map);
    })

    var snack = document.querySelector('.snack');
    
    
    findBtn.addEventListener('click', function() {
        var point = [loc[1], loc[0]]
        var nearest = turf.nearestPoint(point, disposals);
        var distance =nearest.properties.distanceToPoint;
        var lon = nearest.geometry.coordinates[0];
        var lat = nearest.geometry.coordinates[1];
        map.flyTo({lon: lon, lat: lat}, 18,{duration: 2.0})
        
        snack.classList.remove('snack--hidden');
        snack.classList.add('snack--visible');
        var miles = distance * 0.621371
        snack.innerHTML = miles.toFixed(2)+ ' miles from you';
         setTimeout(() => {
            snack.classList.remove('snack--visible');
          setTimeout(() => {
            snack.classList.add('snack--hidden');
            snack.innerHTML = '';
          }, 500);
        }, 2500);

    })
})()
