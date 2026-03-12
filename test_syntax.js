const fs = require('fs');
const content = fs.readFileSync('frontend/app/src/components/ChatBox.jsx', 'utf-8');
const babel = require('@babel/core');
try {
  babel.parse(content, { presets: ['@babel/preset-react'] });
  console.log('SUCCESS');
} catch (e) {
  console.log(e);
}
