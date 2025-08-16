# Basketball Stats App

## Overview
The Basketball Stats App is a web application designed to help users input basketball shot data and visualize statistics in a user-friendly format. The application features two main modes: data entry and visualization, allowing users to track their shooting performance and analyze their statistics effectively.

## Features
- **Data Entry**: Users can input shot data, including shot type, distance, and success rate.
- **Visualization**: The app provides visual representations of shot statistics, including percentages made and points per shot.
- **Detailed Statistics**: Users can filter and view detailed statistics based on various criteria.
- **CSV Export**: Users can export their shot data in CSV format for further analysis.

## Project Structure
```
basketball-stats-app
├── public
│   └── index.html
├── src
│   ├── components
│   │   ├── DataEntry.jsx
│   │   ├── Visualization.jsx
│   │   └── ShotStats.jsx
│   ├── pages
│   │   ├── Home.jsx
│   │   └── About.jsx
│   ├── utils
│   │   └── csvExport.js
│   ├── App.jsx
│   └── index.js
├── package.json
├── .gitignore
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd basketball-stats-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Start the development server:
   ```
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000` to access the application.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.