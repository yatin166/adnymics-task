import React, { Component } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import './editor.css'
class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFont: ''
        }

        this.handleOnChange = this.handleOnChange.bind(this)
    }

    onToolbarButtonClick(name){
        document.execCommand(name, false, '');
    }

    handleOnChange(e){
        document.execCommand("fontName", false, e.target.value);
    }

    render() {
        return (
                    <div>
                        <div className="toolbar">
                            <button type="button" onClick={this.onToolbarButtonClick.bind(this,'underline')}><u>U</u>
                            </button>
                            <button type="button" onClick={this.onToolbarButtonClick.bind(this,'italic')}><i>I</i>
                            </button>
                            <button type="button" onClick={this.onToolbarButtonClick.bind(this,'bold')}><b>B</b>
                            </button>
                            <select name="fontName" onChange={this.handleOnChange}>
                                <option value="Arial">Arial</option>
                                <option value="Calibri">Calibri</option>
                                <option value="Comic Sans MS">Comic Sans MS</option>
                            </select>
                        </div>
                    </div>
            

        ) 
    }
}

export default Toolbar