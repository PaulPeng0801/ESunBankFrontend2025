<template>
    <div>
        <div v-if="loading" class="loading">
            <span>資料載入中.....</span>
        </div>
        <div v-else>
            <span class="title">公司月營收</span>
            <div class="search-button">
                <button @click="handleSearch" style="width: 80px;">查詢</button>
            </div>
            <!-- Table -->
            <div class="monthly-revenue-table">
                <table>
                    <thead>
                        <tr>
                            <th>出表日期</th>
                            <th>資料年月</th>
                            <th>公司代號</th>
                            <th>公司名稱</th>
                            <th>產業別</th>
                            <th>營業收入-當月營收</th>
                            <th>營業收入-上月營收</th>
                            <th>營業收入-去年當月營收</th>
                            <th>營業收入-上月比較增減(%)</th>
                            <th>營業收入-去年同月增減(%)</th>
                            <th>累計營業收入-當月累計營收</th>
                            <th>累計營業收入-去年累計營收</th>
                            <th>累計營業收入-前期比較增減(%)</th>
                            <th>備註</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in currentPageData" :key="item.companyCode">
                            <td>{{ item.reportDate }}</td>
                            <td>{{ item.dataYearMonth }}</td>
                            <td>{{ item.companyCode }}</td>
                            <td>{{ item.companyName }}</td>
                            <td>{{ item.industry }}</td>
                            <td>{{ item.currentMonthRevenue }}</td>
                            <td>{{ item.previousMonthRevenue }}</td>
                            <td>{{ item.lastYearSameMonthRevenue }}</td>
                            <td>{{ item.monthOverMonthChange }}</td>
                            <td>{{ item.yearOverYearChange }}</td>
                            <td>{{ item.currentCumulativeRevenue }}</td>
                            <td>{{ item.lastYearCumulativeRevenue }}</td>
                            <td>{{ item.priorPeriodChange }}</td>
                            <td>
                                <span :title="item.notes">
                                    {{ item.notes && item.notes.length > 20
                                        ? item.notes.slice(0, 20) + '...' : item.notes }} <!-- Tooltip -->
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 分頁控制 -->
            <div class="pagination">
                <button @click="switchPage(currentPage - 1)" :disabled="currentPage === 1"
                    style="margin: 0 5px;">上一頁</button>
                <span style="margin: 0 5px;">{{ currentPage }} / {{ totalPages }}</span>
                <button @click="switchPage(currentPage + 1)" :disabled="currentPage === totalPages"
                    style="margin: 0 10px 0 5px;">下一頁</button>
                <span>共 {{ totalCount }} 筆</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { IQueryMonthlyRevenueReq, IMonthlyRevenue } from './Interface/IMonthlyRevenue';

const monthlyRevenueReq = <IQueryMonthlyRevenueReq>({}); // 查詢的Request
const monthlyRevenueList = ref<IMonthlyRevenue[]>([]); // 接收API的list

const loading = ref<boolean>(false);

const currentPage = ref<number>(1); // 分頁當前頁面
const pageSize = ref<number>(15); // 每頁顯示15筆

const totalCount = computed(() => { // 總筆數
    return monthlyRevenueList.value.length;
});

const totalPages = computed(() => { // 總頁面
    return Math.ceil(totalCount.value / pageSize.value);
});

const handleSearch = async () => { // 查詢Function
    try {
        loading.value = true;
        await getPublicCompanyMonthlyRevenue();
    } catch (error) {
        alert("查詢失敗，請稍後再試！");
    } finally {
        loading.value = false;
    }
}

const getPublicCompanyMonthlyRevenue = async () => { // 查詢API
    const res = await fetch("https://localhost:7198/api/MonthlyRevenues/GetPublicCompanyMonthlyRevenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(monthlyRevenueReq)
    });

    if (!res.ok) {
        alert("API 呼叫失敗，請洽系統管理員！")
    }

    const data = await res.json();
    monthlyRevenueList.value = [...data];
}

const currentPageData = computed(() => {　// 計算當前頁資料
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;

    return monthlyRevenueList.value.slice(start, end).map(item => ({
        ...item,
        currentMonthRevenue: toDollarType(item.currentMonthRevenue),
        previousMonthRevenue: toDollarType(item.previousMonthRevenue),
        lastYearSameMonthRevenue: toDollarType(item.lastYearSameMonthRevenue),
        monthOverMonthChange: toFixedNumber(item.monthOverMonthChange),
        yearOverYearChange: toFixedNumber(item.yearOverYearChange),
        currentCumulativeRevenue: toFixedNumber(item.currentCumulativeRevenue),
        lastYearCumulativeRevenue: toFixedNumber(item.lastYearCumulativeRevenue),
        priorPeriodChange: toFixedNumber(item.priorPeriodChange)
    }));
});

const switchPage = (page: number) => {　// 切換頁面
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
}

const toFixedNumber = (value: string | number | undefined): string => { // 四捨五入到小數第二位
    const num = Number(value);
    if (isNaN(num)) return '';   // 如果不是數字，回空字串
    return num.toFixed(2);       // 強制兩位小數
}

const toDollarType = (value: string | undefined) => { // 賦予千分位
    if (value === undefined)
        return '';
    else {
        return value.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    }
}

onMounted(async () => {
    await getPublicCompanyMonthlyRevenue();
});
</script>

<style lang="scss" scoped src="./MonthlyRevenue.scss" />