import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Grid,TextArea,Select } from "semantic-ui-react";
import { push } from 'react-router-redux';
import axios from 'axios';

import BaseLayout from "../baseLayout";

import { addUser, setUpdatingUser, updateUser } from "../../actions/UserActions";


function validate(values) {
    var errors = {
        batch: {}
    };
 
    const { employee_nik, name, email, password, position, division, gender, address} = values;
    if (!employee_nik || (employee_nik + "").trim() === "") {
        errors.employee_nik= "NIK Pegawai Mohon Dilengkapi";
    }
    if (!name || name.trim() === "") {
        errors.name = "Nama Pegawai Mohon Dilengkapi";
    }
    if (!email || (email + "").trim() === "") {
        errors.email = "Email Mohon Dilengkapi";
    }
    if (!position) {
        errors.position= "Jabatan Mohon Dilengkapi";
    }
    if (!division) {
        errors.division= "Divisi Kerja Mohon Dilengkapi";
    }
    if (!gender) {
        errors.gender= "Jenis Kelamin Mohon Dilengkapi";
    }
    if (!address) {
        errors.address = "Alamat Mohon Dilengkapi";
    }
   
    return errors;
}

class UpdateUser extends Component {
    
    componentWillMount() {
        const idParam = this.props.location.pathname.split("/")[3]; // Hacky Way
        const { dispatch } = this.props;
        if (idParam) {
            dispatch(setUpdatingUser(idParam));
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
        console.log(values)
        if (values.id) {
            return dispatch(updateUser(values)).then(function (data) {
                dispatch(push("/user/"));
            });
        }
        else {
            return dispatch(addUser(values)).then(function (data) {
                dispatch(push("/user"));
            });
        }
    }
    render() {
        const { handleSubmit, pristine, initialValues, errors, submitting } = this.props;
        const { token, user, isLoggingIn, addingUserError } = this.props.user;
        let error = null;
        const genderOptions = [
            { key: 'Male', value: 'Male', text: 'Pria' },
            { key: 'Female', value: 'Female', text: 'Wanita' },
        ];

        const divisionOptions = [
            { key: 'Manajemen Direksi', value: 'Manajemen Direksi', text: 'Manajemen Direksi' },
            { key: 'HSE', value: 'HSE', text: 'HSE' },
            { key: 'Operasi dan Pemeliharaan', value: 'Operasi dan Pemeliharaan', text: 'Operasi dan Pemeliharaan' },
            { key: 'Keuangan', value: 'Keuangan', text: 'Keuangan' },
            { key: 'Warehouse', value: 'Warehouse', text: 'Gudang' },
        ];

        const positionOptions = [
            { key: 'Manajemen Direksi', value: 'Manajemen Direksi', text: 'Manajemen Direksi' },
            { key: 'HSE', value: 'HSE', text: 'HSE' },
            { key: 'Project Manager', value: 'Project Manager', text: 'Project Manager' },
            { key: 'Site Manager', value: 'Site Manager', text: 'Site Manager' },
            { key: 'Supervisor', value: 'Supervisor', text: 'Supervisor' },
            { key: 'Administrasi Keuangan', value: 'Administrasi Keuangan', text: 'Administrasi Keuangan' },
        ];
        if (addingUserError) {
            error = (
                <Message negative>
                    <Message.Header>Kesalahan saat menambahkan Pengguna, pastikan kembali Hak Akses telah sesuai.</Message.Header>
                    <p>{addingUserError}</p>
                </Message>
            )
        }
        let buttonText = null;
        if (user) {
            buttonText = "Perbarui Data";
        }
        else {
            buttonText = "Tambahkan Data";
        }
        return (
            <BaseLayout>
                <Segment >
                    <Header textAlign='center' as="h2">Formulir Registrasi Pegawai</Header>
                    {error}
                    <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} loading={isLoggingIn}>
                        <Form.Field>
                            <label>NIK Pegawai</label>
                            <Field name="employee_nik" placeholder="Masukkan NIK Pegawai" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <label>Nama Pegawai</label>
                            <Field name="name" placeholder="Masukkan Nama Pegawai" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <label>Email</label>
                            <Field name="email" placeholder="Masukkan Email Pegawai" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <label>Password</label>
                            <Field name="password" placeholder="Mohon Isikan Password Lama Anda" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <label>Divisi Kerja</label>
                            {/* <Select name="division" placeholder='Pilih Divisi Kerja Anda' options={divisionOptions} /> */}
                            <Field name="division" component="select" placeholder="Pilih Divisi Kerja">
                                <option></option>
                                <option value="Manajemen Direksi">Manajemen Direksi</option>
                                <option value="HSE">HSE</option>
                                <option value="Operasi dan Pemeliharaan">Operasi dan Pemeliharaan</option>
                                <option value="Keuangan">Keuangan</option>
                                <option value="Warehouse">Gudang</option>
                            </Field>
                        </Form.Field>
                        <Form.Field inline>
                            <label>Jabatan</label>
                            {/* <Select name="position" placeholder='Pilih Jabatan Anda' options={positionOptions} /> */}
                            <Field name="position" component="select" placeholder="Pilih Jabatan">
                                <option></option>
                                <option value="Manajemen Direksi">Manajemen Direksi</option>
                                <option value="HSE">HSE</option>
                                <option value="Project Manager">Project Manager</option>
                                <option value="Site Manager">Site Manager</option>
                                <option value="Supervisor">Supervisor</option>
                                <option value="Administrasi Keuangan">Administrasi Keuangan</option>
                            </Field>
                        </Form.Field>
                        <Form.Field inline>
                            <label>Jenis Kelamin</label>
                            {/* <Select name="gender" placeholder='Pilih Jenis Kelamin' options={genderOptions} /> */}
                            <Field name="gender" component="select" placeholder="Pilih Jenis Kelamin">
                                <option></option>
                                <option value="Male">Pria</option>
                                <option value="Female">Wanita</option>
                            </Field>
                        </Form.Field>
                        <Form.Field inline>
                            <label>Alamat</label>
                            <Field name="address" placeholder="Masukkan Alamat Lengkap" component={this.renderField}></Field>
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
    const initialValues = state.user.user;
    if (initialValues && initialValues.name && initialValues.name.en) {
        initialValues.name = initialValues.name.en;
        // initialValues.password = initialValues.passwordHash
    }
    return {
        initialValues: initialValues,
        auth: state.auth,
        user: state.user,
        location: state.router.location
    }
}

export default connect(mapStatesToProps)(reduxForm({
    form: "UpdateUser",
    validate
})(UpdateUser));