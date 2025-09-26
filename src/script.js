if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('./service-worker.js', { scope: '/Service/' });
            console.log('service Worker registrado exitosamente:', registration.scope);
            updateSWStatus('Service Worker activo', 'sw-active');
            
            registration.addEventListener('updatefound', () => {
                console.log('Nueva versión del Service Worker disponible');
            });
            
        } catch (error) {
            console.error('Error al registrar el Service Worker:', error);
            updateSWStatus('Error en Service Worker', 'sw-error');
        }
    });

    navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Mensaje del Service Worker:', event.data);
        if (event.data.type === 'CACHE_UPDATED') {
            console.log('Caché actualizada');
        }
    });
} else {
    console.warn('Service Worker no es soportado en este navegador');
    updateSWStatus('Service Worker no soportado', 'sw-error');
}

function updateSWStatus(message, className) {
    const statusElement = document.getElementById('sw-status-text');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = className;
    }
}

const projectsData = window.PROJECTS_CONFIG

function renderProjects() {
    const container = document.getElementById('projects-container');
    
    if (!container) return;

    container.innerHTML = '<div class="loading">Cargando proyectos...</div>';

    setTimeout(() => {
        const projectsHTML = projectsData.map(project => {
            const techTags = project.technologies.map(tech => 
                `<span class="tech-tag">${tech}</span>`
            ).join('');

            return `
                <article class="project-card">
                    <div class="project-header">
                        <h2 class="project-title">${project.title}</h2>
                        <span class="project-date">${formatDate(project.date)}</span>
                    </div>
                    
                    <div class="project-category">${project.category}</div>
                    
                    <p class="project-description">${project.description}</p>
                    
                    <img src="${project.image}" alt="${project.title}" class="project-image" 
                         onerror="this.src='img/placeholder.jpg'" loading="lazy">
                    
                    <div class="technologies">
                        ${techTags}
                    </div>
                    
                    <div class="project-links">
                        <a href="${project.links.demo}" class="project-link" target="_blank">Ver Demo</a>
                        <a href="${project.links.repo}" class="project-link" target="_blank">Repositorio</a>
                        <button onclick="openGallery(${project.id})" class="project-link gallery-button">Galería</button>
                    </div>
                </article>
            `;
        }).join('');

        container.innerHTML = projectsHTML;
    }, 500);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function openGallery(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.getElementById('gallery-modal');
    const galleryContainer = document.getElementById('gallery-container');
    
    const galleryHTML = project.gallery.map(imageSrc => 
        `<img src="${imageSrc}" alt="Galería ${project.title}" class="gallery-image" 
              onerror="this.src='img/placeholder.jpg'" loading="lazy">`
    ).join('');

    galleryContainer.innerHTML = galleryHTML;
    modal.style.display = 'block';
    
    console.log(`Abriendo galería para: ${project.title}`);
}

document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.querySelector('.close');
    const modal = document.getElementById('gallery-modal');
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    renderProjects();
});

window.openGallery = openGallery;

console.log('Script principal cargado');
console.log('Total de proyectos:', projectsData.length);