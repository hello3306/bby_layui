// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'),'macarons');
var myChart2 = echarts.init(document.getElementById('main2'),'macarons');
// 指定图表的配置项和数据
var option = {
    title: {
        text: '周成交量'
    },
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data:['贵航300医院','遵义医学院附属医院','贵医乌当医院']
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : ['周一','周二','周三','周四','周五','周六','周日']
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'贵航300医院',
            type:'line',
            stack: '总量',
            areaStyle: {},
            data:[320, 132, 101, 134, 90, 230, 210]
        },
        {
            name:'遵义医学院附属医院',
            type:'line',
            stack: '总量',
            areaStyle: {},
            data:[220, 182, 191, 234, 290, 330, 310]
        },
        {
            name:'贵医乌当医院',
            type:'line',
            stack: '总量',
            areaStyle: {},
            data:[150, 232, 201, 154, 190, 330, 410]
        },


    ]
};


var option2 = {
    title : {
        text: '周成交量',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['贵航300医院','遵义医学院附属医院','贵医乌当医院']
    },
    series : [
        {
            name: '成交量',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:35, name:'贵航300医院'},
                {value:10, name:'遵义医学院附属医院'},
                {value:34, name:'贵医乌当医院'}
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);
myChart2.setOption(option2);