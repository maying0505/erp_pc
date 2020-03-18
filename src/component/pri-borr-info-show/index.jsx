import React from 'react'
import PropTypes from 'prop-types'
import {Spin, Row, message, Button, Divider, Modal, Table} from 'antd';
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

const TableColumnWidth = '8.33%'

class PriBorrInfoShow extends React.Component {
    static propTypes = {
        ifExtension: PropTypes.bool,
        LoanInfo: PropTypes.object.isRequired,
        pictureDataJson: PropTypes.object.isRequired,
        productInfo: PropTypes.array,
        serviceCostInfo: PropTypes.array,
        borrowerInfo: PropTypes.array,
        LendersInfo: PropTypes.array,
        visible:  PropTypes.bool.isRequired,
        cancelPriBorrInfo: PropTypes.func,
        ifLoanApplication: PropTypes.bool
    };

    static defaultProps = {
        ifExtension: true,
        cancelPriBorrInfo: ()=>{},
        ifLoanApplication: false,
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
            {id: '3', label: '地址', valueName: ['lenderAddress']},
        ],
    };

    constructor(props) {
        super(props)
        this.state = {
            productId: '',
            productInfo: [],
            serviceCostInfo:[],
            borrowerInfo: [],
            LendersInfo:[],
            loading: true,
            LoanInfo: {},
            visible: false,
            tableDataSource: [],
            pictureDataJson: {},
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
        this.setState({ visible: this.props.visible })
        if (this.props.LoanInfo.success && this.props.visible) {
            this.setState({
                LoanInfo: this.props.LoanInfo.data,
                wereBorrowedsInfo: this.props.LoanInfo.data.wereBorroweds ? this.props.LoanInfo.data.wereBorroweds : [],
                pictureDataJson: this.props.pictureDataJson,
            }, function () {
                console.log(JSON.stringify(this.state.LoanInfo))
                console.log('sdf:',JSON.stringify(this.state.pictureDataJson))
                this.setState({loading: false,productId:this.props.LoanInfo.data['id']})
                this._getLoansRepaymentList(this.props.LoanInfo.data['id']);
            })
        } else {
            console.log(this.props.LoanInfo)
            this.props.LoanInfo.message ? message.error(this.props.LoanInfo.message) : null
            this.setState({loading: false})
        }
    }

    componentWillReceiveProps(nextProps) { //组件接收到新的props时调用
        console.log('tttt:',nextProps)
        this.propsDo(nextProps)
        if (nextProps.LoanInfo.data !== this.state.LoanInfo && nextProps.visible) {
            if (nextProps.LoanInfo.success) {
                this.setState({
                    productId: nextProps.LoanInfo.data['id'],
                    LoanInfo: nextProps.LoanInfo.data,
                    wereBorrowedsInfo: nextProps.LoanInfo.data.wereBorroweds ? nextProps.LoanInfo.data.wereBorroweds : [],
                    pictureDataJson: nextProps.pictureDataJson,
                }, function () {
                    console.log('sdf:',JSON.stringify(this.state.pictureDataJson))
                    this._getLoansRepaymentList(nextProps.LoanInfo.data['id']);
                })
            } else {
                nextProps.LoanInfo.message ? message.error(nextProps.LoanInfo.message) : null
            }
        }
        this.setState({ visible: nextProps.visible })
    }
    propsDo = (props) => {
        this.setState({
            ifExtension: props.ifExtension,
            borrowerInfo: props.borrowerInfo,
            LendersInfo: props.LendersInfo,
            productInfo: props.productInfo,
            serviceCostInfo: props.serviceCostInfo,
        },function(){
           if (this.state.ifExtension) {
                this.setState({
                    productInfo: productInfo_c,
                    serviceCostInfo: serviceCostInfo_c,
                })
           }
        })
    }
    _tableColumns = [
        {title: '期数', dataIndex: 'period', width: TableColumnWidth,
            render: (text, record) => text && record.totalPeriod ? `${text}/${record.totalPeriod}` : '--'
        },
        {title: '预计还款时间', dataIndex: 'predictDate', width: TableColumnWidth},
        {title: '实际还款时间', dataIndex: 'realityDate', width: TableColumnWidth},
        {title: '应还本金', dataIndex: 'payPrincipal', width: TableColumnWidth},
        {title: '应还利息', dataIndex: 'monthlyInterest', width: TableColumnWidth},
        {
            title: '是否逾期',
            dataIndex: 'isOverdue',
            width: TableColumnWidth,
            render: (text) => {
                if (text) {
                    return text === '1' ? '是' : '否';
                } else {
                    return '';
                }
            }
        },
        {title: '逾期天数', dataIndex: 'overdueDays', width: TableColumnWidth},
        {title: '罚息', dataIndex: 'defautInterest', width: TableColumnWidth},
        {title: '违约金', dataIndex: 'penalSum', width: TableColumnWidth},
        {title: '居间服务费（元）', dataIndex: 'serviceCharge', width: TableColumnWidth},
        {title: '应还款总额', dataIndex: 'totalMonthlyRepayment', width: TableColumnWidth},
        {
            title: '实收金额',
            dataIndex: 'realMoney',
            width: TableColumnWidth,
            render: (text, records) => {
                let style = null;
                if (records.realMoney !== records.totalMonthlyRepayment) {
                    style = {color: 'red'};
                }
                return <span style={style}>{records.realMoney}</span>
            }
        },
    ];

    _getLoansRepaymentList = (productId) => {
        request(api.loansRepaymentList, {productId}, 'post', session.get('token'))
            .then(res => {
                console.log(JSON.stringify(res))
                if (res.success) {
                    this.setState({tableDataSource: res.data ? res.data : []});
                } else {
                    message.error('请求失败');
                }
                this.setState({isLoading: false,});
            })
            .catch(err => {
                message.error('请求服务异常');
                this.setState({isLoading: false,});
            });
    }

    handleCancel = () => {
        this.props.cancelPriBorrInfo()
    }
    render() {
        return (
            <Modal
            visible={this.state.visible}
            okText=""
            destroyOnClose={true}
            onCancel={this.handleCancel}
            footer={<Button type='primary' onClick={this.handleCancel} className='green-style'>关闭</Button>}
            title="借款信息"
            width= '80%'
            >
                <Spin spinning={this.state.loading} size="large">
                    <Row style={{width: '100%'}}>
                        {this.state.wereBorrowedsInfo.length > 0 && <div style={{padding: '15px 30px'}}>
                            <MyAddEmergencyContact productId={this.state.productId} ifLoanApplication={this.props.ifLoanApplication} showContents={this.state.showContents} addText="添加共借人" title="共借人"
                                                buttonText="查询征信" ifShow={true}
                                                defaultValue={this.state.wereBorrowedsInfo}/>
                        </div>}
                        <InfoShowCommon defaultValue={this.state.LoanInfo} defaultValueShow={this.state.productInfo}
                                        defaultTitle={this.state.ifExtension? '展期产品信息':'产品信息'}/>
                        <div className="gray-bettw"></div>
                        {/* <ServiceCost defaultValue={this.state.LoanInfo}/> */}
                        <InfoShowCommon defaultValue={this.state.LoanInfo} defaultValueShow={this.state.serviceCostInfo}
                                        defaultTitle={this.state.ifExtension? '展期综合费用':'综合费用'}/>
                        <div className="gray-bettw"></div>
                        <InfoShowCommon defaultValue={this.state.LoanInfo} defaultValueShow={this.state.borrowerInfo}
                                        defaultTitle="收款人"/>
                        <div className="gray-bettw"></div>
                        <InfoShowCommon defaultValue={this.state.LoanInfo} defaultValueShow={this.state.LendersInfo}
                                        defaultTitle="出借人"/>
                        <div className="gray-bettw"></div>
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
                        <div className="show padding15">
                            <div className="white-title">
                                <p>风控措施执行情况：</p>
                                <Divider/>
                            </div>
                            <PicturesWall defaultFileList={this.state.pictureDataJson.situationDefaultJson}
                                        disabled={true}/>
                        </div>
                        <div className="show padding15">
                            <div className="white-title">
                                <p>签约资料：</p>
                                <Divider/>
                            </div>
                            <PicturesWall defaultFileList={this.state.pictureDataJson.signedDefaultJson}
                                        disabled={true}/>
                        </div>
                        <div className="show padding15">
                            <div className="white-title">
                                <p>放款凭证：</p>
                                {this.state.LoanInfo['loanMoney']  && <div style={{textAlign:'center'}}> <span>放款金额：{this.state.LoanInfo['loanMoney']}元</span></div>}
                                <Divider/>
                            </div>
                            <PicturesWall defaultFileList={this.state.pictureDataJson.loanVoucherDefaultJson}
                                        disabled={true}/>
                        </div>
                        <div className="gray-bettw"></div>
                        <div className="show padding15">
                            <div className="white-title">
                                <p>还款详情表：</p>
                                <Divider/>
                            </div>
                            <Table
                                // scroll={{x: 1210}}
                                rowKey={'id'}
                                columns={this._tableColumns}
                                dataSource={this.state.tableDataSource}
                                pagination={false}
                            />
                        </div>
                    </Row>
                </Spin>
            </Modal>
        )
    }
}

export default PriBorrInfoShow
