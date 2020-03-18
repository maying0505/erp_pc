/**
 * @Create by John on 2018/03/28
 * @Desc 放款-还款信息
 * */

import React from 'react';
import {message, Spin, Row, Form, Button, Col, Table, Modal, Radio, Input, Divider} from 'antd';

import './index.scss';
import api from 'common/util/api';
import {request} from 'common/request/request';
import {local, session} from 'common/util/storage';
import LodashDebounce from 'common/util/debounce';
import imgUrl from 'common/util/imgUrl.js';

import Voucher from 'component/voucher';
import InputItem from 'component/inputItem';
import ImgUpload from 'component/img-upload';
import {hashHistory} from 'react-router';

const TableColumnWidthS = '5.6%';
const TableColumnWidthM = '5.6%';
const TableColumnWidthL = '5.6%';
const TableColumnWidthMax = '10%';

const MTCWidth = '7.1%';

const RadioGroup = Radio.Group;

const ModalType = ['Repayment', 'Detail'];

const stageWaitForRepayment = '10';      // 待还款
const stageRepaymentFinish = '11';       // 还款完成

const ModalImgDeletable = true;

class ModalPrompt extends React.Component {

    state = {
        inputValue: null,
    };

    _onInputChange = (e) => {
        const {value: inputValue} = e.target;
        this.setState({inputValue});
    };

    _onOk = () => {
        const {okFunc, promptVisible} = this.props;
        const {inputValue} = this.state;
        okFunc && okFunc(inputValue);
        promptVisible && promptVisible(false);
    };

    _onCancel = () => {
        const {promptVisible} = this.props;
        promptVisible && promptVisible(false);
    };

    render() {
        const {title, visible} = this.props;
        return (
            <Modal
                onOk={this._onOk}
                onCancel={this._onCancel}
                okText={'确定'}
                cancelText={'取消'}
                title={title}
                visible={visible}
                closable={true}
            >
                <Input placeholder='备注' onChange={this._onInputChange}/>
            </Modal>
        )
    }
}

class FinanceDetailLoanInfo extends React.Component {

    state = {
        isLoading: false,

        onceReceiptMoney: undefined,
        receiveOnceReceiptVoucherJson: [],
        onceReceiptVoucherJson: [],

        tableDataSource: [],

        financeCustomerName: null,

        modalVisible: false,

        currentPayPeriod: 0,    // 当前还款期数
        currentPayId: null,     // 当前操作
        currentPayBeOverdue: false,

        returnAmountImgArr: [],
        interestMoneyImgArr: [],
        serviceChargeImgArr: [],
        managementCostImgArr: [],
        otherExpensesImgArr: [],
        defaultInterestImgArr: [],
        penalSumImgArr: [],
        retDepositImageArr: [],
        retServiceChargeImageArr: [],
        retInterestMoneyImageArr: [],

        returnAmountJson: [],
        interestMoneyJson: [],
        serviceChargeJson: [],
        managementCostJson: [],
        otherExpensesJson: [],
        defaultInterestJson: [],
        penalSumJson: [],
        retDepositJson: [],
        retServiceChargeUPJson: [],
        retInterestMoneyJson: [],

        returnAmountImageUploadFinish: true,
        interestMoneyImageUploadFinish: true,
        serviceChargeImageUploadFinish: true,
        managementCostImageUploadFinish: true,
        otherExpensesImageUploadFinish: true,
        defaultInterestImageUploadFinish: true,
        penalSumImageUploadFinish: true,
        retDepositImageUploadFinish: true,
        retServiceChargeImageUploadFinish: true,
        retInterestMoneyImageUploadFinish: true,

        defautInterest: undefined,
        penalSum: undefined,

        modalType: null,

        productStage: null,          // 产品stage

        oneTimeCharge: 0,         // 一次性收费凭证应收金额

        oneTimeChargeVoucherImageUploadFinish: true,


        modalTableDataSource: [],        // modalTableData,

        promptVisible: false,            // promptVisible
        promptValue: '',                 // promptValue
        listId: null,                    // promptId

        isNeedAdvanceComplete: false,   // 提前还款标记
    };

    componentDidMount() {
        this._getProductInfo(this.props.productId);
        this._getLoansRepaymentList(this.props.productId);
        this.setState({financeCustomerName: session.get('financeCustomerName')});
    }

    _tableColumns = [
        {
            title: '期数/总期数',
            width: TableColumnWidthS,
            key: 'id',
            render: (text, records) => `${records.period}/${records.totalPeriod}`
        },
        {title: '预计还款时间', dataIndex: 'predictDate', width: TableColumnWidthM},
        {title: '实际还款时间', dataIndex: 'realityDate', width: TableColumnWidthM},
        {title: '应还本金', dataIndex: 'payPrincipal', width: TableColumnWidthS},
        {title: '应还利息', dataIndex: 'monthlyInterest', width: TableColumnWidthS},
        {
            title: '是否逾期',
            dataIndex: 'isOverdue',
            width: TableColumnWidthS,
            render: (text) => {
                if (text) {
                    return text === '1' ? '是' : '否';
                } else {
                    return '';
                }
            }
        },
        {title: '逾期天数', dataIndex: 'overdueDays', width: TableColumnWidthS},
        {title: '罚息', dataIndex: 'defautInterest', width: TableColumnWidthS},
        {title: '违约金', dataIndex: 'penalSum', width: TableColumnWidthS},
        {title: '居间服务费', dataIndex: 'serviceCharge', width: TableColumnWidthM},
        {title: '综合费', dataIndex: 'managementCost', width: TableColumnWidthM},
        {title: '应还款总额', dataIndex: 'totalMonthlyRepayment', width: TableColumnWidthL},
        {
            title: '实收金额',
            dataIndex: 'realMoney',
            width: TableColumnWidthL,
            render: (text, records) => {
                let style = null;
                if (records.realMoney !== records.totalMonthlyRepayment) {
                    style = {color: 'red'};
                }
                return <span style={style}>{records.realMoney}</span>
            }
        },
        {title: '实退利息金额', dataIndex: 'retInterestMoney', width: TableColumnWidthL,},
        {title: '实退居间服务费', dataIndex: 'retServiceChargeUP', width: TableColumnWidthL,},
        {title: '实退保证金', dataIndex: 'retDeposit', width: TableColumnWidthL,},
        {
            title: '操作',
            width: TableColumnWidthMax,
            render: (text, record) => {
                return (
                    <div>
                        <span>
                           <a onClick={() => this._onOperationPress(text, record)}
                              className='ant-dropdown-link green-span nowrap_s'
                           >
                               还款
                           </a>
                            {
                                record.state === '1' && record.showRepaymentBtn === true &&
                                <span>
                                    <Divider type='vertical'/>
                                    <a onClick={() => this._onConfirm(record.id)}
                                       className='ant-dropdown-link green-span nowrap_s'
                                    >
                                        完成
                                    </a>
                                </span>
                            }
                        </span>

                    </div>
                );
            }
        },
    ];

