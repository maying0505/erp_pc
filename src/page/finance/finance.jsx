/**
 * @Create by John on 2018/03/23
 * @desc 放款
 * */

import React from 'react';
import {
    Row,
    Col,
    Spin,
    Table,
    Card,
    Form,
    Modal,
    Input,
    Select,
    Button,
    message,
    DatePicker,
    Icon,
} from 'antd';
import api from 'common/util/api';
import {request} from 'common/request/request';
import {local, session} from 'common/util/storage';
import './index.scss';
import moment from 'moment';
import {hashHistory} from 'react-router';

import RepaymentMethod from 'component/repayment-method';
import MyDatePicker from 'component/DatePicker';
import BranchOffice from 'component/branchOffice';
import ProductSelect from 'component/product-select';
import FinanceStatus from 'component/status';
import ApprovalProcess from 'component/approval-process';
import RangePicker from 'component/rangeDatePicker';
import InputItem from 'component/InputTextItem';
import toQueryStr from 'common/util/toQueryStr';

const FieldType = {input: 'Input', date: 'Date', select: 'Select'};
const ColMd = 6;
const ColSm = 24;
const RowGutter = 16;
const FormItem = Form.Item;
const Option = Select.Option;
const DateFormat = 'YYYY-MM-DD';
// const TableColumnWidthS = 100;
// const TableColumnWidthM = 140;
// const TableColumnWidthL = 180;
const TableColumnWidth = '6.6%';

const SearchItemArr = [
    {id: 0, label: '客户姓名', fieldName: 'customerName', initialValue: undefined},
    {id: 1, label: '申请日期', fieldName: 'applicationDate', initialValue: undefined},
    {id: 2, label: '还款方式', fieldName: 'repaymentMethod', initialValue: undefined},
    {id: 3, label: '状态', fieldName: 'status', initialValue: undefined},
    {id: 4, label: '产品', fieldName: 'product', initialValue: undefined},
    {id: 5, label: '分公司', fieldName: 'branchOffice', initialValue: undefined},
    {id: 6, label: '业务员', fieldName: 'salesman', initialValue: ''},
    {id: 7, label: '放款时间', fieldName: ['loanTimeRangeStart', 'loanTimeRangeEnd'], initialValue: [undefined, undefined]},
    {id: 8, label: '应还时间', fieldName: ['predictDateStart', 'predictDateEnd'], initialValue: [undefined, undefined]},
    {id: 9, label: '实还时间', fieldName: ['realityDateStart', 'realityDateEnd'], initialValue: [undefined, undefined]},
    {id: 10, label: '是否逾期', fieldName: 'isOverDue', initialValue: undefined},
    {id: 11, label: '合同编号', fieldName: 'contractNo', initialValue: undefined},
];

const FSQOKey = 'FinanceSearchQueryObjKey';
const FTCPIndex = 'FinanceTableCurrentPageIndex';

class FinanceSearch extends React.Component {

    _onPress = () => {
        this.props.onSearch();
    };

