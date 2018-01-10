1. 将css和images文件夹中的文件放到工程的对应目录下。
2. 在需要调用时间控件的页面中引入这三个js文件
DateTimeField.js， Spinner.js， SpinnerField.js

3. 在调用的时候：

items: [{
	xtype: 'datetimefield',
	id: 'aaa'
}]
即可。