# Simple Authentication

Uma aplicação web simplificada para autenticação de usuários.  
Utiliza tecnologias modernas e princípios de design para garantir **Segurança** e **Eficiência**
Permite cadastro, login, encerramento de sessão e gerenciamento do perfil de forma simples e segura.

## O PROJETO

### Arquitetura
- **Princípios:**  
  - SOLID  
  - Clean Code
  - Test-Driven Development (TDD)

- **Padrões de Projeto:**  
  - Repository Pattern  
  - Factory Pattern

### Frontend
- **Framework:** NextJs  
- **Estilização:** Tailwind  
- **Componentes:** Shadcn

### Backend
- **Rotas:** Fastify  
- **Banco de Dados:** PrismaORM (Postgres), Docker  
- **Validação:** Zod  
- **Segurança:** BcryptJs, JSON Web Token (JWT), Refresh Token, Cookies
- **Testes Automatizados:** Vitest, supertest

### Requisitos Funcionais

De Autenticação:
- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível recuperar a senha via e-mail;

De Perfil:
- [x] Deve ser possível obter o perfil de um usuário qualquer;
- [x] Deve ser possível obter o próprio perfil;
- [x] Deve ser possível editar o próprio perfil;
- [x] Deve ser possível editar o perfil de um usuário **(MANAGER) | (ADMIN)**

De Listagem de Usuários:
- [x] Deve ser possível obter a lista de todos os usuários **(MANAGER) | (ADMIN)**
- [x] Deve ser possível obter a lista de todos os usuários filtrados por role **(ADMIN)**;

De Deleção de Usuários:
- [x] Deve ser possível deletar um usuário **(ADMIN)**

De Dados Sensiveis de Usuários (email, username, senha):
- [x] Deve ser possível atualizar seus dados sensíveis
- [x] Deve ser possível editar dados sensíveis de usuários **(ADMIN)**

De Sessions:
- [x] Deve ser possível listar suas próprias sessões:
- [x] Deve ser possível listar todas as sessões de um usuário **(ADMIN)**;
- [x] Deve ser possivel listar todas as sessões ativas **(ADMIN)**;
- [x] Deve ser possível listar todas as sessões de um usuário filtrado por data **(ADMIN)**;
- [x] Deve ser possível revogar uma sessão **(ADMIN)**;


### Regras de Negócio
De Autenticação:
- [x] Se o usuário errar a senha 3 vezes terá o perfil bloqueado por 5 minutos;
- [x] Não deve ser possivel fazer login se o usuário estiver bloqueado;

De Deleção de Usuários:
- [x] Toda a deleção da API deve ser SOFT DELETE;
- [x] Usuários deletados não podem ser autenticados, listados ou alterados,

De Dados Sensiveis de Usuários (email, username, senha):
- [x] O usuário não pode ter um e-mail duplicado;
- [x] O usuário não pode ter um username duplicado;

De Sessions:
- [x] É permitido multi-sessions;


### Requisitos Não Funcionais
- [x] A API deve ser documentada pelo Swagger;
- [x] As operações de criar e excluir perfil devem ser feitas junto com a de usuários;
- [x] A senha do usuário deve estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco de dados PostgreSQL;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token);
- [x] Deve haver um Refresh Token revalidando o token JWT;
- [x] A autenticação deve ter um Role Based Access Control (RBAC) com as roles: USER | MANAGER | ADMIN;
- [x] Todos os casos de usos devem ser testados de forma automatizada;
- [x] Não se deve utilizar nenhum sistema pronto de autenticação para facilitar o processo;
- [x] O token gerado deve ser válido de acordo com o site https://www.jwt.io/ ;
- [x] Ao realizar o logout a sessão deve ter os tokens e refreshTokens expirados;
- [x] Cada sessão deve ter o IP registrado;
- [x] Todas as sessions deve ter registro no banco de dados;

## INSTALAÇÃO

### Pré-requisitos
- Node.js (v14 ou superior)
- Node Package Manager (npm)
- Docker (para o PostgreSQL)

### Passo a Passo

1. Clone o repositório:
    ```sh
    git clone https://github.com/Ganim/SimpleAuth.git
    cd SimpleAuth
    ```

2. Instale as dependências:
  - Para o frontend (interface):
    ```sh
    cd auth-app
    npm install
    ```
  - Para o backend (servidor):
    ```sh
    cd auth-api
    npm install
    ```

3. Configure as variáveis de ambiente:
  - Crie um arquivo `.env` na raiz de cada diretório (frontend e backend) e ajuste as configurações conforme necessário (ver `.env.local` como exemplo).

4. Inicialize o banco de dados:
  - Utilize o Docker para subir o PostgreSQL dentro do backend (auth-api):
    ```sh
    docker-compose up -d
    ```

  - Crie os arquivos de tipagem e conexões do prisma:
    ```sh
    npx prisma genarate
    ```
    
  - Envie as migrations do prisma para o banco de dados no docker:
    ```sh
    npx prisma migrate dev
    ```

5. Execute o projeto em terminais separados:
  - No backend:
    ```sh
    npm run dev
    ```
  - No frontend:
    ```sh
    npm run dev
    ```

6. Acesse a aplicação:
  - Abra o navegador e acesse http://localhost:3000

### Notas Adicionais
- Certifique-se de que as portas necessárias estejam liberadas no seu sistema.
- Consulte a documentação específica de cada ferramenta para eventuais configurações adicionais.
