import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Grid,Image } from "semantic-ui-react";
import { push } from 'react-router-redux';

import { loginUser } from "./../../actions/AuthActions";

function validate(values) {
    var errors = {};
    const { email, password } = values;
    if (!email || email.trim() === "") {
        errors.email = "Email Mohon Dilengkapi";
    }
    if (!password || password.trim() === "") {
        errors.password = "Password Mohon Dilengkapi";
    }
    return errors;
}

class Login extends Component {
    componentWillMount() {
        const { token } = this.props.auth;
        const { dispatch } = this.props;
        if (token) {
            dispatch(push("/item"));
        }
    }
    renderField({ input, meta: { touched, error }, ...custom }) {
        const hasError = touched && error !== undefined;
        return (
            <div>
                <Input type="text" error={hasError} fluid {...input} {...custom} />
                {hasError && <Label basic color="red" pointing>{error}</ Label>}
            </div>
        )
    }
    onSubmit(values, dispatch) {
        return dispatch(loginUser(values)).then(function (data) {
            dispatch(push("/item"));
        });
    }
    render() {
        const { handleSubmit, pristine, initialValues, errors, submitting } = this.props;
        const { token, user, isLoggingIn, loggingInError } = this.props.auth;
        let error = null;
        if (loggingInError) {
            error = (
                <Message negative>
                    <Message.Header>Kesalahan saat Login</Message.Header>
                    <p>{loggingInError}</p>
                </Message>
            )
        }
        return (
            <Segment textAlign='center'>
                <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                    Login e-Warehouse
                </Header>
                {error}
                <Segment stacked>
                <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} loading={isLoggingIn}>
                    <Form.Field inline>
                        <Field name="email" placeholder="Masukkan Email" component={this.renderField}></Field>
                    </Form.Field>
                    <Form.Field inline>
                        <Field name="password" type="password" placeholder="Masukkan Password" component={this.renderField}></Field>
                    </Form.Field>
                    <Button color='teal' loading={submitting} disabled={submitting} fluid size='large'>Login</Button>
                </Form>
                </Segment>
                </Grid.Column>
                </Grid>
            </Segment>
        )
    }
}

function mapStatesToProps(state) {
    return {
        auth: state.auth
    }
}

export default reduxForm({
    form: "Login",
    validate
})(connect(mapStatesToProps)(Login));