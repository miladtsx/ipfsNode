const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yml');

app.listen(3000, () => {
    console.log('API started listening at 3000');
});

// app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.json({ limit: '1mb' }))

app.use('/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

const fileUpload = require('express-fileupload');
app.use(fileUpload());


app.use('/node', require('./node'));
app.use('/file', require('./file.js'));