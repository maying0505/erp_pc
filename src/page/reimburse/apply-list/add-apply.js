import React from 'react';
import './index.scss';
import {Col, Row, Form, Select, Button, message, Spin} from 'antd';
import {MyTitle, MyButton, ApprovalHistory} from '../components';
import {ApplyListAsset as ass} from '../assets';
import {request} from 'common/request/request';
import {session} from 'common/util/storage';
import api from 'common/util/api';
import {ColConfig} from '../config';

import InputTextItem from 'component/InputTextItem';
import InputNumberItem from 'component/inputItem';
import InputTextAreaItem from 'component/InputTextAreaItem';
import ImgUpload from 'component/img-upload';
import MyDatePicker from 'component/DatePicker';
import CloneDeep from 'lodash.clonedeep';
import IsEqual from 'lodash.isequal';
import imgUrl from 'common/util/imgUrl'
import moment from 'moment';
import LodashDebounce from '../../../common/util/debounce';
import {FileUpload} from '../../approval/components';
import uuidv1 from 'uuid/v1';

const MomentFormat = 'YYYY-MM-DD HH:mm:ss';
const TabArr = ['detailInfo', 'verifyInfo', 'downLoad'];
const SelectTab = TabArr[0];
const Option = Select.Option;
const FormItem = Form.Item;

const BaseInfo = () => (
    [
        {
            id: 0,
            label: '申请人',
            fieldName: 'name',
            disabled: true,
            initialValue: session.get('userName'),
        },
        {
            id: 1,
            label: '所属机构',
            fieldName: 'companyName',
            disabled: true,
            initialValue: session.get('companyName'),
        },
        {
            id: 2,
            label: '所属部门',
            fieldName: 'deptName',
            disabled: true,
            initialValue: session.get('officeName'),
        },
        {
            id: 3,
            label: '申请时间',
            fieldName: 'createDate',
            disabled: true,
            initialValue: '----',
        },
        {
            id: 4,
            label: '报销类型',
            fieldName: 'type',
            disabled: false,
            isRequired: true,
            initialValue: undefined,
        },
    ]
);

