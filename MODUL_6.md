# Mòdul 6 - Continuació de la pràctica amb NestJS

## Objectius de la sessió

En aquesta sessió continuarem treballant sobre el projecte creat al mòdul anterior.

Abans d'afegir funcionalitats noves, farem un repàs ràpid de tot el que ja tenim fet:

- estructura inicial del projecte NestJS
- mòdul `users`
- controlador `users`
- servei `users`
- model inicial d'usuari
- dades guardades temporalment en memòria
- endpoint `GET /users`

La idea d'aquest primer punt és assegurar que tothom entén la base del projecte abans de continuar.

## 1. Repàs del projecte creat fins ara

Al mòdul anterior vam crear una primera versió de la pràctica amb NestJS.

Encara no tenim base de dades, validacions avançades, autenticació ni integració amb IA.

Per ara, el projecte només conté la base necessària per entendre com NestJS separa una aplicació en peces petites i clares.

### 1.1 Estructura general del projecte

La carpeta principal de codi és:

```text
src/
```

Dins aquesta carpeta tenim els fitxers principals de l'aplicació:

```text
src/
  main.ts
  app.module.ts
  app.controller.ts
  app.service.ts
  users/
    user.model.ts
    users.module.ts
    users.controller.ts
    users.service.ts
```

Idea clau:

- `main.ts` arrenca l'aplicació
- `app.module.ts` és el mòdul principal
- `users.module.ts` agrupa la funcionalitat d'usuaris
- `users.controller.ts` defineix les rutes HTTP d'usuaris
- `users.service.ts` conté la lògica i les dades d'usuaris
- `user.model.ts` defineix la forma que té un usuari

### 1.2 Punt d'entrada de l'aplicació

El fitxer `main.ts` és el primer fitxer que s'executa quan arrencam el servidor.

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
```

Aquest fitxer fa tres coses importants:

- crea l'aplicació NestJS
- utilitza `AppModule` com a mòdul principal
- posa el servidor en marxa al port `3000`

Per executar el projecte en mode desenvolupament:

```bash
npm run start:dev
```

Després podem obrir:

```text
http://localhost:3000
```

### 1.3 Mòdul principal de l'aplicació

El fitxer `app.module.ts` registra els mòduls, controladors i serveis principals de l'aplicació.

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

La part més important ara mateix és aquesta:

```ts
imports: [UsersModule]
```

Això indica que l'aplicació principal utilitza el mòdul d'usuaris.

Idea clau:

NestJS organitza les funcionalitats en mòduls.

Quan cream un mòdul nou, normalment l'hem d'importar dins `AppModule` o dins un altre mòdul que el necessiti.

### 1.4 Mòdul d'usuaris

El mòdul d'usuaris es troba a:

```text
src/users/users.module.ts
```

El seu contingut és:

```ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

Aquest mòdul agrupa dues peces:

- `UsersController`
- `UsersService`

El controlador s'encarrega de rebre peticions HTTP.

El servei s'encarrega de guardar la lògica i les dades.

Idea clau:

El mòdul no implementa la lògica directament.

El mòdul només organitza quines peces formen part d'aquesta funcionalitat.

### 1.5 Model inicial d'usuari

Per tenir el codi tipat, vam crear un model simple d'usuari.

El fitxer és:

```text
src/users/user.model.ts
```

```ts
export type UserRole = 'admin' | 'member';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}
```

Això defineix la forma que tindran els usuaris dins l'aplicació.

En aquest cas utilitzam dues eines diferents de TypeScript:

- `type` per definir `UserRole`, perquè és una union de valors possibles
- `interface` per definir `User`, perquè representa la forma d'un objecte

Regla pràctica:

Si volem limitar valors possibles com `'admin' | 'member'`, utilitzam `type`.

Si volem descriure les propietats d'un objecte, utilitzam `interface`.

Cada usuari té:

- `id`
- `name`
- `email`
- `role`
- `active`
- `createdAt`

La propietat `role` només pot tenir dos valors:

```ts
'admin' | 'member'
```

