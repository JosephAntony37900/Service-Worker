
const PROJECTS_CONFIG = [
    {
        id: 1,
        title: "Vixel",
        description: "Plataforma innovadora de edición de píxeles que permite crear arte digital con herramientas avanzadas. Incluye funcionalidades de capas, animaciones y exportación en múltiples formatos.",
        date: "2024-01-15",
        category: "Arte Digital",
        image: "img/vixel.png",
        technologies: ["JavaScript", "Canvas API", "CSS3", "HTML5"],
        links: {
            demo: "#",
            repo: "#"
        },
        gallery: ["img/vixel-1.png", "img/vixel-2.png", "img/vixel-3.png"]
    },
    {
        id: 2,
        title: "Frimeet",
        description: "Aplicación de videoconferencias con características únicas de colaboración en tiempo real. Permite compartir pantalla, chat grupal y pizarra virtual para equipos remotos.",
        date: "2024-02-20",
        category: "Comunicación",
        image: "img/frimeet.jpg",
        technologies: ["React", "WebRTC", "Node.js", "Socket.io"],
        links: {
            demo: "#",
            repo: "#"
        },
        gallery: ["img/frimeet-1.jpg", "img/frimeet-2.jpg"]
    },
    {
        id: 3,
        title: "Geova",
        description: "Sistema de gestión geográfica para visualización de datos territoriales. Incluye mapas interactivos, análisis de datos espaciales y reportes automáticos.",
        date: "2024-03-10",
        category: "GIS",
        image: "img/geova.jpg",
        technologies: ["Leaflet", "Python", "Django", "PostgreSQL"],
        links: {
            demo: "#",
            repo: "#"
        },
        gallery: ["img/geova-1.jpg"]
    },
    {
        id: 4,
        title: "AnimTop",
        description: "Portal web dedicado a los mejores animes, con reseñas, rankings y recomendaciones personalizadas basadas en preferencias del usuario.",
        date: "2024-04-05",
        category: "Entretenimiento",
        image: "img/animtop.png",
        technologies: ["Vue.js", "Firebase", "Sass", "PWA"],
        links: {
            demo: "#",
            repo: "#"
        },
        gallery: ["img/animtop-1.png", "img/animtop-2.png"]
    },
    {
        id: 5,
        title: "Reading Club",
        description: "Plataforma social para amantes de la lectura donde pueden compartir reseñas, crear grupos de lectura y descubrir nuevos libros recomendados por la comunidad.",
        date: "2024-05-12",
        category: "Social",
        image: "img/readingclub.png",
        technologies: ["Angular", "TypeScript", "Express", "MongoDB"],
        links: {
            demo: "#",
            repo: "#"
        },
        gallery: ["img/readingclub-1.png", "img/readingclub-2.png"]
    },
    {
        id: 6,
        title: "Digisan",
        description: "Solución digital para la gestión sanitaria en clínicas y hospitales. Incluye historiales médicos, citas, inventario de medicamentos y reportes de salud.",
        date: "2024-06-18",
        category: "Salud",
        image: "img/digisan.jpg",
        technologies: ["PHP", "Laravel", "MySQL", "Bootstrap"],
        links: {
            demo: "#",
            repo: "#"
        },
        gallery: ["img/digisan-1.jpg", "img/digisan-2.jpg"]
    }
];

// Exportar configuración para usar en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PROJECTS_CONFIG;
}

// Para uso en el navegador
if (typeof window !== 'undefined') {
    window.PROJECTS_CONFIG = PROJECTS_CONFIG;
}

function addProject(projectData) {
    const lastId = Math.max(...PROJECTS_CONFIG.map(p => p.id));
    projectData.id = lastId + 1;
    
    const requiredFields = ['title', 'description', 'date', 'category', 'image', 'technologies', 'links'];
    for (let field of requiredFields) {
        if (!projectData[field]) {
            throw new Error(`Campo requerido: ${field}`);
        }
    }
    
    PROJECTS_CONFIG.push(projectData);
    console.log(`Proyecto "${projectData.title}" agregado exitosamente`);
    
    return projectData.id;
}

function getProjectById(id) {
    return PROJECTS_CONFIG.find(project => project.id === id);
}

function getProjectsByCategory(category) {
    return PROJECTS_CONFIG.filter(project => 
        project.category.toLowerCase() === category.toLowerCase()
    );
}

function getAllCategories() {
    return [...new Set(PROJECTS_CONFIG.map(project => project.category))];
}

function getProjectsByDate(ascending = false) {
    return [...PROJECTS_CONFIG].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return ascending ? dateA - dateB : dateB - dateA;
    });
}

if (typeof window !== 'undefined') {
    window.addProject = addProject;
    window.getProjectById = getProjectById;
    window.getProjectsByCategory = getProjectsByCategory;
    window.getAllCategories = getAllCategories;
    window.getProjectsByDate = getProjectsByDate;
}

console.log('Configuración de proyectos cargada');
console.log(`Total de proyectos configurados: ${PROJECTS_CONFIG.length}`);