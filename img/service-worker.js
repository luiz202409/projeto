const CACHE_NAME = 'carla-modas-v1'; // Versão do Cache
const urlsToCache = [
    '/',
    '/index.html',
    '/home.html',
    '/carrinho.html', // Novo arquivo HTML adicionado ao cache
    '/style.css',
    '/script-carrinho.js', // Seu arquivo JavaScript
    '/manifest.json',
    
    // -------------------------------------
    // Imagens (ATUALIZADAS PARA PNG)
    // -------------------------------------
    '/img/entrada-carla-modas.png',
    '/img/produto-vestido-floral.png', 
    '/img/produto-calca-jeans.png',    
    '/img/produto-blusa-seda.png',     
    '/img/icon-192x192.png',
    '/img/icon-512x512.png'
];

// Instalação: Armazena o conteúdo estático no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto: Conteúdo estático armazenado.');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
          console.error('Falha ao armazenar cache durante a instalação:', err);
      })
  );
  // Força o Service Worker a ativar-se imediatamente após a instalação
  self.skipWaiting();
});

// Busca: Estratégia Cache-First (Tenta buscar primeiro no cache, depois na rede)
self.addEventListener('fetch', event => {
  // Evita intercepção de requisições que não sejam GET (como POST/PUT)
  if (event.request.method !== 'GET') return;
    
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna a resposta do cache, se encontrada
        if (response) {
          return response;
        }
        // Se não está no cache, busca na rede
        return fetch(event.request);
      })
  );
});

// Ativação: Limpa caches antigos (Importante para atualizar a aplicação)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Exclui qualquer cache que não esteja na lista branca (CACHE_NAME atual)
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Excluindo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Assume o controle imediatamente
  return self.clients.claim();
});