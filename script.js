window.onload = () => {
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = 'Changer le modèle';

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
            name: 'Pokèmon',
            location: {
                lat: lat,
                lng: lng,
            },
        },
    ];
}

const models = [
    {
        url: './assets/magnemite/scene.gltf',
        scale: '0.3 0.3 0.3',
        info: 'Magnemite, Lv. 5, HP 10/10',
        rotation: '0 180 0',
    },
    {
        url: './assets/articuno/scene.gltf',
        scale: '0.01 0.01 0.01',
        rotation: '0 180 0',
        info: 'Articuno, Lv. 80, HP 100/100',
    },
    {
        url: './assets/dragonite/scene.gltf',
        scale: '0.04 0.04 0.04',
        rotation: '0 180 0',
        info: 'Dragonite, Lv. 99, HP 150/150',
    },
    {
        url: './assets/costume_dosiris/scene.gltf',
        scale: '0.04 0.04 0.04',
        rotation: '0 180 0',
        info: 'Costume_dosiris, Lv. 99, HP 150/150',
    },
];

let modelIndex = 0;

const setModel = (model, entity) => {
    if (model.scale) entity.setAttribute('scale', model.scale);
    if (model.rotation) entity.setAttribute('rotation', model.rotation);
    if (model.position) entity.setAttribute('position', model.position);

    entity.setAttribute('gltf-model', model.url);
    entity.setAttribute('animation', 'property: position; dir: alternate; loop: true; dur: 3000; to: 0 5.2 10');

    const infoDiv = document.querySelector('.instructions');
    infoDiv.innerText = model.info;
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
