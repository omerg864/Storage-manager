# Storage Manager Website

Welcome to the Storage Manager Website repository! This project is a web application developed using React, Express, and MongoDB with Progressive Web App (PWA) support. It serves as a tool to manage your storage inventory efficiently. Used to manage the parts for a battalion in the IDF.

## Features

-   **User Authentication**: Users can sign up, log in, and manage their accounts securely.
-   **Inventory Management**: Easily add, update, and delete items in your storage inventory.
-   **Search Functionality**: Quickly find items using the search feature.
-   **Responsive Design**: The website is optimized for various devices, ensuring a seamless experience across desktop and mobile.
-   **Progressive Web App (PWA) Support**: Enjoy offline access and the ability to install the app on your device for quick access.

## Technologies Used

-   **Frontend**:

    -   React
    -   React Router
    -   Material-UI
    -   Service Worker (for PWA support)
    -   i18next (for translations)

-   **Backend**:
    -   Express.js
    -   MongoDB (with Mongoose for object modeling)
    -   JSON Web Tokens (JWT) for authentication

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository**:

    ```bash
    git clone https://github.com/omerg864/Storage-manager
    cd storage-manager
    ```

2. **Install dependencies**:

    ```bash
    # Install frontend dependencies
    cd client
    npm install

    # Install backend dependencies
    cd ..
    cd server
    npm install
    ```

3. **Set up environment variables**:

    - Create a `.env` file in the `server` directory and configure your MongoDB connection URI and JWT secret key.
    - Example `.env` file:

    ```
    MONGODB_URI=your_mongodb_connection_uri
    JWT_SECRET=your_jwt_secret_key
    ```

4. **Run the development server**:

    ```bash
    # Run the backend server
    cd ..
    cd server
    npm start

    # Run the frontend server
    cd ..
    cd client
    npm start
    ```

5. **Access the website**:

    Visit `http://localhost:3000` in your browser to access the Storage Manager Website.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.
