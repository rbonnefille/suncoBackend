# Installation

## Install dependencies

```bash
npm install --prefix client && npm install --prefix server
```

## Create environment files for the server and client

- Create a `.env` file in the root of each folders by following the `README.md` files in each folder.

## Run the app

Open a split terminal in VSCode and run the following commands:

- In the first terminal:

```bash
npm run dev --prefix client
```

- In the second terminal:

```bash
 npm start --prefix server
```

### Technologies used

- ExpressJS for the backend
- Vue.js for client side
