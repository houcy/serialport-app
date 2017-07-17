var settings = {
    multiple: 2,
    markCount: 0
};

/**
 * 摇杆控制程序
 */

var space = 18;
var zoomSize = $(document).width() / 3 - space * 2;
var joystickL = createZone("zoneL");
var joystickC = createZone("zoneC");
var joystickR = createZone("zoneR");

function createZone(eleId) {
    var options = {
      zone: document.getElementById(eleId),
      mode: 'static',
      position: {
          left: "50%",
          top: "50%"
      },
      color: '#333',
      multitouch: false,
      size: zoomSize,
      restOpacity: 0.8
  };
  var joystick = nipplejs.create(options);
  return joystick;
}


function bindNipple() {
    joystick.on('start end', function(evt, data) {
        dump(evt.type);
        debug(data);
    }).on('move', function(evt, data) {
        debug(data);
    }).on('dir:up plain:up dir:left plain:left dir:down' +
        'plain:down dir:right plain:right',
        function(evt, data) {
            dump(evt.type);
        }
    ).on('pressure', function(evt, data) {
        debug({
            pressure: data
        });
    });
}

/* 象限
 *
 *   2 | 1
 *   -----
 *   3 | 4
 */
function calControl(distance, degree, position, direction) {
    var speed = 255 * distance / (options.size * 0.5);
    var left = 0,
        right = 0;

    // 1
    if (degree >= 0 & degree < 90) {
        right = speed - (90 - degree) * settings.multiple;
        left = -speed;
    }

    // 2
    if (degree >= 90 & degree < 180) {
        right = speed;
        left = -(speed - (degree - 90) * settings.multiple);
    }

    // 3
    if (degree >= 180 & degree < 270) {
        right = -speed;
        left = (speed - (270 - degree) * settings.multiple);
    }

    // 4
    if (degree >= 270 & degree < 360) {
        right = -(speed - (degree - 270) * settings.multiple);
        left = speed;
    }

    setTimeout(function() {
        left = parseInt(left);
        right = parseInt(right);
        console.log('speed: ' + left + ':' + right);
        $('.speedL').html(left);
        $('.speedR').html(right);
        motion.setSpeed(left, right);
    }, 10);
}

function debug(obj) {
    // output data
    if (obj.distance && obj.angle && obj.position && obj.direction) {
        calControl(obj.distance, obj.angle.degree, obj.position, obj.direction);
        console.log(obj.distance);
    }

    function parseObj(sub, el) {
        for (var i in sub) {
            if (typeof sub[i] === 'object' && el) {
                parseObj(sub[i], el[i]);
            } else if (el && el[i]) {
                el[i].innerHTML = sub[i];
            }
        }
    }
    setTimeout(function() {
        parseObj(obj, els);
    }, 0);
}

var nbEvents = 0;
// Dump data
function dump(evt) {
    if (evt == 'end') {
        console.log(1);
        stopSnipt();
    }
    setTimeout(function() {
        if (elDump.children.length > 4) {
            elDump.removeChild(elDump.firstChild);
        }
        var newEvent = document.createElement('div');
        newEvent.innerHTML = '#' + nbEvents + ' : <span class="data">' +
            evt + '</span>';
        elDump.appendChild(newEvent);
        nbEvents += 1;
    }, 0);
}
/* debug ends */