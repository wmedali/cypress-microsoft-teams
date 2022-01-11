## Clone repository

`git clone https://github.com/wmedali/cypress-microsoft-teams.git`

If git is not installed, then [install Git](https://git-scm.com/book/fr/v2/D%C3%A9marrage-rapide-Installation-de-Git)

## Install dependencies

In the repo location, run the command :

`npm install`

## Run Command

`npx cypress run`

## Send Teams notifications

Configure the `WEBHOOK_URL` variable in the `testRunner.js` script and run it using some options :
`node cypress/testRunner.js --id "23334" --branch "feat/br-mock" --commit "testing commit"`
