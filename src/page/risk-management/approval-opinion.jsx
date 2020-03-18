import React from 'react'
import {hashHistory} from 'react-router'
import { Form, Input, Button, Spin, Select, message, Divider } from 'antd';
import {request} from 'common/request/request.js'
import imgUrl from 'common/util/imgUrl.js'
import {local, session} from 'common/util/storage.js'
import PicturesWall from 'component/img-upload'
import ApprovalProcess from 'component/approval-process'
import LodashDebounce from 'common/util/debounce'
import api from 'api'

import './index.scss'

const { TextArea } = Input
const Option = Select.Option
const FormItem = Form.Item

class ApprovalOpinionForm extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            isSave: true,
            loading: true,
            customerInformationDefaultJson: [],//默认客户相关资料
            pictureDataJson: [],
            pawnMaterialInfo: [],
            fieldSurveyInfo: [],
            otherDetailsInfo: [],
            customerInforInfo: [],
            auditId: '',
            auditResult: undefined,
            auditOpinion: '',
            ifSubmit: false,
            modalTableColumns: [
                { title: '流程', dataIndex: 'stageStr', width: 100,
                render: (value, row, index) => {
                    const obj = {
                      children: value,
                      props: {},
                    };
                    if (row.uuid) {
                      obj.props.rowSpan  = row.uuid;
                    } else {
                        obj.props.rowSpan = 0;
                    }
                   
                    return obj;
                  },
             },
                { title: '流程结果', dataIndex: 'auditResultStr', width: 100,
                render: (value, row, index) => {
                    const obj = {
                      children: value,
                      props: {},
                    };
                    if (row.uuid) {
                      obj.props.rowSpan  = row.uuid;
                    } else {
                        obj.props.rowSpan = 0;
                    }
                   
                    return obj;
                  },
            },
                { title: '操作员', dataIndex: 'name', width: 100 },
                { title: '时间', dataIndex: 'submitTime', width: 100 },
                { title: '结果', dataIndex: 'historyResult', width: 100 },
                { title: '意见或原因', dataIndex: 'auditOpinion', width: 200 },
            ]
        }
    }
    componentDidMount(){ //预加载数据
        console.log(this.props)
        
        if (session.get('customerInformationDefaultJson')) {
            console.log(session.get('customerInformationJson'))
            this.setState({
                customerInforInfo: session.get('customerInformationJson'),
                customerInformationDefaultJson: session.get('customerInformationDefaultJson')
            },function(){
                console.log(this.state.customerInformationDefaultJson)
            })
        }
        this.setState({
            pictureDataJson: this.props.pictureDataJson,
            pawnMaterialInfo: this.props.pictureDataJson.pawnMaterialJson ? this.props.pictureDataJson.pawnMaterialJson : [],
            fieldSurveyInfo: this.props.pictureDataJson.fieldSurveyJson ? this.props.pictureDataJson.fieldSurveyJson : [],
            otherDetailsInfo: this.props.pictureDataJson.otherDetailsJson ? this.props.pictureDataJson.otherDetailsJson : [],
        },function(){
            console.log(this.state)
            if (this.props.auditId != 'null') {
                this.setState({
                    auditId: this.props.auditId
                },function(){
                    this.detailListGet()
                })
            } else {
                this.setState({loading: false})
            }
        })
        
    }
    componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
        console.log(nextProps)
        if (this.state.pictureDataJson !== nextProps.pictureDataJson) {
            this.setState({
                pictureDataJson: nextProps.pictureDataJson,
                pawnMaterialInfo: nextProps.pictureDataJson.pawnMaterialJson ? nextProps.pictureDataJson.pawnMaterialJson : [],
                fieldSurveyInfo: nextProps.pictureDataJson.fieldSurveyJson ? nextProps.pictureDataJson.fieldSurveyJson : [],
                otherDetailsInfo: nextProps.pictureDataJson.otherDetailsJson ? nextProps.pictureDataJson.otherDetailsJson : [],
            })
        }
    }
    detailListGet = () =>{ //审核信息详情获取
        request(api.riskManagementAuditDetail,{
            id: this.state.auditId,
        },'post',session.get('token'))
            .then(res => {
                console.log(JSON.stringify(res))
                this.setState({loading: false})
                if (res.success){
                    this.setState({
                        auditResult: res.data.auditResult,
                        auditOpinion: res.data.auditOpinion,
                    });
                }
            })
            .catch(err => {
            console.log(err)
                this.setState({loading: false})
            })
    }
    auditInfoSubmitBefore = () =>{
        this.setState({
            ifSubmit: true
        },function(){
            this.auditInfoSave()
        })
    }
    auditInfoSubmit =　(id) =>{ //提交审核信息
        request(api.riskManagementAuditSubmit,{
            auditId: id,
        },'post',session.get('token'))
            .then(res => {
                console.log(JSON.stringify(res))
                this.setState({
                    ifSubmit: false,
                    loading: false
                })
                if (res.success) {
                    message.success(res.message)
                    setTimeout(function(){
                        hashHistory.push('/risk-management')
                    },1000)
                } else {
                    message.error(res.message)
                }
            })
            .catch(err => {
            console.log(err)
                this.setState({loading: false})
            })
    }
    /**
     * @desc 添加防抖，防止连击
     * */
    _onSaveDebounce = LodashDebounce((e) => this.auditInfoSave(e));
    _onSubmitDebounce = LodashDebounce((e) => this.auditInfoSubmitBefore(e));
    
    auditInfoSave = (e) => {
        if (!this.state.isSave){
            message.warning('请在所有文件上传完成后提交或保存!')
            return
        }
        this.setState({loading: true})
        this.props.form.validateFields((err, values) => {
            if (err) return
            console.log(values)
            request(api.riskManagementAuditSave,{
                ...values,
                id: this.state.auditId,
                productId: this.props.productId,
                customerId: this.props.id,
                customerInformationJson: JSON.stringify(this.state.customerInforInfo),
                pawnMaterialJson: JSON.stringify(this.state.pawnMaterialInfo),
                fieldSurveyJson: JSON.stringify(this.state.fieldSurveyInfo),
                otherDetailsJson: JSON.stringify(this.state.otherDetailsInfo),
            },'post',session.get('token'))
                .then(res => {
                    console.log(JSON.stringify(res))
                    if (res.success){
                        if (this.state.ifSubmit){
                            this.auditInfoSubmit(res.data.id)
                        } else {
                            this.setState({
                                loading: false,
                            })
                            message.success(res.message)
                        }
                        this.setState({
                            auditId: res.data.id
                        })
                    } else {
                        this.setState({loading: false})
                        message.error(res.message)
                    }
                })
                .catch(err => {
                    this.setState({loading: false})
                })
        })
    }
    onPicturesWallChange = (event,index,style,status) =>{ //处理图片上传数据
        this.setState({
            isSave: false
        })
        if (status === 'uploading') return

        let customerInformation = []
        let customerInfoJ = []
        let isSaveBefore = true
        console.log(event)
        console.log(this.state)
        if (style === 'pawnMaterial'){
            customerInfoJ = this.state.pawnMaterialInfo
        } else if (style === 'fieldSurvey'){
            customerInfoJ = this.state.fieldSurveyInfo
        }  else if (style === 'otherDetails') {
            customerInfoJ = this.state.otherDetailsInfo
        }  else if (style === 'customerInfor') {
            customerInfoJ = this.state.customerInforInfo
        }
        
        console.log(event)
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
                    break
                }
            }
            if (event[i].status !== 'done' && event[i].status) {
                isSaveBefore = false
            }
        }
        console.log(event)
        console.log(customerInfoJ)
        // customerInformation = JSON.stringify(customerInformation)
        if (style === 'pawnMaterial') {//--抵押物资料
            this.setState({
                pawnMaterialInfo: customerInformation,
                isSave: isSaveBefore
            },function(){
                console.log(this.state.pawnMaterialInfo)
                
            })
        } else if (style === 'fieldSurvey') { //--现场调查资料
            this.setState({
                fieldSurveyInfo: customerInformation,
                isSave: isSaveBefore
            },function(){
                console.log(this.state.fieldSurveyInfo)
            })
        } else if (style === 'otherDetails') {//--其他资料
            this.setState({
                otherDetailsInfo: customerInformation,
                isSave: isSaveBefore
            },function(){
                console.log(this.state.otherDetailsInfo)
            })
        } else if (style === 'customerInfor') {//--客户相关资料
            this.setState({
                customerInforInfo: customerInformation,
                isSave: isSaveBefore
            },function(){
                console.log(this.state.customerInforInfo)
            })
        }
        
    }
    handleFormBack(){
        hashHistory.push('/risk-management')
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return(
            <Spin spinning={this.state.loading} size="large">
                <Form   className="full-width padding15 img-align"
                    >
                    <h2>审批流程：</h2>
                    <ApprovalProcess ifModal={false} modalTableColumns={this.state.modalTableColumns} apiUrl={api.groupAuditHistory} productId={this.props.productId}/>
                    <FormItem label="审批意见：">
                        {getFieldDecorator('auditOpinion',{initialValue: this.state.auditOpinion})(
                            <TextArea placeholder={
                                `1、XXX分公司（或总公司）风控人员同意（或拒接）XXX客户的借款申请；
            2、在审批过程中需要注意以下事项（或者是拒绝的原因是）：
               1）................
               2）...............
            ................`
                            } autosize={{ minRows: 6, maxRows: 10 }}  disabled={this.props.disabled}/>
                        )}
                    </FormItem>
                    <div className="col-interval">
                        <FormItem label="审批结果：">
                             {getFieldDecorator('auditResult',{initialValue: this.state.auditResult})(
                                <Select allowClear={true} placeholder='--请选择--' style={{ width: '30%' }} disabled={this.props.disabled}>
                                    <Option value="">--请选择--</Option>
                                    <Option value="1">通过</Option>
                                    <Option value="2">拒绝</Option>
                                </Select>
                            )}
                        </FormItem>
                    </div>
                    {/* <h2 className="full-width">补充资料：</h2> */}
                    <div style={{marginBottom:'20px'}}>
                        <div className="white-title">
                            <p>客户相关资料补充：</p>
                            <Divider/>
                        </div>
                        {/* <span className="label-style">客户相关资料</span> */}
                        <div className="show full-width">
                            <PicturesWall defaultFileList={this.state.customerInformationDefaultJson} componentsStyle="customerInfor" onPicturesWallChange={this.onPicturesWallChange.bind(this)} disabled={this.props.disabled}/>
                        </div>
                    </div>
                    <div style={{marginBottom:'20px'}}>
                        <div className="white-title">
                            <p>抵押物资料补充：</p>
                            <Divider/>
                        </div>
                        <div className="show full-width">
                            <PicturesWall defaultFileList={this.state.pictureDataJson.pawnMaterialDefaultJson} componentsStyle="pawnMaterial" onPicturesWallChange={this.onPicturesWallChange.bind(this)} disabled={this.props.disabled}/>
                        </div>
                    </div>
                    <div style={{marginBottom:'20px'}}>
                        <div className="white-title">
                            <p>现场调查资料补充：</p>
                            <Divider/>
                        </div>
                        <div className="show full-width">
                            <PicturesWall defaultFileList={this.state.pictureDataJson.fieldSurveyDefaultJson} componentsStyle="fieldSurvey" onPicturesWallChange={this.onPicturesWallChange.bind(this)} disabled={this.props.disabled}/>
                        </div>
                    </div>
                    <div style={{marginBottom:'20px'}}>
                        <div className="white-title">
                            <p>其他资料补充：</p>
                            <Divider/>
                        </div>
                        <div className="show full-width">
                            <PicturesWall defaultFileList={this.state.pictureDataJson.otherDetailsDefaultJson} componentsStyle="otherDetails" onPicturesWallChange={this.onPicturesWallChange.bind(this)} disabled={this.props.disabled}/>
                        </div>
                    </div>
                    <div className="col-interval">
                        {!this.props.disabled && <Button className="green-style"  style={{float: 'left',marginLeft:'0'}} onClick={this._onSaveDebounce}>保存</Button>}
                        {!this.props.disabled && <Button  style={{float: 'left',marginLeft:'0'}} className="green-style" onClick={this._onSubmitDebounce}>提交</Button>} 
                        <Button className="default-btn"  style={{float: 'left',marginLeft:'0'}} onClick={this.handleFormBack}>返回</Button>
                    </div>
                </Form>
            </Spin>
        )
    }
}
const ApprovalOpinion = Form.create()(ApprovalOpinionForm);

export default ApprovalOpinion