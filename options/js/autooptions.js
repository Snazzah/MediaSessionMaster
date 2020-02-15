const AutoOptionUtil = window.AutoOptionUtil = {
  navigate(path, object){
    let steps = path.split('.');
    let destination = object;
    steps.map(step => destination = destination[step]);
    return destination;
  },
  setInPath(path, object, value){
    let steps = path.split('.');
    let destination = object;
    eval("destination"+steps.map(step => `['${step}']`).join('')+" = value");
    return destination;
  },
};

window.addEventListener('load', async () => {
  let optionData = await Util.getData();
  AutoOptionUtil.loadElement = function (el) {
    let [type, path] = el.getAttribute('auto-option').split(':');
    el.removeAttribute('auto-option');
    switch(type) {
      case 'number':
      case 'string':
        if(type === 'number') el.onkeypress = event => event.charCode >= 48 && event.charCode <= 57;
        el.oninput = async e => {
          let val = el.value;
          if(type === 'number') val = Number(val);
          const newOptions = AutoOptionUtil.setInPath(path, optionData, val);
          await Util.setData(newOptions);
          optionData = newOptions;
        };
        el.value = new String(AutoOptionUtil.navigate(path, optionData));
        break;
      case 'bool':
        el.onclick = async e => {
          const val = e.target.checked;
          const newOptions = AutoOptionUtil.setInPath(path, optionData, val);
          await Util.setData(newOptions);
          optionData = newOptions;
        };
        el.checked = AutoOptionUtil.navigate(path, optionData);
        break;
    }
  };
  Array.prototype.forEach.call(document.querySelectorAll('[auto-option]'), AutoOptionUtil.loadElement);
});