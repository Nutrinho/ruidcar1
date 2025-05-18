// Script para extrair a lista de oficinas do txt
import fs from 'fs';

// Ler o arquivo txt com os dados
const fileContent = fs.readFileSync('./attached_assets/Pasted-const-locationsData-name-1M-MOTORS-latitude-15-8233572-longitude-47-1746215851819.txt', 'utf8');

// Extrair todas as oficinas do formato:
// {
//   name: "NOME",
//   latitude: 123,
//   longitude: 456,
//   address: "ENDERECO",
//   phone: "TELEFONE",
//   specialties: []
// },
const workshops = [];
const regex = /\{\s*name:\s*"([^"]*)",\s*latitude:\s*([\d\.\-]+),\s*longitude:\s*([\d\.\-]+),\s*address:\s*"([^"]*)",\s*phone:\s*"([^"]*)",\s*specialties:\s*\[\]\s*\}/g;

let match;
while ((match = regex.exec(fileContent)) !== null) {
  workshops.push({
    nome: match[1],
    lat: parseFloat(match[2]),
    lng: parseFloat(match[3]),
    endereco: match[4],
    telefone: match[5]
  });
}

console.log(`Encontradas ${workshops.length} oficinas no arquivo de texto.`);

// Criar o conteúdo no formato locations_full.js
let content = 'const locations = [\n';
for (let i = 0; i < workshops.length; i++) {
  const item = workshops[i];
  content += `  {\n    nome: '${item.nome.replace(/'/g, "\\'")}'`;
  content += `,\n    lat: ${item.lat}`;
  content += `,\n    lng: ${item.lng}`;
  content += `,\n    endereco: '${item.endereco.replace(/'/g, "\\'")}'`;
  content += `,\n    telefone: '${item.telefone.replace(/'/g, "\\'")}'\n  }`;
  if (i < workshops.length - 1) {
    content += ',\n';
  } else {
    content += '\n';
  }
}
content += '];\n\nmodule.exports = { locations };';

// Salvar no arquivo locations_full.js
fs.writeFileSync('./attached_assets/locations_full.js', content);

console.log('Arquivo locations_full.js atualizado com sucesso.');