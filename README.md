# Projeto-Aplicativo-do-Tempo

Sobre o Projeto
Este é um projeto de linha de comando (CLI) simples, desenvolvido em JavaScript (Node.js), que permite aos usuários obter a temperatura e a velocidade do vento atuais para qualquer cidade do mundo.

O aplicativo demonstra o uso de requisições HTTP assíncronas e implementa uma arquitetura robusta de duas etapas para interagir com a API Open-Meteo:

Geocodificação: Converte o nome da cidade fornecido pelo usuário em coordenadas de Latitude e Longitude (usando a API de Geocodificação da Open-Meteo).

Busca de Clima: Usa as coordenadas para buscar os dados de clima.

O projeto segue as melhores práticas, incluindo tratamento de erros detalhado, validação de entrada e código modular.

🚀 Como Navegar e Executar o Código
Pré-requisitos
Para executar este projeto, você precisa ter o Node.js instalado em sua máquina.

Node.js: Versão 18 ou superior (necessária para usar a função fetch nativa).

Estrutura do Projeto
O código-fonte principal está contido em um único arquivo:

/weather-app
├── climaApp.js   # O script principal do aplicativo de clima
└── README.md     # Este arquivo
1. Clonar o Repositório (ou Baixar o Arquivo)
Se estiver usando Git, clone o repositório:

Bash

git clone https://www.dio.me/articles/enviando-seu-projeto-para-o-github
cd weather-app
(Se você tiver apenas o arquivo climaApp.js, certifique-se de estar no diretório onde ele está salvo.)

2. Executar o Aplicativo
Para iniciar o aplicativo de clima, use o comando node no terminal, apontando para o arquivo principal:

Bash

node climaApp.js
3. Usar o Aplicativo
O aplicativo solicitará a entrada:

👉 Digite o nome da cidade:
Exemplo de Uso Bem-Sucedido:

Bash

$ node climaApp.js
👉 Digite o nome da cidade: São Paulo

🔍 Buscando clima para: São Paulo...
-----------------------------------------
✅ Clima atual em São Paulo:
   🌡️ Temperatura: 25.5 °C
   💨 Vento: 8.4 km/h
-----------------------------------------
Exemplo de Tratamento de Erro:

O aplicativo lida com nomes de cidades que não podem ser geocodificados:

Bash

$ node climaApp.js
👉 Digite o nome da cidade: CidadeQueNaoExiste

🔍 Buscando clima para: CidadeQueNaoExiste...
❌ Cidade 'CidadeQueNaoExiste' não encontrada. Verifique a ortografia.
