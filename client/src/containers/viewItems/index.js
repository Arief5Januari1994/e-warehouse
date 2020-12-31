import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Button, Modal, Popup, Grid } from "semantic-ui-react";
import { push } from 'react-router-redux';
import Moment from 'moment';
// import ReactPaginate from 'react-paginate';
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from 'axios';

import BaseLayout from "../baseLayout";

import { getItems, deleteItem } from "./../../actions/ItemActions";

class ViewItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            itemData: [],
        }
        console.log('ini data', this.state.itemData)
        this.handleClose =  this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }
    componentWillMount() {
        const { token, dispatch } = this.props;
        dispatch(getItems({ token: token }));
        
    }
    componentDidMount() {  
        const { token } = this.props;
        axios.get('http://localhost:3000/items/')
        .then(response => {  
          console.log(response.data);  
          this.setState({  
            itemData: response.data  
          });  
        }).catch(error => {
            console.log('Info: Come from error');
            console.log(error)
        })  
     }

    onPressEdit(item) {
        const { dispatch } = this.props;
        dispatch(push("/item/update/" + item.id));
    }
    onPressDelete(item) {
        // console.log('ini onpress delete', item)
        const { token, dispatch } = this.props;
        dispatch(deleteItem({ token: token, item: item })).then(function (data) {
            dispatch(getItems({ token: token }));
        });
        console.log('delete')
        // this.handleClose()
    }
    handleOpen(item){ 
        console.log('ini containers view item', item)
        this.setState({ modalOpen: true })
        
    };

    handleClose(){ 
        this.setState({ modalOpen: false })
    };  
    
    exportAllPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape
    
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
    
        doc.setFontSize(15);
    
        const title = "Laporan Alat Kerja Perusahaan (All Data)";
        const headers = [["Kode Alat Kerja", "Nama Alat Kerja","Merk Alat Kerja","Kategori","Harga","Tanggal Pembelian","Status"]];
        let total = 0;
        this.state.itemData.forEach(function(value){
            total += value.price
        });
        const data = this.state.itemData.map(b=> [
            b.item_code, 
            b.item_name.en, 
            b.item_merk,
            b.category,
            (parseFloat(b.price).toLocaleString('id', { style: 'currency', currency: 'IDR' })),
            Moment(b.purchase_date).format('DD-MMMM-YYYY'),
            b.item_status
        ]);
        
        const footer = "Total Aset : " + (parseFloat(total).toLocaleString('id', { style: 'currency', currency: 'IDR' }));
        let content = {
          startY: 50,
          head: headers,
          body: data,
        };
    
        doc.text(title, marginLeft, 40);
        doc.autoTable.previous.finalY;
        doc.autoTable(content);
        let finalY = doc.autoTable.previous.finalY+30; // The y position on the page
        doc.text(marginLeft, finalY, footer)
        doc.save("Laporan_Alat_Kerja_Perusahaan(All_Data).pdf")
      }

    render() {
        const { items, isFetchingItems, fetchingItemsError, deletingsItemsError } = this.props.item;
        let error = null;
        let url = 'http://localhost:3000/'
        if (fetchingItemsError || deletingsItemsError) {
            error = (
                <Message negative>
                    <Message.Header>Kesalahan saat mengambil Data Alat Kerja, pastikan kembali Hak Akses telah sesuai.</Message.Header>
                    <p>{fetchingItemsError}</p>
                    <p>{deletingsItemsError}</p>
                </Message>
            )
        }
        let row = 1;
        const itemsView = items.map(function (item) {
            return (
                <Table.Row key={item.id}>
                    <Table.Cell textAlign='center'>{row++}</Table.Cell>
                    <Table.Cell>{item.item_code}</Table.Cell>
                    <Table.Cell>{item.item_name.en}</Table.Cell>
                    <Table.Cell>{item.item_merk}</Table.Cell>
                    <Table.Cell textAlign='center'>{item.category}</Table.Cell>
                    <Table.Cell textAlign='right'>{parseFloat(item.price).toLocaleString('id', { style: 'currency', currency: 'IDR' })}</Table.Cell>
                    <Table.Cell textAlign='center'>{Moment(item.purchase_date).format('DD-MMMM-YYYY')}</Table.Cell>
                    <Table.Cell textAlign='center'>{item.item_status}</Table.Cell>
                    {/* <Table.Cell><img src={url + item.item_picture} width="100%"/></Table.Cell> */}
                    <Table.Cell><img src={item.item_picture} width="100%"/></Table.Cell>
                    <Table.Cell textAlign='center'><a href={item.manual_book} target="Resume">Download</a></Table.Cell>
                    <Table.Cell>
                        {/* <Icon name='trash outline' size='large' onClick={this.handleOpen.bind(this,item)} /> */}
                        {/* <Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, item)} /> */}
                        {/* <Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, item)} /> */}
                        <Popup
                            trigger={<Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, item)} />}
                            content='Hapus Data'
                            on='hover'
                        />
                        <Popup
                            trigger={<Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, item)} />}
                            content='Ubah Data'
                            on='hover'
                        />
                        <Modal
                            closeIcon
                            open={this.state.modalOpen}
                            onClose={this.handleClose}
                            size = 'small'
                            >
                            <Header icon='trash outline' content='Delete Item' textAlign='center'/>
                            <Modal.Content>
                                <p>
                                Are you sure?
                                </p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='red' inverted onClick={this.handleClose}>
                                <Icon name='remove' /> No
                                </Button>
                                <Button color='green' inverted onClick={this.onPressDelete.bind(item)}>
                                <Icon name='checkmark' /> Yes
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        let tableView = <h4>Data Alat Kerja Tidak Ditemukan. Mohon Tambahkan Beberapa Data.</h4>
        if (items.length > 0) {
            tableView = (
                <Table striped celled>
                    <Table.Header>
                        <Table.Row textAlign='center'>
                            <Table.HeaderCell >No</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Kode Alat Kerja</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Nama Alat Kerja</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Merk Alat Kerja</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Kategori</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Harga</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Tanggal Pembelian</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Status</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Gambar Alat Kerja</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Buku Panduan</Table.HeaderCell>
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

                    <Grid columns={1} style={{ width: '2430px' }}>
                        <Grid.Row>
                        <Grid.Column>
                            <Popup
                                trigger={
                                    <Button icon='download' content='Download Report (All Data)' color='green' onClick={() => this.exportAllPDF()}/>
                                }
                                content='Unduh Laporan (Semua Data)'
                                on='hover'
                            />
                        </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    {/* <Button position='top right' color='green' onClick={() => this.exportAllPDF()}>Unduh Laporan (All Data)</Button> */}

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
        item: state.item
    }
}

export default connect(mapStatesToProps)(ViewItem);