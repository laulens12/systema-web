$('#modellModal')[0].innerHTML = `
<div class="modal-dialog modal-dialog-centered modal-xl" role="document">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="modellModalLabel"></h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md">
            <h5 id="diagHeader"></h5>
            <a href="#" class="text-dark" onclick="_reset()">Diagramm löschen</a> -
            <a href="#" class="text-dark" onclick="_run()">Diagramm zeichnen</a>
            <canvas id="modelcanv" height="300"></canvas>
          </div>
          <div class="col-md text-left">
            <h5>Konstanten</h5>
            <div class="list-group" id="konstanten">
              <div class="list-group-item noEdit toggler form-group" id="togglerKonstanten">
                <label for="formControlRange"></label>
                <input type="range" class="form-control-range" id="formControlRange" step="any">
                <a class="btn btn-sm btn-dark" href="#" onclick="_kDel()">Löschen</a>
              </div>
              <a href="#" class="list-group-item list-group-item-action text-center bg-light noEdit" id="plusKonstante">
              &plus;
              </a>
            </div>

            <h5>Endkonditionen</h5>
            <div class="list-group" id="endkonditionen">
              <div class="list-group-item noEdit toggler form-group" id="togglerSteps">
                <label for="formControlRange3">DEBUG TOGGLERSTEPS</label>
                <input type="range" class="form-control-range" id="formControlRange3" step="1">
                <br>
                <a class="btn btn-sm btn-dark" href="#" onclick="_eDel()">Löschen</a>
              </div>
              <a href="#" class="list-group-item list-group-item-action text-center bg-light noEdit" id="plusEndkondition">
                &plus;
              </a>
            </div>
          </div>
          <div class="col-md text-left">
            <h5>Variablen</h5>
            <div class="list-group" id="variablen">
              <div href="#" class="list-group-item list-group-item-action noEdit" tabindex="-1" aria-disabled="true" id="t">
                t = t + dt <br>
                t(0) = 0 <br>
                <div class="btn-group btn-group-sm" id="tbtns">
                  <a class="btn btn-dark" href="#" onclick="_vtxDiagram()">x-Achse</a>
                  <a class="btn btn-dark" href="#" onclick="_vtyDiagram()">y-Achse</a>
                </div>
              </div>
              <div class="list-group-item noEdit toggler form-group" id="togglerVariablen">
                <p id="formel"></p>
                <label for="formControlRange2"></label>
                <input type="range" class="form-control-range" id="formControlRange2" step="any">
                <br>
                <div class="btn-group btn-group-sm">
                  <a class="btn btn-dark" href="#" onclick="_vxDiagram()">x-Achse</a>
                  <a class="btn btn-dark" href="#" onclick="_vyDiagram()">y-Achse</a>
                  <a class="btn btn-dark" href="#" id="vdel" onclick="_vDel()">Löschen</a>
                </div>
                <div class="btn-group-vertical btn-group-sm">
                  <a class="btn btn-dark" href="#" onclick="_up()">&#10548;</a>
                  <a class="btn btn-dark" href="#" onclick="_down()">&#10549;</a>
                </div>
              </div>
              <a href="#" class="list-group-item list-group-item-action text-center bg-light noEdit" id="plusVariable">
                &plus;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;
$('#modellModalLabel')[0].innerHTML = _titel;

_results = {};

var _steps = 100000;
var _labelPrecision = 3;
var _gxName = "t";
var _gyName = "t";
var _kName = null;
var _vName = null;
var _eIndex = null;

function _kDel() {
  delete _konstanten[_kName];
  _kName = null;
  _resetKonstanten();
}
function _vDel() {
  delete _formeln[_vName];
  _variables.splice(_variables.indexOf(_vName), 1);
  if (_startwerte.hasOwnProperty(_vName)) {
    delete _startwerte[_vName];
  }
  if (_gxName == _vName || _gyName == _vName) {
    _reset();
  }
  _vName = null;
  _resetVariablen();
}
function _eDel() {
  delete _endkonditionen[_eIndex];
  _eIndex = null;
  _resetEndkonditionen();
}

function _vyDiagram() {
  _gyName = _vName;
  $("#diagHeader").text(_gyName + "," + _gxName + "-Diagramm");
  _run();
}
function _vxDiagram() {
  _gxName = _vName;
  $("#diagHeader").text(_gyName + "," + _gxName + "-Diagramm");
  _run();
}
function _vtyDiagram() {
  _gyName = "t";
  $("#diagHeader").text(_gyName + "," + _gxName + "-Diagramm");
  _run();
}
function _vtxDiagram() {
  _gxName = "t";
  $("#diagHeader").text(_gyName + "," + _gxName + "-Diagramm");
  _run();
}

function _array_move(_arr, _old_index, _new_index) {
  if (_new_index >= _arr.length) {
    var _k = _new_index - _arr.length + 1;
    while (_k--) {
      _arr.push(undefined);
    }
  }
  _arr.splice(_new_index, 0, _arr.splice(_old_index, 1)[0]);
};
function _up() {
  var _index = _variables.indexOf(_vName);
  if (_index > 0)
  {
    _array_move(_variables, _index, _index-1);
  }
  _resetVariablen();
  _run();
}
function _down() {
  var _index = _variables.indexOf(_vName);
  if (_index >= 0)
  {
    _array_move(_variables, _index, _index+1);
  }
  _resetVariablen();
  _run();
}

$("#plusKonstante").click(function(){
  var _name = prompt("Neue Konstante: Name");
  if (_name != null && _name != "") {
    var _value = prompt("Wert " + _name);
    if (_value != null && _value != "") {
      _konstanten[_name] = _value;
      _resetKonstanten();
    }
  }
});
$("#plusVariable").click(function(){
  var _name = prompt("Neue Variable: Name");
  if (_name != null && _name != "") {
    var _formel = prompt("Formel für " + _name);
    if (_formel != null && _formel != "") {
      var _initial = prompt("Startwert für " + _name);
      _formeln[_name] = _formel;
      _variables.push(_name);
      if (_initial != null && _initial != "") {
        _startwerte[_name] = _initial;
      }
      _resetVariablen();
    }
  }
});
$("#plusEndkondition").click(function(){
  var _kondition = prompt("Neue Endkondition");
  if (_kondition != null && _kondition != "") {
    _endkonditionen.push(_kondition);
    _resetEndkonditionen();
  }
});
// TODO: implement

function _resetKonstanten() {
  $('#konstanten>a:not(.noEdit)').remove();
  if (_kName == null) {
    $("#togglerKonstanten").hide();
    for (var _konstante in _konstanten) {
      if (_konstanten.hasOwnProperty(_konstante)) {
        var _newLink = $('<a href="#" class="list-group-item list-group-item-action" id="' + _konstante + '">' + _konstante + ' = ' + _konstanten[_konstante] + '</a>');
        _newLink.insertBefore('#togglerKonstanten');
        $("#togglerKonstanten").hide();
      }
    }
  }
  else {
    var _doneName = false;
    for (var _konstante in _konstanten) {
      if (_konstanten.hasOwnProperty(_konstante)) {
        if (_konstante == _kName) {
          _doneName = true;
        }
        else {
          var _newLink = $('<a href="#" class="list-group-item list-group-item-action" id="' + _konstante + '">' + _konstante + ' = ' + _konstanten[_konstante] + '</a>');
          if (!_doneName) {
            _newLink.insertBefore('#togglerKonstanten');
          }
          else {
            _newLink.insertBefore('#plusKonstante');
          }
        }
      }
    }
  }
  $('#konstanten>a:not(.noEdit)').click(function(){
    _kName = $(this)[0].id;
    _resetKonstanten();
    $("#togglerKonstanten").show();
    _vName = null;
    _eIndex = null;
    _resetVariablen();
    _resetEndkonditionen();
    _resetKInput();
  });
}
function _resetKInput() {
  var _value = _konstanten[_kName];
  var _input = $("#togglerKonstanten>input")[0];

  if (_value > 0) {
    _input.min = 0;
    _input.max = 2*_value;
  }
  if (_value == 0) {
    _input.min = -10;
    _input.max = 10;
  }
  if (_value < 0) {
    _input.min = 2*_value;
    _input.max = 0;
  }
  _input.value = _value;

  $("#togglerKonstanten>input").off("change input mouseup touchend keyup");
  $("#togglerKonstanten>input").on("change input", function(){
    $("#togglerKonstanten>label")[0].innerHTML = _kName + " = " + _input.value;
    _konstanten[_kName] = _input.value;
    _run();
  });
  $("#togglerKonstanten>input").on("mouseup touchend keyup", function(_evt){
    if (_evt.type != "keyup") $("#togglerKonstanten>input").blur();
    _konstanten[_kName] = _input.value;
    _resetKInput();
    _run();
    return false;
  });
  $("#togglerKonstanten>input").on("mousemove touchmove", function(){
    if ($("#togglerKonstanten>input").is(":focus") == false) {
      return false;
    }
  });

  $("#togglerKonstanten>label")[0].innerHTML = _kName + " = " + _input.value;
  $("#togglerKonstanten>label").click(function(_evt){
    _evt.stopImmediatePropagation();
    var _rawInput = prompt("Wert für " + _kName + " eingeben").replace(",", ".");
    var _entered = Number(_rawInput);
    if (_rawInput != "" && !isNaN(_entered)) {
      _konstanten[_kName] = _entered;
      _resetKInput();
      _run();
    }
    else {
      alert("Das ist keine Zahl.")
    }
  });
  if (_kName == "dt") {
    $("#togglerKonstanten>a").hide();
  }
  else {
    $("#togglerKonstanten>a").show();
  }
}
_resetKonstanten();

function _resetVariablen() {
  $('#t').click(function(){
    _vName = null;
    _resetVariablen();
    $('#tbtns').show();
    _kName = null;
    _resetKonstanten();
  });
  $('#tbtns').hide();
  $('#variablen>a:not(.noEdit)').remove();
  if (_vName == null) {
    $("#togglerVariablen").hide();
    for (var _index in _variables) {
      var _formel = _variables[_index];
      if (_formeln.hasOwnProperty(_formel)) {
        if (_startwerte.hasOwnProperty(_formel)) {
          _html = '<a href="#" class="list-group-item list-group-item-action" id="' + _formel + '">' + _formel + ' = ' + _formeln[_formel] + '<br>' +
          _formel + '(0) = ' + _startwerte[_formel];
          $('#togglerVariablen').before(_html);
        }
        else {
          _html = '<a href="#" class="list-group-item list-group-item-action" id="' + _formel + '">' + _formel + ' = ' + _formeln[_formel];
          $('#togglerVariablen').before(_html);
        }
      }
    }
  }
  else {
    var _doneName = false;
    for (var _index in _variables) {
      var _formel = _variables[_index];
      if (_formeln.hasOwnProperty(_formel)) {
        if (_formel == _vName) {
          _doneName = true;
        }
        else {
          var _html = "";
          if (_startwerte.hasOwnProperty(_formel)) {
            _html = '<a href="#" class="list-group-item list-group-item-action" id="' + _formel + '">' + _formel + ' = ' + _formeln[_formel] + '<br>' +
            _formel + '(0) = ' + _startwerte[_formel];
          }
          else {
            _html = '<a href="#" class="list-group-item list-group-item-action" id="' + _formel + '">' + _formel + ' = ' + _formeln[_formel];
          }

          if (!_doneName) {
            $('#togglerVariablen').before(_html);
          }
          else {
            $('#plusVariable').before(_html);
          }
        }
      }
    }
  }
  $('#variablen>a:not(.noEdit)').click(function(){
    _vName = $(this)[0].id;
    _resetVariablen();
    $("#togglerVariablen").show();
    if (!_startwerte.hasOwnProperty(_vName)) {
      $("#togglerVariablen>input").hide();
      $("#formel").hide();
    }
    else {
      $("#togglerVariablen>input").show();
      $("#formel").show();
    }
    _kName = null;
    _eIndex = null;
    _resetKonstanten();
    _resetEndkonditionen();
    _resetVInput();
  });
}
function _resetVInput() {
  var _value = _startwerte[_vName];
  var _input = $("#togglerVariablen>input")[0];

  if (_value > 0) {
    _input.min = 0;
    _input.max = 2*_value;
  }
  if (_value == 0) {
    _input.min = -10;
    _input.max = 10;
  }
  if (_value < 0) {
    _input.min = 2*_value;
    _input.max = 0;
  }
  _input.value = _value;

  $("#formel").show();
  $("#formel")[0].innerHTML = _vName + " = " + _formeln[_vName];

  if (_startwerte.hasOwnProperty(_vName)) {
    $("#togglerVariablen>label").show()
    $("#togglerVariablen>label")[0].innerHTML = _vName + "(0) = " + _input.value;
  }
  else {
    $("#togglerVariablen>label").hide()
  }

  $("#togglerVariablen>input").off("change input mouseup touchend keyup");
  $("#togglerVariablen>input").on("change input", function(){
    if (_startwerte.hasOwnProperty(_vName)) {
      _startwerte[_vName] = _input.value;
      $("#formel")[0].innerHTML = "<br>";
      $("#togglerVariablen>label")[0].innerHTML = _vName + "(0) = " + _input.value;
      _run();
    }
    else {
      $("#formel")[0].innerHTML = _vName + " = " + _formeln[_vName];
    }
  });
  $("#togglerVariablen>input").on("mouseup touchend keyup", function(_evt){
    if (_evt.type != "keyup") $("#togglerVariablen>input").blur();
    _startwerte[_vName] = _input.value;
    _resetVInput();
    _run();
    return false;
  });
  $("#togglerVariablen>input").on("mousemove touchmove", function(){
    if ($("#togglerVariablen>input").is(":focus") == false) {
      return false;
    }
  });

  $("#togglerVariablen>label").click(function(_evt){
    _evt.stopImmediatePropagation();
    var _rawInput = prompt("Startwert für " + _vName + " eingeben").replace(",", ".");
    var _entered = Number(_rawInput);
    if (_rawInput != "" && !isNaN(_entered)) {
      _startwerte[_vName] = _entered;
      _resetVInput();
      _run();
    }
    else {
      alert("Das ist keine Zahl.")
    }
  });
  $("#formel").click(function(_evt){
    _evt.stopImmediatePropagation();
    // alert("Formel ändern!");
    var _entered = prompt("Formel für " + _vName + " eingeben");
    if (_entered != null && _entered != "")
    {
      _formeln[_vName] = _entered;
      $("#formel")[0].innerHTML = _entered;
      _resetVInput();
      _run();
    }
  });
  if (_vName == "t") {
    $("#vdel").hide();
    $("#togglerVariablen>input").hide();
  }
  else {
    $("#vdel").show();
    $("#togglerVariablen>input").show();
  }
}
_resetVariablen();

function _resetEndkonditionen() {
  $('#endkonditionen>a:not(.noEdit)').remove();
  if (_eIndex == null) {
    $("#togglerSteps").hide();
    for (var _endkondition in _endkonditionen) {
      if (_endkonditionen[_endkondition] != null) {
        if (_endkondition == 0) {
          var _newLink = $('<a href="#" class="list-group-item list-group-item-action" id="ek_' + _endkondition + '">' + _endkonditionen[_endkondition] + ' Durchläufe</a>');
        }
        else {
          var _newLink = $('<a href="#" class="list-group-item list-group-item-action" id="ek_' + _endkondition + '">' + _endkonditionen[_endkondition] + '</a>');
        }
        _newLink.insertBefore('#togglerSteps');
      }
    }
  }
  else {
    var _doneIndex = false;
    for (var _endkondition in _endkonditionen) {
      if (_endkonditionen[_endkondition] != null) {
        if (_endkondition == _eIndex) {
          _doneIndex = true;
        }
        else {
          if (_endkondition == 0) {
            var _newLink = $('<a href="#" class="list-group-item list-group-item-action" id="ek_' + _endkondition + '">' + _endkonditionen[_endkondition] + ' Durchläufe</a>');
          }
          else {
            var _newLink = $('<a href="#" class="list-group-item list-group-item-action" id="ek_' + _endkondition + '">' + _endkonditionen[_endkondition] + '</a>');
          }
          if (!_doneIndex) {
            _newLink.insertBefore('#togglerSteps');
          }
          else {
            _newLink.insertBefore('#plusEndkondition');
          }
        }
      }
    }
  }
  $('#ek_0').click(function(){
    _eIndex = 0;
    _resetEndkonditionen();
    $("#togglerSteps").show();
    _vName = null;
    _kName = null;
    _resetVariablen();
    _resetKonstanten();
    _resetEInput();
    $("#togglerSteps>input").show();
  });
  $('#endkonditionen>a:not(.noEdit,#ek_0)').click(function(){
    _eIndex = Number.parseInt($(this)[0].id.slice(3));
    _resetEndkonditionen();
    $("#togglerSteps").show();
    _vName = null;
    _kName = null;
    _resetVariablen();
    _resetKonstanten();
    _resetEInput();
    $("#togglerSteps>input").hide();
  });
  if (_eIndex == 0) {
    $("#togglerSteps>a").hide();
  }
  else {
    $("#togglerSteps>a").show();
  }
}
function _resetEInput() {
  if (_eIndex == 0) {
    var _value = Number.parseInt(_endkonditionen[0]);
    var _input = $("#togglerSteps>input")[0];
    _input.min = 1;
    _input.max = 2*_value;
    if (_input.max > _steps) {
      _input.max = _steps;
    }
    _input.value = _value;

    $("#togglerSteps>input").off("change input mouseup touchend keyup");
    $("#togglerSteps>input").on("change input", function(){
      $("#togglerSteps>label")[0].innerHTML = _input.value + " Durchläufe";
      _endkonditionen[0] = _input.value;
      _run();
    });
    $("#togglerSteps>input").on("mouseup touchend keyup", function(_evt){
      if (_evt.type != "keyup") $("#togglerSteps>input").blur();
      _endkonditionen[0] = _input.value;
      _resetEInput();
      _run();
      return false;
    });
    $("#togglerSteps>input").on("mousemove touchmove", function(){
      if ($("#togglerSteps>input").is(":focus") == false) {
        return false;
      }
    });

    $("#togglerSteps>label")[0].innerHTML = _input.value + " Durchläufe";
    $("#togglerSteps>label").off("click");
    $("#togglerSteps>label").click(function(_evt){
      _evt.stopImmediatePropagation();
      var _rawInput = prompt("Anzahl der Durchläufe eingeben").replace(",", ".");
      var _entered = Number.parseInt(_rawInput);
      if (_rawInput != "" && !isNaN(_entered) && _entered <= _steps && _entered >= 1) {
        _endkonditionen[0] = _entered;
        _resetEInput();
        _run();
      }
      else {
        alert("Das ist keine positive ganze Zahl unter " + _steps + ".");
      }
    });
  }
  else {
    $("#togglerSteps>label")[0].innerHTML = _endkonditionen[_eIndex];
    $("#togglerSteps>label").off("click");
    $("#togglerSteps>label").click(function(_evt){
      _evt.stopImmediatePropagation();
      var _entered = prompt("Endkondition eingeben").replace(",", ".");
      if (_entered != null && _entered != "") {
        _endkonditionen[_eIndex] = _entered;
        _resetEndkonditionen();
        _resetEInput();
        _run();
      }
    });
  }
}
_resetEndkonditionen();

// -- -- -- CHART -- -- --
var _ctx = $('#modelcanv');
var _scatterChart = new Chart(_ctx, {
  type: 'scatter',
  data: {
    datasets: [{
      data: []
    }]
  },
  options: {
    legend: {
      display: false
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          return _gxName + " = " + tooltipItem.xLabel.toFixed(_labelPrecision) + ", " + _gyName + " = " + tooltipItem.yLabel.toFixed(_labelPrecision);
        }
      }
    },
    scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom'
      }]
    }
  }
});

function _reset() {
  _scatterChart.data.datasets[0].data = [];
  _scatterChart.update();
}

function _run() {
  _reset();
  for (var _key in _startwerte) {
    if (_startwerte.hasOwnProperty(_key))
    {
      var _result = _startwerte[_key];
      _results[_key] = [_result];
      eval(_key + " = " + _result + ";");
    }
  }
  var _result = 0;
  _results["t"] = [_result];
  t = _result;
  for (var _key in _konstanten) {
    if (_konstanten.hasOwnProperty(_key))
    {
      var _result = _konstanten[_key];
      _results[_key] = [_result];
      eval(_key + " = " + _result + ";");
    }
  }
  for (var _index in _variables) {
    var _key = _variables[_index];
    if (_formeln.hasOwnProperty(_key)){
      if (!_startwerte.hasOwnProperty(_key))
      {
        var _result = eval(_formeln[_key]);
        _results[_key] = [_result];
        eval(_key + " = " + _result + ";");
      }
    }
  }
  var _lastI = 0;
  for (_i = 1; _i < _steps; _i++) {
    for (var _index in _variables) {
      var _key = _variables[_index];
      if (_formeln.hasOwnProperty(_key))
      {
        var _result = eval(_formeln[_key]);
        _results[_key][_i] = _result;
        eval(_key + " = " + _result +";");
      }
    }
    var _result = t + dt;
    _results["t"][_i] = _result;
    t = _result;

    var _stop = false;
    var _cond = "";

    if (_i > Number.parseInt(_endkonditionen[0])) {
      _stop = true;
    }
    else {
      for (var _endkondition in _endkonditionen.slice(1)) {
        if (eval(_endkonditionen[Number.parseInt(_endkondition)+1])) {
          _stop = true;
        }
      }
    }
    if (_stop) {
      break;
    }
    _lastI = _i;
  }
  for (_i = 0; _i < _lastI + 1; _i++) {
    _scatterChart.data.datasets[0].data.push({x: _results[_gxName][_i], y: _results[_gyName][_i]});
  }
  _scatterChart.update();
}

$("#diagHeader").text(_gyName + "," + _gxName + "-Diagramm");
_run();
