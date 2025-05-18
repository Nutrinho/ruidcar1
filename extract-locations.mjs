// Script para extrair todas as oficinas do arquivo de texto
import fs from 'fs';
import path from 'path';

// Ler o conteúdo do arquivo de texto
const filePath = './attached_assets/Pasted-const-locationsData-name-1M-MOTORS-latitude-15-8233572-longitude-47-1746215851819.txt';
const fileContent = fs.readFileSync(filePath, 'utf8');

// Definir uma expressão regular para extrair os objetos de workshop
// Esta regex captura cada objeto de oficina completo
const workshopRegex = /\{\s*name:\s*"([^"]*)",\s*latitude:\s*([\d\.\-]+),\s*longitude:\s*([\d\.\-]+),\s*address:\s*"([^"]*)",\s*phone:\s*"([^"]*)",\s*specialties:\s*\[\]\s*\}/g;

// Array para armazenar os workshops extraídos
const workshops = [];

// Extrair todos os workshops que correspondem ao padrão
let match;
while ((match = workshopRegex.exec(fileContent)) !== null) {
  const workshop = {
    nome: match[1],
    lat: parseFloat(match[2]),
    lng: parseFloat(match[3]),
    endereco: match[4],
    telefone: match[5]
  };
  workshops.push(workshop);
}

console.log(`Encontradas ${workshops.length} oficinas no arquivo.`);

// Converter workshops para o formato esperado pelo arquivo locations_full.js
// Este é um array JavaScript literal em CommonJS
const outputContent = `const locations = [
${workshops.map(w => {
  return `  {
    nome: '${w.nome.replace(/'/g, "\\'")}'` +
    `,
    lat: ${w.lat}` +
    `,
    lng: ${w.lng}` +
    `,
    endereco: '${w.endereco.replace(/'/g, "\\'")}'` +
    `,
    telefone: '${w.telefone.replace(/'/g, "\\'")}'` +
    `
  }`;
}).join(',\n')}
];

module.exports = { locations };
`;

// Salvar o conteúdo no arquivo locations_full.js
fs.writeFileSync('./attached_assets/locations_full.js', outputContent);

console.log(`Arquivo locations_full.js foi atualizado com ${workshops.length} oficinas.`);
