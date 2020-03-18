import React from 'react'
import {Icon, Row, Col, Table, Card, Form, Input, Divider, Select, Button, DatePicker, message } from 'antd'
import {hashHistory} from 'react-router'
import api from 'api'
import imgUrl from 'common/util/imgUrl.js'
import {request} from 'common/request/request.js'
import {local, session} from 'common/util/storage.js'
import NewDatePicker from 'component/DatePicker'
import ProductSelect from 'component/product-select'
import RepaymentMethod from 'component/repayment-method'
import StatusSelect from 'component/status-select'
import BranchOffice from 'component/branchOffice'
import ApprovalProcess from 'component/approval-process'
import PriBorrInfoShow from 'component/pri-borr-info-show'

const FormItem = Form.Item
const Option = Select.Option
const _tableWidth = '7.1%'

class ZipDownloadForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            priPictureDataJson: {},
            ifShowPriBorrInfo: false,
            priLoanInfo: {},
            loading: true,
            tableListDataSource: [],
            pageInfo: { pageNo: '1', pageSize: '10', queryStages: "[]"  },
            searchInfo: {},
            pagination: { total: 1, pageSize: 10, current: 1 },
            columns:[],
            disabled: false,
            LoanTermUnitInfo: [],//借款期限单位获取
            RepaymentMethodInfo: [],//还款方式获取
            productId: '',
            modalVisible: false,
            ifExtension: false,
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
                        render: (text) => text ? text : '--'
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
                        render: (text) => text ? text : '--',
                        width: _tableWidth,
                      },
                      {
                        title: '手机号',
                        dataIndex: 'customerBy.phone',
                        width: _tableWidth,
                        render: (text) => text ? text : '--',
                      },
                      {
                        title: '产品',
                        dataIndex: 'proName',
                        width: _tableWidth,
                        render: (text) => text ? text : '--',
                      },
                      {
                        title: '借款金额（元）',
                        dataIndex: 'lendMoney',
                        render: (text) => text ? text : '--',
                        // width: _tableWidth,
                      },
                      {
                        title: '申请时间',
                        dataIndex: 'customerBy.enteringDate',
                        render: (text) => text ? text : '--',
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
                        render: (text) => text ? text : '--',
                        width: _tableWidth,
                      },
                      {
                        title: '业务员',
                        dataIndex: 'salesman',
                        render: (text) => text ? text : '--',
                        width: _tableWidth,
                      },
                      {
                        title: '状态',
                        dataIndex: 'dictStage.label',
                        width: _tableWidth,
                        render: (text) => text ? text : '--',
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
                        render: (text,record) =><div>
                            <span className="green-span"  onClick={this.viewDetail.bind(this,record)}>查看</span>
                            <Divider type="vertical"/>
                            <div className="green-span"  onClick={this.ZipDownload.bind(this,record)} style={{width: '56px'}}>打包下载</div>
                            </div>
                      },
                    ]
                  })
                });
            }

        })
    }
    deadlineRender(text,record){ //自定借款期限显示
      let deadline = '--'
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
      let refundWar = '--'
      for (let item of this.state.RepaymentMethodInfo) {
        if (item.value === text) {
          refundWar = item.label
          break
        }
      }
      return refundWar
    }
    loadDetail = (productId) => {
      request(`${api.productByGet}${productId}`, {}, 'get', session.get('token')) //借款人信息详情
          .then(res => {
              console.log('aaa:',JSON.stringify(res.data))
              this.setState({loading: false})
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
                          console.log(JSON.stringify(this.state.priPictureDataJson))
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
                  console.log('bbb:',JSON.stringify(this.state.priPictureDataJson))
                  this.showPriBorrInfo()

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
    ZipDownload(e){ //打包下载
        this.setState({loading: true})
        request(api.zipDownload,{
            productId: e.id
        },'get',session.get('token'))
        .then(res => {
            console.log(JSON.stringify(res))
            this.setState({loading: false})
            if (res.success && res.data){
              window.open(res.data)
            } else {
              message.error(res.message)
            }
        })
        .catch(err => {
            this.setState({loading: false})
        })
    }
    viewDetail(e){ //查看
      this.setState({
        priPictureDataJson: {}
      },function(){
        this.loadDetail(e.id)
      })

      //  hashHistory.push(`/re-checked/re-checked-detail/${e.customerBy.id}/${e.id}/${e.audit.id ? e.audit.id : null}/${e.audit.state ? e.audit.state : null}`)
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
        values.beforeValueDate ? values.beforeValueDate = values.beforeValueDate.format('YYYY-MM-DD') : null
        values.laterValueDate ? values.laterValueDate = values.laterValueDate.format('YYYY-MM-DD') : null
        if (values.proName) {
          values.proName = values.proName.split('-')[0]
        }
        values.queryStages ? null : values.queryStages = "[]"
        this.setState({
          searchInfo: {...this.state.searchInfo,...values},
          pagination: { total: 1, pageSize: 10, current: 1 },
          pageInfo: { pageNo: '1', pageSize: '10', queryStages: "[]"  },
        },function(){
          this.loadlists({...this.state.pageInfo,...this.state.searchInfo})
        })
      });
     }
    loadlists(data){ //请求数据函数
      console.log(data)
      request(api.getSearchInfo,data,'post',session.get('token'))
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
          pageInfo: { pageNo: '1', pageSize: '10', queryStages: "[]"  },
          pagination: { total: 1, pageSize: 10, current: 1 },
          searchInfo: {}
        },function(){
          this.loadlists(this.state.pageInfo)
        })
    }

    // handleExport = () =>{//导出
    //   request(api.caseListExport,{...this.state.pageInfo,...this.state.searchInfo},'post',session.get('token'))
    //   .then(res => {
    //       console.log(JSON.stringify(res))
    //       if (res.success){
    //           res.data ? window.open(res.data) :  message.error('导出失败')
    //       } else {
    //         message.error('导出失败')
    //       }
    //   })
    // }

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
                <FormItem label="合同编号">
                  {getFieldDecorator('contractNo')(
                    <Input placeholder="请输入合同编号" />
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <ProductSelect form={this.props.form} fieldName="proName"/>
              </Col>
              <Col md={6} sm={24}>
                <RepaymentMethod form={this.props.form} fieldName="refundWar"/>
              </Col>
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
            </Row>
            <div style={{ overflow: 'hidden' }}>

              <span style={{ float: 'left'}}>
                <Button type="primary" htmlType="submit"  className="green-style">查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}  className="default-btn">重置</Button>
                {/* <Button style={{ marginLeft: 8 }} onClick={this.handleExport}  className="green-style">导出</Button> */}
              </span>
            </div>
          </Form>
        );
    }

    render() {
        return(
            <div className="table-list">
                <Card bordered={false}>
                    <h1>文件归档</h1>
                    <div>{this.renderAdvancedForm()}</div>
                    <Table bordered rowKey="ident" columns={this.state.columns} dataSource={this.state.tableListDataSource} loading={this.state.loading} onChange={this.pageJump} pagination={this.state.pagination}/>
                    <ApprovalProcess onCancelAppPro={this.onCancelAppPro.bind(this)} modalVisible={this.state.modalVisible} productId={this.state.productId}/>
                </Card>
                <PriBorrInfoShow ifExtension={this.state.ifExtension} cancelPriBorrInfo={this.cancelPriBorrInfo.bind(this)}
                                 visible={this.state.ifShowPriBorrInfo} LoanInfo={this.state.priLoanInfo}
                                 pictureDataJson={this.state.priPictureDataJson}/>
            </div>
        )
    }
}
const ZipDownload = Form.create()(ZipDownloadForm)
export default ZipDownload
