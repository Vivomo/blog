/* eslint-disable */
import allColors from './Chart/options/colors';

const d3 = require('d3');
const colors = allColors.colors;
const colorCount = colors.length;

const fontSize = '0.5em';

const radialPoint = (x, y) => {
    return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
};

const zoomSvg = (svg, view, width, height) => {

    let zoom = d3.zoom()
        .scaleExtent([-3, 3])
        .translateExtent([[-500, -500], [width + 500, height + 500]])
        .on("zoom", zoomed);
    svg.call(zoom);

    function zoomed() {
        view.attr("transform", d3.event.transform);
    }
}

/**
 * d3 没有 sankey支持, 这里需要添加上
 */
const initSankey = () => {
    d3.sankey = function() {
        let sankey = {},
            nodeWidth = 24,
            nodePadding = 8,
            size = [1, 1],
            nodes = [],
            links = [];

        sankey.nodeWidth = function(_) {
            if (!arguments.length) return nodeWidth;
            nodeWidth = +_;
            return sankey;
        };

        sankey.nodePadding = function(_) {
            if (!arguments.length) return nodePadding;
            nodePadding = +_;
            return sankey;
        };

        sankey.nodes = function(_) {
            if (!arguments.length) return nodes;
            nodes = _;
            return sankey;
        };

        sankey.links = function(_) {
            if (!arguments.length) return links;
            links = _;
            return sankey;
        };

        sankey.size = function(_) {
            if (!arguments.length) return size;
            size = _;
            return sankey;
        };

        sankey.layout = function(iterations) {
            computeNodeLinks();
            computeNodeValues();
            computeNodeBreadths();
            computeNodeDepths(iterations);
            computeLinkDepths();
            return sankey;
        };

        sankey.relayout = function() {
            computeLinkDepths();
            return sankey;
        };

        sankey.link = function() {
            let curvature = .5;

            function link(d) {
                let x0 = d.source.x + d.source.dx,
                    x1 = d.target.x,
                    xi = d3.interpolateNumber(x0, x1),
                    x2 = xi(curvature),
                    x3 = xi(1 - curvature),
                    y0 = d.source.y + d.sy + d.dy / 2,
                    y1 = d.target.y + d.ty + d.dy / 2;
                return "M" + x0 + "," + y0
                    + "C" + x2 + "," + y0
                    + " " + x3 + "," + y1
                    + " " + x1 + "," + y1;
            }

            link.curvature = function(_) {
                if (!arguments.length) return curvature;
                curvature = +_;
                return link;
            };

            return link;
        };

        // Populate the sourceLinks and targetLinks for each node.
        // Also, if the source and target are not objects, assume they are indices.
        function computeNodeLinks() {
            nodes.forEach(function(node) {
                node.sourceLinks = [];
                node.targetLinks = [];
            });
            links.forEach(function(link) {
                let source = link.source,
                    target = link.target;
                if (typeof source === "number") source = link.source = nodes[link.source];
                if (typeof target === "number") target = link.target = nodes[link.target];
                source.sourceLinks.push(link);
                target.targetLinks.push(link);
            });
        }

        // Compute the value (size) of each node by summing the associated links.
        function computeNodeValues() {
            nodes.forEach(function(node) {
                node.value = Math.max(
                    d3.sum(node.sourceLinks, value),
                    d3.sum(node.targetLinks, value)
                );
            });
        }

        // Iteratively assign the breadth (x-position) for each node.
        // Nodes are assigned the maximum breadth of incoming neighbors plus one;
        // nodes with no incoming links are assigned breadth zero, while
        // nodes with no outgoing links are assigned the maximum breadth.
        function computeNodeBreadths() {
            let remainingNodes = nodes,
                nextNodes,
                x = 0;

            while (remainingNodes.length) {
                nextNodes = [];
                remainingNodes.forEach(function(node) {
                    node.x = x;
                    node.dx = nodeWidth;
                    node.sourceLinks.forEach(function(link) {
                        if (nextNodes.indexOf(link.target) < 0) {
                            nextNodes.push(link.target);
                        }
                    });
                });
                remainingNodes = nextNodes;
                ++x;
            }

            //
            moveSinksRight(x);
            scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
        }

        function moveSourcesRight() {
            nodes.forEach(function(node) {
                if (!node.targetLinks.length) {
                    node.x = d3.min(node.sourceLinks, function(d) { return d.target.x; }) - 1;
                }
            });
        }

        function moveSinksRight(x) {
            nodes.forEach(function(node) {
                if (!node.sourceLinks.length) {
                    node.x = x - 1;
                }
            });
        }

        function scaleNodeBreadths(kx) {
            nodes.forEach(function(node) {
                node.x *= kx;
            });
        }

        function computeNodeDepths(iterations) {
            let nodesByBreadth = d3.nest()
                .key(function(d) { return d.x; })
                .sortKeys(d3.ascending)
                .entries(nodes)
                .map(function(d) { return d.values; });

            //
            initializeNodeDepth();
            resolveCollisions();
            for (let alpha = 1; iterations > 0; --iterations) {
                relaxRightToLeft(alpha *= .99);
                resolveCollisions();
                relaxLeftToRight(alpha);
                resolveCollisions();
            }

            function initializeNodeDepth() {
                let ky = d3.min(nodesByBreadth, function(nodes) {
                    return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
                });

                nodesByBreadth.forEach(function(nodes) {
                    nodes.forEach(function(node, i) {
                        node.y = i;
                        node.dy = node.value * ky;
                    });
                });

                links.forEach(function(link) {
                    link.dy = link.value * ky;
                });
            }

            function relaxLeftToRight(alpha) {
                nodesByBreadth.forEach(function(nodes, breadth) {
                    nodes.forEach(function(node) {
                        if (node.targetLinks.length) {
                            let y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
                            node.y += (y - center(node)) * alpha;
                        }
                    });
                });

                function weightedSource(link) {
                    return center(link.source) * link.value;
                }
            }

            function relaxRightToLeft(alpha) {
                nodesByBreadth.slice().reverse().forEach(function(nodes) {
                    nodes.forEach(function(node) {
                        if (node.sourceLinks.length) {
                            let y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
                            node.y += (y - center(node)) * alpha;
                        }
                    });
                });

                function weightedTarget(link) {
                    return center(link.target) * link.value;
                }
            }

            function resolveCollisions() {
                nodesByBreadth.forEach(function(nodes) {
                    let node,
                        dy,
                        y0 = 0,
                        n = nodes.length,
                        i;

                    // Push any overlapping nodes down.
                    nodes.sort(ascendingDepth);
                    for (i = 0; i < n; ++i) {
                        node = nodes[i];
                        dy = y0 - node.y;
                        if (dy > 0) node.y += dy;
                        y0 = node.y + node.dy + nodePadding;
                    }

                    // If the bottommost node goes outside the bounds, push it back up.
                    dy = y0 - nodePadding - size[1];
                    if (dy > 0) {
                        y0 = node.y -= dy;

                        // Push any overlapping nodes back up.
                        for (i = n - 2; i >= 0; --i) {
                            node = nodes[i];
                            dy = node.y + node.dy + nodePadding - y0;
                            if (dy > 0) node.y -= dy;
                            y0 = node.y;
                        }
                    }
                });
            }

            function ascendingDepth(a, b) {
                return a.y - b.y;
            }
        }

        function computeLinkDepths() {
            nodes.forEach(function(node) {
                node.sourceLinks.sort(ascendingTargetDepth);
                node.targetLinks.sort(ascendingSourceDepth);
            });
            nodes.forEach(function(node) {
                let sy = 0, ty = 0;
                node.sourceLinks.forEach(function(link) {
                    link.sy = sy;
                    sy += link.dy;
                });
                node.targetLinks.forEach(function(link) {
                    link.ty = ty;
                    ty += link.dy;
                });
            });

            function ascendingSourceDepth(a, b) {
                return a.source.y - b.source.y;
            }

            function ascendingTargetDepth(a, b) {
                return a.target.y - b.target.y;
            }
        }

        function center(node) {
            return node.y + node.dy / 2;
        }

        function value(link) {
            return link.value;
        }

        return sankey;
    };
}

