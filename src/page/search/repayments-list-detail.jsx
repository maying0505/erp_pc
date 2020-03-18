import React from 'react'
import PropTypes from 'prop-types'
import {Spin, Row, message, Button, Divider, Card, Table, Modal, Form, Input} from 'antd';
import {hashHistory} from 'react-router'
import {request} from 'common/request/request.js'
import {local, session} from 'common/util/storage.js'
import InfoShowCommon from 'component/info-show-common'
import MyAddEmergencyContact from 'component/add-emergency-contact'
import PicturesWall from 'component/img-upload'
import imgUrl from 'common/util/imgUrl.js'
import api from 'api'

const {TextArea} = Input
const FormItem = Form.Item
const _tableWidth1 = '8.33%'
const _tableWidth2 = '14.28%'
const _tableWidth3 = '28.57%'
const productInfoShow = [
    {id: '4', label: '借款金额', valueName: ['lendMoney'], contentInterval: '借款详情'},
    {id: '5', label: '借款期限', valueName: ['deadline', 'deadlineUnit']},
    {id: '6', label: '借款利率', valueName: ['apr', 'aprUnit', 'aprType']},
    {id: '7', label: '还款方式', valueName: ['refundWar']},
    {id: '8', label: '居间服务费率', valueName: ['serviceTariffing', 'serviceUnit', 'serviceType']},
    {id: '9', label: '服务期限', valueName: ['serviceDeadline', 'serviceDeadlineUnit']},
    {id: '10', label: '居间服务费收取方式', valueName: ['takenMode']},
    {id: '11', label: '借款用途', valueName: ['purpose']},
    {id: '12', label: '中介费', valueName: ['agencyFee'], contentInterval: '综合费用'},
    {id: '13', label: '下户费', valueName: ['nextFee']},
    {id: '14', label: '评估费', valueName: ['evaluationFee']},
    {id: '15', label: '管理费', valueName: ['manageFee']},
    {id: '16', label: '保证金', valueName: ['parkingFee']},
    {id: '17', label: 'GPS费', valueName: ['gpsFee']},
    {id: '18', label: '保险费', valueName: ['premium']},
    {id: '19', label: '担保费', valueName: ['guaranteeFee']},
    {id: '20', label: '其他费用', valueName: ['otherFee']},
]
const productInfoShow_c = [
    {id: '4', label: '展期金额', valueName: ['lendMoney'], contentInterval: '展期详情'},
    {id: '5', label: '展期期限', valueName: ['deadline', 'deadlineUnit']},
    {id: '6', label: '展期利率', valueName: ['apr', 'aprUnit', 'aprType']},
    {id: '7', label: '展期还款方式', valueName: ['refundWar']},
    {id: '8', label: '展期居间服务费率', valueName: ['serviceTariffing', 'serviceUnit', 'serviceType']},
    {id: '9', label: '展期服务期限', valueName: ['serviceDeadline', 'serviceDeadlineUnit']},
    {id: '10', label: '展期居间服务费收取方式', valueName: ['takenMode']},
    {id: '11', label: '展期用途', valueName: ['purpose']},
    {id: '12', label: '展期中介服务费', valueName: ['agencyFee'], contentInterval: '展期综合费用'},
    {id: '13', label: '展期下户服务费', valueName: ['nextFee']},
    {id: '14', label: '展期评估服务费', valueName: ['evaluationFee']},
    {id: '15', label: '展期管理服务费', valueName: ['manageFee']},
    {id: '16', label: '展期停车服务费', valueName: ['parkingFee']},
    {id: '17', label: '展期GPS服务费', valueName: ['gpsFee']},
    {id: '18', label: '展期保险服务费', valueName: ['premium']},
    {id: '19', label: '展期担保服务费', valueName: ['guaranteeFee']},
    {id: '20', label: '展期其他费用', valueName: ['otherFee']},
]

