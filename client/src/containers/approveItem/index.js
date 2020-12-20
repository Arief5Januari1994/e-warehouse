import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Popup, Grid } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "../baseLayout";

import { getPendingItems, approveItem } from "./../../actions/ItemActions";

class ApproveItem extends Component {
    componentWillMount() {
        const { token, dispatch } = this.props;
        dispatch(getPendingItems({ token: token }));
    }
    onPressApprove(item) {
        const { token, dispatch } = this.props;
        dispatch(approveItem({ token: token, item: item })).then(function (data) {
            dispatch(push("/item"));
        });
    }
    render() {
        const { pendingItems, isFetchingItems, fetchingItemsError, deletingsItemsError } = this.props.item;
        let error = null;
        if (fetchingItemsError || deletingsItemsError) {
            error = (
                <Message negative>
                    <Message.Header>Kesalahan saat mengambil Approve Alat Kerja, pastikan Hak Akses telah sesuai.</Message.Header>
                    <p>{fetchingItemsError}</p>
                    <p>{deletingsItemsError}</p>
                </Message>
            )
        }
        const itemsView = pendingItems.map(function (item) {
            const latestHistory = getLatestHistory(item);
            let operationText = null;
            switch (latestHistory.action) {
                case "created": {
                    operationText = "Creation";
                    break;
                }
                case "updated": {
                    operationText = "Updation";
                    break;
                }
                case "removed": {
                    operationText = "Removal";
                    break;
                }
            }
            return (
                <Table.Row key={item.id}>
                    <Table.Cell>{item.item_code}</Table.Cell>
                    <Table.Cell>{item.item_name.en}</Table.Cell>
                    <Table.Cell>{operationText}</Table.Cell>
                    <Table.Cell>{item.status}</Table.Cell>
                    <Table.Cell >
                        {/* <Icon name='checkmark' size='large' onClick={this.onPressApprove.bind(this, item)} /> */}

                        <Popup
                            trigger={<Icon name='checkmark' size='large' onClick={this.onPressApprove.bind(this, item)} />}
                            content='Approve Data'
                            on='hover'
                        />

                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        let tableView = <h4>Data Perbaikan Alat Kerja Tidak Ditemukan. Harap Tambahkan Beberapa Data Yang Lain.</h4>
        if (pendingItems.length > 0) {
            tableView = (
                <Table celled fixed>
                    <Table.Header>
                        <Table.Row textAlign='center'>
                            <Table.HeaderCell>Kode Alat Kerja</Table.HeaderCell>
                            <Table.HeaderCell>Nama Alat Kerja</Table.HeaderCell>
                            <Table.HeaderCell>Operasi</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Pilihan</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {itemsView}
                    </Table.Body>
                </Table>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center' >
                    <Header as="h2">Daftar Alat Kerja</Header>
                    {error}
                    {/* <Segment loading={isFetchingItems}> */}
                    {tableView}
                    {/* </Segment> */}
                </Segment>
            </BaseLayout>
        )
    }
}

function getLatestHistory(item) {
    let latestHistory = null
    item.history.every(function (history) {
        if (latestHistory) {
            if ((new Date(history.timestamp)).getTime() > (new Date(latestHistory.timestamp)).getTime()) {
                latestHistory = history;
            }
        }
        else {
            latestHistory = history;
        }
        return true;
    });
    return latestHistory;
}

function mapStatesToProps(state) {
    return {
        token: state.auth.token,
        item: state.item
    }
}

export default connect(mapStatesToProps)(ApproveItem);