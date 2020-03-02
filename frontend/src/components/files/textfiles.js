import React, { Component } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { getFileList, fileUpload, fileDownload, fileEdit, fileSave, fileSearch } from './api-call'
import './style.css'
import Editor from '../textarea/editor'
class TextFiles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadedFiles : [],
            textarea: '',
            search: '',
            edit_file_id: '',
            edit_file_name: '',
            edit_file_title: '',
            successMessage: '',
            errorMessage: ''
        }
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleOnSearch = this.handleOnSearch.bind(this)
        this.getUploadedFiles = this.getUploadedFiles.bind(this)
        this.getFileOnSearch = this.getFileOnSearch.bind(this)
        this.onTextAreaSubmit = this.onTextAreaSubmit.bind(this)
    }

    componentDidMount(){
        this.getUploadedFiles()
    }

    handleOnChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleOnSearch(e){
        this.setState({
            search: e.target.value
        }, () => { this.getFileOnSearch()})
    }

    onUploadFile(e){
        fileUpload(e.target.files[0], 'Description')
            .then(res => {
                if(res.status === 201){
                    this.setState({
                        successMessage: res.data.message
                    }, () => this.getUploadedFiles())
                }else{
                    this.setState({
                        errorMessage: res.data.message
                    })
                }
            })
            .catch(err => {
                console.log('error')
            })
    }

    getFileOnSearch(){
        fileSearch(this.state.search)
            .then(res => {
                this.setState({
                    uploadedFiles: res.data.files
                })
            })
            .catch(err => {

            })
    }

    getUploadedFiles(){
        getFileList()
            .then(res => {
                if(res.status === 200){
                    this.setState({
                        uploadedFiles: res.data.files
                    })
                }else {
                    this.setState({
                        errorMessage:res.data.messagge
                    })
                }
            })
            .catch(err => {
                this.setState({
                    errorMessage: 'something is wrong'
                })
            })
    }

    onEditTextFile(file){
        fileEdit(file)
            .then(res => {
                if(res.status === 200){
                    this.setState({
                        edit_file_id: res.data.file.id,
                        edit_file_name: res.data.file.name,
                        edit_file_title:res.data.file.title,
                        textarea: res.data.file.content
                    }, () => { document.querySelector(".editor").innerHTML = this.state.textarea})
                }
                
            })
            .catch(err => {

            })
    }

    onDownloadTextFile(file){
        fileEdit(file)
            .then(res => {
                var ele = document.createElement("a");
                var file = new Blob([res.data.file.content], {type: 'text/plain'});
                ele.href = URL.createObjectURL(file);
                ele.download = res.data.file.name+".txt";
                document.body.appendChild(ele);
                ele.click();
            })
            .catch(err => {
                this.setState({
                    errorMessage: err
                })
            })
    }

    onTextAreaSubmit(){

        this.setState({
            textarea: document.querySelector(".editor").innerHTML
        }, () => {
            if(this.state.edit_file_name !== '' && this.state.edit_file_title !== '' && this.state.textarea !== ''){
                fileSave(this.state.edit_file_id, this.state.edit_file_name, this.state.edit_file_title, this.state.textarea)
                .then(res => {
                    if(res.status === 200){
                        this.setState({
                            successMessage: res.data.message
                        }, () => this.getUploadedFiles())
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            }else{
                this.setState({
                    errorMessage: 'Please fill all data'
                })
            }
        })
    }

    render() {
        console.log(this.state)
        var uploadedFiles = []
        this.state.uploadedFiles.map(file => {
            uploadedFiles.push(
                <div key={file.id}>
                    <Row >
                        <Col md="1">
                            <span class="fa fa-file-o" style={{fontSize:"25px"}}></span>
                        </Col>
                        <Col md="3" style={{textAlign:'left'}}>
                            {file.name}
                        </Col>
                        <Col md="3" style={{textAlign:'left'}}>
                            {file.title}
                        </Col>
                        <Col md="5" style={{textAlign:'right'}}>
                            <Button onClick={this.onEditTextFile.bind(this, file)}>Edit</Button>
                            &nbsp;&nbsp;
                            <Button onClick={this.onDownloadTextFile.bind(this, file)}>Download</Button>
                        </Col>
                    </Row>
                    <hr/>
                    <br />
                </div>
                
            )
        })
        return (
             <Container>
                 <br/><br/><br/>
                    <Row className="searchArea">
                        <div >
                            <form>
                                <input type="text" name="search" placeholder="search" onChange={this.handleOnSearch}/>
                            </form>
                        </div>
                    </Row>
                    <p>Your files</p>
                    {uploadedFiles}
                 <form className="upload-parent"> 
                    <div >
                        <button className="upload-button">Upload a file</button>
                        <input type="file" accept=".txt" onChange={this.onUploadFile.bind(this)} />
                    </div>
                 </form>
                 
                 <br/><br/>
                 <Editor edit_file_name={this.state.edit_file_name} edit_file_title={this.state.edit_file_title} onTextAreaSubmit={this.onTextAreaSubmit} handleOnChange={this.handleOnChange}/>
                 <br/><br/><br/>
             </Container>
        ) 
    }
}

export default TextFiles