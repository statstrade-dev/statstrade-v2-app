const pages = {
  '/privacy': {
    title: 'Privacy Policy',
    content: `<p>This policy explains how StatsTrade handles information for statstrade.com.au and its Instagram integration, operated through <a href="https://www.instagram.com/statstrade.com.au/">@statstrade.com.au</a>. Updated 8 November 2026.</p>
<h2>Information we receive</h2>
<p>When you message our Instagram account or comment on its posts, Meta may send us your account identifier, message or comment text, message and post identifiers, timestamps, and attachment types. We store the information needed to process that interaction and record replies. Our webhook does not store attachment download URLs.</p>
<p>Connecting the StatsTrade Instagram account gives our server an access token and the permissions approved in Meta. The access token is stored encrypted and is not available in the public website.</p>
<h2>How we use information</h2>
<p>We use this information to receive and respond to messages and comments, operate commands you request, prevent duplicate replies and abuse, troubleshoot delivery, and protect the service. For example, /ping returns a connection check and /echo sends your supplied text back to the same Instagram conversation. Do not send passwords or other sensitive information in commands.</p>
<h2>Service providers and sharing</h2>
<p>Meta provides Instagram and delivers messages and comments to us. Cloudflare hosts the integration and Supabase provides database storage. These providers process information to deliver their services and may process it outside Australia. Replies are sent through Meta. We do not sell Instagram interaction data.</p>
<h2>Storage and security</h2>
<p>Interaction records and delivery records are stored for operation, support, and abuse prevention. They are not automatically removed when you delete a message in Instagram. Access to integration records is restricted to server operations and authorised administration. No system can guarantee absolute security.</p>
<h2>Your choices and deletion</h2>
<p>You can stop sending commands at any time. Account administrators can revoke the integration in Meta's settings. To ask about your information or request deletion of your integration records, follow our <a href="/data-deletion">data deletion instructions</a>. Removing our copy does not remove messages or comments held by Instagram or other participants.</p>
<h2>Contact and changes</h2>
<p>Contact StatsTrade by messaging <a href="https://www.instagram.com/statstrade.com.au/">@statstrade.com.au</a>. We may update this policy as the service changes; the current version and update date will appear here.</p>`
  },
  '/data-deletion': {
    title: 'Data Deletion Instructions',
    content: `<p>You can request deletion of data held by the StatsTrade Instagram integration for statstrade.com.au.</p>
<ol><li>Open Instagram and message <a href="https://www.instagram.com/statstrade.com.au/">@statstrade.com.au</a> from the account whose records you want removed.</li><li>Start your message with <strong>Data deletion request</strong> and say that you want your StatsTrade Instagram integration records deleted.</li><li>We may ask you to confirm ownership of that account before handling the request. Do not send your password, login code, or identification documents.</li></ol>
<p>This is a request for manual review, not an automatic deletion command. It covers interaction records and reply records that we can associate with your Instagram account. Limited records may need to be retained for security, dispute handling, or legal obligations.</p>
<p>Deletion from StatsTrade does not delete the original Instagram conversation or public comments. Manage those separately in Instagram. Administrators who connected the StatsTrade account can also remove the integration through Meta's settings to revoke its access.</p>
<p>For more information, read our <a href="/privacy">Privacy Policy</a>.</p>`
  }
}

export function instagramPublicPage(request) {
  const url = new URL(request.url)
  const page = pages[url.pathname.replace(/\/$/, '')]
  if (!page) return null
  if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } })
  const html = `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${page.title} | StatsTrade Australia</title><link rel="canonical" href="https://statstrade.com.au${url.pathname.replace(/\/$/, '')}"><style>body{margin:0;background:#faf9f6;color:#152128;font:17px/1.65 system-ui,sans-serif}main{max-width:760px;margin:0 auto;padding:48px 24px 72px}header{font-weight:750;letter-spacing:.05em;text-transform:uppercase;font-size:14px;border-bottom:2px solid #152128;padding-bottom:18px}h1{font-size:42px;line-height:1.15;margin:36px 0 24px}h2{font-size:23px;line-height:1.3;margin-top:32px}a{color:#075b66;text-underline-offset:3px}li{margin-bottom:12px}footer{border-top:1px solid #bbc3c3;margin-top:40px;padding-top:20px;font-size:14px}footer a{margin-right:18px}</style></head><body><main><header>StatsTrade Australia · statstrade.com.au</header><h1>${page.title}</h1>${page.content}<footer><a href="/privacy">Privacy</a><a href="/data-deletion">Data deletion</a><a href="https://www.instagram.com/statstrade.com.au/">Instagram</a></footer></main></body></html>`
  return new Response(request.method === 'HEAD' ? null : html, { headers: {
    'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
    'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin'
  } })
}
