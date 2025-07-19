// =================================================================================
// GERADOR DE SPRITES E ESQUELETO
// Este script lê uma folha de sprites e gera imagens individuais para cada parte
// do corpo, além de um arquivo JSON descrevendo a estrutura do esqueleto.
// =================================================================================

// Importando as ferramentas necessárias do Node.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// --- CONFIGURAÇÃO ---
const sourceImage = 'female_pose_guides.png'; // O nome da sua imagem principal
const outputFolder = 'sprites'; // O nome da pasta onde os arquivos serão salvos

// --- MAPEAMENTO DO PERSONAGEM (OS DADOS DA NOSSA CONVERSA) ---
// Contém o nome de cada "osso", sua relação (pai/filho), o local para recortar
// na imagem e o ponto de pivô para animação.
const characterData = [
    { name: "hips",      parent: null,    sprite_rect: { x: 130, y: 550, width: 80, height: 60 },  anchor: [0.5, 0.5] },
    { name: "chest",     parent: "hips",  sprite_rect: { x: 120, y: 380, width: 100, height: 170 }, anchor: [0.5, 0.9] },
    { name: "head",      parent: "chest", sprite_rect: { x: 105, y: 86,  width: 130, height: 190 }, anchor: [0.5, 0.9] },
    { name: "left_arm",  parent: "chest", sprite_rect: { x: 200, y: 380, width: 50,  height: 150 }, anchor: [0.5, 0.1] },
    { name: "right_arm", parent: "chest", sprite_rect: { x: 90,  y: 380, width: 50,  height: 150 }, anchor: [0.5, 0.1] },
    { name: "left_leg",  parent: "hips",  sprite_rect: { x: 155, y: 600, width: 70,  height: 350 }, anchor: [0.5, 0.1] },
    { name: "right_leg", parent: "hips",  sprite_rect: { x: 115, y: 600, width: 70,  height: 350 }, anchor: [0.5, 0.1] }
];

// --- FUNÇÃO PRINCIPAL DO SCRIPT ---
async function generateAssets() {
    console.log('Iniciando o gerador de sprites e esqueleto...');

    // 1. Verifica se a imagem principal existe
    if (!fs.existsSync(sourceImage)) {
        console.error(`❌ ERRO: Imagem fonte '${sourceImage}' não encontrada. Certifique-se de que ela está na mesma pasta que este script.`);
        return;
    }

    // 2. Cria a pasta de saída se ela não existir
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder);
        console.log(`Pasta '${outputFolder}' criada.`);
    }

    // 3. Processa cada parte do corpo para criar os sprites
    console.log('\nRecortando sprites...');
    for (const bone of characterData) {
        const rect = bone.sprite_rect;
        const outputFilePath = path.join(outputFolder, `${bone.name}.png`);

        try {
            await sharp(sourceImage)
                .extract({ left: rect.x, top: rect.y, width: rect.width, height: rect.height })
                .toFile(outputFilePath);
            console.log(`✅ Sprite '${bone.name}.png' criado com sucesso.`);
        } catch (error) {
            console.error(`❌ ERRO ao criar o sprite '${bone.name}.png':`, error);
        }
    }

    // 4. Cria o arquivo JSON do esqueleto
    console.log('\nGerando arquivo de esqueleto (osso)...');
    const skeletonJson = characterData.map(bone => ({
        name: bone.name,
        parent: bone.parent,
        anchor: bone.anchor
    }));

    const skeletonFilePath = path.join(outputFolder, 'skeleton.json');
    try {
        // JSON.stringify com 'null, 2' formata o arquivo para ser fácil de ler
        fs.writeFileSync(skeletonFilePath, JSON.stringify(skeletonJson, null, 2));
        console.log(`✅ Arquivo 'skeleton.json' criado com sucesso.`);
    } catch (error) {
        console.error(`❌ ERRO ao criar 'skeleton.json':`, error);
    }
    
    console.log('\n----------------------------------------------------');
    console.log('🎉 Processo finalizado!');
    console.log(`Verifique a pasta '${outputFolder}' para ver os arquivos gerados.`);
    console.log('----------------------------------------------------');
}

// Inicia a execução da função principal
generateAssets();