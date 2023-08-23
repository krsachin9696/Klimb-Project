
# Klimb Project

This Node.js application allows you to add candidate records from an Excel file to a MongoDB database. The application provides a web landing page for uploading Excel files, processes the data, and stores candidate records in the database. It also handles duplicate email validation to ensure unique records.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Technical Design](#technical-design)
- [Data Handling](#data-handling)
- [API Response](#api-response)
- [Test Data](#test-data)

## Tech Stack

- Node.js (mandatory)
- MongoDB (mandatory)
- You can choose the rest of the stack based on your preferences.

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory.

```bash
cd Klimb-Project
```

3. Install the required dependencies.

```bash
npm install
```

## Usage

1. Set up your MongoDB database and update the connection string in `db.js`.
2. Start the application.

```bash
npm start
```

3. Open your web browser and go to `http://localhost:3000` to access the web landing page.
4. Upload an Excel file with candidate records.
5. The application will process the data, validate for duplicate email addresses, and store unique records in the database.
6. You will receive a success message if the Excel file is processed successfully.

## Technical Design

The backend of the application follows the principle of logical separation between Model and Controller components. Callbacks are used to manage asynchronous operations effectively.

## Data Handling

- The application extracts all properties defined in the Excel file and stores them in a MongoDB collection.
- All properties are stored as strings or the chosen data type.

## API Response

The API returns a success message if the Excel file is processed without errors.

## Test Data

Test data for candidate records is available in the enclosed Excel file.

---