class PaymentDetailsForm extends React.Component {
    static propTypes = {
        productId: PropTypes.string.isRequired,
    };
    state = {
        pictureDataInfo: [],
        nullData: [],
        isSave: true,
        confirmLoading: false,
        tableLoading: true,
        repaymentById: '',
        customerId: '',
        okText: '提交',
        loansRepaymentInfo: [],
        visible: false,
        title: "添加催记",
        dataChange: false,
        columns: [
            {
                title: '期数',
                dataIndex: 'period',
                // fixed: 'left',
                width: _tableWidth1,
                render: (text, record) => text && record.totalPeriod ? `${text}/${record.totalPeriod}` : '--'
            },
            {
                title: '应还时间',
                dataIndex: 'predictDate',
                width: _tableWidth1,
            },
            {
                title: '应还本金',
                dataIndex: 'payPrincipal',
                width: _tableWidth1,
            },
            {
                title: '应还利息',
                dataIndex: 'monthlyInterest',
                width: _tableWidth1,
            },
            {
                title: '应还服务费',
                dataIndex: 'serviceCharge',
                width: _tableWidth1,
            },
            {
                title: '是否逾期',
                dataIndex: 'isOverdue',
                width: _tableWidth1,
                render: (text) => text === '1' ? <span className="red-style">是</span> : '否'
            },
            {
                title: '逾期天数',
                dataIndex: 'overdueDays',
                width: _tableWidth1,
            },
            {
                title: '罚息',
                dataIndex: 'defautInterest',
                width: _tableWidth1,
            },
            {
                title: '违约金',
                dataIndex: 'penalSum',
                width: _tableWidth1,
            },
            {
                title: '应还款总额',
                dataIndex: 'totalMonthlyRepayment',
                width: _tableWidth1,
            },
            {
                title: '实还时间',
                dataIndex: 'realityDate',
                width: _tableWidth1,
            },
            {
                title: '还款状态',
                dataIndex: 'state',
                width: _tableWidth1,
                render: (text) => text === '1' ? '未还款' : '已还款'
            },
            // {
            //     title: '操作',
            //     // fixed: 'right',
            //     dataIndex: '',
            //     width: _tableWidth1,
            //     render: (record) => record.state === '1' ?
            //         <span className="green-span" onClick={this.addCollectionRecords.bind(this, record)}>添加催记</span> :
            //         <span>--</span>
            // },
        ],
    };

    componentWillMount() { //预加载数据
        this.loansRepaymentList()
    }

    loansRepaymentList = () => {
        request(`${api.loansRepaymentList}`, {
            productId: this.props.productId,
        }, 'post', session.get('token')) //借款人信息详情
            .then(res => {
                console.log(JSON.stringify(res))
                this.setState({tableLoading: false})
                if (res.success) {
                    this.setState({
                        loansRepaymentInfo: res.data,
                    }, function () {
                    })
                } else {
                    message.error(res.message)
                }

            })
            .catch(err => {
                this.setState({tableLoading: false})
            })
    }
    addCollectionRecords = (e) => {
        if (e.state === '1') {
            this.setState({
                visible: true,
                repaymentById: e.id,
                customerId: e.customerBy.id
            });
        }
    }

