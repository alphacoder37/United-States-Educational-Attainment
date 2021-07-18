document.addEventListener("DOMContentLoaded", function() {

    const h = 800
    const w = 1000

    // declared at the top of the script, so this can load before the data has been loaded
    const svg = d3.select("#master")
    .append("svg")
    .attr("class", "choropleth")
    .attr("height", h)
    .attr("width", w)

    fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
    .then(response => response.json())
    .then(eduData => {
        fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
        .then(response => response.json())
        .then(shapeData => {

            // projection.scale(shapeData.transform.scale)

            const g = svg.append("g")
            const s = svg.append('g')

            //tooltip
            const tooltip = d3.select("body")
            .append("div")
            .attr("id", "tooltip")
            .style("visibility", "hidden")

            let maxEd = d3.max(eduData, d => d.bachelorsOrHigher)
            let minEd = d3.min(eduData, d => d.bachelorsOrHigher)
            console.log(minEd)
            console.log(maxEd)

            let colorArr = [ 
                "#e5f5e0",
                "#c7e9c0",
                "#a1d99b",
                "#74c476",
               "#41ab5d",
                "#238b45",
                "#006d2c",
                "#00441b"]

            // color scale
            let colorScale = d3.scaleQuantize()
            .domain([minEd, maxEd])
            .range(colorArr)

            // no projection needed, as data already in correct form
            var path = d3.geoPath()
            var counties = topojson.feature(shapeData, shapeData.objects.counties)
            var states = topojson.feature(shapeData, shapeData.objects.states)

            g.selectAll('path')
            .data(counties.features)
            .enter()
            .append('path')
            .attr('class', d => `county ${d.id}`)
            .attr('d', path)
            .style("fill", d => colorScale(eduData.filter(x => x.fips === d.id).map(z => z.bachelorsOrHigher)))
            .attr("data-fips", d => d.id)
            .attr("data-education", d => eduData.filter(x => x.fips === d.id).map(z => z.bachelorsOrHigher))
            .on("mouseover", d => {
                tooltip
                .style("left", d3.event.pageX + 15 + "px")
                .style("top", d3.event.pageY - 10 + "px")
                .style("visibility", "visible")
                .html(`${eduData.filter(x => x.fips === d.id).map(z => z.area_name)}, ${eduData.filter(x => x.fips === d.id).map(z => z.state)}: ${eduData.filter(x => x.fips === d.id).map(z => z.bachelorsOrHigher)}%`)
                .attr("data-education", eduData.filter(x => x.fips === d.id).map(z => z.bachelorsOrHigher))
            })
            .on("mouseout", d=> {
                tooltip
                .style("visibility", "hidden")
            })

            // creating the states
            s.selectAll('path')
            .data(states.features)
            .enter()
            .append('path')
            .attr('class', d => `state ${d.id}`)
            .attr('d', path)
            .style('stroke', 'white')
            .style('fill', 'none')

            // creating the legend
            const legend = d3.legendColor()
            .scale(colorScale)
            .orient('horizontal')
            .labels(['3%', '12%', '21%', '30%', '39%', '48%', '57%', '66%'])
            .labelWrap(30)
            .shapePadding(4)
            .shapeWidth(25)
            .title('% Of Adults With Bachelors Degree')

            // ['2.6%', '11.7%', '20.7%', '29.8%', '38.8%', '47.9%', '57.0%', '66.0%']

            svg.append('g')
            .attr("id", "legend")
            .attr("transform", `translate(${w - 370}, 50)`)

            svg.select("#legend")
            .call(legend)

            




        })



    })


})