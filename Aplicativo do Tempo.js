// Importa o módulo 'readline' para lidar com a entrada do usuário no console do Node.js.
const readline = require('readline');

// Configuração para a entrada e saída do console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// --- Configurações das APIs ---
const GEOCODING_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_BASE_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Funções auxiliar para lidar com requisições HTTP de forma segura e padronizada.
 * @param {string} url - A URL completa para a requisição.
 * @returns {Promise<Object>} Os dados JSON da resposta.
 */
async function fazerRequisicao(url) {
    try {
        const response = await fetch(url);
        
        // Boa prática de segurança: verificar o status HTTP
        if (!response.ok) {
            // Lança um erro se o status não for 2xx
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        // Captura erros de rede ou de requisição
        console.error(`\n🚨 Erro de Rede ou Requisição: ${error.message}`);
        throw error; // Propaga o erro para ser tratado pela função chamadora
    }
}

/**
 * Traduz o nome da cidade para Coordenadas (Latitude e Longitude).
 * Segurança: Usa URLSearchParams para evitar problemas de codificação e injeção.
 * @param {string} cidade - O nome da cidade.
 * @returns {Promise<{latitude: number, longitude: number} | {error: string}>} Coordenadas ou erro.
 */
async function obterCoordenadas(cidade) {
    const params = new URLSearchParams({
        name: cidade,
        count: 1,
        language: "pt",
        format: "json"
    });
    const url = `${GEOCODING_BASE_URL}?${params.toString()}`;

    try {
        const data = await fazerRequisicao(url);
        
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            return {
                latitude: result.latitude,
                longitude: result.longitude
            };
        } else {
            return { error: `❌ Cidade '${cidade}' não encontrada. Verifique a ortografia.` };
        }
    } catch (e) {
        // Trata o erro de forma mais amigável
        return { error: `❌ Falha na geocodificação da cidade: ${e.message}` };
    }
}

/**
 * Busca a temperatura e o vento na API Open-Meteo usando as coordenadas.
 * @param {number} latitude - A latitude da cidade.
 * @param {number} longitude - A longitude da cidade.
 * @returns {Promise<Object | {error: string}>} Dados do clima ou erro.
 */
async function obterClima(latitude, longitude) {
    const params = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        current_weather: "true", // Solicita apenas dados atuais
        temperature_unit: "celsius",
        windspeed_unit: "kmh"
    });
    const url = `${WEATHER_BASE_URL}?${params.toString()}`;
    
    try {
        const data = await fazerRequisicao(url);

        if (data.current_weather && data.current_units) {
             // Retorna apenas os dados necessários
            return {
                temperatura: data.current_weather.temperature,
                unidadeTemp: data.current_units.temperature,
                vento: data.current_weather.windspeed,
                unidadeVento: data.current_units.windspeed
            };
        } else {
            return { error: "❌ Dados de clima incompletos no retorno da API." };
        }
    } catch (e) {
        return { error: `❌ Falha ao buscar dados do clima: ${e.message}` };
    }
}

/**
 * Função principal que orquestra a busca de clima.
 * @param {string} nomeDaCidade - O nome da cidade.
 */
async function buscarClima(nomeDaCidade) {
    if (!nomeDaCidade || nomeDaCidade.trim() === "") {
        console.log("🛑 O nome da cidade não pode ser vazio.");
        return;
    }
    
    console.log(`\n🔍 Buscando clima para: ${nomeDaCidade}...`);

    // 1. Obter Coordenadas
    const coordenadas = await obterCoordenadas(nomeDaCidade);
    if (coordenadas.error) {
        console.log(coordenadas.error);
        return;
    }

    // 2. Obter Clima
    const dadosClima = await obterClima(coordenadas.latitude, coordenadas.longitude);
    if (dadosClima.error) {
        console.log(dadosClima.error);
        return;
    }
    
    // 3. Imprimir Resultado Final
    console.log("-----------------------------------------");
    console.log(`✅ Clima atual em ${nomeDaCidade}:`);
    console.log(`   🌡️ Temperatura: ${dadosClima.temperatura} ${dadosClima.unidadeTemp}`);
    console.log(`   💨 Vento: ${dadosClima.vento} ${dadosClima.unidadeVento}`);
    console.log("-----------------------------------------");
}

// --- Ponto de Entrada: Lidar com a entrada do usuário ---
function executarAplicativo() {
    rl.question("👉 Digite o nome da cidade: ", async (cidadeInput) => {
        // Usar trim() para remover espaços em branco, boa prática de validação de entrada
        const cidadeLimpa = cidadeInput.trim(); 
        
        await buscarClima(cidadeLimpa);
        
        rl.close(); // Fecha a interface de leitura após a execução
    });
}

executarAplicativo();