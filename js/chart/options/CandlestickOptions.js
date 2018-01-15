import { round } from '../../../util/helper';

const splitData = (rawData) => {
    const categoryData = [];
    const values = [];
    for (let i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0].substring(0, 10));
        values.push(rawData[i]);
    }
    return {
        categoryData: categoryData,
        values: values
    };
};

const calculateMA = (dayCount, data) => {
    const result = [];
    for (let i = 0, len = data.length; i < len; i++) {
        if (i < dayCount) {
            result.push('-');
            continue;
        }
        let sum = 0;
        for (let j = 0; j < dayCount; j++) {
            sum += data.values[i - j][1];
        }
        result.push(round(+(sum / dayCount), 3));
    }
    return result;
};


export default function getCandlestickOption(rawData) {
    const data = splitData(rawData.kLineChart);
    const categoryData = data.categoryData;
    const MA5Data = calculateMA(5, data);
    const MA10Data = calculateMA(10, data);
    const MA20Data = calculateMA(20, data);
    const MA30Data = calculateMA(30, data);
    return {
        animation: false,
        legend: {
            bottom: '7%',
            left: 'center',
            data: ['行情K线', 'MA5', 'MA10', 'MA20', 'MA30']
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(245, 245, 245, 0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
                color: '#000'
            },
            extraCssText: 'width: 170px'
        },
        xAxis: [{
            type: 'category',
            data: categoryData,
            scale: true,
            axisLine: {
                onZero: false
            },
            splitLine: {
                show: false
            },
            splitNumber: 20,
            axisPointer: {
                z: 100
            }
        }],
        yAxis: [{
            scale: true,
            splitArea: {
                show: true
            }
        }],
        grid: {
            bottom: '15%'
        },
        dataZoom: [{
            type: 'inside',
            start: 75,
            end: 100
        }, {
            type: 'slider',
            start: 75,
            end: 100,
            bottom: '15'
        }],
        series: [{
            name: '行情K线',
            type: 'candlestick',
            data: data.values,
            itemStyle: {
                normal: {
                    color: '#c23531',
                    color0: '#2f825d',
                    borderColor: null,
                    borderColor0: null
                }
            }
        }, {
            name: 'MA5',
            type: 'line',
            data: MA5Data,
            smooth: true
        }, {
            name: 'MA10',
            type: 'line',
            data: MA10Data,
            smooth: true
        }, {
            name: 'MA20',
            type: 'line',
            data: MA20Data,
            smooth: true
        }, {
            name: 'MA30',
            type: 'line',
            data: MA30Data,
            smooth: true
        }]
    };
}