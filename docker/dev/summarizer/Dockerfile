FROM python:3.12.0

WORKDIR /apps/summarizer
COPY ./apps/summarizer/requirements /apps/summarizer/requirements
RUN pip3 install -r /apps/summarizer/requirements/dev.txt

COPY ./apps/summarizer /apps/summarizer

RUN apt update
RUN #apt install -y chromium
RUN apt install -y wkhtmltopdf
RUN chmod 777 /usr/bin/wkhtmltopdf

ENV PYTHONPATH "${PYTHONPATH}:/summarizer/summarizer"

COPY ./docker/dev/summarizer/entrypoint.sh /
RUN chmod +x /entrypoint.sh

#ENTRYPOINT ["chromium", "--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"]
ENTRYPOINT [ "/entrypoint.sh" ]
