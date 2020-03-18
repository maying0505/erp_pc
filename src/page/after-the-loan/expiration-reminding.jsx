import React from 'react'
import api from 'api'
import AfterTheLoanList from './after-the-loan-list'


class ExpirationReminding extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            requestName: api.expirationRemindingList,
            ifOverdueSearch: false,
            NumberOfDays: [
            {
                title: '剩余还款天数',
                dataIndex: 'repaymentBy.residueDays',
                width: '5.88%',
            }],
            NumberOfDaysSearch: [
            {
                label:'剩余还款天数',
                filedName: ['beforeResidueDays','laterResidueDays'],
            }]
        }
    }
    
    componentDidMount(){ //预加载数据
        
    }
   
    render() {
        const { ifOverdueSearch, requestName, NumberOfDays, NumberOfDaysSearch } = this.state
        return(
           <AfterTheLoanList listTitle="还款提醒" ifOverdueSearch={ifOverdueSearch} requestName={requestName} NumberOfDays={NumberOfDays} NumberOfDaysSearch={NumberOfDaysSearch}/> 
        )
    }
}
export default ExpirationReminding