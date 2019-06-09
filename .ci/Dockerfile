FROM node:10.16.0-stretch

WORKDIR /app

COPY build.sh /cont/script/
RUN set -ex \
    && chmod +x /cont/script/build.sh

CMD ["/cont/script/build.sh"]
