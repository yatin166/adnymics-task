import React, { Component } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import './editor.css'
import Toolbar from './toolbar'
class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        
        return (

            <Form>
                    <Form.Group>
                        <Form.Control
                            required
                            type="text"
                            placeholder="File name"
                            name="edit_file_name"
                            value={this.props.edit_file_name}
                            onChange={this.props.handleOnChange}
                            className="inputs"
                        />
                    </Form.Group>
                    <Form.Group >
                        <Form.Control
                            required
                            type="text"
                            placeholder="File title"
                            name="edit_file_title"
                            value={this.props.edit_file_title}
                            onChange={this.props.handleOnChange}
                            className="inputs"
                        />
                    </Form.Group>
                    <div>
                        <Toolbar />
                        <div className="editor" contentEditable>
                        </div>
                    </div>
                    <br/>
                     <Button style={{float:'right'}} type="submit" onClick={this.props.onTextAreaSubmit} >Submit</Button> 
                 </Form>
                 
        ) 
    }
}

export default Editor