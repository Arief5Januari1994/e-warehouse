import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Button, Modal, Popup, Grid } from "semantic-ui-react";
import { push } from 'react-router-redux';
import Moment from 'moment';
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from 'axios';
import { baseImage } from '../../utils/baseImage';
import BaseLayout from "../baseLayout";

import { getServiceItems, deleteServiceItem } from "../../actions/ServiceItemActions";

class AddServiceItem extends Component {
    constructor() {
        super();
        this.state = {
            modalOpen: false,
            serviceItemData: []
        };
        console.log(this.state.serviceItemData)
        this.handleClose =  this.handleClose.bind(this,);
        this.handleOpen = this.handleOpen.bind(this);
    }
    componentWillMount() {
        const { token, dispatch } = this.props;
        dispatch(getServiceItems({ token: token }));
    }
    componentDidMount() {  
        const { token } = this.props;
        axios.get('http://localhost:3000/serviceItem', {headers: {
            Authorization : token
          }
          }).then(response => {  
          console.log(response.data);  
          this.setState({  
            serviceItemData: response.data  
          });  
        }).catch(error => {
            console.log('Info: Come from error');
            console.log(error)
        })  
    }

    onPressEdit(serviceItem) {
        const { dispatch } = this.props;
        dispatch(push("/serviceItem/update/" + serviceItem.id));
    }
    onPressDelete(serviceItem) {
        // console.log('ini container delete',serviceItem)
        const { token, dispatch } = this.props;
        dispatch(deleteServiceItem({ token: token, serviceItem: serviceItem })).then(function (data) {
            dispatch(getServiceItems({ token: token }));
        });
        console.log('delete')
        // this.handleClose()
    }
    handleOpen(serviceItem){ 
        console.log('ini containers view item', serviceItem)
        this.setState({ modalOpen: true })
        
    };
    handleClose = () => this.setState({ modalOpen: false });

    onPressReturn(serviceItem) {
        console.log('ini return borrow')
        const { dispatch } = this.props;
        dispatch(push("/endServiceItem/" + serviceItem.id));
    }
    exportAllServiceItemPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape
    
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
    
        doc.setFontSize(15);
    
        const title = "Laporan Perbaikan Alat Kerja (All Data)";
        const headers = [["Kode Perbaikan", "Nama Alat Kerja","Diperbaiki Oleh","Tanggal Mulai Perbaikan",
                        "Status Perbaikan","Tanggal Selesai Perbaikan", "Rincian Perbaikan", "Biaya Perbaikan"]];
    
        const data = this.state.serviceItemData.map(s => [
            s.service_code, 
            s.item_name, 
            // s.employee_nik, 
            s.employee_name,
            Moment(s.start_service_date).format('DD-MMMM-YYYY'),
            (s.service_status === 'true'? 'Sedang Diperbaiki' : 'Perbaikan Selesai'),
            Moment(s.end_service_date).format('DD-MMMM-YYYY'),
            s.detail_service,
            (parseFloat(s.cost_service).toLocaleString('id', { style: 'currency', currency: 'IDR' }))
        ]);
        
