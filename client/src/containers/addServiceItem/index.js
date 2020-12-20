import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Grid, Select, Dropdown } from "semantic-ui-react";
import { push } from 'react-router-redux';
import axios from 'axios';

import BaseLayout from "../baseLayout";

import { addServiceItem, setUpdatingServiceItem, updateServiceItem } from "./../../actions/ServiceItemActions";


function validate(values) {
    var errors = {
        batch: {}
    };
 
    const { start_service_date, item_id} = values;

    if (!start_service_date || (start_service_date + "").trim() === "") {
        errors.start_service_date= "Tanggal Mulai Service Mohon Dilengkapi";
    }
    if (!item_id) {
        errors.item_id= "Nama Alat Kerja Mohon Dilengkapi";
    }
   
    return errors;
}

class AddServiceItem extends Component {
    constructor() {
        super();
        this.state = {
            items: []
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        const idParam = this.props.location.pathname.split("/")[2]; // Hacky Way
        const { dispatch,token } = this.props;
        if (idParam !== "add") {
            dispatch(setUpdatingServiceItem(idParam));
        }
    }
    
    componentDidMount() {
        const { token } = this.props;
        axios.get('http://localhost:3000/items/available',
      {headers: {
        Authorization : token
      }
      })
      .then(response => {
        this.setState({ items: response.data });
      })
      .catch(error => console.log(error.response));
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

    renderSelectField({ input, meta: { touched, error }, ...custom }){
        const hasError = touched && error !== undefined;
        return (
            <div>
                <Select error={hasError} fluid {...input} {...custom} />
                {hasError && <Label basic color="red" pointing>{error}</ Label>}
            </div>
        )
    }

    handleChange(event) {
        this.setState({value: event.target.data});
        console.log('Info: Come from handleChange');
        console.log(this.state);
      }
       
       
    onSubmit(values, dispatch) {
        const { token } = this.props.auth;
        values.token = token;
        values = Object.assign(values, {...this.state})
        console.log(values)
        if (values.id) {
            return dispatch(updateServiceItem(values)).then(function (data) {
                dispatch(push("/serviceItem"));
            });
        }
        else {
            return dispatch(addServiceItem(values)).then(function (data) {
                dispatch(push("/serviceItem"));
            });
        }
    }

    render() {
        const { handleSubmit, pristine, initialValues, errors, submitting } = this.props;
        const { token, user, isLoggingIn, addingServiceItemError, serviceItem } = this.props.serviceItem;
        let error = null;

        let items = this.state.items; 
        if (addingServiceItemError) {
            error = (
                <Message negative>
                    <Message.Header>Kesalahan saat menambahkan perbaikan Alat Kerja, pastikan Hak Akses telah sesuai</Message.Header>
                    <p>{addingServiceItemError}</p>
                </Message>
            )
        }
        let buttonText = null;
        if (serviceItem) {
            buttonText = "Perbarui Data";
        }
        else {
            buttonText = "Tambahkan Data";
        }
        return (
            <BaseLayout>
                <Segment>
                    <Header textAlign='center' as="h2">Formulir Perbaikan Alat Kerja</Header>
                    {error}
                    <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} loading={isLoggingIn}>
                    <Form.Field>
                            <label>Tanggal Mulai Perbaikan</label>
                            <Field type="date" name="start_service_date" placeholder="Masukkan Tanggal Mulai Perbaikan" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <label>Nama Alat Kerja</label>
                            {/* <Field name="item_name" placeholder="Masukkan Nama Alat Kerja" component={this.renderField}></Field> */}
                            <Field name= 'item_id' component="select" >
                            <option></option>
                            {items.map((item) => (
                                    <option key={item.id} value={item.id}>{item.item_name.en}</option>
                            ))}
                            </Field>
                        </Form.Field>
                        <Grid>
                        <Grid.Column textAlign="center">
                        <Button primary loading={submitting} disabled={submitting}>{buttonText}</Button>
                        </Grid.Column>
                        </Grid>
                    </Form>
                </Segment>
            </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    const initialValues = state.serviceItem.serviceItem;
    return {
        initialValues: initialValues,
        auth: state.auth,
        serviceItem: state.serviceItem,
        location: state.router.location,
        token: state.auth.token,

    }
}

export default connect(mapStatesToProps)(reduxForm({
    form: "AddServiceItem",
    validate
})(AddServiceItem));