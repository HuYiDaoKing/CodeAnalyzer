
Ext.namespace('My.UI');
My.UI.CheckboxGroup = Ext.extend(Ext.form.CheckboxGroup, {
    columns: 3,
    dataUrl: '', //数据地址 
    labelFiled: 'label',
    valueFiled: 'value',
    setValue: function (val) {
        if (val.split) {
            val = val.split(',');
        }
        this.reset();
        for (var i = 0; i < val.length; i++) {
            this.items.each(function (c) {
                //debugger; 
                if (c.inputValue == val[i]) {
                    c.setValue(true);
                }
            });
        }

    },
    reset: function () {
        this.items.each(function (c) {
            c.setValue(false);
        });
    },

    getValue: function () {
        var val = [];
        this.items.each(function (c) {
            if (c.getValue() == true)
                val.push(c.inputValue);
        });
        return val.join(',');
    },
    onRender: function (ct, position) {
        var items = [];
        if (!this.items) {                        //如果没有指定就从URL获取 
            Ext.Ajax.request({
                url: this.dataUrl,
                scope: this,
                sync: true, //同步请求，需要添加扩展插件 http://hi.baidu.com/kaka888/blog/item/4687ccea21333adbd439c953.html 
                onSuccess: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        var chk = { boxLabel: d[this.labelFiled], name: this.name || '', inputValue: d[this.valueFiled] };
                        items.push(chk);
                    }
                }
            });
            this.items = items;
        }
        My.UI.CheckboxGroup.superclass.onRender.call(this, ct, position);
    }
});
Ext.reg('mycheckgroup', My.UI.CheckboxGroup);