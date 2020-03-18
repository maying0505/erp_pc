import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Divider} from 'antd';
import LoanTermUnit from 'component/loan-term-unit'
import InterestRateType from 'component/interest-rate-type'
import RepaymentMethod from 'component/repayment-method'

const defaultValueShow = [
    {id: '0', label: '申请日期', valueName: ['enteringDate']},
    {id: '1', label: '客户姓名', valueName: ['name']},
    {id: '2', label: '联系电话', valueName: ['phone']},
    {id: '3', label: '证件类型', valueName: ['certificateType']},
    {id: '4', label: '证件号码', valueName: ['certificateNo']},
    {id: '5', label: '居住地址', valueName: ['province', 'city', 'area', 'residentialAddress']},
    {id: '6', label: '银行卡号', valueName: ['cardNo']},
    {id: '7', label: '开户行', valueName: ['bankName']}
]

class InfoShowCommon extends React.Component {
    static propTypes = {
        defaultValue: PropTypes.object,
        defaultValueShow: PropTypes.array,
        defaultTitle: PropTypes.string,
        ifMoney: PropTypes.bool
    };

    static defaultProps = {
        defaultValue: {},
        defaultValueShow: defaultValueShow,
        defaultTitle: '',
        ifMoney: false
    };

    constructor(props) {
        super(props)
        this.state = {
            colAttribute: {
                md: 8,
                sm: 12,
                className: 'col-style'
            },
            defaultValue: {},
            defaultValueShow: []
        }
    }

    componentDidMount() { //预加载数据
        this.setState({
            defaultValue: this.props.defaultValue,
            defaultValueShow: this.props.defaultValueShow
        })
    }

    componentWillReceiveProps(nextProps) { //组件接收到新的props时调用
        //console.log(nextProps.defaultValue.enteringDate)
        this.setState({
            defaultValue: nextProps.defaultValue,
            defaultValueShow: nextProps.defaultValueShow
        })
    }

    DOMShow = (val) => {
        let domShow = <span key={val}>{this.state.defaultValue[val]}</span>
        // if (val === 'proType' || val === 'proCategory') {
        //     domShow = <span key={val}>{this.state.defaultValue[val]}-</span>
        // }
        if (val === 'certificateType') {
            switch (this.state.defaultValue[val]) {
                case '1':  domShow = <span key={val}>身份证</span>;break;
                case '2':  domShow = <span key={val}>护照</span>;break;
                case '3':  domShow = <span key={val}>统一社会信用代码</span>;break;
                default: domShow = <span key={val}>--</span>;
            }
        }
        if (val === 'takenMode') {
            this.state.defaultValue[val] === '1' ? domShow = <span key={val}>一次性收取</span> : domShow =
                <span key={val}>按期收取</span> //收取方式
        }
        if (val === 'aprUnit' || val === 'serviceUnit') {
            this.state.defaultValue[val] === '1' ? domShow = <span key={val}>%</span> : domShow =
                <span key={val}>‰</span> //利率、费率单位
        }
        val === 'aprType' || val === 'serviceType' ? domShow = <InterestRateType key={val} ifShow={true} defaultValue={this.state.defaultValue[val]}/> : null //利率、费率类型
        val === 'refundWar' ? domShow = <RepaymentMethod key={val} ifShow={true} defaultValue={this.state.defaultValue[val]}/> : null //还款方式
       
        val === 'deadlineUnit' || val === 'serviceDeadlineUnit' ? domShow = <LoanTermUnit key={val} ifShow={true} defaultValue={this.state.defaultValue[val]}/> : null //借款期限、服务期限单位
        val === 'lendMoney' ? domShow = <span key={val}>{this.state.defaultValue[val]}元</span> : null //借款金额
        val === 'province' || val === 'city' || val === 'area' ? domShow =
            <span key={val}>{this.state.defaultValue[val]}-</span> : null //居住地址
        this.props.ifMoney ? domShow = <span key={val}>{this.state.defaultValue[val]}元</span> : null
        this.state.defaultValue[val]!==undefined && this.state.defaultValue[val]!==null && this.state.defaultValue[val]!=='' ? null : domShow = <span key={val}>--</span>
        return domShow
    }

    render() {
        let {defaultValue} = this.state
        return (
            <div style={{width:'100%'}}>
                <Row className="padding15">    
                    {this.props.defaultTitle && this.props.defaultTitle !== '' && <div className="white-title">
                        <p>{this.props.defaultTitle}：</p>
                        <Divider/>
                    </div>}
                    {
                        this.state.defaultValueShow.map((item)=>
                        <div key={item.id} className="title-small-box">
                            {
                                item.contentInterval && <Col className="white-title white-title-small" style={{float:'left'}}><p className="title-small">{item.contentInterval}</p><Divider/></Col>
                            }
                            <Col {...this.state.colAttribute}>
                                
                                <span>{item.label? `${item.label}：` :''}</span>
                                {
                                    item.valueName.map((val) =>
                                            this.DOMShow(val)
                                        // <span key={val}>{defaultValue[val]}</span>
                                    )}

                            </Col>
                        </div>
                        )}
                </Row>
            </div>
        );
    }
}

export default InfoShowCommon
