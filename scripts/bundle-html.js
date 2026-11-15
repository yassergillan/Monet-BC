import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const assetsDir = path.join(distDir, 'assets');

if (fs.existsSync(distDir) && fs.existsSync(assetsDir)) {
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    let html = fs.readFileSync(indexHtmlPath, 'utf8');

    const files = fs.readdirSync(assetsDir);
    const cssFiles = files.filter((f) => f.endsWith('.css'));
    const jsFiles = files.filter((f) => f.endsWith('.js'));

    for (const cssFile of cssFiles) {
      const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
      const linkRegex = new RegExp(`<link[^>]*href="[^"]*${cssFile}"[^>]*>`, 'g');
      html = html.replace(linkRegex, () => `<style>\n${cssContent}\n</style>`);
    }

    for (const jsFile of jsFiles) {
      const jsContent = fs
        .readFileSync(path.join(assetsDir, jsFile), 'utf8')
        .replace(/<\/script/gi, '<\\/script');
      const scriptRegex = new RegExp(`<script[^>]*src="[^"]*${jsFile}"[^>]*></script>`, 'g');
      html = html.replace(scriptRegex, () => `<script type="module">\n${jsContent}\n</script>`);
    }

    if (!fs.existsSync('public')) {
      fs.mkdirSync('public', { recursive: true });
    }
    fs.writeFileSync('public/monitoring-renovasi-kbp.html', html, 'utf8');
    fs.writeFileSync(path.join(distDir, 'monitoring-renovasi-kbp.html'), html, 'utf8');
    fs.writeFileSync('monitoring-renovasi-bc-kbp.html', html, 'utf8');
    console.log(
      'Successfully generated standalone single-file HTML: monitoring-renovasi-bc-kbp.html and public/monitoring-renovasi-kbp.html'
    );
  }
}

