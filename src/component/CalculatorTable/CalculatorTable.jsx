import React from "react";
import {Table,} from 'antd';

const ColumnsWidthS = 80;
const ColumnsWidthM = 120;
const ColumnsWidthL = 160;

export default class RepaymentCalculatorTable extends React.Component {

    state = {
        loading: false,
    };

    newTableColumns = [];

    componentWillMount() {
        this._getTableColumns();
    }

    _onChange = () => {
    };

    _columnRender = (text, dataIndex = null, count = 2) => {
        const isNumber = !isNaN(Number(text));
        if (isNumber) {
            return String(Number(text).toFixed(count));
        } else {
            return text;
        }
    };

    _getTableColumns = () => {
        this.tableColumns = [
            {
                title: `期数/总期(${this._getLoanUnit()})`,
                dataIndex: 'totalPeriod',
                width: ColumnsWidthS,
                render: (text, records) => `${records.period}/${records.totalPeriod}`
            },
            {title: '应还时间', dataIndex: 'predictDate', width: ColumnsWidthS},
            {title: '借款总额', dataIndex: 'totalLoan', width: ColumnsWidthS},
            {
                title: `${this._getInterestUnit()}利率`,
                dataIndex: 'lendingRate',
                width: ColumnsWidthS,
                render: (text) => this._columnRender(text, 'annualInterestRate', 4)
            },
            {
                title: '服务费率(天)',
                dataIndex: 'serviceRate',
                width: ColumnsWidthS,
                render: (text) => this._columnRender(text, 'serviceRate', 4)
            },
            {
                title: `${this._getLoanUnit()}付本金`,
                dataIndex: 'payPrincipal',
                width: ColumnsWidthS,
                render: (text) => this._columnRender(text)
            },
            {
                title: `${this._getLoanUnit()}付利息`,
                dataIndex: 'monthlyInterest',
                width: ColumnsWidthS,
                render: (text) => this._columnRender(text)
            },
            {
                title: '居间服务费',
                dataIndex: 'serviceCharge',
                width: ColumnsWidthS,
                render: (text) => this._columnRender(text)
            },
            {
                title: `${this._getLoanUnit()}还款总额`,
                dataIndex: 'totalMonthlyRepayment',
                width: ColumnsWidthS,
                render: (text) => this._columnRender(text)
            },
            {
                title: `已付本金`,
                dataIndex: 'monthlyPrincipal',
                width: ColumnsWidthS,
                render: (text) => this._columnRender(text)
            },
            {
                title: '利息总计',
                dataIndex: 'totalInterest',
                width: ColumnsWidthS,
                render: (text) => this._columnRender(text)
            },
            {
                title: '还款总额',
                dataIndex: 'totalRepayment',
                width: ColumnsWidthS,
                render: (text) => this._columnRender(text)
            },
            {
                title: '综合费用',
                dataIndex: 'managementCost',
                width: ColumnsWidthS,
                render: (text) => this._columnRender(text)
            },
        ];
    };

    _getLoanUnit = (unitCode = this.props.dataSource[0].style) => {
        switch (unitCode) {
            case '1': {
                return '天';
            }
            case '2': {
                return '档';
            }
            case '3': {
                return '周';
            }
            case '4': {
                return '月';
            }
            default: {
                return '';
            }
        }
    };

    _getInterestUnit = (interestUnit = this.props.dataSource[0].aprType) => {
        switch (interestUnit) {
            case '1': {
                return '日';
            }
            case '2': {
                return '月';
            }
            case '3': {
                return '年';
            }
            default: {
                return '';
            }

        }
    };

    render() {
        const {dataSource} = this.props;
        const dataSourceFirst = dataSource[0];
        const firstKeys = Object.keys(dataSourceFirst);

        for (let index in this.tableColumns) {
            const item = this.tableColumns[index];
            const i = firstKeys.indexOf(item.dataIndex);
            if (i > -1) {
                this.newTableColumns.push(item);
            }
        }

        return (
            <Table
                scroll={{x: 1600, y: 300}}
                rowKey='id'
                columns={this.newTableColumns}
                dataSource={dataSource}
                loading={this.state.loading}
                onChange={this._onChange}
                pagination={false}
            />
        );
    }
}
