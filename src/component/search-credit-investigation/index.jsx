import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Spin, Checkbox, Divider, Form, Row, Col, Button, Input, message } from 'antd';
import api from 'api'
import { request } from 'common/request/request.js'
import { local, session } from 'common/util/storage.js'
import CreditReport from 'component/credit-report'

const FormItem = Form.Item

const testData = [
    {
        bigName: '验证类信息',
        childData: [
            {
                name: '个人银行卡验证',
                id: 'aa'
            },
            {
                name: '个人手机号验证',
                id: 'bb'
            }
        ]
    },
    {
        bigName: '个人信息',
        childData: [
            {
                name: '信贷记录',
                id: 'cc'
            },
            {
                name: '民事判决记录',
                id: 'dd'
            },
            {
                name: '强制执行记录',
                id: 'ee'
            },
        ]
    },
    {
        bigName: '其他信息',
        childData: [
            {
                name: '运营商报告',
                id: 'ff'
            },
            {
                name: '个人对外投资任职情况',
                id: 'gg'
            },
        ]
    }
]
const testData1 = [    
    {
        bigName: '验证类信息',
        childData: [
            {
                name: '个人银行卡验证',
                id: 'aa'
            },
            {
                name: '个人手机号验证',
                id: 'bb'
            }
        ]
    },
    {
        bigName: '融资信息',
        childData: [
            {
                name: '个人银行卡验证',
                id: 'aa'
            },
            {
                name: '个人手机号验证',
                id: 'bb'
            }
        ]
    },
    {
        bigName: '个人信息',
        childData: [
            {
                name: '信贷记录',
                id: 'cc'
            },
            {
                name: '民事判决记录',
                id: 'dd'
            },
            {
                name: '强制执行记录',
                id: 'ee'
            },
        ]
    },
    {
        bigName: '其他信息',
        childData: [
            {
                name: '运营商报告',
                id: 'ff'
            },
            {
                name: '个人对外投资任职情况',
                id: 'gg'
            },
            {
                name: '个人对外投资任职情况',
                id: 'gg1'
            },
            {
                name: '个人对外投资任职情况',
                id: 'gg2'
            },
        ]
    }
]

class CreditInvestigationForm extends React.Component {
    static propTypes = {
        productId: PropTypes.string.isRequired,
        cancelCreditInvestigation: PropTypes.func,
        visible: PropTypes.bool.isRequired,
        businessId: PropTypes.string.isRequired,
        businessType: PropTypes.string.isRequired,
        certificateType: PropTypes.string.isRequired,
    };

