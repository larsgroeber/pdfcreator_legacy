// Name and version of the app, the former will be displayed
export const APP_NAME = 'PDFCreator';
export const APP_VERSION = '0.2.0';

////// DB //////
// URL to your mongodb installation including login data
export const MONGO_URL = 'mongodb://localhost/pdfcreator';

// Secret to encrypt the JWT with (can be anything)
export const AUTH_SECRET = 'YOUR_SECRET_HERE';

////// SERVER //////
// URL to the main site
export const SERVER_URL = 'http://localhost:4000';

// Root url of the page
export const ROOT_URL = '/';

// Root url for the express server, might be different form ROOT_URL e.g. if behind a proxy
export const ROOT_URL_EXPRESS = '/';

// Http Port on which the server should listen, leave empty (0) to disable http and only use https
export const PORT = 4000;

// Path to the folder where you want to save assets needed to compile latex documents
export const DATA_PATH = '/home/lars/Documents/programming/angular2Test/pdfcreator/data/latex/';

////// SSL //////
// Leave any of these empty if you do not need https
// Paths to private key and certificate
export const PRIVATE_KEY = '';
export const CERTIFICATE = '';

// Https Port
export const PORT_SSL = 3001;
