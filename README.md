# React Vite Enterprise Template

A comprehensive enterprise-ready React template built with Vite, featuring advanced data handling, authentication, payment processing, and more.

## Features

- **Data Grid Systems**
  - Server-side filtering/sorting with AG Grid and Ant Design
  - Advanced filtering (text, number, date)
  - Pagination and infinite scrolling
  - Debounced search

- **CRUD Operations**
  - Complete product management
  - Modal-based forms
  - Server-side validation

- **File Operations**
  - CSV import/export
  - Drag-and-drop file upload
  - File validation

- **Authentication & Authorization**
  - Login system
  - Role-based access control
  - Permission management

- **Payment Integration**
  - Stripe payment processing
  - Saved cards support
  - 3D Secure integration

- **Documentation**
  - Comprehensive Storybook docs
  - API documentation
  - Usage examples

## Tech Stack

- React 18
- Vite
- Redux Toolkit
- Ant Design
- AG Grid Enterprise
- Stripe
- Storybook
- SASS/SCSS
- ESLint & Prettier
- Husky

## Prerequisites

Before setting up the project, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   ```bash
   # Check Node.js version
   node --version
   
   # If needed, install Node.js from
   https://nodejs.org/
   ```

2. **Yarn** (v4.3.0)
   ```bash
   # Install Yarn
   npm install -g yarn
   
   # Set Yarn version
   yarn set version 4.3.0
   ```

3. **Git**
   ```bash
   # Check Git version
   git --version
   
   # If needed, install Git from
   https://git-scm.com/downloads
   ```

## Setup Guide

1. **Clone the Repository**
   ```bash
   git clone https://usama_codedistrict@bitbucket.org/codedistrict/react-vite-template.git
   cd react-vite-template
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   # OR
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   # Copy example env file
   cp .env.example .env
   
   # Update environment variables in .env file
   ```

4. **Start Development Server**
   ```bash
   yarn dev
   # OR
   pnpm dev
   ```
   The development server will start at `http://localhost:8000`

## Available Scripts

- **Development**
  ```bash
  yarn dev          # Start development server
  ```

- **Production Build**
  ```bash
  yarn build        # Build for production
  yarn build:qa     # Build for QA environment
  yarn build:uat    # Build for UAT environment
  ```

- **Code Quality**
  ```bash
  yarn lint         # Run ESLint
  yarn prettify     # Run Prettier
  ```

- **Documentation**
  ```bash
  yarn storybook    # Start Storybook documentation
  ```

## Environment Configuration

For environment-specific configurations, create the following files:
- `.env.development` - Development environment
- `.env.qa` - QA environment
- `.env.uat` - UAT environment
- `.env.production` - Production environment

## Production Deployment

1. **Build the Application**
   ```bash
   yarn build
   ```
   This will generate optimized production files in the `dist` folder.

2. **Preview Production Build**
   ```bash
   yarn preview
   ```

## Docker Support

1. **Build Docker Image**
   ```bash
   docker build -t react-vite-template .
   ```

2. **Run Docker Container**
   ```bash
   docker run -p 8000:8000 react-vite-template
   ```

## Documentation

- View component documentation by running Storybook:
  ```bash
  yarn storybook
  ```
  Access Storybook at `http://localhost:6006`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Learn More

- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/learn)
- [Ant Design Documentation](https://ant.design/docs/react/introduce)
- [AG Grid Documentation](https://www.ag-grid.com/react-data-grid/)
- [Stripe Documentation](https://stripe.com/docs/stripe-js/react)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
