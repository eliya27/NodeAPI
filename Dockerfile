FROM node:16.0.0
ENV NODE_ENV=production

WORKDIR ./

RUN npm install 

COPY . .

EXPOSE 3434
CMD [ "node", "app.js" ]
