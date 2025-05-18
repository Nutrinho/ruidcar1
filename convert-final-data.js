// Script para converter os dados do arquivo enviado pelo usuário
import fs from 'fs';

// Fonte: arquivo de texto enviado pelo usuário
const fileContent = fs.readFileSync('./attached_assets/Pasted-const-locationsData-name-1M-MOTORS-latitude-15-8233572-longitude-47-1746215851819.txt', 'utf8');
const match = fileContent.match(/const locationsData = (\[[\s\S]*?(?:\}\s*\]|\}\s*,\s*\{[\s\S]*\}\s*\]))/s);

if (!match) {
  console.error('Erro ao extrair dados do arquivo enviado');
  process.exit(1);
}

// Avaliar o conteúdo do array como JavaScript
let workshops;
try {
  // Extrair e processar - removendo aspectos no final que possam estar incompletos
  const dataString = match[1];
  // Garantir que a última oficina esteja completa
  const lastValidObject = dataString.lastIndexOf('specialties: []\n  }');
  const validDataString = dataString.substring(0, lastValidObject + 17) + '\n]';
  
  // Uso de eval limitado para converter o texto em objeto JavaScript
  eval('workshops = ' + validDataString);
} catch (error) {
  console.error('Erro ao avaliar o conteúdo do array:', error);
  process.exit(1);
}

const output = [];

// Converter para o formato esperado pelo locations_full.js
for (const workshop of workshops) {
  output.push({
    nome: workshop.name,
    lat: workshop.latitude,
    lng: workshop.longitude,
    endereco: workshop.address || '',
    telefone: workshop.phone || ''
  });
}

// Criar o conteúdo formatado
let content = 'const locations = [\n';
for (let i = 0; i < output.length; i++) {
  const item = output[i];
  content += `  {\n    nome: '${item.nome.replace(/'/g, "\\'")}'`;
  content += `,\n    lat: ${item.lat}`;
  content += `,\n    lng: ${item.lng}`;
  content += `,\n    endereco: '${item.endereco.replace(/'/g, "\\'")}'`;
  content += `,\n    telefone: '${item.telefone.replace(/'/g, "\\'")}'\n  }`;
  if (i < output.length - 1) {
    content += ',\n';
  } else {
    content += '\n';
  }
}
content += '];\n\nmodule.exports = { locations };';

// Salvar no arquivo locations_full.js
fs.writeFileSync('./attached_assets/locations_full.js', content);

console.log('Arquivo locations_full.js atualizado com sucesso no formato esperado.');
console.log(`Total de oficinas convertidas: ${output.length}`);