    static defaultProps = {
        cancelCreditInvestigation: ()=>{},
    };
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            loading: true,
            typeNum: 1,
            legalPersonInfoLegal: null,
            legalPersonInfo: [],
            enterpriseInfo: [],
            certificateType: '',
            businessId: '',
            businessType: '',
            QRCode: '',
            imgVisible: false,
            showCreditReport: false,
            creditReportType: '',
            reportBusinessId: '',
            imgTitle: "请用微信扫二维码",
            saveFailed: false,
            saveFailedMessage: []
        }
    }
    componentDidMount(){ //预加载数据
        this.propsDo(this.props)
    }
    componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
        this.propsDo(nextProps)
    }
    propsDo = (props) => {
        console.log("props:",props)
        !props.visible ? this.setState({ visible: props.visible }) : null
        if (props.visible && props.visible !== this.state.visible) {
            this.setState({ 
                certificateType: props.certificateType,
                businessId: props.businessId,
                businessType: props.businessType,
             },function(){
                this.loadlists() //获取数据列表
             })
        }
    }
    
    loadlists(){ //请求数据函数
        request(api.creditGetModule,{
            certificateType: this.state.certificateType,
            businessId: this.state.businessId,
            businessType: this.state.businessType,
        },'get',session.get('token'))
            .then(res => {
                console.log(JSON.stringify(res))
                this.setState({loading:false})
                if (res.success){
                    this.setState({
                        visible: true,
                        legalPersonInfo: res.data.modules[0].list,
                        enterpriseInfo: res.data.modules[1]? res.data.modules[1].list: null,
                        typeNum: res.data.modules.length,
                        legalPersonInfoLegal: res.data.legal
                    })
                } else {
                   this.handleCancel() 
                   message.error(res.message)
                }
            })
            .catch(err => {
                this.setState({loading:false})
                this.handleCancel()
            })
    }
    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        })
    }
    handleCancelImg = () =>{
        this.setState({
            imgVisible: false,
        })
    }
    handleCancel = (e) => {
        this.setState({
            showCreditReport: false
        },function(){
            this.props.cancelCreditInvestigation()
        })
    }
    handleSave = (e) => {
        this.setState({loading:true})
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(JSON.stringify(values))
            let moduleJson = []
            let saveJSon = {}
            for (let item in values) {
                console.log(values[item],item)
                if (values[item] === true) {
                    let saveItem = {}
                    saveItem.code = item
                    moduleJson.push(saveItem)
                }
                if (item.indexOf('legal_') !== -1){
                    console.log(7878)
                    saveJSon[item.split('_')[1]] = values[item]
                }
            }
            saveJSon.moduleJson = JSON.stringify(moduleJson)
            saveJSon.businessId = this.state.businessId
            saveJSon.businessType = this.state.businessType
            saveJSon.certificateType = this.state.certificateType
            saveJSon.productId = this.props.productId && this.props.productId !== 'null' ? this.props.productId : ''
            console.log(JSON.stringify(saveJSon))
            request(api.creditSaveModule,saveJSon,'post',session.get('token'),60*1000)
                .then(res => {
                    this.setState({loading:false})
                    console.log('creditSaveModule',JSON.stringify(res))
                    if (res.success){
                        this.setState({
                            imgTitle: '请用微信扫二维码',
                            saveFailed: false
                        })
                        res.data ? this.setState({QRCode: res.data,imgVisible: true}) : message.warning(res.message)
                    } else {
                        res.data2 ? this.setState({
                           imgVisible: true,
                           saveFailed: true,
                           saveFailedMessage: res.data2,
                           imgTitle: '提示'
                       }) : message.error(res.message)
                    }
                })
                .catch(err => {
                    this.setState({loading:false})
                })
        })
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
                        res.data === '1' ? this.setState({reportBusinessId: res.data2? res.data2 : ''}) : this.setState({reportBusinessId: this.state.businessId})
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
    handlecancelCreditReport= () => {
        this.setState({showCreditReport: false})
    }
    render() {
        const { saveFailed, saveFailedMessage, imgTitle, reportBusinessId, businessId, creditReportType, showCreditReport, QRCode, imgVisible, visible, loading, typeNum, legalPersonInfoLegal, legalPersonInfo, enterpriseInfo } = this.state
        const { getFieldDecorator } = this.props.form
        return (
            <Modal
                title="选择需要查询的信息"
                visible={visible}
                onOk={this.handleOk}
                destroyOnClose={true}
                onCancel={this.handleCancel}
                width={`${typeNum*45}%`}
                footer={[
                    <Button key="search" className='green-style' onClick={this.viewReport}>查看报告</Button>,
                    <Button key="submit" className='green-style' htmlType="submit" onClick={this.handleSave}>点击查询</Button>,
                    <Button key="back" className="default-btn" onClick={this.handleCancel}>取消</Button>,
                ]}
            >
                <Spin spinning={loading} size="large">
                <Form style={{width: '100%'}}>
                    <Row style={{width: `${typeNum>1?(100/typeNum-3):100}%`,float: 'left'}}>
                    {typeNum>1 && <h2 className="detail-title" style={{textAlign:'center'}}>企业信息</h2>}
                        {legalPersonInfo.map((item) =>
                            <Row key={item.name} style={{marginBottom:'10px'}}>
                                <div className="white-title">
                                    <p>{item.name}：</p>
                                    <Divider/>
                                </div>
                                <Row style={{marginLeft:'36px'}}>
                                    {item.list.map((val) =>
                                        <Col md={8} sm={12} key={val.id}>
                                            <FormItem>
                                            {getFieldDecorator(`${val.code}`,{ initialValue:val.checked})(
                                                <Checkbox defaultChecked={val.checked} disabled={val.readonly}>{val.name}</Checkbox>
                                            )}
                                            </FormItem>
                                        </Col>
                                    )}
                                </Row>
                            </Row>
                        )}
                    </Row>
                    {typeNum>1 && <Divider type="vertical" style={{height:'100%',float:'left',margin:'0 2.5%'}} />}
                    {typeNum>1 && <Row style={{width: `${typeNum>1?(100/typeNum-3):100}%`,float: 'left'}}>
                        <h2 className="detail-title" style={{textAlign:'center'}}>法人信息</h2>
                        {legalPersonInfoLegal && <Row key='-1' style={{marginBottom:'10px'}}>
                            <div className="white-title">
                                <p>法人信息：</p>
                                <Divider/>
                            </div>
                            <Row style={{marginLeft:'36px'}} gutter={16}>
                                <Col md={8} sm={12}>
                                    <FormItem label='姓名'>
                                    {getFieldDecorator('legal_legalName', { initialValue: legalPersonInfoLegal.name? legalPersonInfoLegal.name : undefined })(
                                        <Input placeholder="请输入" />
                                    )}
                                    {getFieldDecorator('legal_legalId',{initialValue: legalPersonInfoLegal.id? legalPersonInfoLegal.id : undefined})(
                                        <Input type='hidden' />
                                    )}
                                    </FormItem>
                                </Col>
                                <Col md={8} sm={12}>
                                    <FormItem label='手机号'>
                                    {getFieldDecorator('legal_legalPhone', { initialValue: legalPersonInfoLegal.phone? legalPersonInfoLegal.phone : undefined })(
                                        <Input placeholder="请输入" />
                                    )}
                                    </FormItem>
                                </Col>
                                <Col md={8} sm={12}>
                                    <FormItem label='身份证号'>
                                    {getFieldDecorator('legal_legalIdentityCard', { initialValue: legalPersonInfoLegal.identityCard? legalPersonInfoLegal.identityCard : undefined })(
                                        <Input placeholder="请输入" />
                                    )}
                                    </FormItem>
                                </Col>
                                <Col md={8} sm={12}>
                                    <FormItem label='银行卡号'>
                                    {getFieldDecorator('legal_legalCardNo', { initialValue: legalPersonInfoLegal.cardNo? legalPersonInfoLegal.cardNo : undefined })(
                                        <Input placeholder="请输入" />
                                    )}
                                    </FormItem>
                                </Col>
                                <Col md={8} sm={12}>
                                    <FormItem label='开户行'>
                                    {getFieldDecorator('legal_legalBank', { initialValue: legalPersonInfoLegal.bank? legalPersonInfoLegal.bank : undefined })(
                                        <Input placeholder="请输入" />
                                    )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Row>}
                        {enterpriseInfo.map((item) =>
                            <Row key={item.name} style={{marginBottom:'10px'}}>
                                <div className="white-title">
                                    <p>{item.name}：</p>
                                    <Divider/>
                                </div>
                                <Row style={{marginLeft:'36px'}}>
                                    {item.list.map((val) =>
                                        <Col md={8} sm={12} key={val.id}>
                                            <FormItem>
                                            {getFieldDecorator(`${val.code}`,{ initialValue:val.checked})(
                                                <Checkbox defaultChecked={val.checked} disabled={val.readonly}>{val.name}</Checkbox>
                                            )}
                                            </FormItem>
                                        </Col>
                                    )}
                                </Row>
                            </Row>
                        )}
                    </Row>}
                </Form>
                </Spin>
                <Modal
                    title={imgTitle}
                    visible={imgVisible}
                    destroyOnClose={true}
                    onCancel={this.handleCancelImg}
                    footer={[]}
                    bodyStyle={{textAlign: 'center'}}
                    footer={[
                        <Button key="close" className="default-btn" onClick={this.handleCancelImg}>关闭</Button>,
                    ]}
                >  
                    {saveFailed ? saveFailedMessage.map((item,key)=>
                    <div key={key}>{key+1}. {item}</div>
                    ):<img src={QRCode}/>}
                </Modal>
                <CreditReport type={creditReportType} enterpriseBusinessId={businessId} personalBusinessId={reportBusinessId} visible={showCreditReport} handlecancelCreditReport={this.handlecancelCreditReport.bind(this)}></CreditReport>
            </Modal>
        )
    }
}
const CreditInvestigation = Form.create()(CreditInvestigationForm);
export default CreditInvestigation
