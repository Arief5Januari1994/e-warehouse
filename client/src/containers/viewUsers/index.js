import React, { Component, useReducer } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Popup, Grid } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "../baseLayout";

import { getUsers, deleteUser } from "./../../actions/UserActions";

class AddUser extends Component {
    componentWillMount() {
        const { token, dispatch } = this.props;
        dispatch(getUsers({ token: token }));
    }
    onPressEdit(user) {
        console.log('ini user edit', user);
        const { dispatch } = this.props;
        dispatch(push("/user/update/" + user.id));
    }
    onPressDelete(user) {
        const { token, dispatch } = this.props;
        dispatch(deleteUser({ token: token, user: user })).then(function (data) {
            dispatch(getUsers({ token: token }));
        });
        console.log('delete')
    }
    render() {
        const { users, isFetchingUsers, fetchingUsersError, deletingsUsersError } = this.props.user;
        let error = null;
        if (fetchingUsersError || deletingsUsersError) {
            error = (
                <Message negative>
                    <Message.Header>Kesalahan saat mengambil Data Pengguna, pastikan kembali Hak Akses telah sesuai.</Message.Header>
                    <p>{fetchingUsersError}</p>
                    <p>{deletingsUsersError}</p>
                </Message>
            )
        }
        let row = 1;
        const usersView = users.map(function (user) {
            return (
                <Table.Row key={user.id}>
                    <Table.Cell textAlign='center'>{row++}</Table.Cell>
                    <Table.Cell>{user.employee_nik}</Table.Cell>
                    <Table.Cell>{user.name.en}</Table.Cell>
                    <Table.Cell textAlign='center'>{user.gender}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell textAlign='center'>{(user.division === 'Warehouse' ? 'Gudang' : user.division)}</Table.Cell>
                    <Table.Cell textAlign='center'>{user.position}</Table.Cell>
                    <Table.Cell>{user.address}</Table.Cell>
                    <Table.Cell>
                        {/* <Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this,user)} /> */}
                        {/* <Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, user)} /> */}

                        <Popup
                            trigger={<Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, user)} />}
                            content='Hapus Data'
                            on='hover'
                        />
                        <Popup
                            trigger={<Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, user)} />}
                            content='Ubah Data'
                            on='hover'
                        />
                        
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        let tableView = <h4>Data Pegawai Tidak Ditemukan. Mohon Tambahkan Beberapa Data</h4>
        if (users.length > 0) {
            tableView = (
                <Table striped celled>
                    <Table.Header>
                        <Table.Row textAlign='center'>
                            <Table.HeaderCell >No</Table.HeaderCell>
                            <Table.HeaderCell width={2}>NIK Pegawai</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Nama Pegawai</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Jenis Kelamin</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Email</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Divisi Kerja</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Jabatan</Table.HeaderCell>
                            <Table.HeaderCell width={4}>Alamat</Table.HeaderCell>
                            <Table.HeaderCell >Pilihan</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {usersView}
                    </Table.Body>
                </Table>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center' >
                    <Header as="h2">Daftar Pegawai</Header>
                    {error}
                    {/* <Segment loading={isFetchingItems}> */}
                    {tableView}
                    {/* </Segment> */}
                </Segment>
            </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    return {
        token: state.auth.token,
        user: state.user
    }
}

export default connect(mapStatesToProps)(AddUser);