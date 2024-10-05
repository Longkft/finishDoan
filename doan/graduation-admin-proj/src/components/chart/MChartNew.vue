<template>
    <Bar id="my-chart-id" :options="chartOptions" :data="chartData"></Bar>
</template>

<script>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import commonJS from '@/js/common';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
export default {
    name: 'MChartNew',
    components: { Bar },
    props: ['chartOptions', 'dataChart', 'modeChart'],

    methods: {
        groupData(dataChart, modeChart) {
            return dataChart.reduce((result, data) => {
                let key;
                switch (modeChart) {
                    case 0:
                        key = commonJS.formatDate(data._id);
                        break;
                    case 1:
                        key = `Th ${new Date(data._id).getMonth() + 1}`;
                        break;
                }

                if (!result[key]) {
                    result[key] = 0;
                }
                result[key] += data.totalCount;
                return result;
            }, {});
        },
    },
    async created() {
        const groupedData = this.groupData(this.dataChart, this.modeChart);
        let dataSet = [
            {
                label: 'Số người chơi',
                backgroundColor: '#4154f1',
                data: Object.values(groupedData),
            },
        ];

        this.chartData = {
            labels: Object.keys(groupedData),
            datasets: dataSet,
        };
    },
    data() {
        return {
            chartData: [],
        };
    },
};
</script>

<style></style>