    _modalTableColumns = [
        {title: '序号', dataIndex: 'index', width: MTCWidth,},
        {
            title: '日期',
            dataIndex: 'createDate',
            width: MTCWidth,
            render: (text, record) => {
                return text ? text.split(' ')[0] : '--';
            }
        },
        {title: '实收本金', dataIndex: 'returnAmount', width: MTCWidth,},
        {title: '实收利息', dataIndex: 'interestMoney', width: MTCWidth,},
        {title: '实收居间服务费', dataIndex: 'serviceChargeUP', width: MTCWidth,},
        {title: '实收综合费', dataIndex: 'managementCostUP', width: MTCWidth,},
        {title: '实收其他费用', dataIndex: 'otherExpenses', width: MTCWidth,},
        {title: '实收罚息', dataIndex: 'defautInterest', width: MTCWidth,},
        {title: '实收违约金', dataIndex: 'penalSum', width: MTCWidth,},
        {title: '实收总额', dataIndex: 'realMoney', width: MTCWidth,},
        {title: '实退利息金额', dataIndex: 'retInterestMoney', width: MTCWidth,},
        {title: '实退居间服务费', dataIndex: 'retServiceChargeUP', width: MTCWidth,},
        {title: '实退保证金', dataIndex: 'retDeposit', width: MTCWidth,},
        {title: '备注', dataIndex: 'remarks', width: MTCWidth,},
    ];


    _getModalTableDataSource = (repaymentId) => {
        if (!this.state.isLoading) {
            this.setState({isLoading: true});
        }
        request(api.loansRecordList + repaymentId, {}, 'Get', session.get('token'))
            .then(res => {
                if (res.success && res.data && res.data.length > 0) {
                    let newArr = [];
                    res.data.forEach((item, index) => {
                        newArr.push({
                            index: index + 1,
                            ...item,
                        });
                    });
                    if (Object.keys(res.data2).length > 0) {
                        const {
                            defautInterestSum, penalSum, interestMoneySum, returnAmountSum, otherExpensesSum,
                            realMoneySum, managementCostUPSum, serviceChargeUPSum, retInterestMoneySum,
                            retServiceChargeUPVoucherSum, retDepositSum,
                        } = res.data2;
                        newArr.push({
                            index: '总计',
                            id: newArr.length,
                            createDate: null,
                            returnAmount: returnAmountSum,
                            interestMoney: interestMoneySum,
                            otherExpenses: otherExpensesSum,
                            defautInterest: defautInterestSum,
                            penalSum: penalSum,
                            realMoney: realMoneySum,
                            serviceChargeUP: serviceChargeUPSum,
                            managementCostUP: managementCostUPSum,
                            retInterestMoney: retInterestMoneySum,
                            retServiceChargeUP: retServiceChargeUPVoucherSum,
                            retDeposit: retDepositSum,
                            remarks: null,
                        });
                    }
                    this.setState({modalTableDataSource: newArr});
                } else if (!res.success) {
                    if (res.message) {
                        message.warn(res.message);
                    } else {
                        message.warn('请求失败');
                    }
                }
                this.setState({isLoading: false});
            })
            .catch(err => {
                this.setState({isLoading: false});
                message.error('请求服务异常');
            });
    };

    _getProductInfo = (productId) => {
        if (!this.state.isLoading) {
            this.setState({isLoading: true,});
        }
        request(`${api.productByGet}${productId}`, {}, 'Get', session.get('token'))
            .then(res => {
                if (res.success) {
                    const {onceReceiptMoney, onceReceiptVoucherJson, stage,} = res.data;
                    this.setState({
                        onceReceiptVoucherJson: onceReceiptVoucherJson ? onceReceiptVoucherJson : [],
                        onceReceiptMoney: onceReceiptMoney ? onceReceiptMoney : undefined,
                        receiveOnceReceiptVoucherJson: onceReceiptVoucherJson ? this._imgDataFormat(onceReceiptVoucherJson) : [],
                        productStage: stage,
                    });
                } else {
                    message.error('请求失败');
                }
                this.setState({isLoading: false,});
            })
            .catch(err => {
                message.error('请求服务异常');
                this.setState({isLoading: false,});
            });
    };

    _imgDataFormat = (imgDataJson) => { //资料图片显示处理
        let imgDataArr = [];
        for (let item of imgDataJson) {
            imgDataArr.push({
                url: item[imgUrl.small] ? item[imgUrl.small] : '',
                bigBUrl: item[imgUrl.bigB] ? item[imgUrl.bigB]: '',
                bigUrl: item[imgUrl.big] ? item[imgUrl.big] : '',
                uid: `${item.fileName}${Math.random()}`,
                status: 'done',
                deletable: false,
            });
        }
        return imgDataArr;
    };

