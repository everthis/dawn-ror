import Vue from 'vue';

export function newCiPlugins() {

  Vue.component('new-plugins', {
    props: ['textareaInput'],
    data: function() {
      return {
        pluginsInput: undefined,
        canSubmit: true
      }
    },
    template: `
      <div class="new-plugins-wrap">
        <div class="c-grid-row">

          <div class="pluginsInput c-grid-span10">
            <div class="hint">format: packageName@version</div>
            <textarea class="plugins-input-area" name="textarea" rows="16" placeholder="添加plugins" v-model="pluginsInput"></textarea>
          </div>

          <div class="plugins c-grid-span38">
            <div class="plugins-wrap">
              <div class="plugins-hread c-grid-row">
                <div class="c-grid-span16">packageName</div>
                <div class="c-grid-span16">version</div>
                <div class="c-grid-span16">CI-packageName</div>
              </div>
              <div class="per-row-plugin c-grid-row c-gap-top" v-for="item in processedPluginsInput">
                <span class="c-grid-span16 package-name">{{ item.packageName }}</span>
                <span class="c-grid-span16 package-version">{{ item.packageVersion }}</span>
                <span class="c-grid-span16 package-ci-package-name">{{ item.ciPackageName }}</span>
              </div>
            </div>
          </div>

        </div>

        <div class="submit-row c-center c-gap-top c-gap-bottom">
          <div class="c-btn" @click="submit">Install on BuildCloud compile machines</div>
        </div>
      </div>`,
    computed: {
        processedPluginsInput: function() {
          var arr = [];
          var val;
          var splitArr = [];
          if (!this.pluginsInput) return arr;
          var lines = this.pluginsInput.split('\n');
          for (var i = 0; i < lines.length; i++) {
            if (lines[i].trim().length > 0) {
              val = lines[i].trim().replace(/^\"|^\'|\'$|\"$/g, '');
              splitArr = val.split('@');
              arr.push({
                input: val,
                packageName: splitArr[0],
                packageVersion: splitArr[1] || '',
                ciPackageName: splitArr[1] ? ( '' + splitArr[0] + '_' + splitArr[1].split('.').join('_') ) : '',
                ciPackageNamePrefix: 'fis-msprd-'
              })
            }
          }
          return arr;
        }
    },
    methods: {
      submit: function() {
        this.canSubmit = true;
        var that = this;
        var submitForm = document.getElementsByClassName('fis-ci-plgins-form')[0];
        var submitEle = document.getElementsByClassName('fis-ci-plgins-form-submit-btn')[0];
        var pluginInputEle = document.getElementsByClassName('plugin-input')[0];
        var tmpFormEle;
        if (that.processedPluginsInput.length === 0) {alert('0'); return;}
        if (!that.checkValidation(that.processedPluginsInput)) {alert("不能以fis开头"); return;}
        that.processedPluginsInput.forEach(function(element, index) {
          for (var el in element) {
            if (element.hasOwnProperty(el)) {
              tmpFormEle = that.createFormEle('fis_ci_plugins[][' + el + ']', element[el]);
              submitForm.appendChild(tmpFormEle);
            }
          }
        });
        if (that.canSubmit) {
          submitEle.click();
        }
      },
      checkValidation: function(arr) {
        var that = this;
        arr.forEach(function(ele, index) {
          for (var el in ele) {
            if (ele.hasOwnProperty(el)) {
              if (el.indexOf('input') >= 0 && ele[el].indexOf('fis') === 0) {
                that.canSubmit = false;
                break;
              }
            }
          }
        });
        return that.canSubmit;
      },
      createFormEle: function(name, value) {
        var inputEle = document.createElement("input");
        inputEle.setAttribute('name', name);
        inputEle.value = value;
        return inputEle;
      }
    }  

  });


  var app = new Vue({
    el: '#app'



  });  
}
