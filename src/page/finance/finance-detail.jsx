/*
* @Create by John on 2018/03/28
* @Desc 放款详情
* */

import React from 'react';
import {Card, Tabs, Button, Icon} from 'antd';

import './index.scss';
import api from 'common/util/api';
import {request} from 'common/request/request';
import {local, session} from 'common/util/storage';

const TabPane = Tabs.TabPane;

import FinanceDetailFinanceInfo from './finance-detail-finance-info';
import FinanceDetailLoanInfo from './finance-detail-loan-info';
import {message} from 'antd';


export default class FinanceDetail extends React.Component {

    state = {
        productStage: null,
        isDefer: null,
        deferDate: undefined,
        ifShowPriBorrInfo: false,
    };

    _setProductStage = (productStage) => {
        this.setState({productStage});
    };

    componentDidMount() {
        const {productId} = this.props.params;
        this._getEndDate(productId);
    }

    // 根据产品id查询展期起息日和是否是展期
    _getEndDate = (productId) => {
        request(api.getEndDate + productId, {}, 'get', session.get('token'))
            .then(res => {
                if (res.success) {
                    if (res.data.valueDate) {
                        this.setState({
                            isDefer: res.data.isDefer === '是',
                            deferDate: res.data.valueDate,
                        });
                    }
                } else {
                    let msg = '请求失败';
                    if (res.message) {
                        msg = res.message;
                    }
                    message.error(msg);
                }
            })
            .catch(err => {
                message.error('请求服务异常');
            });
    };

    _exchangePriBorrInfoState = () => {
        this.setState(prevState => ({
            ifShowPriBorrInfo: !prevState.ifShowPriBorrInfo
        }));
    };

    render() {
        const {borrowerId, productId} = this.props.params;
        const {productStage, isDefer, deferDate, ifShowPriBorrInfo} = this.state;
        const title = (isDefer ? '展期' : '') + '放款详情';
        return (
            <Card bordered={false}>
                <h1 className="detail-title">{title}</h1>
                <Tabs defaultActiveKey="finance_tabPane_1">
                    <TabPane tab="借款信息" key="finance_tabPane_1">
                        <FinanceDetailFinanceInfo
                            isDefer={isDefer}
                            deferDate={deferDate}
                            borrowerId={borrowerId}
                            productId={productId}
                            setProductStage={this._setProductStage}
                            ifShowPriBorrInfo={ifShowPriBorrInfo}
                            exchangeShowPriBorrInfo={this._exchangePriBorrInfoState}
                        />
                    </TabPane>

                    <TabPane tab="还款信息" key="finance_tabPane_2"
                             disabled={productStage && Number(productStage) <= 9}>
                        <FinanceDetailLoanInfo
                            isDefer={isDefer}
                            deferDate={deferDate}
                            productId={productId}
                        />
                    </TabPane>
                </Tabs>
                {
                    isDefer &&
                    <Button onClick={this._exchangePriBorrInfoState} className='green-style f-right-btn'>
                        <Icon type="folder-open"/><span>原借款信息</span>
                    </Button>
                }
            </Card>
        )
    }
}

