import React from 'react';
import PropTypes from 'prop-types';
import { Cascader, Form, Input, Icon, Button,Row, Col, Select, Spin, message } from 'antd';
import './index.scss'
import {request} from 'common/request/request.js'
import {local, session} from 'common/util/storage.js'
import CreditInvestigation from 'component/search-credit-investigation'
import CreditReport from 'component/credit-report'
import api from 'api'
const FormItem = Form.Item;
const Option = Select.Option;
const showContents = [{
    label: '联系人姓名',
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
    label: '身份证号',
    fieldName: 'certificateNo'
},
{
    label: '与申请人关系',
    fieldName: 'applicantRelation'
}
]

class MyAddEmergencyContact extends React.Component {
    static propTypes = {
        productId: PropTypes.string,
        defaultValue: PropTypes.array,
        showContents: PropTypes.array,
        buttonText: PropTypes.string,
        addText: PropTypes.string,
        title: PropTypes.string,
        style: PropTypes.string,
        index: PropTypes.number,
        disabled: PropTypes.bool,
        ifShow: PropTypes.bool,
        form: PropTypes.object,
        ifLoanApplication: PropTypes.bool,
    };

    static defaultProps = {
        productId: '',
        ifLoanApplication: false,
        index: 0,
        style: 'product',
        defaultValue: [],
        disabled: false,
        buttonText: '查询征信',
        addText: '添加联系人',
        title: '客户紧急联系人资料',
        showContents: showContents,
        ifShow: false,
        form: {}
    };
    constructor(props){
        super(props);
        this.state = {
            applicantRelationInfo: [],
            addr: [],
            productId: '',
            ifShowCreditInvestigation: false,
            certificateType: '1',
            businessId: '',
            showCreditReport: false,
            creditReportType: '',
            reportBusinessId: '',
            showCreditReport: false,
            businessType: '2',
            defaultInfo: [],
            uuid: 1,
            keyArray: [0],
            loading: true,
            // provinceCityArea: [],
            colAttribute: {
                md: 12,
                sm: 20,
                className: 'col-style'
            },
        }
    }
    componentWillMount(){ //预加载数据

        this.props.title === '共借人' ? this.setState({ businessType : '3' }) : null
        this.loadlists() //获取数据列表
        this.propsGet(this.props)
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
    componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
        this.propsGet(nextProps)
    }
    propsGet = (nextProps) =>{

        if(nextProps.defaultValue.length >0 && this.state.defaultInfo !== nextProps.defaultValue){
            console.log('nextProps',JSON.stringify(nextProps))
            let keyArrayBefore = []
            for(let i = 0, len = nextProps.defaultValue.length; i < len; i++) {
                keyArrayBefore.push(i)
            }
            this.setState({
                defaultInfo: nextProps.defaultValue,
                // provinceCityArea: [nextProps.defaultValue['province'],nextProps.defaultValue['city'],nextProps.defaultValue['area']],
                uuid: nextProps.defaultValue.length,
                keyArray: keyArrayBefore,
                loading: true
            },function(){
                this.setState({loading: false})
                console.log(JSON.stringify(nextProps.defaultValue))
            })
        } else {
            this.setState({loading: false})
        }
    }
    loadlists(){
        request(api.relationshipWithTheApplicant,{},'get', session.get('token'))
            .then(res => {
                console.log(JSON.stringify(res))
                if (res.success) {
                    this.setState({
                        applicantRelationInfo: res.data
                    })
                }
            })
    }
    applicantRelationShow = (info) =>{
        console.log(info)
        for (let item of this.state.applicantRelationInfo) {
            console.log(item.value,item.label)
           if (item.value === info)   return  item.label
        }
    }
    certificateTypeShow = (info) => {
        return info === '1' ? '身份证' : '统一社会信用代码'
    }
    remove = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        let emergencyKeysAll = form.getFieldValue('emergencyKeys');
        let emergencyKeys = form.getFieldValue(`emergencyKeys[${this.props.index}]`);
        // We need at least one passenger
        if (emergencyKeys.length === 1) {
          return;
        }
        emergencyKeys = emergencyKeys.filter(key => key !== k)
        emergencyKeysAll[this.props.index] = emergencyKeys

