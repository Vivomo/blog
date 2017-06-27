// import * as d3 from "./d3/d3.v4.min";
(function () {

    const theme = '#2df1ff';

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
            .attr('fill', theme)
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate(0, -10) scale(0.8)');

        const titleData = g.append('text')
            .attr('class', 'title-data')
            .attr('dy', '0.5em')
            .attr('fill', theme)
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
            loopIndex++;
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
                const degree = (index + 1) * splitDegree - 90;
                div.style.transform = `rotate(${degree}deg)`;
                div.style.width = `${maxWidth - Math.min(40, Math.abs(degree))}px`;
            }, index * 50);
        });
    }

    /**
     * 人才热度
     */
    function drawTalentsDemand(data1, data2) {
        drawLine(data1);
        drawDemandFever(data2);
    }

    /**
     *  雷达
     * @param elem
     * @param d
     * @param options
     */
    function drawRadar(elem, d, options) {
        var cfg = {
            radius: 5,
            w: 600,
            h: 600,
            factor: 1,
            factorLegend: .85,
            levels: 3,
            maxValue: 0,
            radians: 2 * Math.PI,
            opacityArea: 0.5,
            ToRight: 5,
            TranslateX: 80,
            TranslateY: 30,
            ExtraWidthX: 100,
            ExtraWidthY: 100,
            color: function () {
                return '#70c7db';
            }
        };

        // 设置最大值
        var maxValue = 0;
        d.forEach((function (arr) {
            arr.forEach(function (item) {
                if (item.value > maxValue) {
                    maxValue = item.value;
                }
            })
        }));
        cfg.maxValue = Math.floor(maxValue / cfg.levels) * (cfg.levels + 0.5);

        // 配置合并
        if (options) {
            Object.entries(options).forEach(function (entry) {
                if (entry[1]) {
                    cfg[entry[0]] = entry[1];
                }
            });
        }


        var allAxis = (d[0].map(function (i) {
            return i.name
        }));

        var total = allAxis.length;
        var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
        d3.select(elem).select("svg").remove();

        var g = d3.select(elem)
            .append("svg")
            .attr("width", cfg.w + cfg.ExtraWidthX)
            .attr("height", cfg.h + cfg.ExtraWidthY)
            .append("g")
            .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

        //Circular segments
        for (var j = 0; j < cfg.levels; j++) {
            var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
            g.selectAll(".levels")
                .data(allAxis)
                .enter()
                .append("svg:line")
                .attr("x1", function (d, i) {
                    return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
                })
                .attr("y1", function (d, i) {
                    return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
                })
                .attr("x2", function (d, i) {
                    return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total));
                })
                .attr("y2", function (d, i) {
                    return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total));
                })
                .attr("class", "line")
                .style("stroke", "grey")
                .style("stroke-opacity", "0.75")
                .style("stroke-width", "0.3px")
                .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
        }

        //Text indicating at what % each level is
