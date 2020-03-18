import React from 'react'
import {hashHistory} from 'react-router'
import { Form, Input, Button, Spin, Select, message, Divider } from 'antd';
import {request} from 'common/request/request.js'
import {local, session} from 'common/util/storage.js'
import PicturesWall from 'component/img-upload'
import ApprovalProcess from 'component/approval-process'
import LodashDebounce from 'common/util/debounce'
import imgUrl from 'common/util/imgUrl.js'
import api from 'api'

import './index.scss'

const { TextArea } = Input
const Option = Select.Option
const FormItem = Form.Item

class SignOpinionForm extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            isSave: true,
            loading: true,
            pictureDataJson: [],
            situationInfo: [],
            signedInfo: [],
            otherDetailsInfo: [],
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
        this.setState({
            pictureDataJson: this.props.pictureDataJson,
            situationInfo: this.props.pictureDataJson.situationJson ? this.props.pictureDataJson.situationJson : [],
            signedInfo: this.props.pictureDataJson.signedJson ? this.props.pictureDataJson.signedJson : [],
            otherDetailsInfo: this.props.pictureDataJson.otherDetailsJson ? this.props.pictureDataJson.otherDetailsJson : [],
        },function(){
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
        if (nextProps.pictureDataJson !== this.state.pictureDataJson) {
            this.setState({
                pictureDataJson: nextProps.pictureDataJson,
                situationInfo: nextProps.pictureDataJson.situationJson ? nextProps.pictureDataJson.situationJson : [],
                signedInfo: nextProps.pictureDataJson.signedJson ? nextProps.pictureDataJson.signedJson : [],
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
                        hashHistory.push('/sign-contract')
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
    
    auditInfoSave = () => {
        if (!this.state.isSave){
            message.warning('请在所有文件上传完成后提交或保存!')
            return
        }

        this.setState({loading: true})
        this.props.form.validateFields((err, values) => {
            if (err) return
            console.log(values)
            request(api.signAuditSave,{
                ...values,
                id: this.state.auditId,
                productId: this.props.productId,
                customerId: this.props.id,
                situationJson: JSON.stringify(this.state.situationInfo),
                signedJson: JSON.stringify(this.state.signedInfo),
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
        if (style === 'situation'){
            customerInfoJ = this.state.situationInfo
        } else if (style === 'signed'){
            customerInfoJ = this.state.signedInfo
        }  else if (style === 'otherDetails') {
            customerInfoJ = this.state.otherDetailsInfo
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
        if (style === 'situation') {//--风控措施执行情况
            this.setState({
                situationInfo: customerInformation,
                isSave: isSaveBefore
            },function(){
                console.log(this.state.situationInfo)
                
            })
        } else if (style === 'signed') { //--签约资料
            this.setState({
                signedInfo: customerInformation,
                isSave: isSaveBefore
            },function(){
                console.log(this.state.signedInfo)
            })
        } else if (style === 'otherDetails') {//--其他资料
            this.setState({
                otherDetailsInfo: customerInformation,
                isSave: isSaveBefore
            },function(){
                console.log(this.state.otherDetailsInfo)
            })
        } 
    }
    handleFormBack(){
        hashHistory.push('/sign-contract')
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return(
            <Spin spinning={this.state.loading} size="large">
                <Form className="full-width padding15 img-align"
                    >
                    <h2>审批流程：</h2>
                    <ApprovalProcess ifModal={false} modalTableColumns={this.state.modalTableColumns} apiUrl={api.groupAuditHistory} productId={this.props.productId}/>
                    <FormItem label="签约意见">
                        {getFieldDecorator('auditOpinion',{initialValue: this.state.auditOpinion})(
                            <TextArea placeholder={
                                `1、XXX分公司（或总公司）签约人员同意（或拒接）XXX客户的借款申请；
            2、在签约过程中需要注意以下事项（或者是拒绝的原因是）：
               1）................
               2）...............
            ................`
                            } autosize={{ minRows: 6, maxRows: 10 }}  disabled={this.props.disabled}/>
                        )}
                    </FormItem>
                    <div className="col-interval">
                        <FormItem label="签约结果">
                             {getFieldDecorator('auditResult',{initialValue: this.state.auditResult})(
                                <Select placeholder='--请选择--' style={{ width: '30%' }} disabled={this.props.disabled} allowClear={true}>
                                    <Option value="">--请选择--</Option>
                                    <Option value="1">通过</Option>
                                    <Option value="2">拒绝</Option>
                                </Select>
                            )}
                        </FormItem>
                    </div>
                    <div style={{marginBottom:'20px'}}>
                        {/* <span className="label-style">风控措施执行情况</span> */}
                        <div className="white-title">
                            <p>风控措施执行情况：</p>
                            <Divider/>
                        </div>
                        <div className={`full-width ${this.props.disabled ? 'show':''}`}>                            
                            <PicturesWall defaultFileList={this.state.pictureDataJson.situationDefaultJson} componentsStyle="situation" onPicturesWallChange={this.onPicturesWallChange.bind(this)} disabled={this.props.disabled}/>
                        </div>
                    </div>
                    <div style={{marginBottom:'20px'}}>
                        <div className="white-title">
                            <p>签约资料：</p>
                            <Divider/>
                        </div>
                        <div className={`full-width ${this.props.disabled ? 'show':''}`}>
                            <PicturesWall defaultFileList={this.state.pictureDataJson.signedDefaultJson} componentsStyle="signed" onPicturesWallChange={this.onPicturesWallChange.bind(this)} disabled={this.props.disabled}/>
                        </div>
                    </div>
                    <div style={{marginBottom:'20px'}}>
                        <div className="white-title">
                            <p>其他资料：</p>
                            <Divider/>
                        </div>
                        <div className={`full-width ${this.props.disabled ? 'show':''}`}>
                            <PicturesWall defaultFileList={this.state.pictureDataJson.otherDetailsDefaultJson} componentsStyle="otherDetails" onPicturesWallChange={this.onPicturesWallChange.bind(this)} disabled={this.props.disabled}/>
                        </div>
                    </div>
                    <div className="col-interval">
                        {!this.props.disabled && <Button className="green-style" style={{float: 'left',marginLeft:'0'}} onClick={this._onSaveDebounce}>保存</Button>} 
                        {!this.props.disabled && <Button className="green-style" style={{float: 'left',marginLeft:'0'}} onClick={this._onSubmitDebounce}>提交</Button>} 
                        <Button className="default-btn" style={{float: 'left',marginLeft:'0'}} onClick={this.handleFormBack}>返回</Button>
                    </div>
                </Form>
            </Spin>
        )
    }
}
const SignOpinion = Form.create()(SignOpinionForm);

export default SignOpinion