Això és una union de TypeScript.

Ens ajuda a evitar valors incorrectes com:

```ts
'superuser'
'teacher'
'guest'
```

Idea clau:

TypeScript ens permet definir millor les dades abans d'executar el codi.

### 1.6 Servei d'usuaris

El servei d'usuaris està a:

```text
src/users/users.service.ts
```

```ts
import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      name: 'Anna Serra',
      email: 'anna@example.com',
      role: 'member',
      active: true,
      createdAt: new Date().toISOString(),
    },
  ];

  findAll(): User[] {
    return this.users;
  }
}
```

Per ara, els usuaris es guarden en memòria dins un array.

```ts
private users: User[] = [...]
```

Això vol dir que:

- les dades existeixen mentre el servidor està en marxa
- si reiniciam el servidor, les dades es tornen a crear
- encara no hi ha persistència real
- encara no utilitzam SQLite

El mètode `findAll()` retorna tots els usuaris:

```ts
findAll(): User[] {
  return this.users;
}
```

Idea clau:

El servei no sap res de rutes HTTP.

El servei només conté lògica i dades.

### 1.7 Controlador d'usuaris

El controlador d'usuaris està a:

```text
src/users/users.controller.ts
```

```ts
import { Controller, Get } from '@nestjs/common';
import { User } from './user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }
}
```

Aquest controlador crea la ruta base:

```ts
@Controller('users')
```

Això significa que les rutes d'aquest controlador comencen per:

```text
/users
```

El decorador `@Get()` indica que el mètode respon a peticions GET.

```ts
@Get()
findAll(): User[] {
  return this.usersService.findAll();
}
```

Per tant, quan feim una petició a:

```text
GET /users
```

NestJS executa el mètode `findAll()` del controlador.

Aquest mètode crida el servei:

```ts
this.usersService.findAll()
```

I el servei retorna l'array d'usuaris.

Idea clau:

El controlador connecta HTTP amb la lògica de l'aplicació.

El servei conté la lògica.

### 1.8 Prova de l'endpoint

Per provar el projecte, primer executam:

```bash
npm run start:dev
```

Després obrim:

```text
http://localhost:3000/users
```

La resposta esperada és semblant a aquesta:

```json
[
  {
    "id": 1,
    "name": "Anna Serra",
    "email": "anna@example.com",
    "role": "member",
    "active": true,
    "createdAt": "2026-04-16T10:00:00.000Z"
  }
]
```

La data pot ser diferent, perquè es genera automàticament amb:

```ts
new Date().toISOString()
```

### 1.9 Què tenim fet fins ara

Al final del mòdul anterior, el projecte ja té:

- projecte NestJS creat amb el CLI
- servidor preparat per executar-se amb `npm run start:dev`
- mòdul `users`
- controlador `users`
- servei `users`
- model `User`
- tipus `UserRole`
- endpoint `GET /users`
- dades guardades temporalment en memòria

Encara no tenim:

- `POST /users`
- `PATCH /users/:id`
- `DELETE /users/:id`
- filtres per `role` o `active`
- base de dades SQLite
- DTOs
- validacions avançades
- mòdul de recursos
- mòdul d'assignacions
- integració amb OpenAI

Aquests punts s'aniran afegint de forma progressiva en els pròxims passos.

## 2. Obtenir un sol usuari amb GET /users/:id

Ara que ja podem consultar tots els usuaris, afegirem un primer endpoint extra.

Fins ara tenim:

```text
GET /users
```

Aquest endpoint retorna tot l'array d'usuaris.

El següent pas és poder consultar un usuari concret a partir del seu `id`.

Per això afegirem:

```text
GET /users/:id
```

La part `:id` indica que la ruta rep un paràmetre.

Exemple:

```text
GET /users/1
```

En aquest cas, el valor de `id` és `1`.

### 2.1 Cercar un usuari dins el servei

El servei és qui conté les dades i la lògica.

Per això afegim un mètode `findOne()` dins:

```text
src/users/users.service.ts
```

