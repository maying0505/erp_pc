import React from 'react'
import api from 'api'
import AfterTheLoanList from './after-the-loan-list'


class OverdueCollect extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            requestName: api.overdueCollectList,
            ifOverdueSearch: false,
            NumberOfDays: [
            {
                title: '逾期天数',
                dataIndex: 'repaymentBy.overdueDays',
                width: '5.88%',
            }],
            NumberOfDaysSearch: [
            {
                label:'逾期天数',
                filedName: ['beforeOverdueDays','laterOverdueDays'],
            }]
        }
    }
    
    componentDidMount(){ //预加载数据
        
    }
   
    render() {
        const { ifOverdueSearch, requestName, NumberOfDays, NumberOfDaysSearch } = this.state
        return(
           <AfterTheLoanList listTitle="逾期催收" ifOverdueSearch={ifOverdueSearch} requestName={requestName} NumberOfDays={NumberOfDays} NumberOfDaysSearch={NumberOfDaysSearch}/> 
        )
    }
}
export default OverdueCollect