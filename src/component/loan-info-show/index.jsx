import React from 'react'
import PropTypes from 'prop-types'
import {Spin, Row, message, Button, Divider} from 'antd';
import {hashHistory} from 'react-router'
import {request} from 'common/request/request.js'
import {local, session} from 'common/util/storage.js'
import InfoShowCommon from 'component/info-show-common'
import MyAddEmergencyContact from 'component/add-emergency-contact'
import PicturesWall from 'component/img-upload'
import api from 'api'

const productInfo_c = [
    {id: '0', label: '展期产品名称', valueName: ['proName']},
    {id: '1', label: '展期业务员', valueName: ['salesman']},
    {id: '2', label: '展期金额', valueName: ['lendMoney']},
    {id: '3', label: '展期期限', valueName: ['deadline', 'deadlineUnit']},
    {id: '4', label: '展期利率', valueName: ['apr', 'aprUnit', 'aprType']},
    {id: '5', label: '展期还款方式', valueName: ['refundWar']},
    {id: '6', label: '展期用途', valueName: ['purpose']},
    {id: '7', label: '展期居间服务费率', valueName: ['serviceTariffing', 'serviceUnit', 'serviceType']},
    {id: '8', label: '展期服务期限', valueName: ['serviceDeadline', 'serviceDeadlineUnit']},
    {id: '9', label: '展期居间服务费收取方式', valueName: ['takenMode']},
]
const serviceCostInfo_c = [
    {id: '0', label: '展期中介服务费', valueName: ['agencyFee']},
    {id: '1', label: '展期下户服务费', valueName: ['nextFee']},
    {id: '2', label: '展期评估服务费', valueName: ['evaluationFee']},
    {id: '3', label: '展期管理服务费', valueName: ['manageFee']},
    {id: '4', label: '展期停车服务费', valueName: ['parkingFee']},
    {id: '5', label: '展期GPS服务费', valueName: ['gpsFee']},
    {id: '6', label: '展期保险服务费', valueName: ['premium']},
    {id: '7', label: '展期担保服务费', valueName: ['guaranteeFee']},
    {id: '8', label: '展期其他费用', valueName: ['otherFee']},
]
class LoanInfoShow extends React.Component {
    static propTypes = {
        productId: PropTypes.string.isRequired,
        LoanInfo: PropTypes.object.isRequired,
        pictureDataJson: PropTypes.object.isRequired,
        ifLoan: PropTypes.bool,
        productInfo: PropTypes.array,
        serviceCostInfo: PropTypes.array,
        borrowerInfo: PropTypes.array,
        onCheckPress: PropTypes.func,
        LendersInfo: PropTypes.array,
        remarkInfo: PropTypes.array,
        ifLoanApplication: PropTypes.bool,
        ifShowPriBorrInfoBtn: PropTypes.bool,
    };

    static defaultProps = {
        ifShowPriBorrInfoBtn: false,
        ifLoanApplication: false,
        ifLoan: false,
        productInfo: [
            {id: '0', label: '产品名称', valueName: ['proName']},
            {id: '1', label: '业务员', valueName: ['salesman']},
            {id: '2', label: '借款金额', valueName: ['lendMoney']},
            {id: '3', label: '借款期限', valueName: ['deadline', 'deadlineUnit']},
            {id: '4', label: '借款利率', valueName: ['apr', 'aprUnit', 'aprType']},
            {id: '5', label: '还款方式', valueName: ['refundWar']},
            {id: '6', label: '借款用途', valueName: ['purpose']},
            {id: '7', label: '居间服务费率', valueName: ['serviceTariffing', 'serviceUnit', 'serviceType']},
            {id: '8', label: '服务期限', valueName: ['serviceDeadline', 'serviceDeadlineUnit']},
            {id: '9', label: '居间服务费收取方式', valueName: ['takenMode']},
        ],
        serviceCostInfo: [
            {id: '0', label: '中介费', valueName: ['agencyFee']},
            {id: '1', label: '下户费', valueName: ['nextFee']},
            {id: '2', label: '评估费', valueName: ['evaluationFee']},
            {id: '3', label: '管理费', valueName: ['manageFee']},
            {id: '4', label: '保证金', valueName: ['parkingFee']},
            {id: '5', label: 'GPS费', valueName: ['gpsFee']},
            {id: '6', label: '保险费', valueName: ['premium']},
            {id: '7', label: '担保费', valueName: ['guaranteeFee']},
            {id: '8', label: '其他费用', valueName: ['otherFee']},
        ],
        borrowerInfo: [
            {id: '0', label: '收款人', valueName: ['gatheringName']},
            {id: '1', label: '收款账号', valueName: ['gatheringNo']},
            {id: '2', label: '开户行', valueName: ['bankName']},
        ],
        LendersInfo: [
            {id: '0', label: '出借人', valueName: ['lender']},
            {id: '1', label: '手机号', valueName: ['lenderPhone']},
            {id: '2', label: '身份证号', valueName: ['lenderIdentityCard']},
            {id: '3', label: '居住地址', valueName: ['province', 'city', 'area', 'lenderAddress']},
        ],
        remarkInfo: [
            {id: '0', valueName: ['remark']},
        ],
        onCheckPress: null,
    };

