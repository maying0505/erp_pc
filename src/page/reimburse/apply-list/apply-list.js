import React from 'react';
import './index.scss';
import {MyTitle, MyButton, MyCol} from '../components';
import {ApplyListAsset as ass} from '../assets';
import {Row, Col, Form, Select, Button, message, Table, Divider, Modal} from 'antd';
import {hashHistory} from 'react-router';
import {ColConfig, SearchCol} from '../config';
import RangePicker from 'component/rangeDatePicker';
import toQueryStr from 'common/util/toQueryStr';
import moment from 'moment';
import {request} from 'common/request/request';
import {session} from 'common/util/storage';
import api from 'common/util/api';
import ApprovalHistory from '../components/ApprovalHistory';
import {PageSize as ps} from '../config';

const PageSize = ps;
const TableWidth = '11%';
const FormItem = Form.Item;
const Option = Select.Option;
const MomentFormat = 'YYYY-MM-DD HH:mm:ss';
const RALCurrentPageIndex = 'ReimburseApplyListCurrentPageIndex';
const RALQueryObject = 'ReimburseApplyListQueryObject';

const ApplySearchItem = [
    {id: 0, label: '申请时间', fieldName: ['startDate', 'endDate'], initialValue: [undefined, undefined]},
    {id: 1, label: '类型', fieldName: 'type', initialValue: undefined},
    {id: 2, label: '状态', fieldName: 'state', initialValue: undefined},
];

const TypeArr = [
    {id: 0, label: '费用报销', value: '费用报销'},
    {id: 1, label: '付款申请', value: '付款申请'},
    {id: 2, label: '财务借支', value: '财务借支'},
    {id: 3, label: '备用金申请', value: '备用金申请'},
];

const StateArr = [
    {id: 0, label: '待提交', value: 'init'},
    {id: 1, label: '审核中', value: 'ing'},
    {id: 2, label: '已退回', value: 'reject'},
    {id: 3, label: '已完成', value: 'pass'},
    {id: 4, label: '待放款', value: 'loan'},
    {id: 5, label: '待还款', value: 'aloan'},
];

