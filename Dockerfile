FROM python:3.11-slim

WORKDIR /docs

RUN apt update && apt install -y make gcc g++ build-essential && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./ /docs
