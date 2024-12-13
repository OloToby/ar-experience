// Empêcher le zoom tactile et via molette
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
document.addEventListener('gestureend', (e) => e.preventDefault());

document.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
        e.preventDefault();
    }
}, { passive: false });

window.onload = () => {
    const instructions = document.querySelector('.instructions');
    const changeButton = document.querySelector('button[data-action="change"]');
    const infoButton = document.querySelector('button[data-action="info"]');
    let currentModel = null; // Variable pour stocker l'objet du modèle actuel
    let modelIndex = 0; // Index pour naviguer entre les modèles

    instructions.innerText = 'Chargement GPS...';

    // Événement pour afficher les infos du modèle actuel
    infoButton.addEventListener('click', () => {
        if (currentModel) {
            instructions.innerText = `Info : ${currentModel.info}`;
        } else {
            instructions.innerText = 'Aucun modèle chargé.';
        }
    });

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

    const setModel = (model, entity) => {
        if (model.scale) {
            entity.setAttribute('scale', model.scale); // Appliquer l'échelle spécifiée
            console.log('Échelle appliquée : ', model.scale); // Vérification
        }
        if (model.rotation) entity.setAttribute('rotation', model.rotation); // Appliquer la rotation

        entity.setAttribute('gltf-model', model.url); // Charger le modèle GLTF
        entity.setAttribute(
            'animation',
            'property: position; dir: alternate; loop: true; dur: 3000; to: 0 5.2 10'
        ); // Ajouter une animation au modèle

        currentModel = model; // Mettre à jour l'objet du modèle actuel
        instructions.innerText = `Modèle chargé : ${model.info}`; // Mise à jour des instructions
    };

    const renderPlaces = (places) => {
        const scene = document.querySelector('a-scene');

        places.forEach((place) => {
            const latitude = place.location.lat;
            const longitude = place.location.lng;

            const model = document.createElement('a-entity');
            model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`); // Ajouter les coordonnées GPS
            model.setAttribute('position', '0 0 20'); // Ajuster la position pour éloigner le modèle
            model.setAttribute('look-at', '[camera]'); // Faire face à la caméra

            setModel(models[modelIndex], model); // Charger le premier modèle

            model.setAttribute('animation-mixer', ''); // Ajouter un mixer pour les animations

            // Événement pour changer le modèle
            changeButton.addEventListener('click', () => {
                modelIndex = (modelIndex + 1) % models.length; // Passer au modèle suivant
                setModel(models[modelIndex], model); // Charger le nouveau modèle
            });

            scene.appendChild(model); // Ajouter le modèle à la scène
        });
    };
};

// Fonction pour charger des emplacements en fonction des coordonnées
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

// Liste des modèles disponibles avec leurs attributs
const models = [
    {
        url: './assets/sac_dapparat_touareg/scene.gltf',
        scale: '0.08 0.08 0.08',
        rotation: '0 180 0',
        info: 'Sac d\'apparat utilisé par les Touaregs, symbole de statut social et d\'identité culturelle.',
    },
    {
        url: './assets/costume_dosiris/scene.gltf',
        scale: '0.08 0.08 0.08',
        rotation: '0 180 0',
        info: 'Costume rituel représentant Osiris, utilisé dans les cérémonies religieuses de l\'Égypte antique.',
    },
    {
        url: './assets/crane_arsinoitherium/scene.gltf',
        scale: '0.08 0.08 0.08',
        rotation: '0 180 0',
        info: 'Crâne fossile d\'Arsinoitherium, un mammifère préhistorique originaire d\'Afrique.',
    },
    {
        url: './assets/masque_dinitiation_des_jeunes_diola_au_senegal/scene.gltf',
        scale: '0.08 0.08 0.08',
        rotation: '0 180 0',
        info: 'Masque traditionnel utilisé lors des rites d\'initiation des jeunes garçons Diola au Sénégal.',
    },
    {
        url: './assets/masque_gelede/scene.gltf',
        scale: '0.08 0.08 0.08',
        rotation: '0 180 0',
        info: 'Masque Gelede, porté dans les cérémonies des Yoruba pour honorer les femmes et les forces de la nature.',
    },
];