    handleOk = () => {
        if (!this.state.isSave) {
            message.warning('请在所有文件上传完成后提交或保存!')
            return
        }
        this.setState({
            confirmLoading: true,
        })
        this.props.form.validateFields((err, values) => {
            if (err) return
            console.log('eeeee:', values)
            if (!values.remark) {
                this.setState({
                    confirmLoading: false,
                })
                message.warning('问题备注必填！')
                return
            }
            request(`${api.remRecSave}`, {
                ...values,
                productId: this.props.productId,
                repaymentId: this.state.repaymentById,
                customerId: this.state.customerId,
                urgeImgJson: JSON.stringify(this.state.pictureDataInfo)
            }, 'post', session.get('token')) //借款人信息详情
                .then(res => {
                    console.log(JSON.stringify(res))
                    this.setState({confirmLoading: false})
                    if (res.success) {
                        this.setState({
                            dataChange: !this.state.dataChange,
                            visible: false
                        })
                    } else {
                        message.error(res.message)
                    }
                    this.props.form.resetFields()
                })
                .catch(err => {
                    this.setState({confirmLoading: false})
                    this.props.form.resetFields()
                })
        })
    }
    handleCancel = () => {
        this.props.form.resetFields()
        this.setState({
            visible: false,
            nullData: [],
            pictureDataInfo: []
        });
    }
    onPicturesWallChange = (event, index, style, status) => { //处理图片上传数据
        this.setState({
            isSave: false
        })
        if (status === 'uploading') return

        let customerInformation = []
        let customerInfoJ = []
        let isSaveBefore = true

        customerInfoJ = this.state.pictureDataInfo

        for (let i in event) {
            if (event[i].response) {
                event[i].response.success ? customerInformation.push(event[i].response.data) : null
                if (i == (event.length - 1)) {
                    event[i].response.success ? null : message.error(event[i].response.message ? event[i].response.message : '上传失败')
                }
            }
            for (let item of customerInfoJ) {
                if (item[imgUrl.small] === event[i].url) {
                    customerInformation.push(item)
                    break
                }
            }
            if (event[i].status !== 'done' && event[i].status) {
                isSaveBefore = false
            }
        }
        this.setState({
            pictureDataInfo: customerInformation,
            isSave: isSaveBefore
        }, function () {
            console.log(this.state.pictureDataInfo)
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const {nullData, title, okText, visible, confirmLoading, columns, tableListDataSource, pictureDataInfo} = this.state
        return (
            <div>
                <Table style={{padding: '0 20px'}} bordered rowKey={'id'} columns={this.state.columns}
                       loading={this.state.tableLoading} dataSource={this.state.loansRepaymentInfo} pagination={false}/>
                <div className="white-title white-title-small marginT20"><p className="title-small">催收记录</p><Divider/>
                </div>
                <CollectRecords dataChange={this.state.dataChange} productId={this.props.productId}/>
                <Modal visible={visible}
                       onOk={this.handleOk}
                       confirmLoading={confirmLoading}
                       onCancel={this.handleCancel}
                       okText={okText}
                       cancelText="取消"
                       title={title}
                >
                    <Form onSubmit={this.handleOk} layout="inline" className="ant-form-my">
                        <div>
                            <span>问题代码</span>
                            {getFieldDecorator('type')(
                                <Input className="s-input"/>
                            )}
                        </div>
                        <div>
                            <div className="blod-title">问题备注</div>
                            {getFieldDecorator('remark')(
                                <TextArea/>
                            )}
                        </div>
                        <div>
                            <div className="blod-title">图片资料</div>
                            {visible && <PicturesWall defaultFileList={nullData}
                                                      onPicturesWallChange={this.onPicturesWallChange.bind(this)}/>}
                        </div>
                    </Form>
                </Modal>
            </div>
        )
    }
}

const PaymentDetails = Form.create()(PaymentDetailsForm)

class CollectRecords extends React.Component {
    static propTypes = {
        dataChange: PropTypes.bool.isRequired,
        productId: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props)
        this.state = {
            tableLoading: true,
            remRecInfo: [],
            pictureDataInfo: [],
            typeText: '--',
            remarkText: '--',
            dataChange: false,
            pagination: {total: 1, pageSize: 5},
            pageInfo: {pageNo: '1', pageSize: '5'},
            columns: [
                {
                    title: '合同编号',
                    dataIndex: 'productBy.contractNo',
                    width: _tableWidth3,
                    // fixed: 'left',
                },
                {
                    title: '期数',
                    dataIndex: 'repaymentBy.period',
                    width: _tableWidth2,
                    render: (text, record) => text && record.repaymentBy.totalPeriod ? `${text}/${record.repaymentBy.totalPeriod}` : '--'
                },
                {
                    title: '姓名',
                    dataIndex: 'customerBy.name',
                    width: _tableWidth2,
                },
                {
                    title: '记录时间',
                    dataIndex: 'enteringDate',
                    width: _tableWidth2,
                },
                {
                    title: '操作人员',
                    dataIndex: 'createBy.name',
                    width: _tableWidth2,
                },
                // {
                // title: '问题代码',
                // dataIndex: 'type',
                // width: _tableWidth2,
                // },
                // {
                // title: '问题备注',
                // dataIndex: 'remark',
                // width: _tableWidth3,
                // },
                {
                    title: '操作',
                    // fixed: 'right',
                    dataIndex: '',
                    width: _tableWidth2,
                    render: (record) => <span className="green-span"
                                              onClick={this.viewCollectionRecords.bind(this, record)}>查看</span>
                },
            ],
            visible: false
        }
    }

    componentWillMount() { //预加载数据
        this.remRecGet()
    }

    componentWillReceiveProps(nextProps) { //组件接收到新的props时调用
        if (nextProps.dataChange !== this.state.dataChange) {
            this.setState({
                dataChange: nextProps.dataChange,
                tableLoading: true,
            }, function () {
                this.remRecGet()
            })
        }
    }

    pageJump = (e) => { //分页跳转
        console.log(e)
        this.setState({
            pageInfo: {pageNo: e.current, pageSize: e.pageSize}
        }, function () {
            this.remRecGet()
        })
    }
    remRecGet = () => {
        request(`${api.remRecGet}`, {
            productId: this.props.productId,
            ...this.state.pageInfo
        }, 'post', session.get('token')) //借款人信息详情
            .then(res => {
                console.log('cuishou',JSON.stringify(res))
                this.setState({tableLoading: false})
                if (res.success) {
                    this.setState({
                        remRecInfo: res.data.list ? res.data.list : [],
                        pagination: {...this.state.pagination, total: res.data.count},
                    }, function () {
                    })
                } else {
                    message.error(res.message)
                }
            })
            .catch(err => {
                this.setState({tableLoading: false})
            })
    }
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    viewCollectionRecords = (record) => {
        this.setState({
            visible: true,
            typeText: record.type ? record.type : '--',
            remarkText: record.remark ? record.remark : '--',
        })
        if (record.urgeImgJson) {
            let customerInformations = []
            for (let item of record.urgeImgJson) {
                let customerInformation = {}
                customerInformation['bigUrl'] = item[imgUrl.big] ? item[imgUrl.big] : ''
                customerInformation['bigBUrl'] = item[imgUrl.bigB] ? item[imgUrl.bigB]: ''
                customerInformation['url'] = item[imgUrl.small] ? item[imgUrl.small] : ''
                customerInformation['uid'] = `${item.fileName}${Math.random()}`
                customerInformation['status'] = 'done'
                customerInformations.push(customerInformation)
            }

            this.setState({
                pictureDataInfo: customerInformations
            }, function () {
                this.setState({
                    visible: true,
                })
            })
        }
    }

    render() {
        const {columns, tableListDataSource, tableLoading, visible, typeText, remarkText, pictureDataInfo} = this.state
        return (<div>
                <Table style={{padding: '0 20px'}} bordered rowKey="id" columns={columns}
                       dataSource={this.state.remRecInfo} loading={tableLoading} onChange={this.pageJump}
                       pagination={this.state.pagination}/>
                <Modal visible={visible}
                       onCancel={this.handleCancel}
                       title="查看催记"
                       footer={<Button type='primary' onClick={this.handleCancel}>确定</Button>}
                >
                    <div>
                        <span>问题代码</span>
                        <span style={{marginLeft: '20px'}}>{typeText}</span>
                    </div>
                    <div>
                        <div className="blod-title">问题备注</div>
                        <p>{remarkText}</p>
                    </div>
                    <div className="show">
                        <div className="blod-title">图片资料</div>
                        <PicturesWall defaultFileList={pictureDataInfo} disabled={true}/>
                    </div>
                </Modal>
            </div>
        )
    }
}

class RepaymentsListDetail extends React.Component {
    static propTypes = {
        visible:  PropTypes.bool.isRequired,
        cancelPriBorrInfo: PropTypes.func,
        id: PropTypes.string.isRequired,
        productId: PropTypes.string.isRequired,
    };

