FROM node:16.0.0
WORKDIR /app
ADD package.json package.json
ADD yarn.lock yarn.lock
RUN yarn install
COPY . .
ENV FLAG=AIS3{V3rY_v3rY_V3ry_345Y_55rF}
CMD yarn run production