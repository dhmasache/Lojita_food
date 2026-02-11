const axios = require('axios');

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/';

exports.search = async (req, res) => {
    try {
        const { q } = req.query; // query parameter for search
        if (!q) {
            return res.status(400).json({ message: 'Query parameter "q" is required.' });
        }
        const response = await axios.get(`${NOMINATIM_BASE_URL}search`, {
            params: {
                format: 'json',
                q: q,
                addressdetails: 1, // Include address details
                limit: 1 // Limit to 1 result
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error proxying Nominatim search:', error.message);
        // More detailed error logging for axios errors
        if (error.response) {
            console.error('Nominatim response data:', error.response.data);
            console.error('Nominatim response status:', error.response.status);
            console.error('Nominatim response headers:', error.response.headers);
        } else if (error.request) {
            console.error('Nominatim request data:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        res.status(500).json({ message: 'Error al buscar dirección en Nominatim.' });
    }
};

exports.reverse = async (req, res) => {
    try {
        const { lat, lon } = req.query; // query parameters for reverse geocoding
        if (!lat || !lon) {
            return res.status(400).json({ message: 'Latitude and longitude parameters "lat" and "lon" are required.' });
        }
        const response = await axios.get(`${NOMINATIM_BASE_URL}reverse`, {
            params: {
                format: 'jsonv2', // jsonv2 for more detailed address
                lat: lat,
                lon: lon,
                addressdetails: 1
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error proxying Nominatim reverse geocoding:', error.message);
        if (error.response) {
            console.error('Nominatim response data:', error.response.data);
            console.error('Nominatim response status:', error.response.status);
            console.error('Nominatim response headers:', error.response.headers);
        } else if (error.request) {
            console.error('Nominatim request data:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        res.status(500).json({ message: 'Error al obtener dirección en Nominatim.' });
    }
};
