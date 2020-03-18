import React from 'react'
import PropTypes from 'prop-types'
import {Button, Spin, Row, message} from 'antd';
import {hashHistory} from 'react-router'
import {request} from 'common/request/request.js'
import {local, session} from 'common/util/storage.js'
import imgUrl from 'common/util/imgUrl.js'
import InfoShowCommon from 'component/info-show-common'
import PicturesWall from 'component/img-upload'
import MyAddEmergencyContact from 'component/add-emergency-contact'
import CreditInvestigation from 'component/search-credit-investigation'
import CreditReport from 'component/credit-report'
import api from 'api'

class CustomerInfoShow extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        productId: PropTypes.string.isRequired,
        ifLoanApplication: PropTypes.bool,
    };
    static defaultProps = {
        ifLoanApplication: false,
    }
    constructor(props) {
        super(props)
        this.state = {
            customerInfo: {},
            loading: true,
            emergenciesInfo: [],
            customerInformationJson: [],
            ifShowCreditInvestigation: false,
            showCreditReport: false,
            creditReportType: '',
            reportBusinessId: '',
            businessId: ''
        }
    }

    componentDidMount() { //预加载数据
        session.remove('customerInformationJson')
        session.remove('customerInformationDefaultJson')
        request(`${api.customerByGet}${this.props.id}`, {}, 'get', session.get('token')) //地址联动数据获取
            .then(res => {
                console.log(JSON.stringify(res))
                console.log('+++++++++++++++++++++++++++++++')
                if (res.success) {
                    this.setState({
                        customerInfo: res.data,
                        businessId: res.data['id']? res.data['id'] : '',
                        emergenciesInfo: res.data.emergencies ? res.data.emergencies : [],
                    })
                    if (res.data.customerInformationJson) {
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
                        session.set('customerInformationJson', res.data.customerInformationJson)
                        session.set('customerInformationDefaultJson', customerInformations)
                        this.setState({
                            customerInformationJson: customerInformations
                        }, function () {
                            console.log(this.state.customerInformationJson)
                        })
                    }

                } else {
                    message.error(res.message)
                }
                this.setState({loading: false})
            })
            .catch(err => {
                this.setState({loading: false})
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

    handleFormBack() {
        window.history.back()
    }

    _onPayReturnVisit = (code) => {
        switch (code) {
            case '1': {
                return '回访成功再划扣';
            }
            case '2': {
                return '回访未成功可先行划扣';
            }
            case '3': {
                return '免回访';
            }
            default:
                return '';
        }
    };
    cancelCreditInvestigation = () => {
        this.setState({
            ifShowCreditInvestigation: false
        })
    }
    showCreditInvestigation = () => {
        if (this.props.ifLoanApplication) {
           this.setState({
                ifShowCreditInvestigation: true
            })
        } else {
            this.viewReport()
        }

    }
    handlecancelCreditReport= () => {
        this.setState({showCreditReport: false})
    }
    render() {
        return (
            <Spin spinning={this.state.loading} size="large">
                <InfoShowCommon defaultValue={this.state.customerInfo}/>
                <CreditReport type={this.state.creditReportType} enterpriseBusinessId={this.state.businessId} personalBusinessId={this.state.reportBusinessId} visible={this.state.showCreditReport} handlecancelCreditReport={this.handlecancelCreditReport.bind(this)}></CreditReport>
                <CreditInvestigation productId={this.props.productId} visible={this.state.ifShowCreditInvestigation} cancelCreditInvestigation={this.cancelCreditInvestigation.bind(this)} businessType='1' businessId={this.state.customerInfo['id']? this.state.customerInfo['id'] :''} certificateType={this.state.customerInfo['certificateType']? this.state.customerInfo['certificateType'] : '1'}/>
                <Row style={{width: '100%'}} className="padding15" style={{paddingTop: '0'}}>
                    <Button className="green-style" onClick={this.showCreditInvestigation}>查询征信</Button>
                    <div className="col-interval green-box">
                        是否回访：<span>{this._onPayReturnVisit(this.state.customerInfo.chooseCallback)}</span>
                    </div>
                    {this.state.emergenciesInfo.length > 0 && <div className="show">
                        <MyAddEmergencyContact productId={this.props.productId} ifLoanApplication={this.props.ifLoanApplication} ifShow={true} defaultValue={this.state.emergenciesInfo}/>
                    </div>}
                    <h2 className="full-title">客户相关资料</h2>
                    <div className="show">
                        <PicturesWall defaultFileList={this.state.customerInformationJson} disabled={true}/>
                    </div>
                </Row>
                <div className="col-interval"><Button className="default-btn" style={{float: 'left'}}
                                                      onClick={this.handleFormBack}>返回</Button></div>
            </Spin>
        )
    }
}

export default CustomerInfoShow
