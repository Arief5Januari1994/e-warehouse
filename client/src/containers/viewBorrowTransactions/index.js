import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Modal, Image, Button, Popup, Grid } from "semantic-ui-react";
import { push } from 'react-router-redux';
import Moment from 'moment';
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from 'axios';

import { baseImage } from '../../utils/baseImage';

import BaseLayout from "../baseLayout";

import { getBorrowTransactions, deleteBorrowTransaction } from "./../../actions/BorrowTransactionActions";

class AddBorrowTransaction extends Component {

    constructor() {
        super();
        this.state = {
          borrowData: []
        }
    }

    componentWillMount() {
        const { token, dispatch } = this.props;
        dispatch(getBorrowTransactions({ token: token }));
    }

    componentDidMount() {  
       this.getAllBorrowTransaction();
    }

    getAllBorrowTransaction(){
        const { token } = this.props;
        axios.get('http://localhost:3000/borrowTransaction', {headers: {
            Authorization : token
          }
          }).then(response => {  
          console.log(response.data);  
          this.setState({  
            borrowData: response.data  
          });  
        }).catch(error => {
            console.log('Info: Come from error');
            console.log(error)
        })  
    }

    onPressEdit(borrowTransaction) {
        console.log('ini update borrow')
        const { dispatch } = this.props;
        dispatch(push("/borrowTransaction/update/" + borrowTransaction.id));
    }
    onPressDelete(borrowTransaction) {
        const { token, dispatch } = this.props;
        dispatch(deleteBorrowTransaction({ token: token, borrowTransaction: borrowTransaction })).then(function (data) {
            dispatch(getBorrowTransactions({ token: token }));
        });
    }
    onPressReturn(borrowTransaction) {
        console.log('ini return borrow')
        const { dispatch } = this.props;
        dispatch(push("/returnTransaction/" + borrowTransaction.id));
    }

    exportAllBorrowPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape
    
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
    
        doc.setFontSize(15);
    
        const title = "Laporan Transaksi Peminjaman (All Data)";
        const headers = [["NIK Pegawai", "Nama Pegawai","Tanggal Pinjam","Nama Alat Kerja","Lokasi Kerja","Status Pengembalian","Tanggal Pengembalian"]];
        
        const data = this.state.borrowData.map(b=> [
            b.employee_nik, 
            b.employee_name, 
            Moment(b.borrow_date).format('DD-MMMM-YYYY'), 
            b.item_name,
            b.project_location,
            (b.return_status === 'false'? 'Dipinjam' : 'Sudah Dikembalikan'),
            (b.return_date ? Moment(b.return_date).format('DD-MMMM-YYYY') : '-')
        ]);
    
