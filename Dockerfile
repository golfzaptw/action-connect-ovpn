FROM node:12-alpine

# Copy package.json and install
COPY package.json ./
RUN yarn
RUN apt-get install openvpn

# Copy logic
COPY index.js ./

ENTRYPOINT [ "node","/index.js" ]