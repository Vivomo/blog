/* eslint-disable no-use-before-define,import/no-extraneous-dependencies */
import Colors from '../Chart/options/colors';

const d3 = require('d3');

const radialPoint = (x, y) => {
    return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
};


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
        const svg = d3.select(elem).append('svg').attr('class', 'd3-radia-tidy-tree').attr('width', width)
            .attr('height', height);
        const g = svg.append('g').attr('transform', `translate(${width / 2 + 40},${height / 2 + 90})`);

        const tree = d3.tree()
            .size([2 * Math.PI, width / 2]);


        const root = d3.hierarchy(data, (d) => {
            return d.children;
        });

        const treeData = tree(root);
        const nodes = treeData.descendants();

        g.selectAll('.link')
            .data(treeData.links())
            .enter().append('path')
            .transition()
            .duration(2000)
            .attr('class', 'link')
            .attr('d', d3.linkRadial()
                .angle((d) => {
                    return d.x;
                })
                .radius((d) => {
                    return d.y;
                }));

        const node = g.selectAll('.node')
            .data(nodes)
            .enter().append('g')
            .attr('class', (d) => {
                return `node${d.children ? ' node--internal' : ' node--leaf'}`;
            })
            .attr('transform', (d) => {
                return `translate(${radialPoint(d.x, d.y)})`;
            });

        node.append('circle')
            .attr('r', 5);

        node.append('text')
            .attr('dy', '0.31em')
            .attr('x', (d) => {
                return d.x < Math.PI === !d.children ? 6 : -6;
            })
            .attr('text-anchor', (d) => {
                return d.x < Math.PI === !d.children ? 'start' : 'end';
            })
            .attr('transform', (d) => {
                return `rotate(${(d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI})`;
            })
            .text((d) => {
                return d.data.name;
            });
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
                .attr('dy', '.35em')
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
        const width = elem.clientWidth;
        const height = elem.clientHeight;
        const radius = Math.min(width, height) / 2;
        const category = [];
        const colors = {}; // Mapping of step category to colors.
        initHtml();
        initCategory(data);
        category.forEach((name, index) => {
            colors[name] = Colors[index % Colors.length];
        });

        // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
        const b = {
            w: 75, h: 30, s: 3, t: 10
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
            d3.select('#togglelegend').on('click', toggleLegend);

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

            d3.select('#sunburst-percentage')
                .text(percentageString);

            d3.select('#sunburst-explanation')
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

            d3.select('#sunburst-explanation')
                .style('visibility', 'hidden');
        }

        function initializeBreadcrumbTrail() {
            // Add the svg area.
            const trail = d3.select('#sunburst-sequence').append('svg:svg')
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
                .attr('dy', '0.35em')
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
                .attr('dy', '0.35em')
                .attr('text-anchor', 'middle')
                .text(percentageString);

            // Make the breadcrumb trail visible, if it's hidden.
            d3.select('#trail')
                .style('visibility', '');
        }

        function drawLegend() {
            // Dimensions of legend item: width, height, spacing, radius of rounded rect.
            const li = {
                w: 75, h: 30, s: 3, r: 3
            };

            const legend = d3.select('#legend').append('svg:svg')
                .attr('width', li.w)
                .attr('height', d3.keys(colors).length * (li.h + li.s));

            const g = legend.selectAll('g')
                .data(d3.entries(colors))
                .enter().append('svg:g')
                .attr('transform', (d, i) => {
                    return `translate(0,${i * (li.h + li.s)})`;
                });

            g.append('svg:rect')
                .attr('rx', li.r)
                .attr('ry', li.r)
                .attr('width', li.w)
                .attr('height', li.h)
                .style('fill', (d) => {
                    return d.value;
                });

            g.append('svg:text')
                .attr('x', li.w / 2)
                .attr('y', li.h / 2)
                .attr('dy', '0.35em')
                .attr('text-anchor', 'middle')
                .text((d) => {
                    return d.key;
                });
        }

        function toggleLegend() {
            const legend = d3.select('#legend');
            if (legend.style('visibility') === 'hidden') {
                legend.style('visibility', '');
            } else {
                legend.style('visibility', 'hidden');
            }
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
            elem.innerHTML = `<div id="sunburst-sequence"></div>
             <div id="sunburst-explanation">
                <span id="sunburst-percentage"></span><br>
            </div>`;
        }
    }
    
    
};

export default D3Proxy;