    constructor(props) {
        super(props)
        this.state = {
            productInfo: [],
            serviceCostInfo:[],
            borrowerInfo: [],
            LendersInfo:[],
            remarkInfo: [],
            loading: true,
            LoanInfo: {},
            customerInformationDefaultJson: [],//客户相关资料
            pictureDataJson: [],
            riskGroupsJson: [],
            wereBorrowedsInfo: [],
            showContents: [{
                label: '客户姓名',
                fieldName: 'name'
            },
                {
                    label: '联系电话',
                    fieldName: 'phone'
                },
                {
                    label: '',
                    fieldName: 'id'
                },
                {
                    label: '证件类型',
                    fieldName: 'certificateType'
                },
                {
                    label: '证件号码',
                    fieldName: 'identityCard'
                },
                {
                    label: '居住地址',
                    fieldName: 'provinceCityArea'
                },
                {
                    label: '具体地址',
                    fieldName: 'address'
                }
            ]
        }
    }

    componentDidMount() { //预加载数据
        this.propsDo(this.props)
        
        if (session.get('customerInformationDefaultJson')) {
            this.setState({
                customerInformationDefaultJson: session.get('customerInformationDefaultJson')
            }, function () {
                console.log(this.state.customerInformationDefaultJson)
            })
        }
        if (this.props.LoanInfo.success) {
            this.setState({
                LoanInfo: this.props.LoanInfo.data,
                wereBorrowedsInfo: this.props.LoanInfo.data.wereBorroweds ? this.props.LoanInfo.data.wereBorroweds : [],
                pictureDataJson: this.props.pictureDataJson,
            }, function () {
                console.log(JSON.stringify(this.state.LoanInfo))
                this.setState({loading: false})
                if (this.state.LoanInfo.riskGroups && this.props.ifLoan) { //处理默认风控组成员
                    this.riskGroupsDo()
                }
            })
        } else {
            console.log(this.props.LoanInfo)
            message.error(this.props.LoanInfo.message)
            this.setState({loading: false})
        }


    }

    componentWillReceiveProps(nextProps) { //组件接收到新的props时调用
        console.log(nextProps)
        this.propsDo(nextProps)
        this.setState({
            ifShowPriBorrInfoBtn: nextProps.ifShowPriBorrInfoBtn
        })
        if (nextProps.LoanInfo.success) {
            this.setState({
                LoanInfo: nextProps.LoanInfo.data,
                wereBorrowedsInfo: nextProps.LoanInfo.data.wereBorroweds ? nextProps.LoanInfo.data.wereBorroweds : [],
                pictureDataJson: nextProps.pictureDataJson,
            }, function () {
                if (this.state.LoanInfo.riskGroups && this.props.ifLoan) { //处理默认风控组成员
                    this.riskGroupsDo()
                }
            })
        } else {
            message.error(nextProps.LoanInfo.message)
        }
    }
    propsDo = (props) => {
        this.setState({
            ifShowPriBorrInfoBtn: props.ifShowPriBorrInfoBtn,
            borrowerInfo: props.borrowerInfo,
            LendersInfo: props.LendersInfo,
            remarkInfo: props.remarkInfo,
            productInfo: props.productInfo,
            serviceCostInfo: props.serviceCostInfo,
        },function(){
           if (this.state.ifShowPriBorrInfoBtn) {
                this.setState({
                    productInfo: productInfo_c,
                    serviceCostInfo: serviceCostInfo_c,
                })
           } 
        })
    }
    riskGroupsDo = () => {
        let riskGroupsBefore = []
        request(api.findRiskGet, {}, 'post', session.get('token')) //风控人员信息获取
            .then(res => {
                console.log(JSON.stringify(res))
                if (res.success) {
                    let findRiskInfoT = res.data
                    for (let item of findRiskInfoT) {
                        for (let val of this.state.LoanInfo.riskGroups) {
                            let userId = val['user']
                            item['id'] == userId.id ? riskGroupsBefore.push(item['name']) : ''
                        }
                    }
                    this.setState({
                        riskGroupsJson: riskGroupsBefore
                    })
                }
            })

    }