class SearchForm extends React.Component {
    render() {
        const {form, applySearchItem} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Row gutter={16}>
                {
                    applySearchItem.map(item => {
                        const {id, label, fieldName, initialValue} = item;
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
                            case 1:
                            case 2: {
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

class ApplyList extends React.Component {

    state = {
        pageIndex: 1,
        pageSize: PageSize,
        formQueryObject: null,
        isLoading: false,
        tableDataSource: [],
        paginationObject: {total: 0, pageSize: PageSize, current: 0},
        applySearchItem: ApplySearchItem,
        modalVisible: false,
        procInstId: null,
        tipText: '',
    };

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
            render: (text, record) => {
                const {type, state, id, taskId, procInsId, businessType, showWithdrawBtn} = record;
                const myLoanType = Boolean(record.loanType);
                let jsxArr = [];
                if (showWithdrawBtn === true) {
                    jsxArr.push(
                        <span>
                            <a onClick={() => this._showConfirm('cancel', id, procInsId, businessType)}>
                                撤销
                            </a>
                            <Divider type='vertical'/>
                        </span>
                    )
                }
                if ((myLoanType === false) && (state === 'init' || state === 'reject')) {
                    jsxArr.push(
                        <span>
                            <a onClick={() => this._onOperation('apply', 'edit', type, state, id, taskId, procInsId)}>
                                编辑
                            </a>
                             <Divider type='vertical'/>
                            <a onClick={() => this._showConfirm('delete', id, procInsId, businessType)}>
                                删除
                            </a>
                        </span>
                    )
                } else if ((myLoanType === true) && (state === 'aloan' || state === 'reject' || state === 'init')) {
                    jsxArr.push(
                        <a onClick={() => this._onOperation('apply', 'edit', type, state, id, taskId, procInsId)}>
                            编辑
                        </a>
                    )
                } else {
                    jsxArr.push(
                        <a onClick={() => this._onOperation('apply', 'detail', type, state, id, taskId, procInsId)}>
                            查看
                        </a>
                    )
                }
                return jsxArr;
            }

        },
    ];

    componentDidMount() {
        this._onSearchButtonPress();
    }

    _onAddApply = (pageType, operationType, reimburseType = null, reimburseState = null, listId = null, taskId = null, procInstId = null) => {
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

    _onHandleFormReset = () => {
        const {form} = this.props;
        form.resetFields();
        this._onSearchButtonPress();
    };

    _onSearchButtonPress = () => {
        const {form} = this.props;
        const {getFieldsValue} = form;
        const fieldsValue = getFieldsValue();
        const {startDate, endDate, type, state} = fieldsValue;
        if (startDate && endDate) {
            if (moment(endDate).isAfter(startDate)) {

            } else {
                message.warning('结束时间不能大于开始时间');
                return;
            }
        }
        const formQueryObject = {
            type,
            state,
            startDate: startDate ? moment(startDate).format(MomentFormat) : '',
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

        request(api.reimburseApplyList, params, 'post', session.get('token'))
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
                message.error('请求失败');
                this.setState({isLoading: false});
            });

    };

    _onTableChange = (pagination, filters, sorter) => {
        const pageIndex = pagination.current;
        this._getTableData(pageIndex);
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

    _inspectorInfo = (procInstId) => {
        request(api.inspectorInfo + procInstId, {}, 'post', session.get('token'))
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

    _onOperationProgress = (procInstId) => {
        this._inspectorInfo(procInstId);
        this.setState({
            procInstId,
            modalVisible: true,
        });
    };

    _onOperation = (pageType, operationType, reimburseType, reimburseState = null, listId = null, taskId = null, procInstId = null) => {
        const myReimburseType = this._filter(reimburseType);
        const myReimburseState = this._filter(reimburseState);
        const myListId = this._filter(listId);
        const myTaskIde = this._filter(taskId);
        const myProcInstId = this._filter(procInstId);
        const url = `/reimburse/add-apply/${pageType}/${operationType}/${myReimburseType}/${myReimburseState}/${myListId}/${myTaskIde}/${myProcInstId}`;
        hashHistory.push(url);

        // const url = `/reimburse/add-apply/${pageType}/${operationType}/${reimburseType}/${reimburseState}/${listId}/${taskId}/${procInstId}`;
        // hashHistory.push(url);
    };

    _onCancel = () => {
        this.setState({modalVisible: false});
    };

    _showConfirm = (operateType, id, procInsId, businessType) => {
        let titleTxt = '';
        let url = null;
        if (operateType === 'cancel') {
            titleTxt = '撤销';
            url = api.reimburseCancel;
        } else if (operateType === 'delete') {
            titleTxt = '删除';
            url = api.reimburseDelete;
        }
        Modal.confirm({
            title: '提示',
            content: `确认${titleTxt}该记录？`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => this._deleteReimburse({url, id, procInsId, businessType}),
            onCancel: () => null,
        });
    };

    _deleteReimburse = (obj) => {
        if (!obj.url) {
            return;
        }
        request(obj.url, {...obj}, 'get', session.get('token'))
            .then(res => {
                let msg = '';
                if (res.success) {
                    this._getTableData(this.state.pageIndex);
                    msg = res.message ? res.message : '删除成功';
                } else {
                    msg = res.message ? res.message : '删除失败';
                }
                message.info(msg);
            })
            .catch(err => {
                message.error('请求服务异常');
            });
    };

    render() {
        console.log('this.props', this.props);
        const {form} = this.props;
        const {isLoading, tableDataSource, paginationObject, applySearchItem, modalVisible, procInstId, tipText} = this.state;
        return (
            <div className='apply-list'>
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
                                onClick={() => this._onAddApply('add', 'add')}
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
                        tipText && <div className="green-box" style={{margin: '20px 0', padding: '10px'}}>
                            {tipText}</div>
                    }
                </Modal>
            </div>
        )
    }
}

const ApplyListForm = Form.create()(ApplyList);
export default ApplyListForm;
