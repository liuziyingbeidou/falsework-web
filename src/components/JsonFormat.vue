<template>
	<div>
		<codemirror ref="myCm" :value="editorPanel" v-model="editorPanel" :options="cmOptions" class="code"></codemirror>

		<el-row>
			<el-tooltip content="Format JSON" placement="top">
				<el-button type="success" plain content="test" v-on:click="formatJson">格式化</el-button>
			</el-tooltip>
			<el-tooltip content="Compress JSON" placement="top">
				<el-button type="success" plain v-on:click="compressJson">压缩</el-button>
			</el-tooltip>
			<!--<el-tooltip content="Fast Escape JSON" placement="top">
				<el-dropdown split-button type="primary" v-on:click="fastEscapeJson" @command="handleEscapeCommand">
				   高效转义
				  <el-dropdown-menu slot="dropdown">
				  	<el-tooltip content="Compress Escape JSON" placement="left">
				    	<el-dropdown-item command="compressEscapeJson">压缩转义</el-dropdown-item>
				   </el-tooltip>
				  </el-dropdown-menu>
				</el-dropdown>
			</el-tooltip>-->
			<el-tooltip content="Fast Escape JSON" placement="top">
		    	<el-button type="success" plain v-on:click="fastEscapeJson">高效转义</el-button>
		    </el-tooltip>
		    <el-tooltip content="Compress Escape JSON" placement="top">
		    	<el-button type="success" plain v-on:click="compressEscapeJson">压缩转义</el-button>
		    </el-tooltip>
			<el-tooltip content="Remove Escape JSON" placement="top">
		    	<el-button type="success" plain v-on:click="removeEscapeJson">去除转义</el-button>
		    </el-tooltip>
			<el-tooltip content="Copy" placement="top">
				<el-button type="success" plain v-clipboard:copy="editorPanel" v-clipboard:success="doCopy" v-clipboard:error="onCopyError">复制</el-button>
			</el-tooltip>
			<el-tooltip content="Clear" placement="top">
				<el-button type="success" plain v-on:click="clearAll">清空</el-button>
			</el-tooltip>
			
			<el-tooltip placement="top" effect="light">
				<div slot="content">
					<el-table :data="extraKeysData" style="width: 100%;">
						<el-table-column prop="key" label="功能 (function)" width="200"></el-table-column>
						<el-table-column prop="pc" label="PC快捷键 (ExtraKeys)" width="180"></el-table-column>
						<el-table-column prop="mac" label="Mac快捷键 (ExtraKeys)" width="180"></el-table-column>
					</el-table>
				</div>
				<el-button>快捷键</el-button>
			</el-tooltip>
		</el-row>

		<el-alert :type="alertType" :closable="false" v-if="alertShow" :center="false" show-icon>
			<pre v-html="alertDescription"> {{alertDescription}} </pre>
		</el-alert>
	</div>

</template>

