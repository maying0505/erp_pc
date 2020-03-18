import React from 'react';
import './index.scss';
import {MyTitle, MyButton, MyCol} from '../components';
import {ApplyListAsset as ass} from '../assets';
import {Row, Col, Form, Select, Button, message, Table, Divider, Modal, Spin} from 'antd';
import {hashHistory} from 'react-router';
import {ColConfig, SearchCol} from '../config';
import RangePicker from 'component/rangeDatePicker';
import InputTextItem from 'component/InputTextItem';
import toQueryStr from 'common/util/toQueryStr';
import moment from 'moment';
import {request} from 'common/request/request';
import {session} from 'common/util/storage';
import api from 'common/util/api';
import ApprovalHistory from "../components/ApprovalHistory";
import {PageSize as ps, StatesArr} from '../config';
import ApprovalModal from "../approval-modal";
import CloneDeep from 'lodash.clonedeep';

const PageSize = ps;
const TableWidthS = '5%';
const TableWidthM = '6%';
const TableWidthL = '7%';
const FormItem = Form.Item;
const Option = Select.Option;
const MomentFormat = 'YYYY-MM-DD HH:mm:ss';
const RALCurrentPageIndex = 'ReimburseApplyListCurrentPageIndex';
const RALQueryObject = 'ReimburseApplyListQueryObject';


const OperateType = 'audit';

const StateArr = [
    {id: 0, label: '全部', value: ''},
    ...StatesArr,
];

const ApplySearchItem = [
    {id: 0, label: '所属机构', fieldName: 'companyId', optionArr: [], initialValue: undefined, type: 'select'},
    {id: 1, label: '所属部门', fieldName: 'departId', optionArr: [], initialValue: undefined, type: 'select'},
    {id: 2, label: '标题', fieldName: 'title', initialValue: undefined, type: 'text'},
    {id: 3, label: '事由', fieldName: 'reason', initialValue: undefined, type: 'text'},
    {
        id: 4,
        label: '申请时间',
        fieldName: ['beginDate', 'endDate'],
        initialValue: [undefined, undefined],
        type: 'rangeDate'
    },
];

