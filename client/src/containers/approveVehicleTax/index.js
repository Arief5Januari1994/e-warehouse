import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Button, Popup, Grid } from "semantic-ui-react";
import { push } from 'react-router-redux';
import Moment from 'moment';

import BaseLayout from "../baseLayout";

import { getPendingVehicleTaxs, approveVehicleTax } from "./../../actions/VehicleTaxActions";

class ApproveVehicleTax extends Component {
    componentWillMount() {
        const { token, dispatch } = this.props;
        dispatch(getPendingVehicleTaxs({ token: token }));
    }
    onPressApprove(vehicleTax) {
        const { token, dispatch } = this.props;
        dispatch(approveVehicleTax({ token: token, vehicleTax: vehicleTax })).then(function (data) {
            dispatch(push("/vehicleTax"));
        });
    }
    render() {
        const { pendingVehicleTaxs, isFetchingVehicleTaxs, fetchingVehicleTaxsError, deletingsVehicleTaxsError } = this.props.vehicleTax;
        let error = null;
        if (fetchingVehicleTaxsError || deletingsVehicleTaxsError) {
            error = (
                <Message negative>
                    <Message.Header>Kesalahan saat mengambil Data Pajak Kendaraan, pastikan kembali Hak Akses telah sesuai.</Message.Header>
                    <p>{fetchingVehicleTaxsError}</p>
                    <p>{deletingsVehicleTaxsError}</p>
                </Message>
            )
        }
        const vehicleTaxsView = pendingVehicleTaxs.map(function (vehicleTax) {
            // const latestHistory = getLatestHistory(vehicleTax);
            // let operationText = null;
            // switch (latestHistory.action) {
            //     case "created": {
            //         operationText = "Creation";
            //         break;
            //     }
            //     case "updated": {
            //         operationText = "Updation";
            //         break;
            //     }
            //     case "removed": {
            //         operationText = "Removal";
            //         break;
            //     }
            // }
            let row = 1;
            return (
                <Table.Row key={vehicleTax.id}>
                    <Table.Cell textAlign='center'>{row++}</Table.Cell>
                    <Table.Cell>{vehicleTax.vehicle_code}</Table.Cell>
                    <Table.Cell textAlign='center'>{vehicleTax.vehicle_registration_number}</Table.Cell>
                    <Table.Cell>{vehicleTax.name_of_owner}</Table.Cell>
                    <Table.Cell>{vehicleTax.address}</Table.Cell>
                    <Table.Cell textAlign='center'>{Moment(vehicleTax.date_of_expire).format('DD-MMMM-YYYY')}</Table.Cell>
                    <Table.Cell textAlign='right'>{vehicleTax.estimated_tax}</Table.Cell>
                    <Table.Cell>{vehicleTax.status}</Table.Cell>
                    <Table.Cell >
                        {/* <Button color='green' onClick={this.onPressApprove.bind(this, vehicleTax)}>Approve</Button> */}

                        <Popup
                            trigger={
                                <Button content='Approve' color='blue' onClick={this.onPressApprove.bind(this, vehicleTax)}/>
                            }
                            content='Persetujuan Pajak Kendaraan'
                            on='hover'
                        />

                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        let tableView = <h4>Data Persetujuan Pajak Kendaraan Tidak Ditemukan. Harap Tambahkan Beberapa Data.</h4>
        if (pendingVehicleTaxs.length > 0) {
            tableView = (
                <Table celled striped>
                    <Table.Header>
                        <Table.Row textAlign='center'>
                            <Table.HeaderCell >No</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Kode Pengajuan</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Nomor Polisi</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Nama Pemilik</Table.HeaderCell>
                            <Table.HeaderCell width={4}>Alamat</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Berlaku Sampai Dengan</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Estimasi Pajak</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Status</Table.HeaderCell>
                            <Table.HeaderCell>Pilihan</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {vehicleTaxsView}
                    </Table.Body>
                </Table>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center' >
                    <Header as="h2">Daftar Pajak Kendaraan</Header>
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
        vehicleTax: state.vehicleTax
    }
}

export default connect(mapStatesToProps)(ApproveVehicleTax);