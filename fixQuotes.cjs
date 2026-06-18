const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'Frontend', 'src');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = content;
            
            // Fix the broken quotes where fetch string starts with ` and ends with ' or "
            // The string we injected is: fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api
            const regex = /fetch\(`\$\{import\.meta\.env\.VITE_API_BASE_URL \|\| ""\}\/api([^'"`\n]*)['"]/g;
            updated = updated.replace(regex, 'fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api$1`');
            
            if (content !== updated) {
                fs.writeFileSync(fullPath, updated, 'utf8');
                console.log(`Fixed ${fullPath}`);
            }
        }
    }
}

processDir(srcDir);
