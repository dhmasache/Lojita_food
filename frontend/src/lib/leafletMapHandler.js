// frontend/src/lib/leafletMapHandler.js

let map = null;
let marker = null;
let currentOnLocationChangeCallback = null;

/**
 * Initializes a Leaflet Map in a specified DOM element.
 * @param {HTMLElement} mapElement The DOM element to render the map into.
 * @param {Object} initialLocation An object with lat and lng properties for the initial center.
 * @param {number} zoom The initial zoom level.
 * @param {boolean} draggableMarker Whether the marker should be draggable.
 * @param {function} onLocationChange Callback function (lat, lng, address) when location changes.
 */
export function initializeLeafletMap(mapElement, initialLocation = { lat: -0.1806532, lng: -78.4678288 }, zoom = 15, draggableMarker = true, onLocationChange = () => {}) {
    if (!mapElement) {
        console.error("Map element not found for Leaflet initialization.");
        return;
    }

    if (map) { // If map already exists, destroy it before re-initializing
        map.remove();
        map = null;
        marker = null;
    }

    currentOnLocationChangeCallback = onLocationChange;

    map = L.map(mapElement).setView([initialLocation.lat, initialLocation.lng], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = L.marker([initialLocation.lat, initialLocation.lng], { draggable: draggableMarker }).addTo(map);

    const updateLocation = (latLng) => {
        // Reverse geocoding using Nominatim (OpenStreetMap's geocoding service)
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latLng.lat}&lon=${latLng.lng}`)
            .then(response => response.json())
            .then(data => {
                const address = data.display_name || 'Dirección no encontrada';
                currentOnLocationChangeCallback(latLng.lat, latLng.lng, address);
            })
            .catch(error => {
                console.error('Error during reverse geocoding:', error);
                currentOnLocationChangeCallback(latLng.lat, latLng.lng, 'Error al obtener dirección');
            });
    };

    // Event listener for marker drag
    marker.on('dragend', (event) => {
        const latLng = event.target.getLatLng();
        updateLocation(latLng);
    });

    // Event listener for map clicks
    map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        updateLocation(e.latlng);
    });

    // Initial update with the provided location
    updateLocation(initialLocation);
    return map;
}

/**
 * Gets the current location (lat, lng) from the marker on the map.
 * @returns {Object|null} An object with lat and lng, or null if map/marker not initialized.
 */
export function getCurrentLeafletMapLocation() {
    if (marker) {
        const latLng = marker.getLatLng();
        return { lat: latLng.lat, lng: latLng.lng };
    }
    return null;
}

/**
 * Sets the map center and marker position.
 * @param {Object} location An object with lat and lng properties.
 * @param {number} zoom The zoom level to set.
 */
export function setLeafletMapLocation(location, zoom = map ? map.getZoom() : 15) {
    if (map && marker) {
        const newLatLng = L.latLng(location.lat, location.lng);
        map.setView(newLatLng, zoom);
        marker.setLatLng(newLatLng);
        // Trigger callback for the new location
        if (currentOnLocationChangeCallback) {
            // Reverse geocode to get address for the callback
            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${newLatLng.lat}&lon=${newLatLng.lng}`)
                .then(response => response.json())
                .then(data => {
                    const address = data.display_name || 'Dirección no encontrada';
                    currentOnLocationChangeCallback(newLatLng.lat, newLatLng.lng, address);
                })
                .catch(error => {
                    console.error('Error during reverse geocoding:', error);
                    currentOnLocationChangeCallback(newLatLng.lat, newLatLng.lng, 'Error al obtener dirección');
                });
        }
    }
}

/**
 * Search for a location by address and set the map center and marker.
 * Uses Nominatim for geocoding.
 * @param {string} address The address to search for.
 * @param {function} onLocationChange Callback function (lat, lng, address) when location is found.
 */
export function searchAddressOnLeafletMap(address, onLocationChange = () => {}) {
    if (!address) {
        console.warn("No address provided for search.");
        onLocationChange(null, null, '');
        return;
    }
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);
                const newLatLng = L.latLng(lat, lng);
                setLeafletMapLocation({ lat, lng }, map.getZoom()); // Use current zoom
                onLocationChange(lat, lng, data[0].display_name);
            } else {
                console.warn('Address not found:', address);
                alert('No se pudo encontrar la dirección: ' + address);
                onLocationChange(null, null, 'Dirección no encontrada');
            }
        })
        .catch(error => {
            console.error('Error during geocoding search:', error);
            alert('Error al buscar dirección: ' + error.message);
            onLocationChange(null, null, 'Error al buscar dirección');
        });
}
