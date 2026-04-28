export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing code');
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const { access_token, error } = await tokenRes.json();

    if (error || !access_token) {
      return respond(res, 'error', { error: error || 'No token received' });
    }

    respond(res, 'success', { token: access_token, provider: 'github' });
  } catch (err) {
    respond(res, 'error', { error: err.message });
  }
}

function respond(res, status, content) {
  const msg = `authorization:github:${status}:${JSON.stringify(content)}`;
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html><html><body><script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage(${JSON.stringify(msg)}, e.origin);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script></body></html>`);
}
