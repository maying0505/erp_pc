import React from 'react';
import '../../verify-list/index.scss';
import {message, Table} from 'antd';
import {request} from 'common/request/request';
import {session} from 'common/util/storage';
import api from 'common/util/api';

const TableWidthSS = '6%';
const TableWidth = '10%';
const TableWidthLS = '13%';

export default class ApprovalHistory extends React.Component {

    state = {
        isLoading: true,
        tableDataSource: [],
    };

    _tableColumns = [
        {
            title: '流程',
            width: TableWidth,
            dataIndex: 'name',
        },
        {
            title: '时间',
            width: TableWidthLS,
            dataIndex: 'time',
        },
        {
            title: '操作员',
            width: TableWidth,
            dataIndex: 'auditName',
        },
        {
            title: '结果',
            width: TableWidthSS,
            dataIndex: 'state',
        },
        {
            title: '意见或原因',
            width: TableWidth,
            dataIndex: 'message',
            render: (text) => text !== 'null' ? text : '',
        },
    ];

    componentDidMount() {
        this._getData();
    }

    _getData = () => {
        const {procInstId} = this.props;
        request(api.approvalHistory + procInstId, {}, 'get', session.get('token'))
            .then(res => {
                let ds = [];
                if (res.success) {
                    ds = res.data;
                } else {
                    const msg = res.message ? res.message : '请求失败';
                    message.error(msg);
                }
                this.setState({
                    isLoading: false,
                    tableDataSource: ds,
                });
            })
            .catch(err => {
                this.setState({isLoading: false});
                message.error('请求服务异常');
            });
    };

    render() {
        const {isLoading, tableDataSource} = this.state;
        return (
            <Table
                scroll={{x: 700}}
                bordered
                loading={isLoading}
                rowKey={'id'}
                columns={this._tableColumns}
                dataSource={tableDataSource}
                pagination={false}
            />
        )
    }
}
