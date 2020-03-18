import React from 'react'
import {Spin, Icon, Row, Col, Table, Card, Form, Input, Divider, Select, Button, DatePicker, message} from 'antd'
import {hashHistory} from 'react-router'
import api from 'api'
import {request} from 'common/request/request.js'
import {local, session} from 'common/util/storage.js'
import NewDatePicker from 'component/DatePicker'
import ProductSelect from 'component/product-select'
import BranchOffice from 'component/branchOffice'
import BarEcharts from 'component/echarts/barEcharts'
import LineEcharts from 'component/echarts/lineEcharts'
import PieEcharts from 'component/echarts/pieEcharts'
import NoData from 'component/echarts/noData'
import "./index.scss"

const FormItem = Form.Item
const Option = Select.Option
const _tableWidth = '7.1%'

class QueryStatisticsForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            smallLoading: true,
            loading: true,
            searchInfo: {},
            productId: '',
            totalCollectionNo: 0,//待收单数
            totalConllectioMoney: 0,//待收金额
            totalLoanNo: 0,//放款单数
            totalLoanMoney: 0,//放款金额
            DaiShouYuFangKuanJinE: [],//待收与放款金额明细
            YingShouShiShouJingE: [],//实收金额与应收金额
            YeWuMingXi: [],//业务明细
            YWMXtooltipShowData: [],
            YuQiLv: [],//逾期率
            JieKuanShiChang: [],//借款时长
            JieKuanRenSHuJuFenXi1: [],//借款人性别占比数据分析
            JieKuanRenSHuJuFenXi2: [],//借款人金额占比数据分析
            JieKuanRenSHuJuFenXi: [],//借款人数据分析
            yCoordinates1: [],
            yCoordinates2: [],
            yCoordinates3: [],
            yCoordinates4: [],
            yCoordinates5: [],
            isBranchOffice: false,
            branchOfficeArr: [],
            totalRealMoneys: 0,//实收金额
            totalSholds: 0,//应收金额
            isMonthDay: '1',
            pieGraphicText: '借款性别\n\n占比',
            isSex: '1',
            DSFKtooltipShowData: [],
            JKRSYFXlegendSata: ['男性借款人', '女性借款人', '企业借款人'],
            YWMXtotalLendMoneys: '',
            YWMXtotalLoanMoneys: '',
            YWMXtotalRealMoneys: ''
        }
    }

    componentDidMount() { //预加载数据
        request(api.branchOffice, {}, 'get', session.get('token'))
            .then(res => {
                console.log('ProductSelectInfo', JSON.stringify(res))
                if (res.success && res.data) {
                    let newData = [];
                    res.data.forEach((item, index) => {
                        newData.push({
                            id: index,
                            value: item.value,
                            label: item.label,
                        });
                    });
                    this.setState({
                        isBranchOffice: newData.length === 1 ? true : false,
                        branchOfficeArr: newData
                    }, () => {
                        this.handleSearch() //获取数据列表
                    })
                }
            })
    }

    handleSearch = (e) => { //查询请求
        e ? e.preventDefault() : null;
        this.props.form.validateFields((err, values) => {
            console.log(values)
            values.startLoanDate ? values.startLoanDate = values.startLoanDate.format('YYYY-MM-DD') : null
            values.endLoanDate ? values.endLoanDate = values.endLoanDate.format('YYYY-MM-DD') : null
            this.setState({
                searchInfo: {...this.state.searchInfo, ...values},
            }, function () {
                this.loadlists({...this.state.searchInfo})
            })
        });
    }

    getPendingPayment = () => {
        this.setState({smallLoading: true})
        request(api.pendingPayment, {
            ...this.state.searchInfo,
            isMonthDay: this.state.isMonthDay
        }, 'get', session.get('token'))
            .then(res => {
                console.log(JSON.stringify(res))
                this.setState({loading: false, smallLoading: false})
                if (res.success) {
                    this.setState({
                        totalCollectionNo: res.data.totalCollectionNo,
                        totalConllectioMoney: res.data.totalConllectioMoney,
                        totalLoanMoney: res.data.totalLoanMoney,
                        totalLoanNo: res.data.totalLoanNo,
                        yCoordinates1: res.data.yCoordinates,
                        xAxisName1: res.data.year + '年',
                        DaiShouYuFangKuanJinE: res.data.conllectioMoneys || res.data.loanMoneys ? [res.data.conllectioMoneys, res.data.loanMoneys] : [],
                        DSFKtooltipShowData: res.data.collectionNos || res.data.loanNos ? [res.data.collectionNos, res.data.loanNos] : [],
                    });
                } else {
                    message.error(res.message)
                }
            })
            .catch(err => {
                this.setState({loading: false, smallLoading: false})
            })
    }

    loadlists(data) { //请求数据函数
        this.setState({loading: true})
        console.log(data)
        request(api.summaryGraphList, data, 'get', session.get('token'))
            .then(res => {
                console.log(JSON.stringify(res))
                if (res.success) {
                    this.setState({
                        yCoordinates2: res.data.YeWuMingXi.yCoordinates,
                        YWMXtooltipShowData: res.data.YeWuMingXi.lendNos || res.data.YeWuMingXi.loanNos ? [res.data.YeWuMingXi.lendNos, res.data.YeWuMingXi.loanNos] : [],
                        YeWuMingXi: res.data.YeWuMingXi.lendMoneys || res.data.YeWuMingXi.loanMoneys || res.data.YeWuMingXi.realMoneys ? [res.data.YeWuMingXi.lendMoneys, res.data.YeWuMingXi.loanMoneys, res.data.YeWuMingXi.realMoneys] : [],
                        YingShouShiShouJingE: res.data.YingShouShiShouJingE.shouldMoneys || res.data.YingShouShiShouJingE.realMoneys ? [res.data.YingShouShiShouJingE.shouldMoneys, res.data.YingShouShiShouJingE.realMoneys] : [],
                        yCoordinates3: res.data.YingShouShiShouJingE.yCoordinates,
                        totalRealMoneys: res.data.YingShouShiShouJingE.totalRealMoneys,
                        YWMXtotalRealMoneys: res.data.YeWuMingXi.totalRealMoneys,
                        YWMXtotalLoanMoneys: res.data.YeWuMingXi.totalLoanMoneys,
                        YWMXtotalLendMoneys: res.data.YeWuMingXi.totalLendMoneys,
                        totalSholds: res.data.YingShouShiShouJingE.totalSholds,
                        yCoordinates4: res.data.YuQiLv.yCoordinates,
                        YuQiLv: res.data.YuQiLv.overRates || res.data.YuQiLv.noOverRates ? [res.data.YuQiLv.overRates, res.data.YuQiLv.noOverRates] : [],
                        yCoordinates5: res.data.JieKuanShiChang.yCoordinates,
                        JieKuanShiChang: res.data.JieKuanShiChang.hourLoanDates || res.data.JieKuanShiChang.aveLoanDates ? [res.data.JieKuanShiChang.hourLoanDates, res.data.JieKuanShiChang.aveLoanDates] : [],
                        JieKuanRenSHuJuFenXi1: res.data.JieKuanRenSHuJuFenXi.menNo || res.data.JieKuanRenSHuJuFenXi.womenNo || res.data.JieKuanRenSHuJuFenXi.companyNo ? [res.data.JieKuanRenSHuJuFenXi.menNo, res.data.JieKuanRenSHuJuFenXi.womenNo, res.data.JieKuanRenSHuJuFenXi.companyNo] : [],
                        JieKuanRenSHuJuFenXi2: res.data.JieKuanRenSHuJuFenXi.nanMoney || res.data.JieKuanRenSHuJuFenXi.nvMoney || res.data.JieKuanRenSHuJuFenXi.companyMoney ? [res.data.JieKuanRenSHuJuFenXi.nanMoney, res.data.JieKuanRenSHuJuFenXi.nvMoney, res.data.JieKuanRenSHuJuFenXi.companyMoney] : [],
                    }, function () {
                        this.setState({
                            JieKuanRenSHuJuFenXi: this.state.JieKuanRenSHuJuFenXi1
                        })
                        this.getPendingPayment();
                        console.log('YeWuMingXi', this.state.YeWuMingXi)
                    });
                } else {
                    message.error(res.message)
                }
            })
    }

    handleFormReset = () => { //重置查询
        this.props.form.resetFields()
        this.setState({
            searchInfo: {}
        }, function () {
            this.handleSearch()
        })
    }

    renderAdvancedForm() { //查询条件DOM
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline" className="ant-form-my">
                <Row>
                    <Col md={6} sm={24}>
                        <FormItem label="分公司">
                            {getFieldDecorator('companyId', {initialValue: this.state.isBranchOffice ? this.state.branchOfficeArr[0].value : undefined})(
                                <Select
                                    placeholder='请选择分公司'
                                    style={{width: '100%'}}
                                    allowClear={true}
                                >
                                    {this.state.branchOfficeArr.map((item) =>
                                        <Option value={item.value} key={item.value}>{item.label}</Option>
                                    )}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="">
                            {getFieldDecorator('proName')(
                                <ProductSelect form={this.props.form} fieldName="proName"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="">
                            {getFieldDecorator('ldIdent', {initialValue: '2'})(
                                <Select style={{width: '45%', display: 'block', height: '39px'}}>
                                    <Option value="1">申请日期</Option>
                                    <Option value="2">放款日期</Option>
                                </Select>
                            )}
                            {getFieldDecorator('startLoanDate')(
                                <DatePicker style={{width: '45%'}} placeholder="年/月/日"/>
                            )}<span className="number-bettw">至</span>
                            {getFieldDecorator('endLoanDate')(
                                <DatePicker style={{width: '45%'}} placeholder="年/月/日"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="坐标选择">
                            {getFieldDecorator('coordinateSelect', {initialValue: `${this.state.isBranchOffice ? '2' : '1'}`})(
                                <Select placeholder="请选择">
                                    {!this.state.isBranchOffice && <Option value="1">分公司</Option>}
                                    <Option value="2">产品</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <div style={{overflow: 'hidden'}}>
              <span style={{float: 'left'}}>
                <Button type="primary" htmlType="submit" className="green-style">查询</Button>
                <Button style={{marginLeft: 8}} onClick={this.handleFormReset} className="default-btn">重置</Button>
                  {/* <Button style={{ marginLeft: 8 }} onClick={this.handleExport}  className="green-style">导出</Button> */}
              </span>
                </div>
            </Form>
        );
    }

    changeCurRange = (text) => {
        this.setState({
            isMonthDay: text
        }, function () {
            this.getPendingPayment()
        })
    }
    changeBorrowerRatio = (text) => {
        this.setState({
            isSex: text
        })
        if (text === '1') {
            this.setState({
                JieKuanRenSHuJuFenXi: this.state.JieKuanRenSHuJuFenXi1,
                pieGraphicText: '借款性别\n\n占比',
                JKRSYFXlegendSata: ['男性借款人', '女性借款人', '企业借款人']
            })
        } else if (text === '2') {
            this.setState({
                JieKuanRenSHuJuFenXi: this.state.JieKuanRenSHuJuFenXi2,
                pieGraphicText: '借款金额\n\n占比',
                JKRSYFXlegendSata: ['男性借款金额', '女性借款金额', '企业借款金额']
            })
        }
    }

    render() {
        const {YWMXtotalLendMoneys, YWMXtotalLoanMoneys, YWMXtotalRealMoneys, JKRSYFXlegendSata, YWMXtooltipShowData, DSFKtooltipShowData, isSex, pieGraphicText, isMonthDay, JieKuanRenSHuJuFenXi, JieKuanShiChang, yCoordinates5, YuQiLv, yCoordinates4, totalRealMoneys, totalSholds, yCoordinates3, YingShouShiShouJingE, YeWuMingXi, yCoordinates2, xAxisName1, totalCollectionNo, totalConllectioMoney, totalLoanMoney, totalLoanNo, DaiShouYuFangKuanJinE, yCoordinates1} = this.state;
        return (

            <div className="table-list">
                <Card bordered={false}>
                    <h1>统计</h1>
                    <div>{this.renderAdvancedForm()}</div>
                    <Spin size="large" spinning={this.state.loading}>
                        <div className="chart_box full_width">
                            <Spin size="large" spinning={this.state.smallLoading}>
                                <div className="full_width chart_1 chart_m">
                                    <span className="chart_tip">
                                        <Button.Group size="small" className="switch_box">
                                            <Button className={isMonthDay === '1' ? "green-style" : 'default-btn'}
                                                    onClick={this.changeCurRange.bind(this, '1')}>
                                                日
                                            </Button>
                                            <Button className={isMonthDay === '2' ? "green-style" : 'default-btn'}
                                                    onClick={this.changeCurRange.bind(this, '2')}>
                                                月
                                            </Button>
                                        </Button.Group>
                                        <span className="chart_tip_text">
                                            <span>待收单数：{totalCollectionNo}</span>
                                            <span>待收金额：{totalConllectioMoney}</span>
                                            <span>放款单数：{totalLoanNo}</span>
                                            <span>放款金额：{totalLoanMoney}</span>
                                        </span>
                                    </span>
                                    {DaiShouYuFangKuanJinE.length > 0 ?
                                        <LineEcharts tooltipShowSeriesName={['待收笔数', '放款笔数']}
                                                     tooltipShowData={DSFKtooltipShowData} chartName="待收与放款金额明细"
                                                     dataZoomShow={true} xAxisName={xAxisName1} titleText="待收与放款金额明细"
                                                     seriesData={DaiShouYuFangKuanJinE} xAxisData={yCoordinates1}
                                                     legendData={['待收金额', '放款金额']} color={["#7EABF9", "#FD8483"]}/> :
                                        <NoData title="待收与放款金额明细"/>
                                    }
                                </div>
                            </Spin>
                            <div className="full_width chart_1 chart_m">
                                <span className="chart_tip">
                                    <span className="chart_tip_text">
                                        <span>借款总额：{YWMXtotalLendMoneys}</span>
                                        <span>放款总额：{YWMXtotalLoanMoneys}</span>
                                        <span>还款总额：{YWMXtotalRealMoneys}</span>
                                    </span>
                                </span>
                                {YeWuMingXi.length > 0 ?
                                    <LineEcharts legendLeft="150px" tooltipShowSeriesName={['借款笔数', '放款笔数']}
                                                 tooltipShowData={YWMXtooltipShowData} titleText="业务明细"
                                                 legendData={['借款金额', '放款金额', '还款金额']} seriesData={YeWuMingXi}
                                                 color={["#FD8483", "#7EABF9", "#FDA126"]} xAxisData={yCoordinates2}/> :
                                    <NoData title="业务明细"/>
                                }
                            </div>

                            <div className="full_width chart_2 chart_m">
                                <span className="chart_tip">
                                    <span>应收总额：{totalSholds}</span>
                                    <span>实收总额：{totalRealMoneys}</span>
                                </span>
                                {YingShouShiShouJingE.length > 0 ?
                                    <BarEcharts legendLeft="150px" titleText="应收实收费用" legendData={['应收费用', '实收费用']}
                                                seriesData={YingShouShiShouJingE} color={["#41BE9E", "#FDA126"]}
                                                xAxisData={yCoordinates3}/> :
                                    <NoData title="应收实收费用"/>
                                }
                            </div>
                            {/* <div className="full_width chart_m">
                                {JieKuanShiChang.length > 0 ?
                                    <LineEcharts titleText="借款时长" legendData={['借款时长', '平均时长']} seriesData={JieKuanShiChang} color={["#41BE9E","#FDA126"]} xAxisData={yCoordinates5}/>:
                                    <NoData title="借款时长"/>
                                }
                            </div> */}
                            <div className="full_width chart_m">
                                {YuQiLv.length > 0 ?
                                    <LineEcharts dataUnit={'%'} yAxisAxisLabel={{formatter: '{value} %'}}
                                                 titleText="逾期率" legendData={['首逾期率', '实际逾期率']} seriesData={YuQiLv}
                                                 color={["#7EABF9", "#FD8483"]} xAxisData={yCoordinates4}/> :
                                    <NoData title="逾期率"/>
                                }
                            </div>
                            <div className="chart_m full_width chart_1">
                                <span className="chart_tip chart_tip2">
                                    <Button.Group size="small" className="switch_box">
                                        <Button className={isSex === '1' ? "green-style" : 'default-btn'}
                                                onClick={this.changeBorrowerRatio.bind(this, '1')}>
                                            性别占比
                                        </Button>
                                        <Button className={isSex === '2' ? "green-style" : 'default-btn'}
                                                onClick={this.changeBorrowerRatio.bind(this, '2')}>
                                            金额占比
                                        </Button>
                                    </Button.Group>
                                </span>
                                {JieKuanRenSHuJuFenXi.length > 0 ?
                                    <PieEcharts titleText="借款人数据分析" legendData={JKRSYFXlegendSata}
                                                graphicText={pieGraphicText} seriesData={JieKuanRenSHuJuFenXi}
                                                color={["#FD8483", "#7EABF9", "#FDA126"]}/> :
                                    <NoData title="借款人数据分析"/>
                                }
                            </div>
                        </div>
                    </Spin>
                </Card>
            </div>
        )
    }
}

const QueryStatistics = Form.create()(QueryStatisticsForm)
export default QueryStatistics
