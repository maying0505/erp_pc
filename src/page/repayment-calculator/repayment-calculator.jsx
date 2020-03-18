/*
*  @Create by John on 2018/03/19
*  @desc   还款计算机
* */
import React from 'react';
import {Row, Col, Spin, InputNumber, Radio, Card, Form, Input, Select, Button, message} from 'antd';
import api from 'common/util/api';
import {request} from 'common/request/request';
import {local, session} from 'common/util/storage';
import RepaymentCalculatorTable from 'component/CalculatorTable/CalculatorTable';
import './index.scss';

import DatePicker from 'component/DatePicker/index';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;

const RowGutter = 24;
const ColMd = 12;
const ColSm = 20;
const SColMd = 8;
const SColSm = 20;

const Format = 'YYYY-MM-DD';

const ButtonType = ['calculator', 'table'];

class RepaymentCalculatorFormItem extends React.Component {

    selectStyleArr = [
        {index: 0, label: '天', value: '1'},
        {index: 1, label: '档', value: '2'},
        {index: 2, label: '周', value: '3'},
        {index: 3, label: '月', value: '4'}
    ];

    selectWayArr = [
        {
            index: 0,
            type: '天',
            wayArr: [
                {index: 3, label: '先息后本（一次付息到期还本）', value: '4'},
                {index: 4, label: '先息后本（按期付息到期还本）', value: '5'},
            ]
        },
        {
            index: 1,
            type: '档',
            wayArr: [
                {index: 3, label: '先息后本（一次付息到期还本）', value: '4'},
                {index: 4, label: '先息后本（按期付息到期还本）', value: '5'},
            ]
        },
        {
            index: 2,
            type: '周',
            wayArr: [
                {index: 2, label: '等本等息', value: '3'},
                {index: 3, label: '先息后本（一次付息到期还本）', value: '4'},
                {index: 4, label: '先息后本（按期付息到期还本）', value: '5'},
            ]
        },
        {
            index: 3,
            type: '月',
            wayArr: [
                {index: 0, label: '等额本息', value: '1'},
                {index: 1, label: '等额本金', value: '2'},
                {index: 2, label: '等本等息', value: '3'},
                {index: 3, label: '先息后本（一次付息到期还本）', value: '4'},
                {index: 4, label: '先息后本（按期付息到期还本）', value: '5'},
            ]
        }
    ];

    typeSelectOptionArr = [
        {id: 0, value: '1', label: '一次性收取'},
        {id: 1, value: '2', label: '按期收取'},
    ];


    state = {
        lendingRateSelectDisabled: false,
        isLoading: false,
        selectStyle: this.selectStyleArr[0].index,
        selectWay: this.selectWayArr[0].wayArr,
        typeArr: this.typeSelectOptionArr,
    };

    _validatorNumberString = (rule, value, callback) => {
        const reg = /^\d+(?=\.{0,1}\d+$|$)/;
        if (value && !reg.test(value)) {
            // 错误的时候回调并带入错误信息
            callback('请输入数字');
        } else {
            callback();
        }
    };

    _onInputAndRadioChange = (fieldName, e) => {
        this.props.form.setFieldsValue({[fieldName]: e.target.value});
    };

    _onSelectChange = (self, fieldName, value) => {
        // 与服务期限保持同步
        this.props.form.setFieldsValue({[fieldName]: value});

        // 设置还款方式的值为undefined
        this.props.form.setFieldsValue({'way': undefined});

        // 设置服务费收取方式为undefined
        this.props.form.setFieldsValue({'type': undefined});

        // 修改对应单位的Option
        const index = Number(value) - 1;
        this.setState({selectWay: this.selectWayArr[index].wayArr, typeArr: this.typeSelectOptionArr});
    };

