// Global vars
var raw = RAW;
var arrext = new ArrayExt;
var year_offset = 0;
var check = [];
var filter_check = [];
var time = null;
buildSelector( raw, config.selector );
set_title( config );

// Set the title of the graph in quesiton
function set_title( config ) {
	$('h1').text( config.title );
}

// Filtering
function filterTextbox() {
	$('#selectorFilter input').on( 'keyup', function( _e ) {
		$('#selector .item').hide();
		var val = $( this ).val();
		if ( val == '' ) {
			$('#selector .item').show();
		}
		for ( var i=0; i<filter_check.length; i++ ) {
			if ( filter_check[i].indexOf( val ) != -1 ) {
				var split = filter_check[i].split(':');
				$('#selector .item input[value="'+split[0]+'"]').parent().show();
			}
		}
	})
}

// When config.graph.width is set to "window"
// Resize graph a reasonable time after 
// window resize event stops
function resized(){
	update();
}
var timeout;
if ( config.graph.width == "window" ) {
	window.onresize = function(){
	  clearTimeout( timeout );
	  timeout = setTimeout( resized, 500 );
	};
}

// Redraw current graph
function update() {
	clear();
	graph( filter(raw) );
}

// Clear graph
function clear() {
	$('svg').remove();
}

// Build the selector
function buildSelector( _data, _key ) {
	var words = uniqWords( _data, _key );
	for ( var arab in words ) {
		// Build the selector item
		var extra = '';
		if ( words[arab] != null ) {
			extra = " <span class=\"gray\">"+words[arab]+"</span>";
		}
		var item = '<div class="item"><input type="checkbox" value="'+arab+'">'+arab+extra+"</div>";
		$('#selector').append( item );
		// Build the filter check
		filter_check.push( arab+":"+words[arab] );
	}
	selectorClick();
	filterTextbox();
}

function selectorClick() {
	$('#selector input:checkbox').change( function() {
		plot( this );
	});
	$("select[name='linetype']").change( function( e ) {
		e.preventDefault();
		plot( this );
	})
	$('#clear').on( 'touchstart click', function( e ) {
		e.preventDefault();
		$('#selector input:checkbox').attr("checked",false);
		check = [];
	})
}

function plot( elem ) {
	var val = $(elem).attr('value');
	if ( $(elem).prop('checked') ) {
		if ( $.inArray( val, check ) == -1 ) {
			check.push( val );
		}
	}
	else {
		check = arrext.exile( check, [ val ] );
	}
	if ( check.length > 0 ) {
		update();
	}
}

// Unique Words
function uniqWords( _data, _key ) {
	var filter = {};
	for ( var id in _data ) {
		var key = _data[id][config.selector];
		var phon = _data[id]["phonetic"];
		if ( key != null ) {
			filter[ key ] = phon;
		}
	}
	return filter;
}

// Filter items
function filter( _data ) {
	var match = [];
	for ( var id in _data ) {
		if ( $.inArray( _data[id][config.selector], check ) != -1 ) {
			match.push( _data[id] );
		}
	}
	return match;
}

// Calculate graph width
function graph_width() {
	if ( config.graph.width == "window" ) {
		return $(window).width() - $('#selectorFilter').width() - config.graph.padding*2;
	}
	return config.graph.width;
}

// Calculate graph height
function graph_height() {
	if ( config.graph.height == "window" ) {
		return parseInt( graph_width() * .6 );
	}
	return config.graph.height;
}

