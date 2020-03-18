/*
* @Create by John on 2018/04/09
* @Desc 有产品IdH获取还款计划详情表
* */
import React from 'react';
import {Modal, message, Button} from 'antd'
import PropTypes from 'prop-types';

import api from 'common/util/api';
import {request} from 'common/request/request';
import {local, session} from 'common/util/storage';
import RepaymentCalculatorTable from 'component/CalculatorTable/CalculatorTable';

export default class RepaymentPlan extends React.Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        productId: PropTypes.string.isRequired,
        modalVisible: PropTypes.bool.isRequired,
        onCancel: PropTypes.func.isRequired,
    };

    static defaultProps = {
        modalVisible: false,
    };

    state = {
        tableDataSource: [],
        modalVisible: false,
        hasError: false,
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.modalVisible === true) {
            if (!this.state.hasError) {
                this.setState({modalVisible: nextProps.modalVisible});
            } else {
                message.warn('获取还款详情失败');
            }
        }
    }

    componentDidMount() {
        this._getTableDataSource(this.props.productId);
    }

    _getTableDataSource = (productId) => {
        request(`${api.getRepaymentPlanByProductId}${productId}`, {}, 'get', session.get('token'))
            .then(res => {
                if (res.success) {
                    if (res.data && res.data.length > 0) {
                        let tableDataSource = [];
                        res.data.forEach((item, index) => {
                            tableDataSource.push({
                                id: index,
                                ...item
                            });
                        });
                        this.setState({tableDataSource});
                    }
                } else {
                    this.setState({hasError: true});
                }
            })
            .catch(err => {
                this.setState({hasError: true});
            });
    };

    _onCancel = () => {
        this.setState({modalVisible: false});
        this.props.onCancel();
    };

    render() {
        return (
            <Modal
                title='还款详情计划表'
                width='80%'
                visible={this.state.modalVisible}
                destroyOnClose={true}
                onCancel={this._onCancel}
                footer={<Button type='primary' onClick={this._onCancel} className='green-style'>确定</Button>}
            >
                {
                    this.state.tableDataSource.length > 0 &&
                    <RepaymentCalculatorTable
                        dataSource={this.state.tableDataSource}
                    />
                }
            </Modal>
        )
    }

}