    static defaultProps = {
        cancelPriBorrInfo: ()=>{},
    };

    constructor(props) {
        super(props)
        this.state = {
            productId: '',
            customerId: '',
            visible: false,
            loading: false,
            customerByInfo: {},
            productInfo: {},
            emergenciesInfo: [],
            wereBorrowedsInfo: [],
            customerByShow: [
                {id: '0', label: '姓名', valueName: ['name'], contentInterval: '借款人'},
                {id: '1', label: '号码', valueName: ['phone']},
                {id: '2', label: '身份证号', valueName: ['certificateNo']},
                {id: '3', label: '居住地', valueName: ['province', 'city', 'area', 'residentialAddress']}
            ],
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
            ],
            productInfoShow: [],
            borrowerInfo: [
                {id: '0', label: '出借人', valueName: ['lender']},
                {id: '1', label: '收款人', valueName: ['gatheringName']},
                {id: '2', label: '收款账号', valueName: ['gatheringNo']},
                {id: '3', label: '开户行', valueName: ['bankName']},
            ],
            ifExtension: false
        }
    }

    componentWillMount() { //预加载数据
        if (this.props.id) {
            this.setState({
                customerId: this.props.id,
            })
            if (this.props.productId){
                this.setState({
                    productId: this.props.productId
                },function(){
                    this.getCustomer()
                })
            }
        }

        this.setState({ visible: this.props.visible })
    }