class SearchForm extends React.Component {
    render() {
        const {form, applySearchItem, onSelect} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Row gutter={16}>
                {
                    applySearchItem.map(item => {
                        const {id, label, fieldName, initialValue, type, optionArr} = item;
                        switch (type) {
                            case 'rangeDate': {
                                return (
                                    <Col {...SearchCol} key={`itemArr_${id}`}>
                                        <RangePicker
                                            label={label}
                                            fieldName={fieldName}
                                            form={form}
                                            initialValue={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case 'text': {
                                return (
                                    <Col {...SearchCol} key={`itemArr_${id}`}>
                                        <InputTextItem
                                            form={form}
                                            label={label}
                                            isRequired={false}
                                            placeholder={`--请输入${label}--`}
                                            disabled={false}
                                            fieldName={fieldName}
                                            initialValue={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case 'select': {
                                return (
                                    <Col {...SearchCol} key={`itemArr_${id}`}>
                                        <FormItem label={label}>
                                            {
                                                getFieldDecorator(fieldName, {
                                                    initialValue: initialValue,
                                                })(
                                                    <Select
                                                        disabled={false}
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

class Main extends React.Component {

    state = {
        pageIndex: 1,
        pageSize: PageSize,
        formQueryObject: null,
        isLoading: false,
        spinLoading: false,
        tableDataSource: [],
        paginationObject: {total: 0, pageSize: PageSize, current: 0},
        searchItem: ApplySearchItem,
        instId: null,
        approvalTitle: null,
        approvalModalVisible: false,
        approvalFormJson: null,
        approvalOperateType: null,
        approvalProcessId: null,

        auditTaskId: null,
        auditNodeId: null,
        auditNodeType: null,
    };

    _departmentArr = [];

    _tableColumns = [
        {
            title: '申请时间',
            width: TableWidthM,
            dataIndex: 'createDate',
        },
        {
            title: '所属机构',
            width: TableWidthM,
            dataIndex: 'companyName',
        },
        {
            title: '所属部门',
            width: TableWidthS,
            dataIndex: 'departName',
        },
        {
            title: '标题',
            width: TableWidthM,
            dataIndex: 'title',
        },
        {
            title: '事由',
            width: TableWidthM,
            dataIndex: 'reason',
        },
        {
            title: '状态',
            width: TableWidthS,
            dataIndex: 'stateName',
            //render: (text) => this._getStatusNameByCode(text),
        },
        {
            title: '操作',
            width: TableWidthL,
            dataIndex: '',
            render: (text, record) => {
                const {id, title, instId} = record;
                return (
                    <span key={`${id}_edit`}>
                        <a onClick={() => this._editAndCheck('audit', id, title, instId)}>
                            审核
                        </a>
                    </span>
                )
            }
        },
    ];

    componentDidMount() {
        this._onSearchButtonPress();
        this._company();
    }

    _onSelect = ({value, option, fieldName}) => {
        const {form: {setFieldsValue}} = this.props;
        if (fieldName === 'companyId') {
            let {searchItem} = this.state;
            const temp = this._departmentArr.filter(item => item.companyId === value);
            searchItem[1].optionArr = [
                {value: '', label: '全部'},
                ...temp[0].department,
            ];
            setFieldsValue({[searchItem[1]['fieldName']]: undefined});
            this.setState({
                searchItem,
            });
        }
    };

    _onAddApply = () => {
        const url = `/approval-add`;
        hashHistory.push(url);
    };

    _onHandleFormReset = () => {
        const {form} = this.props;
        form.resetFields();
        this._onSearchButtonPress();
    };

    _onSearchButtonPress = () => {
        const {form} = this.props;
        const {getFieldsValue} = form;
        const fieldsValue = getFieldsValue();
        const {beginDate, endDate, reason, state, title, companyId, departId} = fieldsValue;
        if (beginDate && endDate) {
            if (moment(endDate).isAfter(beginDate)) {

            } else {
                message.warning('结束时间不能大于开始时间');
                return;
            }
        }
        const formQueryObject = {
            reason,
            state,
            title,
            companyId,
            departId,
            beginDate: beginDate ? moment(beginDate).format(MomentFormat) : '',
            endDate: endDate ? moment(endDate).format(MomentFormat) : '',
        };
        this.setState({
            formQueryObject,
            isLoading: true,
        });
        this._getTableData(this.state.pageIndex, formQueryObject);
    };

    _getTableData = (pageIndex, queryObject = this.state.formQueryObject) => {
        const {isLoading} = this.state;
        if (!isLoading) {
            this.setState({isLoading: true});
        }
        const {pageSize} = this.state;
        const params = {
            pageSize,
            pageNo: pageIndex,
            ...queryObject,
        };
        console.log('params', params);

        request(api.willBeChecked, params, 'post', session.get('token'))
            .then(res => {
                console.log('res', res);
                if (res.success) {
                    const {list, count} = res.data;
                    this.setState({
                        isLoading: false,
                        tableDataSource: list,
                        paginationObject: {
                            ...this.state.paginationObject,
                            total: count,
                            current: pageIndex,
                        },
                    });
                } else {
                    const msg = res.message ? res.message : '请求失败';
                    message.error(msg);
                    this.setState({isLoading: false});
                }
            })
            .catch(err => {
                message.error('请求服务异常');
                this.setState({isLoading: false});
                console.log('err', err);
            });

    };

    _company = () => {
        request(api.company, {}, 'get', session.get('token'))
            .then(res => {
                if (res.success) {
                    let arr = [];
                    res.data.forEach(item => {
                        arr.push({value: item.id, label: item.name, id: item.id});
                        this._department(item.id);
                    });
                    const searchItem = CloneDeep(ApplySearchItem);
                    searchItem[0].optionArr = arr;
                    console.log('searchItem', searchItem);
                    this.setState({
                        searchItem,
                    });
                } else {
                    const msg = res.message ? res.message : '请求失败';
                    message.error(msg);
                }
            })
            .catch(err => {
                message.error('请求服务异常');
            });
    };

    _department = (companyId) => {
        request(api.department + companyId, {}, 'get', session.get('token'))
            .then(res => {
                if (res.success) {
                    let arr = [];
                    res.data.forEach(item => {
                        arr.push({value: item.id, label: item.name, id: item.id});
                    });
                    this._departmentArr.push({companyId: companyId, department: arr});
                } else {
                    const msg = res.message ? res.message : '请求失败';
                    message.error(msg);
                }
            })
            .catch(err => {
                message.error('请求服务异常');
            });
    };

    _onTableChange = (pagination, filters, sorter) => {
        const pageIndex = pagination.current;
        this._getTableData(pageIndex);
    };

    _getStatusNameByCode = (code) => {
        switch (code) {
            case StatesArr[0].value:
                return StatesArr[0].label;
            case StatesArr[1].value:
                return StatesArr[1].label;
            case StatesArr[2].value:
                return StatesArr[2].label;
            case StatesArr[3].value:
                return StatesArr[3].label;
            case StatesArr[4].value:
                return StatesArr[4].label;
        }
    };

    _onCancel = () => {
        this.setState({modalVisible: false});
    };

    _editAndCheck = (operateType, id, title, instId) => {
        const url = api.auditInfo;
        this._editAndCheckInfo({url, operateType, title, instId, taskId: id,});
    };

    _editAndCheckInfo = (params) => {
        request(params.url, {taskId: params.taskId}, 'post', session.get('token'))
            .then(res => {
                console.log('_editAndCheckInfo res', res);
                let msg = '';
                let approvalModalVisible = false;
                let approvalFormJson = null;
                let auditTaskId = null;
                let auditNodeId = null;
                let auditNodeType = null;
                if (res.success) {
                    approvalModalVisible = true;
                    auditTaskId = res.data.taskId;
                    auditNodeId = res.data.nodeId;
                    auditNodeType = res.data.nodeType;
                    approvalFormJson = res.data.formJsonObj.data;
                } else {
                    msg = res.message ? res.message : '请求失败';
                    message.info(msg);
                }
                this.setState({
                    auditTaskId,
                    auditNodeId,
                    auditNodeType,
                    approvalFormJson,
                    approvalModalVisible,
                    instId: params.instId,
                    approvalTitle: params.title,
                    approvalOperateType: params.operateType,
                });

            })
            .catch(err => {
                message.error('请求服务异常');
                console.log('err', err);
            });
    };

    _setModalVisible = (approvalModalVisible, refresh) => {
        this.setState({
            approvalModalVisible,
        });
        if (refresh) {
            this._getTableData(this.state.pageIndex);
        }
    };

    render() {
        console.log('this.props', this.props);
        console.log('this.state', this.state);
        const {form} = this.props;
        const {
            isLoading, tableDataSource, paginationObject, searchItem,
            spinLoading, approvalModalVisible, approvalTitle, approvalFormJson, approvalOperateType, instId, processId,
            auditTaskId, auditNodeId, auditNodeType,
        } = this.state;
        return (
            <Spin size='large' spinning={spinLoading}>
                <div className='main-page'>
                    <div className='title-view'>
                        <Row type='flex' justify='space-between' align='middle'>
                            <Col>
                                <MyTitle title='待我审核' imgSrc={ass.img.titleIcon}/>
                            </Col>
                        </Row>
                    </div>
                    <div className='search-view'>
                        <SearchForm
                            form={form}
                            applySearchItem={searchItem}
                            onSelect={this._onSelect}
                        />
                        <Row>
                            <Col>
                                <Button
                                    type='primary'
                                    className='green-style'
                                    onClick={this._onSearchButtonPress}
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
                            </Col>
                        </Row>
                    </div>

                    <div className='search-view'>
                        <Table
                            bordered
                            loading={isLoading}
                            rowKey={record => record.id}
                            columns={this._tableColumns}
                            dataSource={tableDataSource}
                            onChange={this._onTableChange}
                            pagination={paginationObject}
                        />
                    </div>
                    <ApprovalModal
                        auditTaskId={auditTaskId}
                        auditNodeId={auditNodeId}
                        auditNodeType={auditNodeType}
                        instId={instId}
                        processId={processId}
                        title={approvalTitle}
                        formJson={approvalFormJson}
                        operateType={approvalOperateType}
                        modalVisible={approvalModalVisible}
                        disabled={true}
                        setModalVisible={(v, refresh) => this._setModalVisible(v, refresh)}
                    />
                </div>
            </Spin>
        )
    }
}

const MainForm = Form.create()(Main);
export default MainForm;
