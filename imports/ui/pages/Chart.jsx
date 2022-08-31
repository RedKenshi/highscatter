import React, { useState, useEffect, Fragment } from "react"
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';
import Highcharts from "highcharts/highcharts";
import highcharts3d from "highcharts/highcharts-3d";
import HighchartsReact from 'highcharts-react-official'
highcharts3d(Highcharts);
import _ from 'lodash';
function addEvents(H, chart) {
  function dragStart(eStart) {
    eStart = chart.pointer.normalize(eStart);

    var posX = eStart.chartX,
      posY = eStart.chartY,
      alpha = chart.options.chart.options3d.alpha,
      beta = chart.options.chart.options3d.beta,
      sensitivity = 5, // lower is more sensitive
      handlers = [];

    function drag(e) {
      // Get e.chartX and e.chartY
      e = chart.pointer.normalize(e);

      chart.update(
        {
          chart: {
            options3d: {
              alpha: alpha + (e.chartY - posY) / sensitivity,
              beta: beta + (posX - e.chartX) / sensitivity
            }
          }
        },
        undefined,
        undefined,
        false
      );
    }

    function unbindAll() {
      handlers.forEach(function(unbind) {
        if (unbind) {
          unbind();
        }
      });
      handlers.length = 0;
    }

    handlers.push(H.addEvent(document, "mousemove", drag));
    handlers.push(H.addEvent(document, "touchmove", drag));

    handlers.push(H.addEvent(document, "mouseup", unbindAll));
    handlers.push(H.addEvent(document, "touchend", unbindAll));
  }
  H.addEvent(chart.container, "mousedown", dragStart);
  H.addEvent(chart.container, "touchstart", dragStart);
}
Highcharts.setOptions({
  colors: Highcharts.getOptions().colors.map(function(color) {
    return {
      radialGradient: {
        cx: 0.4,
        cy: 0.3,
        r: 0.5
      },
      stops: [
        [0, color],
        [
          1,
          Highcharts.Color(color)
            .brighten(-0.2)
            .get("rgb")
        ]
      ]
    };
  })
});

const Dots = props => {
  const [dotsFilter, setDotsFilter] = useState('');
  const [formValues, setFormValues] = useState({
        label:'',
        name:'',
        icon:''
  });
  const [dotsRaw, setDotsRaw] = useState([]);
  const dots = () => {
    return dotsRaw;
  }
  let options = {
    chart: {
      height:720,
      width:1200,
      renderTo: 'container',
      margin: 200,
      type: 'scatter3d',
      animation: true,
      options3d: {
        enabled: true,
        alpha: 10,
        beta: 30,
        depth: 250,
        viewDistance: 5,
        fitToPlot: false,
        frame: {
          bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
          back: { size: 1, color: 'rgba(0,0,0,0.04)' },
          side: { size: 1, color: 'rgba(0,0,0,0.06)' }
        }
      }
    },
    title: {
      text: 'Draggable box'
    },
    subtitle: {
      text: 'Click and drag the plot area to rotate in space'
    },
    plotOptions: {
      scatter: {
        width: 10,
        height: 10,
        depth: 10
      }
    },
    yAxis: {
      min: 0,
      max: 1,
      title: null
    },
    xAxis: {
      min: 0,
      max: 1,
      gridLineWidth: 1
    },
    zAxis: {
      min: 0,
      max: 1,
      showFirstLabel: false
    },
    legend: {
      enabled: false
    },
    series: [{
      name: 'Data',
      colorByPoint: false,
      accessibility: {
        exposeAsGroupOnly: true
      },
      data: dots()
    }]
  };
  const dotsQuery = gql` query dots {
    dots {
      _id
      label
      x
      y
      z
    }
  }`;
  const getHex = d => {
    return "#"+Math.floor(d.x*255).toString(16)+Math.floor(d.y*255).toString(16)+Math.floor(d.z*255).toString(16);
  }
  const loadDots = () => {
    props.client.query({
      query:dotsQuery,
      fetchPolicy:"network-only",
    }).then(({data})=>{
      setDotsRaw(data.dots.slice(0,1000).map(d=>{return({x:d.x,y:d.y,z:d.z,color:getHex(d)})}));
    })
  }
  useEffect(() => {
    loadDots();
  },[])
  return (
    <Fragment>
      <div className="dot padded columns">
        <div className="column is-8 is-offset-2">
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            callback={function(chart) {
              addEvents(Highcharts, chart);
            }}
          />
        </div>
      </div>
    </Fragment>
  )
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Dots);