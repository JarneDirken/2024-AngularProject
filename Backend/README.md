# TripPlannerBackendExample
- Create an account on [https://auth0.com/](https://auth0.com/)
- Create a new API (Applications)
  - Use as identifier the url of the API when you run it locally, e.g. https://localhost:6587
  - Add this url to the ValidAudiences array in appsettings.json
- Get the domain url that Auth0 created for you (creating a new default single page application uses this domain by default)
- Add this domain url to the Authority and ValidIssuer property in appsettings.json
