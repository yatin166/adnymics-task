var express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer');
var fs = require('fs');
var swaggerJsDoc = require('swagger-jsdoc')
var swaggerui = require('swagger-ui-express')
const path = require('path');
var cors = require('cors')
var con = require('./mysql_connection')

var app = express()
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
   
var upload = multer({ storage: storage }).single('textfile')


const swagger = {
    swaggerDefinition:{
        info:{
            title: 'Adnymics app API',
            description:'This is a text editor API',
            contact:{
                name:'Text Editor'
            },
            servers: ["http://localhost:5000"]
        }
    },
    apis:["index.js"]
}

const swaggerDocument = swaggerJsDoc(swagger);
app.use('/api/docs',swaggerui.serve, swaggerui.setup(swaggerDocument))

app.get('/',(req,res) => {
    res.json({
        message:'API Running'
    })
})

/**
 * @swagger
 * /file/list:
 *  get:
 *      description: This URI will return the list of all uploaded/created text files
 *      responses:
 *          '200':
 *              description: Returns the array of objects
 *          '400':
 *              description: Server processing error
 */
app.get('/file/list', (req,res) => {
    var query = "SELECT id, name, title FROM textfiles"
    con.query(query, function (err, result) {
        if (err){
            return res.status(400).json({
                message:'Server processing error'
            })
        };
        res.status(200).json({
            files: result
        })
    })
})

/**
 * @swagger
 * /file/upload:
 *  post:
 *      summary: Upload file
 *      consumes:
 *          - multipart/form-data
 *      parameters:
 *        - in: formData
 *          name: textfile
 *          type: file
 *          description: (required) Uploads the file and saves the content in database
 *      responses:
 *          '201':
 *              description: File uploaded successfully in database
 *          '400':
 *              description: Server processing error
 */
app.post('/file/upload', (req, res) => {
    upload(req, res, function(err) {
        if(err){
            console.log('Error in uploading ' + err)
            return res.status(400).json({
                message:'Error in uploading'
            })
        }
        var file_name = path.parse(req.file.originalname).name
        var file_title = 'Uploaded file'
        var file_content = fs.readFileSync('./uploads/'+req.file.originalname, 'utf8').toString()
        var query = "INSERT INTO textfiles (name, title, content) values(?, ?, ?)"
        con.query(query, [file_name, file_title, file_content], function (err, result) {
            if (err){
                return res.status(400).json({
                    message:'Server processing error'
                })
            };
            res.status(201).json({
                message:'File uploaded successfully'
            })
        })
    })
})


/**
 * @swagger
 * /file/save:
 *  post:
 *      summary: Save the content of the file, create new if not available else update the existing
 *      consumes:
 *          - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: file_id
 *          type: number
 *          description: (optional) Provide id of the file if updationg is required, if not provided new text file will be created
 *        - in: formData
 *          name: file_name
 *          type: string
 *          description: (required) Provide file name to be updated or created
 *        - in: formData
 *          name: file_title
 *          type: string
 *          description: (required) Provide file title to be updated or created
 *        - in: formData
 *          name: file_content
 *          type: string
 *          description: (required) Provide file content to be updated or created
 *      responses:
 *          '200':
 *              description: File saved successfully
 *          '400':
 *              description: Server processing error
 */
app.post('/file/save', (req, res) => {
    
    var id = req.body.file_id
    var name = req.body.file_name
    var title = req.body.file_title
    var content = req.body.file_content

    var selectQuery = "SELECT * FROM textfiles WHERE name = ?"
    con.query(selectQuery, [name, title, content], function (err, result) {
        if (err){
            console.log(err)
            return res.status(400).json({
                message:'Server processing error'
            })
        };

        var query = ''
        var args = []
        if(result.length == 0){
            //insert new
            var query = "INSERT INTO textfiles (name, title, content) values(?, ?, ?)"
            args = [name, title, content]
        } else if (result.length == 1){
            //update existing record
            var query = "UPDATE textfiles SET name = ?, title = ?, content = ? WHERE id = ?"
            args = [name, title, content, id]
        }

        
        con.query(query, args, function (err, result) {
            if (err){
                console.log(err)
                return res.status(400).json({
                    message:'Server processing error'
                })
            };
            console.log('Saved')
            res.status(200).json({
                message:'File saved successfully'
            })
        })

        
        
    })
})

/**
 * @swagger
 * /file/{id}/content:
 *  get:
 *      summary: This URI will return the content of the given file id (Can be used to edit the text and download the file)
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: integer
 *          required: true
 *          description: ID of the file
 *      responses:
 *          '200':
 *              description: Returns the content of file
 *          '400':
 *              description: Server processing error
 */
app.get('/file/:id/content', (req,res) => {
    var file_id = req.params.id
    var query = "SELECT * FROM textfiles WHERE id = ?"
    con.query(query, [file_id], function (err, result) {
        if (err){
            console.log(err)
            return res.status(400).json({
                message:'Server processing error'
            })
        };
        res.status(200).json({
            file: result[0]
        })
    })
})


/**
 * @swagger
 * /file/search:
 *  post:
 *      summary: Search the file from file name
 *      consumes:
 *          - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: file_name
 *          type: string
 *          description: (required) Provide file name to be searched
 *      responses:
 *          '200':
 *              description: Array of objects of searched files
 *          '400':
 *              description: Server processing error
 */
app.post('/file/search', (req,res) => {
    var file_name = "%" + req.body.name + "%"
    var query = "SELECT * FROM textfiles WHERE name LIKE ?"
    con.query(query, [file_name], function (err, result) {
        if (err){
            console.log(err)
            return res.status(400).json({
                message:'Server processing error'
            })
        };
        res.status(200).json({
            files: result
        })
    })
})

app.listen('8081', () => {
    con.connect(function(err) {
        if (err) {
            console.log("Not connected")
        }
        console.log("Connected!");
    });
    console.log('App listening on 8081')
})

module.exports = app