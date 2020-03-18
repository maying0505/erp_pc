import React from 'react'
import {Divider, Modal, Icon, Row, Col, Table, Card, Form, Input, Select, Button, message} from 'antd'
import {hashHistory} from 'react-router'
import './index.scss'
import api from 'api'
import {request} from 'common/request/request.js'
import {local, session} from 'common/util/storage.js'
import NewDatePicker from 'component/DatePicker'
import ProductSelect from 'component/product-select'
import RepaymentMethod from 'component/repayment-method'
import ApprovalProcess from 'component/approval-process'
import StatusSelect from 'component/status-select'

const FormItem = Form.Item
const Option = Select.Option
const _tableWidth = '7%';

class AdvancedSearchForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            confirmLoading: false,
            tableListDataSource: [],
            pageInfo: {pageNo: '1', pageSize: '10'},
            searchInfo: {},
            pagination: {total: 1, pageSize: 10, current: 1},
            ModalBodyStyle: {
                textAlign: 'center',
                fontSize: '17px'
            },
            columns: [],
            modalVisible: false,
            disabled: false,
            LoanTermUnitInfo: [],//借款期限单位获取
            RepaymentMethodInfo: [],//还款方式获取
            productId: '',
            productIdAppPr: '',
            modalVisibleAppPr: false
        }
    }

    componentDidMount() { //预加载数据
        this.loadlists(this.state.pageInfo) //获取数据列表
        this.deadlineUnitGet()

    }

    showModal = (e) => {
        this.setState({
            modalVisibleAppPr: false,
            modalVisible: true,
            productId: e.productBy.id
        })
    }
    modalHandleOk = (e) => {
        this.setState({confirmLoading: true})
        request(api.extendATimeLimitAdd, {productId: this.state.productId}, 'post', session.get('token'))
            .then(res => {
                console.log(JSON.stringify(res))
                this.setState({confirmLoading: false})
                if (res.success) {
                    this.setState({
                        modalVisible: false,
                    }, function () {
                        hashHistory.push(`/loan-application/loan-application-detail/${res.data.customerBy.id}/${res.data.id}/0`)
                    })
                } else {
                    message.error(res.message)
                }
            })
            .catch(err => {
                this.setState({confirmLoading: false})
            })
    }
    modalHandleCancel = (e) => {
        console.log(e);
        this.setState({
            modalVisible: false,
        })
    }
    deadlineUnitGet = (e) => {//借款期限单位获取
        request(api.loanTermUnit, {}, 'get', session.get('token'))
            .then(res => {
                console.log(JSON.stringify(res))
                if (res.success) {
                    this.setState({
                        LoanTermUnitInfo: res.data,
                    }, this.refundWarGet());
                }
            })
    }
    refundWarGet = (e) => {//还款方式获取
        request(api.repaymentType, {}, 'get', session.get('token'))
            .then(res => {
                console.log(JSON.stringify(res))
                if (res.success) {
                    this.setState({
                        RepaymentMethodInfo: res.data,
                    }, function () {
                        this.setState({
                            columns: [
                                {
                                    title: '姓名',
                                    dataIndex: 'name',
                                    // fixed: 'left',
                                    width: _tableWidth,
                                    render: (text) => text ? text : '--'
                                },
                                {
                                    title: '合同编号',
                                    dataIndex: 'productBy.contractNo',
                                    width: _tableWidth,
                                    render: (text) => text ? text : '--'
                                },
                                {
                                    title: '身份证号',
                                    dataIndex: 'certificateNo',
                                    width: _tableWidth,
                                    render: (text) => text ? text : '--'
                                },
                                {
                                    title: '手机号',
                                    dataIndex: 'phone',
                                    width: _tableWidth,
                                    render: (text) => text ? text : '--'
                                },
                                {
                                    title: '产品',
                                    dataIndex: 'productBy.proName',
                                    width: _tableWidth,
                                    render: (text) => text ? text : '--'
                                },
                                {
                                    title: '借款金额（元）',
                                    dataIndex: 'productBy.lendMoney',
                                    // width: _tableWidth,
                                    render: (text) => text ? text : '--'
                                },
                                {
                                    title: '申请时间',
                                    dataIndex: 'enteringDate',
                                    width: _tableWidth,
                                    render: (text) => text ? text : '--'
                                },
                                {
                                    title: '借款期限',
                                    dataIndex: 'productBy.deadline',
                                    width: _tableWidth,
                                    render: (text, record) => this.deadlineRender(text, record)
                                },
                                {
                                    title: '还款方式',
                                    dataIndex: 'productBy.refundWar',
                                    width: _tableWidth,
                                    render: (text) => this.refundWarRender(text)
                                },
                                {
                                    title: '分公司',
                                    dataIndex: 'companyBy.name',
                                    width: _tableWidth,
                                    render: (text) => text ? text : '--'
                                },
                                {
                                    title: '业务员',
                                    dataIndex: 'productBy.salesman',
                                    width: _tableWidth,
                                    render: (text) => text ? text : '--'
                                },
                                {
                                    title: '状态',
                                    dataIndex: 'dictStage.label',
                                    width: _tableWidth,
                                    render: (text, record) => {
                                        console.log(record.productBy)
                                        if (record.productBy && record.productBy['backCount'] > 0 && record.dictStage && record.dictStage['value'] === '1') {
                                            return text ?
                                                <span>{text}<span className="red-style">（退）</span></span> : '--'
                                        } else {
                                            return text ? text : '--'
                                        }
                                    }
                                },
                                {
                                    title: '业务流程', /*自定义标题*/
                                    // fixed: 'right',
                                    width: _tableWidth,
                                    dataIndex: 'productBy.id', /*自定义数据，默认为空。因为自定义数据一般用来指定某个功能，要用render来return*/
                                    render: (text) => <a className="gray-style"
                                                         onClick={this.viewProcess.bind(this, text)}>查看流程</a>   /*自定义内容*/
                                },
                                {
                                    title: '操作',
                                    // fixed: 'right',
                                    width: '9%',
                                    dataIndex: 'dictStage.value',
                                    render: (text, record) => {
                                        if (text === '10') {
                                            return <span>
                                                        <span className="green-span nowrap_s"
                                                              onClick={this.viewDetail.bind(this, record)}>详情</span>
                                                        <Divider type="vertical"/>
                                                        <span className="green-span nowrap_s"
                                                              onClick={this.showModal.bind(this, record)}>展期</span>
                                                    </span>
                                        }
                                        else {
                                            return text !== '1' ? <span className="green-span"
                                                                        onClick={this.viewDetail.bind(this, record)}>详情</span> :
                                                <span className="green-span"
                                                      onClick={this.updateDetail.bind(this, record)}>
                                                    修改
                                                </span>
                                        }
                                    }
                                },
                            ]
                        })
                    });
                }

            })
    }

    deadlineRender(text, record) { //自定借款期限显示
        let deadline = '--'
        if (record.productBy && text) {
            for (let item of this.state.LoanTermUnitInfo) {
                if (item.value === record.productBy.deadlineUnit) {
                    deadline = `${text}${item.label}`
                    break
                }
            }
        }
        return deadline
    }

    refundWarRender(text) { //自定义还款方式显示
        let refundWar = '--'
        for (let item of this.state.RepaymentMethodInfo) {
            if (item.value === text) {
                refundWar = item.label
                break
            }
        }
        return refundWar
    }

    viewProcess(text) { //查看流程
        this.setState({
            productIdAppPr: text ? text : '',
            modalVisibleAppPr: true
        })
    }

    onCancelAppPro = () => {
        this.setState({
            modalVisibleAppPr: false
        })
    }

    updateDetail(e) { //修改
        e.productBy ? hashHistory.push(`/loan-application/loan-application-detail/${e.id}/${e.productBy.id}/0`) :
            hashHistory.push(`/loan-application/loan-application-detail/${e.id}/null/0`)
    }

    viewDetail(e) { //查看详情
        e.productBy ? hashHistory.push(`/loan-application/loan-application-detail/${e.id}/${e.productBy.id}/1`) :
            hashHistory.push(`/loan-application/loan-application-detail/${e.id}/null/1`)
    }

    pageJump = (e) => { //分页跳转
        this.setState({
            modalVisibleAppPr: false
        })
        console.log(e)
        this.setState({
            pageInfo: {pageNo: e.current, pageSize: e.pageSize},
            pagination: {...this.state.pagination, current: e.current}
        }, function () {
            this.loadlists({...this.state.pageInfo, ...this.state.searchInfo})
        })
    }
    handleSearch = (e) => { //查询请求
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (values.filingDate) {
                values.filingDate = values.filingDate.format('YYYY-MM-DD')
            }
            if (values.proName) {
                values.proName = values.proName.split('-')[0]
            }
            this.setState({
                searchInfo: {...this.state.searchInfo, ...values},
                pagination: {total: 1, pageSize: 10, current: 1},
                pageInfo: {pageNo: '1', pageSize: '10'},
            }, function () {
                this.loadlists({...this.state.pageInfo, ...this.state.searchInfo})
            })
        });
    }

    loadlists(data) { //请求数据函数
        console.log(data)
        request(api.loanApplicationList, data, 'post', session.get('token'))
            .then(res => {
                console.log('loadlists', res);
                this.setState({loading: false});
                if (res.success) {
                    this.setState({
                        tableListDataSource: res.data.list,
                        pagination: {...this.state.pagination, total: res.data.count},
                        loading: false
                    });
                }
            })
            .catch(err => {
                console.log(err)
                this.setState({loading: false})
            })
    }

    handleFormReset = () => { //重置查询
        this.props.form.resetFields()
        this.setState({
            pageInfo: {pageNo: '1', pageSize: '10'},
            pagination: {total: 1, pageSize: 10, current: 1},
            searchInfo: {}
        }, function () {
            this.loadlists(this.state.pageInfo)
        })
    }

    addTableRow() { //新建
        hashHistory.push('/loan-application/loan-application-detail/null/null/0')
    }

    renderAdvancedForm() { //查询条件DOM
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline" className="ant-form-my">
                <Row>
                    <Col md={6} sm={12}>
                        <NewDatePicker fieldName="filingDate" form={this.props.form}/>
                    </Col>
                    <Col md={6} sm={12}>
                        <FormItem label="客户姓名">
                            {getFieldDecorator('name')(
                                <Input placeholder="请输入"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={12}>
                        <ProductSelect form={this.props.form} fieldName="proName"/>
                    </Col>
                    <Col md={6} sm={12}>
                        <RepaymentMethod form={this.props.form} fieldName="refundWar"/>
                    </Col>
                    <Col md={6} sm={12}>
                        <FormItem label="业务员">
                            {getFieldDecorator('salesman')(
                                <Input placeholder="请输入"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <StatusSelect form={this.props.form} fieldName="queryStages"/>
                    </Col>
                </Row>
                <div style={{overflow: 'hidden'}}>
          <span style={{float: 'left'}}>
            <Button htmlType="submit" className="green-style">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset} className="default-btn">重置</Button>
          </span>
                </div>
            </Form>
        );
    }

    render() {
        return (
            <div className="table-list">
                <Card bordered={false}>
                    <h1>进件列表
                        <span style={{marginLeft: 24, verticalAlign: 'text-bottom'}}>
              <Button onClick={this.addTableRow} className="green-style"><Icon type="plus"/><span>发起申请</span></Button>
            </span>
                    </h1>
                    <div>{this.renderAdvancedForm()}</div>
                    <Table rowKey="ident" bordered columns={this.state.columns}
                           dataSource={this.state.tableListDataSource} loading={this.state.loading}
                           onChange={this.pageJump} pagination={this.state.pagination}/>
                    <ApprovalProcess onCancelAppPro={this.onCancelAppPro.bind(this)}
                                     modalVisible={this.state.modalVisibleAppPr} productId={this.state.productIdAppPr}/>
                    <Modal
                        title=""
                        okText="确认"
                        cancelText="取消"
                        bodyStyle={this.state.ModalBodyStyle}
                        visible={this.state.modalVisible}
                        onOk={this.modalHandleOk}
                        onCancel={this.modalHandleCancel}
                        confirmLoading={this.state.confirmLoading}
                    >
                        是否确认展期？
                    </Modal>
                </Card>
            </div>
        )
    }
}

const LoanApplication = Form.create()(AdvancedSearchForm)
export default LoanApplication