        // can use data-binding to set
        form.setFieldsValue({
            emergencyKeys: emergencyKeysAll,
        });
        let defaultInfoB = this.state.defaultInfo
        defaultInfoB.splice(k,1)
        this.setState({
            defaultInfo: defaultInfoB
        })

      }

    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const emergencyKeys = form.getFieldValue(`emergencyKeys[${this.props.index}]`);
        const nextKeys = emergencyKeys.concat([this.state.uuid]);
        this.setState({
            uuid: this.state.uuid+1
        })
        console.log(emergencyKeys)
        console.log(nextKeys)
        // can use data-binding to set
        // important! notify form to detect changes
        let preEmergencyKeys = form.getFieldValue('emergencyKeys')
        preEmergencyKeys[this.props.index] = nextKeys
        form.setFieldsValue({
            emergencyKeys: preEmergencyKeys,
        })

    }

    textShowDo = (k,defaultVal,item) =>{
        const fieldName = item.fieldName
        let DOM = !this.props.ifShow ? <Col {...this.state.colAttribute} key={fieldName}>
                    <FormItem label={item.label}>
                    {this.props.form.getFieldDecorator(`${fieldName}_${this.props.style}${this.props.index}[${k}]`,{initialValue: defaultVal ? defaultVal[fieldName]:''})(
                        <Input placeholder="请输入" disabled={this.props.disabled} />
                    )}
                    </FormItem>
                </Col> :
                <Col {...this.state.colAttribute} key={fieldName}>
                <span>{item.label}：</span><span>{defaultVal ? defaultVal[fieldName]:'--'}</span>
                </Col>
        if (fieldName === 'id'){
            DOM = !this.props.ifShow ? DOM = <Col {...this.state.colAttribute} key={fieldName} style={{display:'none'}}>
                    <FormItem label={item.label}>
                    {this.props.form.getFieldDecorator(`id_${this.props.style}${this.props.index}[${k}]`,{initialValue: defaultVal ? defaultVal[fieldName]:''})(
                        <Input type='hidden' />
                    )}
                    </FormItem>
                </Col> : null
        }


        if (fieldName === 'applicantRelation'){
            DOM = !this.props.ifShow ?  <Col {...this.state.colAttribute} key={fieldName}>
                <FormItem label={item.label}>
                    {this.props.form.getFieldDecorator(`${fieldName}_${this.props.style}${this.props.index}[${k}]`,{initialValue: defaultVal?defaultVal[fieldName]:undefined})(
                        <Select placeholder="--与申请人关系--" disabled={this.props.disabled} allowClear={true}>
                            <Option value='' key='-1'>请选择</Option>
                            {this.state.applicantRelationInfo.map((RelationItem) =>
                                <Option value={RelationItem.value} key={RelationItem.id}>{RelationItem.label}</Option>
                            )}

                        </Select>
                    )}
                </FormItem>
            </Col> :  <Col {...this.state.colAttribute} key={fieldName}>
                        <span>与申请人关系：</span><span>{defaultVal?this.applicantRelationShow(defaultVal[fieldName]):'--'}</span>
                    </Col>
        }
        if (fieldName === 'certificateType'){
            DOM = !this.props.ifShow ?  <Col {...this.state.colAttribute} key={fieldName}>
                <FormItem label={item.label}>
                    {this.props.form.getFieldDecorator(`${fieldName}_${this.props.style}${this.props.index}[${k}]`,{initialValue: defaultVal?defaultVal[fieldName]:undefined})(
                        <Select placeholder="--证件类型--" disabled={this.props.disabled} allowClear={true}>
                                <Option value='1' key='1'>身份证</Option>
                                <Option value='3' key='3'>统一社会信用代码</Option>
                        </Select>
                    )}
                </FormItem>
            </Col> :  <Col {...this.state.colAttribute} key={fieldName}>
                        <span>证件类型：</span><span>{defaultVal && defaultVal[fieldName]?this.certificateTypeShow(defaultVal[fieldName]):'--'}</span>
                    </Col>
        }
        if (fieldName === 'provinceCityArea') {
            DOM = !this.props.ifShow ?  <Col {...this.state.colAttribute} key={fieldName}>
                <FormItem label={item.label}>
                    {this.props.form.getFieldDecorator(`${fieldName}_${this.props.style}${this.props.index}[${k}]`,{initialValue: defaultVal ? [defaultVal['province'],defaultVal['city'],defaultVal['area']] : []})(
                        <Cascader options={this.state.addr} placeholder='请输入'  disabled={this.props.disabled}/>
                    )}
                </FormItem>
            </Col> :  <Col {...this.state.colAttribute} key={fieldName}>
                        <span>居住地址：</span><span>{this.provinceCityAreaShow(defaultVal)}</span>
                    </Col>
        }
        return DOM
    }
    provinceCityAreaShow =(defaultVal) =>{
        let provinceCityAreaText = '--'
        provinceCityAreaText = defaultVal ? `${defaultVal['province']}-${defaultVal['city']}-${defaultVal['area']}` : '--'
        provinceCityAreaText === 'undefined-undefined-undefined' ? provinceCityAreaText = '--': null
        return provinceCityAreaText
    }
    titleShow = (k) => {
        return `${this.props.title}${k+1}`
    }
    cancelCreditInvestigation = () => {
        this.setState({
            ifShowCreditInvestigation: false
        })
    }
    showCreditInvestigation = (Info,k) => {
        this.setState({
            productId: this.props.productId? this.props.productId : ''
        },function(){
            if (this.props.ifLoanApplication) {
                if (this.props.ifShow) {
                    this.setState({
                        ifShowCreditInvestigation: true,
                        businessId: Info.id ? Info.id : '',
                    })
                } else {
                    this.props.form.validateFields((err, values) => {
                        console.log(JSON.stringify(values))
                        let getJson = {}
                        if (this.props.style === 'emergencies') {
                            getJson.id = values[`id_${this.props.style}${this.props.index}`][k]
                            getJson.name = values[`name_${this.props.style}${this.props.index}`][k]
                            getJson.phone = values[`phone_${this.props.style}${this.props.index}`][k]
                            getJson.certificateNo = values[`certificateNo_${this.props.style}${this.props.index}`][k]
                            getJson.applicantRelation = values[`applicantRelation_${this.props.style}${this.props.index}`][k]
                            getJson.customerId = session.get('customerId') ? session.get('customerId') : ''
                            request(api.emergencyEnterSave,getJson,'post', session.get('token')) //地址联动数据获取
                                .then(res => {
                                    console.log(JSON.stringify(res))
                                    if (res.success) {
                                        this.props.form.setFieldsValue({[`id_${this.props.style}${this.props.index}[${k}]`]: res.data.id})
                                        this.setState({
                                            ifShowCreditInvestigation: true,
                                            businessId: res.data.id
                                        })
                                    } else {
                                        message.error(res.message)
                                    }
                                })
                        } else if (this.props.style === 'product') {
                            getJson.id = values[`id_${this.props.style}${this.props.index}`][k]
                            getJson.name = values[`name_${this.props.style}${this.props.index}`][k]
                            getJson.phone = values[`phone_${this.props.style}${this.props.index}`][k]
                            getJson.identityCard = values[`identityCard_${this.props.style}${this.props.index}`][k]
                            getJson.address = values[`address_${this.props.style}${this.props.index}`][k]
                            getJson.certificateType = values[`certificateType_${this.props.style}${this.props.index}`][k]
                            if (values[`provinceCityArea_${this.props.style}${this.props.index}`][k][0]) {
                                getJson.province = values[`provinceCityArea_${this.props.style}${this.props.index}`][k][0]
                                getJson.city = values[`provinceCityArea_${this.props.style}${this.props.index}`][k][1]
                                getJson.area = values[`provinceCityArea_${this.props.style}${this.props.index}`][k][2]
                            }
                            console.log(session.get('productIds'))
                            if (session.get('productIds')) {
                                JSON.parse(session.get('productIds'))[this.props.index] ? getJson.productId = JSON.parse(session.get('productIds'))[this.props.index]['productId'] : null
                                this.setState({
                                    productId: JSON.parse(session.get('productIds'))[this.props.index] ? JSON.parse(session.get('productIds'))[this.props.index]['productId'] : ''
                                })
                            }
                            request(api.wereborrowedSave,getJson,'post', session.get('token')) //地址联动数据获取
                                .then(res => {
                                    console.log(JSON.stringify(res))
                                    if (res.success) {
                                        this.props.form.setFieldsValue({[`id_${this.props.style}${this.props.index}[${k}]`]: res.data.id})
                                        this.setState({
                                            certificateType: getJson.certificateType,
                                            ifShowCreditInvestigation: true,
                                            businessId: res.data.id
                                        })
                                    } else {
                                        message.error(res.message)
                                    }
                                })
                        }

                        console.log(getJson)
                    })
                }
            } else {
                this.setState({
                    businessId: Info.id ? Info.id : ''
                },function(){
                    this.viewReport()
                })
            }
        })
    }
    handlecancelCreditReport= () => {
        this.setState({showCreditReport: false})
    }
    viewReport = () => {
        this.setState({loading:true})
        request(api.creditReportType,{
            businessId: this.state.businessId
        },'get',session.get('token'))
                .then(res => {
                    this.setState({loading:false})
                    console.log(JSON.stringify(res))
                    if (res.success){
                        res.data === '1' ? this.setState({reportBusinessId: res.data2 ? res.data2 : ''}) : this.setState({reportBusinessId: this.state.businessId})
                        this.setState({
                            showCreditReport: true,
                            creditReportType: res.data? res.data : ''
                        })
                    } else {
                       message.error(res.message)
                    }
                })
                .catch(err => {
                    this.setState({loading:false})
                })

    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        let emergencyKeys = []
        if (!this.props.ifShow) {
            getFieldDecorator(`emergencyKeys[${this.props.index}]`, { initialValue: this.state.keyArray});
            emergencyKeys = getFieldValue(`emergencyKeys[${this.props.index}]`);
        } else {
            emergencyKeys = this.state.keyArray

        }
        // console.log(getFieldValue('emergencyKeys'))
        console.log('emergencyKeys',emergencyKeys)
        const formItems = emergencyKeys.map((k, index) => {
        return (
            <Row gutter={24} key={k} className="my-card my-half-card">
                <h2>{this.props.title === '共借人' ? this.titleShow(index) : this.props.title}
                    {
                        this.props.ifShow || index < emergencyKeys.length-1 || index > 23 ? '' : <Button onClick={this.add}><Icon type="plus" />{this.props.addText}</Button>
                    }
                </h2>
                {
                    this.props.showContents.map((item)=>
                    this.textShowDo(k,this.state.defaultInfo[index],item)
                )}
                <Col  md={24} sm={24} style={{ textAlign: 'center', marginTop:'15px' }}>
                    <Button className="my-btn green-style" onClick={this.showCreditInvestigation.bind(this,this.state.defaultInfo[k],k)}>{this.props.buttonText}</Button>
                </Col>
                {emergencyKeys.length > 1 && !this.props.ifShow ? (
                    <Icon
                    className="dynamic-delete-button"
                    type="delete"
                    disabled={emergencyKeys.length === 1}
                    onClick={() => this.remove(k)}
                    />
                ) : null}
            </Row>
        );
        });
        return(<Spin spinning={this.state.loading} style={{width: "100%"}}>
                    {formItems}
                    <CreditReport type={this.state.creditReportType} enterpriseBusinessId={this.state.businessId} personalBusinessId={this.state.reportBusinessId} visible={this.state.showCreditReport} handlecancelCreditReport={this.handlecancelCreditReport.bind(this)}></CreditReport>
                    <CreditInvestigation productId={this.state.productId} visible={this.state.ifShowCreditInvestigation} cancelCreditInvestigation={this.cancelCreditInvestigation.bind(this)} businessType={this.state.businessType} businessId={this.state.businessId} certificateType={this.state.certificateType}/>
            </Spin>
       )
    }
}
// const MyAddEmergencyContact = Form.create()(AddEmergencyContact);
export default MyAddEmergencyContact
