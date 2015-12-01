'use strict';

var ipList = {
        'br': 'http://177.72.255.184/lib/content/themes/saopaulo/img/bt_busca.png',
        'us': 'http://74.122.182.100/favicon.ico',
        'fr': 'http://87.252.12.90/favicon.ico',
        'ca': 'http://142.213.160.134/favicon.ico',
        'ru': 'http://46.254.17.83',
        'my': 'http://www.exabytes.com.my/images/exa-favicon.ico'
    },
    colorList = {}, // key: country, value: color.
    current = 0,
    redThreshold = 1000;

function padding(hex) {
    if (1 === hex.length) {
        hex = "0" + hex;
    }

    return hex;
}

function getColor(scale) {
    var r, g, b = "00";

    scale = scale > redThreshold ? redThreshold : scale;

    if (scale < redThreshold / 2) {
        g = 'ff';
        r = parseInt((scale * 255) / (redThreshold / 2), 10);
        r = padding(r.toString(16));
    } else {
        r = 'ff';
        g = parseInt(((redThreshold - scale) * 255) / (redThreshold / 2), 10);
        g = padding(g.toString(16));
    }

    return "#" + r + g + b;

}

function updateColors() {
    var minTime = 0,
        maxTime = 2000000,
        colors = {};

    for (var key in colorList) {
        var delta = colorList[key];

        delta = delta > maxTime ? maxTime : delta;
    }

    for (var key in colorList) {
        var delta = colorList[key];
        
        colors[key] = getColor(delta);
    }
    jQuery('#vmap').vectorMap('set', 'colors', colors);
}

function ping(country) {
    var img = new Image,
        start = new Date();

    img.start = start;

    var updateCountry = function(e) {
        var end = new Date(),
            delta = end.getTime() - start.getTime();

        console.log(country + ": " + delta);
        colorList[country] = delta;
        updateColors();
    };
   
    $(img).bind('load', updateCountry).bind('error', updateCountry);

    img.src = eval('ipList.' + country) + '?v=' + start.getTime();
}

function processCountry() {
    var keys = Object.keys(ipList),
        country = keys[current];
    ping(country);
    current++;
    if (current >= keys.length) {
        current = 0;
    }
}

$(document).ready(function() {
    jQuery('#vmap').vectorMap(
    {
        map: 'world_en',
        backgroundColor: '#000',
        borderColor: '#818181',
        borderOpacity: 0.25,
        borderWidth: 1,
        color: '#666',
        enableZoom: true,
        hoverOpacity: null,
        normalizeFunction: 'linear',
        scaleColors: ['#b6d6ff', '#005ace'],
        selectedRegion: null,
        showTooltip: true,
        onRegionClick: function(element, code, region)
        {
        },
        onLabelShow: function(e, label, code) {
            if (code in colorList) {
                label.text(label.text() + ' -- ' + colorList[code] + ' ms');
            }
        },
    });


    setInterval(processCountry, 1000);
    $('#legend-end span').html(redThreshold + " ms");
});
