import React from 'react';
import './index.scss';
import {Button, Col, Row, Form, Select, message, Table, Divider, Modal} from "antd";
import {ApplyListAsset as ass} from "../assets";
import {MyButton, MyTitle, ApprovalHistory} from "../components";
import {ColConfig, SearchCol} from "../config";

import RangePicker from 'component/rangeDatePicker';
import InputTextItem from 'component/InputTextItem';
import {request} from 'common/request/request';
import {session} from 'common/util/storage';
import api from 'common/util/api';
import toQueryStr from 'common/util/toQueryStr';
import moment from 'moment';
import {hashHistory} from "react-router";
import CloneDeep from 'lodash.clonedeep';
import {PageSize as ps} from '../config';
import LodashDebounce from 'common/util/debounce';

const PageSize = ps;
const TableWidth = '11%';
const FormItem = Form.Item;
const Option = Select.Option;
const MomentFormat = 'YYYY-MM-DD HH:mm:ss';

const TypeArr = [
    {id: 0, label: '费用报销', value: '费用报销'},
    {id: 1, label: '付款申请', value: '付款申请'},
    {id: 2, label: '财务借支', value: '财务借支'},
    {id: 3, label: '备用金申请', value: '备用金申请'},
];

const StateArr = [
    {id: 0, label: '已完成', value: 'pass'},
    {id: 1, label: '待还款', value: 'aloan'},
];

const SearchItem = [
    {id: 0, label: '申请时间', fieldName: ['startDate', 'endDate'], initialValue: [undefined, undefined]},
    {id: 1, label: '所属机构', fieldName: 'companyName', optionArr: [], initialValue: undefined},
    {id: 2, label: '所属部门', fieldName: 'deptName', optionArr: [], initialValue: undefined},
    {id: 3, label: '申请人', fieldName: 'name', initialValue: undefined},
    {id: 4, label: '类型', fieldName: 'type', optionArr: TypeArr, initialValue: undefined},
    {id: 5, label: '状态', fieldName: 'state', optionArr: StateArr, initialValue: undefined},
    {id: 6, label: '金额', fieldName: 'money', initialValue: undefined},
];

