	// TO MAKE THE MAP APPEAR YOU MUST
	// ADD YOUR ACCESS TOKEN FROM
	// https://account.mapbox.com
mapboxgl.accessToken = mapToken;
    
//create a map
    const map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-103.5917, 40.6699],
        zoom: 3
    });

    map.on('load', () => {
        // Add a new source from our GeoJSON data and
        // set the 'cluster' option to true. GL-JS will
        // add the point_count property to your source data.
        map.addSource('campgrounds', {
            type: 'geojson',
          //points to campgrounds data 
            data: campgrounds,
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });

        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'campgrounds',
            filter: ['has', 'point_count'],
            paint: {
                // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
                // with three steps to implement three types of circles:
                //   * Blue, 20px circles when point count is less than 10
                //   * Yellow, 30px circles when point count is between 10 and 730
                //   * Pink, 40px circles when point count is greater than or equal to 30
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#51bbd6',
                    10,
                    '#f1f075',
                    30,
                    '#f28cb1'
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20, // pixel width(circle radius)
                    10, //step(counts below 10)
                    30, //pixel width(circle radius)
                    30, //step(counts from 10 to 30)
                    40 // pixel with for any counts above 30
                ]
            }
        });

        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'campgrounds',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': ['get', 'point_count_abbreviated'],
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
        });

        map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'campgrounds',
            //display when the point doesn't have a point count
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#11b4da',
                'circle-radius': 4,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
            }
        });

        // inspect a cluster on click
        // event listener : run the function when a cluster point is slick
        map.on('click', 'clusters', (e) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });
            const clusterId = features[0].properties.cluster_id;
            map.getSource('campgrounds').getClusterExpansionZoom(
                clusterId,
                (err, zoom) => {
                    if (err) return;

                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                }
            );
        });

        // When a click event occurs on a feature in
        // the unclustered-point layer, open a popup at
        // the location of the feature, with
        // description HTML from its properties.
        map.on('click', 'unclustered-point', (e) => {
            //features[0] = selected campground, campground.properties contains popUpMarkup virtual
            const { popUpMarkup } = e.features[0].properties;
            const coordinates = e.features[0].geometry.coordinates.slice();
           

            // Ensure that if the map is zoomed out such that
            // multiple copies of the feature are visible, the
            // popup appears over the copy being pointed to.
            if (['mercator', 'equirectangular'].includes(map.getProjection().name)) {
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(
                popUpMarkup)
                .addTo(map);
        });

        // when a mouse moves over a cluster point, the mouse becomes a pointer symbel
        map.on('mouseenter', 'clusters', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', () => {
            map.getCanvas().style.cursor = '';
        });
    });