    _getLoansRepaymentList = (productId) => {
        if (!this.state.isLoading) {
            this.setState({isLoading: true,});
        }
        request(api.loansRepaymentList, {productId}, 'post', session.get('token'))
            .then(res => {
                if (res.success) {
                    if (res.data && res.data.length > 0) {
                        this.setState({
                            tableDataSource: res.data,
                            oneTimeCharge: res.data[0].oneTimeCharge,
                            isNeedAdvanceComplete: res.data2.isShow,
                        });
                    } else {
                        message.warn('没有数据');
                    }
                } else {
                    message.error('请求失败');
                }
                this.setState({isLoading: false,});
            })
            .catch(err => {
                message.error('请求服务异常');
                this.setState({isLoading: false,});
            });
    };

    _onLoanImgChange = (fileList, index, style, status) => {
        if (status === 'uploading') {
            return;
        }
        const onceReceiptVoucherJson = [];
        let isImageUploadFinish = true;
        if (fileList.length > 0) {
            fileList.forEach(item => {
                if (item.response && item.response.data) {
                    onceReceiptVoucherJson.push(item.response.data);
                }
                if (item.status !== 'done') {
                    isImageUploadFinish = false;
                }
            });
        }
        this.setState({
            onceReceiptVoucherJson,
            oneTimeChargeVoucherImageUploadFinish: isImageUploadFinish,
        });
    };

    // 保存添加防抖
    _onSaveDebounce = LodashDebounce(type => this._onSave(type));

    _onConfirmComplete = (type) => {
        Modal.confirm({
            title: '还款完成确认',
            content: '是否确认当前案件还款完成？',
            okText: '确认',
            cancelText: '取消',
            onOk: LodashDebounce(() => this._onSave(type)),
        });
    };

    _onSave = (type) => {
        const {getFieldsValue} = this.props.form;
        const fieldsValue = getFieldsValue();
        const {onceReceiptVoucherJson, oneTimeChargeVoucherImageUploadFinish} = this.state;
        if (!oneTimeChargeVoucherImageUploadFinish) {
            message.warn('图片未上传完成');
            return;
        }
        const {productId: id} = this.props;
        const params = {
            id,
            onceReceiptMoney: fieldsValue.onceReceiptMoney,
            onceReceiptVoucherJson: onceReceiptVoucherJson.length === 0 ? '[]' : JSON.stringify(onceReceiptVoucherJson),
        };
        this._saveRequest(type, params);
    };

    _saveRequest = (type, params) => {
        if (!this.state.isLoading) {
            this.setState({isLoading: true,});
        }
        request(api.onceReceipt, params, 'post', session.get('token'))
            .then(res => {
                if (res.success) {
                    if (type === 'save') {
                        message.success(res.message);
                        this._getProductInfo(this.props.productId);
                    } else if (type === 'submit') {
                        this._onSubmit();
                    }
                } else {
                    message.warn(res.message);
                    this.setState({isLoading: false});
                }
            })
            .catch(err => {
                message.error('请求服务异常');
                this.setState({isLoading: false});
            });
    };

    _onTableChange = () => {

    };

    _onOperationPress = (text, record) => {
        this.setState({
            modalVisible: true,
            currentPayPeriod: record.period,
            currentPayId: record.id,
            modalType: ModalType[0],
            currentPayBeOverdue: record.isOverdue === '1', // 是否逾期；'1'，逾期， '2'未逾期
        });
        this._getLoansRepaymentInfo(record.id);
        this._getModalTableDataSource(record.id);
    };

    _onDetailPress = (text, record) => {
        this.setState({
            modalVisible: true,
            currentPayPeriod: record.period,
            modalType: ModalType[1],
            currentPayBeOverdue: record.isOverdue === '1', // 是否逾期；'1'，逾期， '2'未逾期
        });
        this._getLoansRepaymentInfo(record.id);
        this._getModalTableDataSource(record.id);
    };

    _onCancel = () => {
        this.setState({
            modalVisible: false,
            modalTableDataSource: [],

            // defautInterest: undefined,
            // penalSum: undefined,
            // receiveEchoVoucherJson: [],
            // receiveShouXiVoucherJson: [],
            // receiveOtherVoucherJson: [],
        });
        this._getDefault();
    };

    _getDefault = () => {
        this.setState({
            returnAmountImgArr: [],
            interestMoneyImgArr: [],
            serviceChargeImgArr: [],
            managementCostImgArr: [],
            otherExpensesImgArr: [],
            defaultInterestImgArr: [],
            penalSumImgArr: [],

            returnAmountJson: [],
            interestMoneyJson: [],
            serviceChargeJson: [],
            managementCostJson: [],
            otherExpensesJson: [],
            defaultInterestJson: [],
            penalSumJson: [],
        });
    };

    _onReturnAmountPictureChange = (fileList, index, style, status) => {
        if (status === 'uploading') {
            return;
        }
        let imgArr = [];
        const {returnAmountImgArr} = this.state;
        let imageUploadFinish = true;
        if (fileList.length > 0) {
            fileList.forEach(item => {
                if (item.response && item.response.data) {
                    imgArr.push(item.response.data);
                }
                if (item.status !== 'done') {
                    imageUploadFinish = false;
                }
                for (let it of returnAmountImgArr) {
                    if (it[imgUrl.small] === item.url) {
                        imgArr.push(it);
                    }
                }
            });
            this.setState({
                returnAmountImgArr: imgArr,
                returnAmountImageUploadFinish: imageUploadFinish,
            });
        }
    };

