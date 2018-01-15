import allColors from './colors';

const Y_AXIS_OFFSET = 60;
const chartUtil = {
    /**
     * 把一个时间字符串转成标准的时间字符串 YYYY-MM-DD形式, 需要拓展的时候再说, 先酱紫
     * @param dateStr
     * @returns {string}
     */
    formatDate: (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    /**
     * 接收值  arrData => [item...]
     *        item => [[dateStr, value]...]
     *
     * return [[dateStr, [value...]]...] sortBy dateStr
     * 看不懂问cyc
     */
    mergeData: (arrData) => {
        const allData = {};
        const dataLen = arrData.length;

        arrData.forEach((data, index) => {
            data.forEach(([date, value]) => {
                if (!allData[date]) {
                    allData[date] = new Array(dataLen).fill('-');
                }
                allData[date][index] = value;
            });
        });

        return Object.entries(allData).sort((a, b) => new Date(a[0]) - new Date(b[0]));
    },
    /**
     *
     * @param arrList
     */
    getSumArr: (arrList) => {
        return arrList.map((arr) => {
            let sum = 0;
            arr.forEach((num) => {
                num = Number(num);
                if (num) {
                    sum += num;
                }
            });
            return sum.toFixed(2);
        });
    },
    getYAxis: (num, cfg = {}) => {
        return new Array(num).fill(null).map((item, index) => {
            return {
                type: 'value',
                position: index % 2 === 0 ? 'left' : 'right',
                offset: Math.floor(index / 2) * Y_AXIS_OFFSET,
                axisLine: {
                    lineStyle: {
                        color: allColors.colors[index]
                    }
                }
            }
        })
    }
};

export default chartUtil;