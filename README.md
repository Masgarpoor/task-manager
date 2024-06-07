# Task Manager

This is a simple Task Manager application built with Node.js, Express, and EJS for templating.

## Features

- Add new tasks
- Mark tasks as complete
- List all tasks

## Installation

To get started with this project, follow these steps:

1.  Clone the repository:

    ```bash
    git clone https://github.com/Masgarpoor/task-manager.gitgit
    cd task-manager
    ```

2.  Install the dependencies:

    ```bash
    npm install
    ```

3.  Create a `.env` file in the root directory and add your environment variables:

    ```env
    DB_FILE=db.json
    ```

## Usage

1. Start the application:

   ```bash
   npm start
   ```

2. Open your browser and go to `http://localhost:3000`

## Project Structure

- `app.js`: The main entry point of the application.
- `controllers/`: Contains the controllers for handling requests.
  - `task-controller.js`: Handles task-related operations.
- `models/`: Contains the database models.
  - `db.js`: Database connection setup.
  - `task.js`: Task schema and model.
- `routes/`: Contains the route definitions.
  - `get-routes.js`: Handles GET requests.
  - `post-routes.js`: Handles POST requests.
- `static/`: Contains static assets like CSS and JavaScript files.
  - `css/`: Stylesheets.
  - `js/`: JavaScript files.
- `views/`: Contains the EJS templates.
  - `home.ejs`: The main page template.
  - `task.ejs`: The task item template.
- `.env`: Environment variables file (not included in the repository).
- `.gitignore`: Specifies which files and directories to ignore in the repository.
- `package.json`: Contains the project dependencies and scripts.
- `README.md`: This file.

## Contributing

If you want to contribute to this project, feel free to submit a pull request or open an issue.

