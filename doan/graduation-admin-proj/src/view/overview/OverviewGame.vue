<template>
    <div class="cardBox">
        <div class="card">
            <div>
                <div class="numbers">{{ overviewResponse.totalUserOnline }}</div>
                <div class="cardName">Players online</div>
            </div>

            <div class="iconBx">
                <font-awesome-icon :icon="['far', 'eye']" />
            </div>
        </div>

        <div class="card">
            <div>
                <div class="numbers">{{ overviewResponse.totalUser }}</div>
                <div class="cardName">Total players</div>
            </div>

            <div class="iconBx">
                <span class="icon">
                    <font-awesome-icon :icon="['fas', 'user-group']" />
                </span>
            </div>
        </div>

        <div class="card">
            <div>
                <div class="numbers">{{ overviewResponse.totalRoom }}</div>
                <div class="cardName">Available rooms</div>
            </div>

            <div class="iconBx">
                <font-awesome-icon :icon="['far', 'comments']" />
            </div>
        </div>

        <div class="card">
            <div>
                <div class="numbers">
                    {{ overviewResponse.mostPlayedLevel ? `LV${overviewResponse.mostPlayedLevel}` : 'N/A' }}
                </div>
                <div class="cardName">Most hosted level</div>
            </div>

            <div class="iconBx">
                <font-awesome-icon :icon="['fas', 'money-bill']" />
            </div>
        </div>
    </div>

    <div class="details">
        <!-- ================ Order Details List ================= -->
        <div class="recentOrders">
            <div class="cardHeader">
                <h2>Recent Players</h2>
                <select v-model="modeSelect" style="padding: 6px 12px 6px 10px">
                    <option v-for="itemMode in modeChart" :key="itemMode.value" :value="itemMode.value">
                        {{ itemMode.title }}
                    </option>
                </select>
            </div>

            <div class="report-chart" style="flex: 1">
                <div class="row" style="height: 100%; width: 100%">
                    <div class="col-md-12" style="height: 100%; width: 100%">
                        <MChartNew
                            id="my-chart-id"
                            :chartOptions="chartOptions"
                            :dataChart="dataChart"
                            :modeChart="modeSelect"
                            :key="chartBarKey"
                        ></MChartNew>
                    </div>
                </div>
                <div class="reload-chart" v-if="showLoadingChart">
                    <div class="lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ================= New Customers ================ -->
        <div class="recentCustomers">
            <div class="cardHeader">
                <h2>Recent Rooms</h2>
            </div>

            <table>
                <tbody>
                    <template v-if="overviewResponse.roomPlaying.length > 0">
                        <slot v-for="(item, index) in overviewResponse.roomPlaying" :key="index">
                            <tr>
                                <td width="60px">
                                    <div class="imgBx"><img src="assets/imgs/room.png" alt="" /></div>
                                </td>
                                <td>
                                    <h4>
                                        Room <br />
                                        <span
                                            >{{ item.users[0].email.split('@')[0] }} &nbsp; VS &nbsp;
                                            {{ item.users[1].email.split('@')[0] }}</span
                                        >
                                    </h4>
                                </td>
                            </tr>
                        </slot>
                    </template>
                    <template v-else>
                        <tr class="table-no-data">
                            <td colspan="2">
                                <img
                                    src="https://t4.ftcdn.net/jpg/04/72/65/73/360_F_472657366_6kV9ztFQ3OkIuBCkjjL8qPmqnuagktXU.jpg"
                                    alt=""
                                    style="max-width: 300px; max-height: 300px"
                                />
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>

    <MLoadingClient v-if="showLoadingClient"></MLoadingClient>
</template>

<script>
import MChartNew from '@/components/chart/MChartNew.vue';
import HttpService from '@/js/axiosConfig';

export default {
    name: 'OverviewGame',
    components: { MChartNew },
    watch: {
        modeSelect: async function (value) {
            this.showLoadingChart = true;
            await this.getDataChart(value);
        },
    },

    methods: {
        async getDataChart(value = 0) {
            var me = this;
            let response;

            if (value === 0) {
                response = await HttpService.axiosClient.get(`${HttpService.apiUrl}/admin/statsdaily`);
            } else {
                response = await HttpService.axiosClient.get(`${HttpService.apiUrl}/admin/statsmonthly`);
            }

            me.dataChart = response.metadata;
            me.chartBarKey++;
            me.showLoadingChart = false;
        },
    },
    async created() {
        const results = await Promise.all([
            HttpService.axiosClient.get(`${HttpService.apiUrl}/admin/overview`),
            HttpService.axiosClient.get(`${HttpService.apiUrl}/admin/statsdaily`),
        ]);

        this.showLoadingClient = false;
        this.overviewResponse = results[0].metadata;
        this.dataChart = results[1].metadata;
        this.chartBarKey++;
    },
    data() {
        return {
            overviewResponse: {
                totalUser: 0,
                mostPlayedLevel: null,
                totalUserOnline: 0,
                totalRoom: 0,
                roomPlaying: [],
            },

            showLoadingClient: true,
            modeChart: [
                { value: 0, title: 'Ngày trong tháng' },
                { value: 1, title: 'Tháng trong năm' },
            ],
            modeSelect: 0,
            dataChart: [],

            chartBarKey: 0,

            chartOptions: {
                responsive: true,
            },

            showLoadingChart: false,
        };
    },
};
</script>

<style scoped>
@import url('./overview.css');
</style>
