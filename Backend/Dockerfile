FROM golang:1.21

WORKDIR /app

COPY go.mod .
COPY go.sum .
COPY Server.go .

RUN go mod download

COPY Model ./Model

EXPOSE 8080

RUN go build -o bin .

CMD ["/app/bin"]