```ts
findOne(id: number): User {
  const user = this.users.find((currentUser) => currentUser.id === id);

  if (!user) {
    throw new NotFoundException(`User with id ${id} not found`);
  }

  return user;
}
```

La línia:

```ts
const user = this.users.find((currentUser) => currentUser.id === id);
```

cerca dins l'array el primer usuari que tengui el mateix `id`.

Si no troba cap usuari, `find()` retorna `undefined`.

Per això comprovam:

```ts
if (!user) {
  throw new NotFoundException(`User with id ${id} not found`);
}
```

Amb `NotFoundException`, NestJS retornarà una resposta HTTP `404`.

Idea clau:

Quan cercam un element concret, hem de controlar què passa si no existeix.

### 2.2 Crear la ruta GET /users/:id al controlador

El controlador és qui rep la petició HTTP.

Per llegir un paràmetre de la URL, utilitzam:

```ts
@Param()
```

Al fitxer:

```text
src/users/users.controller.ts
```

Afegim aquesta ruta just després de `GET /users`:

```ts
@Get(':id')
findOne(@Param('id') id: string): User {
  return this.usersService.findOne(Number(id));
}
```

La part:

```ts
@Get(':id')
```

indica que aquesta ruta respon a peticions com:

```text
GET /users/1
GET /users/2
GET /users/7
```

La part:

```ts
@Param('id') id: string
```

agafa el valor de `id` de la URL.

Els paràmetres de ruta arriben com a text.

Per això convertim l'id a número:

```ts
Number(id)
```

Idea clau:

`@Param()` serveix per llegir valors que venen dins la URL.

### 2.3 Provar GET /users/:id

Per provar aquest endpoint, primer executam:

```bash
npm run start:dev
```

Després obrim:

```text
http://localhost:3000/users/1
```

Resposta esperada:

```json
{
  "id": 1,
  "name": "Anna Serra",
  "email": "anna@example.com",
  "role": "member",
  "active": true,
  "createdAt": "2026-04-16T10:00:00.000Z"
}
```

Si provam un id que no existeix:

```text
GET /users/999
```

La resposta serà semblant a:

```json
{
  "message": "User with id 999 not found",
  "error": "Not Found",
  "statusCode": 404
}
```

Ara ja tenim dues formes de consultar usuaris:

```text
GET /users
GET /users/:id
```

La primera retorna tots els usuaris.

La segona retorna només un usuari concret.

## 3. Afegir un usuari amb POST

Ara que ja podem consultar els usuaris amb:

```text
GET /users
```

El següent pas és poder crear un usuari nou.

Per això afegirem un endpoint nou:

```text
POST /users
```

Aquest endpoint rebrà dades en format JSON i les guardarà temporalment dins l'array d'usuaris.

Encara no utilitzarem base de dades.

Les dades continuaran guardades en memòria.

### 3.1 Dades que enviarem al servidor

Per crear un usuari nou, el client enviarà com a mínim:

```json
{
  "name": "Marc Vidal",
  "email": "marc@example.com",
  "role": "member"
}
```

Els camps següents es generaran automàticament dins el servidor:

- `id`
- `active`
- `createdAt`

Idea clau:

El client no hauria d'enviar totes les propietats de l'usuari.

Algunes dades les pot decidir el backend.

### 3.2 Interface per crear un usuari

Al fitxer:

```text
src/users/user.model.ts
```

Afegim una interface nova:

```ts
export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
}
```

Aquesta interface representa les dades que necessita el backend per crear un usuari.

Comparació ràpida:

- `User` representa un usuari complet
- `CreateUserInput` representa només les dades necessàries per crear-lo

Exemple:

```ts
export type UserRole = 'admin' | 'member';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
}
```

Idea clau:

Per definir la forma d'un objecte normal, `interface` és una bona opció.

Per definir una union com `'admin' | 'member'`, `type` és més còmode.

Per això, en aquest fitxer tenim:

- `UserRole` com a `type`
- `User` com a `interface`
- `CreateUserInput` com a `interface`

### 3.3 Crear l'usuari dins el servei

