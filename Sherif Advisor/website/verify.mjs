const v2 = await fetch('http://localhost:3000/v2');
const html = await v2.text();
const cssLinks = [...html.matchAll(/href="([^"]*\.css[^"]*)"/g)].length;
console.log('/v2 ->', v2.status, 'css links:', cssLinks);

const svc = await fetch('http://localhost:3000/services/cmtmxh5oq00007kvcdqqj4u0t');
console.log('/services/[id] ->', svc.status);

const home = await fetch('http://localhost:3000/');
console.log('/ ->', home.status);
