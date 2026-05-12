#docker run -ti --rm -p 4200:4200 -v "$PWD":/app angular:latest /bin/ash


FROM node:16.13.1-alpine
LABEL mantainer="alanatala@gmail.com"
RUN find / -group 1002 -exec chgrp -h node {} \;
RUN find / -user 1002 -exec chown -h node {} \;

USER node
RUN mkdir /home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

USER root
RUN apk update && apk add jq
RUN npm install -g @angular/cli@13.1.4

USER node
