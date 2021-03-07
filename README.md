# Santa's Letters API

Essa API RESTful é um teste técnico para o processo seletivo de Backend Developer da Zappts, cujo objetivo era desenvolver um CRUD de envio e leitura de cartinhas de Natal para o Papai Noel e disponibilizá-lo como uma REST API. A URL da API é `https://santa-letters-api.herokuapp.com/`.

# Passo-a-Passo

- Após clonar ou baixar o repositório, rode `npm i` no CMD;
- Utilizando um API Client, como o Postman ou Insomnia, você poderá utilizar a API;
- Note que, com a exceção do `/user/register`, `/user/login` e os endpoints com o método GET, você deve passar o Header `x-acess-token` com o valor do token retornado na criação de conta ou login.
- O primeiro passo é criar uma conta no `/user/register` passando um JSON com username e password, por exemplo: `{ "username": "child", "password": "123" }`;
- Agora, sua conta está credenciada para alterar seus dados, apagar sua conta. Assim como criar, editar e apagar suas próprias cartas ao Papai Noel.

# Endpoints e seus Bodies

- `POST - /user/register`, cria sua conta. Body: `{ "username": "child", "password": "123" }`
- `POST - /user/login`, retorna um token ativo. Body: `{ "username": "child", "password": "123" }`
- `POST - /user/logout`, desativa o token passado.
- `GET - /user/list`, lista todos os usuários ativos.
- `GET - /user/read/:id`, retorna o usuário que corresponde ao ID passado.
- `PUT - /user/update`, altera username e/ou password do usuário logado. Body: `{ "password": "123456" }`
- `PATCH - /user/changeRole/:id`, exclusivo ao Papai Noel. Altera o Role do usuário que corresponde ao ID passado para `CHILD` [default] ou `SANTA`. Body: `{ "role": "SANTA" }`
- `DELETE - /user/delete`, deleta o usuário logado.

- `POST - /letter/create`, exclusivo para crianças. Cria uma carta. Body: `{ "title": "Papai Noel", "description": "Eu fui uma boa menina!" }`
- `GET - /letter/list`, lista todas as cartas.
- `GET - /letter/read/:id`, retorna a carta que corresponde ao ID passado.
- `PUT - /letter/update`, altera title e/ou description de uma carta se ela pertencer ao usuário logado. Retorna carta para o status `NOT_READ_BY_SANTA`. Body: `{ "title": "Querido Papai Noel" }`
- `PATCH - /letter/changeStatus/:id`, exclusivo ao Papai Noel. Altera o Status da carta que corresponde ao ID passado para `NOT_READ_BY_SANTA` [default], `ACCEPTED`, `REJECTED` ou `DELIVERED`. Body: `{ "status": "ACCEPTED" }`
- `DELETE - /letter/delete/:id`, deleta a carta que corresponde ao ID passado se ela pertencer ao usuário logado.