    _onInterestMoneyPictureChange = (fileList, index, style, status) => {
        if (status === 'uploading') {
            return;
        }
        const imgArr = [];
        const {interestMoneyImgArr} = this.state;
        let imageUploadFinish = true;
        if (fileList.length > 0) {
            fileList.forEach(item => {
                if (item.response && item.response.data) {
                    imgArr.push(item.response.data);
                }
                if (item.status !== 'done') {
                    imageUploadFinish = false;
                }
                for (let it of interestMoneyImgArr) {
                    if (it[imgUrl.small] === item.url) {
                        imgArr.push(it);
                    }
                }
            });
            this.setState({
                interestMoneyImgArr: imgArr,
                interestMoneyImageUploadFinish: imageUploadFinish,
            });
        }
    };

    _onServiceChargePictureChange = (fileList, index, style, status) => {
        if (status === 'uploading') {
            return;
        }
        const imgArr = [];
        const {serviceChargeImgArr} = this.state;
        let imageUploadFinish = true;
        if (fileList.length > 0) {
            fileList.forEach(item => {
                if (item.response && item.response.data) {
                    imgArr.push(item.response.data);
                }
                if (item.status !== 'done') {
                    imageUploadFinish = false;
                }
                for (let it of serviceChargeImgArr) {
                    if (it[imgUrl.small] === item.url) {
                        imgArr.push(it);
                    }
                }
            });
            this.setState({
                serviceChargeImgArr: imgArr,
                serviceChargeImageUploadFinish: imageUploadFinish,
            });
        }
    };

    _onManagementCostPictureChange = (fileList, index, style, status) => {
        if (status === 'uploading') {
            return;
        }
        const imgArr = [];
        const {managementCostImgArr} = this.state;
        let imageUploadFinish = true;
        if (fileList.length > 0) {
            fileList.forEach(item => {
                if (item.response && item.response.data) {
                    imgArr.push(item.response.data);
                }
                if (item.status !== 'done') {
                    imageUploadFinish = false;
                }
                for (let it of managementCostImgArr) {
                    if (it[imgUrl.small] === item.url) {
                        imgArr.push(it);
                    }
                }
            });
            this.setState({
                managementCostImgArr: imgArr,
                managementCostImageUploadFinish: imageUploadFinish,
            });
        }
    };

    _onOtherExpensesPictureChange = (fileList, index, style, status) => {
        if (status === 'uploading') {
            return;
        }
        const imgArr = [];
        const {otherExpensesImgArr} = this.state;
        let imageUploadFinish = true;
        if (fileList.length > 0) {
            fileList.forEach(item => {
                if (item.response && item.response.data) {
                    imgArr.push(item.response.data);
                }
                if (item.status !== 'done') {
                    imageUploadFinish = false;
                }
                for (let it of otherExpensesImgArr) {
                    if (it[imgUrl.small] === item.url) {
                        imgArr.push(it);
                    }
                }
            });
            this.setState({
                otherExpensesImgArr: imgArr,
                otherExpensesImageUploadFinish: imageUploadFinish,
            });
        }
    };

    _onDefaultInterestPictureChange = (fileList, index, style, status) => {
        if (status === 'uploading') {
            return;
        }
        const imgArr = [];
        const {defaultInterestImgArr} = this.state;
        let imageUploadFinish = true;
        if (fileList.length > 0) {
            fileList.forEach(item => {
                if (item.response && item.response.data) {
                    imgArr.push(item.response.data);
                }
                if (item.status !== 'done') {
                    imageUploadFinish = false;
                }
                for (let it of defaultInterestImgArr) {
                    if (it[imgUrl.small] === item.url) {
                        imgArr.push(it);
                    }
                }
            });
            this.setState({
                defaultInterestImgArr: imgArr,
                defaultInterestImageUploadFinish: imageUploadFinish,
            });
        }
    };

    _onPenalSumPictureChange = (fileList, index, style, status) => {
        if (status === 'uploading') {
            return;
        }
        const imgArr = [];
        const {penalSumImgArr} = this.state;
        let imageUploadFinish = true;
        if (fileList.length > 0) {
            fileList.forEach(item => {
                if (item.response && item.response.data) {
                    imgArr.push(item.response.data);
                }
                if (item.status !== 'done') {
                    imageUploadFinish = false;
                }
                for (let it of penalSumImgArr) {
                    if (it[imgUrl.small] === item.url) {
                        imgArr.push(it);
                    }
                }
            });
            this.setState({
                penalSumImgArr: imgArr,
                penalSumImageUploadFinish: imageUploadFinish,
            });
        }
    };

    _onRetDepositPictureChange = (fileList, index, style, status) => {
        if (status === 'uploading') {
            return;
        }
        const imgArr = [];
        const {retDepositImageArr} = this.state;
        let imageUploadFinish = true;
        if (fileList.length > 0) {
            fileList.forEach(item => {
                if (item.response && item.response.data) {
                    imgArr.push(item.response.data);
                }
                if (item.status !== 'done') {
                    imageUploadFinish = false;
                }
                for (let it of retDepositImageArr) {
                    if (it[imgUrl.small] === item.url) {
                        imgArr.push(it);
                    }
                }
            });
            this.setState({
                retDepositImageArr: imgArr,
                retDepositImageUploadFinish: imageUploadFinish,
            });
        }
    };

    _onRetServiceChargeUPPictureChange = (fileList, index, style, status) => {
        if (status === 'uploading') {
            return;
        }
        const imgArr = [];
        const {retServiceChargeImageArr} = this.state;
        let imageUploadFinish = true;
        if (fileList.length > 0) {
            fileList.forEach(item => {
                if (item.response && item.response.data) {
                    imgArr.push(item.response.data);
                }
                if (item.status !== 'done') {
                    imageUploadFinish = false;
                }
                for (let it of retServiceChargeImageArr) {
                    if (it[imgUrl.small] === item.url) {
                        imgArr.push(it);
                    }
                }
            });
            this.setState({
                retServiceChargeImageArr: imgArr,
                retServiceChargeImageUploadFinish: imageUploadFinish,
            });
        }
    };

