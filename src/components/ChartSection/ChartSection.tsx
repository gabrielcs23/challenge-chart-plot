import React, { FunctionComponent } from 'react';
import ReactHighcharts from 'react-highcharts';

type ChartSectionProps = {
    chartSeries: Highcharts.LineChartSeriesOptions[]
}

export const ChartSection: FunctionComponent<ChartSectionProps> = ({chartSeries}) => {

    const config: Highcharts.Options = {
        series: chartSeries,
        chart: {
            style: {
                fontFamily: 'inherit'
            }
        },
        title: {
            text: null
        },
        yAxis: {
            title: {
                text: null
            },
            labels: {
                enabled: false
            }
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
        plotOptions: {
            line: {
                marker: {
                    symbol: 'circle',
                }
            }
        },
        credits: {
            enabled: false
        },
        tooltip: {
            headerFormat: '',
        },
    }

    return (
        <ReactHighcharts config={config} />
    );
}