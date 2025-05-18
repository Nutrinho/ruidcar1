import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to input and output files
const mapDataPath = path.join(__dirname, 'attached_assets', 'map_data.js');
const locationsFullPath = path.join(__dirname, 'attached_assets', 'locations_full.js');

try {
  // Read map_data.js content
  console.log('Reading map_data.js...');
  const mapDataContent = fs.readFileSync(mapDataPath, 'utf8');
  
  // Create a temporary JavaScript file that exports the locationsData array
  const tempFilePath = path.join(__dirname, 'temp-locations-data.js');
  fs.writeFileSync(
    tempFilePath, 
    mapDataContent + '\nexport default locationsData;'
  );
  
  // Import the data using dynamic import
  console.log('Importing data...');
  import(tempFilePath)
    .then(module => {
      const locationsData = module.default;
      console.log(`Read ${locationsData.length} locations from map_data.js`);
      
      // Transform the data to match locations_full.js format
      const transformedLocations = locationsData.map(location => ({
        nome: location.name,
        lat: location.latitude,
        lng: location.longitude,
        endereco: location.address || '',
        telefone: location.phone || ''
      }));
      
      // Create the output content
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
      
      // Delete the temporary file
      fs.unlinkSync(tempFilePath);
      console.log('Temporary file deleted.');
    })
    .catch(error => {
      console.error('Error importing data:', error);
      // Delete the temporary file if it exists
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
        console.log('Temporary file deleted.');
      }
    });
} catch (error) {
  console.error('Error:', error);
}