//            for (var j = 0; j < cfg.levels; j++) {
//                var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
//                g.selectAll(".levels")
//                    .data([1]) //dummy data
//                    .enter()
//                    .append("svg:text")
//                    .attr("x", function (d) {
//                        return levelFactor * (1 - cfg.factor * Math.sin(0));
//                    })
//                    .attr("y", function (d) {
//                        return levelFactor * (1 - cfg.factor * Math.cos(0));
//                    })
//                    .attr("class", "legend")
//                    .style("font-family", "sans-serif")
//                    .style("font-size", "10px")
//                    .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
//                    .attr("fill", "#737373")
//                    .text((j + 1) * 100 / cfg.levels);
//            }

        var series = 0;

        var axis = g.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");

        axis.append("line")
            .attr("x1", cfg.w / 2)
            .attr("y1", cfg.h / 2)
            .attr("x2", function (d, i) {
                return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
            })
            .attr("y2", function (d, i) {
                return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
            })
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-width", "1px");

        axis.append("text")
            .attr("class", "legend")
            .text(function (d) {
                return d
            })
            .style("font-family", "Microsoft Yahei")
            .style("font-size", "12px")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .attr('fill', '#6cc6da')
            .attr("transform", function (d, i) {
                return "translate(0, -10)"
            })
            .attr("x", function (d, i) {
                return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total);
            })
            .attr("y", function (d, i) {
                return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total);
            });


        var dataValues = [];
        d.forEach(function (y, x) {
//                var dataValues = [];
            g.selectAll(".nodes")
                .data(y, function (j, i) {
                    dataValues.push([
                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                    ]);
                });
            dataValues.push(dataValues[0]);
            g.selectAll(".name")
                .data([dataValues])
                .enter()
                .append("polygon")
                .attr("class", "radar-chart-serie" + series)
                .style("stroke-width", "2px")
                .style("stroke", cfg.color(series))
                .attr("points", function (d) {
                    var str = "";
                    for (var pti = 0; pti < d.length; pti++) {
                        str = str + d[pti][0] + "," + d[pti][1] + " ";
                    }
                    return str;
                })
                .style("fill", function (j, i) {
                    return cfg.color(series)
                })
                .style("fill-opacity", cfg.opacityArea)
                .on('mouseover', function (d) {
                    var z = "polygon." + d3.select(this).attr("class");
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.1);
                    g.selectAll(z)
                        .transition(200)
                        .style("fill-opacity", .7);
                })
                .on('mouseout', function () {
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", cfg.opacityArea);
                });
            series++;
        });
        series = 0;


        var tooltip = d3.select("body").append("div").attr("class", "toolTip");
        d.forEach(function (y, x) {
            g.selectAll(".nodes")
                .data(y).enter()
                .append("svg:circle")
                .attr("class", "radar-chart-serie" + series)
                .attr('r', cfg.radius)
                .attr("alt", function (j) {
                    return Math.max(j.value, 0)
                })
                .attr("cx", function (j, i) {
                    dataValues.push([
                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                    ]);
                    return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
                })
                .attr("cy", function (j, i) {
                    return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
                })
                .attr("data-id", function (j) {
                    return j.name
                })
                .style("fill", "#fff")
                .style("stroke-width", "2px")
                .style("stroke", cfg.color(series)).style("fill-opacity", .9)
                .on('mouseover', function (d) {
                    console.log(d.name)
                    tooltip
                        .style("left", d3.event.pageX - 40 + "px")
                        .style("top", d3.event.pageY - 80 + "px")
                        .style("display", "inline-block")
                        .html((d.name) + "<br><span>" + (d.value) + "</span>");
                })
                .on("mouseout", function (d) {
                    tooltip.style("display", "none");
                });

            series++;
        });
    }

    /**
     *
     * @param data 二维数组, 每个一维数组的第一个数是日期;
     */
    function drawLine(data) {
        const svg = d3.select('#l-m-4 .line-wrap svg');
        const textWidth = svg.attr('width') / (data.length + 1);
        let max = 0;
        const lineCount = data[0].length - 1;
        const pointsList = new Array(lineCount);
        const colors = ['#72be6d', '#25b7e2', '#1f4a9e'];
        const rangeStart = 40;
        const rangeEnd = 200;


        // 获取极值
        data.forEach(function (item) {
            item.slice(1).forEach(function (item2) {
                if (item2 > max) {
                    max = item2;
                }
            })
        });

        //生成所有的点 pointsList的每个数组是一条线
        for (let i = 1; i <= lineCount; i++) {
            pointsList[i - 1] = data.map(function (item, index) {
                const x = (index + 1) * textWidth;
                const y = rangeEnd - item[i] / max * (rangeEnd - rangeStart);
                return [x, y];
            });
        }

        // x 轴 时间
        svg.selectAll('text')
            .data(data.map(item => item[0]))
            .enter()
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', function (d, index) {
                return `translate( ${(index + 1) * textWidth}, 212)`;
            })
            .attr('fill', theme)
            .text(function (d) {
                return d;
            });

        pointsList.forEach(function (points, index) {
            // 点
            svg.append('g').selectAll('circle')
                .data(points)
                .enter()
                .append('circle')
                .attr('r', 2)
                .attr('fill', '#fff')
                .attr('transform', function (d) {
                    return `translate( ${d[0]}, ${d[1]})`;
                });

            //连点成线
            svg.select('.path-g').append('path')
                .attr('stroke', colors[index])
                .attr('fill', 'transparent')
                .attr('d', function () {
                    var d = `M ${points[0].join(' ')}\n`;

                    points.slice(1).forEach(function (point, index) {
                        const prevPoint = points[index];
                        var p1 = `${0.5 * (prevPoint[0] + point[0])} ${prevPoint[1]}`,
                            p2 = `${0.5 * (prevPoint[0] + point[0])} ${point[1]}`,
                            p3 = point.join(' ');
                        d += `C ${p1} ${p2} ${p3} \n`;
                    });
                    return d;
                });
        });
    }

    function drawDemandFever(data) {
        var config = {
            w: 150,
            h: 150,
            levels: 3,
            ExtraWidthX: 300
        };

        drawRadar(document.getElementById('radar-content'), data, config);
    }

    /**
     * 智能招商
     * @param data
     */
    function drawIntelligentLeasing(data) {
        const svg = d3.select('.intelligent-leasing svg');
        const wrapHeight = svg.attr('height');
        const splitWidth = svg.attr('width') / data.length;
        const points = new Array(data.length).fill(null).map(function () {
            return {};
        });

        // max
        let max = 0;
        data.forEach(function (item) {
            if (item.value > max) {
                max = item.value;
            }
        });

        // text
        d3.select('.intelligent-leasing .text')
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr('transform', function (d, index) {
                const x = splitWidth * (index + 0.5);
                points[index].x = x;
                return `translate(${x}, ${wrapHeight - 8})`;
            })
            .attr('text-anchor', 'middle')
            .attr('fill', '#fff')
            .text(function (d) {
                return d.name;
            });
        // circle
        const circle = d3.select('.intelligent-leasing .circle')
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('fill', '#2a8bcc')
            .attr('cx', function (d, index) {
                return points[index].x;
            })
            .attr('cy', function () {
                return wrapHeight - 8
            })
            .attr('r', function () {
                return 1;
            });

        // animate
        circle.transition()
            .duration(1000)
            .ease(d3.easeBounce)
            .attr('r', function (d, index) {
                const r = d.value > 100 ? 11 : 7;
                points[index].r = r;
                return r;
            })
            .attr('cy', function (d, index) {
                const height = d.value / max * 100;
                const y = wrapHeight - 40 - height;
                points[index].y = y;
                return y;
            })
            .on('end', function (d, index) {
                var p1 = [points[index].x, 150],
                    p2 = [points[index].x - points[index].r, points[index].y],
                    p3 = [points[index].x + points[index].r, points[index].y];

                d3.select('.intelligent-leasing .triangle')
                    .append('polygon')
                    .attr('fill', 'rgba(211, 17, 118, 0.35)')
                    .attr('points', `${p1.join(' ')}, ${p2.join(' ')}, ${p3.join(' ')}`);

                d3.select('.intelligent-leasing .value')
                    .append('text')
                    .attr('fill', '#fcf0f6')
                    .attr('text-anchor', 'middle')
                    .attr('transform', `translate(${points[index].x}, ${points[index].y - points[index].r - 10})`)
                    .text(data[index].value);
            });

        console.log(points);

    }

    /**
     * 智能招商匹配
     */
    function drawTalentHeat(data) {
        const maxR = 48;
        const minR = 28;
        const category = ['全国', '浙江', '杭州', '海创园'];
        let activeIndex = 0;

        let max = data[0].data[0];
        let min = max;

        data.forEach(function (item) {
            item.data.forEach(function (value) {
                if (value > max) {
                    max = value;
                }
                if (value < min) {
                    min = value;
                }
            })
        });

        const circles = d3.select('.talent-heat .circle')
            .selectAll('circle')
            .data(category)
            .enter()
            .append('circle')
            .attr('fill', '#02c9d2')
            .attr('cx', function (d, index) {
                return 75 + index * 150
            })
            .attr('cy', minR)
            .attr('r', minR)
            .attr('transform', 'translate(0, 10)');

        const text = d3.select('.talent-heat .text')
            .selectAll('text')
            .data(category)
            .enter()
            .append('text')
            .attr('fill', '#000')
            .attr('text-anchor', 'middle')
            .attr('transform', function (d, index) {
                return `translate(${75 + index * 150}, ${minR + 20})`
            })
            .text(function (d) {
                return d;
            });

        const point = d3.select('.talent-heat .point')
            .selectAll('circle')
            .data(category)
            .enter()
            .append('circle')
            .attr('fill', '#000')
            .attr('cx', function (d, index) {
                return 75 + index * 150
            })
            .attr('cy', minR)
            .attr('r', 3);

        const lines = d3.select('.talent-heat .line')
            .selectAll('line')
            .data(category)
            .enter()
            .append('line')
            .attr('stroke', '#000')
            .attr('x1', function (d, index) {
                return 75 + index * 150
            })
            .attr('y1', 10)
            .attr('x2', function (d, index) {
                return 75 + index * 150;
            })
            .attr('y2', minR);


        setInterval(function () {
            const index = activeIndex % data.length;
            const legend = document.querySelectorAll('.talent-heat .legend li')[index];
            const activeLi =  document.querySelector('.talent-heat .legend .active');
            if (activeLi) {
                activeLi.classList.remove('active');
            }
            legend.classList.add('active');

            const circleData = data[index].data;
            const rArr = [];
            circles.transition()
                .duration(500)
                .attr('cy', function (d, index) {
                    const r = (circleData[index] - min) / (max - min) * (maxR - minR) + minR
                    rArr.push(r);
                    return r;
                })
                .attr('r', function (d, index) {
                    return rArr[index];
                });

            text.attr('transform', function (d, index) {
                    return `translate(${75 + index * 150}, ${rArr[index] + 20})`
                })
                .text(function (d, index) {
                    return category[index] + circleData[index] + '家'
                });

            point.transition()
                .duration(500).attr('cy', function (d, index) {
                return rArr[index];
            });

            lines.transition()
                .duration(500)
                .attr('y2', function (d, index) {
                    return rArr[index];
                });

            activeIndex ++;
        }, 2000);

    }

    /**
     * 企业资信榜
     */
    function loopWarningData() {
        const list = document.querySelectorAll('.warning-wrap li');
        const dataElem = document.querySelector('.warning-data');
        let loopIndex = 1;
        setInterval(function () {
            const index = loopIndex % 3;
            document.querySelector('.warning-wrap .active').classList.remove('active');
            const item = list[index];
            item.classList.add('active');
            dataElem.innerText = item.dataset.value + '家';
            loopIndex ++;
        }, 2000);
    }

    const industryData = [
        {name: '企业服务', value: 92},
        {name: '互联网', value: 57},
        {name: '科技研发', value: 71},
        {name: '技术推广服务', value: 163},
        {name: '电商零售', value: 34},
        {name: '广播电讯', value: 23},
        // { name: '文化艺术', value: 20 },
    ];

    const talensDemand = [
        [2013, 16, 60, 288],
        [2014, 54, 65, 100],
        [2015, 83, 89, 150],
        [2016, 106, 139, 220],
        [2017, 111, 145, 240]
    ];

    var DemandFeverData = [
        [
            {"name": "Central ", "value": 80},
            {"name": "Kirkdale", "value": 40},
            {"name": "Kensington ", "value": 40},
            {"name": "Everton ", "value": 90},
            {"name": "Picton ", "value": 60},
            {"name": "Riverside ", "value": 80}
        ]
    ];

    var IntelligentLeasingData = [
        {"name": "2017重点扶持", "value": 69},
        {"name": "历史扶持项目", "value": 300},
        {"name": "孵化器", "value": 40},
        {"name": "雏鹰计划项目", "value": 10},
    ];

    var talentHeatData = [
        {
            name: "企业服务",
            data: [365246, 26784, 11188, 1420]
        },
        {
            name: "技术推广服务",
            data: [169454, 6754, 4162, 1051]
        },
        {
            name: "科技研发",
            data: [54304, 3261, 1317, 391]
        },
        {
            name: "互联网",
            data: [29263, 2789, 1526, 301],

        },
        {
            name: "电商零售",
            data: [883538, 64728, 19188, 389],
        },
        {
            name: "软件应用",
            data: [19415, 1243, 957, 139],
        },
    ];


    // drawIndustry(industryData);

    // drawDistribution(industryData);

    // drawTalentsDemand(talensDemand, DemandFeverData);

    // drawIntelligentLeasing(IntelligentLeasingData);

    // drawTalentHeat(talentHeatData);

    loopWarningData();
})();