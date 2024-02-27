FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y mysql-server

ENV MYSQL_DATABASE=blog
ENV MYSQL_USER=pereira
ENV MYSQL_PASSWORD=blog2024
ENV MYSQL_ROOT_PASSWORD=

COPY schema.sql /docker-entrypoint-initdb.d/schema.sql

EXPOSE 3306

CMD ["mysqld"]