    _onRetInterestMoneyPictureChange = (fileList, index, style, status) => {
        if (status === 'uploading') {
            return;
        }
        const imgArr = [];
        const {retInterestMoneyImageArr} = this.state;
        let imageUploadFinish = true;
        if (fileList.length > 0) {
            fileList.forEach(item => {
                if (item.response && item.response.data) {
                    imgArr.push(item.response.data);
                }
                if (item.status !== 'done') {
                    imageUploadFinish = false;
                }
                for (let it of retInterestMoneyImageArr) {
                    if (it[imgUrl.small] === item.url) {
                        imgArr.push(it);
                    }
                }
            });
            this.setState({
                retInterestMoneyImageArr: imgArr,
                retInterestMoneyImageUploadFinish: imageUploadFinish,
            });
        }
    };


    _onModalSubmit = () => {
        const {getFieldsValue} = this.props.form;
        const fieldsValue = getFieldsValue();
        const {
            returnAmountImgArr,
            interestMoneyImgArr,
            serviceChargeImgArr,
            managementCostImgArr,
            otherExpensesImgArr,
            defaultInterestImgArr,
            penalSumImgArr,
            retDepositImageArr,
            retServiceChargeImageArr,
            retInterestMoneyImageArr,


            returnAmountImageUploadFinish,
            interestMoneyImageUploadFinish,
            serviceChargeImageUploadFinish,
            managementCostImageUploadFinish,
            otherExpensesImageUploadFinish,
            defaultInterestImageUploadFinish,
            penalSumImageUploadFinish,
            retDepositImageUploadFinish,
            retServiceChargeImageUploadFinish,
            retInterestMoneyImageUploadFinish,

        } = this.state;
        if (
            !returnAmountImageUploadFinish && !interestMoneyImageUploadFinish &&
            !serviceChargeImageUploadFinish && !managementCostImageUploadFinish &&
            !otherExpensesImageUploadFinish && !otherExpensesImageUploadFinish &&
            !defaultInterestImageUploadFinish && !penalSumImageUploadFinish &&
            !retDepositImageUploadFinish && !retServiceChargeImageUploadFinish &&
            !retInterestMoneyImageUploadFinish
        ) {
            message.warn('图片未上传完成');
            return;
        }

        const params = {
            id: this.state.currentPayId,
            productId: this.props.productId,
            echoVoucherJson: returnAmountImgArr.length > 0 ? JSON.stringify(returnAmountImgArr) : '[]',
            shouxiVoucherJson: interestMoneyImgArr.length > 0 ? JSON.stringify(interestMoneyImgArr) : '[]',
            otherVoucherJson: otherExpensesImgArr.length > 0 ? JSON.stringify(otherExpensesImgArr) : '[]',
            defautInterest: fieldsValue.defautInterest === undefined ? '' : fieldsValue.defautInterest,
            penalSum: fieldsValue.penalSum === undefined ? '' : fieldsValue.penalSum,
            returnAmount: fieldsValue.returnAmount,
            interestMoney: fieldsValue.interestMoney,
            otherExpenses: fieldsValue.otherExpenses,
            remarks: fieldsValue.remarks,
            defautInterestVoucherJson: defaultInterestImgArr.length > 0 ? JSON.stringify(defaultInterestImgArr) : '[]',
            penalSumVoucherJson: penalSumImgArr.length > 0 ? JSON.stringify(penalSumImgArr) : '[]',
            serviceChargeVoucherJson: serviceChargeImgArr.length > 0 ? JSON.stringify(serviceChargeImgArr) : '[]',
            serviceChargeUP: fieldsValue.serviceCharge,
            managementCostVoucherJson: managementCostImgArr.length > 0 ? JSON.stringify(managementCostImgArr) : '[]',
            managementCostUP: fieldsValue.managementCost,
            retInterestMoney: fieldsValue.retInterestMoney,
            retServiceChargeUP: fieldsValue.retServiceChargeUP,
            retDeposit: fieldsValue.retDeposit,
            retInterestMoneyVoucherJson: retInterestMoneyImageArr.length > 0 ? JSON.stringify(retInterestMoneyImageArr) : '[]',
            retServiceChargeUPVoucherJson: retServiceChargeImageArr.length > 0 ? JSON.stringify(retServiceChargeImageArr) : '[]',
            retDepositVoucherJson: retDepositImageArr.length > 0 ? JSON.stringify(retDepositImageArr) : '[]',
        };

        this._onModalSubmitRequest(params);
    };

    //  还款状态提交
    _onModalSubmitDebounce = LodashDebounce(this._onModalSubmit);

    _onModalSubmitRequest = (params) => {
        if (this.state.modalVisible) {
            this.setState({modalVisible: false});
        }
        if (!this.state.isLoading) {
            this.setState({isLoading: true});
        }
        request(api.loansRepaymentSave, params, 'post', session.get('token'))
            .then(res => {
                if (res.success) {
                    this._getLoansRepaymentList(this.props.productId);
                    this._getModalTableDataSource(params.id);
                    message.success('提交成功');
                    // 提交后重置为下一次还款做准备
                    // this.setState({
                    //     defautInterest: undefined,
                    //     penalSum: undefined,
                    //     receiveEchoVoucherJson: [],
                    //     receiveShouXiVoucherJson: [],
                    //     receiveOtherVoucherJson: [],
                    // });
                    this._getDefault();
                } else {
                    this.setState({isLoading: false});
                    if (res.message) {
                        message.warn(res.message);
                    } else {
                        message.warn('请求失败');
                    }
                }
            })
            .catch(err => {
                message.error('请求服务异常');
                this.setState({isLoading: false});
            });
    };


