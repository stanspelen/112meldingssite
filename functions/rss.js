export async function onRequest(context) {
  const url = new URL(context.request.url);
  const target = url.searchParams.get("url");

  if (!target) {
    return new Response("Missing url parameter", { status: 400 });
  }

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept":
      "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "nl-BE,nl;q=0.9,en;q=0.8",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
  };

  try {
    const response = await fetch(target, {
      method: "GET",
      headers,
      redirect: "follow",
    });

    if (!response.ok) {
      return new Response("Upstream error: " + response.status, {
        status: response.status,
      });
    }

    const xml = await response.text();

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response("Fetch failed: " + err.message, { status: 500 });
  }
}
