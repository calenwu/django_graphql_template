FROM alpine:3.19
RUN apk add --no-cache postgresql-client

COPY ./docker/dev/pg_backup/script.sh /backup_postgres.sh
COPY ./docker/dev/pg_backup/crontab.txt /crontab.txt

RUN chmod +x /backup_postgres.sh
RUN /usr/bin/crontab /crontab.txt

CMD crond -l 2 -f