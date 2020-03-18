import React from 'react';
import { Modal, message, Form, Row, Col, Input, Button, Icon, DatePicker, Select, Radio, Spin, messag, Cascader } from 'antd';
import {hashHistory} from 'react-router'
import MyAddEmergencyContact from 'component/add-emergency-contact'
import PicturesWall from 'component/img-upload'
import NewDatePicker from 'component/DatePicker'
import {request} from 'common/request/request.js'
import imgUrl from 'common/util/imgUrl.js'
import {local, session} from 'common/util/storage.js'
import LodashDebounce from 'common/util/debounce'
import CreditInvestigation from 'component/search-credit-investigation'

import api from 'api'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;


class LoanBusinessInfoForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            loanApplicationInfo: {},
            addr:[],
            fileList: [],//客户相关资料
            customerByInfo: [],
            emergenciesInfo: [],
            residentialAddressBefore: [],//省市区默认值
            enteringDate: "",
            customerInfo: [],
            customerId: '',
            isSave: true,
            ifShowCreditInvestigation: false,
            certificateType: '1',
            businessId: '',
            ifCreditInvestigation: false,
        }
    }
    componentDidMount(){ //预加载数据
        console.log(this.props.id)
        if(this.props.id != 'null'){
            this.setState({
                customerId: this.props.id
            })
            session.set('customerId', this.props.id)
            this.customerByInfoGet(this.props.id)
        } else {
            this.setState({loading: false})
        }

        if (session.get('_allAddr')) {
            this.setState({
                addr: JSON.parse(session.get('_allAddr'))
            })
        } else {
            request(api.addressLinkage,{},'get', session.get('token')) //地址联动数据获取
                .then(res => {
                    console.log(JSON.stringify(res))
                    this.setState({
                        addr: res
                    })
                    session.set('_allAddr',JSON.stringify(res))
                })
        }
    }
    customerByInfoGet = (id) =>{
        request(`${api.customerByGet}${id}`,{},'get', session.get('token')) //借款人信息详情
                .then(res => {
                    console.log(JSON.stringify(res))
                    this.setState({
                        loading: false,
                        customerByInfo: res.data,
                        emergenciesInfo: res.data.emergencies,
                        enteringDate: res.data.enteringDate,
                        residentialAddressBefore: [res.data.province,res.data.city,res.data.area],
                    },function(){
                        console.log(this.state.residentialAddressBefore)
                    })
                    if (res.data.customerInformationJson != '' && res.data.customerInformationJson != undefined && res.data.customerInformationJson != null) {
                        let customerInformations = []
                        for (let item of res.data.customerInformationJson) {
                            let customerInformation = {}
                            customerInformation['bigUrl'] = item[imgUrl.big] ? item[imgUrl.big]: ''
                            customerInformation['bigBUrl'] = item[imgUrl.bigB] ? item[imgUrl.bigB]: ''
                            customerInformation['url'] = item[imgUrl.small] ? item[imgUrl.small]: ''
                            customerInformation['uid'] = `${item.fileName}${Math.random()}`
                            customerInformation['status'] = 'done'
                            customerInformations.push(customerInformation)
                        }
                        this.setState({
                            fileList: customerInformations,
                            customerInfo: res.data.customerInformationJson
                        },function(){
                            console.log('fileList:',this.state.fileList)
                        })
                    }
                })
                .catch(err => {
                    this.setState({loading: false})
                })
    }

    onPicturesWallChange = (event,index,style,status) =>{ //处理图片上传数据
        this.setState({
            isSave: false
        })
        if (status === 'uploading') return
        let customerInformation = []
        let isSaveBefore = true
        const customerInfoJ = this.state.customerInfo

        console.log(JSON.stringify(event))
        for (let i in event) {
            if (event[i].response) {
                event[i].response.success ? customerInformation.push(event[i].response.data): null
                if (i == (event.length-1)) {
                    event[i].response.success ? null : message.error(event[i].response.message?event[i].response.message:'上传失败')
                }
            }
            for (let item of customerInfoJ) {
                if (item[imgUrl.small] === event[i].url){
                    customerInformation.push(item)
                }
            }
            if (event[i].status !== 'done' && event[i].status) {
                isSaveBefore = false
            }
        }
        // customerInformation = JSON.stringify(customerInformation)
        console.log(event)
        console.log(customerInformation)
        console.log(this.state.customerInfo)
        this.setState({
            customerInfo: customerInformation,
            isSave: isSaveBefore
        },function(){
            console.log(this.state.loanApplicationInfo)
        })

    }
   /**
     * @desc 添加防抖，防止连击
     * */
    _onSaveDebounce = LodashDebounce((e,type) => this.handleSave(e,type));

    handleSave = (e,type) => {
        e.preventDefault();
        if (!this.state.isSave){
            message.warning('请在所有文件上传完成后提交或保存!')
            return
        }

        this.props.form.validateFields((err, values) => {
            console.log('values',JSON.stringify(values))
            if (err) return
            if (values.enteringDate) {
                values.enteringDate = values.enteringDate.format('YYYY-MM-DD')
            }
            let customerEnterInfo = {}
            let jsonEmergency = []
            for (let y = 0; y < values['emergencyKeys'][0].length; y++) {
                jsonEmergency.push({})
            }
            for (let i in values) {
                if (i.indexOf('_emergencies') === -1 && i !== 'emergencyKeys') {
                    if (i === 'residentialAddressBefore') {
                        customerEnterInfo['province'] = values['residentialAddressBefore'][0]
                        customerEnterInfo['city'] = values['residentialAddressBefore'][1]
                        customerEnterInfo['area'] = values['residentialAddressBefore'][2]
                    } else {
                        customerEnterInfo[i] = values[i] ? values[i] :  ''
                    }
                } else {
                    for (let x = 0; x < values['emergencyKeys'][0].length; x++) {
                        if (i !== 'emergencyKeys') {
                            jsonEmergency[x][i.split('_')[0]] = values[i][values['emergencyKeys'][0][x]] ?  values[i][values['emergencyKeys'][0][x]] : ''
                        }
                    }
                }


            }
            jsonEmergency = JSON.stringify(jsonEmergency)
            this.setState({
                loading: true,
                loanApplicationInfo: {...this.state.loanApplicationInfo,...customerEnterInfo,jsonEmergency,customerInformationJson:JSON.stringify(this.state.customerInfo)}
            },function(){
                request(`${type === 'creditInvestigation' ? api.loanApplicationBusinessSave1: api.loanApplicationBusinessSave}`,this.state.loanApplicationInfo,'post', session.get('token'))
                .then(res => {
                    console.log(JSON.stringify(res))
                    if (res.success) {
                        if (this.state.ifCreditInvestigation) {
                            this.setState({
                                ifShowCreditInvestigation: true,
                                businessId: res.data.id,
                                certificateType: values.certificateType
                            })
                        } else {
                            session.set('customerId', res.data.id)
                            this.props.disabledTabChange()
                            message.success(res.message)
                            this.setState({
                                emergenciesInfo: res.data2 ? res.data2: []
                            })
                        }
                        this.setState({
                            customerId: res.data.id
                        })
                    } else {
                        message.error(res.message)
                    }
                    this.setState({
                        loading: false,
                        ifCreditInvestigation: false
                    })

                })
                .catch(err => {
                    this.setState({loading: false})
                })
            })
        })
    }

    handleFormBack(){
        hashHistory.push('/loan-application')
    }
    RadioGroupChange = (e)=>{
        console.log(e)
    }
    cancelCreditInvestigation = () => {
        this.setState({
            ifShowCreditInvestigation: false
        })
    }
    showCreditInvestigation = (e) => {
        this.setState({
            ifCreditInvestigation: true,
        },function(){
            this._onSaveDebounce(e,'creditInvestigation')
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return(
            <Spin spinning={this.state.loading} size="large" className="loan-application-detail-spin">
                <Form
                className="ant-advanced-search-form loan-application-detail"
            >
                <Row>
                    <Col md={8} sm={12}>
                        <NewDatePicker  fieldName="enteringDate" form={this.props.form} defaultValue={this.state.enteringDate} disabled={this.props.disabled}/>
                        {/* <FormItem label="申请日期">
                        {getFieldDecorator('enteringDate')(
                            <DatePicker style={{ width: '100%' }} placeholder="请输入" />
                        )}
                        </FormItem> */}
                    </Col>
                    <Col md={8} sm={12}>
                        <FormItem label="客户姓名">
                        {getFieldDecorator('name',{initialValue: this.state.customerByInfo.name})(
                            <Input placeholder="请输入" disabled={this.props.disabled}/>
                        )}
                        {getFieldDecorator('id',{initialValue: this.state.customerId})(
                            <Input type='hidden' />
                        )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                        <FormItem label="联系电话">
                        {getFieldDecorator('phone',{initialValue: this.state.customerByInfo.phone})(
                            <Input placeholder="请输入" disabled={this.props.disabled} />
                        )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                        <FormItem label="证件类型">
                            {getFieldDecorator('certificateType',{initialValue: this.state.customerByInfo.certificateType})(
                                <Select placeholder="--证件类型--"  disabled={this.props.disabled} allowClear={true}>
                                    <Select.Option value="1">身份证</Select.Option>
                                    {/* <Select.Option value="2">护照</Select.Option> */}
                                    <Select.Option value="3">统一社会信用代码</Select.Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                        <FormItem label="证件号码">
                        {getFieldDecorator('certificateNo',{initialValue: this.state.customerByInfo.certificateNo})(
                            <Input placeholder="请输入"  disabled={this.props.disabled}/>
                        )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                        <FormItem label="居住地址">
                        {getFieldDecorator('residentialAddressBefore',{initialValue: this.state.residentialAddressBefore})(
                            <Cascader options={this.state.addr} placeholder='请输入'  disabled={this.props.disabled}/>
                        )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                        <FormItem label="具体地址">
                        {getFieldDecorator('residentialAddress',{initialValue: this.state.customerByInfo.residentialAddress})(
                            <Input placeholder="请输入"  disabled={this.props.disabled}/>
                        )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                        <FormItem label="银行卡号">
                        {getFieldDecorator('cardNo',{initialValue: this.state.customerByInfo.cardNo})(
                            <Input placeholder="请输入"  disabled={this.props.disabled}/>
                        )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={20}>
                        <FormItem label="开户行">
                        {getFieldDecorator('bankName',{initialValue: this.state.customerByInfo.bankName})(
                            <Input placeholder="请输入"  disabled={this.props.disabled}/>
                        )}
                        </FormItem>
                    </Col>
                </Row>
                <Row style={{marginTop: "10px", marginBottom: "25px"}}>
                    <Col span={20} style={{ textAlign: 'left' }}>
                        <Button className="green-style" onClick={this.showCreditInvestigation}>查询征信</Button>
                    </Col>
                </Row>
                <Row className="green-box">
                    <Col span={20}>
                    <FormItem label="选择是否回访">
                        {getFieldDecorator('chooseCallback',{initialValue: this.state.customerByInfo.chooseCallback})(
                            <RadioGroup disabled={this.props.disabled} onChange={this.RadioGroupChange}>
                                <Radio value={'1'}>回访成功再划扣</Radio>
                                <Radio value={'2'}>回访未成功可先行划扣</Radio>
                                <Radio value={'3'}>免回访</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                </Col>
                </Row>
                <div className="ant-advanced-search-form loan-application-detail">
                    {/* <h2>客户紧急联系人资料</h2> */}
                    <MyAddEmergencyContact productId={this.props.productId} ifLoanApplication={true} style="emergencies" form={this.props.form} defaultValue={this.state.emergenciesInfo} disabled={this.props.disabled}/>

                    <h2 className="full-title">客户相关资料</h2>
                    <PicturesWall defaultFileList={this.state.fileList} onPicturesWallChange={this.onPicturesWallChange.bind(this)}  disabled={this.props.disabled}/>
                </div>
                <Row className="submit-sbn">
                    <Col span={24} style={{ textAlign: 'left' }}>
                        {!this.props.disabled && <Button className="green-style" htmlType="submit" onClick={this._onSaveDebounce}>保存</Button>}
                        <Button className="default-btn" style={{ marginLeft: 8,marginRight: 20 }} onClick={this.handleFormBack}>返回</Button>
                    </Col>
                </Row>
                <CreditInvestigation productId={this.props.productId} visible={this.state.ifShowCreditInvestigation} cancelCreditInvestigation={this.cancelCreditInvestigation.bind(this)} businessType='1' businessId={this.state.businessId} certificateType={this.state.certificateType}/>
            </Form>
        </Spin>
        )
    }
}
const LoanBusinessInfo = Form.create()(LoanBusinessInfoForm);

export default LoanBusinessInfo




