# Kings & Scores

**Kings & Scores** é uma aplicação web onde jogadores podem se registrar e ver suas pontuações. O sistema mostra as melhores pontuações, e permite que novos jogadores se cadastrem com um nome de usuário e senha.

## Tecnologias Utilizadas

- **Next.js**: Framework React para construir sites e aplicações web.
- **React**: Biblioteca para construir interfaces de usuário.
- **Radix UI**: Biblioteca de componentes acessíveis para React.
- **React Hook Form**: Biblioteca para gerenciamento de formulários.
- **Zod**: Biblioteca de validação de dados.
- **Axios**: Cliente HTTP para realizar requisições para a API.
- **Tailwind CSS**: Framework de CSS para design responsivo e estilização rápida.

## Funcionalidades

- **Cadastro de Usuário**: Permite aos jogadores se registrarem com um nome de usuário e senha.
- **Exibição das Melhores Pontuações**: A página inicial mostra as 10 melhores pontuações dos jogadores.
- **Validação do Formulário de Cadastro**: Verifica se o nome de usuário contém espaços e se a senha tem pelo menos 6 caracteres.
- **Mensagens de Sucesso e Erro**: Exibe uma mensagem de sucesso após o registro ou um erro caso o nome de usuário já esteja em uso.

## Como Rodar Localmente

### 1. Clone o Repositório

Primeiro, clone o repositório em sua máquina:

```bash
git clone https://github.com/seu-usuario/kings-scores.git
cd kings-scores
```

### 2. Instale as Dependências

Instale todas as dependências do projeto:

```bash
npm install
```

### 3. Defina as Variáveis de Ambiente

Crie um arquivo .env.local na raiz do projeto e defina a URL da sua API:

```bash
NEXT_PUBLIC_API_URL= LINK DA SUA API
```

### 4. Inicie o Servidor de Desenvolvimento

Execute o comando abaixo para rodar o projeto localmente:

```bash
npm run dev
```

A aplicação estará disponível em http://localhost:3000.
