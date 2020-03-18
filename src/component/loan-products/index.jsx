import React from 'react';
import PropTypes from 'prop-types';
import {
    Modal,
    Table,
    Divider,
    Cascader,
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
    InputNumber,
    message
} from 'antd';
import {hashHistory} from 'react-router'
import PicturesWall from 'component/img-upload'
import InterestRateType from 'component/interest-rate-type'
import LoanTermUnit from 'component/loan-term-unit'
import ProductSelect from 'component/product-select'
import MyAddEmergencyContact from 'component/add-emergency-contact'
import RepaymentMethod from 'component/repayment-method'
import {local, session} from 'common/util/storage.js'
import imgUrl from 'common/util/imgUrl.js'
import api from 'api'
import {request} from 'common/request/request.js'
import './index.scss'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const {TextArea} = Input;

const tableWidth = '20%'
const refundWarAllJson = [
    [
        {value: '4', text: '先息后本（一次付息到期还本）'},
        {value: '5', text: '先息后本（按期付息到期还本）'},
    ],
    [
        {value: '4', text: '先息后本（一次付息到期还本）'},
        {value: '5', text: '先息后本（按期付息到期还本）'},
    ],
    [
        {value: '3', text: '等本等息'},
        {value: '4', text: '先息后本（一次付息到期还本）'},
        {value: '5', text: '先息后本（按期付息到期还本）'},
    ],
    [
        {value: '1', text: '等额本息'},
        {value: '2', text: '等额本金'},
        {value: '3', text: '等本等息'},
        {value: '4', text: '先息后本（一次付息到期还本）'},
        {value: '5', text: '先息后本（按期付息到期还本）'},
    ]
]

const typeSelectOptionArr = [
    {id: 0, value: '1', label: '一次性收取'},
    {id: 1, value: '2', label: '按期收取'},
];

class LoanProductsForm extends React.Component {
    static propTypes = {
        wereBorrowedsInfo: PropTypes.array,
        defaultValue: PropTypes.object,
        form: PropTypes.object.isRequired,
        disabled: PropTypes.bool,
        ifShowPriBorrInfoBtn: PropTypes.bool,
        productIds: PropTypes.array.isRequired,
        LoanProductsSave: PropTypes.func.isRequired,
        onCheckPress: PropTypes.func,
    };

    static defaultProps = {
        wereBorrowedsInfo: [],
        defaultValue: {},
        disabled: false,
        ifShowPriBorrInfoBtn: false,
        onCheckPress: null,
    };

    constructor(props) {
        super(props)
        props.LoanProductsSave(this.LoanProductsSave);
        this.state = {
            ifShowPriBorrInfoBtn: false,
            loading: false,
            BorrowerInformation: {},
            wereBorrowedsInfo: [],
            LoanProductsInfo: {},//借款产品信息
            productSelectInfo: [],//产品信息
            deadlineUnitInfo: ['1'],//借款期限单位
            serviceDeadlineUnitInfo: ['1'],//服务期限单位
            pawnMaterialInfo: [[]],//抵押物资料
            fieldSurveyInfo: [[]],//现场调查资料
            otherDetailsInfo: [[]],//其他资料
            serviceTypeInfo: ['1'],//服务利率单位
            aprTypeInfo: ['1'],//借款利率单位
            proNameInfo: [],//产品名称
            proCategoryInfo: [],//产品类别
            proStyleInfo: [],//产品类型
            nextProps: {},
            refundWarJson: [refundWarAllJson[0]],
            defaultOtherDetailsInfo: [[]],
            defaultPawnMaterialInfo: [[]],
            defaultFieldSurveyInfo: [[]],
            productIds: [],
            addr: [],
            residentialAddressBefore: [],//省市区默认值
            uuid: 1,
            showContents: [{
                label: '客户姓名',
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
                    label: '证件类型',
                    fieldName: 'certificateType'
                },
                {
                    label: '证件号码',
                    fieldName: 'identityCard'
                },
                {
                    label: '居住地址',
                    fieldName: 'provinceCityArea'
                },
                {
                    label: '具体地址',
                    fieldName: 'address'
                }
            ],
            typeArr: [typeSelectOptionArr],
            isSave: true,
            ModalBodyStyle: {
                textAlign: 'center',
            },
            visible: false,  //弹出框状态
            modalLoading: true,
            columns: [
                {
                    title: '姓名',
                    width: tableWidth,
                    dataIndex: 'lender',
                },
                {
                    title: '手机号',
                    width: tableWidth,
                    dataIndex: 'phoneNumber',
                },
                {
                    title: '身份证号',
                    width: tableWidth,
                    dataIndex: 'idNumber',
                },
                {
                    title: '地址',
                    width: tableWidth,
                    dataIndex: 'province',
                    render: (text,record) => `${record.province?record.province:''}-${record.city?record.city:''}-${record.area?record.area:''}-${record.detailedAddress?record.detailedAddress:''}`
                },
                {
                    title: '操作',
                    width: tableWidth,
                    key: 'operation',
                    render: (record) => <a onClick={this.choiceThis.bind(this, record)}>选择此项</a>
                }
            ],
            fileData: [],
            curProduct: 0
        }
    }