    _getLoansRepaymentInfo = (id) => {
        request(`${api.loansRepaymentInfo}${id}`, {}, 'get', session.get('token'))
            .then(res => {
                if (res.success) {
                    const {
                        echoVoucherJson,
                        shouxiVoucherJson,
                        otherVoucherJson,
                        defautInterestVoucherJson,
                        penalSumVoucherJson,
                        serviceChargeVoucherJson,
                        managementCostVoucherJson,
                        retInterestMoneyVoucherJson,
                        retServiceChargeUPVoucherJson,
                        retDepositVoucherJson,
                    } = res.data;
                    this.setState({
                        returnAmountJson: echoVoucherJson !== undefined && echoVoucherJson !== '[]' ? this._imgDataFormat(echoVoucherJson) : [],
                        interestMoneyJson: shouxiVoucherJson !== undefined && shouxiVoucherJson !== '[]' ? this._imgDataFormat(shouxiVoucherJson) : [],
                        otherExpensesJson: otherVoucherJson !== undefined && otherVoucherJson !== '[]' ? this._imgDataFormat(otherVoucherJson) : [],
                        serviceChargeJson: serviceChargeVoucherJson !== undefined && serviceChargeVoucherJson !== '[]' ? this._imgDataFormat(serviceChargeVoucherJson) : [],
                        managementCostJson: managementCostVoucherJson !== undefined && managementCostVoucherJson !== '[]' ? this._imgDataFormat(managementCostVoucherJson) : [],
                        defaultInterestJson: defautInterestVoucherJson !== undefined && defautInterestVoucherJson !== '[]' ? this._imgDataFormat(defautInterestVoucherJson) : [],
                        penalSumJson: penalSumVoucherJson !== undefined && penalSumVoucherJson !== '[]' ? this._imgDataFormat(penalSumVoucherJson) : [],
                        retDepositJson: retDepositVoucherJson !== undefined && retDepositVoucherJson !== '[]' ? this._imgDataFormat(retDepositVoucherJson) : [],
                        retServiceChargeUPJson: retServiceChargeUPVoucherJson !== undefined && retServiceChargeUPVoucherJson !== '[]' ? this._imgDataFormat(retServiceChargeUPVoucherJson) : [],
                        retInterestMoneyJson: retInterestMoneyVoucherJson !== undefined && retInterestMoneyVoucherJson !== '[]' ? this._imgDataFormat(retInterestMoneyVoucherJson) : [],

                        returnAmountImgArr: echoVoucherJson !== undefined && echoVoucherJson !== '[]' ? echoVoucherJson : [],
                        interestMoneyImgArr: shouxiVoucherJson !== undefined && shouxiVoucherJson !== '[]' ? shouxiVoucherJson : [],
                        serviceChargeImgArr: serviceChargeVoucherJson !== undefined && serviceChargeVoucherJson !== '[]' ? serviceChargeVoucherJson : [],
                        managementCostImgArr: managementCostVoucherJson !== undefined && managementCostVoucherJson !== '[]' ? managementCostVoucherJson : [],
                        otherExpensesImgArr: otherVoucherJson !== undefined && otherVoucherJson !== '[]' ? otherVoucherJson : [],
                        defaultInterestImgArr: defautInterestVoucherJson !== undefined && defautInterestVoucherJson !== '[]' ? defautInterestVoucherJson : [],
                        penalSumImgArr: penalSumVoucherJson !== undefined && penalSumVoucherJson !== '[]' ? penalSumVoucherJson : [],
                        retDepositImageArr: retDepositVoucherJson !== undefined && retDepositVoucherJson !== '[]' ? retDepositVoucherJson : [],
                        retServiceChargeImageArr: retServiceChargeUPVoucherJson !== undefined && retServiceChargeUPVoucherJson !== '[]' ? retServiceChargeUPVoucherJson : [],
                        retInterestMoneyImageArr: retInterestMoneyVoucherJson !== undefined && retInterestMoneyVoucherJson !== '[]' ? retInterestMoneyVoucherJson : [],
                    });
                }
                this.setState({isLoading: false});
            })
            .catch(err => {
                message.error('请求服务异常');
                this.setState({isLoading: false});
            });
    };

    _renderModalFooter = () => {
        if (this.state.modalType === ModalType[0]) {
            return (
                <div>
                    <Button
                        type='primary'
                        onClick={this._onModalSubmitDebounce}
                        className='green-style'
                    >
                        提交
                    </Button>
                </div>
            )
        } else {
            return null;
        }
    };

    /**
     * @desc 财务还款中确认完成提交到还
     * */
    _onSubmit = () => {
        if (!this.state.isLoading) {
            this.setState({isLoading: true});
        }
        const {productId} = this.props;
        const params = {productId};
        request(api.loanFinishSubmit, params, 'post', session.get('token'))
            .then(res => {
                if (res.success) {
                    message.success(res.message);
                    this._getProductInfo(productId);
                    this._getLoansRepaymentList(productId);
                } else {
                    this.setState({isLoading: false});
                    message.warn(res.message);
                }
            })
            .catch(err => {
                message.error('请求服务异常');
                this.setState({isLoading: false});
            });
    };

    _onHandleFormBack = () => {
        hashHistory.replace('/finance');
    };

    _onCompleteRepaymentSingleList = (id) => {
        if (!this.state.isLoading) {
            this.setState({isLoading: true});
        }
        const params = {
            id,
            productId: this.props.productId,
            remarks: this.state.promptValue,
        };
        request(api.loansRepaymentSubmit, params, 'POST', session.get('token'))
            .then(res => {
                this.setState({isLoading: false});
                if (res.success) {
                    this.setState({promptValue: ''});
                    this._getLoansRepaymentList(this.props.productId);
                } else {
                    if (res.message) {
                        message.warn(res.message);
                    } else {
                        message.warn('请求失败');
                    }
                }
            })
            .catch(err => {
                this.setState({isLoading: false});
                message.error('请求服务异常');
            });
    };

