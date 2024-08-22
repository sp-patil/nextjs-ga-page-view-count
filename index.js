const { google } = require("googleapis");
// const path = require("path");

// /**
//  * Fetches page view count from Google Analytics (GA4) using a service account.
//  *
//  * @param {string} slug - The blog slug for which to fetch the view count.
//  * @param {string} propertyId - The GA4 property ID.
//  * @param {string} keyFilePath - Path to your Google service account credentials file.
//  * @param {string} startDate - Start date for fetching data (e.g., '2023-01-01').
//  * @param {string} endDate - End date for fetching data (e.g., 'today').
//  * @returns {Promise<number>} - The page view count.
//  */

async function getPageViewCount(
  slug,
  propertyId,
  keyFilePath,
  startDate,
  endDate = "today"
) {
  try {
    const analyticsdata = google.analyticsdata("v1beta");

    // Authenticate with Google Analytics using service account credentials
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: "https://www.googleapis.com/auth/analytics.readonly",
    });

    const authClient = await auth.getClient();

    // Run report to get page view count
    const response = await analyticsdata.properties.runReport({
      auth: authClient,
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        dimensionFilter: {
          filter: {
            fieldName: "pagePath",
            stringFilter: {
              matchType: "EXACT",
              value: slug,
            },
          },
        },
      },
    });

    const rows = response.data.rows;

    let pageViews = 0;
    if (rows && rows.length > 0) {
      pageViews = parseInt(rows[0].metricValues[0].value, 10);
    }

    return pageViews;
  } catch (error) {
    console.error("Error fetching data from Google Analytics:", error);
    throw new Error("Error fetching data from Google Analytics");
  }
}

module.exports = { getPageViewCount };
