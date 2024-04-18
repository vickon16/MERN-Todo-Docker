FROM node:20-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

USER appuser

WORKDIR /app

COPY package*.json ./

# change ownership of the /app directory to the app user
USER root

# change ownership of the /app directory to the app user
# chown -R <user>:<group> <directory>
# chown command changes the user and/or group ownership of for given file.
RUN chown -R appuser:appgroup .

# change the user back to the app user
USER appuser

RUN npm install

COPY . . 

EXPOSE 8000 

CMD npm run start