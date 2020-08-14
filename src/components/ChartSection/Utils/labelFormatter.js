/**
 * Plain JS function to render legend's items.
 * The *this* keyword refers to the series object and, therefore, typescript would assume incorret context
 * if function was declared in *ChartSection*.
 * 
 * @see https://api.highcharts.com/highcharts/legend.labelFormatter
 * @see https://github.com/kirjs/react-highcharts/issues/121 (don't want to use ref or hacky bypasses as suggested here)
 */
const formatterFunc = function() {
    return `<span style="color:${this.color};">${this.name}</span>`; 
}
export default formatterFunc;