const filterEndpoints = ['/api/announcement'];

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
    console.log('Service Worker: Claiming clients for immediate control.');
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if (!filterEndpoints.some(endpoint => url.pathname.startsWith(endpoint))) {
        return;
    }
    event.respondWith(
        (async () => {
            try {
                // Step 1: Fetch the original response from the network
                const originalResponse = await fetch(event.request);

                const originalData = await originalResponse.text();
                const newResponseHeaders = new Headers(originalResponse.headers);
                newResponseHeaders.set('Content-Type', 'text/plain');

                return new Response(originalData, {
                    status: originalResponse.status,
                    statusText: originalResponse.statusText,
                    headers: newResponseHeaders
                });

            } catch (error) {
                console.log(error);
                return new Response('Unexpected error occur', {
                    status: 500,
                    headers: { 'Content-Type': 'text/plain' }
                });
            }
        })()
    );
});

console.log('service worker is here!');