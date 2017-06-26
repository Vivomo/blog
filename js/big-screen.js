// import * as d3 from "./d3/d3.v4.min";
(function () {
    const modals = document.querySelectorAll('.modal');
    Array.from(modals).forEach(function (modal) {
        const div = document.createElement('div');
        div.innerHTML = '<i class="coner c1"></i><i class="coner c2"></i><i class="coner c3"></i><i class="coner c4"></i>';
        modal.appendChild(div);
    });

    /**
     * 行业热度
     * @param data
     */
    function drawIndustry(data) {
        let max = 0,
            dataLength = data.length,
            splitAngle = Math.PI / dataLength;

        const innerRadius = 40;
        const outerRadius = 90;
        const degreeLength = 5;
        const arcWidth = (outerRadius - innerRadius) / degreeLength;

        const colors = ['#3dbbe7', '#4fdee2', '#87c352', '#eec43c', '#ef7f2f'];

        data.forEach((item) => {
            if (max < item.value) {
                max = item.value;
            }
        });

        var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const svg = d3.select('#l-m-2 .canvas-wrap')
            .append('svg')
            .attr('width', 220)
            .attr('height', 180);

        const g = svg.append('g')
            .attr('transform', 'translate(120, 90)');

        const title = g.append('text')
            .attr('class', 'title')
            .attr('dy', '0.6em')
            .attr('fill', '#2df1ff')
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate(0, -10) scale(0.8)');

        const titleData = g.append('text')
            .attr('class', 'title-data')
            .attr('dy', '0.5em')
            .attr('fill', '#2df1ff')
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate(0, 10) scale(0.8)');


        // 黑arc
        g.selectAll('path')
            .data(data)
            .enter()
            .append('path')
            .attr('d', function (item, index) {
                return arc.startAngle(index * 2 * splitAngle).endAngle((index * 2 + 1) * splitAngle)();
            })
            .attr('fill', '#08102a')
            .attr('stroke', '#0e1333')
            .attr('data-name', function (d) {
                return d.name;
            })
            .attr('data-value', function (d) {
                return d.value;
            });

        // 彩色arc
        data.forEach(function (item, dIndex) {
             const dg = g.append('g')
                 .attr('class', 'data-arc-g')
                 .attr('fill-opacity', 0.5);
             const degree = Math.ceil(item.value / (max / 5));
             dg.selectAll('path')
                 .data(new Array(degree).fill(0))
                 .enter()
                 .append('path')
                 .attr('d', function (d, index) {
                     const _innerRadius = innerRadius + index * arcWidth;
                     const _outerRadius = _innerRadius + arcWidth;
                     return d3.arc()
                         .innerRadius(_innerRadius)
                         .outerRadius(_outerRadius).startAngle(dIndex * 2 * splitAngle).endAngle((dIndex * 2 + 1) * splitAngle)()
                 })
                 .attr('fill', function (d, index) {
                     return colors[index];
                 })
        });

        // 循环点亮

        const dataSrcGroup = d3.selectAll('.data-arc-g');
        let loopIndex = 0;
        setInterval(function () {
            const dataIndex = loopIndex % dataLength;
            dataSrcGroup.attr('fill-opacity', function (d, index) {
                return dataIndex === index ? 1 : 0.5;
            });
            title.text(data[dataIndex].name);
            titleData.text(data[dataIndex].value + '家');
            loopIndex ++;
        }, 3000);
    }

    /**
     * 企业分布
     */
    function drawDistribution(data) {
        const dataLength = data.length;
        const splitDegree = Math.floor(180 / (dataLength + 1));
        const wrap = document.querySelector('#l-m-3 .canvas-wrap');
        const maxWidth = 160;

        data.forEach(function (item, index) {
            const div = document.createElement('div');
            div.className = 'data';
            div.innerHTML = `<div class="line"></div><div class="value">${item.value}</div><div class="name">${item.name}</div>`;
            wrap.appendChild(div);
            setTimeout(function () {
                const degree = (index+1) * splitDegree - 90;
                div.style.transform = `rotate(${degree}deg)`;
                div.style.width = `${maxWidth - Math.min(40, Math.abs(degree))}px`;
            }, index * 50);
        });
    }

    const industryData = [
        { name: '企业服务', value: 92 },
        { name: '互联网', value: 57 },
        { name: '科技研发', value: 71 },
        { name: '技术推广服务', value: 163 },
        { name: '电商零售', value: 34 },
        { name: '广播电讯', value: 23 },
        // { name: '文化艺术', value: 20 },
    ];


    // drawIndustry(industryData);

    drawDistribution(industryData);

})();