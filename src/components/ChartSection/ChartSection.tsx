import React, { FunctionComponent, memo } from 'react';
import ReactHighcharts from 'react-highcharts';
import labelFormatter from './Utils/labelFormatter';

type ChartSectionProps = {
    chartSeries: Highcharts.LineChartSeriesOptions[]
}

// Compare props to prevent re-render with the same data
const compareProps = (prevProps:ChartSectionProps, nextProps: ChartSectionProps) => prevProps.chartSeries === nextProps.chartSeries;

export const ChartSection: FunctionComponent<ChartSectionProps> = memo(({chartSeries}) => {

    // charts config object
    const config: Highcharts.Options = {
        series: chartSeries.length ? chartSeries : [{ type: 'line', data: [], name: 'Waiting data' }],
        chart: {
            style: {
                fontFamily: 'inherit'
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            align: 'right',
            labelFormatter: labelFormatter,
            layout: 'vertical',
            verticalAlign: 'top',
            symbolHeight: 15,
            symbolWidth: 10,
            itemMarginBottom: 10,
            padding: 12
        },
        plotOptions: {
            line: {
                marker: {
                    symbol: 'circle',
                    radius: 7
                }
            }
        },
        title: {
            text: null
        },
        tooltip: {
            headerFormat: '',
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
              day: '%H:%M',
            },
            lineWidth: 2,
            labels: {
              style: {
                fontSize: '15px',
              },
            },
        },
        yAxis: {
            title: {
                text: null
            },
            labels: {
                enabled: false
            },
            gridLineWidth: 2
        }
    }

    return (
        <div style={{padding: '0 3em'}}>
            <ReactHighcharts config={config} />
        </div>
    );
}, compareProps)