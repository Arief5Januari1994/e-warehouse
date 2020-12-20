import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Grid } from "semantic-ui-react";
import { push } from 'react-router-redux';
import axios from 'axios';

import BaseLayout from "../baseLayout";

import { addVehicleTax, setUpdatingVehicleTax, updateVehicleTax } from "../../actions/VehicleTaxActions";


function validate(values) {
    var errors = {
        batch: {}
    };
 
    const {vehicle_registration_number, name_of_owner, address, date_of_expire, estimated_tax, file } = values;
  
    if (!vehicle_registration_number || vehicle_registration_number.trim() === "") {
        errors.vehicle_registration_number = "Nomor Polisi Kendaran Mohon Dilengkapi";
    }
    if (!name_of_owner || (name_of_owner + "").trim() === "") {
        errors.name_of_owner = "Nama Pemilik Kendaraan Mohon Dilengkapi";
    }
    if (!address|| (address + "").trim() === "") {
        errors.address = "Alamat Mohon Dilengkapi";
    }
    if (!date_of_expire || date_of_expire.trim() === "") {
        errors.date_of_expire = "Tanggal Berlaku Mohon Dilengkapi";
    }
    if (!estimated_tax || (estimated_tax + "").trim() === "") {
        errors.estimated_tax = "Estimasi Pajak Kendaraan Mohon Dilengkapi";
    }
    if (!file) {
        return errors.file= "File STNK (Scan PDF) Mohon Dilengkapi";
    }
   
    return errors;
}

class UpdateVehicleTax extends Component {

    constructor() {
        super();
        this.state = {
            file: ''
        }
        this.onChangeFileUpload = this.onChangeFileUpload.bind(this);
    }
    
    componentWillMount() {
        const idParam = this.props.location.pathname.split("/")[3]; // Hacky Way
        console.log("ini id vehicle tx", idParam)
        const { dispatch } = this.props;
        if (idParam) {
            dispatch(setUpdatingVehicleTax(idParam));
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

    renderFieldFile({ input, meta: { touched, error }, ...custom }) {
        const hasError = touched && error !== undefined;
        delete input.value;
        return (
            <div>
                <Input type="file" error={hasError} fluid {...input} {...custom} />
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
       
       
    onSubmit(values, dispatch) {
        const { token } = this.props.auth;
        values.token = token;
        values = Object.assign(values, {...this.state})
        console.log(values)
        if (values.id) {
            return dispatch(updateVehicleTax(values)).then(function (data) {
                dispatch(push("/vehicleTax"));
            });
        }
        else {
            return dispatch(addVehicleTax(values)).then(function (data) {
                dispatch(push("/vehicleTax"));
            });
        }
    }

    onChangeFileUpload(event) {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        axios.post('http://localhost:3000/vehicleTax/uploads', formData, { onUploadProgress: true }).then(response => {
            this.setState({
                file: response.data.path
            })
        }).catch(error => {
            console.log('Info: Come from error');
            console.log(error)
        }) 
    }

    render() {
        const { handleSubmit, pristine, initialValues, errors, submitting } = this.props;
        const { token, user, isLoggingIn, addingVehicleTaxError, vehicleTax } = this.props.vehicleTax;
        let error = null;
        console.log('add vehicle tax')
        if (addingVehicleTaxError) {
            error = (
                <Message negative>
                    <Message.Header>Kesalahan saat menambahkan Pajak Kendaraan, pastikan kembali Hak Akses telah sesuai.</Message.Header>
                    <p>{addingVehicleTaxError}</p>
                </Message>
            )
        }
        let buttonText = null;
        if (vehicleTax) {
            buttonText = "Perbarui Data";
        }
        else {
            buttonText = "Tambah Data";
        }
        return (
            <BaseLayout>
                <Segment>
                    <Header textAlign='center' as="h2">Formulir Pajak Kendaraan</Header>
                    {error}
                    <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} loading={isLoggingIn}>
                        <Form.Field inline>
                            <label>Nomor Polisi Kendaraan</label>
                            <Field name="vehicle_registration_number" placeholder="Masukkan Nomor Polisi Kendaraan" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <label>Nama Pemilik</label>
                            <Field name="name_of_owner" placeholder="Masukkan Nama Pemilik" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <label>Alamat</label>
                            <Field name="address" placeholder="Masukkan Alamat Lengkap" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field >
                            <label>Berlaku Sampai Dengan</label>
                            <Field type= "date" name="date_of_expire" placeholder="Masukkan Tanggal Berlaku Pajak Kendaraan" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <label>Estimasi Pajak</label>
                            <Field name="estimated_tax" placeholder="Masukkan Taksiran Pajak" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <label>Unggah STNK Kendaraan (Scan PDF)</label>
                            <Field name="file" component={this.renderFieldFile} onChange={this.onChangeFileUpload}></Field>
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
    const initialValues = state.vehicleTax.vehicleTax;
    console.log('ini containers',state.vehicleTax)
    return {
        initialValues: initialValues,
        auth: state.auth,
        vehicleTax: state.vehicleTax,
        location: state.router.location
    }
}

export default connect(mapStatesToProps)(reduxForm({
    form: "UpdateVehicleTax",
    validate
})(UpdateVehicleTax));