# Visualization Dashboard with MongoDB Integration

A comprehensive data visualization dashboard built with Next.js, D3.js, Tailwind CSS, and MongoDB. This application provides interactive charts and filtering capabilities for analyzing complex datasets stored in MongoDB.

## Features

- **MongoDB Integration**: Full database connectivity with filtering and querying
- **Interactive Visualizations**: Bar charts, line charts, scatter plots, pie charts, and heatmaps
- **Advanced Filtering**: Multi-select dropdowns, range sliders, checkboxes, and search functionality
- **Real-time Data**: Live data fetching from MongoDB with server-side filtering
- **Responsive Design**: Optimized for desktop and mobile devices
- **Performance Optimized**: Efficient database queries and client-side caching
- **Accessibility**: Keyboard navigation and ARIA labels

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: MongoDB with native driver
- **Styling**: Tailwind CSS
- **Charts**: D3.js v7
- **State Management**: React Context
- **UI Components**: shadcn/ui
- **TypeScript**: Full type safety

## Database Setup

### Local MongoDB

1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `analytics_dashboard`
3. Create a collection named `data_points`

### Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/analytics_dashboard
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/analytics_dashboard?retryWrites=true&w=majority

# Database Name
MONGODB_DB=analytics_dashboard

# Collection Name
MONGODB_COLLECTION=data_points
\`\`\`

### Data Structure

The MongoDB collection should contain documents with the following structure:

\`\`\`json
{
  "end_year": 2027,
  "intensity": 60,
  "likelihood": 4,
  "relevance": 5,
  "start_year": 2022,
  "country": "United States",
  "region": "Northern America",
  "city": "Washington",
  "sector": "Government",
  "topic": "market",
  "pestle": "Political",
  "source": "CleanTechnica",
  "insight": "Sample insight text",
  "title": "Sample title",
  "url": "https://example.com",
  "published": "January, 13 2017 00:00:00",
  "added": "January, 18 2017 02:23:13"
}
\`\`\`

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd visualization-dashboard
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your MongoDB connection string
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

6. Initialize sample data by clicking the "Init Data" button in the filters sidebar.

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## API Endpoints

### GET /api/data
Fetch filtered data from MongoDB.

**Query Parameters:**
- `minYear`, `maxYear`: Year range filter
- `topics`, `sectors`, `regions`, `countries`, `cities`, `pestles`, `sources`: Comma-separated filter values
- `limit`, `skip`: Pagination parameters

### POST /api/data
Initialize sample data in the database.

### GET /api/data/unique-values
Get unique values for a specific field.

**Query Parameters:**
- `field`: The field name to get unique values for

## Database Operations

The application includes a `DatabaseService` class that handles:

- **Filtered Queries**: Server-side filtering using MongoDB queries
- **Unique Values**: Fetching distinct values for filter options
- **Data Counting**: Efficient document counting with filters
- **Sample Data**: Automatic sample data insertion

## Performance Considerations

- **Server-side Filtering**: All filtering is done at the database level
- **Efficient Queries**: Optimized MongoDB queries with proper indexing
- **Connection Pooling**: MongoDB connection reuse in production
- **Lazy Loading**: Charts and data are loaded on demand
- **Error Handling**: Comprehensive error handling for database operations

## MongoDB Indexing

For optimal performance, consider adding indexes:

\`\`\`javascript
// In MongoDB shell or MongoDB Compass
db.data_points.createIndex({ "end_year": 1 })
db.data_points.createIndex({ "start_year": 1 })
db.data_points.createIndex({ "topic": 1 })
db.data_points.createIndex({ "sector": 1 })
db.data_points.createIndex({ "region": 1 })
db.data_points.createIndex({ "country": 1 })
db.data_points.createIndex({ "pestle": 1 })
db.data_points.createIndex({ "published": 1 })

// Compound indexes for common filter combinations
db.data_points.createIndex({ "sector": 1, "region": 1 })
db.data_points.createIndex({ "end_year": 1, "topic": 1 })
\`\`\`

## Data Import

To import your own data into MongoDB:

\`\`\`bash
# Using mongoimport
mongoimport --db analytics_dashboard --collection data_points --file your_data.json --jsonArray

# Or using MongoDB Compass GUI
# Import -> Select JSON file -> Choose collection
\`\`\`

## Troubleshooting

### Connection Issues
- Verify MongoDB is running
- Check connection string in `.env.local`
- Ensure database and collection names are correct

### No Data Displayed
- Click "Init Data" button to insert sample data
- Check browser console for API errors
- Verify MongoDB connection and permissions

### Performance Issues
- Add appropriate indexes to MongoDB
- Consider pagination for large datasets
- Monitor MongoDB query performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
