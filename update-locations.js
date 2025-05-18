import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to input and output files
const mapDataPath = path.join(__dirname, 'attached_assets', 'map_data.js');
const locationsFullPath = path.join(__dirname, 'attached_assets', 'locations_full.js');

// Read map_data.js
const mapDataContent = fs.readFileSync(mapDataPath, 'utf8');

// Extract location data manually
// First, remove the first line with the declaration
const contentWithoutDeclaration = mapDataContent.replace(/const locationsData =/, '');

// Now we need to convert the data manually without eval
// We'll create a simple parser to extract each location object
const locationDataArray = [];

// Regular expression to match each object in the array
const objectRegex = /\{\s*name:\s*"([^"]*)",\s*latitude:\s*([\-0-9\.]+),\s*longitude:\s*([\-0-9\.]+),\s*address:\s*([^,]*),\s*phone:\s*([^,]*),\s*specialties:\s*\[\],?\s*\}/g;

let match;
while ((match = objectRegex.exec(contentWithoutDeclaration)) !== null) {
  // Extract data from the matched groups
  const name = match[1];
  const latitude = parseFloat(match[2]);
  const longitude = parseFloat(match[3]);
  
  // Handle address (might be null or a string)
  let address = match[4].trim();
  if (address === 'null') {
    address = null;
  } else if (address.startsWith('"') && address.endsWith('"')) {
    // Remove quotes if they exist
    address = address.substring(1, address.length - 1);
  }
  
  // Handle phone (might be null or a string)
  let phone = match[5].trim();
  if (phone === 'null') {
    phone = null;
  } else if (phone.startsWith('"') && phone.endsWith('"')) {
    // Remove quotes if they exist
    phone = phone.substring(1, phone.length - 1);
  }
  
  locationDataArray.push({
    name,
    latitude,
    longitude,
    address,
    phone,
    specialties: []
  });
}

console.log(`Read ${locationDataArray.length} locations from map_data.js`);

// Transform the data to match locations_full.js format
const transformedLocations = locationDataArray.map(location => ({
  nome: location.name,
  lat: location.latitude,
  lng: location.longitude,
  endereco: location.address || '',
  telefone: location.phone || ''
}));

// Create the output string
const outputContent = 'const locations = ' + 
  JSON.stringify(transformedLocations, null, 2)
    .replace(/"nome":/g, 'nome:')
    .replace(/"lat":/g, 'lat:')
    .replace(/"lng":/g, 'lng:')
    .replace(/"endereco":/g, 'endereco:')
    .replace(/"telefone":/g, 'telefone:')
    .replace(/"/g, "'") + 
  ';\n';

// Write to locations_full.js
fs.writeFileSync(locationsFullPath, outputContent);

console.log(`Updated locations_full.js with ${transformedLocations.length} locations.`);