class SearchForm extends React.Component {
    render() {
        const {form, searchItem, onSelect} = this.props;
        const {getFieldDecorator} = form;
        console.log('this.props', this.props);
        return (
            <Row gutter={16}>
                {
                    searchItem.map(item => {
                        const {id, label, fieldName, initialValue, optionArr} = item;
                        switch (id) {
                            case 0: {
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
                            case 6:
                            case 3: {
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
                            case 1:
                            case 2:
                            case 4:
                            case 5: {
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
                                                                        id={i.id}
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

class VerifeidList extends React.Component {

    state = {
        pageIndex: 1,
        pageSize: PageSize,
        formQueryObject: null,
        isLoading: false,
        tableDataSource: [],
        paginationObject: {total: 0, pageSize: PageSize, current: 0},
        searchItem: SearchItem,
        modalVisible: false,
        procInstId: null,
        tipText: '',
    };

    _departmentArr = [];

    _tableColumns = [
        {
            title: '申请时间',
            width: TableWidth,
            dataIndex: 'createDate',
        },
        {
            title: '所属机构',
            width: TableWidth,
            dataIndex: 'companyName',
        },
        {
            title: '所属部门',
            width: TableWidth,
            dataIndex: 'deptName',
        },
        {
            title: '申请人',
            width: TableWidth,
            dataIndex: 'name',
        },
        {
            title: '类型',
            width: TableWidth,
            dataIndex: 'type',
        },
        {
            title: '金额（元）',
            width: TableWidth,
            dataIndex: 'money',
        },
        {
            title: '状态',
            width: TableWidth,
            dataIndex: 'state',
            render: (text) => this._getStatusNameByCode(text),
        },
        {
            title: '审核流程',
            width: TableWidth,
            dataIndex: '',
            render: (text, record) => (
                <a onClick={() => this._onOperationProgress(record.procInsId)}>
                    查看流程
                </a>
            ),
        },
        {
            title: '操作',
            width: TableWidth,
            dataIndex: '',
            render: (text, record) => (
                <a onClick={() => this._onOperationVerify('exportList', 'exportList', record.type, record.state, record.id, record.taskId, record.procInsId)}>
                    查看
                </a>
            )
        },
    ];

    componentDidMount() {
        this._onSearchButtonPress('search');
        this._company();
    }

    _onSelect = ({value, option, fieldName}) => {
        const {form: {setFieldsValue}} = this.props;
        if (fieldName === 'companyName') {
            let {searchItem} = this.state;
            const temp = this._departmentArr.filter(item => item.companyId === option.props.id);
            searchItem[2].optionArr = [
                {value: '', label: '全部'},
                ...temp[0].department,
            ];
            setFieldsValue({[searchItem[2]['fieldName']]: undefined});
            this.setState({
                searchItem,
            });
        }
    };

    _onHandleFormReset = () => {
        const {form} = this.props;
        form.resetFields();
        this._onSearchButtonPress();
    };

    _onSearchButtonPress = (buttonType) => {
        const {form} = this.props;
        const {getFieldsValue} = form;
        const fieldsValue = getFieldsValue();
        console.log('fieldsValue', fieldsValue);
        const {startDate, endDate, type, companyName, deptName, name, state, money} = fieldsValue;
        if (startDate && endDate) {
            if (moment(endDate).isAfter(startDate)) {

            } else {
                message.warning('结束时间不能大于开始时间');
                return;
            }
        }
        const formQueryObject = {
            name,
            type,
            state,
            money,
            companyName,
            deptName,
            startDate: startDate ? moment(startDate).format(MomentFormat) : '',
            endDate: endDate ? moment(endDate).format(MomentFormat) : '',
        };

        if (buttonType === 'search') {
            this.setState({
                formQueryObject,
                isLoading: true,
            });
            this._getTableData(this.state.pageIndex, formQueryObject);
        } else if (buttonType === 'export') {
            this._onWindowOpen(formQueryObject);
        }

    };

    _onSearchButtonPressLodashDebounce = LodashDebounce((buttonType) => this._onSearchButtonPress(buttonType));

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
        console.log('api.exportList', api.exportList);
        request(api.exportList, params, 'post', session.get('token'))
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
            });
    };

    _onWindowOpen = (obj) => {
        const controller = api.exportExcel;
        const url = 'http://' + window.location.hostname + '/lhb-manage/a/rest' + controller;
        const newObj = {};
        for (let key in obj) {
            if (obj[key]) {
                Object.assign(newObj, {[key]: obj[key]});
            }
        }
        const params = toQueryStr(newObj);
        const urlWithParams = `${url}${params}`;
        window.open(urlWithParams);
    };

    _onTableChange = (pagination, filters, sorter) => {
        const pageIndex = pagination.current;
        this._getTableData(pageIndex);
    };

    _onOperationProgress = (procInstId) => {
        this._inspectorInfo(procInstId);
        this.setState({
            procInstId,
            modalVisible: true,
        });
    };

    _onOperationVerify = (pageType, operationType, reimburseType = null, reimburseState = null, listId = null, taskId = null, procInstId = null) => {
        const myReimburseType = this._filter(reimburseType);
        const myReimburseState = this._filter(reimburseState);
        const myListId = this._filter(listId);
        const myTaskIde = this._filter(taskId);
        const myProcInstId = this._filter(procInstId);
        const url = `/reimburse/add-apply/${pageType}/${operationType}/${myReimburseType}/${myReimburseState}/${myListId}/${myTaskIde}/${myProcInstId}`;
        hashHistory.push(url);
    };

    // 过滤非法情况
    _filter = (value) => {
        return value ? value : null;
    };

    _getStatusNameByCode = (code) => {
        switch (code) {
            case 'init':
                return '待提交';
            case 'ing':
                return '审核中';
            case 'reject':
                return '已退回';
            case 'pass':
                return '已完成';
            case 'loan':
                return '待放款';
            case 'aloan':
                return '待还款';
        }
    };

    _company = () => {
        request(api.company, {}, 'get', session.get('token'))
            .then(res => {
                if (res.success) {
                    let arr = [];
                    res.data.forEach(item => {
                        arr.push({value: item.name, label: item.name, id: item.id});
                        this._department(item.id);
                    });
                    const searchItem = CloneDeep(SearchItem);
                    searchItem[1].optionArr = arr;
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
                        arr.push({value: item.name, label: item.name, id: item.id});
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

    _onCancel = () => {
        this.setState({modalVisible: false});
    };

    _inspectorInfo = (procInsId) => {
        request(api.inspectorInfo + procInsId, {}, 'post', session.get('token'))
            .then(res => {
                console.log('res', res);
                if (res.success) {
                    this.setState({
                        tipText: res.data
                    });
                } else {
                    const msg = res.message ? res.message : '请求失败';
                    message.error(msg);
                    this.setState({isLoading: false});
                }
            })
            .catch(err => {
                console.log('err', err);
                message.error('请求失败');
            });
    };

    render() {
        const {form} = this.props;
        const {searchItem, isLoading, paginationObject, tableDataSource, modalVisible, procInstId, tipText} = this.state;
        console.log('this._departmentArr', this._departmentArr);
        return (
            <div className='export-list'>
                <div className='title-view'>
                    <Row type='flex' justify='space-between' align='middle'>
                        <Col>
                            <MyTitle title='报销列表' imgSrc={ass.img.titleIcon}/>
                        </Col>
                    </Row>
                </div>

                <div className='search-view'>
                    <SearchForm
                        form={form}
                        searchItem={searchItem}
                        onSelect={this._onSelect}
                    />
                    <Row>
                        <Col>
                            <Button
                                type='primary'
                                className='green-style'
                                onClick={() => this._onSearchButtonPressLodashDebounce('search')}
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
                                type='primary'
                                className='green-style'
                                onClick={() => this._onSearchButtonPressLodashDebounce('export')}
                            >
                                导出excel
                            </Button>
                        </Col>
                    </Row>
                </div>

                <div className='search-view'>
                    <Table
                        bordered
                        loading={isLoading}
                        rowKey='id'
                        columns={this._tableColumns}
                        dataSource={tableDataSource}
                        onChange={this._onTableChange}
                        pagination={paginationObject}
                    />
                </div>

                <Modal
                    title='流程信息'
                    visible={modalVisible}
                    onCancel={this._onCancel}
                    destroyOnClose={true}
                    width='800px'
                    footer={<Button type='primary' onClick={this._onCancel} className='green-style'>确定</Button>}
                >
                    <div style={{maxHeight: '400px', overflow: 'auto'}}>
                        <ApprovalHistory
                            procInstId={procInstId}
                        />
                    </div>
                    {
                        tipText &&
                        <div className="green-box" style={{margin: '20px 0', padding: '10px'}}>
                            {tipText}
                        </div>
                    }
                </Modal>
            </div>
        )
    }
}

const VerifiedListForm = Form.create()(VerifeidList);
export default VerifiedListForm;
