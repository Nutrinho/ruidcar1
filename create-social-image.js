import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter o diretório atual em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminhos dos arquivos
const logoPath = path.join(__dirname, 'attached_assets/logo.png');
const outputPath = path.join(__dirname, 'public/assets/social-share.png');

// Dimensões recomendadas para compartilhamento em redes sociais
const width = 1200;
const height = 630;

// Cores
const backgroundColor = '#FFFFFF'; // Fundo branco
const brandColor = '#FF6600';      // Laranja da RUIDCAR

// Criar uma imagem para compartilhamento em redes sociais
async function createSocialImage() {
  try {
    // Verificar se a pasta existe
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }

    // Criar um retângulo com o tamanho e cor base
    const baseImage = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: backgroundColor
      }
    }).png().toBuffer();

    // Carregar a logo
    const logoBuffer = fs.readFileSync(logoPath);

    // Redimensionar a logo para caber adequadamente na imagem
    const resizedLogo = await sharp(logoBuffer)
      .resize(width - 200, height - 200, { fit: 'inside' })
      .toBuffer();

    // Obter as dimensões da logo redimensionada
    const logoMetadata = await sharp(resizedLogo).metadata();

    // Calcular posição para centralizar a logo
    const topPosition = Math.max(0, Math.floor((height - logoMetadata.height) / 2));
    const leftPosition = Math.max(0, Math.floor((width - logoMetadata.width) / 2));

    // Sobrepor a logo na imagem base
    await sharp(baseImage)
      .composite([{
        input: resizedLogo,
        top: topPosition,
        left: leftPosition
      }])
      .toFile(outputPath);

    console.log(`Imagem social criada com sucesso: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Erro ao criar imagem social:', error);
    throw error;
  }
}

// Executar a função
createSocialImage().catch(console.error);
