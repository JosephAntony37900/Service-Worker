const CACHE_NAME = 'blog-proyectos-v1';
const STATIC_CACHE_NAME = 'static-resources-v1';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/src/script.js',
    '/src/img/placeholder.jpg'
];

const DYNAMIC_CACHE_URLS = [
    '/src/img/'
];

self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cacheando archivos estáticos');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Instalación completada');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Error durante la instalación:', error);
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activando...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
                            console.log('Service Worker: Eliminando caché antigua:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activación completada');
                return self.clients.claim();
            })
            .then(() => {
                // Notificar a la página principal que el caché se actualizó
                return self.clients.matchAll();
            })
            .then((clients) => {
                clients.forEach((client) => {
                    client.postMessage({
                        type: 'CACHE_UPDATED',
                        message: 'Service Worker activado y caché actualizada'
                    });
                });
            })
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    
    console.log('Service Worker: Interceptando petición a:', url.pathname);

    if (request.method !== 'GET') {
        return;
    }

    if (isStaticAsset(url.pathname)) {
        event.respondWith(cacheFirstStrategy(request));
    }
    else if (isDynamicAsset(url.pathname)) {
        event.respondWith(networkFirstStrategy(request));
    }
    else {
        event.respondWith(networkFirstStrategy(request));
    }
});


function cacheFirstStrategy(request) {
    return caches.match(request)
        .then((cachedResponse) => {
            if (cachedResponse) {
                console.log('Sirviendo desde caché:', request.url);
                return cachedResponse;
            }

            console.log('No está en caché, obteniendo de red:', request.url);
            return fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        if (request.url.startsWith('http')) {
                            const responseClone = networkResponse.clone();
                            caches.open(STATIC_CACHE_NAME)
                               .then((cache) => {
                                   cache.put(request, responseClone);
                                   console.log('Agregado a caché:', request.url);
                                });
                        }
                    }
                    return networkResponse;
                })
                .catch((error) => {
                    console.error('error de red para:', request.url, error);
                });
        });
}

function networkFirstStrategy(request) {
    return fetch(request)
        .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
                if (request.url.startsWith('http')) { 
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(request, responseClone);
                            console.log('Actualizado en caché:', request.url);
                        });
                }
            }
            
            console.log('Sirviendo desde red:', request.url);
            return networkResponse;
        })
        .catch((error) => {
            console.log('Red no disponible, buscando en caché:', request.url);
            
            return caches.match(request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        console.log('Sirviendo desde caché (offline):', request.url);
                        return cachedResponse;
                    }
                    
                    console.error('No encontrado en caché ni red:', request.url);
                    throw error;
                });
        });
}

function isStaticAsset(pathname) {
    const staticExtensions = ['.html', '.css', '.js'];
    return staticExtensions.some(ext => pathname.endsWith(ext)) || pathname === '/';
}

function isDynamicAsset(pathname) {
    const dynamicPaths = ['/src/img/'];
    return dynamicPaths.some(path => pathname.includes(path));
}

// MANEJO DE MENSAJES
self.addEventListener('message', (event) => {
    console.log('Service Worker recibió mensaje:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('⏭Saltando espera...');
        self.skipWaiting();
    }
});

console.log('SService Worker: Script cargado');
console.log('Archivos en caché estática:', STATIC_ASSETS);
console.log('Nombre de caché principal:', CACHE_NAME);