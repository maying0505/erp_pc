import React from 'react';
import PropTypes from 'prop-types';
import {Spin, Modal, Table, Button} from 'antd';
import api from 'api'
import {request} from 'common/request/request.js'
import {session} from 'common/util/storage.js'

const _modalTableColumns = [
    {title: '时间', dataIndex: 'submitTime', width: 50},
    {title: '处理人员', dataIndex: 'userBy.name', width: 50},
    {title: '信息', dataIndex: 'historyStage.label', width: 50},
    {title: '结果', dataIndex: 'historyResult.label', width: 50},
]

class ApprovalProcess extends React.Component {
    static propTypes = {
        productId: PropTypes.string.isRequired,
        modalTableColumns: PropTypes.array,
        modalVisible: PropTypes.bool,
        apiUrl: PropTypes.string,
        ifModal: PropTypes.bool,
        onCancelAppPro: PropTypes.func
    };

    static defaultProps = {
        modalTableColumns: _modalTableColumns,
        modalVisible: false,
        ifModal: true,
        onCancelAppPro: () => {
        },
        apiUrl: api.notGroupAuditHistory
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            modalVisible: this.props.modalVisible,
            modalTableDataSource: [],
            tipText: ''
        }
    }

    componentDidMount() { //预加载数据
        if (this.props.productId && this.props.productId !== '') {
            this.loadlists() //获取数据列表
        } else {
            this.setState({loading: false})
        }
    }

    componentWillReceiveProps(nextProps) { //组件接收到新的props时调用
        if (nextProps.modalVisible !== this.state.modalVisible || (nextProps.productId !== this.props.productId && nextProps.productId && nextProps.productId !== '')) {
            this.setState({
                modalVisible: nextProps.modalVisible,
                loading: true
            }, function () {
                this.loadlists() //获取数据列表
            })
        }
        else {
            this.setState({loading: false})
        }
    }

    loadlists() { //请求数据函数   
        this.setState({
            tipText: ''
        })
        request(this.props.apiUrl, {productId: this.props.productId}, 'post', session.get('token'))
            .then(res => {
                console.log(JSON.stringify(res))
                if (res.success) {
                    if (this.props.apiUrl === '/loans/groupAuditHistory/list' && res.data) {
                        let _modalTableDataSource = []
                        let uid = 0
                        let uuid = 0
                        for (let item of res.data) {
                            uuid = 0
                            for (let val of item.auditHistories) {
                                let _modalTableDataSourceJ = {}
                                uuid === 0 ? _modalTableDataSourceJ.uuid = item.auditHistories.length : null
                                uid++
                                uuid++
                                _modalTableDataSourceJ.id = uid
                                _modalTableDataSourceJ.stageStr = item.stageStr
                                _modalTableDataSourceJ.auditResultStr = item.auditResultStr
                                _modalTableDataSourceJ.submitTime = val.submitTime
                                _modalTableDataSourceJ.name = val.userBy.name
                                _modalTableDataSourceJ.historyResult = val.historyResult.label
                                _modalTableDataSourceJ.auditOpinion = val.auditOpinion
                                _modalTableDataSource.push(_modalTableDataSourceJ)
                            }
                        }
                        this.setState({
                            modalTableDataSource: _modalTableDataSource,
                        })
                        console.log('tet:', JSON.stringify(_modalTableDataSource))
                    } else {
                        this.setState({
                            modalTableDataSource: res.data ? res.data : [],
                        })
                    }
                    this.setState({
                        tipText: res.data2 ? res.data2 : ''
                    })

                } else {
                    message.error(res.message)
                }
                this.setState({loading: false})
            })
            .catch(err => {
                this.setState({loading: false})
            })
    }

    _onCancel = () => {
        // this.setState({modalVisible: false})
        this.props.onCancelAppPro()
    }

    render() {

        return (
            <div>
                {this.props.ifModal ?
                    <Modal
                        title='流程信息'
                        visible={this.state.modalVisible}
                        onCancel={this._onCancel}
                        destroyOnClose={true}
                        width='800px'
                        footer={<Button type='primary' onClick={this._onCancel} className='green-style'>确定</Button>}
                    >
                        <div style={{maxHeight: '400px', overflow: 'auto'}}>
                            <Table
                                bordered
                                loading={this.state.loading}
                                rowKey={'id'}
                                columns={this.props.modalTableColumns}
                                dataSource={this.state.modalTableDataSource}
                                pagination={false}
                            />
                        </div>
                        {this.state.tipText && <div className="green-box" style={{
                            margin: '20px 0',
                            padding: '10px'
                        }}>{this.state.tipText}</div>}
                    </Modal> :
                    <Table
                        scroll={{x: 700}}
                        bordered
                        loading={this.state.loading}
                        rowKey={'id'}
                        columns={this.props.modalTableColumns}
                        dataSource={this.state.modalTableDataSource}
                        pagination={false}
                    />
                }
            </div>
        );
    }
}

export default ApprovalProcess
