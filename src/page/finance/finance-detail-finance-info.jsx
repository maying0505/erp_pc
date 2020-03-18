/**
 * @Create by John on 2018/03/28
 * @Desc 放款财务信息
 * */

import React from 'react';
import {message, Spin, Row, Form, Button, Col} from 'antd';

import './index.scss';
import api from 'common/util/api';
import {request} from 'common/request/request';
import {local, session} from 'common/util/storage';

import LodashDebounce from 'common/util/debounce';
import imgUrl from 'common/util/imgUrl.js'
import InfoShowCommon from 'component/info-show-common';
import Voucher from 'component/voucher';
import {hashHistory} from 'react-router';
import ModalDatePicker from 'component/ModalDatePicker';
import PriBorrInfoShow from 'component/pri-borr-info-show';

const stageConfirmLoan = '9';           // 待确认放款
const stageWaitForRepayment = '10';     // 待还款
const stageRepaymentFinish = '11';      // 还款完成
const MDPTLoan = '放款';
const MDPTExtension = '展期开始';
const MDPTExt = '展期';


class FinanceDetailFinanceInfo extends React.Component {

    state = {
        isLoading: false,
        InfoObj: {},
        loanVoucherJson: [],
        brokerageVoucherJson: [],
        receiveLoanVoucherJson: [],
        receiveBrokerageVoucherJson: [],
        loanMoney: undefined,
        brokerageMoney: undefined,
        productStage: null,

        brokerageVoucherJsonImageUploadFinish: true,
        loanVoucherJsonImageUploadFinish: true,

        modalDatePickerVisible: false,
        modalDatePickerValue: null,

        priLoanInfo: {},
        ifExtension: false,
        priPictureDataJson: {},
    };

    _infoValueShow = (isDefer) => {
        return [
            {id: '1', label: '客户姓名', valueName: ['name']},
            {id: '2', label: '联系电话', valueName: ['phone']},
            {id: '3', label: '证件类型', valueName: ['certificateType']},
            {id: '4', label: '证件号码', valueName: ['certificateNo']},
            {id: '5', label: this._getTitle(isDefer, '产品金额'), valueName: ['proName']},
            {id: '6', label: '业务员', valueName: ['salesman']},
            {id: '7', label: this._getTitle(isDefer, '金额', '借款'), valueName: ['lendMoney']},
            {id: '8', label: this._getTitle(isDefer, '期限', '借款'), valueName: ['deadline', 'deadlineUnit']},
            {id: '9', label: this._getTitle(isDefer, '利率', '借款'), valueName: ['apr', 'aprUnit', 'aprType']},
            {id: '10', label: this._getTitle(isDefer, '还款方式'), valueName: ['refundWar']},
            {id: '11', label: this._getTitle(isDefer, '用途', '借款'), valueName: ['purpose']},
            {
                id: '12',
                label: this._getTitle(isDefer, '居间服务费率'),
                valueName: ['serviceTariffing', 'serviceUnit', 'serviceType']
            },
            {id: '13', label: this._getTitle(isDefer, '服务期限'), valueName: ['serviceDeadline', 'serviceDeadlineUnit']},
            {id: '14', label: this._getTitle(isDefer, '居间服务费收取方式'), valueName: ['takenMode']},
        ];
    };

    _serviceCostInfo = (isDefer) => {
        return [
            {id: '0', label: this._getTitle(isDefer, '中介费'), valueName: ['agencyFee']},
            {id: '1', label: this._getTitle(isDefer, '下户费'), valueName: ['nextFee']},
            {id: '2', label: this._getTitle(isDefer, '评估费'), valueName: ['evaluationFee']},
            {id: '3', label: this._getTitle(isDefer, '管理费'), valueName: ['manageFee']},
            {id: '4', label: this._getTitle(isDefer, '保证金'), valueName: ['parkingFee']},
            {id: '5', label: this._getTitle(isDefer, 'GPS费'), valueName: ['gpsFee']},
            {id: '6', label: this._getTitle(isDefer, '保险费'), valueName: ['premium']},
            {id: '7', label: this._getTitle(isDefer, '担保费'), valueName: ['guaranteeFee']},
            {id: '8', label: this._getTitle(isDefer, '其他费用'), valueName: ['otherFee']},
        ];
    };


