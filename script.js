window.onload = () => {
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = '﹖';

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const places = loadPlaces(position.coords.latitude, position.coords.longitude);
                renderPlaces(places);
            },
            (err) => {
                console.warn('Erreur GPS, utilisation des coordonnées simulées.', err);
                // Coordonnées simulées pour un bâtiment
                const simulatedLatitude = 46.158051;
                const simulatedLongitude = -1.153400;
                const places = loadPlaces(simulatedLatitude, simulatedLongitude);
                renderPlaces(places);
            },
            { enableHighAccuracy: true }
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

var models = [
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
];

var modelIndex = 0;
var setModel = function (model, entity) {
    if (model.scale) {
        entity.setAttribute('scale', model.scale);
    }

    if (model.rotation) {
        entity.setAttribute('rotation', model.rotation);
    }

    if (model.position) {
        entity.setAttribute('position', model.position);
    }

    entity.setAttribute('gltf-model', model.url);

    const div = document.querySelector('.instructions');
    div.innerText = model.info;
};

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;

        let model = document.createElement('a-entity');

        // Définir les coordonnées GPS et placer l'objet au sol
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        model.setAttribute('position', '0 5 10');


        setModel(models[modelIndex], model);

        model.setAttribute('animation-mixer', '');

        // Changer les modèles avec un bouton
        document.querySelector('button[data-action="change"]').addEventListener('click', function () {
            var entity = document.querySelector('[gps-entity-place]');
            modelIndex++;
            var newIndex = modelIndex % models.length;
            setModel(models[newIndex], entity);
        });

        scene.appendChild(model);
    });
}
