const fs = require('fs');
const path = 'lib/auth/google.js';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `                if (res.ok) {
                    const data = await res.json();
                    if (data.cloudaicompanionProject) {
                        if (typeof data.cloudaicompanionProject === 'string') {
                            return data.cloudaicompanionProject;
                        }
                        if (data.cloudaicompanionProject.id) {
                            return data.cloudaicompanionProject.id;
                        }
                    }
                }`;

const replacementStr = `                if (!res.ok) continue;

                const data = await res.json();
                const project = data.cloudaicompanionProject;

                if (!project) continue;

                if (typeof project === 'string') {
                    return project;
                }

                if (project.id) {
                    return project.id;
                }`;

if (content.includes(targetStr)) {
    fs.writeFileSync(path, content.replace(targetStr, replacementStr));
    console.log('Successfully replaced the string.');
} else {
    console.error('Target string not found.');
}