El servei és el lloc on guardam la lògica.

Per això afegim un mètode `create()` dins:

```text
src/users/users.service.ts
```

```ts
create(createUserInput: CreateUserInput): User {
  const newUser: User = {
    id: this.users.length + 1,
    name: createUserInput.name,
    email: createUserInput.email,
    role: createUserInput.role,
    active: true,
    createdAt: new Date().toISOString(),
  };

  this.users.push(newUser);

  return newUser;
}
```

Aquest mètode fa quatre coses:

- rep les dades del nou usuari
- crea un objecte `User` complet
- afegeix l'usuari a l'array amb `push`
- retorna l'usuari creat

La línia:

```ts
id: this.users.length + 1
```

genera un identificador senzill a partir de la longitud de l'array.

De moment és suficient per practicar.

Més endavant, quan utilitzem una base de dades, l'id es podrà generar d'una altra manera.

### 3.4 Crear la ruta POST al controlador

El controlador és qui rep la petició HTTP.

Per llegir el body d'una petició, NestJS utilitza el decorador:

```ts
@Body()
```

Al fitxer:

```text
src/users/users.controller.ts
```

Afegim:

```ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { CreateUserInput, User } from './user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): User {
    return this.usersService.findOne(Number(id));
  }

  @Post()
  create(@Body() createUserInput: CreateUserInput): User {
    return this.usersService.create(createUserInput);
  }
}
```

La part nova és:

```ts
@Post()
create(@Body() createUserInput: CreateUserInput): User {
  return this.usersService.create(createUserInput);
}
```

Això significa:

- `@Post()` respon a peticions POST
- `@Body()` llegeix el cos de la petició
- `createUserInput` conté les dades enviades pel client
- el controlador crida `this.usersService.create(...)`
- el servei crea i retorna l'usuari

Idea clau:

El controlador no crea directament l'usuari.

El controlador només rep la petició i delega la feina al servei.

### 3.5 Provar POST /users

Per provar aquest endpoint, primer executam:

```bash
npm run start:dev
```

Després podem enviar una petició POST a:

```text
http://localhost:3000/users
```

Body d'exemple:

```json
{
  "name": "Marc Vidal",
  "email": "marc@example.com",
  "role": "member"
}
```

Resposta esperada:

```json
{
  "id": 2,
  "name": "Marc Vidal",
  "email": "marc@example.com",
  "role": "member",
  "active": true,
  "createdAt": "2026-04-16T10:00:00.000Z"
}
```

La data pot ser diferent perquè es genera automàticament.

Després, si tornam a consultar:

```text
GET /users
```

La resposta ja hauria d'incloure els dos usuaris:

```json
[
  {
    "id": 1,
    "name": "Anna Serra",
    "email": "anna@example.com",
    "role": "member",
    "active": true,
    "createdAt": "2026-04-16T10:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Marc Vidal",
    "email": "marc@example.com",
    "role": "member",
    "active": true,
    "createdAt": "2026-04-16T10:05:00.000Z"
  }
]
```

Idea clau:

Ara ja tenim tres operacions bàsiques sobre usuaris:

```text
GET /users
GET /users/:id
POST /users
```

La primera serveix per consultar tots els usuaris.

La segona serveix per consultar un usuari concret.

La tercera serveix per crear dades.

## 4. Actualitzar i esborrar usuaris

Després de poder consultar i crear usuaris, afegirem dues operacions més:

```text
PATCH /users/:id
DELETE /users/:id
```

Amb aquestes rutes ja tendrem una primera versió del CRUD d'usuaris.

CRUD vol dir:

- `Create`: crear dades
- `Read`: llegir dades
- `Update`: actualitzar dades
- `Delete`: esborrar dades

En el nostre cas:

```text
GET /users        -> llegir usuaris
GET /users/:id    -> llegir un usuari concret
POST /users       -> crear un usuari
PATCH /users/:id  -> actualitzar un usuari
DELETE /users/:id -> esborrar un usuari
```

Encara treballam amb dades en memòria.

Per tant, si reiniciam el servidor, els canvis es perdran.

