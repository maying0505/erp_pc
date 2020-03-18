import React from 'react'
import {Tabs, Card, Button, message, Divider, Icon} from 'antd'
import CustomerInfoShow from 'component/customer-info-show'
import ApprovalOpinion from './approval-opinion.jsx'
import imgUrl from 'common/util/imgUrl.js'
import LoanInfoShow from 'component/loan-info-show'
import PriBorrInfoShow from 'component/pri-borr-info-show'
import {request} from 'common/request/request.js'
import {local, session} from 'common/util/storage.js'
import api from 'api'
import RepaymentPlan from 'component/repaymentPlan/repaymentPlan';

import './index.scss'

const TabPane = Tabs.TabPane;

class RiskManagementDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            disabled: false,
            productId: '',
            id: '',
            LoanInfo: {},
            pictureDataJson: {},
            priPictureDataJson: {},
            ifShowPriBorrInfoBtn: false,
            ifShowPriBorrInfo: false,
            priLoanInfo: {},
            ifExtension: false,
            isModalVisible: false,
        }
    }

    componentDidMount() { //预加载数据
        if (this.props.params.productId != 'null') {
            this.setState({
                productId: this.props.params.productId,
            })
            this.loadDetail(this.props.params.productId)
        }
        if (this.props.params.id != 'null') {
            this.setState({
                id: this.props.params.id,
            })
        }
        if (this.props.params.status != 'null') {
            this.setState({
                disabled: this.props.params.status === '1' ? false : true,
            })
        }
    }

    loadDetail = (productId, ifPriInfo) => {
        request(`${api.productByGet}${productId}`, {}, 'get', session.get('token')) //借款人信息详情
            .then(res => {
                console.log(JSON.stringify(res))
                this.setState({loading: false})
                if (ifPriInfo) {
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
                                console.log(this.state.priPictureDataJson)
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
                    }
                } else {
                    this.setState({
                        LoanInfo: res,
                    })
                    if (res.success) {
                        if (res.data.pawnMaterialJson) { //处理抵押物资料
                            this.setState({
                                pictureDataJson: {
                                    ...this.state.pictureDataJson,
                                    pawnMaterialJson: res.data.pawnMaterialJson,
                                    pawnMaterialDefaultJson: this.imgDataDo(res.data.pawnMaterialJson)
                                }
                            }, function () {
                                console.log(this.state.pictureDataJson)
                            })
                        }
                        if (res.data.fieldSurveyJson) { //现场调查资料
                            this.setState({
                                pictureDataJson: {
                                    ...this.state.pictureDataJson,
                                    fieldSurveyJson: res.data.fieldSurveyJson,
                                    fieldSurveyDefaultJson: this.imgDataDo(res.data.fieldSurveyJson)
                                }
                            }, function () {
                                console.log(this.state.pictureDataJson)
                            })
                        }
                        if (res.data.otherDetailsJson) { //其他资料
                            this.setState({
                                pictureDataJson: {
                                    ...this.state.pictureDataJson,
                                    otherDetailsJson: res.data.otherDetailsJson,
                                    otherDetailsDefaultJson: this.imgDataDo(res.data.otherDetailsJson)
                                }
                            }, function () {
                                console.log(JSON.stringify(this.state.pictureDataJson))
                            })
                        }
                        if (res.data.parentId !== '0' && res.data.parentId) {
                            this.setState({ifShowPriBorrInfoBtn: true})
                            this.loadDetail(res.data.parentId, true)
                        }

                    }
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
    _onRepaymentPlanPress = () => {
        this.setState({isModalVisible: true});
    };
    _onModalCancel = () => {
        this.setState({isModalVisible: false});
    };

    render() {
        return (
            <Card bordered={false}>
                <h1 className="detail-title">风控审批</h1>
                <Divider/>
                <div className="position-r">
                    <Tabs defaultActiveKey="1" style={{background: '#fff', padding: '15px'}}>
                        <TabPane tab="客户信息" key="1">
                            <CustomerInfoShow id={this.props.params.id} productId={this.props.params.productId}/>
                        </TabPane>
                        <TabPane tab="借款信息" key="2">
                            <LoanInfoShow
                                ifShowPriBorrInfoBtn={this.state.ifShowPriBorrInfoBtn}
                                LoanInfo={this.state.LoanInfo}
                                pictureDataJson={this.state.pictureDataJson}
                                productId={this.props.params.productId}
                                id={this.props.params.id}
                                onCheckPress={this._onRepaymentPlanPress}
                            />
                        </TabPane>
                        <TabPane tab="审批意见" key="3">
                            <ApprovalOpinion pictureDataJson={this.state.pictureDataJson}
                                             productId={this.props.params.productId} id={this.props.params.id}
                                             auditId={this.props.params.auditId} disabled={this.state.disabled}/>
                        </TabPane>
                    </Tabs>
                    {this.state.ifShowPriBorrInfoBtn &&
                    <Button onClick={this.showPriBorrInfo} className="green-style right-btn"><Icon
                        type="folder-open"/><span>原借款信息</span></Button>}
                </div>
                <PriBorrInfoShow ifExtension={this.state.ifExtension} cancelPriBorrInfo={this.cancelPriBorrInfo.bind(this)}
                                 visible={this.state.ifShowPriBorrInfo} LoanInfo={this.state.priLoanInfo}
                                 pictureDataJson={this.state.priPictureDataJson}/>
                <RepaymentPlan
                    modalVisible={this.state.isModalVisible}
                    productId={this.props.params.productId}
                    onCancel={this._onModalCancel}
                />
            </Card>
        )
    }
}

export default RiskManagementDetail
