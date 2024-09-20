export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) 
    return new Response(JSON.stringify({ error: 'A URL is required' }), { status: 400 });

  try {
    const response = await fetch(url, { headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15' }});
    const data = await response.text();
    return new Response(data, { status: 200, headers: { 'Content-Type': 'text/html' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to load the website' }), { status: 500 });
  }
}
