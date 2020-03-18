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

const PageSize = ps;
const TableWidthS = '5%';
const TableWidthM = '6%';
const TableWidthL = '7%';
const FormItem = Form.Item;
const Option = Select.Option;
const MomentFormat = 'YYYY-MM-DD HH:mm:ss';
const RALCurrentPageIndex = 'ReimburseApplyListCurrentPageIndex';
const RALQueryObject = 'ReimburseApplyListQueryObject';


const TypeArr = [
    {id: 0, label: '费用报销', value: '费用报销'},
    {id: 1, label: '付款申请', value: '付款申请'},
    {id: 2, label: '财务借支', value: '财务借支'},
    {id: 3, label: '备用金申请', value: '备用金申请'},
];

const StateArr = [
    {id: 0, label: '全部', value: ''},
    ...StatesArr,
];

const ApplySearchItem = [
    {id: 0, label: '标题', fieldName: 'title', initialValue: undefined, type: 'text'},
    {id: 1, label: '事由', fieldName: 'reason', initialValue: undefined, type: 'text'},
    {
        id: 2,
        label: '申请时间',
        fieldName: ['beginDate', 'endDate'],
        initialValue: [undefined, undefined],
        type: 'rangeDate'
    },
    {id: 3, label: '状态', fieldName: 'state', optionArr: StateArr, initialValue: undefined, type: 'select'},
];

class SearchForm extends React.Component {
    render() {
        const {form, applySearchItem} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Row gutter={16}>
                {
                    applySearchItem.map(item => {
                        const {id, label, fieldName, initialValue, type} = item;
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
                                const optionArr = id === 1 ? TypeArr : StateArr;
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
        applySearchItem: ApplySearchItem,
        modalVisible: false,
        instId: null,
        approvalTitle: null,
        approvalModalVisible: false,
        approvalFormJson: null,
        approvalOperateType: null,
        approvalProcessId: null,
        approvalState: null,
    };

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
                const {id, operation, cancelFlag, processModuleId} = record;
                let jsxArr = [];
                if (operation.edit === 'true') {
                    jsxArr.push(
                        <span key={`${id}_edit`}>
                            <a onClick={() => this._editAndCheck('edit', id, processModuleId)}>
                                编辑
                            </a>
                            <Divider type='vertical'/>
                        </span>
                    )
                }
                if (operation.check === 'true') {
                    jsxArr.push(
                        <span key={`${id}_check`}>
                            <a onClick={() => this._editAndCheck('check', id)}>
                                查看
                            </a>
                            <Divider type='vertical'/>
                        </span>
                    )
                }
                if (operation.delete === 'true') {
                    jsxArr.push(
                        <span key={`${id}_delete`}>
                            <a onClick={() => this._showConfirm('delete', id)}>
                                删除
                            </a>
                            <Divider type='vertical'/>
                        </span>
                    )
                }
                if (cancelFlag !== undefined && cancelFlag === '1') {
                    jsxArr.push(
                        <span key={`${id}_cancel`}>
                            <a onClick={() => this._showConfirm('cancel', id)}>
                                撤销
                            </a>
                        </span>
                    )
                }
                return jsxArr;
            }

        },
    ];

    componentDidMount() {
        this._onSearchButtonPress();
    }

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
        const {beginDate, endDate, reason, state, title} = fieldsValue;
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

        request(api.myCreateApproval, params, 'post', session.get('token'))
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

    _editAndCheck = (operateType, id, processId = null) => {
        let url = null;
        if (operateType === 'edit') {
            url = api.editInfoById;
        } else if (operateType === 'check') {
            url = api.detailInfoById;
        }
        this._editAndCheckInfo({url, operateType, instId: id, processId});
    };

    _editAndCheckInfo = (params) => {
        request(params.url, {instId: params.instId}, 'post', session.get('token'))
            .then(res => {
                console.log('_editAndCheckInfo res', res);
                let msg = '';
                let approvalModalVisible = false;
                let approvalFormJson = null;
                let approvalTitle = null;
                let approvalState = null;
                if (res.success) {
                    approvalModalVisible = true;
                    approvalTitle = res.data.title;
                    approvalState = res.data.state;
                    approvalFormJson = res.data.formJsonObj.data;
                } else {
                    msg = res.message ? res.message : '请求失败';
                    message.info(msg);
                }
                this.setState({
                    approvalTitle,
                    approvalState,
                    approvalFormJson,
                    approvalModalVisible,
                    instId: params.instId,
                    processId: params.processId,
                    approvalOperateType: params.operateType,
                });

            })
            .catch(err => {
                message.error('请求服务异常');
                console.log('err', err);
            });
    };

    _showConfirm = (operateType, id) => {
        let titleTxt = '';
        let url = null;
        if (operateType === 'cancel') {
            titleTxt = '撤销';
            url = api.cancelApproval;
        } else if (operateType === 'delete') {
            titleTxt = '删除';
            url = api.deleteApproval;
        }
        Modal.confirm({
            title: '提示',
            content: `确认${titleTxt}该记录？`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => this._deleteReimburse({url, instId: id}),
            onCancel: () => null,
        });
    };

    _deleteReimburse = (obj) => {
        if (!obj.url) {
            return;
        }
        this.setState({spinLoading: true});
        request(obj.url, obj, 'post', session.get('token'))
            .then(res => {
                let msg = '';
                this.setState({spinLoading: false});
                if (res.success) {
                    this._getTableData(this.state.pageIndex);
                    msg = res.message ? res.message : '操作成功';
                } else {
                    msg = res.message ? res.message : '操作失败';
                }
                message.info(msg);
            })
            .catch(err => {
                this.setState({spinLoading: false});
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
            isLoading, tableDataSource, paginationObject, applySearchItem, modalVisible, tipText,
            spinLoading, approvalModalVisible, approvalTitle, approvalFormJson, approvalOperateType, instId, processId,
            approvalState,
        } = this.state;
        return (
            <Spin size='large' spinning={spinLoading}>
                <div className='main-page'>
                    <div className='title-view'>
                        <Row type='flex' justify='space-between' align='middle'>
                            <Col>
                                <MyTitle title='我发起的' imgSrc={ass.img.titleIcon}/>
                            </Col>
                            <Col>
                                <MyButton
                                    type="primary"
                                    backgroundColor={'#02a6f0'}
                                    textColor={'#fff'}
                                    onClick={this._onAddApply}
                                >
                                    新增申请
                                </MyButton>
                            </Col>
                        </Row>
                    </div>
                    <div className='search-view'>
                        <SearchForm
                            form={form}
                            applySearchItem={applySearchItem}
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
                        instId={instId}
                        processId={processId}
                        title={approvalTitle}
                        formJson={approvalFormJson}
                        approvalState={approvalState}
                        operateType={approvalOperateType}
                        modalVisible={approvalModalVisible}
                        disabled={approvalOperateType === 'check'}
                        setModalVisible={(v, refresh) => this._setModalVisible(v, refresh)}
                    />
                </div>
            </Spin>
        )
    }
}

const MainForm = Form.create()(Main);
export default MainForm;
