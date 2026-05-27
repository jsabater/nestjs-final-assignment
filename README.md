# 507 - Introducció a Node.js

Pràctica final del curs d'introducció a Node.js (codi 507), incloent Express i Nest.js, realitzat entre els dies 19 de març i 31 de maig de 2026.

## Instal·lació i configuració

S'han de seguir les següents passes:

1. Clonar el repository:
   ```bash
   git clone https://github.com/jsabater/nestjs-final-assignment.git
   ```
2. Instal·lar les dependències:
   ```bash
   npm install
   ```
3. Configurar el fitxer `.env`:
   ```bash
   cp .env.example .env
   ```
   Editar el fitxer `.env` per configurar la variable d'entorn `OPENAI_API_KEY` amb la vostra clau API de OpenAI.

## Compilació i execució del projecte

El projecte es pot compilar i executar amb els comandos seguents:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Es pot accedir a la aplicació a la URL `http://localhost:3000/`. S'ha verificat el seu bon funcionament a través de l'aplicació client disponible a https://github.com/bbm16/curs_front.
