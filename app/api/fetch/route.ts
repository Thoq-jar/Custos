export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) 
    return new Response(JSON.stringify({ error: 'A URL is required' }), { status: 400 });

  try {
    const response = await fetch(url, { headers: {'User-Agent': 'Mozilla/5.0 (Custos Browser; 0.1.0 Custos; Web) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36' }});
    const data = await response.text();
    return new Response(data, { status: 200, headers: { 'Content-Type': 'text/html' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to load the website' }), { status: 500 });
  }
}
