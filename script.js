var width = 700;
var height = 600;
var aspect = width / height;
var xDomain = 100;
var yDomain = 10;
var noRows = 4;
var radScale = 8;

// SVG to work with
var svg = d3.select('#vis')
  .append('svg')
  .attr('height', height)
  .attr('width', width)
  .attr("viewBox", "0 0 "+ width +" " + height +"")
  .attr("preserveAspectRatio", "xMidYMid")
  .attr("id", "chart");

// Circle positioning function
var circleFunc = function(circle) {
//     console.log("circle function called");
    circle.attr('r', function(d) { return d.r})
          .attr('fill', function(d) {return d.colour || 'blue' })
          .attr('cx', function(d) { return xScale(d.x)})
          .attr('cy', function(d) { return yScale(d.y)})
          .attr('class', function(d) {return d.class})
}

// Reusable drawing function
var draw = function(data) {
    // Bind self.settings.data
    var circles = svg.selectAll('circle').data(data)

    // Enter new elements
    circles.enter().append('circle').call(circleFunc)

    // Exit elements that may have left
    circles.exit().remove()

    // Transition all circles to new dself.settings.data
    svg.selectAll('circle').transition().duration(1500).call(circleFunc)
}

// Define data, xScale, yScale
function generatePoints(size, number, rowLength, scale) {
  var bucketSize = size/(number*scale);
  var buckets = []
  var rowInd = 1;
  var colInd = 1;
  for(var i=0; i<number; i++) {
    rowInd = i%rowLength + 1;
    colInd = i/rowLength + 1;
    var x = rowInd;
    var y = colInd;
    buckets.push({r: Math.sqrt(bucketSize), x: x, y: y})
  }
  buckets[0].christy = true;
  return buckets;
}

function generate_99() {
  var element = document.getElementsByClassName('influence'),
      style = window.getComputedStyle(element[0]),
      influenceColor = style.getPropertyValue('color');
  var donors = [];
  for(var i=0; i<99; i++) {
    var color = randomColor({
      luminosity: 'dark',
      hue: 'yellow'
    });
    donors.push({class: "bottom-percent", size: 1, x: i*4%xDomain + 1, y: 5+Math.floor(i/(xDomain/noRows)), r: 1*radScale, colour: color});
  }
  i=99
  donors.push({class: "top-percent", size: 66, x: i*4%xDomain + 1, y: 5+Math.floor(i/(xDomain/noRows)), r: 1*radScale, colour: influenceColor});
  return donors;
}


var chart = $("#chart"),
    container = chart.parent();
$(window).on("resize", function() {

    var targetWidth = container.width();
    chart.attr("width", targetWidth);
    chart.attr("height", Math.min(Math.round(targetWidth / aspect), Math.round(window.innerHeight*0.6)));
    console.log("resize", chart.attr("width"), targetWidth, chart.attr("height"));
    radScale = 5 + targetWidth/150;

}).trigger("resize");

var data_99 = generate_99();
var data_1 = JSON.parse(JSON.stringify(data_99))
data_1[99].r = 12.1*radScale;

var xScale = d3.scale.linear().range([0,width]).domain([0,xDomain])
var yScale = d3.scale.linear().range([0,height]).domain([0,yDomain])

var update = function(value) {
  switch(value) {
    case 1:
      var data = data_99
      console.log(data_99)
      draw(data)
      break;
    case 2:
      links = []
      for(var i=0; i<98; i++) {
        links.push({source: i, target: i+1})
        links.push({source: i, target: 99})
      }
      var data = data_1

      data_1.map((v) => {
        v.x = xScale(v.x);
        v.y = yScale(v.y);
      });
      var force = d3.layout.force()
        .size([width, height])
         .nodes(data_1)
         .links(links);

      force.linkDistance((l) => {
//         console.log(l)
        if(l.target.index === 99) {
          return 80*radScale/5 + 5;
        }
        if(l.source.index + 1 === l.target.index) {
          return -1 + 8*radScale/4;
        }
        return 10;
      });
       force.charge(function(node) {
        if (node.target === 99)  {
          return -80;
        }
        return -100;
      });
      animationStep = 20;
         data_1[99].r = 66;

      var circles = svg.selectAll('circle').data(data_1)

      svg.select('circle.top-percent').attr("r", 12.1*radScale + "")
      force.on('tick', function() {
         circles.transition().ease('linear').duration(animationStep)
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; });

        force.stop();

        // If we're animating the layout, continue after
        // a delay to allow the animation to take effect.

        if (true) {
            setTimeout(
                  function() { force.start(); },
              animationStep
            );
        }
      });
      force.start()
      break;
    default:
      var data = [{x:0, y:0, r: 5}, {x:3, y:3, r: 68}]
      draw(data)
      break;
  }
}

var run99 = false;

$("#container-one-percent").scrollStory({
  disablePastLastItem: true,
  itementerviewport: function(ev, item) {
    if(item.index === 1 && run99 === false) {
      // item.el.css('background-color', 'red');
      update(1);
    }
    if (item.index === 1) {
      $("#forty").addClass("loaded");
    }
  }
  });

$("#container-one-percent").on('itemfocus', function(ev, item){
  if (item.index === 1) {
      if (run99 === false) {
        update(2);
        run99 = true;
        $('#vis').attr("class", "fixed-vis");
      }

  } else {
    item.el.css('background-color', 'orange')
  }
});

$("#container").on('itemblur', function(ev, item){
  item.el.css('background-color', 'white');
});
  // Instantiation
  $(function() {
              // data
              var parties = [{
                  party: "BC Liberals",
                  donations: "$12,234,132"
              }, {
                  party: "BC NDP",
                  donations: "$6,234,132"
              }];

              $("#container").scrollStory({

              });

              // $("#container-one-percent").scrollStory({
              //   itemfocus: function(ev, item) {
              //       console.log(ev, item)
              //       $("#forty").addClass("loaded");
              //   }
              // });

              $("#imperial").scrollStory({
                speed: 300,
                triggerOffset: 300,
                scrollOffset: -150,
                itemfocus: function(ev, item) {
                    console.log(ev, item)
                    $("#imperial").addClass("go-dark");
                },
                itemfocus: function(ev, item) {
                  this.index(this.index())
                }
              })
      });
