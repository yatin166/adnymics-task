const expect = require('chai').expect
const req = require('supertest')
const fs = require('fs')
const path = require('path')
const app = require('../index.js')
const con = require('../mysql_connection')

describe('Checking all REST endpoints', () => {

    it('SUCCESS, getting list of files', (done) => {
        req(app).get('/file/list')
            .then((res) => {
                expect(res.body).to.contain.property('files')
                done()
            })
    })

    it('Success, Upload file', 
        async () => {
            const res = await req(app).post('/file/upload').attach('textfile',path.resolve(__dirname, './sample-test.txt'))
            expect(res.status).to.equal(201)
            expect(res.body).to.have.property('message')
        }
    )

    it('SUCCESS, saving a file content', (done) => {
        req(app).post('/file/save')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                file_id: 1,
                file_name: 'sample-test',
                file_title: 'sample file title',
                file_content: 'This is a sample text file for the test cases that initially ececuted during the start of the application.'
            })
            .then((res) => {
                expect(res.status).to.equal(200)
                expect(res.body).to.contain.property('message')
                done()
            })
    })

    it('SUCCESS, getting a file content', (done) => {
        req(app).get('/file/1/content')
            .then((res) => {
                expect(res.status).to.equal(200)
                expect(res.body).to.contain.property('file')
                done()
            })
    })

    it('Success, search file', 
        async () => {
            const res = await req(app).post('/file/search').set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                name: 'samp'
            });
            expect(res.status).to.equal(200)
            expect(res.body).to.have.property('files')
        }
    )
})



/* /file/list
/file/upload
/file/save
/file/:id/content (GET)
/file/search */