// Empêcher le zoom tactile et via molette
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
document.addEventListener('gestureend', (e) => e.preventDefault());

// Bloquer le zoom avec la molette
document.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
        e.preventDefault();
    }
}, { passive: false });


window.onload = () => {
    const instructions = document.querySelector('.instructions');
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = 'Changer le modèle';

    instructions.innerText = 'Chargement GPS...';

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                instructions.innerText = 'Position détectée, chargement des modèles...';
                const places = loadPlaces(position.coords.latitude, position.coords.longitude);
                renderPlaces(places);
            },
            (err) => {
                console.warn('Erreur GPS, utilisation des coordonnées simulées.', err);
                instructions.innerText = 'Erreur GPS. Chargement avec des coordonnées simulées.';
                const simulatedLatitude = 46.158051;
                const simulatedLongitude = -1.153400;
                const places = loadPlaces(simulatedLatitude, simulatedLongitude);
                renderPlaces(places);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    } else {
        console.warn('GPS non disponible. Utilisation des coordonnées simulées.');
        instructions.innerText = 'GPS non disponible. Chargement avec des coordonnées simulées.';
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
        url: './assets/sac_dapparat_touareg/scene.gltf',
        scale: '1 1 1',
        rotation: '0 180 0',
        info: 'Sac d\'apparat touareg',
    },
    {
        url: './assets/costume_dosiris/scene.gltf',
        scale: '1 1 1',
        rotation: '0 180 0',
        info: 'Costume d\'Osiris',
    },
    {
        url: './assets/crane_arsinoitherium/scene.gltf',
        scale: '1 1 1',
        rotation: '0 180 0',
        info: 'Crâne Arsinoitherium',
    },
    {
        url: './assets/masque_dinitiation_des_jeunes_diola_au_senegal/scene.gltf',
        scale: '1 1 1',
        rotation: '0 180 0',
        info: 'Masque d\'initiation des jeunes Diola au Sénégal',
    },
    {
        url: './assets/masque_gelede/scene.gltf',
        scale: '1 1 1',
        rotation: '0 180 0',
        info: 'Masque Gelede',
    },
];

let modelIndex = 0;

const setModel = (model, entity) => {
    if (model.scale) entity.setAttribute('scale', model.scale);
    if (model.rotation) entity.setAttribute('rotation', model.rotation);

    entity.setAttribute('gltf-model', model.url);
    entity.setAttribute(
        'animation',
        'property: position; dir: alternate; loop: true; dur: 3000; to: 0 5.2 10'
    );

    const infoDiv = document.querySelector('.instructions');
    infoDiv.innerText = `Modèle chargé : ${model.info}`;
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
            modelIndex = (modelIndex + 1) % models.length;
            setModel(models[modelIndex], model);
        });

        scene.appendChild(model);
    });
};
