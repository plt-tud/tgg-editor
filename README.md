# TGG-Editor

The TGG Editor has a frontend and a backend component.

The backend component is developed with Nodejs express

The frontend component was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.2.

## Develop Dependencies
* Node.js (>v6.0)
* joint.js (>v2.0.0)
* angular-cli (1.0.2)

## Development

### Install

Run `npm install` to install all dependencies

### Backend server

Run `npm run backend` for running the backend server. It will run on `http://localhost:8080`.

### Frontend server

Run `npm run frontend` for a dev server. Navigate to . The app will automatically reload if you change any of the source files.
It will automatically redirect all HTTP requests targeting `http://localhost:4400/` to the backend.

### Example with Linked Data
```
./start_fuseki.sh
./start_example.sh
```
Start Browser with: `http://localhost:8080/` ...and have fun

Angular Example: `http://localhost:4400/`

## Deployment
```
ng build --environment prod
# frontend code is deployed to 'dist'
```
