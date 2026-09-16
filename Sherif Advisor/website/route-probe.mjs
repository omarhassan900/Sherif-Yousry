.
const id = 'cmtmxh5oq00007kvcdqqj4u0t';

// 1. Does the API return the service?
const api = await fetch(`http://localhost:3001/api/content/services/${id}?lang=en`);
console.log('API /api/content/services/[id] status:', api.status);
if (api.ok) {
  const d = await api.json();
  console.log('  title:', d.title);
}

// 2. Does the page route resolve (not the built-in 404)?
const page = await fetch(`http://localhost:3001/services/${id}`);
const html = await page.text();
console.log('PAGE /services/[id] status:', page.status);
console.log('  is Next 404 page?', html.includes('This page could not be found'));
console.log('  has <title>:', (html.match(/<title>([^<]*)<\/title>/) || [])[1]);
console.log('  contains loading spinner (animate-spin)?', html.includes('animate-spin'));
console.log('  contains "Service Not Found"?', html.includes('Service Not Found') || html.includes('الخدمة غير موجودة'));
console.log('  HTML length:', html.length);