    render() {
        const {form, itemArr} = this.props;
        return (
            <Row>
                {
                    itemArr.map(item => {
                        const {id, label, fieldName, initialValue} = item;
                        switch (fieldName) {
                            case SearchItemArr[0].fieldName:
                            case SearchItemArr[6].fieldName:
                            case SearchItemArr[11].fieldName: {
                                return (
                                    <Col md={ColMd} sm={ColSm} key={`itemArr_${id}`}>
                                        <InputItem
                                            form={form}
                                            label={label}
                                            isRequired={false}
                                            placeholder='请输入'
                                            fieldName={fieldName}
                                            initialValue={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case SearchItemArr[1].fieldName: {
                                return (
                                    <Col md={ColMd} sm={ColSm} key={`itemArr_${id}`}>
                                        <MyDatePicker
                                            form={form}
                                            disabled={false}
                                            key={`itemArr_${id}`}
                                            fieldName={fieldName}
                                            defaultValue={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case SearchItemArr[2].fieldName: {
                                return (
                                    <Col md={ColMd} sm={ColSm} key={`itemArr_${id}`}>
                                        <RepaymentMethod
                                            form={form}
                                            key={`itemArr_${id}`}
                                            fieldName={fieldName}
                                            defaultValue={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case SearchItemArr[5].fieldName: {
                                return (
                                    <Col md={ColMd} sm={ColSm} key={`itemArr_${id}`}>
                                        <BranchOffice
                                            fieldName={fieldName}
                                            form={form}
                                            initialValue={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case SearchItemArr[4].fieldName: {
                                return (
                                    <Col md={ColMd} sm={ColSm} key={`itemArr_${id}`}>
                                        <ProductSelect
                                            fieldName={fieldName}
                                            form={form}
                                            proNameInfo={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case SearchItemArr[3].fieldName: {
                                return (
                                    <Col md={ColMd} sm={ColSm} key={`itemArr_${id}`}>
                                        <FinanceStatus
                                            fieldName={fieldName}
                                            form={form}
                                            initialValue={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case SearchItemArr[7].fieldName:
                            case SearchItemArr[8].fieldName:
                            case SearchItemArr[9].fieldName: {
                                return (
                                    <Col md={ColMd} sm={ColSm} key={`itemArr_${id}`}>
                                        <RangePicker
                                            label={label}
                                            fieldName={fieldName}
                                            form={form}
                                            initialValue={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case SearchItemArr[10].fieldName: {
                                return (
                                    <Col md={ColMd} sm={ColSm} key={`itemArr_${id}`}>
                                        <FormItem label={label}>
                                            {
                                                form.getFieldDecorator(fieldName, {
                                                    initialValue: initialValue,
                                                })(
                                                    <Select
                                                        disabled={false}
                                                        allowClear={true}
                                                        placeholder={label}
                                                        style={{width: '100%'}}
                                                    >
                                                        <Option value='0'>否</Option>
                                                        <Option value='1'>是</Option>
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


class Finance extends React.Component {

    state = {
        isLoading: false,
        tableDataSource: [],
        paginationObject: {total: 1},
        pageSize: 10,
        pageIndex: 1,
        formQueryObject: null,
        loanTermUnitArr: [],
        repaymentMethodArr: [],
        productId: '',
        modalVisible: false,
        searchItemArr: SearchItemArr,
    };

    _tableColumns = [
        {
            title: '姓名',
            dataIndex: 'name',
            // fixed: 'left',
            width: TableColumnWidth,
        },
        {title: '合同编号', dataIndex: 'contractNumber', width: TableColumnWidth},
        {title: '身份证号', dataIndex: 'idCard', width: TableColumnWidth},
        {title: '手机号', dataIndex: 'phoneNumber', width: TableColumnWidth},
        {title: '产品', dataIndex: 'product', width: TableColumnWidth},
        {title: '借款金额（元）', dataIndex: 'loanMount'},
        {title: '申请时间', dataIndex: 'applicationTime', width: TableColumnWidth},
        {
            title: '借款期限',
            dataIndex: 'loanTerm',
            width: TableColumnWidth,
            render: (text, record) => this._getLoanTerm(text, record)
        },
        {
            title: '放款时间',
            dataIndex: 'valueDate',
            width: TableColumnWidth,
            render: (text, record) => {
                return text ? text : '--';
            }
        },
        {
            title: '还款方式',
            dataIndex: 'repaymentMethod',
            width: TableColumnWidth,
            render: (text, record) => this._getRepaymentMethodName(text)
        },
        {title: '分公司', dataIndex: 'branchOffice', width: TableColumnWidth},
        {title: '业务员', dataIndex: 'salesman', width: TableColumnWidth},
        {title: '状态', dataIndex: 'status', width: TableColumnWidth},
        {
            title: '业务流程',
            // fixed: 'right',
            width: TableColumnWidth,
            dataIndex: 'productId',
            render: (text, record) => (
                <span>
                   <a href='JavaScript:void(0)'
                      onClick={() => this._onOperationFlowPress(text)}
                      className='ant-dropdown-link gray-style'
                   >
                       查看流程
                   </a>
                </span>
            ),
        },
        {
            title: '操作',
            // fixed: 'right',
            width: TableColumnWidth,
            render: (text, record) => (
                <span>
                    <a onClick={() => this._onOperationPress(text, record, record.stage)}
                       className='ant-dropdown-link green-span'
                    >
                      {this._getOperationName(record)}
                      </a>
                </span>
            ),
        },
    ];

    componentDidMount() {
        this._searchQueryObj();
        this._getCurrentPageIndex();
    }

    _getCurrentPageIndex = () => {
        const ftcpIndex = session.get(FTCPIndex);
        let pi = this.state.pageIndex;
        if (ftcpIndex) {
            this.setState({
                paginationObject: {
                    ...this.state.paginationObject,
                    current: ftcpIndex,
                }
            });
            pi = ftcpIndex;
        }
        this._getDeadlineUnit(pi);
    };

    _searchQueryObj = () => {
        const searchQueryObj = session.get(FSQOKey);
        if (searchQueryObj) {
            const {
                beforePredictDate,
                beforeRealityDate,
                beforeValueDate,
                companyBy,
                contractNo,
                filingDate,
                isOverDue,
                laterPredictDate,
                laterRealityDate,
                laterValueDate,
                name,
                proName,
                queryStages,
                refundWar,
                salesman,
            } = searchQueryObj;
            const searchItemArr = [
                {id: 0, label: '客户姓名', fieldName: 'customerName', initialValue: this._getValue(name)},
                {id: 1, label: '申请日期', fieldName: 'applicationDate', initialValue: this._getValue(filingDate)},
                {id: 2, label: '还款方式', fieldName: 'repaymentMethod', initialValue: this._getValue(refundWar)},
                {id: 3, label: '状态', fieldName: 'status', initialValue: queryStages === '[]' ? undefined : queryStages},
                {id: 4, label: '产品', fieldName: 'product', initialValue: this._getValue(proName)},
                {
                    id: 5,
                    label: '分公司',
                    fieldName: 'branchOffice',
                    initialValue: this._getValue(companyBy)
                },
                {id: 6, label: '业务员', fieldName: 'salesman', initialValue: this._getValue(salesman)},
                {
                    id: 7,
                    label: '放款时间',
                    fieldName: 'loanTimeRange',
                    initialValue: [this._getValue(beforeValueDate), this._getValue(laterValueDate)]
                },
                {
                    id: 8,
                    label: '应还时间',
                    fieldName: 'predictDate',
                    initialValue: [this._getValue(beforePredictDate), this._getValue(laterPredictDate)]
                },
                {
                    id: 9,
                    label: '实还时间',
                    fieldName: 'realityDate',
                    initialValue: [this._getValue(beforeRealityDate), this._getValue(laterRealityDate)]
                },
                {id: 10, label: '是否逾期', fieldName: 'isOverDue', initialValue: this._getValue(isOverDue)},
                {id: 11, label: '合同编号', fieldName: 'contractNo', initialValue: this._getValue(contractNo)},
            ];
            this.setState({searchItemArr});
        }
    };


    _getValue = (value) => {
        return value === '' ? undefined : value;
    };

    _onOperationFlowPress = (text, record) => {
        this.setState({
            productId: text,
            modalVisible: true
        })
    };

    _onCancelAppPro = () => {
        this.setState({
            modalVisible: false
        })
    };

    _getOperationName = (record) => {
        switch (record.stage) {
            case '8.1': {
                // 分公司
                return record.perId !== '1' ? '审核' : '详情';
            }
            case '8.2': {
                // 总公司
                return record.perId === '1' ? '审核' : '详情';
            }
            case '9': {
                return record.perId !== '1' ? '放款' : '详情';
            }
            case '10': {
                return record.perId !== '1' ? '还款' : '详情';
            }
            case '11': {
                return '详情';
            }
            default: {
                return '';
            }
        }
    };

    _onOperationPress = (text, record, stage = 0) => {
        if (Number(stage) < 9) {
            let state = null;
            if (stage === '8.1') {
                record.perId !== '1' ? state = '1' : state = '2';
            }
            if (stage === '8.2') {
                record.perId === '1' ? state = '1' : state = '2';
            }
            hashHistory.push(`/re-checked/re-checked-detail/finance/${record.borrowerId}/${record.productId}/${record.auditId ? record.auditId : null}/${state}`)
        } else {
            if (record.perId !== '1') {
                hashHistory.push(`/finance/finance-detail/${record.borrowerId}/${record.productId}`);
            } else {
                hashHistory.push(`/re-checked/re-checked-detail/finance/${record.borrowerId}/${record.productId}/${record.auditId ? record.auditId : null}/2`)
            }
        }
    };

    _onTableChange = (pagination, filters, sorter) => {
        let pageIndex = pagination.current;
        this.setState({pageIndex});
        if (!this.state.isLoading) {
            this.setState({isLoading: true});
        }
        session.set(FTCPIndex, pageIndex);
        this._getTableData(pageIndex);
    };

    _getDeadlineUnit = (pageIndex) => {
        request(api.loanTermUnit, {}, 'get', session.get('token'))
            .then(res => {
                if (res.success) {
                    this.setState({
                        loanTermUnitArr: res.data,
                    }, () => this._getRepaymentMethod(pageIndex));
                }
            })
    };

    _getRepaymentMethod = (pageIndex) => {
        request(api.repaymentType, {}, 'get', session.get('token'))
            .then(res => {
                if (res.success) {
                    this.setState({
                        repaymentMethodArr: res.data,
                    }, () => this._onSearchButtonPress('1', pageIndex));
                }
            });
    };

    _getLoanTerm = (text, record) => {
        let deadline = '';
        for (let item of this.state.loanTermUnitArr) {
            if (item.value === record.deadlineUnit) {
                deadline = `${text}${item.label}`;
                break;
            }
        }
        return deadline;
    };

    _getRepaymentMethodName = (text) => {
        let repaymentMethod = '';
        for (let item of this.state.repaymentMethodArr) {
            if (item.value === text) {
                repaymentMethod = item.label;
                break;
            }
        }
        return repaymentMethod;
    };

    _onSearchButtonPress = (buttonType, pageIndex = this.state.pageIndex) => {
        const {getFieldsValue} = this.props.form;
        const fieldsValue = getFieldsValue();
        const formQueryObject = {
            name: fieldsValue[SearchItemArr[0].fieldName] === undefined ? '' : fieldsValue[SearchItemArr[0].fieldName],
            filingDate: fieldsValue[SearchItemArr[1].fieldName] ? moment(fieldsValue[SearchItemArr[1].fieldName]).format('YYYY-MM-DD') : '',
            refundWar: fieldsValue[SearchItemArr[2].fieldName] === undefined ? '' : fieldsValue[SearchItemArr[2].fieldName],
            proName: fieldsValue[SearchItemArr[4].fieldName] === undefined ? '' : fieldsValue[SearchItemArr[4].fieldName],
            salesman: fieldsValue[SearchItemArr[6].fieldName] === undefined ? '' : fieldsValue[SearchItemArr[6].fieldName],
            pageSize: this.state.pageSize,
            menuStages: "['9', '10', '11']",
            queryStages: fieldsValue[SearchItemArr[3].fieldName] === undefined ? '[]' : fieldsValue[SearchItemArr[3].fieldName],
            companyBy: fieldsValue[SearchItemArr[5].fieldName] === undefined ? '' : fieldsValue[SearchItemArr[5].fieldName],
            beforeValueDate: fieldsValue['loanTimeRangeStart'] ? moment(fieldsValue['loanTimeRangeStart']).format('YYYY-MM-DD') : '',
            laterValueDate: fieldsValue['loanTimeRangeEnd'] ? moment(fieldsValue['loanTimeRangeEnd']).format('YYYY-MM-DD') : '',
            beforePredictDate: fieldsValue['predictDateStart'] ? moment(fieldsValue['predictDateStart']).format('YYYY-MM-DD') : '',
            laterPredictDate: fieldsValue['predictDateEnd'] ? moment(fieldsValue['predictDateEnd']).format('YYYY-MM-DD') : '',
            beforeRealityDate: fieldsValue['realityDateStart'] ? moment(fieldsValue['realityDateStart']).format('YYYY-MM-DD') : '',
            laterRealityDate: fieldsValue['realityDateEnd'] ? moment(fieldsValue['realityDateEnd']).format('YYYY-MM-DD') : '',
            isOverDue: fieldsValue[SearchItemArr[10].fieldName] ? fieldsValue[SearchItemArr[10].fieldName] : '',
            contractNo: fieldsValue[SearchItemArr[11].fieldName] ? fieldsValue[SearchItemArr[11].fieldName] : '',
        };

        session.set(FSQOKey, formQueryObject);
        this.setState({formQueryObject});

        if (buttonType === '1' || buttonType === '4') {
            this.setState({isLoading: true});
            this._getTableData(pageIndex, formQueryObject);
        } else if (buttonType === '2' || buttonType === '3') {
            this._dateCheck(buttonType, formQueryObject);
        }
    };

    _getTableData = (pageIndex, formQueryObject = this.state.formQueryObject) => {
        const params = {
            pageNo: pageIndex,
            ...formQueryObject,
        };
        request(api.loansFinanceList, params, 'post', session.get('token'))
            .then(res => {
                if (res.success && res.data.count > 0) {
                    let dataArr = [];
                    res.data.list.forEach(item => {
                        const {
                            id, customerBy, contractNo, proType, proCategory, proName, lendMoney, filingDate, deadline,
                            deadlineUnit, refundWar, company, salesman, dictStage, stage, valueDate, audit, perId,
                        } = item;
                        dataArr.push({
                            productId: id,
                            borrowerId: customerBy.id,          // 借款人id
                            name: customerBy.name,              // 借款人姓名
                            contractNumber: contractNo,         // 合同编号
                            idCard: customerBy.certificateNo,   // 借款人身份证号
                            phoneNumber: customerBy.phone,      // 借款人电话号码
                            product: proName,                   // 产品名称
                            loanMount: lendMoney,               // 借款金额
                            applicationTime: customerBy.enteringDate,      // 申请时间
                            loanTerm: deadline,                 // 借款期限
                            deadlineUnit,
                            repaymentMethod: refundWar,         // 还款方式
                            branchOffice: company.name,         // 分公司
                            salesman: salesman,                 // 业务员
                            status: dictStage.label,
                            stage,                              // 还款状态 '11'：还款完成
                            valueDate,
                            auditId: audit.id ? audit.id : null,
                            auditState: audit.state,
                            perId: perId,
                        });
                    });
                    this.setState({
                        tableDataSource: dataArr,
                        paginationObject: {total: res.data.count, current: pageIndex},
                    });
                } else if (res.success && res.data.count === 0) {
                    //message.warn('暂没有数据');
                    this.setState({
                        tableDataSource: [],
                        paginationObject: {total: 0},
                    });
                } else {
                    this.setState({
                        tableDataSource: [],
                        paginationObject: {total: 0},
                    });
                    message.error('请求失败');
                }
                this.setState({isLoading: false});
            })
            .catch(err => {
                message.error('请求服务异常');
                this.setState({
                    isLoading: false,
                    tableDataSource: [],
                    paginationObject: {total: 0},
                });
            });
    };

    _onHandleFormReset = () => {
        this.props.form.resetFields();
        this.setState({searchItemArr: SearchItemArr}, () => {
            this._onSearchButtonPress('4', 1);
        });
    };

    _onRepaymentDetailAndList = (buttonType, params) => {
        const controller = buttonType === '2' ? api.repaymentDetail : api.repaymentListTotal;
        const url = 'http://' + window.location.hostname + '/lhb-manage/a/rest' + controller;
        const urlWithParams = url + '?' + toQueryStr(params);
        window.open(urlWithParams);
    };

    _dateCheck = (buttonType, formQueryObject) => {
        const timeSpan = buttonType === '2' ? 7 : 31;
        const msg = '段选择≤';
        const {
            beforeValueDate,
            laterValueDate,
            beforePredictDate,
            laterPredictDate,
            beforeRealityDate,
            laterRealityDate,
        } = formQueryObject;
        const boolValue = [
            {
                value: beforeValueDate && laterValueDate,
                label: '放款时间',
                before: beforeValueDate,
                later: laterValueDate
            },
            {
                value: beforePredictDate && laterPredictDate,
                label: '应还时间',
                before: beforePredictDate,
                later: laterPredictDate
            },
            {
                value: beforeRealityDate && laterRealityDate,
                label: '实还时间',
                before: beforeRealityDate,
                later: laterRealityDate
            },
        ];
        if (boolValue[0].value || boolValue[1].value || boolValue[2].value) {
            for (let i = 0; i < boolValue.length; i++) {
                const item = boolValue[i];
                if (item) {
                    const nextDate = moment(item.before).add(timeSpan, 'days').format("YYYY-MM-DD");
                    if (moment(nextDate) < moment(item.later)) {
                        Modal.info({
                            title: '提示',
                            content: `${item.label}${msg}${timeSpan}天`,
                        });
                        return;
                    }
                }
            }
            this._onRepaymentDetailAndList(buttonType, formQueryObject);
        } else {
            Modal.info({
                title: '提示',
                content: `放款时间、应还时间、实还时间请至少选一个`,
            });
        }
    };

    render() {
        const {searchItemArr} = this.state;
        return (
            <div className='table-list'>
                <Card bordered={false}>
                    <h1>财务列表</h1>
                    <Form layout='inline' className='ant-form-my'>
                        <FinanceSearch
                            form={this.props.form}
                            itemArr={searchItemArr}
                        />
                        <Button
                            type='primary'
                            htmlType='submit'
                            className='green-style'
                            onClick={() => this._onSearchButtonPress('1', 1)}
                        >
                            查询
                        </Button>
                        <Button
                            style={{marginLeft: 8}}
                            onClick={this._onHandleFormReset}
                            className='default-btn'
                        >
                            重置
                        </Button>
                        <Button
                            style={{marginLeft: 8}}
                            onClick={() => this._onSearchButtonPress('2')}
                            className='green-style'
                        >
                            导出还款明细
                        </Button>
                        <Button
                            style={{marginLeft: 8}}
                            onClick={() => this._onSearchButtonPress('3')}
                            className='green-style'
                        >
                            导出还款汇总
                        </Button>
                        <Button
                            style={{marginLeft: 8}}
                            className='default-btn'
                        >
                            <Icon
                                type='question-circle'
                                theme='filled'
                                style={{fontSize: '16px', color: '#ffb736'}}
                            />
                            导出还款明细时，时间段选择≤7天；导出还款汇总时，时间段选择≤31天
                        </Button>
                    </Form>
                    <Table
                        bordered
                        loading={this.state.isLoading}
                        rowKey='ident'
                        columns={this._tableColumns}
                        dataSource={this.state.tableDataSource}
                        onChange={this._onTableChange}
                        pagination={this.state.paginationObject}
                    />
                    <ApprovalProcess
                        onCancelAppPro={this._onCancelAppPro}
                        modalVisible={this.state.modalVisible}
                        productId={this.state.productId}
                    />
                </Card>
            </div>
        )
    }
}

const FinanceExport = Form.create()(Finance);
export default FinanceExport;