    componentDidMount() { //预加载数据
        this.propsDo(this.props)
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

    componentWillReceiveProps(nextProps) { //组件接收到新的props时调用
        console.log(nextProps)
        console.log(33333333333333333333333)
        this.propsDo(nextProps)
    }
    lenderGet = () =>{
        request(api.allLenderList,{},'post', session.get('token'))
                .then(res => {
                    console.log(JSON.stringify(res))
                    this.setState({
                        modalLoading: false
                    })
                    if (res.success) {
                        this.setState({
                            fileData: res.data,
                            visible: true,
                        })
                    }else {
                        message.error(res.message)
                    }
                })
                .catch(err => {
                    this.setState({modalLoading: false})
                })
    }
    choiceThis = (record) => {

        this.props.form.setFieldsValue({[`lender[${this.state.curProduct}]`]: record.lender ? record.lender :''})
        this.props.form.setFieldsValue({[`lenderPhone[${this.state.curProduct}]`]: record.phoneNumber ? record.phoneNumber :''})
        this.props.form.setFieldsValue({[`lenderIdentityCard[${this.state.curProduct}]`]: record.idNumber ? record.idNumber :''})
        this.props.form.setFieldsValue({[`lenderAddress[${this.state.curProduct}]`]: record.detailedAddress ? record.detailedAddress :''})
        this.props.form.setFieldsValue({[`residentialAddressBefore[${this.state.curProduct}]`]: record.province ? [record.province, record.city, record.area] : []})

        this.setState({
            visible: false,
        })
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }
    showModal = (k) =>{
        this.setState({
            curProduct: k
        })
        this.lenderGet()
    }
    propsDo = (nextProps) => {
        console.log('productIds:',JSON.stringify(nextProps.productIds))
        this.setState({ifShowPriBorrInfoBtn: nextProps.ifShowPriBorrInfoBtn})
        if (nextProps.wereBorrowedsInfo != this.state.wereBorrowedsInfo) {
            this.setState({
                wereBorrowedsInfo: nextProps.wereBorrowedsInfo
            })
        }
        if (nextProps.productIds != this.state.productIds)
        {
            this.setState({
                productIds: nextProps.productIds,
            })

        }
        if (nextProps.defaultValue != this.state.nextProps) {
            this.setState({
                nextProps: nextProps.defaultValue
            })

            this.setState({
                BorrowerInformation: nextProps.defaultValue,
                typeArr: nextProps.defaultValue.refundWar === '4' ? [[typeSelectOptionArr[0]]] : [typeSelectOptionArr],
                residentialAddressBefore: nextProps.defaultValue.province ? [nextProps.defaultValue.province, nextProps.defaultValue.city, nextProps.defaultValue.area] : [],
                proNameInfo: [nextProps.defaultValue.proName],
                proCategoryInfo: [nextProps.defaultValue.proCategory],
                proStyleInfo: [nextProps.defaultValue.proType],
                deadlineUnitInfo: [nextProps.defaultValue.deadlineUnit],
                serviceDeadlineUnitInfo: [nextProps.defaultValue.serviceDeadlineUnit],
                aprTypeInfo: [nextProps.defaultValue.aprType],
                serviceTypeInfo: [nextProps.defaultValue.serviceType],
                refundWarJson: nextProps.defaultValue.deadlineUnit ? [refundWarAllJson[Number(nextProps.defaultValue.deadlineUnit) - 1]] : [refundWarAllJson[0]],
                pawnMaterialInfo: nextProps.defaultValue.pawnMaterialJson ? [nextProps.defaultValue.pawnMaterialJson] : [[]],
                fieldSurveyInfo: nextProps.defaultValue.fieldSurveyJson ? [nextProps.defaultValue.fieldSurveyJson] : [[]],
                otherDetailsInfo: nextProps.defaultValue.otherDetailsJson ? [nextProps.defaultValue.otherDetailsJson] : [[]]
            }, function () {
                console.log('typeArr:',this.state.typeArr)
                this.imgViewDefault()
            })
        }
        session.set('productIds', JSON.stringify(this.state.productIds))
    }
    imgViewDefault = (e) => {
        //处理默认抵押物资料fieldSurvey
        if (this.state.pawnMaterialInfo[0] != "" && this.state.pawnMaterialInfo[0] != undefined && this.state.pawnMaterialInfo[0] != null) {
            let pawnMaterialBefore = []
            for (let item of this.state.pawnMaterialInfo[0]) {
                let pawnMaterialJ = {}
                pawnMaterialJ['bigUrl'] = item[imgUrl.big] ? item[imgUrl.big]: ''
                pawnMaterialJ['bigBUrl'] = item[imgUrl.bigB] ? item[imgUrl.bigB]: ''
                pawnMaterialJ['url'] = item[imgUrl.small] ? item[imgUrl.small]: ''
                pawnMaterialJ['uid'] = `${item.fileName}${Math.random()}`
                pawnMaterialJ['status'] = 'done'
                pawnMaterialBefore.push(pawnMaterialJ)
            }
            this.setState({
                defaultPawnMaterialInfo: [pawnMaterialBefore],
            }, function () {
                console.log('@@@@@@@@@@@@@@@@@@@@@@@@@')
                console.log(this.state.defaultPawnMaterialInfo)
            })
        }

        //处理默认现场调查资料
        if (this.state.fieldSurveyInfo[0] != "" && this.state.fieldSurveyInfo[0] != undefined && this.state.fieldSurveyInfo[0] != null) {
            let fieldSurveyBefore = []
            for (let item of this.state.fieldSurveyInfo[0]) {
                let fieldSurveyJ = {}
                fieldSurveyJ['bigUrl'] = item[imgUrl.big] ? item[imgUrl.big]: ''
                fieldSurveyJ['bigBUrl'] = item[imgUrl.bigB] ? item[imgUrl.bigB]: ''
                fieldSurveyJ['url'] = item[imgUrl.small] ? item[imgUrl.small]: ''
                fieldSurveyJ['uid'] = `${item.fileName}${Math.random()}`
                fieldSurveyJ['status'] = 'done'
                fieldSurveyBefore.push(fieldSurveyJ)
            }
            this.setState({
                defaultFieldSurveyInfo: [fieldSurveyBefore],
            }, function () {
                console.log(this.state.defaultFieldSurveyInfo)
            })
        }

        //处理默认其他资料
        if (this.state.otherDetailsInfo[0] != "" && this.state.otherDetailsInfo[0] != undefined && this.state.otherDetailsInfo[0] != null) {
            let otherDetailsBefore = []
            for (let item of this.state.otherDetailsInfo[0]) {
                let otherDetailsJ = {}
                otherDetailsJ['bigUrl'] = item[imgUrl.big] ? item[imgUrl.big]: ''
                otherDetailsJ['bigBUrl'] = item[imgUrl.bigB] ? item[imgUrl.bigB]: ''
                otherDetailsJ['url'] = item[imgUrl.small] ? item[imgUrl.small]: ''
                otherDetailsJ['uid'] = `${item.fileName}${Math.random()}`
                otherDetailsJ['status'] = 'done'
                otherDetailsBefore.push(otherDetailsJ)
            }
            this.setState({
                defaultOtherDetailsInfo: [otherDetailsBefore],
            }, function () {
                console.log(this.state.defaultOtherDetailsInfo)
            })
        }

    }
    remove = (k) => {
        this.setState({
            loading: true
        })
        const { form } = this.props;
        // can use data-binding to get
        let productId = this.state.productIds[k] ? this.state.productIds[k].productId : ''

        request(api.productDelete,{
            id: productId
        },'post', session.get('token')) //删除产品
                .then(res => {
                    console.log(JSON.stringify(res))
                    this.setState({
                        loading: false
                    })
                    if (res.success) {
                        const keys = form.getFieldValue('keys');
                        // We need at least one passenger
                        if (keys.length === 1) {
                        return;
                        }

                        // can use data-binding to set
                        form.setFieldsValue({
                        keys: keys.filter(key => key !== k),
                        });
                    }else {
                        message.error('删除失败')
                    }
                })
                .catch(err => {
                    this.setState({loading: false})
                })
    }
    add = () => {
        const {form} = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(this.state.uuid);
        let refundWarJsonBox = this.state.refundWarJson;
        let typeArr = this.state.typeArr;
        refundWarJsonBox[this.state.refundWarJson.length] = refundWarAllJson[0];
        typeArr[this.state.typeArr.length] = typeSelectOptionArr;
        this.setState({
            uuid: this.state.uuid + 1,
            refundWarJson: refundWarJsonBox,
            typeArr,
        })
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });

    }
    LoanProductsSave = () => {
        if (!this.state.isSave){
            message.warning('请在所有文件上传完成后提交或保存!')
            return
        }
        console.log(this.state.proCategoryInfo)
        this.props.form.validateFields((err, values) => {
            if (err) return
            console.log(JSON.stringify(values))
            let LoanProductsInfoBefore = []
            for (let t = 0; t < values['keys'].length; t++) {
                let j = values['keys'][t]
                let LoanProductsInfo = {}
                let borrowerInfo = []
                for (let r = 0; r < values['emergencyKeys'][j].length; r++) {
                    borrowerInfo.push({})
                }
                for (let i in values) {
                    if (i.indexOf('_product') === -1 && i !== 'emergencyKeys') {
                        if (i === 'residentialAddressBefore') {
                            LoanProductsInfo['province'] = values['residentialAddressBefore'][j] ? values['residentialAddressBefore'][j][0] : ''
                            LoanProductsInfo['city'] = values['residentialAddressBefore'][j] ? values['residentialAddressBefore'][j][1] : ''
                            LoanProductsInfo['area'] = values['residentialAddressBefore'][j] ? values['residentialAddressBefore'][j][2] : ''
                        } else {
                            LoanProductsInfo[i] = values[i][j] !== null ? values[i][j] : ''
                            LoanProductsInfo['proName'] = values['proAll'][j] ? values['proAll'][j] : ''
                            LoanProductsInfo['pawnMaterialJson'] = this.state.pawnMaterialInfo[j] ? this.state.pawnMaterialInfo[j] : [] //抵押物资料
                            LoanProductsInfo['fieldSurveyJson'] = this.state.fieldSurveyInfo[j] ? this.state.fieldSurveyInfo[j] : [] //现场调查资料
                            LoanProductsInfo['otherDetailsJson'] = this.state.otherDetailsInfo[j] ? this.state.otherDetailsInfo[j] : [] //其他资料
                        }
                    } else {
                        if (i.indexOf(`_product${j}`) !== -1) {
                            for (let x = 0; x < values['emergencyKeys'][j].length; x++) {
                                if (i.split('_')[0] !== 'provinceCityArea') {
                                    borrowerInfo[x][i.split('_')[0]] = values[i][values['emergencyKeys'][j][x]] ? values[i][values['emergencyKeys'][j][x]] : ''
                                } else {
                                    borrowerInfo[x]['province'] = values[i][values['emergencyKeys'][j][x]] ? values[i][values['emergencyKeys'][j][x]][0] : ''
                                    borrowerInfo[x]['city'] = values[i][values['emergencyKeys'][j][x]] ? values[i][values['emergencyKeys'][j][x]][1] : ''
                                    borrowerInfo[x]['area'] = values[i][values['emergencyKeys'][j][x]] ? values[i][values['emergencyKeys'][j][x]][2] : ''
                                }
                            }
                        }
                    }
                }
                LoanProductsInfo['wereBorroweds'] = borrowerInfo
                LoanProductsInfoBefore.push(LoanProductsInfo)
            }
            console.log('all:', JSON.stringify(LoanProductsInfoBefore))
            //  this.setState({
            //     LoanProductsInfo: LoanProductsInfoBefore
            // },function(){
            //     // this.viewShowModal(); //共借人获取
            // })
            this.props.LoanProductsGet(LoanProductsInfoBefore)
            console.log('test:', LoanProductsInfoBefore)
        })
    }
    onPicturesWallChange = (event, index, style,status) => { //处理图片上传数据
        this.setState({
            isSave: false
        })
        if (status === 'uploading') return

        let customerInformation = []
        let customerInfoJ = []
        let isSaveBefore = true
        console.log(this.state)
        console.log(this.state.pawnMaterialInfo, index)
        if (style === 'pawnMaterial') {
            customerInfoJ = this.state.pawnMaterialInfo[index] ? this.state.pawnMaterialInfo[index] : []
        } else if (style === 'fieldSurvey') {
            customerInfoJ = this.state.fieldSurveyInfo[index] ? this.state.fieldSurveyInfo[index] : []
        } else if (style === 'otherDetails') {
            customerInfoJ = this.state.otherDetailsInfo[index] ? this.state.otherDetailsInfo[index] : []
        }

        for (let i in event) {
            if (event[i].response) {
                event[i].response.success ? customerInformation.push(event[i].response.data): null
                if (i == (event.length-1)) {
                    event[i].response.success ? null : message.error(event[i].response.message?event[i].response.message:'上传失败')
                }
            }
            for (let item of customerInfoJ) {
                if (item[imgUrl.small] === event[i].url) {
                    customerInformation.push(item)
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
            let newPawnMaterialInfo = this.state.pawnMaterialInfo
            newPawnMaterialInfo[index] = customerInformation
            this.setState({
                pawnMaterialInfo: newPawnMaterialInfo,
                isSave: isSaveBefore
            }, function () {
                console.log(this.state.pawnMaterialInfo)

            })
        } else if (style === 'fieldSurvey') { //--现场调查资料
            let newFieldSurveyInfo = this.state.fieldSurveyInfo
            newFieldSurveyInfo[index] = customerInformation
            this.setState({
                fieldSurveyInfo: newFieldSurveyInfo,
                isSave: isSaveBefore
            }, function () {
                console.log(this.state.fieldSurveyInfo)
            })
        } else if (style === 'otherDetails') {//--其他资料
            let newOtherDetailsInfo = this.state.otherDetailsInfo
            newOtherDetailsInfo[index] = customerInformation
            this.setState({
                otherDetailsInfo: newOtherDetailsInfo,
                isSave: isSaveBefore
            }, function () {
                console.log(this.state.otherDetailsInfo)
            })
        }

    }
    deadlineChange = (fieldName, value) => { //借款期限和服务期限联动
        this.props.form.setFieldsValue({[fieldName]: value});
    }
    deadlineUnitChange = (value, k) => {//借款期限单位和服务期限单位联动
        // 设置还款方式的值为undefined
        this.props.form.setFieldsValue({[`refundWar[${k}]`]: undefined})

        // 设置服务费收取方式为undefined
        this.props.form.setFieldsValue({[`takenMode[${k}]`]: undefined});


        let refundWarJsonBox = this.state.refundWarJson;
        refundWarJsonBox[k] = refundWarAllJson[value - 1]

        let typeArr = this.state.typeArr;
        typeArr[k] = typeSelectOptionArr;

        this.setState({
            refundWarJson: refundWarJsonBox,
            typeArr,
        })
        this.serviceDeadlineUnitChange(value,`serviceDeadlineUnit[${k}]`)
    }

    _onCheckRepaymentDetails = (kIndex) => {
        const {form, onCheckPress} = this.props;
        onCheckPress && onCheckPress(kIndex, form.getFieldsValue());
    };

    _onRefundWarChange = (value, k) => {
        this.props.form.setFieldsValue({[`takenMode[${k}]`]: undefined});
        let typeArr = this.state.typeArr;
        if (value === '4') {
            typeArr[k] = [typeSelectOptionArr[0]];
        } else {
            typeArr[k] = typeSelectOptionArr;
        }
        this.setState({typeArr});
    };

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;

        getFieldDecorator('keys', {initialValue: [0]});
        const keys = getFieldValue('keys');
        console.log(keys)
        const formItems = keys.map((k, index) => {
            console.log(k + '////')
            return (<Row key={k}>
                    <h2 className="green-title" style={{position:'relative'}}>{`借款产品${index + 1}`}
                        {index > 0 && <Icon className="product-delete-button"
                        type="delete"
                        onClick={() => this.remove(k)}/>}
                    </h2>
                    <Row className="my-card no-bot-border" style={{marginBottom: '0'}}>
                        <MyAddEmergencyContact productId={this.state.productIds[k]? this.state.productIds[k].productId : ''} ifLoanApplication={true} style="product" index={k} form={this.props.form}
                                               defaultValue={this.state.wereBorrowedsInfo[k] ? this.state.wereBorrowedsInfo[k] : []}
                                               showContents={this.state.showContents} addText="添加共借人" title="共借人"
                                               buttonText="查询征信" disabled={this.props.disabled}/>
                    </Row>
                    <Row className="my-card no-bot-border">
                        <div className="white-title">
                            <p>{this.state.ifShowPriBorrInfoBtn? '展期产品信息': '产品信息'}：</p>
                            <Divider/>
                        </div>
                        <Col md={8} sm={12}>
                            <ProductSelect fieldName={`proAll[${k}]`} proNameInfo={this.state.proNameInfo[k]}
                                           proCategoryInfo={this.state.proCategoryInfo[k]}
                                           proStyleInfo={this.state.proStyleInfo[k]} disabled={this.props.disabled}
                                           form={this.props.form} fieldText={this.state.ifShowPriBorrInfoBtn? '展期产品信息': '产品'}/>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label="业务员">
                                {getFieldDecorator(`salesman[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.salesman : ''})(
                                    <Input placeholder="请输入" disabled={this.props.disabled}/>
                                )}
                                {getFieldDecorator(`id[${k}]`, {initialValue: this.state.productIds[k] ? this.state.productIds[k].productId : ''})(
                                    <Input type="hidden"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label={this.state.ifShowPriBorrInfoBtn?'展期金额':'借款金额'}>
                                {getFieldDecorator(`lendMoney[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.lendMoney : ''})(
                                    <InputNumber placeholder="请输入" disabled={this.props.disabled}
                                                 style={{width: '80%'}}/>
                                )}
                                <span className="input-after">元</span>
                            </FormItem>
                        </Col>

                        <Col md={8} sm={12}>
                            <FormItem label={this.state.ifShowPriBorrInfoBtn?'展期期限':'借款期限'}>
                                {getFieldDecorator(`deadline[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.deadline : ''})(
                                    <InputNumber disabled={this.props.disabled} placeholder="请输入" className="half-input"
                                                 onChange={(e) => this.deadlineChange(`serviceDeadline[${k}]`, e)}/>
                                )}
                                <LoanTermUnit index={k} form={this.props.form}
                                              defaultValue={this.state.deadlineUnitInfo[k]}
                                              disabled={this.props.disabled} fieldName={`deadlineUnit[${k}]`}
                                              deadlineUnitChange={this.deadlineUnitChange.bind(this)}/>
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label={this.state.ifShowPriBorrInfoBtn?'展期利率':'借款利率'}>
                                {getFieldDecorator(`apr[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.apr : ''})(
                                    <InputNumber disabled={this.props.disabled} placeholder="请输入"
                                                 className="middle-input"/>
                                )}
                                {getFieldDecorator(`aprUnit[${k}]`, {initialValue: k == 0 && this.state.BorrowerInformation.aprUnit ? this.state.BorrowerInformation.aprUnit : '1'})(
                                    <RadioGroup disabled={this.props.disabled} className="middle-little">
                                        <Radio value={'1'}>%</Radio>
                                        <Radio value={'2'}>‰</Radio>
                                    </RadioGroup>
                                )}
                                <InterestRateType form={this.props.form} defaultValue={this.state.aprTypeInfo[k]}
                                                  fieldName={`aprType[${k}]`} disabled={this.props.disabled}/>
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label={this.state.ifShowPriBorrInfoBtn?'展期还款方式':'还款方式'}>
                                {getFieldDecorator(`refundWar[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.refundWar : undefined})(
                                    <Select
                                        disabled={this.props.disabled}
                                        placeholder="请选择"
                                        allowClear={true}
                                        onChange={(value) => this._onRefundWarChange(value, k)}
                                    >
                                        <Option value="">请选择</Option>
                                        {this.state.refundWarJson[k].map((item) =>
                                            <Option value={item.value} key={item.value}>{item.text}</Option>
                                        )}
                                    </Select>
                                )}
                            </FormItem>
                            {/* <RepaymentMethod form={this.props.form} defaultValue={this.state.refundWarInfo[k]} disabled={this.props.disabled} fieldName={`refundWar[${k}]`}/> */}
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label={this.state.ifShowPriBorrInfoBtn?'展期用途':'借款用途'}>
                                {getFieldDecorator(`purpose[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.purpose : ''})(
                                    <Input disabled={this.props.disabled} placeholder="请输入"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label={this.state.ifShowPriBorrInfoBtn?'展期居间服务费率':'居间服务费率'}>
                                {getFieldDecorator(`serviceTariffing[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.serviceTariffing : ''})(
                                    <InputNumber disabled={this.props.disabled} placeholder="请输入"
                                                 className="middle-input"/>
                                )}
                                {getFieldDecorator(`serviceUnit[${k}]`, {initialValue: k == 0 && this.state.BorrowerInformation.serviceUnit ? this.state.BorrowerInformation.serviceUnit : '1'})(
                                    <RadioGroup disabled={this.props.disabled} className="middle-little">
                                        <Radio value={'1'}>%</Radio>
                                        <Radio value={'2'}>‰</Radio>
                                    </RadioGroup>
                                )}
                                <InterestRateType form={this.props.form} defaultValue={this.state.serviceTypeInfo[k]}
                                                  fieldName={`serviceType[${k}]`} disabled={this.props.disabled}/>
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label={this.state.ifShowPriBorrInfoBtn?'展期服务期限':'服务期限'}>
                                {getFieldDecorator(`serviceDeadline[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.serviceDeadline : ''})(
                                    <InputNumber disabled={true} placeholder="请输入" className="half-input"/>
                                )}
                                <LoanTermUnit form={this.props.form}
                                              defaultValue={this.state.serviceDeadlineUnitInfo[k]}
                                              fieldName={`serviceDeadlineUnit[${k}]`} disabled={true}
                                              serviceDeadlineUnitChange={fn => {
                                                  this.serviceDeadlineUnitChange = fn;
                                              }}/>
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label={this.state.ifShowPriBorrInfoBtn?'展期居间服务费收取方式':'居间服务费收取方式'}>
                                {getFieldDecorator(`takenMode[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.takenMode : undefined})(
                                    <Select  allowClear={true} disabled={this.props.disabled} placeholder="--居间服务费收取方式--">
                                        {
                                            this.state.typeArr[k].map((item) => {
                                                const {id, label, value} = item;
                                                return (
                                                    <Option key={`typeArr_item_key_${id}`} value={value}>
                                                        {label}
                                                    </Option>
                                                )
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <div className="gray-bettw"></div>
                    <Row className="my-card no-bot-border">
                        <div className="white-title">
                            <p>{this.state.ifShowPriBorrInfoBtn? '展期综合费用': '综合费用'}：</p>
                            <Divider/>
                        </div>
                        <Col md={8} sm={12}>
                            <FormItem label={this.state.ifShowPriBorrInfoBtn? '展期中介服务费': '中介费'}>
                                {getFieldDecorator(`agencyFee[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.agencyFee : ''})(
                                    <InputNumber disabled={this.props.disabled} className="half-input"/>
                                )}
                                <span className="input-after">元</span>
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label={this.state.ifShowPriBorrInfoBtn? '展期下户服务费': '下户费'}>
                                {getFieldDecorator(`nextFee[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.nextFee : ''})(
                                    <InputNumber disabled={this.props.disabled} className="half-input"/>
                                )}
                                <span className="input-after">元</span>
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label={this.state.ifShowPriBorrInfoBtn? '展期评估服务费': '评估费'}>
                                {getFieldDecorator(`evaluationFee[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.evaluationFee : ''})(
                                    <InputNumber disabled={this.props.disabled} className="half-input"/>
                                )}
                                <span className="input-after">元</span>
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label={this.state.ifShowPriBorrInfoBtn? '展期管理服务费': '管理费'}>
                                {getFieldDecorator(`manageFee[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.manageFee : ''})(
                                    <InputNumber disabled={this.props.disabled} className="half-input"/>
                                )}
                                <span className="input-after">元</span>
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label={this.state.ifShowPriBorrInfoBtn? '展期保证金': '保证金'}>
                                {getFieldDecorator(`parkingFee[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.parkingFee : ''})(
                                    <InputNumber disabled={this.props.disabled} className="half-input"/>
                                )}
                                <span className="input-after">元</span>
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label={this.state.ifShowPriBorrInfoBtn? '展期GPS服务费': 'GPS费'}>
                                {getFieldDecorator(`gpsFee[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.gpsFee : ''})(
                                    <InputNumber disabled={this.props.disabled} className="half-input"/>
                                )}
                                <span className="input-after">元</span>
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label={this.state.ifShowPriBorrInfoBtn? '展期保险服务费': '保险费'}>
                                {getFieldDecorator(`premium[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.premium : ''})(
                                    <InputNumber disabled={this.props.disabled} className="half-input"/>
                                )}
                                <span className="input-after">元</span>
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label={this.state.ifShowPriBorrInfoBtn? '展期担保服务费': '担保费'}>
                                {getFieldDecorator(`guaranteeFee[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.guaranteeFee : ''})(
                                    <InputNumber disabled={this.props.disabled} className="half-input"/>
                                )}
                                <span className="input-after">元</span>
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label={this.state.ifShowPriBorrInfoBtn? '展期其他费用': '其他费用'}>
                                {getFieldDecorator(`otherFee[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.otherFee : ''})(
                                    <InputNumber disabled={this.props.disabled} className="half-input"/>
                                )}
                                <span className="input-after">元</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={{marginTop: "10px", marginBottom: "25px"}}>
                        <Col span={20} style={{textAlign: 'right'}}>
                            <Button
                                className="green-style"
                                onClick={() => this._onCheckRepaymentDetails(k)}
                            >
                                {this.state.ifShowPriBorrInfoBtn? '点击查看展期计划详情表': '点击查看借款计划详情表'}
                            </Button>
                        </Col>
                    </Row>
                    <div className="gray-bettw"></div>
                    <Row className="my-card  no-bot-border">
                        <div className="white-title">
                            <p>收款人：</p>
                            <Divider/>
                        </div>
                        <Col md={8} sm={12}>
                            <FormItem label="收款人">
                                {getFieldDecorator(`gatheringName[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.gatheringName : ''})(
                                    <Input disabled={this.props.disabled}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label="收款账号">
                                {getFieldDecorator(`gatheringNo[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.gatheringNo : ''})(
                                    <Input disabled={this.props.disabled}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label="开户行">
                                {getFieldDecorator(`bankName[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.bankName : ''})(
                                    <Input disabled={this.props.disabled}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="my-card  no-bot-border">
                        <div className="white-title">
                            <p>出借人：<Button
                                className="green-style"
                                style={{marginLeft:'10px'}}
                                onClick={() => this.showModal(k)}
                            >
                                选择 . . .
                            </Button></p>
                            <Divider/>
                        </div>
                        <Col md={8} sm={12}>
                            <FormItem label="出借人">
                                {getFieldDecorator(`lender[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.lender : ''})(
                                    <Input disabled={this.props.disabled} />
                                )}
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label="手机号">
                                {getFieldDecorator(`lenderPhone[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.lenderPhone : ''})(
                                    <Input disabled={this.props.disabled} />
                                )}
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label="身份证号">
                                {getFieldDecorator(`lenderIdentityCard[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.lenderIdentityCard : ''})(
                                    <Input disabled={this.props.disabled}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label="居住地址">
                                {getFieldDecorator(`residentialAddressBefore[${k}]`, {initialValue: k == 0 ? this.state.residentialAddressBefore : []})(
                                    <Cascader options={this.state.addr} placeholder='请输入'
                                              disabled={this.props.disabled}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col md={8} sm={12}>
                            <FormItem label="具体地址">
                                {getFieldDecorator(`lenderAddress[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.lenderAddress : ''})(
                                    <Input disabled={this.props.disabled}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <div className="gray-bettw"></div>
                    <Row className="my-card  no-bot-border">
                        <div className="white-title">
                            <p>客户信息描述：</p>
                            <Divider/>
                        </div>
                        <Col md={12} sm={20}>
                            <FormItem>
                                {getFieldDecorator(`remark[${k}]`, {initialValue: k == 0 ? this.state.BorrowerInformation.remark : ''})(
                                    <TextArea autosize={{minRows: 6, maxRows: 10}} disabled={this.props.disabled}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <div className="gray-bettw"></div>
                    <div className="my-card no-bot-border" style={{paddingLeft: '22px', paddingRight: '22px'}}>
                        <div className="white-title">
                            <p>抵押物资料：</p>
                            <Divider/>
                        </div>
                        <PicturesWall componentsIndex={k} componentsStyle="pawnMaterial"
                                      defaultFileList={this.state.defaultPawnMaterialInfo[k]}
                                      onPicturesWallChange={this.onPicturesWallChange.bind(this)}
                                      disabled={this.props.disabled}/>
                        <div className="white-title">
                            <p>现场调查资料：</p>
                            <Divider/>
                        </div>
                        <PicturesWall componentsIndex={k} componentsStyle="fieldSurvey"
                                      defaultFileList={this.state.defaultFieldSurveyInfo[k]}
                                      onPicturesWallChange={this.onPicturesWallChange.bind(this)}
                                      disabled={this.props.disabled}/>
                        <div className="white-title">
                            <p>其他资料：</p>
                            <Divider/>
                        </div>
                        <PicturesWall componentsIndex={k} componentsStyle="otherDetails"
                                      defaultFileList={this.state.defaultOtherDetailsInfo[k]}
                                      onPicturesWallChange={this.onPicturesWallChange.bind(this)}
                                      disabled={this.props.disabled}/>
                    </div>
                    <div className="gray-bettw"></div>
                </Row>
            )
        });
        return (<Form
                className="ant-advanced-search-form loan-application-detail-essential"
                onSubmit={this.LoanProductsSave}
            >
            <Spin spinning={this.state.loading} size="large">
                {formItems}
                {/* <div className="gray-bettw"></div> */}
                {
                    this.props.disabled ? '' :
                        <div onClick={this.add} className="full-add-style">
                            <Icon type="plus"/> 添加借款产品
                        </div>
                }
                <div className="gray-bettw"></div>
            </Spin>
            <Modal
                visible={this.state.visible}
                onCancel={this.handleCancel}
                footer={<Button key="back" onClick={this.handleCancel}>取消</Button>}
                bodyStyle={this.state.ModalBodyStyle}
                title="请选择"
                className="my-modal"
                width='60%'
            >
                            <Table bordered loading={this.state.modalLoading} rowKey="id" pagination={false}
                                   columns={this.state.columns}
                                   dataSource={this.state.fileData}/>
            </Modal>
            </Form>
        )
    }
}

const LoanProducts = Form.create()(LoanProductsForm);
export default LoanProducts