        let content = {
          startY: 50,
          head: headers,
          body: data
        };
    
        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("Laporan_Perbaikan_Alat_Kerja(All_Data).pdf")
      }

      exportPDF = (dataService) => {
        const unit = "in";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
    
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        const today = new Date();
        const newdate = "Date : "+ today;
    
        doc.setFontSize(12);
        const base64Img = baseImage;
    
        const title = "Laporan Riwayat Perbaikan Alat Kerja";
        let data = dataService;
        data.service_status = (data.service_status=== true ? 'Sedang Diperbaiki' :'Perbaikan Selesai' )
        data.detail_service = (data.detail_service ? data.detail_service : '-')
        doc.addImage(base64Img, 'JPEG', 6.0, 0.5,1.5,0.7); //left,up,width,height
        doc.text(title, 0.6,1.3);
        doc.text(`${newdate}`, 0.6, 1.6);

        doc.text(`Kode Perbaikan`, 0.6, 2.1);
        doc.text(`: ${data.service_code}`, 2.1, 2.1);
        doc.text(`Diperbaiki Oleh`, 0.6, 2.4);
        doc.text(`: ${data.employee_name}`, 2.1, 2.4);
        doc.text(`NIK Pegawai`, 0.6, 2.7);
        doc.text(`: ${data.employee_nik}`, 2.1, 2.7);
        doc.text(`Nama Alat Kerja`, 0.6, 3.0);
        doc.text(`: ${data.item_name}`, 2.1, 3.0);
        doc.text(`Rincian Perbaikan`, 0.6, 3.3);
        doc.text(`: ${data.detail_service}`, 2.1, 3.3);

        const headers = [["Tanggal Mulai Perbaikan", "Status Perbaikan", "Tanggal Selesai Perbaikan", "Biaya Perbaikan"]];
        let dataTableService = [];
        dataTableService.push(dataService);

        const dataTable = dataTableService.map(
            ss => [
                Moment(ss.start_service_date).format('DD-MMMM-YYYY'),
                (ss.service_status === false ? 'Sedang Diperbaiki' : 'Perbaikan Selesai'),
                (ss.end_service_date ? Moment(ss.end_service_date).format('DD-MMMM-YYYY') : '-'),
                (parseFloat(ss.cost_service).toLocaleString('id', { style: 'currency', currency: 'IDR' }))
            ]
        );

        let contentTable = {
          startY: 3.6,
          head: headers,
          body: dataTable,
        };

        doc.autoTable(contentTable);
        // doc.text(`Bekasi, ${data.end_service_date}`, 4.9, 5.5);
        doc.text(`Bekasi, ${Moment(today).format('DD MMMM YYYY')}`, 4.9, 5.5);
        doc.text('Dilaporkan Oleh,', 4.9, 5.7);
        doc.text(`(${data.employee_name})`, 4.9, 6.9);
        
        doc.text(`eWarehouse_dicetak oleh ${data.employee_name}, ${newdate}`, 0.1, 10.9);

        doc.save("Laporan_Terperinci_Perbaikan_Alat_Kerja.pdf")
      }
    
    render() {
        const { serviceItems, isFetchingServiceItems, fetchingServiceItemsError, deletingsServiceItemsError } = this.props.serviceItem;
        let error = null;
        let url = 'http://localhost:3000/'
        Moment.locale('en');
        if (fetchingServiceItemsError || deletingsServiceItemsError) {
            error = (
                <Message negative>
                    <Message.Header>Kesalahan saat mengambil Data Perbaikan Alat Kerja, pastikan kembali Hak Akses telah sesuai.</Message.Header>
                    <p>{fetchingServiceItemsError}</p>
                    <p>{deletingsServiceItemsError}</p>
                </Message>
            )
        }
        let row = 1;
        const serviceItemsView = serviceItems.map(function (serviceItem) {
            return (
                <Table.Row key={serviceItem.id}>
                    <Table.Cell textAlign='center'>{row++}</Table.Cell>
                    <Table.Cell>{serviceItem.service_code}</Table.Cell>
                    <Table.Cell>{serviceItem.item_name}</Table.Cell>
                    {/* <Table.Cell>{serviceItem.employee_nik}</Table.Cell> */}
                    <Table.Cell>{serviceItem.employee_name}</Table.Cell>
                    <Table.Cell textAlign='center'>{Moment(serviceItem.start_service_date).format('DD-MMMM-YYYY')} </Table.Cell>
                    <Table.Cell textAlign='center'>{serviceItem.service_status === false ? 'Sedang Diperbaiki' : 'Perbaikan Selesai'}</Table.Cell>
                    <Table.Cell textAlign='center'>{serviceItem.end_service_date ? Moment(serviceItem.end_service_date).format('DD-MMMM-YYYY') : '-'}</Table.Cell>
                    <Table.Cell>{serviceItem.detail_service}</Table.Cell>
                    <Table.Cell textAlign='right'>{parseFloat(serviceItem.cost_service).toLocaleString('id', { style: 'currency', currency: 'IDR' })}</Table.Cell>
                    <Table.Cell><img src={url + serviceItem.picture} width="100%"/></Table.Cell>
                    <Table.Cell textAlign='center'><a href={url + serviceItem.kwitansi} target="Resume">Download</a></Table.Cell>
                    <Table.Cell>
                        {/* <Icon name='trash outline' size='large' onClick={this.handleOpen} /> */}
                        {/* <Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, serviceItem)} /> */}
                        {/* <Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, serviceItem)} /> */}
                        {/* <Icon name='configure' size='large' onClick={this.onPressReturn.bind(this, serviceItem)}/> */}
                        {/* <Icon name='download' size='large' onClick={() => this.exportPDF(serviceItem)}/> */}

                        <Popup
                            trigger={<Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, serviceItem)} />}
                            content='Hapus Data'
                            on='hover'
                        />
                        <Popup
                            trigger={<Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, serviceItem)} />}
                            content='Ubah Data'
                            on='hover'
                        />
                        <Popup
                            trigger={<Icon name='configure' size='large' onClick={this.onPressReturn.bind(this, serviceItem)} />}
                            content='Penyelesaian Perbaikan'
                            on='hover'
                        />
                        <Popup
                            trigger={<Icon name='download' size='large' onClick={() => this.exportPDF(serviceItem)} />}
                            content='Unduh Data'
                            on='hover'
                        />
                        
                        {/* <Modal
                            closeIcon
                            open={this.state.modalOpen}
                            onClose={this.handleClose}
                            size = 'small'
                        >
                            <Header icon='trash outline' content='Delete Service Item' textAlign='center'/>
                            <Modal.Content>
                                <p>
                                Are you sure?
                                </p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='red' inverted onClick={this.handleClose}>
                                <Icon name='remove' /> No
                                </Button>
                                <Button color='green' inverted onClick={this.onPressDelete.bind(this, serviceItem)}>
                                <Icon name='checkmark' /> Yes
                                </Button>
                            </Modal.Actions>
                        </Modal> */}
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        let tableView = <h4>Data Perbaikan Alat Kerja Tidak Ditemukan. Mohon Tambahkan Beberapa Data.</h4>
        if (serviceItems.length > 0) {
            tableView = (
                <Table striped celled id='table-id'>
                    <Table.Header>
                        <Table.Row textAlign='center'>
                            <Table.HeaderCell >No</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Kode Perbaikan</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Nama Alat Kerja</Table.HeaderCell>
                            {/* <Table.HeaderCell width={1}>NIK Pegawai</Table.HeaderCell> */}
                            <Table.HeaderCell width={2}>Diperbaiki Oleh</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Tanggal Mulai Perbaikan</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Status Perbaikan</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Tanggal Selesai Perbaikan</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Rincian Perbaikan</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Biaya Perbaikan</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Gambar Setelah Perbaikan</Table.HeaderCell>
                            <Table.HeaderCell width={1}>File Kwitansi</Table.HeaderCell>
                            <Table.HeaderCell>Pilihan</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {serviceItemsView}
                    </Table.Body>
                </Table>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center' >
                    <Header as="h2">Daftar Perbaikan Alat Kerja</Header>
                    {error}

                    <Grid columns={1} style={{ width: '2430px' }}>
                        <Grid.Row>
                        <Grid.Column>
                            <Popup
                                trigger={
                                    <Button icon='download' content='Download Report (All Data)' color='green' onClick={() => this.exportAllServiceItemPDF()}/>
                                }
                                content='Unduh Laporan (Semua Data)'
                                on='hover'
                            />
                        </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    {/* <Button floated="right" color='green' onClick={() => this.exportAllServiceItemPDF()}>Unduh Laporan (All Data)</Button> */}
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
        serviceItem: state.serviceItem
    }
}

export default connect(mapStatesToProps)(AddServiceItem);