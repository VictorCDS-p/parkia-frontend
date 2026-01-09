# Parkia – Frontend

[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-green)](https://tailwindcss.com/) [![Axios](https://img.shields.io/badge/Axios-HTTP-orange)](https://axios-http.com/)

## 🎯 Sobre o Projeto

O frontend do **Parkia** oferece uma interface moderna e intuitiva para o gerenciamento de estacionamentos inteligentes.

Funcionalidades principais:

* Visualização em tempo real do estado das vagas
* Registro rápido de entradas e saídas de veículos
* Cálculo automático de valores com base em tarifas configuráveis
* Dashboard completo com estatísticas e ferramentas operacionais

---

## ✨ Funcionalidades Principais

### 🚗 Gerenciamento de Vagas (`VagasGrid`)

* **Mapa Visual:** Grid interativo mostrando todas as vagas.
* **Status em Tempo Real:** Verde = Livre, Vermelho = Ocupada, Cinza = Manutenção.
* **Filtros Avançados:** Por tipo de veículo (Carro/Moto) e status.
* **CRUD Completo:**

  * Criar novas vagas
  * Editar informações da vaga
  * Excluir vagas (se liberadas)
* **Identificação de Veículos:** Exibe a placa do veículo na vaga.

### 📥 Controle de Entrada (`EntradaForm`)

* Formulário ágil para registrar veículos.
* Seleção de vagas disponíveis.
* Validação de campos obrigatórios (Placa, Tipo).
* Atualização automática do status da vaga.

### 📤 Controle de Saída (`SaidaForm`)

* Busca de veículos por placa.
* **Cálculo de Tarifa:** Estimativa baseada no tempo de permanência e regras de tarifação (tolerância, primeira hora, horas adicionais).
* Confirmação de saída e liberação da vaga.

### 💰 Configuração de Tarifas (`TarifasSection`)

* Definição de preços específicos para Carros e Motos.
* Ajuste de:

  * Valor da 1ª hora
  * Valor das horas adicionais
  * Tempo de tolerância
* Consulta de histórico de tarifas por veículo.

### 📊 Dashboard (`Landing`)

* Visão geral das estatísticas de ocupação.
* Acesso centralizado a todas as ferramentas do sistema.

---

## 🛠️ Tecnologias Utilizadas

* **React:** Biblioteca para construção da interface.
* **TypeScript:** Tipagem estática e segurança no código.
* **TanStack Query (React Query):** Gerenciamento de estado assíncrono e cache de dados da API.
* **Tailwind CSS:** Estilização rápida e responsiva.
* **Lucide React:** Biblioteca de ícones.
* **Axios:** Cliente HTTP para comunicação com o backend.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

* Node.js instalado
* Backend do Parkia em execução (`http://localhost:3000`)

### Passos

1. **Instalar dependências**

```bash
npm install
# ou
yarn install
```

2. **Executar servidor de desenvolvimento**

```bash
npm run dev
# ou
yarn dev
```

3. **Acessar a aplicação**
   Abra seu navegador em [http://localhost:5173](http://localhost:5173)

---

## 🌐 Links Úteis

* **Frontend hospedado (Vercel):** [https://parkia-frontend.vercel.app](https://parkia-frontend.vercel.app)
* **Repositório do Backend:** [Link do Backend](https://github.com/VictorCDS-p/parkia-backend)


---
Boa pergunta — isso é **exatamente** o tipo de coisa que avaliadores gostam de ver 👍
Vou te entregar um texto pronto, bem profissional, para **adicionar no README do frontend**.

Você só precisa **copiar e colar** a seção abaixo (recomendo colocar logo antes de “Links Úteis” ou após “Tecnologias Utilizadas”).

---

## 🧠 Decisões Técnicas e de UX

Durante o desenvolvimento do frontend do **Parkia**, algumas decisões técnicas e de experiência do usuário (UX) foram tomadas para tornar a aplicação mais clara, objetiva e agradável visualmente.

### Exibição da Placa Diretamente na Vaga

Uma das principais decisões foi **exibir a placa do veículo diretamente no card da vaga ocupada**, em vez de manter essa informação apenas em listas ou telas separadas.

**Motivações dessa decisão:**

* Reduz a necessidade de navegação entre telas para identificar veículos.
* Melhora a leitura visual do estacionamento em tempo real.
* Mantém a interface mais limpa e objetiva, evitando excesso de modais ou tabelas.
* Facilita a operação diária do estacionamento, permitindo identificação rápida de cada vaga ocupada.

Essa abordagem prioriza **clareza visual, agilidade operacional e simplicidade**, alinhando o layout da aplicação a um cenário real de uso.

---
## 📌 Observações

* Compatível com navegadores modernos
* Totalmente integrado ao backend do Parkia

---
