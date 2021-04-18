wasm-pack build --release
cd site
npm install --dev
npm run build-prod
cp index.html index.css dist/ 