    _onWaySelectValueChange = (value) => {
        this.props.form.setFieldsValue({'type': undefined});
        let typeArr = [];
        if (value === '4') {
            typeArr.push(this.typeSelectOptionArr[0]);
        } else {
            typeArr = this.typeSelectOptionArr;
        }
        this.setState({typeArr});
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Row>
                <Col md={ColMd} sm={ColSm}>
                    <FormItem label='借款金额'>
                        <InputGroup size='default'>
                            {
                                getFieldDecorator('invest', {
                                    rules: [
                                        {required: true, message: '*必填'},
                                        {validator: this._validatorNumberString}
                                    ]
                                })(
                                    <Input addonAfter='元' placeholder="请输入"/>
                                )
                            }
                        </InputGroup>
                    </FormItem>
                </Col>
                <Col md={ColMd} sm={ColSm}>
                    <FormItem label='借款期限'>
                        <InputGroup size='default'>
                            {
                                getFieldDecorator('totalGrade', {
                                    rules: [
                                        {required: true, message: '*必填'},
                                        {validator: this._validatorNumberString}
                                    ]
                                })(
                                    <Input
                                        onChange={(e) => this._onInputAndRadioChange('servicePeriod', e)}
                                        className='repayment-width-2'
                                        placeholder='请输入'
                                    />
                                )
                            }
                            {
                                getFieldDecorator('style', {
                                    rules: [
                                        {required: true, message: '*必填'}
                                    ],
                                    initialValue: '1',
                                })(
                                    <Select
                                        className='repayment-width-1'
                                        onChange={(value) => this._onSelectChange('style', 'servicePeriodSelectValue', value)}
                                    >
                                        {
                                            this.selectStyleArr.map((item) => {
                                                const {index, label, value} = item;
                                                return (
                                                    <Option
                                                        key={`selectStyleArr_${index}`}
                                                        value={value}>{label}</Option
                                                    >
                                                )
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </InputGroup>
                    </FormItem>
                </Col>
                <Col md={ColMd} sm={ColSm}>
                    <FormItem label='借款利率'>
                        <InputGroup size='default'>
                            {
                                getFieldDecorator('lendingRate', {
                                    rules: [
                                        {required: true, message: '*必填'},
                                        {validator: this._validatorNumberString}
                                    ]
                                })(
                                    <Input style={{width: '30%', marginRight: '8px'}} placeholder='请输入'/>
                                )
                            }
                            {
                                getFieldDecorator('lendingRateRadioValue', {
                                    rules: [{required: true, message: '*必填'}],
                                    initialValue: 1,
                                })(
                                    <RadioGroup
                                        onChange={(e) => this._onInputAndRadioChange('totalGradeRadioType', e)}
                                    >
                                        <Radio value={1}>%</Radio>
                                        <Radio value={2}>‰</Radio>
                                    </RadioGroup>
                                )
                            }
                            {
                                getFieldDecorator('lendingRateSelectValue', {
                                    rules: [{required: true, message: '*必填'}],
                                    initialValue: '1',
                                })(
                                    <Select
                                        disabled={this.state.lendingRateSelectDisabled}
                                    >
                                        <Option value="1">日利率</Option>
                                        <Option value="2">月利率</Option>
                                        <Option value="3">年利率</Option>
                                    </Select>
                                )
                            }
                        </InputGroup>
                    </FormItem>
                </Col>
                <Col md={ColMd} sm={ColSm}>
                    <FormItem label='还款方式'>
                        <InputGroup size='default'>
                            {
                                getFieldDecorator('way', {
                                    rules: [
                                        {required: true, message: '*必填'}
                                    ],
                                })(
                                    <Select
                                        placeholder='--请选择还款方式--'
                                        style={{width: '100%'}}
                                        allowClear={true}
                                        onChange={this._onWaySelectValueChange}
                                    >
                                        {
                                            this.state.selectWay.map((item) => {
                                                const {index, label, value} = item;
                                                return (
                                                    <Option key={`selectWayArr_${index}`} value={value}>
                                                        {label}
                                                    </Option
                                                    >
                                                )
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </InputGroup>
                    </FormItem>
                </Col>
                <Col md={ColMd} sm={ColSm}>
                    <FormItem label='服务费率'>
                        <InputGroup size='default'>
                            {
                                getFieldDecorator('serviceRate', {
                                    rules: [
                                        {required: true, message: '*必填'},
                                        {validator: this._validatorNumberString}
                                    ]
                                })(
                                    <Input style={{width: '30%', marginRight: '8px',}} placeholder='请输入'/>
                                )
                            }
                            {
                                getFieldDecorator('serviceRateRadioValue', {
                                    rules: [
                                        {required: true, message: '*必填'},
                                    ],
                                    initialValue: 1,
                                })(
                                    <RadioGroup
                                        onChange={(e) => this._onInputAndRadioChange('totalGradeRadioType', e)}
                                    >
                                        <Radio value={1}>%</Radio>
                                        <Radio value={2}>‰</Radio>
                                    </RadioGroup>
                                )
                            }
                            {
                                getFieldDecorator('serviceRateSelectValue', {
                                    rules: [{required: true, message: '*必填'}],
                                    initialValue: '1',
                                })(
                                    <Select
                                        disabled={this.state.lendingRateSelectDisabled}
                                    >
                                        <Option value="1">日利率</Option>
                                        <Option value="2">月利率</Option>
                                        <Option value="3">年利率</Option>
                                    </Select>
                                )
                            }
                        </InputGroup>
                    </FormItem>
                </Col>
                <Col md={ColMd} sm={ColSm}>
                    <FormItem label='服务期限' style={{paddingLeft: '10.08px'}}>
                        <InputGroup size='default'>
                            {
                                getFieldDecorator('servicePeriod', {
                                    rules: [
                                        {required: false, message: '*必填'},
                                        {validator: this._validatorNumberString}
                                    ]
                                })(
                                    <Input disabled={true} className='repayment-width-2' placeholder='请输入'/>
                                )
                            }
                            {
                                getFieldDecorator('servicePeriodSelectValue', {
                                    rules: [{required: true, message: '*必填'}],
                                    initialValue: '1',
                                })(
                                    <Select disabled={true} className='repayment-width-1'>
                                        <Option value="1">天</Option>
                                        <Option value="2">档</Option>
                                        <Option value="3">周</Option>
                                        <Option value="4">月</Option>
                                    </Select>
                                )
                            }
                        </InputGroup>
                    </FormItem>
                </Col>
                <Col md={ColMd} sm={ColSm}>
                    <FormItem label='服务费收取方式'>
                        <InputGroup size='default'>
                            {
                                getFieldDecorator('type', {
                                    rules: [
                                        {required: true, message: '*必填'},
                                    ]
                                })(
                                    <Select
                                        placeholder='--请选择服务费收取方式--'
                                        style={{width: '100%'}}
                                        allowClear={true}
                                    >
                                        {
                                            this.state.typeArr.map(item => {
                                                const {value, label, id} = item;
                                                return (
                                                    <Option key={`typeSelectOptionArr_key_${id}`} value={value}>
                                                        {label}
                                                    </Option>
                                                )
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </InputGroup>
                    </FormItem>
                </Col>
                <Col md={ColMd} sm={ColSm}>
                    <DatePicker
                        label='起息日'
                        form={this.props.form}
                        fieldName='date'
                        defaultValue={moment().format(Format)}
                    />
                </Col>
            </Row>
        );
    }
}

class RepaymentCalculatorFormService extends React.Component {


    _onInputNumberChange = (value) => {
    };

    render() {
        const {itemArr, form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Row align='center'>
                {
                    itemArr.map((item, index) => {
                        const {labelTxt, fieldName} = item;
                        return (
                            <Col md={SColMd} sm={SColSm} key={`rcItem_key_${index}`}>
                                <FormItem label={labelTxt}>
                                    <InputGroup size='default'>
                                        {
                                            getFieldDecorator(fieldName, {initialValue: 0})(
                                                <InputNumber
                                                    min={0}
                                                    step={1}
                                                    style={{width: '70%'}}
                                                    onChange={this._onInputNumberChange}
                                                />
                                            )
                                        }
                                        <span>元</span>
                                    </InputGroup>
                                </FormItem>
                            </Col>
                        )
                    })
                }
            </Row>
        )
    }
}

class RepaymentCalculator extends React.Component {

    state = {
        isLoading: false,
        fieldsValue: null,
        totalFee: null,
        tableDataSource: [],
        formLastObj: null,
    };

    serviceItem = [
        {index: 0, labelTxt: '中介费', fieldName: 'agencyFee'},
        {index: 1, labelTxt: '下户费', fieldName: 'householdFee'},
        {index: 2, labelTxt: '评估费', fieldName: 'assessmentFee'},
        {index: 3, labelTxt: '管理费', fieldName: 'managementFee'},
        {index: 4, labelTxt: '保证金', fieldName: 'parkingFee'},
        {index: 5, labelTxt: 'GPS费', fieldName: 'gpsFee'},
        {index: 6, labelTxt: '保险费', fieldName: 'insuranceFee'},
        {index: 7, labelTxt: '担保费', fieldName: 'securityFee'},
        {index: 8, labelTxt: '其他费', fieldName: 'otherFee'},
    ];

    _onFormSubmit = (buttonType) => {
        this.setState({tableDataSource: []});
        const {getFieldsValue} = this.props.form;
        const fieldsValue = getFieldsValue();
        const keysArr = Object.keys(fieldsValue);
        const feeItem = keysArr.filter(item => item.indexOf('Fee') > -1);
        const othersItem = keysArr.filter(item => item.indexOf('Fee') < 0);
        let sum = 0;
        if (feeItem.length > 0) {
            for (let index in feeItem) {
                const key = feeItem[index];
                if (fieldsValue[key] !== '' && fieldsValue[key] !== undefined) {
                    sum += Number(fieldsValue[key]);
                } else {
                    message.warn('综合费用有误');
                    return;
                }
            }
        }

        fieldsValue.date = moment(fieldsValue.date).format(Format);

        this.setState({formLastObj: fieldsValue});

        const params = {};
        for (let index in othersItem) {
            const key = othersItem[index];
            params[key] = fieldsValue[key];
        }
        params.service = sum;
        if (params.lendingRateRadioValue === 2) {
            // 把借款利率千分比转为百分比
            params.lendingRate = params.lendingRate / 10;
        }
        if (params.serviceRateRadioValue === 2) {
            // 把服务费率千分比转为百分比
            params.serviceRate = params.serviceRate / 10;
        }
        if (params.style === '4') {
            // 借款单位是月，则把借款利率转为年利率
            if (params.lendingRateSelectValue === '1') {
                // 把日利率转为年利率
                params.lendingRate = params.lendingRate * 360;
            }
            if (params.lendingRateSelectValue === '2') {
                // 把月利率转为年利率
                params.lendingRate = params.lendingRate * 12;

            }
        } else if ('123'.indexOf(params.style) > -1) {
            // 借款单位是 天、周、档，把借款利率转为日利率
            if (params.lendingRateSelectValue === '2') {
                // 把月利率转为日利率
                params.lendingRate = params.lendingRate / 30;
            }
            if (params.lendingRateSelectValue === '3') {
                // 把年利率转为日利率
                params.lendingRate = params.lendingRate / 360;
            }
        }

        // 把服务费率转换为天利率
        if (params.serviceRateSelectValue === '2') {
            // 把月利率转换为天利率
            params.serviceRate = params.serviceRate / 30;
        } else if (params.serviceRateSelectValue === '3') {
            // 把年利率转换为天利率
            params.serviceRate = params.serviceRate / 360;
        }

        // 把百分数转为小数
        params.lendingRate = params.lendingRate / 100;
        params.serviceRate = params.serviceRate / 100;

        // 添加借款利率类型（'1'for 日利率，'2' for 月利率，'3'for '年利率）
        params.aprType = params.lendingRateSelectValue;

        params.date = moment(params.date).format(Format);

        this.setState({isLoading: true});

        if (buttonType === ButtonType[0]) {
            this._request(params);
        } else if (buttonType === ButtonType[1]) {
            this._requestTable(params);
        }

    };

    _request = (params) => {
        request(api.repaymentCalculator, params, 'post', session.get('token'))
            .then(res => {
                if (res.success) {
                    if (res.data && res.data.length > 0) {
                        let newArr = [];
                        for (let i = 0; i < res.data.length; i++) {
                            newArr.push({id: i, ...res.data[i]});
                        }
                        this.setState(preState => ({
                            tableDataSource: newArr,
                            isLoading: false,
                        }));
                    } else {
                        message.warn('没有返回数据');
                    }
                } else {
                    message.warn('请求失败');
                }
            })
            .catch(err => {
                message.error('请求服务异常');
                this.setState({tableDataSource: [], isLoading: false});
            });
    };

    _requestTable = (params) => {
        request(api.loansRepaymentProduce, params, 'post', session.get('token'))
            .then(res => {
                this.setState({isLoading: false});
                if (res.success && res.data) {
                    //window.open(res.data);
                    this._createIFrame({downloadUrl: res.data});
                } else {
                    message.warn('下载失败');
                }
            })
            .catch(err => {
                message.error('请求服务异常');
                this.setState({isLoading: false});
            });
    };

    _createIFrame = (item, triggerDelay = 100, removeDelay = 1000) => {
        setTimeout(() => {
            const iFrame = document.createElement('iframe');
            iFrame.style.display = 'none';
            iFrame.src = item.downloadUrl;
            document.body.appendChild(iFrame);
            setTimeout(() => {
                document.body.removeChild(iFrame);
            }, removeDelay);
        }, triggerDelay);
    };

    _setChildComponentValue = (stateName, stateValue) => {
        this.setState({[stateName]: stateValue});
    };

    _otherIsPass = () => {
        const {getFieldsValue} = this.props.form;
        const fieldsValue = getFieldsValue();

        if (fieldsValue.date) {
            fieldsValue.date = moment(fieldsValue.date).format(Format);
        }

        const keysArr = Object.keys(fieldsValue);
        const othersItem = keysArr.filter(item => item.indexOf('Fee') < 0);
        let isValidate = true;
        let isFieldsValuesChange = false;

        if (othersItem.length > 0) {
            for (let index in othersItem) {
                const key = othersItem[index];
                const item = fieldsValue[key];
                isValidate = isValidate && item;
            }
        } else {
            isValidate = false;
        }
        for (let index in keysArr) {
            const key = keysArr[index];
            const item = fieldsValue[key];
            if (this.state.formLastObj) {
                if (this.state.formLastObj[key] !== item) {
                    isFieldsValuesChange = true;
                    break;
                }
            }
        }
        return {isValidate, isFieldsValuesChange};
    };

    render() {
        const {isValidate: isPass, isFieldsValuesChange} = this._otherIsPass();
        const tableDataSource = isFieldsValuesChange ? [] : this.state.tableDataSource;

        return (
            <div className="table-list">
                <Spin size="large" spinning={this.state.isLoading}>
                    <Card bordered={false}>
                        <h1>还款计算器</h1>
                        <Form className='ant-form-my' layout='inline'>
                            <h2>产品信息</h2>
                            <RepaymentCalculatorFormItem
                                form={this.props.form}
                                setComponentValue={this._setChildComponentValue}
                            />
                            <h2>综合费用</h2>
                            <RepaymentCalculatorFormService
                                form={this.props.form}
                                itemArr={this.serviceItem}
                                setComponentValue={this._setChildComponentValue}
                            />
                            <Row type='flex' justify='end' className='repayment-submit'>
                                <Col style={{marginRight: '20px'}}>
                                    <Button
                                        type={isPass ? 'primary' : 'dashed'}
                                        onClick={isPass ? () => this._onFormSubmit(ButtonType[1]) : null}
                                    >
                                        下载还款表
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        type={isPass ? 'primary' : 'dashed'}
                                        onClick={isPass ? () => this._onFormSubmit(ButtonType[0]) : null}
                                    >
                                        计算
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Spin>
                {
                    tableDataSource.length > 0 &&
                    <div style={{marginBottom: '40px'}}>
                        <RepaymentCalculatorTable
                            dataSource={tableDataSource}
                        />
                    </div>
                }
            </div>

        );
    }
}

const RepaymentCalculatorExport = Form.create()(RepaymentCalculator);
export default RepaymentCalculatorExport;
