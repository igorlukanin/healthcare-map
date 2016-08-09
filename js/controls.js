var drawCitiesControl = function(selector, cities, city) {
    var selection = d3.select(selector)
        .selectAll('.controls__cities__city')
        .data(cities, function(d) { return d.город; })
        .classed('controls__cities__city', true)
        .classed('controls__cities__city_selected', function(d) { return d.город == city.город; });

    selection.enter()
        .append('a')
        .classed('controls__cities__city', true)
        .classed('controls__cities__city_selected', function(d) { return d.город == city.город; })
        .text(function(d) { return d.город; })
        .attr('href', function(d) { return '#' + d.город; });
};