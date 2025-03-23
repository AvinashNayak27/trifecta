addEventListener(
    'fetch',
    event => { 
        event.respondWith(handle(event.request));
    });

async function handle(request) {
    try {
        const accessToken = request.headers.get('Authorization').replace('Bearer ', '');
        const response = await fetch('https://api.producthunt.com/v2/api/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                query: `{
                    viewer {
                        user {
                            username
                        }
                    }
                }`
            })
        });

        const data = await response.json();
        return new Response(JSON.stringify(data.data.viewer), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.log(err); 
        return new Response('Error fetching profile');
    }
}