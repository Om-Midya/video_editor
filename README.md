# API Based Online Video Editor

This project is a video editor API built with Node.js, Express, Sequelize, and SQLite. It allows users to upload, trim, merge videos, and generate shareable links with expiration times. The project also integrates Swagger for API documentation.

## Setup

### Pre-requisites

- Node.js (version 14.x or higher)
- npm (version 6.x or higher)
- ffmpeg (if not installed, run the following command)

```bash
sudo apt-get install ffmpeg
```

### Installation

- Clone the repository

```bash
git clone https://github.com/Om-Midya/video_editor
```

- Navigate to the project directory

```bash
cd video_editor
```

- Install dependencies

```bash
npm install
```

- Create a `.env` file in the root directory and add the following environment variables

```bash
PORT=3000
SECRET_KEY=your_secret_key
```

### Running the server

To start the server, run the following command

```bash
node src/server.js
```

The server will start on `http://localhost:3000`

### API Documentation

Once the server is running, you can access the API documentation at `http://localhost:3000/api-docs`

Here you can find the list of available endpoints and their request/response schemas, an interact with the API directly from the documentation.

### Running the tests

To run the tests, run the following command

```bash
npm test
```

Note: The test suite is currently failing as I am new to writing tests and still learning the exact way to write them. However, testing through Swagger API docs is working correctly.

## Features

- User authentication
- Upload video files
- Trim video files
- Merge video files
- Generate shareable links with expiration times

## Assumptions and Choices Made

### Assumptions

1. **Video Duration Limit:** A video duration limit of 120 seconds was imposed on user upload to ensure quick processing and testing.
2. **File Size Limit:** A file size limit of 100 MB was imposed to avoid excessive storage use and ensure quick uploads.

### Choices Made

1. **JWT for Authentication and protecting routes:**Used JWT for user authentication to secure the API endpoints.
2. **FFmpeg for Video Processing:** Leveraged FFmpeg for its powerful video processing capabilities. I took inspiration from [this code repo](https://github.com/bilashcse/video-editor) to understand the working of FFmpeg.
3. **Swagger for API Documentation:** Integrated Swagger to provide an interactive API documentation and testing interface.

## Credits

- [Bilash Chandra Sarker](https://github.com/bilashcse/video-editor) for the FFmpeg video processing code, it helped me a lot to understand the working of FFmpeg.
- Special thanks to the contributors of various npm packages and open-source projects that made this implementation possible.
