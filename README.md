![Logo](https://booker-mark.vercel.app/_next/image?url=%2Ffavicon.png&w=128&q=75)

### bookerMark

A bookmark manager application.

### Getting Started

Follow these steps to run the project locally:

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 16 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

## Clone the repository:

```sh
git clone https://github.com/jolawale28/bookerMark.git
cd bookerMark
```

## Install Dependencies

```sh
npm install
```

```sh
yarn install
```

## Running the Development server

Start the development server

```sh
npm run dev
```

or

```sh
yarn dev
```

The application will be available at https://localhost:3000

Build for Production
To build the project for production:

```sh
npm run build
```

or

```sh
yarn start
```

## Environment Variables

This project used a .env file for envrionment-specific configuratios. Create a .env file in the root directory and add the required variables.
* `NEXT_PUBLIC_APIKEY=your-firebase-api-key`
* `NEXT_PUBLIC_AUTHDOMAIN=your-firebase-auth-domain`
* `NEXT_PUBLIC_DATABASEURL=your-firebase-database-url`
* `NEXT_PUBLIC_PROJECTID=your-firebase-project-id`
* `NEXT_PUBLIC_STORAGEBUCKET=your-firebase-storage-bucket`
* `NEXT_PUBLIC_MESSAGINGSENDERID=your-firebase-messaging-sender-id`
* `NEXT_PUBLIC_APPID=your-firebase-app-id`
* `NEXT_PUBLIC_MEASUREMENTID=your-firebase-measurement-id`
* `NEXT_PUBLIC_VAPID_KEY=your-vapid-key`

Replace the placeholder values with your actual Firebase and VAPID key configurations.

## Linting
To check for linting issues, run:
```sh
npm run lint
```
or
```sh
yarn lint
```