    _onCompleteRepaymentSingleListDebounce = LodashDebounce(id => this._onCompleteRepaymentSingleList(id));

    _onConfirm = (id) => {
        this.setState({
            listId: id,
            promptVisible: true,
        });
    };

    _setPromptState = (promptVisible) => {
        this.setState({promptVisible});
    };

    _onPromptOk = (promptValue) => {
        const {listId} = this.state;
        if (this.state.listId === null) {
            return;
        }
        this.setState({promptValue}, () => {
            this._onCompleteRepaymentSingleListDebounce(listId);
        });
    };

    _onAdvanceCompleteConfirm = () => {
        Modal.confirm({
            title: '提前还款',
            content: '确定提前还款吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: LodashDebounce(() => this._onAdvanceComplete()),
        });
    };

    _onAdvanceComplete = () => {
        this.setState({isLoading: true});
        const params = {
            productId: this.props.productId
        };
        request(api.advancePay, params, 'GET', session.get('token'))
            .then(res => {
                this.setState({isLoading: false});
                if (res.success) {
                    this._getLoansRepaymentList(this.props.productId);
                } else {
                    if (res.message) {
                        message.warn(res.message);
                    } else {
                        message.warn('请求失败');
                    }
                }
            })
            .catch(err => {
                this.setState({isLoading: false});
                message.error('请求服务异常');
            });
    };

