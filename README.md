# adnymics-task
This is adnymics task

## Project structure

There are two projects backend and frontend.

Backend project is a **Node JS**, REST API and it is connected to MySQL database, so **before running any application please make sure install MySQL if not available, start it, import the SQL file in 'adnymics' database.** The file is located in the project root directory.

### Backend project
This API application will use 8081 port and can only be changed from code, if it needs to be changed all the API URI call from the frontend should also be changed from file **(/frontend/src/components/files/api-call.js)**

All the API URIs are documented in a UI form with the help of Swagger, it can be found on :

```http://localhost:8081/api/docs```

With swagger UI, not only the APIs are documented it can also be tested.

I have also written test cases for the backend application. I have used 'chai' & 'mocha' test libraries to write test cases. The code is **/test/file-test.js** file

To run the test cases and application, make sure the database process is completed as mentioned above and change the directory to backend and execute following commands

```npm install .```

```npm test```

```nodemon index.js```

### Frontend project

The frontend application is develped in **React JS** and the UI is a combination of multiple components. I have created my own small text editor which will perform few functionality such as bold, italic, underline and changing font. (As I was not clear with the highlight.js)

The upload text file functionality will upload the text file to backend's 'uploads' directory and also saves the content of it in database.

User can also create new text file or else upload the existing, edit it and save it on server and also download it.

To run the frontend application, change directory to frontend and execute following command:

```npm start```

Please ignore the dockerfiles as I had little time left so did not perform that bonus task.

**It was really interesting task and I really enjoyed it.**

**Thank you.**
