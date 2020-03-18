import React from 'react'
import api from 'api'
import AfterTheLoanList from './after-the-loan-list'


class RepaymentsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            requestName: api.repaymentsList,
            ifOverdueSearch: true,
            NumberOfDays: [{
                title: '实还款时间',
                dataIndex: 'repaymentBy.realityDate',
                width: '5.55%',
            },{
                title: '剩余还款天数',
                dataIndex: 'repaymentBy.residueDays',
                width: '5.55%',
            },
            {
                title: '逾期天数',
                dataIndex: 'repaymentBy.overdueDays',
                width: '5.55%',
            },{
                title: '是否逾期',
                dataIndex: 'repaymentBy.isOverdue',
                width: '5.55%',
                render: (text) => {
                    let renderText = ''
                    if (text){
                        text === '1' ? renderText = <span className="red-style">是</span> : renderText = '否'
                    }
                    return renderText
                }
            }],
            NumberOfDaysSearch: [{
                label:'剩余还款天数',
                filedName: ['beforeResidueDays','laterResidueDays'],
            },
            {
                label:'逾期天数',
                filedName: ['beforeOverdueDays','laterOverdueDays'],
            }]
        }
    }
    
    componentDidMount(){ //预加载数据
        
    }
   
    render() {
        const { ifOverdueSearch,requestName, NumberOfDays, NumberOfDaysSearch } = this.state
        return(
           <AfterTheLoanList ifShowRealRepay={true} listTitle="还款列表" ifOverdueSearch={ifOverdueSearch} requestName={requestName} NumberOfDays={NumberOfDays} NumberOfDaysSearch={NumberOfDaysSearch}/> 
        )
    }
}
export default RepaymentsList