    render() {
        const {financeCustomerName, currentPayBeOverdue, modalType, productStage, isNeedAdvanceComplete} = this.state;
        let customerName = '';
        if (financeCustomerName) {
            customerName = financeCustomerName;
        }
        return (
            <Spin spinning={this.state.isLoading} size="large" className="loan-application-detail-spin">
                <Form style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <div className='advance-btn'>
                            <Button
                                disabled={isNeedAdvanceComplete === false}
                                style={{height: '100px', width: '40px', padding: '0'}}
                                className='green-style'
                                onClick={this._onAdvanceCompleteConfirm}
                            >
                                提<br/>前<br/>还<br/>款
                            </Button>
                        </div>
                        <div className='padding15'>
                            <Table
                                bordered
                                rowKey={record => record.id}
                                columns={this._tableColumns}
                                dataSource={this.state.tableDataSource}
                                onChange={this._onTableChange}
                                pagination={false}
                            />
                        </div>
                        <div className="gray-bettw"/>
                        {/*<Voucher*/}
                        {/*form={this.props.form}*/}
                        {/*title='一次性收费凭证'*/}
                        {/*inputLabel='实收费用'*/}
                        {/*inputFieldName='onceReceiptMoney'*/}
                        {/*oneTimeCharge={this.state.oneTimeCharge}*/}
                        {/*inputInitialValue={this.state.onceReceiptMoney}*/}
                        {/*imgFileList={this.state.receiveOnceReceiptVoucherJson}*/}
                        {/*onPicturesWallChange={this._onLoanImgChange}*/}
                        {/*disabled={productStage ? productStage === stageRepaymentFinish : false}*/}
                        {/*imgDelete={productStage ? !(productStage === stageRepaymentFinish) : true}*/}
                        {/*/>*/}
                    </Row>

                    <Row style={{width: '100%', marginBottom: '60px', padding: '15px'}} type='flex' justify='start'>
                        {/*{*/}
                        {/*productStage === stageWaitForRepayment &&*/}
                        {/*<Col>*/}
                        {/*<Button*/}
                        {/*className='green-style'*/}
                        {/*onClick={() => this._onSaveDebounce('save')}*/}
                        {/*>*/}
                        {/*保存*/}
                        {/*</Button>*/}
                        {/*</Col>*/}
                        {/*}*/}
                        {
                            productStage === stageWaitForRepayment &&
                            <Col>
                                <Button
                                    style={{marginLeft: '10px'}}
                                    className='green-style'
                                    onClick={() => this._onConfirmComplete('submit')}
                                >
                                    确认还款完成
                                </Button>
                            </Col>
                        }
                        <Col>
                            <Button
                                className="default-btn"
                                style={{marginLeft: '10px'}}
                                onClick={this._onHandleFormBack}>
                                返回
                            </Button>
                        </Col>
                    </Row>

                    <Modal
                        title={`${customerName}客户第${this.state.currentPayPeriod}期还款`}
                        visible={this.state.modalVisible}
                        onCancel={this._onCancel}
                        footer={null}
                        destroyOnClose={true}
                        width='80%'
                        bodyStyle={{height: `${document.body.clientWidth * 0.8}px`, overflow: 'auto'}}
                    >
                        <div className='modal-content'>
                            <Row>
                                <Col span={12} className='col left'>
                                    <InputItem
                                        form={this.props.form}
                                        label='实收本金'
                                        fieldName='returnAmount'
                                        disabled={modalType === ModalType[1]}
                                    />
                                    <ImgUpload
                                        defaultFileList={this.state.returnAmountJson}
                                        onPicturesWallChange={this._onReturnAmountPictureChange}
                                        disabled={modalType === ModalType[1]}
                                        isDelete={ModalImgDeletable}
                                    />
                                </Col>
                                <Col span={12} className='col left right'>
                                    <InputItem
                                        form={this.props.form}
                                        label='实收利息'
                                        fieldName='interestMoney'
                                        disabled={modalType === ModalType[1]}
                                    />
                                    <ImgUpload
                                        defaultFileList={this.state.interestMoneyJson}
                                        onPicturesWallChange={this._onInterestMoneyPictureChange}
                                        disabled={modalType === ModalType[1]}
                                        isDelete={ModalImgDeletable}
                                    />
                                </Col>
                                <Col span={12} className='col left'>
                                    <InputItem
                                        form={this.props.form}
                                        label='实收居间服务费'
                                        fieldName='serviceCharge'
                                        disabled={modalType === ModalType[1]}
                                    />
                                    <ImgUpload
                                        defaultFileList={this.state.serviceChargeJson}
                                        onPicturesWallChange={this._onServiceChargePictureChange}
                                        disabled={modalType === ModalType[1]}
                                        isDelete={ModalImgDeletable}
                                    />
                                </Col>
                                <Col span={12} className='col left right'>
                                    <InputItem
                                        form={this.props.form}
                                        label='实收综合费用'
                                        fieldName='managementCost'
                                        disabled={modalType === ModalType[1]}
                                    />
                                    <ImgUpload
                                        defaultFileList={this.state.managementCostJson}
                                        onPicturesWallChange={this._onManagementCostPictureChange}
                                        disabled={modalType === ModalType[1]}
                                        isDelete={ModalImgDeletable}
                                    />
                                </Col>
                                <Col span={12} className='col left'>
                                    <InputItem
                                        form={this.props.form}
                                        label='其他费用'
                                        fieldName='otherExpenses'
                                        disabled={modalType === ModalType[1]}
                                    />
                                    <ImgUpload
                                        defaultFileList={this.state.otherExpensesJson}
                                        onPicturesWallChange={this._onOtherExpensesPictureChange}
                                        disabled={modalType === ModalType[1]}
                                        isDelete={ModalImgDeletable}
                                    />
                                </Col>
                                <Col span={12} className='col left right'>
                                    <InputItem
                                        form={this.props.form}
                                        label='罚息'
                                        fieldName='defautInterest'
                                        disabled={modalType === ModalType[1]}
                                    />
                                    <ImgUpload
                                        defaultFileList={this.state.defaultInterestJson}
                                        onPicturesWallChange={this._onDefaultInterestPictureChange}
                                        disabled={modalType === ModalType[1]}
                                        isDelete={ModalImgDeletable}
                                    />
                                    {/*<span className='img-empty'>*/}
                                    {/*<div style={{fontSize: '21px'}}>+</div>*/}
                                    {/*<div>上传</div>*/}
                                    {/*<div>{`（<10M）`}</div>*/}
                                    {/*</span>*/}
                                </Col>
                                <Col span={12} className='col left'>
                                    <InputItem
                                        form={this.props.form}
                                        label='违约金'
                                        fieldName='penalSum'
                                        disabled={modalType === ModalType[1]}
                                    />
                                    <ImgUpload
                                        defaultFileList={this.state.penalSumJson}
                                        onPicturesWallChange={this._onPenalSumPictureChange}
                                        disabled={modalType === ModalType[1]}
                                        isDelete={ModalImgDeletable}
                                    />
                                </Col>
                                <Col span={12} className='col left right'>
                                    <InputItem
                                        form={this.props.form}
                                        label='实退利息金额'
                                        fieldName='retInterestMoney'
                                        disabled={modalType === ModalType[1]}
                                    />
                                    <ImgUpload
                                        defaultFileList={this.state.retInterestMoneyJson}
                                        onPicturesWallChange={this._onRetInterestMoneyPictureChange}
                                        disabled={modalType === ModalType[1]}
                                        isDelete={ModalImgDeletable}
                                    />
                                </Col>
                                <Col span={12} className='col left'>
                                    <InputItem
                                        form={this.props.form}
                                        label='实退居间服务费金额'
                                        fieldName='retServiceChargeUP'
                                        disabled={modalType === ModalType[1]}
                                    />
                                    <ImgUpload
                                        defaultFileList={this.state.retServiceChargeUPJson}
                                        onPicturesWallChange={this._onRetServiceChargeUPPictureChange}
                                        disabled={modalType === ModalType[1]}
                                        isDelete={ModalImgDeletable}
                                    />
                                </Col>
                                <Col span={12} className='col left bottom right'>
                                    <InputItem
                                        form={this.props.form}
                                        label='实退保证金金额'
                                        fieldName='retDeposit'
                                        disabled={modalType === ModalType[1]}
                                    />
                                    <ImgUpload
                                        defaultFileList={this.state.retDepositJson}
                                        onPicturesWallChange={this._onRetDepositPictureChange}
                                        disabled={modalType === ModalType[1]}
                                        isDelete={ModalImgDeletable}
                                    />
                                </Col>

                                <Col span={12} className='col left bottom right'>
                                    <Form.Item>
                                        {
                                            this.props.form.getFieldDecorator('remarks', {
                                                initialValue: undefined,
                                            })(
                                                <Input.TextArea
                                                    style={{marginTop: '10px'}}
                                                    placeholder="备注"
                                                    autosize={{minRows: 6, maxRows: 12}}
                                                    disabled={modalType === ModalType[1]}
                                                />
                                            )
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>
                            {
                                this.state.modalType === ModalType[0] &&
                                <Row>
                                    <Button
                                        style={{marginBottom: '10px', paddingLeft: '30px', paddingRight: '30px'}}
                                        type='primary'
                                        onClick={this._onModalSubmitDebounce}
                                        className='green-style'
                                    >
                                        提交
                                    </Button>
                                </Row>
                            }
                            <Row><h3>还款记录</h3></Row>
                            <Table
                                bordered
                                rowKey={record => record.id}
                                columns={this._modalTableColumns}
                                dataSource={this.state.modalTableDataSource}
                                onChange={this._onTableChange}
                                pagination={false}
                            />
                        </div>
                    </Modal>
                    <ModalPrompt
                        title='是否确认当期还款完成'
                        visible={this.state.promptVisible}
                        okFunc={this._onPromptOk}
                        promptVisible={this._setPromptState}
                    />
                </Form>
            </Spin>
        )
    }
}

const FinanceDetailLoanInfoExport = Form.create()(FinanceDetailLoanInfo);
export default FinanceDetailLoanInfoExport;