### 4.1 Interface per actualitzar un usuari

Quan cream un usuari, necessitam unes dades mínimes:

```ts
export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
}
```

Però quan actualitzam un usuari, no sempre volem canviar totes les propietats.

Per exemple, potser només volem canviar el nom:

```json
{
  "name": "Marc Vidal Soler"
}
```

O potser només volem desactivar l'usuari:

```json
{
  "active": false
}
```

Per això crearem una interface amb propietats opcionals:

```ts
export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserRole;
  active?: boolean;
}
```

El símbol `?` indica que una propietat és opcional.

Idea clau:

`CreateUserInput` té camps obligatoris.

`UpdateUserInput` té camps opcionals.

Això permet actualitzar només una part de l'usuari.

### 4.2 Actualitzar un usuari dins el servei

Al servei afegim un mètode `update()`.

Aquest mètode rep:

- l'id de l'usuari
- les dades que volem actualitzar

```ts
update(id: number, updateUserInput: UpdateUserInput): User {
  const user = this.users.find((currentUser) => currentUser.id === id);

  if (!user) {
    throw new NotFoundException(`User with id ${id} not found`);
  }

  Object.assign(user, updateUserInput);

  return user;
}
```

Primer cercam l'usuari dins l'array:

```ts
const user = this.users.find((currentUser) => currentUser.id === id);
```

Si `find()` no troba cap usuari, retorna `undefined`.

En aquest cas llançam una excepció:

```ts
throw new NotFoundException(`User with id ${id} not found`);
```

Això fa que NestJS retorni una resposta HTTP `404`.

Després actualitzam l'usuari amb:

```ts
Object.assign(user, updateUserInput);
```

`Object.assign()` copia les propietats de `updateUserInput` dins `user`.

Per exemple, si el body només conté:

```json
{
  "active": false
}
```

només es modificarà la propietat `active`.

Finalment retornam l'usuari actualitzat:

```ts
return user;
```

Idea clau:

Amb `PATCH` normalment actualitzam només una part d'un recurs.

Per això les propietats de `UpdateUserInput` són opcionals.

### 4.3 Esborrar un usuari dins el servei

Per esborrar un usuari, afegim un mètode `remove()`.

```ts
remove(id: number): User {
  const userIndex = this.users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    throw new NotFoundException(`User with id ${id} not found`);
  }

  const [deletedUser] = this.users.splice(userIndex, 1);

  return deletedUser;
}
```

Primer cercam la posició de l'usuari dins l'array:

```ts
const userIndex = this.users.findIndex((user) => user.id === id);
```

Si `findIndex()` retorna `-1`, vol dir que no ha trobat cap usuari.

En aquest cas retornam un error `404` amb `NotFoundException`.

Si l'usuari existeix, l'esborram amb:

```ts
this.users.splice(userIndex, 1)
```

Aquest mètode elimina un element de l'array.

En aquest cas, eliminam un usuari a partir de la seva posició.

Idea clau:

El servei continua sent qui modifica les dades.

El controlador només exposa la ruta HTTP.

### 4.4 Rutes PATCH i DELETE al controlador

Al controlador afegim dos decoradors nous:

```ts
@Patch(':id')
@Delete(':id')
```

També utilitzam `@Param()` per llegir l'id de la URL.

Exemple:

```text
PATCH /users/2
```

En aquesta ruta, el valor `2` és el paràmetre `id`.

El controlador queda així:

```ts
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import type { CreateUserInput, UpdateUserInput, User } from './user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): User {
    return this.usersService.findOne(Number(id));
  }

  @Post()
  create(@Body() createUserInput: CreateUserInput): User {
    return this.usersService.create(createUserInput);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserInput: UpdateUserInput,
  ): User {
    return this.usersService.update(Number(id), updateUserInput);
  }

  @Delete(':id')
  remove(@Param('id') id: string): User {
    return this.usersService.remove(Number(id));
  }
}
```

La part:

```ts
@Param('id') id: string
```

agafa l'id de la URL.

