import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Button, Popup, Grid } from "semantic-ui-react";
import { push } from 'react-router-redux';
import Moment from 'moment';
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from 'axios';

import {baseImage} from '../../utils/baseImage';

import BaseLayout from "../baseLayout";

import { getVehicleTaxs, deleteVehicleTax } from "./../../actions/VehicleTaxActions";

class AddVehicleTax extends Component {
    constructor() {
        super();
        this.state = {
            vehicleTaxData: []
        };
    }
    componentWillMount() {
        const { token, dispatch } = this.props;
        dispatch(getVehicleTaxs({ token: token }));
    }
    componentDidMount() {  
        const { token } = this.props;
        axios.get('http://localhost:3000/vehicleTax', {headers: {
            Authorization : token
          }
          }).then(response => {  
          console.log(response.data);  
          this.setState({  
            vehicleTaxData: response.data  
          });  
        }).catch(error => {
            console.log('Info: Come from error');
            console.log(error)
        })  
    }
    onPressEdit(vehicleTax) {
        const { dispatch } = this.props;
        dispatch(push("/vehicleTax/update/" + vehicleTax.id));
    }
    onPressDelete(vehicleTax) {
        const { token, dispatch } = this.props;
        dispatch(deleteVehicleTax({ token: token, vehicleTax: vehicleTax })).then(function (data) {
            dispatch(getVehicleTaxs({ token: token }));
        });
        console.log('delete')
    }
    exportAllVehicleTaxPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape
    
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
    
        doc.setFontSize(15);
        const base64Img = baseImage;
        const title = "Laporan Pajak Kendaraan (All Data)";
        const headers = [["Nomor Polisi Kendaraan", "Nama Pemilik","Alamat","Berlaku Sampai Dengan","Estimasi Pajak",
                        "Status"]];
    
        const data = this.state.vehicleTaxData.map(
            s => [
                s.vehicle_registration_number, 
                s.name_of_owner, 
                s.address, 
                Moment(s.date_of_expire).format('DD-MMMM-YYYY'),
                (parseFloat(s.estimated_tax).toLocaleString('id', { style: 'currency', currency: 'IDR' })),
                s.status
            ]
        );
        
        let content = {
          startY: 50,
          head: headers,
          body: data
        };
        doc.addImage(base64Img, 'JPEG', 70, 30,1.5,0.7); //left,up,width,height
    
        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("Laporan_Pajak_Kendaraan(All_Data).pdf")
      }
    render() {
        const { vehicleTaxs, isFetchingVehicleTaxs, fetchingVehicleTaxsError, deletingsVehicleTaxsError } = this.props.vehicleTax;
        let error = null;
        let url = 'http://localhost:3000/'
        if (fetchingVehicleTaxsError || deletingsVehicleTaxsError) {
            error = (
                <Message negative>
                    <Message.Header>Kesalahan saat mengambil Data Pajak Kendaraan, pastikan kembali Hak Akses telah sesuai.</Message.Header>
                    <p>{fetchingVehicleTaxsError}</p>
                    <p>{deletingsVehicleTaxsError}</p>
                </Message>
            )
        }
        let row =1;
        const vehicleTaxsView = vehicleTaxs.map(function (vehicleTax) {
            return (
                <Table.Row key={vehicleTax.id}>
                    <Table.Cell textAlign='center'>{row++}</Table.Cell>
                    <Table.Cell>{vehicleTax.vehicle_code}</Table.Cell>
                    <Table.Cell textAlign='center'>{vehicleTax.vehicle_registration_number}</Table.Cell>
                    <Table.Cell>{vehicleTax.name_of_owner}</Table.Cell>
                    <Table.Cell>{vehicleTax.address}</Table.Cell>
                    <Table.Cell textAlign='center'>{Moment(vehicleTax.date_of_expire).format('DD-MMMM-YYYY')}</Table.Cell>
                    <Table.Cell textAlign='right'>{parseFloat(vehicleTax.estimated_tax).toLocaleString('id', { style: 'currency', currency: 'IDR' })}</Table.Cell>
                    <Table.Cell textAlign='center'>{vehicleTax.status}</Table.Cell>
                    <Table.Cell textAlign='center'><a href={url + vehicleTax.file} target="Resume">Download</a></Table.Cell>
                    <Table.Cell>
                        {/* <Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, vehicleTax)} /> */}
                        {/* <Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, vehicleTax)} /> */}

                        <Popup
                            trigger={<Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, vehicleTax)} />}
                            content='Hapus Data'
                            on='hover'
                        />
                        <Popup
                            trigger={<Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, vehicleTax)} />}
                            content='Ubah Data'
                            on='hover'
                        />

                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        let tableView = <h4>Data Pajak Kendaraan Tidak Ditemukan. Mohon Tambahkan Beberapa Data.</h4>
        if (vehicleTaxs.length > 0) {
            tableView = (
                <Table striped celled>
                    <Table.Header>
                        <Table.Row textAlign='center'>
                            <Table.HeaderCell >No</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Kode Pajak Kendaraan</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Nomor Polisi Kendaraan</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Nama Pemilik</Table.HeaderCell>
                            <Table.HeaderCell width={4}>Alamat</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Berlaku Sampai Dengan</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Estimasi Pajak</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Status</Table.HeaderCell>
                            <Table.HeaderCell width={1}>File STNK</Table.HeaderCell>
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

                    <Grid columns={1} style={{ width: '2430px' }}>
                        <Grid.Row>
                        <Grid.Column>
                            <Popup
                                trigger={
                                    <Button icon='download' content='Download Report (All Data)' color='green' onClick={() => this.exportAllVehicleTaxPDF()}/>
                                }
                                content='Unduh Laporan (Semua Data)'
                                on='hover'
                            />
                        </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    {/* <Button floated="right" color='green' onClick={() => this.exportAllVehicleTaxPDF()}>Unduh Laporan (All Data)</Button> */}
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

export default connect(mapStatesToProps)(AddVehicleTax);