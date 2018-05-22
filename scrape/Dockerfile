FROM golang

ARG app_env
ENV APP_ENV $app_env

COPY . /go/src/app
WORKDIR /go/src/app

CMD go get github.com/pilu/fresh && fresh
  
EXPOSE 8080