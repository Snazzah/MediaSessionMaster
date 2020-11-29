const AutoOptionUtil = window.AutoOptionUtil = {};

window.addEventListener('load', async () => {
  let optionData = await Util.getData();
  AutoOptionUtil.loadElement = function (el) {
    let [type, path] = el.getAttribute('auto-option').split(':');
    el.removeAttribute('auto-option');
    switch(type) {
      case 'number':
      case 'string':
        if(type === 'number') el.onkeypress = event => event.charCode >= 48 && event.charCode <= 57;
        el.oninput = async () => {
          let val = el.value;
          if(type === 'number') val = Number(val);
          const newOptions = _.set(optionData, path, val);
          await Util.setData(newOptions);
          optionData = newOptions;
        };
        el.value = new String(_.get(optionData, path));
        break;
      case 'bool':
        el.onclick = async e => {
          const val = e.target.checked;
          const newOptions = _.set(optionData, path, val);
          await Util.setData(newOptions);
          optionData = newOptions;
        };
        el.checked = _.get(optionData, path);
        break;
    }
  };
  Array.prototype.forEach.call(document.querySelectorAll('[auto-option]'), AutoOptionUtil.loadElement);
});