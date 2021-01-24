<!-- ABOUT THE PROJECT -->

## About The Project

This is a realtively simple voting API built with a microservices approach. Each service has it's own database and cross service communication is handled by nats streaming server.

Points of note:

- No service is diretly dependant on any other
- Data integrity is maintained even after downtime for a single service
- Deployed to an EKS kubernetes cluster in AWS
- CI / CD with github actions

### Built With

- [Node](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Nats Streaming Server](https://nats.io/download/nats-io/nats-streaming-server/)

## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

In order to run the application locally the following pre requisites must be met:

- Working kubernetes cluster (I'm using KIND instead of minikub in a wsl2 environment)
- Ingress Nginx installed [Installation](https://kubernetes.github.io/ingress-nginx/deploy/)
- skaffold installed [Installation](https://skaffold.dev/docs/install/)

### Installation

1. Create a secrets file (infra/k8s/secrets.yaml)
2. Input secrets for database connection and JWT secret (see secrets template below)
3. Run `yarn install` from each individual service directory
4. run `skaffold dev` from the root directory
5. Application will be running on http://api.localhost/
6. Health checks for each service are available on /(service)/health e.g. http://api.localhost/causes/health

### Secrets template

```
apiVersion: v1
kind: Secret
metadata:
  name: secrets
type: Opaque
stringData:
  USERS_MONGO_URI:
  CAUSES_MONGO_URI:
  ALLOCATIONS_MONGO_URI:
  JWT_KEY:

```

### Postman

A postman suite is included in the root directory and connects to the deployed production application by default.
In order to test admin functionality you can log in with user:

```
{
    "email": "admin@demouser.com",
    "password": "testpass"
}
```

### Production

The production application is available at [http://voting-api/mh.codes](http://voting-api/mh.codes)

## Deployment

CI/CD is handled by github actions. Simply commit your changes and push to master (or create a PR). CI/CD will only be run on services which have been changed.

## License

Distributed under the MIT License.
