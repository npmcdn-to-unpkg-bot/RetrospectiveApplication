/**
 * Created by nehat on 7/15/2016.
 */

import React from 'react';
import firebaseUtils from '../utils/firebaseUtils';
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import {Navbar, Nav,NavItem,Input,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
import * as scrumsActionCreator from '../actions/scrums/index';
import firebase from 'firebase';
import database from 'firebase/database';
import auth from 'firebase/auth';
import firebaseInit from '../firebase/firebaseInit';

import SignUpSignInPageHeader from './SignUpSignInPageHeader';

class LoginPage extends React.Component {

    constructor(){
        super();
        this.state = {
            loginEmail: null,
            loginPassword: null,
            error: false
        };
    }

    componentWillMount() {

        this.props.actions.windowSize();

        var firebaseRef = firebase.database().ref('retrospective-application/notes');
       // this.bindAsArray(firebaseRef.limitToLast(25), 'notes');

        this.firebaseRef = firebase.database().ref('retrospective-application/notes');

        this.firebaseRef.limitToLast(25).on('value', function (dataSnapshot) {
            var notes = [];
            dataSnapshot.forEach(function (childSnapshot) {
                var note = childSnapshot.val();
                note['.key'] = childSnapshot.key;
                notes.push(note);
            }.bind(this));

            this.setState({
                notes: notes
            });
        }.bind(this));
    }

    loginEmailIdChange(event){
        this.setState({loginEmail: event.target.value});
    }
    loginPasswordChange(event){
        this.setState({loginPassword: event.target.value});
    }

    callBack(res){
        console.log("callBack : ", res);
        alert('Login with email : ' + res.providerData[res.providerData.length -1].email);
        this.props.actions.loadPage('/ongoingRetro');
    }
    loginAccount(){
        var email = this.state.loginEmail;
        var password = this.state.loginPassword;
        firebaseUtils.signInUser({email: email, password: password}, this.callBack.bind(this));
    }

    render() {
        var {windowWidth,windowHeight} = this.props;
        var errors = this.state.error ? <p> {this.state.error} </p> : '';
        return (
            <div style={{textAlign: "center"}}>
                <Row style={{margin:"50px"}}>
                    <Col xs={4} md={4}> </Col>
                    <Col xs={4} md={4}>
                        <form className="login-form">
                            <FormGroup controlId="formControlsEmailId">
                                <FormControl type="email" placeholder="Email Id" onChange={this.loginEmailIdChange.bind(this)}/>
                            </FormGroup>
                            <FormGroup controlId="formControlsPassword">
                                <FormControl type="password" placeholder="Password" onChange={this.loginPasswordChange.bind(this)}/>
                            </FormGroup>
                            <Button type="submit" className="signUp-button" style={{backgroundColor: "#FF0000", width:"500px"}} onClick={this.loginAccount.bind(this)} >
                                <span style={{color:"#ffffff", fontSize:"18px"}}> <strong>Login</strong> </span>
                            </Button>
                            {errors}
                        </form>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    windowWidth: state.scrums.windowWidth,
    windowHeight: state.scrums.windowHeight
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(LoginPage);
