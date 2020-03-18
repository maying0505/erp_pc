import React from 'react'
import {Icon, Row, Col, Table, Card, Form, Input, Select, Button, DatePicker, message } from 'antd'
import {hashHistory} from 'react-router'
import './index.scss'
import api from 'api'
import {request} from 'common/request/request.js'
import {local, session} from 'common/util/storage.js'
import NewDatePicker from 'component/DatePicker'
import ProductSelect from 'component/product-select'
import RepaymentMethod from 'component/repayment-method'
import StatusSelect from 'component/status-select'
import BranchOffice from 'component/branchOffice'
import ApprovalProcess from 'component/approval-process'

const FormItem = Form.Item
const Option = Select.Option
const _tableWidth = '7.1%'
class SignContractForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            tableListDataSource: [],
            pageInfo: { pageNo: '1', pageSize: '10' ,menuStages: JSON.stringify(["6"]), queryStages: "[]"  },
            searchInfo: {},
            pagination: { total: 1, pageSize: 10, current: 1 },
            columns:[],
            disabled: false,
            LoanTermUnitInfo: [],//借款期限单位获取
            RepaymentMethodInfo: [],//还款方式获取
            productId: '',
            modalVisible: false
        }
    }
    
    componentDidMount(){ //预加载数据
        this.loadlists(this.state.pageInfo) //获取数据列表
        this.deadlineUnitGet() 
        
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
                },function(){
                  this.setState({
                    columns: [
                      {
                        title: '姓名',
                        dataIndex: 'customerBy.name',
                        // fixed: 'left',
                        width: _tableWidth,
                      },
                      {
                        title: '合同编号',
                        dataIndex: 'contractNo',
                        width: _tableWidth,
                        render: (text) => text ? text : '--'
                      },
                      {
                        title: '身份证号',
                        dataIndex: 'customerBy.certificateNo',
                        width: _tableWidth,
                      },
                      {
                        title: '手机号',
                        dataIndex: 'customerBy.phone',
                        width: _tableWidth,
                      },
                      {
                        title: '产品',
                        dataIndex: 'proName',
                        width: _tableWidth,
                      },
                      {
                        title: '借款金额（元）',
                        dataIndex: 'lendMoney',
                        // width: _tableWidth,
                      },
                      {
                        title: '申请时间',
                        dataIndex: 'customerBy.enteringDate',
                        width: _tableWidth,
                      },
                      {
                        title: '借款期限',
                        dataIndex: 'deadline',
                        width: _tableWidth,
                        render: (text, record) => this.deadlineRender(text, record)
                      },
                      {
                        title: '还款方式',
                        dataIndex: 'refundWar',
                        width: _tableWidth,
                        render: (text) => this.refundWarRender(text)
                      },
                      {
                        title: '分公司',
                        dataIndex: 'company.name',
                        width: _tableWidth,
                      },
                      {
                        title: '业务员',
                        dataIndex: 'salesman',
                        width: _tableWidth,
                      },
                      {
                        title: '状态',
                        dataIndex: 'dictStage.label',
                        width: _tableWidth,
                      },
                      {
                        title: '业务流程',  /*自定义标题*/
                        // fixed: 'right',
                        width: _tableWidth,
                        dataIndex: 'id',   /*自定义数据，默认为空。因为自定义数据一般用来指定某个功能，要用render来return*/
                        render: (text) => <a className="gray-style" onClick={this.viewProcess.bind(this,text)}>查看流程</a>   /*自定义内容*/
                      },
                      {
                        title: '操作', 
                        width: _tableWidth,
                        // fixed: 'right',
                        dataIndex: 'audit.state',  
                        render: (text, record) => text !== '1' ? <span className="green-span"  onClick={this.viewDetail.bind(this,record)}>查看</span>: <span className="green-span" onClick={this.updateDetail.bind(this,record)}>签约</span>
                      },
                    ]
                  })
                });
            }
            
        })
    }
    deadlineRender(text,record){ //自定借款期限显示
      let deadline = ''
      if (record.deadlineUnit && text) {
        for (let item of this.state.LoanTermUnitInfo) {
          if (item.value === record.deadlineUnit) {
            deadline = `${text}${item.label}`
            break
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
    viewProcess(text){ //查看流程
      this.setState({
        productId: text ? text : '',
        modalVisible: true
      })
    }
    onCancelAppPro = ()=> {
      this.setState({
        modalVisible: false
      })
    }
    updateDetail(e){ //审批
       hashHistory.push(`/sign-contract/sign-contract-detail/${e.customerBy.id}/${e.id}/${e.audit.id ? e.audit.id : null}/${e.audit.state ? e.audit.state : null}`)
    }
    viewDetail(e){ //查看
       hashHistory.push(`/sign-contract/sign-contract-detail/${e.customerBy.id}/${e.id}/${e.audit.id ? e.audit.id : null}/${e.audit.state ? e.audit.state : null}`)
    }
    pageJump = (e) =>{ //分页跳转
      console.log(e)
      this.setState({
        pageInfo: {...this.state.pageInfo,pageNo:e.current,pageSize:e.pageSize},
        pagination: { ...this.state.pagination, current: e.current }
      },function(){
        this.loadlists({...this.state.pageInfo,...this.state.searchInfo})
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
        values.queryStages ? null : values.queryStages = "[]"
        this.setState({
          searchInfo: {...this.state.searchInfo,...values},
          pagination: { total: 1, pageSize: 10, current: 1 },
          pageInfo: { pageNo: '1', pageSize: '10' ,menuStages: JSON.stringify(["6"]), queryStages: "[]"  },
        },function(){
          this.loadlists({...this.state.pageInfo,...this.state.searchInfo})
        })
      });
     }
    loadlists(data){ //请求数据函数
      console.log(data)
      request(api.riskManagementlist,data,'post',session.get('token'))
        .then(res => {
            console.log(JSON.stringify(res))
            this.setState({loading: false})
            if (res.success){
              this.setState({
                tableListDataSource: res.data.list,
                pagination: { ...this.state.pagination, total: res.data.count },
                loading: false
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
          pageInfo: { pageNo: '1', pageSize: '10' ,menuStages: JSON.stringify(["6"]), queryStages: "[]"  },
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
              <Col md={6} sm={24}>
                <NewDatePicker  fieldName="filingDate" form={this.props.form} />
              </Col>
              <Col md={6} sm={24}>
                <FormItem label="客户姓名">
                  {getFieldDecorator('name')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <ProductSelect form={this.props.form} fieldName="proName"/>
              </Col>
              <Col md={6} sm={24}>
                <RepaymentMethod form={this.props.form} fieldName="refundWar"/>
              </Col>
            </Row>
            <Row>
              <Col md={6} sm={24}>
                <StatusSelect form={this.props.form} fieldName="queryStages"/>
              </Col>
              <Col md={6} sm={24}>
                <BranchOffice form={this.props.form} fieldName="companyBy"/>
              </Col>
              <Col md={6} sm={24}>
                <FormItem label="业务员">
                  {getFieldDecorator('salesman')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
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
                    <h1>签约列表</h1>
                    <div>{this.renderAdvancedForm()}</div>
                    <Table bordered rowKey="ident" columns={this.state.columns} dataSource={this.state.tableListDataSource} loading={this.state.loading} onChange={this.pageJump} pagination={this.state.pagination}/>
                    <ApprovalProcess onCancelAppPro={this.onCancelAppPro.bind(this)} modalVisible={this.state.modalVisible} productId={this.state.productId}/>
                </Card>
            </div>
        )
    }
}
const SignContract = Form.create()(SignContractForm)
export default SignContract