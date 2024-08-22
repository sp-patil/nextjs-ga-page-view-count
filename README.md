# Next.js Google Analytics Page View Count

This package allows you to fetch and display page view counts from Google Analytics (GA4) in your Next.js projects.

## Features

- Fetch page view counts for specific pages or routes using GA4.
- Easy integration with Next.js API routes.
- Works with both server-side and static generation.

## Prerequisites

### 1. Google Analytics (GA4) Account

To use this package, you need to have a Google Analytics (GA4) account set up for your website. You will also need a GA4 Property ID.

### 2. Google Cloud Project & Service Account

To fetch data from Google Analytics, you will need to set up a Google Cloud project and create a service account with the necessary credentials.

#### Steps to set up a Google Cloud Project and Service Account:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Enable the Google Analytics Data API for your project.
4. Go to the **Credentials** tab and create a service account.
5. Generate a key for the service account. This will download the `credentials.json` file to your local machine.

> **Note:** Keep the `credentials.json` file secure as it contains sensitive information.

### Placing the `credentials.json` File

After generating the `credentials.json` file, place it in the root of your Next.js project:

```bash
/your-nextjs-project
  ├── pages/
  ├── public/
  ├── credentials.json  <-- Place the file here
  └── ...
```

Ensure that this file is not committed to version control by adding it to your `.gitignore` file:

```bash
# .gitignore
credentials.json
```

## Installation

To install the package, run:

```bash
npm install nextjs-ga-page-view-count
```

## Usage

### Required Parameters

When calling the `getPageViewCount` function, you need to provide the following parameters:

- `slug`: The page path or route (e.g., `/blogs/my-post`).
- `propertyId`: Your GA4 Property ID (can be found in your GA4 account under "Admin > Property Settings").
- `keyFilePath`: The file path to your `credentials.json` file (service account credentials).
- `startDate`: The start date for fetching analytics data (e.g., `2023-01-01`).
- `endDate`: The end date for fetching analytics data (e.g., `today`).

### 1. API Route

Create an API route in your Next.js project to interact with Google Analytics and fetch the page view counts.

Example API route (`/pages/api/page-views.js`):

```bash
import { getPageViewCount } from 'nextjs-ga-page-view-count';
import path from 'path';

export default async function handler(req, res) {
  const { slug } = req.query;

  try {
    const propertyId = 'YOUR_GA4_PROPERTY_ID';
    const keyFilePath = path.join(process.cwd(), 'credentials.json');
    const startDate = '2023-01-01';
    const endDate = 'today';

    // Fetch page view count
    const pageViews = await getPageViewCount(slug, propertyId, keyFilePath, startDate, endDate);

    res.status(200).json({ pageViews });
  } catch (error) {
    console.error('Error fetching page view count:', error);
    res.status(500).json({ error: 'Error fetching page view count' });
  }
}
```

### 2. Frontend Usage

Use the API route to fetch page views in your React component.

Example:

```bash
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BlogPage = ({ slug }) => {
  const [pageViews, setPageViews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageViews = async () => {
      try {
        const response = await axios.post('/api/page-views', {
          slug: slug,
        });
        setPageViews(response.data.pageViews);
      } catch (error) {
        console.error('Failed to fetch page view count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageViews();
  }, [slug]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Blog Title</h1>
      <p>This blog has been viewed {pageViews} times.</p>
    </div>
  );
};

export default BlogPage;
```

## Configuration

- `slug`: The page path or route.
- `propertyId`: Your GA4 Property ID.
- `keyFilePath`: The file path to your `credentials.json` file.
- `startDate` & `endDate`: Define the date range for fetching analytics data.

## Notes

- This package is intended to be used in server-side environments (e.g., Next.js API routes or server-side logic). It will not work directly in the browser due to its dependency on Node.js modules.
- Ensure that your Google Cloud project has the correct permissions to access your Google Analytics data.

## Author

This package is maintained by Satish Patil. For any questions or issues, please contact me at [satishhhh04@gmail.com](mailto:satishhhh04@gmail.com).

## License

MIT License
