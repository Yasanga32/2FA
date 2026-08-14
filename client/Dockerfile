FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .

# build the frontend
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview"]