// 费用报销
const ReimbursementArr = () => (
    [
        {
            id: 0,
            label: '报销事由',
            fieldName: 'cause',
            type: 'text',
            disabled: false,
            isRequired: true,
            initialValue: undefined
        },
        {
            id: 1,
            label: '报销总额（元）',
            fieldName: 'money',
            type: 'number',
            disabled: false,
            isRequired: true,
            initialValue: undefined
        },
        {
            id: 2,
            label: '交通费',
            fieldName: 'transportationFee',
            type: 'number',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 3,
            label: '住宿费',
            fieldName: 'accommodationFee',
            type: 'number',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 4,
            label: '餐饮费',
            fieldName: 'diningFee',
            type: 'number',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 5,
            label: '招待费',
            fieldName: 'feteFee',
            type: 'number',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 6,
            label: '其他费用',
            fieldName: 'otherFee',
            type: 'number',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 8,
            label: '收款人',
            fieldName: 'payee',
            type: 'text',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 9,
            label: '开户行',
            fieldName: 'bank',
            type: 'text',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 10,
            label: '银行账户',
            fieldName: 'bankAccount',
            type: 'text',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 7,
            label: '费用说明',
            fieldName: 'feeExplanation',
            type: 'textArea',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
    ]
);

// 付款申请
const PaymentApplyArr = () => (
    [
        {
            id: 0,
            label: '付款事由',
            fieldName: 'cause',
            type: 'text',
            disabled: false,
            isRequired: true,
            initialValue: undefined
        },
        {
            id: 1,
            label: '付款总额（元）',
            fieldName: 'money',
            type: 'number',
            disabled: false,
            isRequired: true,
            initialValue: undefined
        },
        {
            id: 3,
            label: '付款日期',
            fieldName: 'payDate',
            type: 'date',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 4,
            label: '收款人',
            fieldName: 'payee',
            type: 'text',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 5,
            label: '开户行',
            fieldName: 'bank',
            type: 'text',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 6,
            label: '银行账户',
            fieldName: 'bankAccount',
            type: 'text',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 7,
            label: '费用说明',
            fieldName: 'feeExplanation',
            type: 'textArea',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
    ]
);

// 财务借支
const FinancialBorrowingArr = () => (
    [
        {
            id: 0,
            label: '借支事由',
            fieldName: 'cause',
            type: 'text',
            disabled: false,
            isRequired: true,
            initialValue: undefined
        },
        {
            id: 1,
            label: '借支总额（元）',
            fieldName: 'money',
            type: 'number',
            disabled: false,
            isRequired: true,
            initialValue: undefined
        },
        {
            id: 2,
            label: '收款人',
            fieldName: 'payee',
            type: 'text',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 3,
            label: '开户行',
            fieldName: 'bank',
            type: 'text',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 4,
            label: '银行账户',
            fieldName: 'bankAccount',
            type: 'text',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
    ]
);

// 备用金申请
const ReserveApplyArr = () => (
    [
        {
            id: 0,
            label: '申请事由',
            fieldName: 'cause',
            type: 'text',
            disabled: false,
            isRequired: true,
            initialValue: undefined
        },
        {
            id: 1,
            label: '申请总额（元）',
            fieldName: 'money',
            type: 'number',
            disabled: false,
            isRequired: true,
            initialValue: undefined
        },
        {
            id: 2,
            label: '收款人',
            fieldName: 'payee',
            type: 'text',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 3,
            label: '开户行',
            fieldName: 'bank',
            type: 'text',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 4,
            label: '银行账户',
            fieldName: 'bankAccount',
            type: 'text',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
    ]
);

// 申请资料
const ApplyMaterialArr = () => ([
        {
            id: 0,
            label: '图片',
            fieldName: 'reimInfo',
            type: 'image',
            disabled: false,
            isDelete: true,
            isRequired: false,
            initialValue: [],
        },
        {
            id: 1,
            label: '附件',
            fieldName: 'file',
            type: 'fileUpload',
            disabled: false,
            isDelete: true,
            isRequired: false,
            initialValue: [],
        },
        {
            id: 2,
            label: '备注',
            fieldName: 'remarks',
            type: 'textArea',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        }
    ]
);

// 审核
const VerifyArr = () => (
    [
        {
            id: 0,
            label: '审核意见',
            fieldName: 'comment',
            type: 'textArea',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 1,
            label: '审核结果',
            fieldName: 'audit',
            type: 'select',
            optionArr: [
                {id: 0, label: '通过', value: 'pass'},
                {id: 1, label: '拒绝', value: 'reject'},
            ],
            disabled: false,
            isRequired: true,
            initialValue: undefined
        },
        {
            id: 2,
            label: '相关资料',
            fieldName: 'relevantInfo',
            type: 'image',
            disabled: false,
            isDelete: true,
            isRequired: false,
            initialValue: [],
        },
        {
            id: 3,
            label: '附件',
            fieldName: 'file',
            type: 'fileUpload',
            disabled: false,
            isDelete: true,
            isRequired: false,
            initialValue: [],
        },
    ]
);

// 收放款
const LoanArr = () => (
    [
        {
            id: 0,
            label: '放款/收款',
            fieldName: 'loanType',
            type: 'select',
            optionArr: [
                {id: 0, label: '放款', value: '1'},
                {id: 1, label: '收款', value: '2'},
            ],
            disabled: false,
            isRequired: true,
            initialValue: undefined
        },
        {
            id: 1,
            label: '金额（元）',
            fieldName: 'loanMoney',
            type: 'number',
            disabled: false,
            isRequired: true,
            initialValue: undefined,
        },
        {
            id: 4,
            label: '日期',
            fieldName: 'loanDate',
            type: 'date',
            disabled: false,
            isRequired: true,
            initialValue: undefined,
        },
        {
            id: 2,
            label: '相关资料',
            fieldName: 'relevantInfo',
            type: 'image',
            disabled: false,
            isDelete: true,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 3,
            label: '备注',
            fieldName: 'remarks',
            type: 'textArea',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
    ]
);

// 相关资料显示的list
const RelatedMaterialArr = () => (
    [
        {
            id: 0,
            label: '相关资料',
            fieldName: 'relevantInfo',
            type: 'image',
            disabled: false,
            isDelete: true,
            isRequired: false,
            initialValue: [],
        },
        {
            id: 1,
            label: '附件',
            fieldName: 'file',
            type: 'fileUpload',
            disabled: false,
            isDelete: true,
            isRequired: false,
            initialValue: [],
        },
    ]
);

// 财务借支待还款阶段
const FinancialBorrowing = () => (
    [
        {
            id: 0,
            label: '多退少补',
            fieldName: 'moreRetreat',
            type: 'select',
            optionArr: [
                {id: 0, label: '退还', value: '1'},
                {id: 1, label: '补差', value: '2'},
            ],
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 1,
            label: '退/补金额（元）',
            fieldName: 'moreRetreatMoney',
            type: 'number',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 2,
            label: '报销总额（元）',
            fieldName: 'realMoney',
            type: 'number',
            disabled: true,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 3,
            label: '交通费（元）',
            fieldName: 'transportationFee',
            type: 'number',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 4,
            label: '住宿费（元）',
            fieldName: 'accommodationFee',
            type: 'number',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 5,
            label: '餐饮费（元）',
            fieldName: 'diningFee',
            type: 'number',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 6,
            label: '招待费（元）',
            fieldName: 'feteFee',
            type: 'number',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 7,
            label: '其他费用（元）',
            fieldName: 'otherFee',
            type: 'number',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
        {
            id: 8,
            label: '费用说明',
            fieldName: 'feeExplanation',
            type: 'textArea',
            disabled: false,
            isRequired: false,
            initialValue: undefined
        },
    ]
);

// 回传资料list
const ReturnMaterialArr = () => (
    [
        {
            id: 0,
            label: '回传资料',
            fieldName: 'relevantInfo',
            type: 'image',
            disabled: false,
            isDelete: true,
            isRequired: false,
            initialValue: [],
            imageValue: [],
        }
    ]
);

// 报销类型
const TypeArr = [
    {id: 0, label: '费用报销', value: '费用报销', itemArr: ReimbursementArr},
    {id: 1, label: '付款申请', value: '付款申请', itemArr: PaymentApplyArr},
    {id: 2, label: '财务借支', value: '财务借支', itemArr: FinancialBorrowingArr},
    {id: 3, label: '备用金申请', value: '备用金申请', itemArr: ReserveApplyArr},
];


// 报销状态
const ReimburseState = [
    {id: 0, label: '待提交', value: 'init'},
    {id: 1, label: '审核中', value: 'ing'},
    {id: 2, label: '已退回', value: 'reject'},
    {id: 3, label: '已完成', value: 'pass'},
    {id: 4, label: '待放款', value: 'loan'},
    {id: 5, label: '待还款', value: 'aloan'},
];


// 按钮操作类型
const PageType = [
    {id: 0, label: '新增申请', value: 'add'},
    {id: 1, label: '我申请的', value: 'apply'},
    {id: 2, label: '待我审核', value: 'verify'},
    {id: 3, label: '我已审核', value: 'verified'},
    {id: 4, label: '报销信息', value: 'exportList'},
];


// 按钮具体操作
const OperationType = [
    {id: 0, label: '保存', value: 'save'},
    {id: 1, label: '提交', value: 'submit'},

    {id: 2, label: '编辑', value: 'edit'},
    {id: 3, label: '查看', value: 'detail'},

    {id: 4, label: '审核', value: 'verify'},
];

class BaseInfoComponent extends React.Component {
    render() {
        const {itemArr, form, onSelect} = this.props;
        return (
            <Row gutter={16}>
                {
                    itemArr.map(item => {
                        const {id, label, fieldName, disabled, initialValue, isRequired} = item;
                        switch (id) {
                            case 0:
                            case 1:
                            case 2:
                            case 3: {
                                return (
                                    <Col {...ColConfig} key={`${label}_${id}`}>
                                        <InputTextItem
                                            form={form}
                                            label={label}
                                            isRequired={false}
                                            placeholder={`--请输入${label}--`}
                                            disabled={disabled}
                                            fieldName={fieldName}
                                            initialValue={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case 4 : {
                                return (
                                    <Col {...ColConfig} key={`${label}_${id}`}>
                                        <FormItem label={label}>
                                            {
                                                form.getFieldDecorator(fieldName, {
                                                    initialValue: initialValue,
                                                    rules: [
                                                        {required: isRequired, message: '*必填'}
                                                    ]
                                                })(
                                                    <Select
                                                        disabled={disabled}
                                                        allowClear={true}
                                                        placeholder={`--请选择${label}--`}
                                                        style={{width: '100%'}}
                                                        onSelect={onSelect}
                                                    >
                                                        {
                                                            TypeArr.map(i => {
                                                                return (
                                                                    <Option
                                                                        key={`${label}_${i.id}`}
                                                                        value={i.value}
                                                                    >
                                                                        {i.label}
                                                                    </Option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                )
                            }
                        }
                    })
                }
            </Row>
        )
    }
}

class RenderComponent extends React.Component {

    state = {
        tag: true,
    };

    render() {
        const {itemArr, form, onPictureChange, onSelect, onChange, pageType, operationType, businessId} = this.props;
        const {getFieldDecorator} = form;
        console.log('RenderComponent this.props', this.props);
        const bIdAndBType = function (_this) {
            if (pageType === 'add' || operationType === 'save' || operationType === 'edit' || operationType === 'submit') {
                return {businessId: businessId, businessType: 'inst'};
            } else if (pageType === 'verify') {
                return {businessId: businessId, businessType: 'task'};
            } else {
                return {businessId: null, businessType: null};
            }
        }(this);
        return (
            <Row gutter={16}>
                {
                    itemArr.map(item => {
                        const {id, label, fieldName, type, disabled, isRequired, initialValue, isDelete, optionArr} = item;
                        switch (type) {
                            case 'text': {
                                return (
                                    <Col {...ColConfig} key={`${label}_${id}`}>
                                        <InputTextItem
                                            form={form}
                                            label={label}
                                            isRequired={isRequired}
                                            placeholder={`--请输入${label}--`}
                                            disabled={disabled}
                                            fieldName={fieldName}
                                            initialValue={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case 'number' : {
                                return (
                                    <Col {...ColConfig} key={`${label}_${id}`}>
                                        <InputNumberItem
                                            form={form}
                                            label={label}
                                            isRequired={isRequired}
                                            placeholder={`--请输入${label}--`}
                                            disabled={disabled}
                                            fieldName={fieldName}
                                            initialValue={initialValue}
                                            display='block'
                                            marginBottom='0'
                                            onChange={onChange ? (val) => onChange({val, fieldName}) : null}
                                        />
                                    </Col>
                                )
                            }
                            case 'textArea' : {
                                return (
                                    <Col {...ColConfig} key={`${label}_${id}`}>
                                        <InputTextAreaItem
                                            form={form}
                                            label={label}
                                            isRequired={isRequired}
                                            placeholder={`--请输入${label}--`}
                                            disabled={disabled}
                                            fieldName={fieldName}
                                            initialValue={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case 'image': {
                                return (
                                    <Col {...ColConfig} md={24} key={`${label}_${id}`}>
                                        <FormItem label={label}>
                                            <ImgUpload
                                                defaultFileList={initialValue}
                                                onPicturesWallChange={(fileList, index, style, status) => onPictureChange({
                                                    fileList,
                                                    index,
                                                    style,
                                                    status,
                                                    fieldName,
                                                })}
                                                disabled={disabled}
                                                isDelete={isDelete}
                                            />
                                        </FormItem>
                                    </Col>
                                )
                            }
                            case 'fileUpload': {
                                return (
                                    <Col {...ColConfig} md={24} key={`${label}_${id}`}>
                                        <FormItem label={label}>
                                            <FileUpload
                                                defaultFileList={initialValue}
                                                disabled={disabled}
                                                isDelete={!disabled}
                                                fileType='file'
                                                form={form}
                                                fileName={fieldName}
                                                businessId={bIdAndBType.businessId}
                                                businessType={bIdAndBType.businessType}
                                                action={api.uploadFileStream}
                                            />
                                        </FormItem>
                                    </Col>
                                )
                            }
                            case 'date': {
                                return (
                                    <Col {...ColConfig} key={`${label}_${id}`}>
                                        <MyDatePicker
                                            form={form}
                                            label={label}
                                            disabled={disabled}
                                            isRequired={isRequired}
                                            fieldName={fieldName}
                                            defaultValue={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case 'select': {
                                return (
                                    <Col {...ColConfig} key={`${label}_${id}`}>
                                        <FormItem label={label}>
                                            {
                                                getFieldDecorator(fieldName, {
                                                    rules: [
                                                        {required: isRequired, message: '*必填'}
                                                    ],
                                                    initialValue: initialValue,
                                                })(
                                                    <Select
                                                        disabled={disabled}
                                                        allowClear={true}
                                                        placeholder={`--请选择${label}--`}
                                                        style={{width: '100%'}}
                                                        onSelect={(value, option) => onSelect({
                                                            value,
                                                            option,
                                                            fieldName,
                                                        })}
                                                    >
                                                        {
                                                            optionArr.map(i => {
                                                                return (
                                                                    <Option
                                                                        key={`${label}_${i.id}`}
                                                                        value={i.value}
                                                                    >
                                                                        {i.label}
                                                                    </Option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                )
                            }
                        }
                    })
                }
            </Row>
        )
    }
}

class TabComponent extends React.Component {

    state = {
        selectedTab: SelectTab,
        userId: null,
    };

    _onPress = (selectedTab) => {
        const {onTabSelect, onDownPress} = this.props;
        if (selectedTab !== TabArr[2]) {
            this.setState({selectedTab});
            onTabSelect(selectedTab);
        } else {
            onDownPress(selectedTab);
        }
    };

    render() {
        const {reimburseState, userId, loanType, pageType} = this.props;
        const {selectedTab} = this.state;
        console.log('userId', userId);
        console.log('session userId', session.get('userId'));
        console.log('session userId', userId === session.get('userId'));
        console.log('reimburseState', (reimburseState === ReimburseState[4].value || reimburseState === ReimburseState[3].value) && (userId === session.get('userId')));
        return (
            <div className='tab-view'>
                <MyButton
                    type="primary"
                    backgroundColor={'#02a6f0'}
                    textColor={'#fff'}
                    onClick={() => this._onPress(TabArr[0])}
                    ghost={selectedTab !== TabArr[0]}
                >
                    申请信息
                </MyButton>
                <MyButton
                    type="primary"
                    backgroundColor={'#02a6f0'}
                    textColor={'#fff'}
                    onClick={() => this._onPress(TabArr[1])}
                    ghost={selectedTab !== TabArr[1]}
                    style={{marginLeft: '10px'}}
                >
                    审核信息
                </MyButton>
                {
                    (pageType !== PageType[4].value) &&
                    (reimburseState === ReimburseState[4].value || loanType !== null) &&
                    <div style={{position: 'absolute', right: '20px'}}>
                        <MyButton
                            type="primary"
                            backgroundColor={'#02a6f0'}
                            textColor={'#fff'}
                            onClick={() => this._onPress(TabArr[2])}
                            ghost={false}
                        >
                            下载审批单
                        </MyButton>
                    </div>
                }
            </div>
        )
    }
}

class VerifyComponent extends React.Component {

    state = {
        verifyArr: VerifyArr(),
        verifyImageArr: [],
        othersImageArr: this.props.relatedImage,
        imageUploadFinish: true,
        loanArr: LoanArr(),
    };

    componentWillReceiveProps(nextProps) {
        // 该方法不能删
        if (!IsEqual(this.props.relatedImage, nextProps.relatedImage)) {
            this.setState({othersImageArr: nextProps.relatedImage});
        }
    }

    _onPictureChange = ({fileList, index, style, status, fieldName}) => {
        if (fieldName !== this.state.verifyArr[2].fieldName) {
            return;
        }
        if (status === 'uploading') {
            return;
        }
        let imgArr = [];
        const {verifyImageArr} = this.state;
        let imageUploadFinish = true;
        if (fileList.length > 0) {
            fileList.forEach(item => {
                if (item.response && item.response.data) {
                    imgArr.push(item.response.data);
                }
                if (item.status !== 'done') {
                    imageUploadFinish = false;
                }
                for (let it of verifyImageArr) {
                    if (it[imgUrl.small] === item.url) {
                        imgArr.push(it);
                    }
                }
            });
            this.setState({
                imageUploadFinish,
                verifyImageArr: imgArr,
            });
        }
    };

    _onSelect = ({value, option, fieldName}) => {
    };

    _onSubmitPress = () => {
        const {form: {validateFields}, reimburseState} = this.props;
        validateFields((errors, values) => {
            if (!errors) {
                let m_api = '';
                if (reimburseState === ReimburseState[1].value) {
                    m_api = api.submitVerify;
                } else if (reimburseState === ReimburseState[4].value) {
                    m_api = api.submitLoan;
                }
                this._submit(m_api, values);
            } else {
                console.log('errors', errors);
            }
        });
    };

    _onHandleFormBack = () => {
        const {handleBack} = this.props;
        handleBack && handleBack();
    };

    _submit = (m_api, obj = {}) => {
        const {listId, taskId,} = this.props;
        const {verifyImageArr, othersImageArr} = this.state;

        const newArr = [...verifyImageArr, ...othersImageArr];
        const params = {
            ...obj,
            payDate: obj.payDate ? moment(obj.payDate).format(MomentFormat) : '',
            loanDate: obj.loanDate ? moment(obj.loanDate).format(MomentFormat) : '',
            taskId,
            id: listId,
            relevantInfo: newArr.length > 0 ? JSON.stringify(newArr) : '[]',
        };
        console.log('_submit params', params);
        console.log('_submit m_api', m_api);
        request(m_api, params, 'post', session.get('token'))
            .then(res => {
                if (res.success) {
                    const msg = res.message ? res.message : '提交成功';
                    message.info(msg);
                    this._onHandleFormBack();
                } else {
                    const msg = res.message ? res.message : '请求失败';
                    message.error(msg);
                }
            })
            .catch(err => {
                console.log('err', err);
                message.error('请求服务异常');
            });
    };

    _onSubmitDebounce = LodashDebounce(() => this._onSubmitPress());

    render() {
        const {operationType, pageType, reimburseState, form, procInstId, listId} = this.props;
        const {verifyArr, loanArr} = this.state;
        const approvalHistoryProps = {
            procInstId,
        };
        return (
            <div>
                <div className='search-view'>
                    <Row type='flex' justify='start' align='middle'>
                        <Col>
                            <MyTitle title='审核流程' type='bar'/>
                        </Col>
                    </Row>
                </div>
                <div className='search-view'>
                    <ApprovalHistory {...approvalHistoryProps}/>
                </div>
                {
                    operationType === OperationType[4].value && reimburseState === ReimburseState[1].value &&
                    <div>
                        <div className='title-view' style={{marginTop: '15px'}}>
                            <Row type='flex' justify='start' align='middle'>
                                <Col>
                                    <MyTitle title='审核意见' type='bar'/>
                                </Col>
                            </Row>

                        </div>
                        <div className='search-view'>
                            <RenderComponent
                                form={form}
                                itemArr={verifyArr}
                                onSelect={this._onSelect}
                                onPictureChange={this._onPictureChange}
                                pageType={pageType}
                                operationType={operationType}
                                businessId={listId}
                            />
                        </div>
                    </div>
                }
                {
                    operationType === OperationType[4].value && reimburseState === ReimburseState[4].value &&
                    <div>
                        <div className='title-view' style={{marginTop: '15px'}}>
                            <Row type='flex' justify='start' align='middle'>
                                <Col>
                                    <MyTitle title='放款/收款' type='bar'/>
                                </Col>
                            </Row>

                        </div>
                        <div className='search-view'>
                            <RenderComponent
                                form={form}
                                itemArr={loanArr}
                                onSelect={this._onSelect}
                                onPictureChange={this._onPictureChange}
                            />
                        </div>
                    </div>
                }
                <div className='button-view'>
                    <Row type='flex' justify='center' align='middle'>
                        {
                            operationType === OperationType[4].value &&
                            (
                                reimburseState === ReimburseState[4].value ||
                                reimburseState === ReimburseState[1].value
                            ) &&
                            <Col>
                                <MyButton
                                    type="primary"
                                    backgroundColor={'#02a6f0'}
                                    textColor={'#fff'}
                                    onClick={this._onSubmitDebounce}
                                >
                                    提交
                                </MyButton>
                            </Col>
                        }
                        <Col>
                            <Button
                                className="default-btn"
                                style={{marginLeft: '20px'}}
                                onClick={this._onHandleFormBack}>
                                返回
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

class AddApply extends React.Component {

    state = {
        baseInfoArr: BaseInfo(),
        secondPartInfoArr: ReimbursementArr(),
        applyMaterialArr: ApplyMaterialArr(),
        materialImgUploadFinish: true,
        returnImgUploadFinish: true,
        materialImgArr: [],
        returnImgArr: [],
        relevantImgArr: [],
        selectedTab: SelectTab,
        relatedMaterialArr: RelatedMaterialArr(),
        returnMaterialArr: ReturnMaterialArr(),
        financialBorrowing: FinancialBorrowing(),
        isLoading: false,
        loanType: null,
        userId: null,
        businessId: uuidv1(),
    };

    componentDidMount() {
        const {params: {pageType, operationType, reimburseType, reimburseState, listId}} = this.props;
        if (pageType !== PageType[0].value) {
            this.setState({isLoading: true}, () => {
                this._getListDetail(listId);
            });
        }
    }

    _onSelect = (value, option) => {
        const ds = TypeArr.filter(item => item.value === value);
        this.setState({
            secondPartInfoArr: ds[0].itemArr(),
        });
    };

    _onPictureChange = ({fileList, index, style, status, fieldName}) => {
        console.log('fieldName', fieldName);
        console.log('this.state', this.state);
        if (status === 'uploading') {
            return;
        }
        const {materialImgArr, applyMaterialArr, returnImgArr, returnMaterialArr, materialImgUploadFinish, returnImgUploadFinish} = this.state;
        let stateName = '';
        let stateArr = [];
        let ulFlag = null;
        if (fieldName === applyMaterialArr[0].fieldName) {
            stateName = 'materialImgArr';
            stateArr = materialImgArr;
            ulFlag = materialImgUploadFinish;
        } else if (fieldName === returnMaterialArr[0].fieldName) {
            stateName = 'returnImgArr';
            stateArr = returnImgArr;
            ulFlag = returnImgUploadFinish;
        }

        if (stateName === '') {
            return;
        }

        console.log('stateName', stateName);
        console.log('stateArr', stateArr);

        let imgArr = [];
        let imageUploadFinish = true;
        if (fileList.length > 0) {
            fileList.forEach(item => {
                if (item.response && item.response.data) {
                    imgArr.push(item.response.data);
                }
                if (item.status !== 'done') {
                    imageUploadFinish = false;
                }
                for (let it of stateArr) {
                    if (it[imgUrl.small] === item.url) {
                        imgArr.push(it);
                    }
                }
            });
            this.setState({
                [ulFlag]: imageUploadFinish,
                [stateName]: imgArr,
            });

        }
    };

    _onSaveAndSubmitPress = (type) => {
        const {
            form: {validateFields},
            params: {pageType, operationType, reimburseType, reimburseState, listId, taskId, procInstId}
        } = this.props;
        validateFields((errors, values) => {
            console.log('values', values);
            if (!errors) {
                // 新增需要保存，和提交，审核需要提交
                if (pageType === PageType[0].value || pageType === PageType[1].value) {
                    // 添加申请提交和保存
                    this._addSaveAndSubmit(listId, values, type);
                }
            }
        });
    };

    _onSaveAndSubmitPressDebounce = LodashDebounce(type => this._onSaveAndSubmitPress(type));

    _onHandleFormBack = () => {
        const {history} = this.props;
        history.goBack();
    };

    _headTitleIcon = (pageType) => {
        switch (pageType) {
            case  PageType[0].value :
                return {title: PageType[0].label, icon: ass.img.titleIcon};
            case  PageType[1].value :
                return {title: PageType[1].label, icon: ass.img.titleIcon};
            case  PageType[2].value :
                return {title: PageType[2].label, icon: ass.img.titleIcon};
            case  PageType[3].value :
                return {title: PageType[3].label, icon: ass.img.titleIcon};
            case  PageType[4].value :
                return {title: PageType[4].label, icon: ass.img.titleIcon};
            default:
                return {title: PageType[0].label, icon: ass.img.titleIcon};
        }
    };

    _onTabSelect = (selectedTab) => {
        if (selectedTab === TabArr[2]) {
            this._onWindowOpen();
        } else {
            this.setState({selectedTab});
        }
    };

    _onWindowOpen = () => {
        const controller = api.downloadReimburse;
        const url = 'http://' + window.location.hostname + '/lhb-manage/a/rest' + controller;
        const {params: {listId}} = this.props;
        if (!listId) {
            return;
        }
        const urlWithParams = `${url}${listId}`;
        console.log('urlWithParams', urlWithParams);
        window.open(urlWithParams);
    };

    _onDownPressLodashDebounce = LodashDebounce((selectedTab) => this._onTabSelect(selectedTab));

    _getListDetail = (listId) => {
        const params = {
            id: listId,
            businessType: 'reimburse',
        };
        request(api.listDetail, params, 'get', session.get('token'))
            .then(res => {
                console.log('_getListDetail res', res);
                if (res.success) {
                    let baseArr = [];
                    switch (res.data.type) {
                        case  TypeArr[0].value: {
                            baseArr = TypeArr[0].itemArr();
                            break;
                        }
                        case  TypeArr[1].value: {
                            baseArr = TypeArr[1].itemArr();
                            break;
                        }
                        case  TypeArr[2].value: {
                            baseArr = TypeArr[2].itemArr();
                            break;
                        }
                        case  TypeArr[3].value: {
                            baseArr = TypeArr[3].itemArr();
                            break;
                        }
                    }

                    const {params: {operationType, reimburseState, pageType}} = this.props;
                    const {baseInfoArr, applyMaterialArr, relatedMaterialArr, returnMaterialArr} = this.state;
                    let {returnImgArr, relevantImgArr, materialImgArr, financialBorrowing, userId} = this.state;

                    // runState: ReimburseState, type: TypeArr
                    let {runState, type, loanType} = res.data;

                    // myLoanType: null, '1', '2';
                    // null: 未放款
                    // '1'，'2'：已放款
                    const myLoanType = loanType ? loanType : null;

                    const baseDisabled = () => {
                        if (reimburseState === ReimburseState[0].value) {
                            return false;
                        } else if (reimburseState === ReimburseState[2].value && myLoanType === null) {
                            return false;
                        } else {
                            return true;
                        }
                    };

                    // secondPart
                    baseArr.forEach(item => {
                        item.initialValue = res.data[item.fieldName];
                        console.log('baseDisabled', baseDisabled());
                        item.disabled = baseDisabled();
                    });

                    // firstPart
                    baseInfoArr.forEach(item => {
                        item.initialValue = res.data[item.fieldName];
                        item.disabled = true;
                    });

                    // 申请资料
                    const amd = reimburseState === ReimburseState[0].value;
                    applyMaterialArr[0].initialValue = res.data.reimInfoJson ? this._imgDataFormat(res.data.reimInfoJson) : [];
                    applyMaterialArr[0].disabled = baseDisabled();
                    applyMaterialArr[0].isDelete = !baseDisabled();

                    applyMaterialArr[1].initialValue = res.data.reimFileJson ? res.data.reimFileJson : [];
                    applyMaterialArr[1].disabled = baseDisabled();
                    applyMaterialArr[1].isDelete = !baseDisabled();


                    applyMaterialArr[2].initialValue = res.data.remarks;
                    applyMaterialArr[2].disabled = baseDisabled();

                    materialImgArr = res.data.reimInfoJson ? res.data.reimInfoJson : [];


                    // 相关资料
                    if (res.data.relevantInfoJson) {
                        relatedMaterialArr[0].initialValue = res.data.relevantInfoJson ? this._imgDataFormat(res.data.relevantInfoJson) : [];
                        relatedMaterialArr[0].disabled = true;
                        relatedMaterialArr[0].isDelete = false;

                        relevantImgArr = res.data.relevantInfoJson ? res.data.relevantInfoJson : [];

                        relatedMaterialArr[1].initialValue = res.data.relevantFileJson ? res.data.relevantFileJson : [];
                        relatedMaterialArr[1].disabled = true;
                        relatedMaterialArr[1].isDelete = false;
                    }
                    if (res.data.relevantFileJson) {

                        relatedMaterialArr[0].disabled = true;
                        relatedMaterialArr[0].isDelete = false;

                        relatedMaterialArr[1].initialValue = res.data.relevantFileJson ? res.data.relevantFileJson : [];
                        relatedMaterialArr[1].disabled = true;
                        relatedMaterialArr[1].isDelete = false;
                    }

                    // 回传资料
                    const returnMaterialArrDisable = () => {
                        if (
                            pageType === PageType[1].value &&
                            (reimburseState === ReimburseState[2].value || reimburseState === ReimburseState[5].value)
                        ) {
                            return false;
                        } else {
                            return true;
                        }
                    };

                    console.log('returnMaterialArrDisable', returnMaterialArrDisable());

                    returnMaterialArr[0].initialValue = res.data.returnInfoJson ? this._imgDataFormat(res.data.returnInfoJson) : [];
                    returnMaterialArr[0].disabled = returnMaterialArrDisable();
                    returnMaterialArr[0].isDelete = !returnMaterialArrDisable();

                    returnImgArr = res.data.returnInfoJson ? res.data.returnInfoJson : [];


                    console.log('applyMaterialArr', applyMaterialArr);
                    console.log('relatedMaterialArr', relatedMaterialArr);

                    // 财务借支
                    financialBorrowing.forEach(item => {
                        item.initialValue = res.data[item.fieldName] === '' ? undefined : res.data[item.fieldName];
                        if (item.id !== 2) {
                            console.log('item.id', item.id);
                            console.log('reimburseState', reimburseState);
                            console.log('reimburseState', ReimburseState[2].value);
                            console.log('reimburseState', ReimburseState[5].value);
                            const bv = pageType === PageType[1].value && (reimburseState === ReimburseState[2].value || reimburseState === ReimburseState[5].value);
                            console.log('item bv', bv);
                            item.disabled = !bv;
                        }
                    });

                    console.log('id', res.data.createBy);
                    userId = res.data.createBy.id;

                    this.setState({
                        returnImgArr,
                        relevantImgArr,
                        materialImgArr,

                        userId,

                        baseInfoArr,
                        applyMaterialArr,
                        relatedMaterialArr,
                        financialBorrowing,
                        secondPartInfoArr: baseArr,
                        isLoading: false,
                        loanType: myLoanType,
                    });
                } else {
                    const msg = res.message ? res.message : '请求失败';
                    message.error(msg);
                    this.setState({isLoading: false});
                }
            })
            .catch(err => {
                console.log('err', err);
                message.error('请求服务异常');
                this.setState({isLoading: false});
            });
    };

    _imgDataFormat = (imgDataJson) => {
        let imgDataArr = [];
        for (let item of imgDataJson) {
            imgDataArr.push({
                url: item[imgUrl.small] ? item[imgUrl.small] : '',
                bigBUrl: item[imgUrl.bigB] ? item[imgUrl.bigB] : '',
                bigUrl: item[imgUrl.big] ? item[imgUrl.big] : '',
                uid: `${item.fileName}${Math.random()}`,
                status: 'done',
            });
        }
        return imgDataArr;
    };

    _addSaveAndSubmit = (listId, values, type) => {
        const {materialImgArr, returnImgArr, relevantImgArr, businessId} = this.state;
        let params = {
            ...values,
            payDate: values.payDate ? moment(values.payDate).format(MomentFormat) : '',
            reimInfo: materialImgArr && materialImgArr.length > 0 ? JSON.stringify(materialImgArr) : '[]',
            relevantInfo: relevantImgArr && relevantImgArr.length > 0 ? JSON.stringify(relevantImgArr) : '[]',
            returnInfo: returnImgArr && returnImgArr.length ? JSON.stringify(returnImgArr) : '[]',
        };

        let url = '';
        if (listId !== 'null') {
            params.id = listId;
            params.businessId = listId;
        }
        if (type === 'save') {
            url = api.reimburseSave;
            params.businessId = businessId;
        }
        if (type === 'submit') {
            url = api.reimburseSubmit;
            params.businessId = businessId;
        }
        if (!url) {
            return;
        }

        this.setState({isLoading: true});
        console.log('params', params);
        request(url, params, 'post', session.get('token'))
            .then(res => {
                console.log('res', res);
                if (res.success) {
                    this._onHandleFormBack();
                    const msg = res.message ? res.message : '提交成功';
                    message.info(msg);
                } else {
                    const msg = res.message ? res.message : '请求失败';
                    message.error(msg);
                }
                this.setState({isLoading: false});
            })
            .catch(err => {
                console.log('err', err);
                message.error('请求服务异常');
                this.setState({isLoading: false});
            });
    };

    _onComponentSelect = ({value, option, fieldName}) => {
        const {financialBorrowing} = this.state;
        if (fieldName === financialBorrowing[0].fieldName) {
            this._setRealMoney({
                selectValue: value,
                selectFieldName: fieldName,
                inputValue: null,
                inputFieldName: null
            });
        }

    };

    _onNumberInputChange = ({val, fieldName}) => {
        const {financialBorrowing} = this.state;
        if (fieldName === financialBorrowing[1].fieldName) {
            this._setRealMoney({selectValue: null, selectFieldName: null, inputValue: val, inputFieldName: fieldName});
        }

    };

    _setRealMoney = ({selectValue = null, selectFieldName = null, inputValue = null, inputFieldName = null}) => {
        const {form: {getFieldValue, setFieldsValue}} = this.props;
        const {financialBorrowing, secondPartInfoArr} = this.state;
        const bMoney = getFieldValue(secondPartInfoArr[1].fieldName);
        let tMoney = 0;
        console.log('selectValue', selectValue);
        console.log('selectFieldName', selectFieldName);
        console.log('inputValue', inputValue);
        console.log('inputFieldName', inputFieldName);
        if (selectValue !== null && selectFieldName !== null) {
            const cMoney = getFieldValue(financialBorrowing[1].fieldName);
            console.log('cMoney', cMoney);
            if (Number(cMoney) >= 0) {
                if (selectValue === '1') {
                    tMoney = (bMoney - cMoney) < 0 ? 0 : (bMoney - cMoney);
                } else if (selectValue === '2') {
                    tMoney = bMoney + cMoney;
                }
            }
        } else if (inputValue !== null && inputFieldName !== null) {
            const fbType = getFieldValue(financialBorrowing[0].fieldName);
            console.log('fbType', fbType);
            if (fbType) {
                if (fbType === '1') {
                    tMoney = (bMoney - inputValue) < 0 ? 0 : (bMoney - inputValue);
                } else if (fbType === '2') {
                    tMoney = bMoney + inputValue;
                }
            }
        }

        console.log('tMoney', tMoney);

        const key = financialBorrowing[2].fieldName;
        console.log('tMoney key', key);
        setFieldsValue({[key]: tMoney.toFixed(2)});
    };

    _renderDetailView = () => {
        const {form, params: {pageType, operationType, reimburseType, reimburseState, listId, taskId, procInstId}} = this.props;
        const {baseInfoArr, secondPartInfoArr, applyMaterialArr, relatedMaterialArr, returnMaterialArr, financialBorrowing, loanType, businessId: bId} = this.state;
        console.log('_renderDetailView', this.props);
        console.log('_renderDetailView', this.state);
        const businessId = function () {
            if (listId !== 'null') {
                return listId;
            } else {
                return bId;
            }
        }();
        return (
            <div>
                <div className='title-view' style={{marginTop: '15px'}}>
                    <Row type='flex' justify='start' align='middle'>
                        <Col>
                            <MyTitle title='基本信息' type='bar'/>
                        </Col>
                    </Row>
                </div>
                <div className='search-view'>
                    <BaseInfoComponent
                        itemArr={baseInfoArr}
                        form={form}
                        onSelect={this._onSelect}
                    />
                </div>

                <div className='title-view' style={{marginTop: '15px'}}>
                    <Row type='flex' justify='start' align='middle'>
                        <Col>
                            <MyTitle title='详细信息' type='bar'/>
                        </Col>
                    </Row>
                </div>
                <div className='search-view'>
                    <RenderComponent
                        itemArr={secondPartInfoArr}
                        form={form}
                    />
                </div>

                <div className='title-view' style={{marginTop: '15px'}}>
                    <Row type='flex' justify='start' align='middle'>
                        <Col>
                            <MyTitle title='申请资料' type='bar'/>
                        </Col>
                    </Row>
                </div>
                <div className='search-view'>
                    <RenderComponent
                        itemArr={applyMaterialArr}
                        form={form}
                        onPictureChange={this._onPictureChange}
                        pageType={pageType}
                        operationType={operationType}
                        businessId={businessId}
                    />
                </div>

                {/** 相关资料显示 **/}
                <div style={{
                    display: (
                        relatedMaterialArr[0].initialValue.length > 0 ||
                        relatedMaterialArr[1].initialValue.length > 0
                    ) ? 'block' : 'none'
                }}>
                    {this._relatedAndReturnView('相关资料', relatedMaterialArr)}
                </div>

                {/** 财务借支 **/}
                <div style={{
                    display: (
                        reimburseType === TypeArr[2].value &&
                        loanType !== null
                    ) ? 'block' : 'none'
                }}>
                    <div className='title-view' style={{marginTop: '15px'}}>
                        <Row type='flex' justify='start' align='middle'>
                            <Col>
                                <MyTitle title='借支还款' type='bar'/>
                            </Col>
                        </Row>
                    </div>
                    <div className='search-view'>
                        <RenderComponent
                            itemArr={financialBorrowing}
                            form={form}
                            onSelect={this._onComponentSelect}
                            onChange={this._onNumberInputChange}
                        />
                    </div>
                </div>

                {/** 回传资料的添加 已放款和驳回状态需要添加回传资料，其他状态有则显示 **/}
                <div style={{
                    display: (
                        returnMaterialArr[0].initialValue.length > 0 ||
                        reimburseState === ReimburseState[2].value ||
                        reimburseState === ReimburseState[5].value
                    ) ? 'block' : 'none'
                }}>
                    {this._relatedAndReturnView('回传资料', returnMaterialArr)}
                </div>

                <div className='button-view'>
                    <Row type='flex' justify='center' align='middle'>
                        {
                            (
                                reimburseState === ReimburseState[0].value ||
                                pageType === PageType[0].value
                            ) &&
                            <Col>
                                <MyButton
                                    type="primary"
                                    backgroundColor={'#02a6f0'}
                                    textColor={'#fff'}
                                    onClick={() => this._onSaveAndSubmitPressDebounce('save')}
                                    ghost
                                >
                                    保存
                                </MyButton>
                            </Col>
                        }
                        {
                            (
                                pageType === PageType[0].value ||
                                operationType === OperationType[1].value ||
                                operationType === OperationType[2].value ||
                                (
                                    pageType === PageType[1].value &&
                                    (
                                        reimburseState === ReimburseState[5].value
                                    )
                                )
                            ) &&
                            <Col>
                                <MyButton
                                    type="primary"
                                    backgroundColor={'#02a6f0'}
                                    style={{marginLeft: '20px'}}
                                    textColor={'#fff'}
                                    onClick={() => this._onSaveAndSubmitPressDebounce('submit')}
                                >
                                    提交
                                </MyButton>
                            </Col>
                        }
                        <Col>
                            <Button
                                className="default-btn"
                                style={{marginLeft: '20px'}}
                                onClick={this._onHandleFormBack}>
                                返回
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    };

    _relatedAndReturnView = (title, itemArr) => {
        const {form} = this.props;
        return (
            <div>
                <div className='title-view' style={{marginTop: '15px'}}>
                    <Row type='flex' justify='start' align='middle'>
                        <Col>
                            <MyTitle title={title} type='bar'/>
                        </Col>
                    </Row>
                </div>
                <div className='search-view'>
                    <RenderComponent
                        itemArr={itemArr}
                        form={form}
                        onPictureChange={this._onPictureChange}
                    />
                </div>
            </div>
        )
    };

    render() {
        const {form, params: {pageType, operationType, reimburseType, reimburseState, listId, taskId, procInstId}} = this.props;
        const {baseInfoArr, secondPartInfoArr, applyMaterialArr, selectedTab, relatedMaterialArr, relevantImgArr, isLoading, userId, loanType} = this.state;
        const {title, icon} = this._headTitleIcon(pageType);
        console.log('this.props', this.props);
        console.log('this.state', this.state);
        console.log('BaseInfo()', BaseInfo());
        const verifyProps = {
            form,
            pageType,
            operationType,
            reimburseState,
            listId,
            taskId,
            procInstId,
            handleBack: this._onHandleFormBack,
            relatedImage: relevantImgArr,
        };
        return (
            <Spin size='large' spinning={isLoading}>
                <div className='apply-list'>

                    <div className='title-view'>
                        <Row type='flex' justify='space-between' align='middle'>
                            <Col>
                                <MyTitle title={title} imgSrc={icon}/>
                            </Col>
                        </Row>
                    </div>

                    {
                        pageType !== 'add' &&
                        <TabComponent
                            userId={userId}
                            loanType={loanType}
                            pageType={pageType}
                            onTabSelect={this._onTabSelect}
                            onDownPress={this._onDownPressLodashDebounce}
                            reimburseState={reimburseState}

                        />
                    }

                    {/** 用display来实现类似正常的显示方式 **/}
                    <div style={{display: selectedTab === TabArr[0] ? 'block' : 'none'}}>
                        {this._renderDetailView()}
                    </div>
                    <div style={{display: selectedTab === TabArr[1] ? 'block' : 'none'}}>
                        <VerifyComponent {...verifyProps}/>
                    </div>

                </div>
            </Spin>
        )
    }
}

const AddApplyForm = Form.create()(AddApply);
export default AddApplyForm;
