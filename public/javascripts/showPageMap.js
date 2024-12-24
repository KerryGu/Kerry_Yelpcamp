
    // TO MAKE THE MAP APPEAR YOU MUST
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
        center: campground.geometry.coordinates, // starting position [lng, lat]
        zoom: 8, // starting zoom
    });

new mapboxgl.marker().setLngLat(campground.geometry.coordinates).setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${campground.title}</h3><p>${campground.location}`
        
    )).addTo(map);