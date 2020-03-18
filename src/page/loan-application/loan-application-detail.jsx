import React from 'react'
import {Tabs, Card, Divider, message, Button, Modal, Icon} from 'antd'
import LoanBusinessInfomation from './loan-business-information.jsx'
import LoanEssentialInfomation from './loan-essential-information.jsx'
import CustomerInfoShow from 'component/customer-info-show'
import LoanInfoShow from 'component/loan-info-show'
import PriBorrInfoShow from 'component/pri-borr-info-show'
import {request} from 'common/request/request.js'
import imgUrl from 'common/util/imgUrl.js'
import {local, session} from 'common/util/storage.js'
import ApprovalProcess from 'component/approval-process'
import api from 'api'

import './index.scss'

import RepaymentCalculatorTable from 'component/CalculatorTable/CalculatorTable';

const TabPane = Tabs.TabPane;
const CheckType = ['Modify', 'Detail'];

const DataObj = {
    lendMoney: '借款金额',
    deadline: '借款期限',
    deadlineUnit: '借款期限单位',
    apr: '借款利率',
    aprUnit: '借款利率单位',
    aprType: '借款利率类型',
    refundWar: '还款方式',
    serviceDeadline: '服务期限',
    serviceDeadlineUnit: '服务期限单位',
    serviceTariffing: '居间服务费率',
    serviceUnit: '居间服务费率单位',
    serviceType: '居间服务费率类型',
    takenMode: '居间服务费收取方式',

    agencyFee: '中介费',
    parkingFee: '保证金',
    guaranteeFee: '担保费',
    nextFee: '下户费',
    gpsFee: 'GPS费',
    evaluationFee: '评估费',
    otherFee: '其他费用',
    manageFee: '管理费',
    premium: '保险费'
};

class LoanApplicationDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            productId: '',
            disabledTab: true,
            disabled: false,
            LoanInfo: {},
            pictureDataJson: {},
            tableDataSource: [],      // 还款详情计划表数据
            modalVisible: false,
            priLoanInfo: {},
            priPictureDataJson: {},
            ifShowPriBorrInfoBtn: false,
            ifShowPriBorrInfo: false,
            modalTableColumns: [
                {
                    title: '流程', dataIndex: 'stageStr', width: 100,
                    render: (value, row, index) => {
                        const obj = {
                            children: value,
                            props: {},
                        };
                        if (row.uuid) {
                            obj.props.rowSpan = row.uuid;
                        } else {
                            obj.props.rowSpan = 0;
                        }

                        return obj;
                    },
                },
                {
                    title: '流程结果', dataIndex: 'auditResultStr', width: 100,
                    render: (value, row, index) => {
                        const obj = {
                            children: value,
                            props: {},
                        };
                        if (row.uuid) {
                            obj.props.rowSpan = row.uuid;
                        } else {
                            obj.props.rowSpan = 0;
                        }

                        return obj;
                    },
                },
                {title: '操作员', dataIndex: 'name', width: 100},
                {title: '时间', dataIndex: 'submitTime', width: 100},
                {title: '结果', dataIndex: 'historyResult', width: 100},
                {title: '意见或原因', dataIndex: 'auditOpinion', width: 200},
            ],
            ifExtension: false
        }
    }

    componentWillMount() { //预加载数据
        console.log('this.props', this.props);
        if (this.props.params.id !== 'null') {
            const {params: {id}} = this.props;
            this.customerByInfoGet(id);
        }
        // if (this.props.params.status != '0' && this.props.params.productId != 'null') {
        if (this.props.params.productId != 'null') {
            this.props.params.status != '0' ?
                this.setState({
                    disabled: true,
                }) : null
            this.setState({
                productId: this.props.params.productId
            })
            this.loadDetail(this.props.params.productId)
        }
        session.remove('customerId')
    }

    disabledTabChange = () => {
        this.setState({
            disabledTab: false
        })
    }
    saveProductId = (productId) => {
        this.setState({
            productId: productId
        })
    }
    loadDetail = (productId, ifPriInfo) => {
        request(`${api.productByGet}${productId}`, {}, 'get', session.get('token')) //借款人信息详情
            .then(res => {
                this.setState({loading: false})
                if (ifPriInfo) {
                    this.setState({
                        priLoanInfo: res,
                    })
                    if (res.data.parentId !== '0' && res.data.parentId) {
                        this.setState({ifExtension: true})
                    } else {
                        this.setState({ifExtension: false})
                    }
                    if (res.success) {
                        if (res.data.pawnMaterialJson) { //处理抵押物资料
                            this.setState({
                                priPictureDataJson: {
                                    ...this.state.priPictureDataJson,
                                    pawnMaterialJson: res.data.pawnMaterialJson,
                                    pawnMaterialDefaultJson: this.imgDataDo(res.data.pawnMaterialJson)
                                }
                            }, function () {
                                console.log(this.state.priPictureDataJson)
                            })
                        }
                        if (res.data.fieldSurveyJson) { //现场调查资料
                            this.setState({
                                priPictureDataJson: {
                                    ...this.state.priPictureDataJson,
                                    fieldSurveyJson: res.data.fieldSurveyJson,
                                    fieldSurveyDefaultJson: this.imgDataDo(res.data.fieldSurveyJson)
                                }
                            }, function () {
                                console.log(this.state.priPictureDataJson)
                            })
                        }
                        if (res.data.otherDetailsJson) { //其他资料
                            this.setState({
                                priPictureDataJson: {
                                    ...this.state.priPictureDataJson,
                                    otherDetailsJson: res.data.otherDetailsJson,
                                    otherDetailsDefaultJson: this.imgDataDo(res.data.otherDetailsJson)
                                }
                            }, function () {
                                console.log(this.state.priPictureDataJson)
                            })
                        }
                        if (res.data.situationJson) { //风控措施执行情况
                            this.setState({
                                priPictureDataJson: {
                                    ...this.state.priPictureDataJson,
                                    situationJson: res.data.situationJson,
                                    situationDefaultJson: this.imgDataDo(res.data.situationJson)
                                }
                            }, function () {
                                console.log(this.state.priPictureDataJson)
                            })
                        }
                        if (res.data.signedJson) { //签约资料
                            this.setState({
                                priPictureDataJson: {
                                    ...this.state.priPictureDataJson,
                                    signedJson: res.data.signedJson,
                                    signedDefaultJson: this.imgDataDo(res.data.signedJson)
                                }
                            }, function () {
                                console.log(this.state.priPictureDataJson)
                            })
                        }
                        if (res.data.loanVoucherJson) { //放款凭证
                            this.setState({
                                priPictureDataJson: {
                                    ...this.state.priPictureDataJson,
                                    loanVoucherJson: res.data.loanVoucherJson,
                                    loanVoucherDefaultJson: this.imgDataDo(res.data.loanVoucherJson)
                                }
                            }, function () {
                                console.log(this.state.priPictureDataJson)
                            })
                        }

                    }
                } else {
                    this.setState({
                        LoanInfo: res,
                    })
                    if (res.success) {
                        if (res.data.pawnMaterialJson) { //处理抵押物资料
                            this.setState({
                                pictureDataJson: {
                                    ...this.state.pictureDataJson,
                                    pawnMaterialJson: res.data.pawnMaterialJson,
                                    pawnMaterialDefaultJson: this.imgDataDo(res.data.pawnMaterialJson)
                                }
                            }, function () {
                                console.log(this.state.pictureDataJson)
                            })
                        }
                        if (res.data.fieldSurveyJson) { //现场调查资料
                            this.setState({
                                pictureDataJson: {
                                    ...this.state.pictureDataJson,
                                    fieldSurveyJson: res.data.fieldSurveyJson,
                                    fieldSurveyDefaultJson: this.imgDataDo(res.data.fieldSurveyJson)
                                }
                            }, function () {
                                console.log(this.state.pictureDataJson)
                            })
                        }
                        if (res.data.otherDetailsJson) { //其他资料
                            this.setState({
                                pictureDataJson: {
                                    ...this.state.pictureDataJson,
                                    otherDetailsJson: res.data.otherDetailsJson,
                                    otherDetailsDefaultJson: this.imgDataDo(res.data.otherDetailsJson)
                                }
                            }, function () {
                                console.log(this.state.pictureDataJson)
                            })
                        }
                        if (res.data.parentId !== '0' && res.data.parentId) {
                            this.setState({ifShowPriBorrInfoBtn: true})
                            this.loadDetail(res.data.parentId, true)
                        }
                    }
                }
            })
            .catch(err => {
                this.setState({loading: false})
            })
    }
    imgDataDo = (imgDataJson) => { //资料图片显示处理
        let imgDatas = []
        for (let item of imgDataJson) {
            let imgData = {}
            imgData['bigUrl'] = item[imgUrl.big] ? item[imgUrl.big] : ''
            imgData['bigBUrl'] = item[imgUrl.bigB] ? item[imgUrl.bigB]: ''
            imgData['url'] = item[imgUrl.small] ? item[imgUrl.small] : ''
            imgData['uid'] = `${item.fileName}${Math.random()}`
            imgData['status'] = 'done'
            imgDatas.push(imgData)
        }
        return imgDatas
    }
    showPriBorrInfo = (e) => {
        this.setState({ifShowPriBorrInfo: true})
    }
    cancelPriBorrInfo = (e) => {
        this.setState({ifShowPriBorrInfo: false})
    }
    /**
     * @desc 查看还款详情计划表
     * @param checkType: sting oneOf ['Modify','Detail']
     * @param kIndex: number, default value null,
     * @param dataInfo: object 借款信息对象
     * */
    _onCheckRepaymentDetails = (checkType, kIndex, dataInfo) => {
        if (dataInfo && Object.keys(dataInfo).length > 0) {
            let dataObj = {};

            console.log('dataInfo', dataInfo);

            if (checkType === CheckType[0]) {
                const {
                    lendMoney, deadline, deadlineUnit, refundWar, apr, aprUnit, aprType, serviceDeadline,
                    serviceDeadlineUnit, serviceTariffing, serviceUnit, serviceType, takenMode,
                    agencyFee, parkingFee, guaranteeFee, nextFee, gpsFee, evaluationFee, otherFee, manageFee, premium
                } = dataInfo;

                dataObj = {
                    lendMoney: lendMoney[kIndex],
                    deadline: deadline[kIndex],
                    deadlineUnit: deadlineUnit[kIndex],
                    apr: apr[kIndex],
                    aprUnit: aprUnit[kIndex],
                    aprType: aprType[kIndex],
                    refundWar: refundWar[kIndex],
                    serviceTariffing: serviceTariffing[kIndex],
                    serviceUnit: serviceUnit[kIndex],
                    serviceType: serviceType[kIndex],
                    serviceDeadline: serviceDeadline[kIndex],
                    serviceDeadlineUnit: serviceDeadlineUnit[kIndex],
                    takenMode: takenMode[kIndex],
                    date: '',
                    agencyFee: agencyFee[kIndex],
                    parkingFee: parkingFee[kIndex],
                    guaranteeFee: guaranteeFee[kIndex],
                    nextFee: nextFee[kIndex],
                    gpsFee: gpsFee[kIndex],
                    evaluationFee: evaluationFee[kIndex],
                    otherFee: otherFee[kIndex],
                    manageFee: manageFee[kIndex],
                    premium: premium[kIndex]
                };

            } else if (checkType === CheckType[1]) {

                const {
                    lendMoney, deadline, deadlineUnit, refundWar, apr, aprUnit, aprType, serviceDeadline,
                    serviceDeadlineUnit, serviceTariffing, serviceUnit, serviceType, takenMode, valueDate,
                    agencyFee, parkingFee, guaranteeFee, nextFee, gpsFee, evaluationFee, otherFee, manageFee, premium
                } = dataInfo;

                dataObj = {
                    lendMoney,
                    deadline,
                    deadlineUnit,
                    apr,
                    aprUnit,
                    aprType,
                    refundWar,
                    serviceTariffing,
                    serviceUnit,
                    serviceType,
                    serviceDeadline,
                    serviceDeadlineUnit,
                    takenMode,
                    date: valueDate ? valueDate : '',

                    agencyFee,
                    parkingFee,
                    guaranteeFee,
                    nextFee,
                    gpsFee,
                    evaluationFee,
                    otherFee,
                    manageFee,
                    premium
                };
            }

            const others = {
                lendMoney: dataObj.lendMoney,
                deadline: dataObj.deadline,
                deadlineUnit: dataObj.deadlineUnit,
                apr: dataObj.apr,
                aprUnit: dataObj.aprUnit,
                aprType: dataObj.aprType,
                refundWar: dataObj.refundWar,
                serviceTariffing: dataObj.serviceTariffing,
                serviceUnit: dataObj.serviceUnit,
                serviceType: dataObj.serviceType,
                serviceDeadline: dataObj.serviceDeadline,
                serviceDeadlineUnit: dataObj.serviceDeadlineUnit,
                takenMode: dataObj.takenMode,
            };

            for (let key in others) {
                const item = dataObj[key];
                if (key === 'serviceTariffing') {
                    if (!isNaN(dataObj.serviceTariffing) && typeof  dataObj.serviceTariffing === 'number') {
                        if (dataObj.serviceUnit === undefined || dataObj.serviceUnit === '') {
                            message.warn(checkType === CheckType[0] ? `请完善${DataObj.serviceUnit}` : `${DataObj.serviceUnit}为空`);
                            return;
                        }
                        if (dataObj.takenMode === undefined || dataObj.takenMode === '') {
                            message.warn(checkType === CheckType[0] ? `请完善${DataObj.takenMode}` : `${DataObj.takenMode}为空`);
                            return;
                        }
                    }
                } else {
                    if (item === undefined || item === '') {
                        let msg = '';
                        if (key === 'serviceUnit' || key === 'serviceType' || key === 'takenMode') {
                        } else {
                            if (checkType === CheckType[0]) {
                                msg = `请完善${DataObj[key]}`;
                            } else if (checkType === CheckType[1]) {
                                msg = `${DataObj[key]}为空`;
                            }
                            message.warn(msg);
                            return;
                        }
                    }
                }
            }

            const params = {
                totalGrade: dataObj.deadline,                      // 借款期限
                style: dataObj.deadlineUnit,                       // 期限单位 天/档期/周/月 1=天，2=档，3=周，4=月
                invest: dataObj.lendMoney,                         // 借款金额
                lendingRate: this._getLeadingRate(dataObj),        // 借款利率 单位为月使用年利率,其余(天/档/周)使用天利率 利率统一小数

                serviceRate: this._getServiceRate(dataObj),        // 服务费率
                service: this._getServiceSum(dataObj),             // 服务费 非服务费率所得服务费的收取默认在第一期
                type: dataObj.takenMode,                           // 服务费收取方式 : 1=一次性收取，2=按日/档/周/月付服务费

                way: dataObj.refundWar,                            // 还款方式:1=等额本息，2=等额本金，3=等本等息，4=先息后本（一次付息

                aprType: dataObj.aprType,                          // 利率的类型:1=日利率，2=月利率，3=年利率

                date: dataObj.date,                                // 起息日 格式 yyyy-MM-dd
            };

            this._calculateRequest(params);
        }
    };

    _getLeadingRate = ({deadlineUnit, apr, aprUnit, aprType}) => {
        let result = 0;
        if (deadlineUnit === '4') {
            // 转换为年利率
            if (aprType === '1') {
                // 日利率转年利率
                result = apr * 360;
            } else if (aprType === '2') {
                // 月利率转年利率
                result = apr * 12;
            } else if (aprType === '3') {
                // 年利率
                result = apr;
            }
        } else {
            // 转为日利率
            if (aprType === '1') {
                // 日利率
                result = apr;
            } else if (aprType === '2') {
                // 月利率转日利率
                result = apr / 30;
            } else if (aprType === '3') {
                // 年利率转日利率
                result = apr / 360;
            }
        }
        if (aprUnit === '1') {
            return result / 100;
        } else if (aprUnit === '2') {
            return (result / 10) / 100;
        }
    };

    _getServiceRate = ({serviceTariffing, serviceUnit, serviceType}) => {
        let result = 0;
        let sr = 0;
        if (serviceTariffing === undefined) {
            return '';
        }
        if (!isNaN(serviceTariffing) && typeof serviceTariffing === 'number') {
            sr = serviceTariffing;
        }
        switch (serviceType) {
            case '1':
                result = sr;
                break;
            case '2':
                result = sr / 30;
                break;
            case '3':
                result = sr / 360;
                break;
        }
        if (serviceUnit === '1') {
            return result / 100;
        } else if (serviceUnit === '2') {
            return (result / 10) / 100;
        }
    };

    _getServiceSum = ({
                          lendMoney, deadline, deadlineUnit, refundWar, apr, aprUnit, aprType, serviceDeadline,
                          serviceDeadlineUnit, serviceTariffing, serviceUnit, serviceType, takenMode, date,
                          ...others
                      }) => {
        let sum = 0;
        for (let key in others) {
            if (others[key]) {
                console.log('others[key]', others[key]);
                sum += Number(others[key]);
            }
        }
        return sum;

    };

    _calculateRequest = (params) => {
        request(api.repaymentCalculator, params, 'post', session.get('token'))
            .then(res => {
                if (res.success) {
                    if (res.data && res.data.length > 0) {
                        this.setState({
                            tableDataSource: res.data,
                            modalVisible: true,
                        });
                    } else {
                        message.warn('没有返回数据');
                    }
                } else {
                    if (res.message) {
                        message.warn(res.message);
                    } else {
                        message.warn('请求失败');
                    }
                }
            })
            .catch(err => {
                message.warn('请求服务异常');
            });
    };

    _onCancel = () => {
        this.setState({modalVisible: false, tableDataSource: []});
    };

    customerByInfoGet = (id) => {
        request(`${api.customerByGet}${id}`, {}, 'get', session.get('token')) //借款人信息详情
            .then(res => {
                if (res.success) {
                    const {chooseCallback, customerInformationJson} = res.data;
                    if (chooseCallback && customerInformationJson && customerInformationJson.length >= 2) {
                        this.setState({
                            disabledTab: false,
                        });
                    }
                }
            })
            .catch(err => {
            })
    };

    render() {
        return (
            <Card bordered={false}>
                <h1 className="detail-title">{this.state.ifShowPriBorrInfoBtn ? '展期申请' : '借款申请'}</h1>
                <Divider/>
                <div className="position-r">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="基本信息" key="1">
                            {
                                !this.state.disabled ? <LoanBusinessInfomation id={this.props.params.id}
                                                                               productId={this.props.params.productId}
                                                                               disabledTabChange={this.disabledTabChange.bind(this)}
                                                                               disabled={this.state.disabled}/> :
                                    <CustomerInfoShow ifLoanApplication={true} id={this.props.params.id}
                                                      productId={this.props.params.productId}/>
                            }
                        </TabPane>
                        {this.state.disabledTab ?
                            <TabPane tab="业务信息" key="2" disabled>
                            </TabPane> :
                            <TabPane tab="业务信息" key="2">
                                {
                                    !this.state.disabled ?
                                        <LoanEssentialInfomation
                                            ifShowPriBorrInfoBtn={this.state.ifShowPriBorrInfoBtn}
                                            productId={this.props.params.productId}
                                            id={this.props.params.id}
                                            disabled={this.state.disabled}
                                            saveProductId={this.saveProductId.bind(this)}
                                            ref={ref => this._loanEssentialInformation = ref}
                                            checkType={CheckType[0]}
                                            onCheckPress={this._onCheckRepaymentDetails}
                                        />
                                        :
                                        <LoanInfoShow
                                            LoanInfo={this.state.LoanInfo}
                                            ifShowPriBorrInfoBtn={this.state.ifShowPriBorrInfoBtn}
                                            pictureDataJson={this.state.pictureDataJson}
                                            productId={this.props.params.productId}
                                            id={this.props.params.id}
                                            ifLoan={true}
                                            ifLoanApplication={true}
                                            checkType={CheckType[1]}
                                            onCheckPress={this._onCheckRepaymentDetails}
                                        />
                                }
                            </TabPane>
                        }
                        {this.state.disabledTab ?
                            <TabPane tab="流程信息" key="3" disabled>
                            </TabPane> :
                            <TabPane tab="流程信息" key="3">
                                <div style={{padding: '0 6px'}}>
                                    <ApprovalProcess ifModal={false} modalTableColumns={this.state.modalTableColumns}
                                                     apiUrl={api.groupAuditHistory} productId={this.state.productId}/>
                                </div>
                            </TabPane>
                        }
                    </Tabs>
                    {this.state.ifShowPriBorrInfoBtn &&
                    <Button onClick={this.showPriBorrInfo} className="green-style right-btn"><Icon
                        type="folder-open"/><span>原借款信息</span></Button>}
                </div>
                <PriBorrInfoShow ifExtension={this.state.ifExtension} ifLoanApplication={true}
                                 cancelPriBorrInfo={this.cancelPriBorrInfo.bind(this)}
                                 visible={this.state.ifShowPriBorrInfo} LoanInfo={this.state.priLoanInfo}
                                 pictureDataJson={this.state.priPictureDataJson}/>
                <Modal
                    title='还款详情计划表'
                    width='80%'
                    visible={this.state.modalVisible}
                    onCancel={this._onCancel}
                    footer={<Button type='primary' onClick={this._onCancel} className='green-style'>确定</Button>}
                >
                    <div style={{maxHeight: '400px', overflow: 'auto'}}>
                        {
                            this.state.tableDataSource.length > 0 &&
                            <RepaymentCalculatorTable
                                dataSource={this.state.tableDataSource}
                            />
                        }
                    </div>
                </Modal>
            </Card>
        )
    }
}

export default LoanApplicationDetail
