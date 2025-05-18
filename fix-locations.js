import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to locations_full.js file
const locationsFullPath = path.join(__dirname, 'attached_assets', 'locations_full.js');

try {
  // Read the current content
  console.log('Reading locations_full.js...');
  const content = fs.readFileSync(locationsFullPath, 'utf8');
  
  // Find and fix the problematic line specifically
  const fixedContent = content.replace(/(Olho D)'(agua)/g, "$1\\'$2");
  console.log('Fixed D\'agua apostrophe in the text.');
  
  // Write the fixed content back to the file
  fs.writeFileSync(locationsFullPath, fixedContent);
  console.log('Fixed apostrophes in locations_full.js');
  
  // Validate the file by trying to parse it
  const testContent = `const testObj = ${fixedContent.replace(/^const locations =/, '')}`;
  try {
    eval(testContent);
    console.log('Successfully validated the file syntax.');
  } catch (evalError) {
    console.error('Error validating the file:', evalError);
  }
  
} catch (error) {
  console.error('Error:', error);
}
