import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Grid } from "semantic-ui-react";
import { push } from 'react-router-redux';
import axios from 'axios';

import BaseLayout from "../baseLayout";

import { addItem, setUpdatingItem, updateItem } from "../../actions/ItemActions";


function validate(values) {
    var errors = {
        batch: {}
    };
 
    const { item_name, item_merk, category, item_picture} = values;
    if (!item_name || item_name.trim() === "") {
        errors.item_name = "Nama Alat Kerja Mohon Dilengkapi";
    }
    if (!item_merk || (item_merk + "").trim() === "") {
        errors.item_merk = "Merk Alat Kerja Mohon Dilengkapi";
    }
    if (!category|| (category + "").trim() === "") {
        errors.category = "Kategori Mohon Dilengkapi";
    }
    if (!item_picture) {
        return errors.item_picture= "Gambar Alat Kerja Mohon Dilengkapi";
    }
   
    return errors;
}

class UpdateItem extends Component {

    constructor() {
        super();
        this.state = {
            item_picture: '',
            manual_book: ''
        }
        this.onChangeFileUpload = this.onChangeFileUpload.bind(this);
        this.onChangePictureUpload = this.onChangePictureUpload.bind(this);
    }
    
    componentWillMount() {
        const idParam = this.props.location.pathname.split("/")[3]; // Hacky Way
        const { dispatch } = this.props;
        if (idParam) {
            dispatch(setUpdatingItem(idParam));
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
        if (values.id) {
            return dispatch(updateItem(values)).then(function (data) {
                dispatch(push("/item/"));
            });
        }
        else {
            return dispatch(addItem(values)).then(function (data) {
                dispatch(push("/item"));
            });
        }
    }

    onChangePictureUpload(event) {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        axios.post('http://localhost:3000/items/uploads', formData, { onUploadProgress: true }).then(response => {
            this.setState({
                item_picture: response.data.path
            })
        }).catch(error => {
            console.log('Info: Come from error');
            console.log(error)
        }) 
    }

    onChangeFileUpload(event) {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        axios.post('http://localhost:3000/items/uploads', formData, { onUploadProgress: true }).then(response => {
            this.setState({
                manual_book: response.data.path
            })
        }).catch(error => {
            console.log('Info: Come from error');
            console.log(error)
        }) 
    }

    render() {
        const { handleSubmit, pristine, initialValues, errors, submitting } = this.props;
        const { token, user, isLoggingIn, addingItemError, item } = this.props.item;
        let error = null;
        if (addingItemError) {
            error = (
                <Message negative>
                    <Message.Header>Kesalahan saat menambahkan Alat Kerja, pastikan Hak Akses telah sesuai.</Message.Header>
                    <p>{addingItemError}</p>
                </Message>
            )
        }
        let buttonText = null;
        if (item) {
            buttonText = "Perbarui Data";
        }
        else {
            buttonText = "Tambahkan Data";
        }
        return (
            <BaseLayout >
                <Segment style={{ overflowY: scroll }}>
                    <Header textAlign='center' as="h2">Formulir Alat Kerja</Header>
                    {error}
                    <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} loading={isLoggingIn}>
                        <Form.Field inline>
                            <label>Nama Alat Kerja</label>
                            <Field name="item_name" placeholder="Masukkan Nama Alat Kerja" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <label>Merk Alat Kerja</label>
                            <Field name="item_merk" placeholder="Masukkan Merk Alat Kerja" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <label>Kategori</label>
                            <Field name="category" component="select" placeholder="Masukkan Kategori">
                                <option></option>
                                <option value="Alat Ringan">Alat Ringan</option>
                                <option value="Alat Berat">Alat Berat</option>
                                <option value="Kendaraan Operasional">Kendaraan Operasional</option>
                            </Field>
                        </Form.Field>
                        <Form.Field inline>
                            <label>Tanggal Pembelian</label>
                            <Field type="date" name="purchase_date" placeholder="Masukkan Tanggal Pembelian" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <label>Harga</label>
                            <Field name="price" placeholder="Masukkan Harga" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <label>Gambar Alat Kerja</label>
                            <Field name="item_picture" component={this.renderFieldFile} onChange={this.onChangePictureUpload}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <label>Unggah Buku Panduan (Scan PDF)</label>
                            <Field name="manual_book" component={this.renderFieldFile} onChange={this.onChangeFileUpload}></Field>
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
    const initialValues = state.item.item;
    if (initialValues && initialValues.item_name && initialValues.item_name.en) {
        initialValues.item_name = initialValues.item_name.en;
    }
    return {
        initialValues: initialValues,
        auth: state.auth,
        item: state.item,
        location: state.router.location
    }
}

export default connect(mapStatesToProps)(reduxForm({
    form: "UpdateItem",
    validate
})(UpdateItem));