    borrowerInfo = [
        {id: '0', label: '出借人', valueName: ['lender']},
        {id: '1', label: '收款人', valueName: ['gatheringName']},
        {id: '2', label: '收款账号', valueName: ['gatheringNo']},
        {id: '3', label: '开户行', valueName: ['bankName']},
    ];

    componentDidMount() {
        const {borrowerId, productId,} = this.props;
        this._getBorrowerInfo(borrowerId);
        this._getProductInfo(productId);
    }

    _getBorrowerInfo = (borrowerId) => {
        if (!this.state.isLoading) {
            this.setState({isLoading: true,});
        }
        request(`${api.customerByGet}${borrowerId}`, {}, 'Get', session.get('token'))
            .then(res => {
                if (res.success) {
                    const {name, certificateNo, phone, certificateType} = res.data;
                    const customerInfoObj = Object.assign({}, this.state.InfoObj, {
                        name: name,
                        phone: phone,
                        certificateNo: certificateNo,
                        certificateType: certificateType,
                    });
                    session.set('financeCustomerName', name);
                    this.setState({InfoObj: customerInfoObj});
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

    _getProductInfo = (productId) => {
        if (!this.state.isLoading) {
            this.setState({isLoading: true,});
        }
        request(`${api.productByGet}${productId}`, {}, 'Get', session.get('token'))
            .then(res => {
                if (res.success) {
                    const productInfoObj = Object.assign({}, this.state.InfoObj, res.data);
                    const {loanVoucherJson, brokerageVoucherJson, loanMoney, brokerageMoney, stage, parentId} = res.data;
                    this.setState({
                        productStage: stage,
                        InfoObj: productInfoObj,
                        loanVoucherJson: loanVoucherJson ? loanVoucherJson : [],
                        brokerageVoucherJson: brokerageVoucherJson ? brokerageVoucherJson : [],
                        receiveLoanVoucherJson: loanVoucherJson ? this._imgDataFormat(loanVoucherJson) : [],
                        receiveBrokerageVoucherJson: brokerageVoucherJson ? this._imgDataFormat(brokerageVoucherJson) : [],
                        loanMoney: loanMoney ? loanMoney : null,
                        brokerageMoney: brokerageMoney ? brokerageMoney : null,
                    });
                    this.props.setProductStage(stage);
                    if (parentId && parentId !== '0') {
                        this._loadOriginalLoanInfo(productId);
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


    _imgDataFormat = (imgDataJson) => { //资料图片显示处理
        let imgDataArr = [];
        for (let item of imgDataJson) {
            imgDataArr.push({
                url: item[imgUrl.small] ? item[imgUrl.small] : '',
                bigBUrl: item[imgUrl.bigB] ? item[imgUrl.bigB]: '',
                bigUrl: item[imgUrl.big] ? item[imgUrl.big] : '',
                uid: `${item.fileName}${Math.random()}`,
                status: 'done',
            });
        }
        return imgDataArr;
    };

    _onLoanImgChange = (fileList, index, style, status) => {
        if (status === 'uploading') {
            return;
        }
        let ls = [];
        const {loanVoucherJson} = this.state;
        let isImageUploadFinish = true;
        if (fileList.length > 0) {
            fileList.forEach(item => {
                if (item.response && item.response.data) {
                    ls.push(item.response.data);
                }
                if (item.status !== 'done') {
                    isImageUploadFinish = false;
                }
                for (let it of loanVoucherJson) {
                    if (it[imgUrl.small] === item.url) {
                        ls.push(it);
                    }
                }
            });
        }
        this.setState({
            loanVoucherJson: ls,
            loanVoucherJsonImageUploadFinish: isImageUploadFinish,
        });
    };

    _onBrokerageImgChange = (fileList, index, style, status) => {
        if (status === 'uploading') {
            return;
        }
        let ls = [];
        const {brokerageVoucherJson} = this.state;
        let isImageUploadFinish = true;
        if (fileList.length > 0) {
            fileList.forEach(item => {
                if (item.response && item.response.success && item.response.data) {
                    ls.push(item.response.data);
                }
                if (item.status !== 'done') {
                    isImageUploadFinish = false;
                }
                for (let it of brokerageVoucherJson) {
                    if (it[imgUrl.small] === item.url) {
                        ls.push(it);
                    }
                }
            });
        }
        this.setState({
            brokerageVoucherJson: ls,
            brokerageVoucherJsonImageUploadFinish: isImageUploadFinish,
        });
    };

    /**
     * @desc 放款添加起息日
     * */
    _onDayOfInterest = () => {
        this._onSetModalDatePickerVisible(true);
    };

    /**
     * @desc 添加防抖，防止连击
     * */
    _onSaveDebounce = LodashDebounce((type) => this._onSave(type));


    /**
     * @desc 财务放款保存
     * @param type string， 'save'代表保存，'submit'代表确认还款完成
     * */
    _onSave = (type) => {
        const {getFieldsValue} = this.props.form;
        const {
            loanVoucherJson, brokerageVoucherJson,
            loanVoucherJsonImageUploadFinish, brokerageVoucherJsonImageUploadFinish
        } = this.state;
        if (!loanVoucherJsonImageUploadFinish && !brokerageVoucherJsonImageUploadFinish) {
            message.warn('图片未上传完成');
            return;
        }
        const {productId: id} = this.props;
        const money = getFieldsValue();
        const params = {
            id,
            ...money,
            loanVoucherJson: loanVoucherJson.length === 0 ? '[]' : JSON.stringify(loanVoucherJson),
            brokerageVoucherJson: brokerageVoucherJson.length === 0 ? '[]' : JSON.stringify(brokerageVoucherJson),
        };
        this._financeSave(type, params);
    };

    _financeSave = (type, params) => {
        if (!this.state.isLoading) {
            this.setState({isLoading: true,});
        }
        request(api.financeSave, params, 'post', session.get('token'))
            .then(res => {
                if (res.success) {
                    if (type === 'submit') {
                        this._onConfirmLoan();
                    } else if (type === 'save') {
                        message.success(res.message);
                        this._getProductInfo(this.props.productId);
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

    /*
    * @Desc 财务放款确认提交到还款中
    * @params productId 产品Id
    * */
    _onConfirmLoan = () => {
        if (!this.state.isLoading) {
            this.setState({isLoading: true,});
        }
        const {productId} = this.props;
        const {modalDatePickerValue: valueDate} = this.state;
        const params = {
            productId,
            valueDate,
        };
        request(api.loanGiveSubmit, params, 'post', session.get('token'))
            .then(res => {
                if (res.success) {
                    message.success(res.message);
                    this._getProductInfo(productId);
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

    _onHandleFormBack = () => {
        hashHistory.replace('/finance');
    };

    _onSetModalDatePickerVisible = (stateValue) => {
        this.setState({modalDatePickerVisible: stateValue});
    };

    _onModalDateOkPress = (value) => {
        if (value === null) {
            message.warn('请选择放款日期');
            return;
        }
        this._onSetModalDatePickerVisible(false);
        this.setState({modalDatePickerValue: value}, () => {
            this._onSaveDebounce('submit');
        });
    };

    _getTitle = (isDefer, titleItem, prefix = '', prefixE = MDPTExt) => {
        return (isDefer ? prefixE : prefix) + titleItem;

    };

    _loadOriginalLoanInfo = (parentProductId) => {
        request(`${api.productByGet}${parentProductId}`, {}, 'Get', session.get('token'))
            .then(res => {
                this.setState({isLoading: false});
                if (res.success) {
                    if (res.data.pawnMaterialJson) { //处理抵押物资料
                        this.setState({
                            priPictureDataJson: {
                                ...this.state.priPictureDataJson,
                                pawnMaterialJson: res.data.pawnMaterialJson,
                                pawnMaterialDefaultJson: this._imgDataDo(res.data.pawnMaterialJson)
                            }
                        });
                    }
                    if (res.data.fieldSurveyJson) { //现场调查资料
                        this.setState({
                            priPictureDataJson: {
                                ...this.state.priPictureDataJson,
                                fieldSurveyJson: res.data.fieldSurveyJson,
                                fieldSurveyDefaultJson: this._imgDataDo(res.data.fieldSurveyJson)
                            }
                        });
                    }
                    if (res.data.otherDetailsJson) { //其他资料
                        this.setState({
                            priPictureDataJson: {
                                ...this.state.priPictureDataJson,
                                otherDetailsJson: res.data.otherDetailsJson,
                                otherDetailsDefaultJson: this._imgDataDo(res.data.otherDetailsJson)
                            }
                        });
                    }
                    if (res.data.situationJson) { //风控措施执行情况
                        this.setState({
                            priPictureDataJson: {
                                ...this.state.priPictureDataJson,
                                situationJson: res.data.situationJson,
                                situationDefaultJson: this._imgDataDo(res.data.situationJson)
                            }
                        });
                    }
                    if (res.data.signedJson) { //签约资料
                        this.setState({
                            priPictureDataJson: {
                                ...this.state.priPictureDataJson,
                                signedJson: res.data.signedJson,
                                signedDefaultJson: this._imgDataDo(res.data.signedJson)
                            }
                        });
                    }
                    if (res.data.loanVoucherJson) { //放款凭证
                        this.setState({
                            priPictureDataJson: {
                                ...this.state.priPictureDataJson,
                                loanVoucherJson: res.data.loanVoucherJson,
                                loanVoucherDefaultJson: this._imgDataDo(res.data.loanVoucherJson)
                            }
                        });
                    }
                    this.setState({priLoanInfo: res});
                    if (res.data.parentId !== '0' && res.data.parentId) {
                        this.setState({ifExtension: true})
                    } else {
                        this.setState({ifExtension: false})
                    }
                } else {
                    let msg = res.message ? res.message : '请求失败';
                    message.error(msg);
                }
            })
            .catch(err => {
                console.log('err', err);
                message.error('请求服务异常');
                this.setState({isLoading: false});
            });
    };

    _exchangePriBorrInfoState = () => {
        const {exchangeShowPriBorrInfo} = this.props;
        exchangeShowPriBorrInfo && exchangeShowPriBorrInfo();
    };

    _imgDataDo = (imgDataJson) => {
        let imgDatas = [];
        for (let item of imgDataJson) {
            let imgData = {};
            imgData['bigUrl'] = item[imgUrl.big] ? item[imgUrl.big] : '';
            imgData['bigBUrl'] = item[imgUrl.bigB] ? item[imgUrl.bigB]: '';
            imgData['url'] = item[imgUrl.small] ? item[imgUrl.small] : '';
            imgData['uid'] = `${item.fileName}${Math.random()}`;
            imgData['status'] = 'done';
            imgDatas.push(imgData);
        }
        return imgDatas
    };


    _onDownloadCheckTableDebounce = LodashDebounce((type) => this._onDownloadCheckTable(type));

    _onDownloadCheckTable = () => {
        const {productId,} = this.props;
        request(api.checkTable + productId, {}, 'Get', session.get('token'))
            .then(res => {
                if (res.success && res.data) {
                    this._onDownFile(res.data);
                } else {
                    message.error('下载失败');
                }
            })
            .catch(err => {
                message.error('请求服务员异常')
            });
    };

    _onDownFile = (downloadUrl) => {
        const triggerDelay = 100;
        const removeDelay = 1000;
        if (!downloadUrl) {
            return;
        }
        let item = {downloadUrl};
        this._createIFrame(item, triggerDelay, removeDelay);
    };

    _createIFrame = (item, triggerDelay, removeDelay) => {
        setTimeout(() => {
            const iFrame = document.createElement('iframe');
            iFrame.style.display = 'none';
            iFrame.src = item.downloadUrl;
            document.body.appendChild(iFrame);
            setTimeout(() => {
                document.body.removeChild(iFrame);
            }, removeDelay);
        }, triggerDelay);
    };

    render() {
        const {productStage, modalDatePickerVisible} = this.state;
        const {isDefer, deferDate, ifShowPriBorrInfo} = this.props;
        let title = isDefer ? MDPTExtension : MDPTLoan;
        const modalDatePickerTitle = `请设置${title}日期`;
        const modalDatePickerPlaceholder = `--请选择${title}日期--`;

        return (
            <Spin spinning={this.state.isLoading} size="large" className="loan-application-detail-spin">
                <Row style={{width: '100%'}}>
                    {
                        Object.keys(this.state.InfoObj).length > 0 &&
                        <div>
                            <InfoShowCommon
                                defaultValueShow={(() => this._infoValueShow(isDefer))()}
                                defaultValue={this.state.InfoObj}
                                defaultTitle={`${isDefer ? '展期' : ''}产品信息`}
                            />
                            <div className="gray-bettw"/>
                            <InfoShowCommon
                                defaultValueShow={(() => this._serviceCostInfo(isDefer))()}
                                defaultValue={this.state.InfoObj}
                                defaultTitle={`${isDefer ? '展期' : ''}综合费用`}
                            />
                            <div className="gray-bettw"/>
                            <InfoShowCommon
                                defaultValueShow={this.borrowerInfo}
                                defaultValue={this.state.InfoObj}
                                defaultTitle='借收人'
                            />
                        </div>
                    }
                </Row>
                <Row style={{width: '100%'}}>
                    <div className="gray-bettw"/>
                    <Form>
                        <Voucher
                            form={this.props.form}
                            title='放款凭证'
                            inputLabel='放款金额'
                            downloadButtonTitle='下载审批单'
                            downloadFunc={this._onDownloadCheckTableDebounce}
                            inputFieldName='loanMoney'
                            inputInitialValue={this.state.loanMoney}
                            onPicturesWallChange={this._onLoanImgChange}
                            imgFileList={this.state.receiveLoanVoucherJson}
                            disabled={productStage ? !(productStage === stageConfirmLoan) : false}
                            imgDelete={productStage ? productStage === stageConfirmLoan : true}
                        />
                    </Form>
                </Row>
                <Row style={{width: '100%'}}>
                    <div className="gray-bettw"/>
                    <Form>
                        <Voucher
                            form={this.props.form}
                            title='返佣凭证'
                            inputLabel='返佣金额'
                            inputFieldName='brokerageMoney'
                            inputInitialValue={this.state.brokerageMoney}
                            onPicturesWallChange={this._onBrokerageImgChange}
                            imgFileList={this.state.receiveBrokerageVoucherJson}
                            disabled={false}
                            imgDelete={productStage ? !(productStage === stageRepaymentFinish) : true}
                        />
                    </Form>
                </Row>

                <Row style={{width: '100%', marginBottom: '60px', padding: '15px'}} type='flex' justify='start'>
                    {
                        (productStage === stageConfirmLoan || productStage === stageWaitForRepayment) &&
                        <Col>
                            <Button
                                style={{marginRight: '10px'}}
                                className='green-style'
                                onClick={() => this._onSaveDebounce('save')}
                            >
                                保存
                            </Button>
                        </Col>
                    }
                    {
                        productStage === stageConfirmLoan &&
                        <Col>
                            <Button
                                className='green-style'
                                style={{marginRight: '10px'}}
                                onClick={() => this._onDayOfInterest('submit')}
                            >
                                确认放款
                            </Button>
                        </Col>
                    }
                    <Col>
                        <Button
                            className="default-btn"
                            onClick={this._onHandleFormBack}>
                            返回
                        </Button>
                    </Col>
                </Row>
                <PriBorrInfoShow
                    ifExtension={this.state.ifExtension}
                    ifLoanApplication={true}
                    LoanInfo={this.state.priLoanInfo}
                    visible={ifShowPriBorrInfo}
                    cancelPriBorrInfo={this._exchangePriBorrInfoState}
                    pictureDataJson={this.state.priPictureDataJson}
                />
                <ModalDatePicker
                    format='YYYY-MM-DD'
                    title={modalDatePickerTitle}
                    visible={modalDatePickerVisible}
                    okFunc={this._onModalDateOkPress}
                    placeholder={modalDatePickerPlaceholder}
                    initialValue={deferDate}
                    modalVisible={this._onSetModalDatePickerVisible}
                />
            </Spin>
        )
    }
}

const FinanceDetailFinanceInfoExport = Form.create()(FinanceDetailFinanceInfo);
export default FinanceDetailFinanceInfoExport;
