# Vitruvian LPC Studio


## Project Setup

```sh
npm install
cd public
git clone https://github.com/vitruvianstudio/spritesheets.git
cd ..
cd bin
curl https://raw.githubusercontent.com/ElizaWy/LPC/refs/heads/main/Characters/_%20Guides%20%26%20Palettes/Color%20Palettes/Ramps.json
python3 pack.py
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