// Build the D3 chart
function graph( _data ) {
	var width = graph_width();
	var height = graph_height();
	var padding = config.graph.padding;
	
	// Build the drawing area
	var svg = d3.select( "body" ).append( "svg:svg" )
		.attr( "width", width+padding )
		.attr( "height", width+padding )
		
	var freqFn = function(d){ return d['timeseries'][1] }
	var dateFn = function(d){ return d['timeseries'][0] }
	var freqMax = function(d){ return scaleMax(d,1) }
	var nisbaFn = function(d){ return d[config.selector] }
	var cValue = function(d) { return d[config.selector] }
	var color = d3.scale.category10();
	
	// axes scale
	var dateMax = function(d){ return scaleMax(d,0) }
	var dateMin = function(d){ return scaleMin(d,0) }
	var scaleMax = function(d,i) {
		return d3.max( d['timeseries'], function(d){
			return d[i];
		});
	}
	var scaleMin = function(d,i){
		return d3.min( d['timeseries'], function(d){
			return d[i];
		});
	}
	
	var xticks = function() {
		var interval = 50;
		var scale = xscale.domain();
		var diff = scale[1]-scale[0];
		var more = diff / interval;
		for ( var i=0; i<more; i++ ) {
			scale.splice( 1, 0, scale[0]+interval*i );
		}
		return scale;
	}
	
	// X variable
	var xscale = d3.scale.linear()
		.range([ padding, width-padding ])
		.domain( [d3.min(_data, dateMin), d3.max(_data, dateMax) ] )
		
	var xAxis = d3.svg.axis()
		.scale( xscale )
		.orient( "bottom" )
		.tickValues( xticks )
	
	// Y variable
	var yscale = d3.scale.linear()
		.range([ height-padding, padding ])
 		.domain([ 0, d3.max( _data, freqMax ) ])
		
	var yAxis = d3.svg.axis()
		.scale( yscale )
		.orient( "left" )
		.ticks( 5 )
	
	// Translate
	var translate = function(d){ 
		return "translate("+xscale(freqFn(d))+","+yscale(freqFn(d))+")" 
	}

	// Build the axes
	// xAxis
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (height-padding) + ")" )
		.call( xAxis )
	.append("text")
		.attr("class", "label")
		.attr("x", width-padding)
		.attr("y", padding*.75)
		.style("text-anchor", "end")
		.text("Date (AH)");
		
	// yAxis
	svg.append("g")
		.attr("class", "y axis")
		.call( yAxis )
		.attr("transform", "translate(" + (padding) + ", 0 )" )
	.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", padding*-.9 )
		.attr("x", padding*-1 )
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Frequency");
	
	// Plot the points
	for ( var id in _data ) {
		var c = color( cValue( _data[id] ) );
		var t = _data[id]['timeseries'];
		for ( var i=0; i<t.length; i++ ) {
			var d = t[i];
			svg.append( "svg:circle" )
				.attr( "r", config.line_thickness*1.1 )
				.attr( "cx", xscale(d[0]) )
				.attr( "cy", yscale(d[1]) )
				.style("fill", c )
		}
	}
	
	// Draw the legend
	var legend = svg.selectAll(".legend")
		.data( color.domain() )
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d,i) { 
			return "translate(0,"+i*30+")"; // spacing between legend items
		});

	// Draw legend colored rectangles
	legend.append("rect")
		.attr("y", padding )
		.attr("x", width-18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", color);
	
	// Draw legend text
	legend.append("text")
		.attr("x", width-24)
		.attr("y", 9+padding )
		.attr("dy", ".35em")
		.attr("class","legendItem")
		.style("text-anchor", "start")
		.text(function(d) { return d });

	// Get the linetype
	var linetype = function() {
		return $("select[name='linetype']").val();
	}
	
	// Loess curve helper functions
	var lineFn = d3.svg.line()
		.x( function(d){ return d['x'] } )
		.y( function(d){ return d['y'] } )
		.interpolate( linetype() )
	
	// Now transform the data into something that can be easily plotted as a line
	// There's probably a simpler way of doing this with D3 but I don't know
	// it right now.
	var lines = {};
	for ( var id in _data ) {
		var c = color( cValue(_data[id]) );
		t = _data[id]['timeseries'];
		for ( var i=0; i<t.length; i++ ) {
			if (!( c in lines )) {
				lines[ c ] = [];
			}
			lines[ c ].push({ 
				x: xscale( t[i][0] ), 
				y: yscale( t[i][1] )
			});
		}
	}
	var sort = new Sorted();
	for ( var c in lines ) {
		lines[c] = sort.numSort( lines[c], 'x' );
	}
	var i=0;
	for ( var c in lines ) {
		var lindex =  i % config.line_styles.length;
		svg.append('path')
			.style("stroke-dasharray", (config.line_styles[ lindex ]) )
			.attr('d', lineFn( lines[c] ) )
			.attr('stroke', c )
			.attr('stroke-width', config.line_thickness )
			.attr('fill', 'none' );
		i++;
	}
}