const D3Proxy = {
    dispose: (elem) => {
        D3Proxy.init(elem);
    },

    init: (elem) => {
        elem.innerHTML = '';
    },

    drawRadialTidyTree: (data, elem) => {
        const width = elem.clientWidth;
        const height = elem.clientHeight;
        let i = 0;
        const duration = 750;
        const svg = d3.select(elem).append('svg').attr('class', 'd3-radia-tidy-tree').attr('width', width)
            .attr('height', height);
        const view = svg.append('g').attr('class', 'view');
        const g = view.append('g').attr('transform', `translate(${width / 2 + 40},${height / 2 + 90})`);


        zoomSvg(svg, view, width, height);

        const root = d3.hierarchy(data, (d) => {
            return d.children;
        });

        const tree = d3.tree()
            .size([2 * Math.PI, width / 2])
            .separation(function (a, b) {
                return (a.parent === b.parent ? 1 : 2) / a.depth;
            });

        const d3Link = d3.linkRadial()
            .angle(function (d) {
                return d.x;
            })
            .radius(function (d) {
                return d.y;
            });


        root.x0 = width / 2;
        root.y0 = height / 2;

        update(root);

        function update(source) {

            const treeData = tree(root);

            const nodes = treeData.descendants(),
                links = nodes.slice(1);

            nodes.forEach(function (d) {
                d.y = d.depth * 180
            });

            const node = g.selectAll('g.node')
                .data(nodes, function (d) {
                    return d.id || (d.id = ++i);
                });

            const nodeEnter = node.enter().append('g')
                .attr('class', 'node')
                .attr("transform", function () {
                    return "translate(" + source.x0 + "," + source.y0 + ")";
                })
                .on('click', click);

            nodeEnter.append('circle')
                .attr('class', 'node')
                .attr('r', 1e-6)
                .style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            nodeEnter.append('text')
                .attr("dy", fontSize)
                .attr("x", function (d) {
                    return d.x < Math.PI === !d.children ? 6 : -6;
                })
                .attr("text-anchor", function (d) {
                    return d.x < Math.PI === !d.children ? "start" : "end";
                })
                .attr("transform", function (d) {
                    return "rotate(" + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI + ")";
                })
                .text(function (d) {
                    return d.data.name;
                });

            const nodeUpdate = nodeEnter.merge(node);

            nodeUpdate.transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" +  radialPoint(d.x, d.y) + ")";
                });

            nodeUpdate.select('circle.node')
                .attr('r', 5)
                .style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "#fff";
                })
                .attr('cursor', 'pointer');
            nodeUpdate.select("text")
                .style("fill-opacity", 1)
                .attr("transform", function(d) {
                    return "rotate(" + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI + ")";
                });


            const nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + radialPoint(d.x, d.y) + ")";
                })
                .remove();

            // 节点和文字动画消失
            nodeExit.select('circle')
                .attr('r', 1e-6);

            nodeExit.select('text')
                .style('fill-opacity', 1e-6);

            // ****************** links section ***************************

            const link = g.selectAll('path.link')
                .data(links, function (d) {
                    return d.id;
                });

            const linkEnter = link.enter().insert('path', "g")
                .attr("class", "link")
                .attr('d', function (d) {
                    return d3Link({source: source, target: source})
                });

            // UPDATE
            const linkUpdate = linkEnter.merge(link);

            linkUpdate.transition()
                .duration(duration)
                .attr('d', function (d) {
                    return d3Link({source: d.parent, target: d});
                });

            // 移除线
            link.exit().transition()
                .duration(duration)
                .attr('d', function (d) {
                    return d3Link({source: source, target: source})
                })
                .remove();

            // 为transition保存历史位置
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });


            // Toggle children
            function click(d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
                update(d);
            }

        }

    },

    drawDendrogram: (data, elem) => {
        // Set the dimensions and margins of the diagram

        const margin = { top: 20, right: 90, bottom: 30, left: 90 };
        const width = elem.clientWidth - margin.left - margin.right;
        const height = elem.clientHeight - margin.top - margin.bottom;

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        const svg = d3.select(elem).append('svg')
            .attr('class', 'd3-dendrogram')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        let i = 0;
        const duration = 750;

        // declares a tree layout and assigns the size
        const treeMap = d3.tree().size([height, width]);

        // Assigns parent, children, height, depth
        const root = d3.hierarchy(data, (d) => {
            return d.children;
        });
        // Collapse the node and all it's children
        const collapse = (d) => {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        };

        // Creates a curved (diagonal) path from parent to the child nodes
        const diagonal = (s, d) => {
            return `M ${s.y} ${s.x} C ${(s.y + d.y) / 2} ${s.x}, ${(s.y + d.y) / 2} ${d.x}, ${d.y} ${d.x}`;
        };

        const update = (source) => {
            // Toggle children on click.
            const click = (d) => {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
                update(d);
            };

            // Assigns the x and y position for the nodes
            const treeData = treeMap(root);

            // Compute the new tree layout.
            const nodes = treeData.descendants();
            const links = treeData.descendants().slice(1);

            // Normalize for fixed-depth.
            nodes.forEach((d) => {
                d.y = d.depth * 180;
            });

            // ****************** Nodes section ***************************

            // Update the nodes...
            const node = svg.selectAll('g.node')
                .data(nodes, (d) => {
                    return d.id || (d.id = ++i);
                });

            // Enter any new modes at the parent's previous position.
            const nodeEnter = node.enter().append('g')
                .attr('class', 'node')
                .attr('transform', () => {
                    return `translate(${source.y0},${source.x0})`;
                })
                .on('click', click);

            // Add Circle for the nodes
            nodeEnter.append('circle')
                .attr('class', 'node')
                .attr('r', 1e-6)
                .style('fill', (d) => {
                    return d._children ? 'lightsteelblue' : '#fff';
                });

            // Add labels for the nodes
            nodeEnter.append('text')
                .attr('dy', fontSize)
                .attr('x', (d) => {
                    return d.children || d._children ? -13 : 13;
                })
                .attr('text-anchor', (d) => {
                    return d.children || d._children ? 'end' : 'start';
                })
                .text((d) => {
                    return d.data.name;
                });

            // UPDATE
            const nodeUpdate = nodeEnter.merge(node);

            // Transition to the proper position for the node
            nodeUpdate.transition()
                .duration(duration)
                .attr('transform', (d) => {
                    return `translate(${d.y},${d.x})`;
                });

            // Update the node attributes and style
            nodeUpdate.select('circle.node')
                .attr('r', 4.5)
                .style('fill', (d) => {
                    return d._children ? 'lightsteelblue' : '#fff';
                })
                .attr('cursor', 'pointer');


            // Remove any exiting nodes
            const nodeExit = node.exit().transition()
                .duration(duration)
                .attr('transform', () => {
                    return `translate(${source.y},${source.x})`;
                })
                .remove();

            // On exit reduce the node circles size to 0
            nodeExit.select('circle')
                .attr('r', 1e-6);

            // On exit reduce the opacity of text labels
            nodeExit.select('text')
                .style('fill-opacity', 1e-6);

            // ****************** links section ***************************

            // Update the links...
            const link = svg.selectAll('path.link')
                .data(links, (d) => {
                    return d.id;
                });

            // Enter any new links at the parent's previous position.
            const linkEnter = link.enter().insert('path', 'g')
                .attr('class', 'link')
                .attr('d', () => {
                    const o = { x: source.x0, y: source.y0 };
                    return diagonal(o, o);
                });

            // UPDATE
            const linkUpdate = linkEnter.merge(link);

            // Transition back to the parent element position
            linkUpdate.transition()
                .duration(duration)
                .attr('d', (d) => {
                    return diagonal(d, d.parent);
                });

            // Remove any exiting links
            link.exit().transition()
                .duration(duration)
                .attr('d', () => {
                    const o = { x: source.x, y: source.y };
                    return diagonal(o, o);
                })
                .remove();

            // Store the old positions for transition.
            nodes.forEach((d) => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        };

        root.x0 = height / 2;
        root.y0 = 0;

        update(root);
    },
    /**
     * eg https://bl.ocks.org/kerryrodden/766f8f6d31f645c39f488a0befa1e3c8
     * @param data
     * @param elem
     */
    drawSunburst: (data, elem) => {
        const index = setTimeout(function () {}); // 用做 id后缀;
        const width = elem.clientWidth;
        const height = elem.clientHeight;
        const radius = Math.min(width, height) / 2;
        const category = [];
        const colors = {};
        let legend = null;

        initHtml();
        initCategory(data);
        category.forEach((name, index) => {
            colors[name] = allColors.colors[index % allColors.colors.length];
        });

        // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
        const b = {
            w: 120, h: 30, s: 3, t: 10
        };

        // Total size of all segments; we set this later, after loading the data.
        let totalSize = 0;

        const vis = d3.select(elem).append('svg:svg')
            .attr('class', 'd3-sunburst')
            .attr('width', width)
            .attr('height', height)
            .append('svg:g')
            .attr('id', 'container')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        const partition = d3.partition()
            .size([2 * Math.PI, radius * radius]);

        const arc = d3.arc()
            .startAngle((d) => {
                return d.x0;
            })
            .endAngle((d) => {
                return d.x1;
            })
            .innerRadius((d) => {
                return Math.sqrt(d.y0);
            })
            .outerRadius((d) => {
                return Math.sqrt(d.y1);
            });


        createVisualization(data);

        // Main function to draw and set up the visualization, once we have the data.
        function createVisualization(json) {
            // Basic setup of page elements.
            initializeBreadcrumbTrail();
            drawLegend();
            d3.select(`#togglelegend-${index}`).on('click', function() {
                legend.classList.toggle('hidden');
            });

            // Bounding circle underneath the sunburst, to make it easier to detect
            // when the mouse leaves the parent g.
            vis.append('svg:circle')
                .attr('r', radius)
                .style('opacity', 0);

            // Turn the data into a d3 hierarchy and calculate the sums.
            const root = d3.hierarchy(json)
                .sum((d) => {
                    return d.value;
                })
                .sort((a, b) => {
                    return b.value - a.value;
                });

            // For efficiency, filter nodes to keep only those large enough to see.
            const nodes = partition(root).descendants()
                .filter((d) => {
                    return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
                });

            const path = vis.data([json]).selectAll('path')
                .data(nodes)
                .enter()
                .append('svg:path')
                .attr('display', (d) => {
                    return d.depth ? null : 'none';
                })
                .attr('d', arc)
                .attr('fill-rule', 'evenodd')
                .style('fill', (d) => {
                    return colors[d.data.name];
                })
                .style('opacity', 1)
                .on('mouseover', mouseover);

            // Add the mouseleave handler to the bounding circle.
            d3.select('#container').on('mouseleave', mouseleave);

            // Get total size of the tree = value of root node from partition.
            totalSize = path.datum().value;
        }

        // Fade all but the current sequence, and show it in the breadcrumb trail.
        function mouseover(d) {
            const percentage = (100 * d.value / totalSize).toPrecision(3);
            let percentageString = `${percentage}%`;
            if (percentage < 0.1) {
                percentageString = '< 0.1%';
            }

            d3.select(`#sunburst-percentage-${index}`)
                .text(percentageString);

            d3.select(`#sunburst-explanation-${index}`)
                .style('visibility', '');

            const sequenceArray = d.ancestors().reverse();
            sequenceArray.shift(); // remove root node from the array
            updateBreadcrumbs(sequenceArray, percentageString);

            // Fade all the segments.
            d3.selectAll('path')
                .style('opacity', 0.3);

            // Then highlight only those that are an ancestor of the current segment.
            vis.selectAll('path')
                .filter((node) => {
                    return (sequenceArray.indexOf(node) >= 0);
                })
                .style('opacity', 1);
        }

        // Restore everything to full opacity when moving off the visualization.
        function mouseleave() {
            // Hide the breadcrumb trail
            d3.select('#trail')
                .style('visibility', 'hidden');

            // Deactivate all segments during transition.
            d3.selectAll('path').on('mouseover', null);

            // Transition each segment to full opacity and then reactivate it.
            d3.selectAll('path')
                .transition()
                .duration(1000)
                .style('opacity', 1)
                .on('end', function () {
                    d3.select(this).on('mouseover', mouseover);
                });

            d3.select(`#sunburst-explanation`)
                .style('visibility', 'hidden');
        }

        function initializeBreadcrumbTrail() {
            // Add the svg area.
            const trail = d3.select(`#sunburst-sequence-${index}`).append('svg:svg')
                .attr('width', width)
                .attr('height', 50)
                .attr('id', 'trail');
            // Add the label at the end, for the percentage.
            trail.append('svg:text')
                .attr('id', 'endlabel')
                .style('fill', '#000');
        }

        // Generate a string that describes the points of a breadcrumb polygon.
        function breadcrumbPoints(d, i) {
            const points = [];
            points.push('0,0');
            points.push(`${b.w},0`);
            points.push(`${b.w + b.t},${b.h / 2}`);
            points.push(`${b.w},${b.h}`);
            points.push(`0,${b.h}`);
            if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
                points.push(`${b.t},${b.h / 2}`);
            }
            return points.join(' ');
        }

        // Update the breadcrumb trail to show the current sequence and percentage.
        function updateBreadcrumbs(nodeArray, percentageString) {
            // Data join; key function combines name and depth (= position in sequence).
            const trail = d3.select('#trail')
                .selectAll('g')
                .data(nodeArray, (d) => {
                    return d.data.name + d.depth;
                });

            // Remove exiting nodes.
            trail.exit().remove();

            // Add breadcrumb and label for entering nodes.
            const entering = trail.enter().append('svg:g');

            entering.append('svg:polygon')
                .attr('points', breadcrumbPoints)
                .style('fill', (d) => {
                    return colors[d.data.name];
                });

            entering.append('svg:text')
                .attr('x', (b.w + b.t) / 2)
                .attr('y', b.h / 2)
                .attr('dy', fontSize)
                .attr('text-anchor', 'middle')
                .text((d) => {
                    return d.data.name;
                });

            // Merge enter and update selections; set position for all nodes.
            entering.merge(trail).attr('transform', (d, i) => {
                return `translate(${i * (b.w + b.s)}, 0)`;
            });

            // Now move and update the percentage at the end.
            d3.select('#trail').select('#endlabel')
                .attr('x', (nodeArray.length + 0.5) * (b.w + b.s))
                .attr('y', b.h / 2)
                .attr('dy', fontSize)
                .attr('text-anchor', 'middle')
                .text(percentageString);

            // Make the breadcrumb trail visible, if it's hidden.
            d3.select('#trail')
                .style('visibility', '');
        }

        function drawLegend() {
            legend = document.getElementById(`legend-${index}`);
            const listHtml = category.map(function (name) {
                return `<li title="${name}" style="background: ${colors[name]}">${name}</li>`;
            }).join('');
            legend.innerHTML = `<ul class="sunburst-category">${listHtml}</ul>`;
        }


        function initCategory(data) {
            if (data.children) {
                data.children.forEach((item) => {
                    !category.includes(item.name) && category.push(item.name);
                    initCategory(item);
                });
            }
        }

        function initHtml() {
            elem.innerHTML = `<div id="sunburst-sequence-${index}" class="sunburst-sequence"></div>
             <div id="sunburst-explanation-${index}" class="sunburst-explanation">
                <span id="sunburst-percentage-${index}" class="sunburst-percentage"></span><br>
            </div>
            <div class="sunburst-sidebar">
                <input type="checkbox" class="togglelegend" id="togglelegend-${index}">标签<br/>
                <div id="legend-${index}" class="legend hidden"></div>
            </div>`;
        }
    },

    drawSankey: (data, elem) => {
        !d3.sankey && initSankey();
        const units = '';

        // set the dimensions and margins of the data
        const margin = { top: 10, right: 10, bottom: 10, left: 10 };
        const width = elem.clientWidth - margin.left - margin.right;
        const height = elem.clientHeight - margin.top - margin.bottom;

        // format letiables
        const formatNumber = d3.format(',.0f');    // zero decimal places
        const format = d => `${formatNumber(d)} ${units}`;
        let nodeIndex = 0;

        // append the svg object to the body of the page
        const svg = d3.select(elem).append('svg')
            .attr('class', 'd3-sankey')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Set the sankey diagram properties
        const sankey = d3.sankey()
            .nodeWidth(36)
            .nodePadding(10)
            .size([width, height]);

        const path = sankey.link();

        const graphMap = {};
        data.nodes.forEach((node, index) => {
            node.node = index;
            graphMap[node.name] = index;
        });
        data.links.forEach((link) => {
            link.source = graphMap[link.source];
            link.target = graphMap[link.target];
        });

        // load the data

        sankey
            .nodes(data.nodes)
            .links(data.links)
            .layout(32);

        // add in the links
        const link = svg.append('g').selectAll('.link')
            .data(data.links)
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', path)
            .style('stroke-width', (d) => {
                return Math.max(1, d.dy);
            })
            .sort((a, b) => {
                return b.dy - a.dy;
            });

        // add the link titles
        link.append('title')
            .text((d) => {
                return `${d.source.name} → ${d.target.name}\n${format(d.value)}`;
            });

        // add in the nodes
        const node = svg.append('g').selectAll('.node')
            .data(data.nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', (d) => {
                return `translate(${d.x},${d.y})`;
            })
            .call(d3.drag()
                .subject((d) => {
                    return d;
                })
                .on('start', function () {
                    this.parentNode.appendChild(this);
                })
                .on('drag', dragmove));

        // add the rectangles for the nodes
        node.append('rect')
            .attr('height', (d) => {
                return d.dy;
            })
            .attr('width', sankey.nodeWidth())
            .style('fill', (d) => {
                return d.color = colors[nodeIndex++ % colorCount]; // color(d.name.replace(/ .*/, ''));
            })
            .style('stroke', (d) => {
                return d3.rgb(d.color).darker(2);
            })
            .append('title')
            .text((d) => {
                return `${d.name}\n${format(d.value)}`;
            });

        // add in the title for the nodes
        node.append('text')
            .attr('x', -6)
            .attr('y', (d) => {
                return d.dy / 2;
            })
            .attr('dy', fontSize)
            .attr('text-anchor', 'end')
            .attr('transform', null)
            .text((d) => {
                return d.name;
            })
            .filter((d) => {
                return d.x < width / 2;
            })
            .attr('x', 6 + sankey.nodeWidth())
            .attr('text-anchor', 'start');

        // the function for moving the nodes
        function dragmove(d) {
            d3.select(this)
                .attr('transform',
                    `translate(${
                     d.x},${
                     d.y = Math.max(
                            0, Math.min(height - d.dy, d3.event.y))})`);
            sankey.relayout();
            link.attr('d', path);
        }
    },
    
};

export default D3Proxy;