const http = require('http');

http.get('http://localhost:3000', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    
    // Check if the WelcomeScreen is rendered (SSR should have showWelcome = false by default, or maybe true?)
    const hasWelcome = data.includes('Welcome to my');
    console.log('Includes Welcome Screen text:', hasWelcome);
    
    // Check if the Portfolio Showcase is rendered
    const hasShowcase = data.includes('Portfolio Showcase');
    console.log('Includes "Portfolio Showcase" text:', hasShowcase);
    
    // Check if mock projects are rendered
    const hasAether = data.includes('Aether AI - Generative Art Platform');
    console.log('Includes "Aether AI" project title:', hasAether);
    
    const hasNova = data.includes('Nova Analytics - Enterprise SaaS Dashboard');
    console.log('Includes "Nova Analytics" project title:', hasNova);
    
    const hasVortex = data.includes('Vortex - Crypto Trading Terminal');
    console.log('Includes "Vortex" project title:', hasVortex);

    // Let's print out the sections of HTML to see if there's any rendering or script tags
    if (data.includes('id="portfolio"')) {
      console.log('Portfolio section found!');
      const idx = data.indexOf('id="portfolio"');
      console.log('HTML around portfolio section:', data.substring(idx, idx + 800));
    } else {
      console.log('Portfolio section NOT found in HTML!');
    }
  });
}).on('error', (err) => {
  console.error('Fetch failed:', err.message);
});
