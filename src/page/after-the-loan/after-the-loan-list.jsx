import React from 'react'
import PropTypes from 'prop-types'
import { InputNumber, Icon, Row, Col, Table, Card, Form, Input, Select, Button, DatePicker, message } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
import {hashHistory} from 'react-router'
import './index.scss'
import api from 'api'
import {request} from 'common/request/request.js'
import {local, session} from 'common/util/storage.js'
import ProductSelect from 'component/product-select'
import RepaymentMethod from 'component/repayment-method'
import StatusSelect from 'component/status-select'
import BranchOffice from 'component/branchOffice'

const FormItem = Form.Item
const Option = Select.Option

class AfterTheLoanListForm extends React.Component {
    static propTypes = {
        requestName: PropTypes.string.isRequired,
        NumberOfDays: PropTypes.array.isRequired,
        ifOverdueSearch: PropTypes.bool.isRequired,
        NumberOfDaysSearch: PropTypes.array.isRequired,
        listTitle:  PropTypes.string.isRequired,
        ifShowRealRepay: PropTypes.bool,
    };

    static defaultProps = {
      ifShowRealRepay: false,
    };
    _tableWidth = `${100/(this.props.NumberOfDays.length+14.1)}%`

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            tableListDataSource: [],
            pageInfo: { pageNo: '1', pageSize: '10' },
            searchInfo: {},
            pagination: { total: 1, pageSize: 10, current: 1 },            
            columns: [
                {
                    title: '期数',
                    dataIndex: 'repaymentBy.period',
                    // fixed: 'left',
                    width: this._tableWidth,
                    render: (text, record) => text && record.repaymentBy.totalPeriod ? `${text}/${record.repaymentBy.totalPeriod}` : '--'
                },
                {
                    title: '姓名',
                    dataIndex: 'customerBy.name',
                    // fixed: 'left',
                    width: this._tableWidth,
                },
                {
                    title: '合同编号',
                    dataIndex: 'contractNo',
                    width: this._tableWidth,
                },
                {
                    title: '身份证号',
                    dataIndex: 'customerBy.certificateNo',
                    width: this._tableWidth,
                },
                {
                    title: '产品',
                    dataIndex: 'proName',
                    width: this._tableWidth,
                },
                {
                    title: '借款金额（元）',
                    dataIndex: 'lendMoney',
                    // width: this._tableWidth,
                },
                {
                    title: '放款时间',
                    dataIndex: 'valueDate',
                    width: this._tableWidth,
                },
                {
                    title: '借款期限',
                    dataIndex: 'deadline',
                    width: this._tableWidth,
                    render: (text, record) => this.deadlineRender(text, record)
                },
                {
                    title: '应还款时间',
                    dataIndex: 'repaymentBy.predictDate',
                    width: this._tableWidth,
                },...this.props.NumberOfDays,
                {
                    title: '还款方式',
                    dataIndex: 'refundWar',
                    width: this._tableWidth,
                    render: (text) => this.refundWarRender(text)
                },
                {
                    title: '分公司',
                    dataIndex: 'company.name',
                    width: this._tableWidth,
                },
                {
                    title: '业务员',
                    dataIndex: 'salesman',
                    width: this._tableWidth,
                },           
                {
                    title: '还款状态',
                    dataIndex: 'repaymentBy.state',
                    width: this._tableWidth,
                    render: (text) => this.repaymentStateRender(text)
                },
                {
                    title: '操作', 
                    width: this._tableWidth,
                    // fixed: 'right',
                    dataIndex: '',  
                    render: (text,record) => <span className="green-span"  onClick={this.viewDetail.bind(this,record)}>详情</span>
                }
            ],
            disabled: false,
            LoanTermUnitInfo: [],//借款期限单位获取
            RepaymentMethodInfo: [],//还款方式获取
        }
    }
    
    componentWillMount(){ //预加载数据
        this.loadlists(this.state.pageInfo) //获取数据列表
        this.deadlineUnitGet() 
        // this.setState({
        //     columns: {...this.state.columns1,...this.props.NumberOfDays,...this.state.columns2}
        // },function(){
        //     this.setState({
        //         columnsNum: this.state.columns.length*100
        //     })
        // })
    }
    deadlineUnitGet = (e) => {//借款期限单位获取
      request(api.loanTermUnit,{},'get',session.get('token'))
        .then(res => {
            console.log(JSON.stringify(res))
            if (res.success){
              this.setState({
                  LoanTermUnitInfo: res.data,
              },this.refundWarGet());
            }
        })
    }
    refundWarGet = (e) => {//还款方式获取
      request(api.repaymentType,{},'get',session.get('token'))
        .then(res => {
        console.log(JSON.stringify(res))
            if (res.success){
                this.setState({
                    RepaymentMethodInfo: res.data,
                });
            }
            
        })
    }
    repaymentStateRender = (text) => {//还款状态显示
      let renderText = ''
      if (text){
        text === '1' ? renderText = '未还款' : renderText = '已还款'
      }
      return renderText
    }
    
    deadlineRender(text,record){ //自定借款期限显示
      let deadline = ''
      if (text !== '' && text !== null && text !== undefined) {
        if (record.deadlineUnit) {
          for (let item of this.state.LoanTermUnitInfo) {
            if (item.value === record.deadlineUnit) {
              deadline = `${text}${item.label}`
              break
            }
          }
        }
      }
      return deadline
    }
    
    refundWarRender(text){ //自定义还款方式显示
      let refundWar = ''
      for (let item of this.state.RepaymentMethodInfo) {
        if (item.value === text) {
          refundWar = item.label
          break
        }
      }
      return refundWar
    }
    viewProcess(e){ //查看流程
      console.log(e)
    }
    viewDetail(e){ //查看
       hashHistory.push(`after-the-loan/after-the-loan-detail/${e.customerBy.id}/${e.id}`)
    }
    pageJump = (e) =>{ //分页跳转
      console.log(e)
      this.setState({
        pageInfo: {pageNo:e.current,pageSize:e.pageSize},
        pagination: { ...this.state.pagination, current: e.current }
      },function(){
        this.loadlists({...this.state.pageInfo,...this.state.searchInfo})
      })
    }
    handleSearch = (e) => { //查询请求
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        console.log(values)
        values.beforeValueDate ? values.beforeValueDate = values.beforeValueDate.format('YYYY-MM-DD') : null
        values.laterValueDate ? values.laterValueDate = values.laterValueDate.format('YYYY-MM-DD') : null
        values.beforePredictDate ? values.beforePredictDate = values.beforePredictDate.format('YYYY-MM-DD') : null
        values.laterPredictDate ? values.laterPredictDate = values.laterPredictDate.format('YYYY-MM-DD') : null
        values.beforeRealityDate ? values.beforeRealityDate = values.beforeRealityDate.format('YYYY-MM-DD') : null
        values.laterRealityDate ? values.laterRealityDate = values.laterRealityDate.format('YYYY-MM-DD') : null
        if (values.proName) {
          values.proName = values.proName.split('-')[0]
        }
        this.setState({
          searchInfo: {...this.state.searchInfo,...values},
          pagination: { total: 1, pageSize: 10, current: 1 },
          pageInfo: { pageNo: '1', pageSize: '10' },
        },function(){
          this.loadlists({...this.state.pageInfo,...this.state.searchInfo})
        })
      });
     }
    loadlists(data){ //请求数据函数
      console.log(data)
      request(this.props.requestName,data,'post',session.get('token'))
        .then(res => {
            console.log(JSON.stringify(res))
            this.setState({loading: false})
            if (res.success){
              this.setState({
                tableListDataSource: res.data.list,
                pagination: { ...this.state.pagination, total: res.data.count },
              });
            } else {
              message.error(res.message)
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
          pageInfo: { pageNo: '1', pageSize: '10' },
          pagination: { total: 1, pageSize: 10, current: 1 },
          searchInfo: {}
        },function(){
          this.loadlists(this.state.pageInfo)
        })
    }
    
    renderAdvancedForm() { //查询条件DOM
        const { getFieldDecorator } = this.props.form;
        return (
          <Form onSubmit={this.handleSearch} layout="inline" className="ant-form-my">
            <Row>
              <Col md={6} sm={12}>
                <FormItem label="借款人">
                  {getFieldDecorator('name')(
                    <Input placeholder="姓名/身份证" />
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={12}>
                <FormItem label="合同编号">
                  {getFieldDecorator('contractNo')(
                    <Input placeholder="请输入合同编号" />
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={12}>
                <ProductSelect form={this.props.form} fieldName="proName"/>
              </Col>
              <Col md={6} sm={12}>
                <BranchOffice form={this.props.form} fieldName="companyId"/>
              </Col>
              <Col md={6} sm={12}>
                <FormItem label="业务员">
                  {getFieldDecorator('salesman')(
                    <Input placeholder="请输入业务员姓名" />
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={12}>
                <FormItem label="还款状态">
                  {getFieldDecorator('state')(
                    <Select placeholder="请选择" allowClear={true}>
                        <Option value="2" key="0">已还款</Option>
                        <Option value="1" key="1">未还款</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
             {this.props.ifOverdueSearch? <Col md={6} sm={12}>
                <FormItem label="是否逾期">
                  {getFieldDecorator('isOverdue')(
                    <Select placeholder="请选择" allowClear={true}>
                        <Option value="1" key="0">是</Option>
                        <Option value="2" key="1">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>:null}
              <Col md={6} sm={12}>
                <RepaymentMethod form={this.props.form} fieldName="refundWar"/>
              </Col>
              {this.props.NumberOfDaysSearch.map((item) =>
                <Col md={6} sm={12} key={item.filedName[0]}>
                    <FormItem label={item.label}>
                    {getFieldDecorator(item.filedName[0])(
                        <InputNumber style={{width:'45%'}}/>
                    )}<span className="number-bettw">至</span>
                    {getFieldDecorator(item.filedName[1])(
                        <InputNumber style={{width:'45%'}} />
                    )}
                    </FormItem>
                </Col>
              )}
              <Col md={6} sm={24}>
                <FormItem label="放款时间">
                  {getFieldDecorator('beforeValueDate')(
                    <DatePicker style={{width:'45%'}} placeholder="年/月/日"/>
                  )}<span className="number-bettw">至</span>
                  {getFieldDecorator('laterValueDate')(
                    <DatePicker style={{width:'45%'}}  placeholder="年/月/日"/>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={12}>
                <FormItem label="应还款时间">
                  {getFieldDecorator('beforePredictDate')(
                    <DatePicker style={{width:'45%'}}  placeholder="年/月/日"/>
                  )}<span className="number-bettw">至</span>
                  {getFieldDecorator('laterPredictDate')(
                    <DatePicker style={{width:'45%'}}  placeholder="年/月/日"/>
                  )}
                </FormItem>
              </Col>
              {this.props.ifShowRealRepay && <Col md={6} sm={12}>
                <FormItem label="实还款时间">
                  {getFieldDecorator('beforeRealityDate')(
                    <DatePicker style={{width:'45%'}}  placeholder="年/月/日"/>
                  )}<span className="number-bettw">至</span>
                  {getFieldDecorator('laterRealityDate')(
                    <DatePicker style={{width:'45%'}}  placeholder="年/月/日"/>
                  )}
                </FormItem>
              </Col>}
            </Row>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ float: 'left'}}>
                <Button type="primary" htmlType="submit"  className="green-style">查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}  className="default-btn">重置</Button>
              </span>
            </div>
          </Form>
        );
    }
    
    render() {
        return(
            <div className="table-list">
                <Card bordered={false}>
                    <h1>{`贷后管理-${this.props.listTitle}`}</h1>
                    <div>{this.renderAdvancedForm()}</div>
                    <Table rowKey="ident" bordered columns={this.state.columns} dataSource={this.state.tableListDataSource} loading={this.state.loading} onChange={this.pageJump} pagination={this.state.pagination}/>
                </Card>
            </div>
        )
    }
}
const AfterTheLoanList = Form.create()(AfterTheLoanListForm)
export default AfterTheLoanList