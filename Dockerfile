FROM node:12-alpine

# Copy package.json and install
COPY package.json ./
RUN yarn
RUN apk add --update --no-cache openvpn

# Copy logic

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]