# Parkia - Frontend

Bem-vindo ao repositório do frontend do **Parkia**, uma plataforma moderna e eficiente para gerenciamento de estacionamentos inteligentes. Este projeto foi desenvolvido para oferecer uma interface intuitiva para controle de vagas, fluxo de veículos e configuração de tarifas.

## 📋 Sobre o Projeto

O Parkia permite que administradores de estacionamentos gerenciem suas operações diárias com facilidade. A aplicação oferece visualização em tempo real do estado das vagas, registro rápido de entradas e saídas, e cálculo automático de valores com base em tarifas configuráveis.

## ✨ Funcionalidades Principais

### 🚗 Gerenciamento de Vagas (`VagasGrid`)
*   **Mapa Visual:** Visualização de todas as vagas em um grid interativo.
*   **Status em Tempo Real:** Identificação rápida de vagas Livres (Verde), Ocupadas (Vermelho) e em Manutenção (Cinza).
*   **Filtros Avançados:** Filtragem de vagas por tipo de veículo (Carro/Moto) e status.
*   **CRUD Completo:**
    *   Criação de novas vagas.
    *   Edição de informações da vaga.
    *   Exclusão de vagas.
*   **Identificação de Veículos:** Visualização da placa do veículo estacionado diretamente no card da vaga.

### 📥 Controle de Entrada (`EntradaForm`)
*   Formulário ágil para registro de novos veículos.
*   Seleção de vagas disponíveis.
*   Validação de campos obrigatórios (Placa, Tipo).
*   Atualização automática do status da vaga.

### 📤 Controle de Saída (`SaidaForm`)
*   Busca de veículos por placa.
*   **Cálculo de Tarifa:** Estimativa automática do valor a pagar com base no tempo de permanência e regras de tarifação (tolerância, hora inicial, horas adicionais).
*   Confirmação de saída e liberação da vaga.

### 💰 Configuração de Tarifas (`TarifasSection`)
*   Definição de tabelas de preços específicas para Carros e Motos.
*   Ajuste de:
    *   Valor da 1ª Hora.
    *   Valor das Horas Adicionais.
    *   Tempo de Tolerância.
*   Busca de histórico de tarifas por placa.

### 📊 Dashboard (`Landing`)
*   Visão geral com estatísticas de ocupação.
*   Acesso centralizado a todas as ferramentas operacionais.

## 🛠️ Tecnologias Utilizadas

*   **React:** Biblioteca JavaScript para construção da interface.
*   **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
*   **TanStack Query (React Query):** Gerenciamento de estado assíncrono e cache de dados da API.
*   **Tailwind CSS:** Framework de utilitários CSS para estilização rápida e responsiva.
*   **Lucide React:** Biblioteca de ícones.
*   **Axios:** Cliente HTTP para comunicação com o Backend.

## 🚀 Como Executar o Projeto

### Pré-requisitos
*   Node.js instalado.
*   Backend do Parkia em execução (padrão: `http://localhost:3000`).

### Passos

1.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

2.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```

3.  **Acesse a aplicação:**
    Abra seu navegador em `http://localhost:5173` (ou a porta indicada no terminal).

---
Desenvolvido para o projeto Parkia.