        let content = {
          startY: 50,
          head: headers,
          body: data
        };
    
        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("Lapooran_Transaksi_Peminjaman_(All_Data).pdf")
      }

      exportPDF = (dataBorrow) => {
        const unit = "in";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
    
        const doc = new jsPDF(orientation, unit, size);

        let today = new Date();
        let newdate = "on "+ today;
        doc.setFontSize(12);
        const base64Img = baseImage;
    
        const title = "BUKTI TRANSAKSI PEMINJAMAN";
        const data = dataBorrow;
        data.return_status = (data.return_status === true ? 'Sudah Dikembalikan' :'Dipinjam' )
        data.return_date = (data.return_date ? Moment(data.return_date).format('DD-MMMM-YYYY') : '-')
        doc.addImage(base64Img, 'JPEG', 6.0, 0.5,1.5,0.7); //left,up,width,height
        doc.text(title, 3.0,1.3);
        doc.text('Yang bertandatangan dibawah ini:', 1.0, 1.8);
        doc.text(`NIK Pegawai`, 1.5, 2.1);
        doc.text(`: ${data.employee_nik}`, 3.0, 2.1);
        doc.text(`Nama Pegawai`, 1.5, 2.4);
        doc.text(`: ${data.employee_name}`, 3.0, 2.4);
               
        doc.text('Dengan ini berniat untuk menggunakan dan meminjam alat kerja milik perusahaan', 1.0, 2.9);
        doc.text('dengan rincian sebagai berikut:', 1.0, 3.1);
        doc.text(`Nama Alat Kerja`, 1.5, 3.4);
        doc.text(`: ${data.item_name}`, 3.5, 3.4);
        doc.text(`Tanggal Peminjaman`, 1.5, 3.7);
        doc.text(`: ${Moment(data.borrow_date).format('DD-MMMM-YYYY')}`, 3.5, 3.7);
        doc.text(`Lokasi Pekerjaan`, 1.5, 4.0);
        doc.text(`: ${data.project_location}`, 3.5, 4.0);
        doc.text(`Tanggal Pengembalian`, 1.5, 4.3);
        doc.text(`: ${data.return_date}`, 3.5, 4.3);
        doc.text(`Status Pengembalian`, 1.5, 4.6);
        doc.text(`: ${data.return_status}`, 3.5, 4.6);
        
        doc.text('Selanjutnya akan bertanggung jawab penuh terhadap barang-barang tersebut', 1.0, 5.1);
        doc.text('dan segera dikembalikan apabila telah selesai digunakan.', 1.0, 5.3);

        doc.text('Demikian bukti transaksi peminjaman ini dibuat untuk dipergunakan sebagaimana', 1.0, 5.8);
        doc.text('mestinya.', 1.0, 6.0);

        doc.text(`Bekasi, ${Moment(today).format('DD MMMM YYYY')}`, 4.5, 6.7);
        doc.text('Mengetahui,', 2.0, 6.9);
        doc.text('Logistik PT. MDS', 1.8, 7.1);
        doc.text('(                                )', 1.7, 8.1);
        doc.text('Peminjam Alat Kerja,', 4.5, 6.9);
        doc.text(`(${data.employee_name})`, 4.7, 8.1);
        
        doc.text(`eWarehouse_dicetak oleh ${data.employee_name}, ${newdate}`, 0.1, 11.2);

        doc.save("Bukti_Transaksi_Peminjaman.pdf")
      }

    render() {
        const { borrowTransactions, isFetchingBorrowTransactions, fetchingBorrowTransactionsError, deletingsBorrowTransactionsError } = this.props.borrowTransaction;
        let error = null;
        Moment.locale('en');
        if (fetchingBorrowTransactionsError || deletingsBorrowTransactionsError) {
            error = (
                <Message negative>
                    <Message.Header>Kesalahan saat mengambil Data Transaksi Peminjaman, pastikan kembali Hak Akses telah sesuai.</Message.Header>
                    <p>{fetchingBorrowTransactionsError}</p>
                    <p>{deletingsBorrowTransactionsError}</p>
                </Message>
            )
        }
        let row = 1;
        const borrowTransactionsView = borrowTransactions.map(function (borrowTransaction) {
            return (
                <Table.Row key={borrowTransaction.id}>
                    <Table.Cell textAlign='center'>{row++}</Table.Cell>
                    <Table.Cell>{borrowTransaction.employee_nik}</Table.Cell>
                    <Table.Cell>{borrowTransaction.employee_name}</Table.Cell>
                    <Table.Cell textAlign='center'>{Moment(borrowTransaction.borrow_date).format('DD-MMMM-YYYY')}</Table.Cell>
                    <Table.Cell>{borrowTransaction.item_name}</Table.Cell>
                    <Table.Cell>{borrowTransaction.project_location}</Table.Cell>
                    <Table.Cell textAlign='center'>{borrowTransaction.return_status  === false ? 'Dipinjam' : 'Sudah Dikembalikan'}</Table.Cell>
                    <Table.Cell textAlign='center'>{borrowTransaction.return_date ? Moment(borrowTransaction.return_date).format('DD-MMMM-YYYY') : '-'}</Table.Cell>
                    <Table.Cell>
                        {/* <Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, borrowTransaction)} /> */}
                        {/* <Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, borrowTransaction)} /> */}
                        {/* <Icon name='exchange' size='large' onClick={this.onPressReturn.bind(this, borrowTransaction)}/> */}
                        {/* <Icon name='download' size='large' onClick={() => this.exportPDF(borrowTransaction)}/> */}

                        <Popup
                            trigger={<Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, borrowTransaction)} />}
                            content='Hapus Data'
                            on='hover'
                        />
                        <Popup
                            trigger={<Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, borrowTransaction)} />}
                            content='Ubah Data'
                            on='hover'
                        />
                        <Popup
                            trigger={<Icon name='exchange' size='large' onClick={this.onPressReturn.bind(this, borrowTransaction)} />}
                            content='Pengembalian Alat Kerja'
                            on='hover'
                        />
                        <Popup
                            trigger={<Icon name='download' size='large' onClick={() => this.exportPDF(borrowTransaction)} />}
                            content='Unduh Data'
                            on='hover'
                        />

                    </Table.Cell>
                </Table.Row>

            )
        }, this);
        let tableView = <h4>Data Transaksi Peminjaman Tidak Ditemukan. Harap Tambahkan Data Lain.</h4>
        if (borrowTransactions.length > 0) {
            tableView = (
                <Table striped celled>
                    <Table.Header>
                        <Table.Row textAlign='center'>
                            <Table.HeaderCell >No</Table.HeaderCell>
                            <Table.HeaderCell width={2}>NIK Pegawai</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Nama Pegawai</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Tanggal Pinjam</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Nama Alat Kerja</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Lokasi Kerja</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Status Pengembalian</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Tanggal Pengembalian</Table.HeaderCell>
                            <Table.HeaderCell>Pilihan</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {borrowTransactionsView}
                    </Table.Body>
                </Table>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center' >
                    <Header as="h2">Daftar Transaksi Peminjaman</Header>
                    {error}

                    <Grid columns={1} style={{ width: '2430px' }}>
                        <Grid.Row>
                        <Grid.Column>
                            <Popup
                                trigger={
                                    <Button icon='download' content='Download Report (All Data)' color='green' onClick={() => this.exportAllBorrowPDF()}/>
                                }
                                content='Unduh Laporan (Semua Data)'
                                on='hover'
                            />
                        </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    {/* <Button floated="right" color='green' onClick={() => this.exportAllBorrowPDF()}>Unduh Laporan (All Data)</Button> */}
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
        borrowTransaction: state.borrowTransaction
    }
}

export default connect(mapStatesToProps)(AddBorrowTransaction);