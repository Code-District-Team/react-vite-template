FROM node:20-alpine AS build

WORKDIR /vite-app

COPY package.json .

RUN yarn

COPY . .

RUN yarn build


FROM ubuntu/nginx
COPY --from=build /vite-app/dist /var/www/html/
EXPOSE 80
CMD ["nginx","-g","daemon off;"]

