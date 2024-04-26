# Puppeteer_Project

This documentation backend (including the Node.js server and database connection) is deployed on Railway, and the frontend (including Swagger documentation) is deployed on a separate platform Vercel.

##API Endpoint
The API endpoint for retrieving paginated posts is:

```https://puppeteerproject-production.up.railway.app/api/v1/posts```


page: The desired page number (defaults to 1).
limit: The number of posts per page (defaults to 10).

The API returns a JSON response containing an array of post objects. Each post object has the following properties:

id: Unique identifier for the post (integer)
text: Text content of the tweet (string)
image: URL of the tweet image (string, if available)
video: URL of the tweet video (string, if available)

##Accessing Swagger Documentation
The Swagger documentation for API exploration is deployed on a separate platform Vercel. You can find the URL in your Vercel project dashboard. The documentation provides an interactive interface to explore available API endpoints, parameters, and responses.

```https://puppeteer-project-fawn.vercel.app//swagger.json```

##NB: If you run into an Error Then free trial for browserless integration on railway has Expired then. Please do not fail to reach out for guidance
