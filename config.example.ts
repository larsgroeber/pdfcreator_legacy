
// Root url of the page
export const ROOT_URL = '/';

// Root url for the express server, might be different form ROOT_URL e.g. if behind a proxy
export const ROOT_URL_EXPRESS = '/';

// Http Port on which the server should listen, leave empty (0) to disable http and only use https
export const PORT = 3000;

// Path to the folder where you want to save assets needed to compile latex documents
export const DATA_PATH = '/home/lars/Documents/programming/angular2Test/pdfcreator/data/latex/';

// URL to the backend
export const SERVER_URL = 'http://localhost:3000';

////// SSL //////
// Paths to private key and certificate, leave empty if you do not need https
export const PRIVATE_KEY = '';
export const CERTIFICATE = '';

// Https Port
export const PORT_SSL = 3001;