<script>
	import {
		codemirror
	} from 'vue-codemirror'

	import 'codemirror/lib/codemirror.css'
	require('codemirror/lib/codemirror.js')

	/**支持代码折叠*/
	import 'codemirror/addon/fold/foldgutter.css'
	require('codemirror/addon/fold/foldcode.js')
	require('codemirror/addon/fold/foldgutter.js')
	require('codemirror/addon/fold/brace-fold.js')
	require('codemirror/addon/fold/comment-fold.js')

	/**全屏*/
	import 'codemirror/addon/display/fullscreen.css'
	require('codemirror/addon/display/fullscreen.js')

	/**查询替换快快捷键*/
	import 'codemirror/addon/dialog/dialog.css'
	require('codemirror/addon/dialog/dialog.js')
	require('codemirror/addon/search/search.js')
	require('codemirror/addon/search/searchcursor.js')
	require('codemirror/addon/scroll/annotatescrollbar.js')
	import 'codemirror/addon/search/matchesonscrollbar.css'
	require('codemirror/addon/search/matchesonscrollbar.js')
	require('codemirror/addon/search/jump-to-line.js')

	/**代码高亮**/
	require("codemirror/addon/search/match-highlighter.js")

	/**括号匹配*/
	require('codemirror/addon/edit/matchbrackets.js')

	/**活动行**/
	require('codemirror/addon/selection/active-line.js')

	/**主题-default**/

	/**代码检查错误(jsonlint.js暂时通过在index.html中引入)*/
	import 'codemirror/addon/lint/lint.css'
	require("codemirror/mode/javascript/javascript.js")
	require('codemirror/addon/lint/lint.js')
	require('codemirror/addon/lint/json-lint.js')

	export default {
		name: 'jsonEditor',
		data() {
			return {
				editorPanel: '',
				myCm: "",
				cmOptions: {
					value: "",
					mode: "application/json",
					theme: "default",
					indentUnit: 2,
					lineNumbers: true,
					smartIndent: true,
					tabSize: 2,
					readOnly: false,
					showCursorWhenSelecting: true,
					firstLineNumber: 1,
					styleActiveLine: true,
					//代码折叠
					lineWrapping: false,
					//foldGutter: true,
					gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
					//CodeMirror-lint-markers是实现语法报错功能
					lint: true,
					//括号匹配
					matchBrackets: true,
					//代码高亮
					highlightSelectionMatches: {
						showToken: /\w/,
						annotateScrollbar: true
					},
					//快捷键
					extraKeys: {
						"F11": function(cm) {
							cm.setOption("fullScreen", !cm.getOption("fullScreen"));
						},
						"Esc": function(cm) {
							if(cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
						},
						"Ctrl-Z": function(editor) {
							editor.undo();
						},

					}
				},
				//提示框显示与隐藏
				alertShow: false,
				//提示框主题
				alertType: "success",
				//提示框内容
				alertDescription: "",
				/**快捷键提示框*/
				extraKeysData: [{
					key: '全屏 (FullScreen)',
					pc: 'F11',
					mac: 'F11'
				}, {
					key: '退出全屏 (Exit FullScreen)',
					pc: 'ESC',
					mac: 'ESC'
				}, {
					key: '撤销 (Undo)',
					pc: 'Ctrl-Z',
					mac: 'Ctrl-Z'
				}, {
					key: '查找 (Find)',
					pc: 'Ctrl-F',
					mac: 'Cmd-F'
				}, {
					key: '查找下一个 (FindNext)',
					pc: 'Ctrl-G',
					mac: 'Cmd-G'
				}, {
					key: '查找上一个 (FindPrev)',
					pc: 'Shift-Ctrl-G',
					mac: 'Shift-Cmd-G'
				}, {
					key: '查找替换 (Replace)',
					pc: 'Shift-Ctrl-F',
					mac: 'Cmd-Alt-F'
				}, {
					key: '查找替换全部 (ReplaceAll)',
					pc: 'Shift-Ctrl-R',
					mac: 'Shift-Cmd-Alt-F'
				}, {
					key: '跳转到某行 (Jump to line)',
					pc: 'Alt-G',
					mac: 'Alt-G'
				}],

			}
		},
		methods: {
			getContent: function(event){
				var cm = this.$refs.myCm.codemirror;
				var totalLines = cm.doc.lineCount();
				var jsonContent = cm.doc.getRange({
					line: 0,
					ch: 0
				}, {
					line: totalLines
				});
				return jsonContent;
			},
			/**
			 * JSON处理
			 * @param {Object} event
			 * @param {boolean} compress 是否压缩 true-压缩; false-格式化
			 */
			doDeal: function(event,jsonData,compress){
				/**0-压缩; 2-格式化*/
				var indent = compress ? 0 : 2;
				var dealData = '';
				try {
					var parseJson = jsonlint.parse(jsonData);
					dealData = JSON.stringify(parseJson, null, indent);
					this.alertType = "success";
					this.alertDescription = "有效的JSON";
				} catch(err) {
					this.alertType = "error";
					this.alertDescription = err.message.replace("<", "&lt;")
				} finally {
					this.showAlert();
				}
				return dealData;
				
			},
			formatJson: function(event) {
				/**格式化JSON*/
				var jsonContent = this.getContent(event);
				this.editorPanel = this.doDeal(event,jsonContent,false);
			},
			compressJson: function(event) {
				/**压缩*/
				var jsonContent = this.getContent(event);
				this.editorPanel = this.doDeal(event,jsonContent,true);
			},
			doEscapeJson: function(event,data){
				/**转义处理*/
				return data.replace(/(\\)/ig,"\\$1").replace(/(")/ig,"\\$1");
			},
			/*handleEscapeCommand(command) {
				//点击菜单项后会触发事件
		        if("compressEscapeJson" == command){
		        	//压缩转义
		        	var jsonContent = this.getContent(event);
					var dealData = this.doDeal(event,jsonContent,true);
		        	this.editorPanel = this.doEscapeJson(jsonContent);
		        }
		   	},*/
		   	compressEscapeJson: function(){
		   		/**压缩转义*/
		   		var jsonContent = this.getContent(event);
				var dealData = this.doDeal(event,jsonContent,true);
		        this.editorPanel = this.doEscapeJson(jsonContent);
		   	},
			fastEscapeJson: function(event){
				/**高效转义*/
				var jsonContent = this.getContent(event);
				this.editorPanel = this.doEscapeJson(jsonContent);
			},
			removeEscapeJson: function(event){
				/**去除转义*/
				var jsonContent = this.getContent(event);
				/*转义*/
				this.editorPanel = jsonContent.replace(/(\\\")/g,"\"").replace(/(\\\\)/g,"\\");
			},
			showAlert: function(event,isShow) {
				/**显示与隐藏*/
				if(isShow == false) {
					this.alertShow = isShow;
					return;
				}
				if(!this.alertShow) {
					this.alertShow = !this.alertShow;
				}
			},
			clearAll: function(event) {
				/**清除*/
				this.$refs.myCm.codemirror.doc.setValue('');
				this.showAlert(event,false);
			},
			doCopy: function(event) {
				/***复制成功处理*/
				this.$message({
					message: '恭喜你，复制成功',
					type: 'success',
					center: true,
					duration: 1500
				});
			},
			onCopyError: function(event) {
				/***复制错误处理*/
				this.$message({
					message: '出错了哦,请重新复制',
					type: 'error',
					center: true,
					duration: 1500
				});
			},
		},

		components: {
			codemirror
		},
	}

</script>

<style>
	.code {
		text-align: left;
	}
	
	.CodeMirror {
		height: 380px;
		border: 1px solid #c7c6c6;
		font-size: 14px;
		font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
	}
	
	.CodeMirror-focused .cm-matchhighlight {
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVQI12NgYGBgkKzc8x9CMDAwAAAmhwSbidEoSQAAAABJRU5ErkJggg==);
		background-position: bottom;
		background-repeat: repeat-x;
	}
	.cm-matchhighlight {background-color: lightgreen}
    .CodeMirror-selection-highlight-scrollbar {background-color: green}
	
	.el-row,
	.el-alert {
		margin: 10px 0 0
	}

	.el-alert pre {
		width: 0px;
		font-size: 12px;
		font-weight: 550;
	}
	
	.el-table td,
	.el-table th {
		padding: 0px;
		font-size: 12px;
	}
	
	/**按钮样式*/
	.el-button--success.is-plain:focus, .el-button--success.is-plain:hover {
	    background: #66b1ff;
    	border-color: #66b1ff;
   	 	color: #fff;
	}
	.el-button--success.is-plain {
	    color: #fff;
    	background-color: #409EFF;
    	border-color: #409EFF;
	}
	
	/**下拉按钮样式**/
	/*.el-dropdown{
		margin: 0px 10px 0 10px;
	}
	.el-button--primary {
	    color: #67c23a;
	    background: #f0f9eb;
	    border-color: #c2e7b0;
	}
	.el-button--primary:focus, .el-button--primary:hover {
	    background: #85ce61;
	    border-color: #85ce61;
	    color: #fff;
	}
	.el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
	    background-color: #ecf5ff;
	    color: #67c23a;
	}
	.el-button:focus, .el-button:hover {
	    background: #85ce61;
	    border-color: #85ce61;
	    color: #fff;
	}*/
	
</style>
<!--https://codemirror.net/-->