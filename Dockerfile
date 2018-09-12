FROM python:3

MAINTAINER Neehi <nick.snape@hotmail.com>

ENV PYTHONUNBUFFERED 1

COPY src/api/requirements.txt /srv/api/

RUN pip install --upgrade pip && \
    pip install -r /srv/api/requirements.txt

WORKDIR /srv/api/
