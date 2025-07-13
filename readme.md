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
- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [ ] Deve ser possível encerrar sua sessão;
- [x] Deve ser possível obter o perfil do usuário logado;

### Regras de Negócio
- [x] O usuário não pode se cadastrar com um e-mail duplicado;

### Requisitos Não Funcionais
- [x] A senha do usuário deve estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco de dados PostgreSQL;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token);
- [x] Deve haver um Refresh Token revalidando o token JWT;
- [ ] Todos os casos de usos devem ser testados de forma automatizada;
- [x] Não se deve utilizar nenhum sistema pronto de autenticação para facilitar o processo;

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
