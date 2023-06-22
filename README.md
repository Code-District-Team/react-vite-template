# React + Vite

This is a starter template for building React applications using Vite. Vite is a build tool that provides fast development server and optimized production build.

## Features

- **Fast Development**: Vite's development server is incredibly fast, it uses modern web technologies such as ES modules and lazy loading to provide an instant hot reloading experience.

- **Efficient Production Build**: Vite builds optimized production code using Rollup. It provides tree shaking, code splitting and asset optimization out of the box to make your application as small and fast as possible.

- **React 18 Support**: This starter comes with the latest version of React (18) and its new features such as automatic batching, improved hydration, and startTransition() API.

- **CSS Preprocessor Support**: Easily add CSS preprocessors such as SASS to your project.

- **Routing**: This starter comes with React Router pre-configured for easy navigation and routing within your application.

## Getting Started

To get started, clone this repository and install dependencies:

```
git clone https://usama_codedistrict@bitbucket.org/codedistrict/react-vite-template.git
cd react-vite-template
yarn install
OR
pnpm install
```

Once the installation is complete, you can start the development server:

```
yarn dev
OR
pnpm dev
```

This will start the development server on `http://localhost:8000`. Any changes you make to the code will be hot-reloaded instantly.

To build the application for production, run:

```
yarn build
OR
pnpm build
```

This will generate a production-ready build in the `dist` folder.

For using enviroment specific .env files, You need to specify that in `package.json` file

[Env Variables and Modes in Vite](https://vitejs.dev/guide/env-and-mode.html)

## Learn More

You can learn more in the [Vite documentation](https://vitejs.dev/guide/).

To learn React, check out the [React documentation](https://react.dev/learn).

## Contributing

If you find any issues or have a feature request, please create an issue on the repository. Pull requests are also welcome.
