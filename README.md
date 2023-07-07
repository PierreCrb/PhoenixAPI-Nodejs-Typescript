![PhoenixBot](https://storage.sell.app/store/4122/listings/QSXM6X4LWy6Ds7Mm1iu08v1qsfovPWeGAES63VuE.png)

<h3 align="center">Nodejs & Typescript Wrapper</h3>

  <p align="center">
    Developed by <a href="https://0xpierre.com/"><strong>0xPierre</strong></a>
    </p>

<!-- GETTING STARTED -->

## Getting Started

The purpose of this example is to show you an implementation of the <a href="https://github.com/hatz02/PhoenixAPI/tree/main"><strong>Phoenix</strong></a> API using NodeJS and Typescript.

### Prerequisites

You must have <a href="https://nodejs.org/en/download"><strong>Nodejs</strong></a> installed on your computer.

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/hatz02/PhoenixAPI/tree/main
   ```
2. Install NPM packages

   ```sh
   cd nodejs && npm install
   ```
3. Enter your Phoenix port in `config.json`

   ```js
   {
      "port": 111111,
      "host": "127.0.0.1"
   }
   ```

<!-- USAGE EXAMPLES -->

## Usage

1. Start API
   ```sh
      npm start
   ```
2. And you should see in the console all the messages received with this format:

   ```sh
   {
       "packet": "",
       "type: 1
   }
   ```
