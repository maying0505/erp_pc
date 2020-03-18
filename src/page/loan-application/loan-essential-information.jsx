import React from 'react';
import {
    Divider,
    message,
    Checkbox,
    Form,
    Row,
    Col,
    Input,
    Button,
    Icon,
    DatePicker,
    Select,
    Radio,
    Spin,
    InputNumber
} from 'antd';
import {hashHistory} from 'react-router'
import PicturesWall from 'component/img-upload'
import LoanProducts from 'component/loan-products'
import {request} from 'common/request/request.js'
import {local, session} from 'common/util/storage.js'
import LodashDebounce from 'common/util/debounce'

import api from 'api'

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['Apple', 'Pear', 'Orange'];

class LoanEssentialInfoForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            loanApplicationInfo: {},
            allLoanProductsInfo: {},
            findRiskInfo: [],
            findRiskOptions: [],
            wereBorrowedsInfo: [],
            BorrowerInformation: {},
            riskGroupsInfo: [],
            ifSubmit: false,
            customerId: '',
            productIds: [],
            ifShowPriBorrInfoBtn: false
        }
    }

    componentDidMount() { //预加载数据
        console.log(this.props.productId)
        this.setState({ifShowPriBorrInfoBtn: this.props.ifShowPriBorrInfoBtn})
        if (session.get('customerId')) {
            // session.set('customerId',this.props.id)
            this.setState({
                customerId: session.get('customerId')
            })
        }
        if (this.props.id != 'null') {
            this.setState({
                customerId: this.props.id
            })
        }

        request(api.findRiskGet, {}, 'post', session.get('token')) //风控人员信息获取
            .then(res => {
                console.log(JSON.stringify(res))
                if (res.success) {
                    if (res.data) {
                        let findRiskOptionsBefore = []
                        for (let item of res.data) {
                            findRiskOptionsBefore.push(item.name)
                        }
                        this.setState({
                            findRiskOptions: findRiskOptionsBefore,
                            findRiskInfo: res.data
                        }, function () {
                            if (this.props.productId != 'null') {
                                this.defaultInfoGet(this.props.productId)
                            } else {
                                this.setState({loading: false})
                            }
                        })
                    } else {
                        this.setState({loading: false})
                    }
                } else {
                    message.error(res.message)
                    this.setState({loading: false})
                }
            })
            .catch(err => {
                this.setState({loading: false})
            })
    }
    componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
        this.setState({ifShowPriBorrInfoBtn: nextProps.ifShowPriBorrInfoBtn})
    }
    defaultInfoGet = (productId) => {
        request(`${api.productByGet}${productId}`, {}, 'get', session.get('token')) //借款人信息详情
            .then(res => {
                console.log(JSON.stringify(res))
                this.setState({loading: false})
                if (res.success) {
                    let riskGroupsBefore = []
                    if (res.data.riskGroups) { //处理默认风控组成员
                        let findRiskInfoT = this.state.findRiskInfo
                        for (let item of findRiskInfoT) {
                            for (let val of res.data.riskGroups) {
                                let userId = val['user']
                                item['id'] == userId.id ? riskGroupsBefore.push(item['name']) : ''
                            }
                        }
                    }
                    console.log(res.data.riskGroups)
                    console.log(riskGroupsBefore)
                    console.log(11111111111111111111111)
                    let productIdsFirst = this.state.productIds
                    productIdsFirst[0] = {productId: res.data.id}

                    this.setState({
                        BorrowerInformation: res.data,
                        wereBorrowedsInfo: res.data.wereBorroweds ? [res.data.wereBorroweds]: [[]],
                        riskGroupsInfo: riskGroupsBefore,
                        productIds: productIdsFirst
                    }, function () {
                        console.log(this.state.riskGroupsInfo)
                        console.log(this.state.findRiskOptions)
                    })
                } else {
                    message.error(res.message)
                }
            })
            .catch(err => {
                this.setState({loading: false})
            })
    }
    handleFormSubmit = (e) => {
        this.handleSave(e)
        this.setState({
            ifSubmit: true
        })
    }
    /**
     * @desc 添加防抖，防止连击
     * */
    _onSaveDebounce = LodashDebounce((e) => this.handleSave(e));
    _onSubmitDebounce = LodashDebounce((e) => this.handleFormSubmit(e));

    handleSave = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) return
            console.log('form1:', values)
            let findRiskInfoBefore = []
            let findRiskInfoT = this.state.findRiskInfo
            if (values.jsonRiskGroup) {
                for (let item of values.jsonRiskGroup) {
                    for (let val of findRiskInfoT) {
                        val.name === item ? findRiskInfoBefore.push(val.id) : ''
                    }
                }
            }

            // this.LoanProductsSave(); //借款产品信息获取
            this.setState({
                loading: true,
                allLoanProductsInfo: {userIds: JSON.stringify(findRiskInfoBefore)},
            }, function () {
                this.LoanProductsSave(); //借款产品信息获取
            })

        })
    }

    handleFormBack() {
        hashHistory.push('/loan-application')
    }

    LoanProductsGet = (event) => {
        console.log('form2: ', event)
        this.setState({
            allLoanProductsInfo: {
                ...this.state.allLoanProductsInfo,
                jsonProduct: JSON.stringify(event),
                customerId: this.state.customerId
            }
        }, function () {
            console.log(this.state.allLoanProductsInfo)
            request(api.productEnterSave, this.state.allLoanProductsInfo, 'post', session.get('token'))
                .then(res => {
                    console.log(JSON.stringify(res))
                    if (res.success) {
                        this.setState({
                            productIds: res.data,
                        })
                        res.data2 ? this.setState({wereBorrowedsInfo: res.data2}) : null
                        this.props.saveProductId(res.data[0].productId)
                        if (this.state.ifSubmit) {
                            this.formSubmitFunc(res.data)
                            return
                        } else {
                            message.success(res.message)
                        }

                    } else {
                        message.error(res.message)
                    }
                    this.setState({
                        loading: false
                    })

                })
                .catch(err => {
                    // message.error(err.statusText)
                    this.setState({
                        loading: false
                    })
                })
        })
    }
    formSubmitFunc = (info) => { //提交
        let productIdsBox = []
        for (let item of info) {
            productIdsBox.push(item['productId'])
        }
        // productIdsBox = JSON.stringify(['950c1ecaf5b04b8888272848c7b6ceae'])
        productIdsBox = JSON.stringify(productIdsBox)
        request(api.groupEnterSubmit, {productIds: productIdsBox}, 'post', session.get('token'))
            .then(res => {
                console.log(JSON.stringify(res))
                this.setState({
                    loading: false,
                    ifSubmit: false
                })
                if (res.success) {
                    message.success(res.message)
                    hashHistory.push('/loan-application')
                } else {
                    message.error(res.message)
                }

            })
            .catch(err => {
                this.setState({
                    ifSubmit: false
                })
                this.setState({
                    loading: false
                })
            })

    }

    _onCheckPress = (kIndex, dataObj) => {
        const {onCheckPress, checkType} = this.props;
        onCheckPress(checkType, kIndex, dataObj)
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        console.log(this.state)
        return (
            <Spin spinning={this.state.loading} size="large">
                <LoanProducts
                    ifShowPriBorrInfoBtn={this.state.ifShowPriBorrInfoBtn}
                    productIds={this.state.productIds}
                    wereBorrowedsInfo={this.state.wereBorrowedsInfo}
                    defaultValue={this.state.BorrowerInformation}
                    disabled={this.props.disabled}
                    LoanProductsSave={fn => this.LoanProductsSave = fn}
                    LoanProductsGet={this.LoanProductsGet.bind(this)}
                    onCheckPress={this._onCheckPress}
                />
                <div style={{width: "100%"}}>
                    <Form
                        className="ant-advanced-search-form loan-application-detail-essential"
                    >
                        <Row className="my-card" style={{paddingLeft: '22px', paddingRight: '22px'}}>
                            <div className="white-title">
                                <p>风控组成员：</p>
                                <Divider/>
                            </div>
                            <Col span={20}>
                                <FormItem>
                                    {getFieldDecorator('jsonRiskGroup', {initialValue: this.state.riskGroupsInfo})(
                                        <CheckboxGroup disabled={this.props.disabled ? true : false}
                                                       options={this.state.findRiskOptions}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{textAlign: 'left', margin: '20px'}}>
                                {!this.props.disabled && <Button className="green-style" htmlType="submit" onClick={this._onSaveDebounce}>保存</Button>}
                                {!this.props.disabled && <Button className="green-style" style={{marginLeft: 8}}
                                                                 onClick={this._onSubmitDebounce}>提交</Button>}
                                <Button className="default-btn" style={{marginLeft: 8}}
                                        onClick={this.handleFormBack}>返回</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Spin>
        )
    }
}

const LoanEssentialInfo = Form.create()(LoanEssentialInfoForm);

export default LoanEssentialInfo




