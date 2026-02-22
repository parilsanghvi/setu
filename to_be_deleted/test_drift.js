const { computeDrift } = require('./lib/onboarding/drift');
console.log(JSON.stringify(computeDrift(), null, 2));