    handleFormBack() {
        window.history.back()
    }

    _onPress = () => {
        const {onCheckPress, checkType} = this.props;
        const kIndex = null;
        onCheckPress && onCheckPress(checkType, kIndex, this.state.LoanInfo);
    };

    render() {
        return (
            <Spin spinning={this.state.loading} size="large">
                <Row style={{width: '100%'}}>
                    {this.state.wereBorrowedsInfo.length>0 && <div style={{padding: '15px 30px'}}>
                        <MyAddEmergencyContact productId={this.props.productId} ifLoanApplication={this.props.ifLoanApplication} showContents={this.state.showContents} addText="添加共借人" title="共借人"
                                               buttonText="查询征信" ifShow={true}
                                               defaultValue={this.state.wereBorrowedsInfo}/>
                    </div>}
                    <InfoShowCommon defaultValue={this.state.LoanInfo} defaultValueShow={this.state.productInfo}
                                    defaultTitle={this.state.ifShowPriBorrInfoBtn ? '展期产品信息':'产品信息'}/>
                    <div className="gray-bettw"></div>
                    {/* <ServiceCost defaultValue={this.state.LoanInfo}/> */}
                    <InfoShowCommon defaultValue={this.state.LoanInfo} defaultValueShow={this.state.serviceCostInfo}
                                    defaultTitle={this.state.ifShowPriBorrInfoBtn ? '展期综合费用':'综合费用'}/>
                    <Button className="green-style margin15" onClick={this._onPress}>{this.state.ifShowPriBorrInfoBtn?'点击查看展期计划详情表':'点击查看还款计划详情表'}</Button>
                    <div className="gray-bettw"></div>
                    <InfoShowCommon defaultValue={this.state.LoanInfo} defaultValueShow={this.state.borrowerInfo}
                                    defaultTitle="收款人"/>
                    <div className="gray-bettw"></div>
                    <InfoShowCommon defaultValue={this.state.LoanInfo} defaultValueShow={this.state.LendersInfo}
                                    defaultTitle="出借人"/>
                    <div className="gray-bettw"></div>
                    {!this.props.ifLoan && <div className="show padding15">
                        <div className="white-title">
                            <p>客户相关资料：</p>
                            <Divider/>
                        </div>
                        <PicturesWall defaultFileList={this.state.customerInformationDefaultJson} disabled={true}/>
                    </div>}
                    <div className="show padding15">
                        <div className="white-title">
                            <p>抵押物资料：</p>
                            <Divider/>
                        </div>
                        <PicturesWall defaultFileList={this.state.pictureDataJson.pawnMaterialDefaultJson}
                                      disabled={true}/>
                    </div>
                    <div className="show padding15">
                        <div className="white-title">
                            <p>现场调查资料：</p>
                            <Divider/>
                        </div>
                        <PicturesWall defaultFileList={this.state.pictureDataJson.fieldSurveyDefaultJson}
                                      disabled={true}/>
                    </div>
                    <div className="show padding15">
                        <div className="white-title">
                            <p>其他资料：</p>
                            <Divider/>
                        </div>
                        <PicturesWall defaultFileList={this.state.pictureDataJson.otherDetailsDefaultJson}
                                      disabled={true}/>
                    </div>
                    <div className="gray-bettw"></div>
                    <InfoShowCommon defaultValue={this.state.LoanInfo} defaultValueShow={this.state.remarkInfo}
                                    defaultTitle="客户信息描述"/>
                    {this.props.ifLoan && <div>
                        <div className="gray-bettw"></div>
                        <div className="show padding15">
                            <div className="white-title">
                                <p>风控组成员：</p>
                                <Divider/>
                            </div>
                            {this.state.riskGroupsJson.map((item) =>
                                <span style={{marginRight: "20px"}} key={item}>{item}</span>
                            )}
                        </div>
                        <div className="gray-bettw"></div>
                    </div>}
                </Row>
                <div className="col-interval"><Button className="default-btn" style={{float: 'left'}}
                                                      onClick={this.handleFormBack}>返回</Button></div>
            </Spin>
        )
    }
}

export default LoanInfoShow