Com que els paràmetres de ruta arriben com a text, convertim l'id a número amb:

```ts
Number(id)
```

Idea clau:

`@Body()` llegeix dades del cos de la petició.

`@Param()` llegeix dades de la URL.

### 4.5 Provar PATCH /users/:id

Primer crearem un usuari o utilitzarem un usuari existent.

Per actualitzar l'usuari amb id `1`, enviam una petició:

```text
PATCH /users/1
```

Body d'exemple:

```json
{
  "name": "Anna Serra Vila",
  "active": false
}
```

Resposta esperada:

```json
{
  "id": 1,
  "name": "Anna Serra Vila",
  "email": "anna@example.com",
  "role": "member",
  "active": false,
  "createdAt": "2026-04-16T10:00:00.000Z"
}
```

Observa que només han canviat:

- `name`
- `active`

La resta de propietats continuen igual.

### 4.6 Provar DELETE /users/:id

Per esborrar l'usuari amb id `1`, enviam:

```text
DELETE /users/1
```

Resposta esperada:

```json
{
  "id": 1,
  "name": "Anna Serra Vila",
  "email": "anna@example.com",
  "role": "member",
  "active": false,
  "createdAt": "2026-04-16T10:00:00.000Z"
}
```

En aquesta primera versió retornam l'usuari eliminat.

Després, si consultam:

```text
GET /users
```

Aquest usuari ja no hauria d'aparèixer dins l'array.

### 4.7 Què passa si l'id no existeix?

Si intentam actualitzar o esborrar un usuari que no existeix:

```text
PATCH /users/999
DELETE /users/999
```

El servei llança una excepció:

```ts
throw new NotFoundException(`User with id ${id} not found`);
```

NestJS converteix aquesta excepció en una resposta HTTP `404`.

Resposta semblant:

```json
{
  "message": "User with id 999 not found",
  "error": "Not Found",
  "statusCode": 404
}
```

Idea clau:

És important controlar els casos en què una dada no existeix.

Una API no hauria de fallar sense explicar què ha passat.

## Exercici de repàs

Abans de continuar, comprova que pots respondre aquestes preguntes:

- Quin fitxer arrenca l'aplicació?
- Quin mòdul importa `UsersModule`?
- Quin fitxer defineix la ruta `GET /users`?
- Quin fitxer guarda l'array d'usuaris?
- Per què `UsersService` no hauria de gestionar directament peticions HTTP?
- Què passa amb les dades si reiniciam el servidor?
- Quin decorador utilitzam per llegir l'id de `GET /users/:id`?
- Què ha de retornar l'API si cercam un usuari que no existeix?
- Quin decorador utilitzam per crear una ruta POST?
- Quin decorador utilitzam per llegir el body d'una petició?
- Per què el servei és qui ha de crear l'usuari?
- Quin decorador utilitzam per actualitzar parcialment un usuari?
- Quin decorador utilitzam per esborrar un usuari?
- Per què `UpdateUserInput` té propietats opcionals?
- Què retorna l'API si intentam actualitzar un usuari que no existeix?

Objectiu d'aquest repàs:

Entendre bé la separació entre mòdul, controlador, servei i model abans de continuar ampliant la pràctica.

## Resum

Fins ara tenim una API NestJS molt senzilla.

Les funcionalitats principals són:

```text
GET /users
GET /users/:id
POST /users
PATCH /users/:id
DELETE /users/:id
```

El primer endpoint retorna un array d'usuaris guardat en memòria.

El segon endpoint retorna un sol usuari a partir del seu `id`.

El tercer endpoint permet crear un usuari nou i guardar-lo temporalment dins l'array.

El quart endpoint permet actualitzar parcialment un usuari.

El cinquè endpoint permet esborrar un usuari.

El projecte ja mostra la idea bàsica de NestJS:

- els mòduls organitzen
- els controladors exposen rutes HTTP
- els serveis contenen la lògica
- TypeScript ajuda a definir millor les dades

Amb aquesta base ja podem començar a afegir funcionalitats noves al mòdul 6.
