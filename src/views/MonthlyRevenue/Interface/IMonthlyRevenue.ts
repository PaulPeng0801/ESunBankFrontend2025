export interface IQueryMonthlyRevenueReq {
    reportDate?: string, // 出表日期
    dataYearMonth?: string, // 資料年月
    companyCode?: string, // 公司代號
    companyName?: string, // 公司名稱
    industry?: string, // 產業別
    currentMonthRevenue?: string, // 營業收入-當月營收
    previousMonthRevenue?: string, // 營業收入-上月營收
    lastYearSameMonthRevenue?: string, // 營業收入-去年當月營收
    monthOverMonthChange?: string, // 營業收入-上月比較增減(%)
    yearOverYearChange?: string, // 營業收入-去年同月增減(%)
    currentCumulativeRevenue?: string, // 累計營業收入-當月累計營收
    lastYearCumulativeRevenue?: string, // 累計營業收入-去年累計營收
    priorPeriodChange?: string, // 累計營業收入-前期比較增減(%)
    notes?: string, // 備註
}

export interface IMonthlyRevenue extends IQueryMonthlyRevenueReq{
    
}