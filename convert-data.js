// Script para converter o formato dos dados
import fs from 'fs';

// Carregar os dados do map_data_final.js
const fileContent = fs.readFileSync('./attached_assets/map_data_final.js', 'utf8');
const match = fileContent.match(/const locationsData = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('Erro ao extrair dados do arquivo map_data_final.js');
  process.exit(1);
}

// Avaliar o conteúdo do array como JavaScript
let workshops;
try {
  eval('workshops = ' + match[1]);
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
let content = 'const locations = [\
';
for (let i = 0; i < output.length; i++) {
  const item = output[i];
  content += `  {\
    nome: '${item.nome.replace(/'/g, "\\'")}'`;
  content += `,\
    lat: ${item.lat}`;
  content += `,\
    lng: ${item.lng}`;
  content += `,\
    endereco: '${item.endereco.replace(/'/g, "\\'")}'`;
  content += `,\
    telefone: '${item.telefone.replace(/'/g, "\\'")}'\
  }`;
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