    componentWillReceiveProps(nextProps) { //组件接收到新的props时调用
        this.setState({ visible: nextProps.visible })
        if (nextProps.id) {
            this.setState({
                customerId: nextProps.id,
            })
            if (nextProps.productId){
                this.setState({
                    productId: nextProps.productId
                },function(){
                    this.getCustomer()
                })
            }
        }
    }
    handleCancel = () => {
        this.setState({
            productInfoShow: productInfoShow,
            ifExtension: false
        },function(){
            this.props.cancelPriBorrInfo()
        })
    }
    getCustomer = () => {
        request(`${api.customerByGet}${this.state.customerId}`, {}, 'get', session.get('token')) //借款人信息详情
            .then(res => {
                console.log(JSON.stringify(res))
                if (res.success) {
                    this.setState({
                        customerByInfo: res.data,
                        emergenciesInfo: res.data.emergencies ? res.data.emergencies : []
                    }, function () {
                        this.getProductInfo()
                    })
                } else {
                    message.error(res.message)
                }
            })
            .catch(err => {
                this.setState({loading: false})
            })
    }
    getProductInfo = () => {
        request(`${api.productByGet}${this.state.productId}`, {}, 'get', session.get('token')) //借款人信息详情
            .then(res => {
                console.log(JSON.stringify(res))
                this.setState({loading: false})
                if (res.success) {
                    if (res.data.parentId !== '0' && res.data.parentId) {
                        this.setState({
                            productInfoShow: productInfoShow_c,
                            ifExtension: true
                        })
                    } else {
                        this.setState({
                            productInfoShow: productInfoShow,
                            ifExtension: false
                        })
                    }
                    this.setState({
                        productInfo: res.data,
                        wereBorrowedsInfo: res.data.wereBorroweds ? res.data.wereBorroweds : []
                    }, function () {
                    })
                } else {
                    message.error(res.message)
                }

            })
            .catch(err => {
                this.setState({loading: false})
            })
    }

    handleFormBack() {
        window.history.back()
    }

    render() {
        return (
            <Modal
            visible={this.state.visible}
            okText=""
            destroyOnClose={true}
            onCancel={this.handleCancel}
            footer={<Button type='primary' onClick={this.handleCancel} className='green-style'>关闭</Button>}
            title="还款详情"
            width= '80%'
            >
                <Spin spinning={this.state.loading} size="large">
                <Card bordered={false}>
                    <div style={{backgroundColor: '#fff', width: '100%'}}>
                        <h2 className="green-title text-left">用户信息</h2>
                        <InfoShowCommon defaultValueShow={this.state.customerByShow}
                                        defaultValue={this.state.customerByInfo}/>
                        {this.state.emergenciesInfo.length > 0 && <div style={{padding: ' 0 30px'}}>
                            <MyAddEmergencyContact productId={this.props.productId} ifShow={true} defaultValue={this.state.emergenciesInfo}/>
                        </div>}
                        {/* <InfoShowCommon defaultValue={this.state.DetailInfo} defaultValueShow={this.state.serviceCostInfo} defaultTitle="服务费用"/> */}
                        <h2 className="text-left green-title">{this.state.ifExtension ? '展期信息': '借款信息'}</h2>
                        {this.state.wereBorrowedsInfo.length > 0 && <div style={{padding: '15px 30px 0 30px'}}>
                            <MyAddEmergencyContact productId={this.props.productId} showContents={this.state.showContents} addText="添加共借人" title="共借人"
                                                   buttonText="查询征信" ifShow={true}
                                                   defaultValue={this.state.wereBorrowedsInfo}/>
                        </div>}
                        <InfoShowCommon defaultValueShow={this.state.productInfoShow}
                                        defaultValue={this.state.productInfo}/>
                        {/* <InfoShowCommon defaultValue={this.state.DetailInfo} defaultValueShow={this.state.borrowerInfo} defaultTitle="借收人"/> */}
                        <h2 className="text-left green-title">还款详情及催收记录</h2>
                        <div className="white-title white-title-small marginT20"><p className="title-small">还款详情</p>
                            <Divider/></div>
                        <PaymentDetails productId={this.state.productId}/>

                    </div>
                    </Card>
                </Spin>
            </Modal>
        )
    }
}

export default RepaymentsListDetail
