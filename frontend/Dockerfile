FROM node:20-alpine

WORKDIR /frontend

# パッケージ管理ファイルのコピー
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Viteのデフォルトポートで起動
CMD ["npm", "run", "dev", "--", "--host"]