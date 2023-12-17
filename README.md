# ChatUp - A Node.js, Express, MongoDB, and Next.js Chat Application

ChatUp is a real-time chat application built with Node.js, Express, MongoDB, and Next.js. It allows users to engage in real-time conversations, providing a seamless chatting experience.

## Getting Started

Follow these instructions to set up and run ChatUp on your local machine for development purposes.

### Prerequisites

-   Node.js and npm (Node Package Manager) installed on your machine.
-   MongoDB installed and running.

### Installation

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/CCR-bhurtel/ChatUp.git

    cd ChatUp

    cd api
    npm install

    cd ../client
    npm install
    ```

Check .env.sample in api and frontend folder and create .env file inside BOTH folder with necessary keys.

RUN mongodb server if necessary or add atlas connection string

Running the Development Servers

```bash
  cd api
  npm run dev
```

Your backend development server should start at:- http://localhost:3000

Start the frontend development server in another terminal tab:

```bash
  cd client
  npm run dev
```

The application shoud run on:- http://localhost:3000
