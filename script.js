window.onload = () => {
    const changeButton = document.querySelector('button[data-action="change"]');
    changeButton.innerText = '🔄';

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const places = loadPlaces(position.coords.latitude, position.coords.longitude);
                renderPlaces(places);
            },
            (err) => {
                console.warn('Erreur GPS, utilisation des coordonnées simulées.', err);
                const simulatedLatitude = 46.158051;
                const simulatedLongitude = -1.153400;
                const places = loadPlaces(simulatedLatitude, simulatedLongitude);
                renderPlaces(places);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    } else {
        console.warn('GPS non disponible, utilisation des coordonnées simulées.');
        const simulatedLatitude = 46.158051;
        const simulatedLongitude = -1.153400;
        const places = loadPlaces(simulatedLatitude, simulatedLongitude);
        renderPlaces(places);
    }
};

function loadPlaces(lat, lng) {
    return [
        {
            name: 'Costume d\'Osiris',
            location: {
                lat: lat,
                lng: lng,
            },
        },
    ];
}

const models = [
    {
        url: './assets/costume_dosiris/scene.gltf',
        scale: '0.04 0.04 0.04',
        rotation: '0 180 0',
        info: `
            <strong>Costume d'Osiris</strong>
            <p>Ce costume représente Osiris, dieu égyptien des morts et de la résurrection.</p>
            <ul>
                <li><strong>Coiffe solaire :</strong> Symbole de pouvoir divin.</li>
                <li><strong>Chats en ceinture :</strong> Protection et symbolisme funéraire.</li>
            </ul>
        `,
    },
];

let modelIndex = 0;

const setModel = (model, entity) => {
    if (model.scale) entity.setAttribute('scale', model.scale);
    if (model.rotation) entity.setAttribute('rotation', model.rotation);

    entity.setAttribute('gltf-model', model.url);
    entity.setAttribute('animation', 'property: position; dir: alternate; loop: true; dur: 3000; to: 0 5.2 10');

    const title = document.getElementById('model-title');
    const description = document.getElementById('model-description');
    title.innerText = 'Costume d\'Osiris';
    description.innerHTML = model.info;
};

const renderPlaces = (places) => {
    const scene = document.querySelector('a-scene');

    places.forEach((place) => {
        const latitude = place.location.lat;
        const longitude = place.location.lng;

        const model = document.createElement('a-entity');
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        model.setAttribute('position', '0 5 10');
        model.setAttribute('look-at', '[camera]');

        setModel(models[modelIndex], model);

        model.setAttribute('animation-mixer', '');

        document.querySelector('button[data-action="change"]').addEventListener('click', () => {
            const entity = document.querySelector('[gps-entity-place]');
            modelIndex = (modelIndex + 1) % models.length;
            setModel(models[modelIndex], entity);
        });

        scene.appendChild(model);
    });
};

function toggleInfoPanel() {
    const panel = document.getElementById('info-panel');
    panel.classList.toggle('hidden');
}
