const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'Frontend', 'src');
const baseUrlStr = '`${import.meta.env.VITE_API_BASE_URL || ""}`';

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = content;
            
            // replace fetch('/api with fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api
            updated = updated.replace(/fetch\(['"]\/api/g, "fetch(`${import.meta.env.VITE_API_BASE_URL || \"\"}/api");
            
            // replace fetch(`/api with fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api
            updated = updated.replace(/fetch\(`\/api/g, "fetch(`${import.meta.env.VITE_API_BASE_URL || \"\"}/api");
            
            // replace socket connection in DataContext.jsx
            if (fullPath.includes('DataContext.jsx')) {
                updated = updated.replace(
                    /const socketUrl = import\.meta\.env\.DEV \? "http:\/\/localhost:5000" : window\.location\.origin;/,
                    'const socketUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5000" : window.location.origin);'
                );
            }
            
            // replace API_BASE_URL in Profile.jsx
            if (fullPath.includes('Profile.jsx')) {
                updated = updated.replace(
                    /const API_BASE_URL = 'http:\/\/localhost:5000';/,
                    'const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";'
                );
            }

            if (content !== updated) {
                fs.writeFileSync(fullPath, updated, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDir(srcDir);
