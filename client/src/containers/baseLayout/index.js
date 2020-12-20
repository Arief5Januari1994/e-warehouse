import React, { Component } from 'react';
import { connect } from "react-redux";
import { Container, Segment, Sidebar, Menu, Icon, Grid, Header, Dropdown } from 'semantic-ui-react';
import { push } from 'react-router-redux';

import { logoutUser } from "./../../actions/AuthActions";

class BaseLayout extends Component {
    componentWillMount() {
        const { token } = this.props.auth;
        const { dispatch } = this.props;
        if (!token) {
            dispatch(push("/login"));
        }
    }
    handleClick(menuItem) {
        const { dispatch } = this.props;
        if (menuItem === "addItem") {
            dispatch(push('/item/add'));
        }
        else if (menuItem === "addUser") {
            dispatch(push('/user/add'));
        }
        else if (menuItem === "viewItems") {
            dispatch(push('/item'));
        }
        else if (menuItem === "viewUsers") {
            dispatch(push('/user'));
        }
        else if (menuItem === "approveItem") {
            dispatch(push('/item/approve'));
        }
        else if (menuItem === "viewBorrowTransaction") {
            dispatch(push('/borrowTransaction'));
        }
        else if (menuItem === "logout") {
            dispatch(logoutUser());
            dispatch(push('/login'));
        }
        else if (menuItem === "addBorrowTransaction"){
            dispatch(push('/borrowTransaction/add'))
        }
        else if (menuItem === "addServiceItem") {
            dispatch(push('/serviceItem/add'));
        }
        else if (menuItem === "viewServiceItem") {
            dispatch(push('/serviceItem'));
        }
        else if (menuItem === "addVehicleTax") {
            dispatch(push('/vehicleTax/add'));
        }
        else if (menuItem === "approveVehicleTax") {
            dispatch(push('/vehicleTax/approve'));
        }
        else if (menuItem === "viewVehicleTax") {
            dispatch(push('/vehicleTax'));
        }
    }
    render() {
        const { user } = this.props.auth;
        const isManajemenDireksi= user.division.indexOf("Manajemen Direksi") >= 0;
        const isHSE = user.division.indexOf("HSE") >= 0;
        const isOperasidanPemeliharaan = user.division.indexOf("Operasi dan Pemeliharaan") >= 0;
        const isKeuangan = user.division.indexOf("Keuangan") >= 0;
        const isWarehouse = user.division.indexOf("Warehouse") >= 0;
        let approveVehicleTaxMenuItem = null;
        let employeeMenu = null;
        let itemMenu = null;
        let borrowTransactionMenu = null;
        let serviceItemMenu = null;
        let vehicleTaxMenu = null
        if (isManajemenDireksi) {
            approveVehicleTaxMenuItem  = (
                <Dropdown.Item onClick={this.handleClick.bind(this, "approveVehicleTax")} >
                    Approval Vehicle Tax
                </Dropdown.Item>
            );
        }
        if (isManajemenDireksi || isWarehouse ){
            employeeMenu = (
                <Dropdown item text='Pegawai' style={{ align:'center'}}>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={this.handleClick.bind(this, "addUser")} >Tambah Pegawai</Dropdown.Item>
                        <Dropdown.Item onClick={this.handleClick.bind(this, "viewUsers")}>Data Pegawai</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown> 
            );
            itemMenu = (
                <Dropdown item text='Alat Kerja'>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={this.handleClick.bind(this, "addItem")} >Tambah Alat Kerja</Dropdown.Item>
                        <Dropdown.Item onClick={this.handleClick.bind(this, "viewItems")}>Data Alat Kerja</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            )
        }
        if(isHSE || isOperasidanPemeliharaan || isWarehouse || isKeuangan){
            borrowTransactionMenu = (
            <Dropdown item text='Transaksi Peminjaman'>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={this.handleClick.bind(this, "addBorrowTransaction")} >Formulir Peminjaman</Dropdown.Item>
                    <Dropdown.Item onClick={this.handleClick.bind(this, "viewBorrowTransaction")}>Data Transaksi Peminjaman</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            );
        }
        if(isManajemenDireksi|| isHSE || isOperasidanPemeliharaan || isWarehouse || isKeuangan){
            serviceItemMenu = (
                <Dropdown item text='Perbaikan Alat Kerja'>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={this.handleClick.bind(this, "addServiceItem")} >Formulir Perbaikan</Dropdown.Item>
                        <Dropdown.Item onClick={this.handleClick.bind(this, "viewServiceItem")}>Data Perbaikan</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            );
            vehicleTaxMenu = (
                <Dropdown item text='Pajak Kendaraan'>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={this.handleClick.bind(this, "addVehicleTax")} >Formulir Pajak Kendaraan</Dropdown.Item>
                        <Dropdown.Item onClick={this.handleClick.bind(this, "viewVehicleTax")}>Data Pajak Kendaraan</Dropdown.Item>
                        {approveVehicleTaxMenuItem }
                    </Dropdown.Menu>
                </Dropdown>
            );

        }
        return (
            <Container fluid >
                <Sidebar.Pushable as={Segment}>
                <Menu
                    inverted
                    style={{ 
                        align:'center',
                        padding: "20px",
                    }}>
                    <Menu.Header
                        as='h1' 
                        style={{ 
                            color:'white',
                            margin: "10px"
                        }}>
                        e-Warehouse
                    </Menu.Header>
                        <Menu.Menu as='h4' position='right'>
                            {employeeMenu}
                            {itemMenu}
                            {borrowTransactionMenu}
                            {serviceItemMenu}
                            {vehicleTaxMenu}
                            <Dropdown item text='Keluar'>
                                <Dropdown.Menu>
                                <Dropdown.Item onClick={this.handleClick.bind(this, "logout")} >Keluar</Dropdown.Item>
                            </Dropdown.Menu>
                            </Dropdown>                            
                        </Menu.Menu>   
                    </Menu>
                    <Sidebar.Pusher>
                        {this.props.children}
                    </Sidebar.Pusher>
                   
                </Sidebar.Pushable>
                
            </Container>
        )
    }
}

function mapStatesToProps(state) {
    return {
        auth: state.auth
    }
}

export default connect(mapStatesToProps)(BaseLayout);