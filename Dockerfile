FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y mysql-server

ENV MYSQL_DATABASE=blog_db
ENV MYSQL_USER=per22318
ENV MYSQL_PASSWORD=16022004
ENV MYSQL_ROOT_PASSWORD=16022004

COPY schema.sql /docker-entrypoint-initdb.d/schema.sql

EXPOSE 3306

CMD ["mysqld"]