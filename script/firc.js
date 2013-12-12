// Flash Source
var FIRCVersion = "2.0";
var FIRCComponent = null;

/****************************************************************************
 * 이벤트 리스너
 ***************************************************************************/
var FIRCEventListener = function(type,data) {
	switch (type) {
		case "debug" :
			//FIRCComponent.printSystem("UIMain",data);
		break;

		case "onReady" :
			if (FIRCComponent.server && FIRCComponent.port && FIRCComponent.nickname && FIRCComponent.channel) {
				FIRCComponent.setInfo();
				FIRCComponent.connect();
			} else {
				FIRCComponent.setConnect();
			}
		break;

		case "onConnect" :
			if (Ext.getCmp("WaitWindow")) Ext.getCmp("WaitWindow").close();
			if (FIRCComponent.checkListeners("onConnect") == true) FIRCComponent.listeners.onConnect(FIRCComponent);
			if (FIRCComponent.hiddenChannel) FIRCComponent.flash.joinChannel(FIRCComponent.hiddenChannel,FIRCComponent.hiddenChannelKey);
		break;

		case "onError" :
			var error = data[0];

			switch (error) {
				case 101 :
					FIRCComponent.connectFail(101);
				break;
				
				case 106 :
					if (Ext.getCmp("ChangeNickWindow") || Ext.getCmp("ConnectWindow")) {
					
					} else {
						
					}
				break;
				
				case 403 :
					Ext.Msg.show({title:Lang.Interface.error,msg:Lang.Error.invalidChannel,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING});
				break;
				
				case 433 :
					if (Ext.getCmp("WaitWindow")) {
						Ext.getCmp("WaitWindow").close();
						FIRCComponent.changeNickname(true);
					} else {
						FIRCComponent.printError(Lang.Error.DuplicateNickname);
					}
				break;
				
				case 474 :
					Ext.Msg.show({title:Lang.Interface.error,msg:Lang.Error.banChannel.replace("{channel}",data[1]),buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING});
				break;
				
				case 482 :
					Ext.Msg.show({title:Lang.Interface.error,msg:Lang.Error.configPermissionError,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING});
				break;

				default :
					alert(error);
				break;
			}
		break;
		
		// Channel Event
		case "onJoin" :
			FIRCComponent.joinedChannel(data);
		break;
		
		case "onTopic" :
			FIRCComponent.channelTopic(data[0],"",data[1]);
		break;
		
		case "onTopicChange" :
			FIRCComponent.channelTopic(data[0],data[1],data[2]);
		break;
		
		case "onChannelListStart" :
			FIRCComponent.channelList.removeAll();
		break;
		
		case "onChannelList" :
			var tempRecord = Ext.data.Record.create([{"name":"channel"},{"name":"usernum","type":"int"},{"name":"topic"},{"name":"mode"}]);
			var channel = new tempRecord({"channel":data[0],"usernum":parseInt(data[1]),"topic":data[2],"mode":data[3]});
			FIRCComponent.channelList.add(channel);
		break;
		
		case "onChannelListEnd" :
			FIRCComponent.printChannelList();
		break;
		
		case "onChannelKey" :
			FIRCComponent.channelKey(data);
		break;
		
		case "onChannelMode" :
			FIRCComponent.channelMode(data[0],data[1],data[2],data[3]);
		break;
		
		case "onChannelChange" :
			FIRCComponent.printSystem(data[0],Lang.Msg.channelChange.replace("{nickname}","<b>"+data[2]+"</b>").replace("{mode}","<b>"+data[1]+"</b>"));
		break;
		
		case "onBanList" :
			var tempRecord = Ext.data.Record.create([{"name":"channel"},{"name":"nickname"},{"name":"from"},{"name":"time","type":"int"}]);
			var ban = new tempRecord({"channel":data[0],"nickname":data[1],"from":data[2],"time":parseInt(data[3])});
			FIRCComponent.banList.add(ban);
		break;
		
		case "onBanListEnd" :
			FIRCComponent.printBanList();
		break;
		
		// User Event
		case "onUserList" :
			var channel = data[0];
			var users = data[1];
			var tempUser = new Array();
			var tempRecord = Ext.data.Record.create([{"name":"mode"},{"name":"nickname"},{"name":"sort"},{"name":"ip"}]);
			for (var i=0, loop=users.length;i<loop;i++) {
				if (users[i].indexOf("@") == 0) {
					var mode = "@";
					var sort = "0";
					var nickname = users[i].substr(1);
				} else if (users[i].indexOf("+") == 0) {
					var mode = "+";
					var sort = "1";
					var nickname = users[i].substr(1);
				} else {
					var mode = "";
					var sort = "2";
					var nickname = users[i];
				}
				
				var storeUser = FIRCComponent.findUser(channel,nickname);
				if (storeUser == null) {
					tempUser.push(new tempRecord({"mode":mode,"nickname":nickname,"sort":sort+":"+nickname,"ip":""}));
				} else {
					storeUser.set("mode",mode);
					storeUser.set("sort",sort+":"+nickname);
				}
			}
			Ext.getCmp(channel+"User").getStore().add(tempUser);
			FIRCComponent.userSort(channel);
		break;
		
		case "onUserJoin" :
			FIRCComponent.userJoin(data[0],data[1]);
		break;
		
		case "onUserNick" :
			FIRCComponent.userNick(data[0],data[1]);
		break;
		
		case "onUserMode" :
			FIRCComponent.userMode(data[0],data[1],data[2],data[3]);
		break;
		
		case "onUserPart" :
			FIRCComponent.userPart(data[0],data[1],data[2],false);
		break;
		
		case "onUserQuit" :
			FIRCComponent.userQuit(data[0],data[1],data[2]);
		break;
		
		case "onWhoIs" :
			FIRCComponent.userWhoIs(data[0],data[1],data[2],data[3],data[4],data[5]);
		break;
		
		case "onKick" :
			FIRCComponent.userKick(data[0],data[1],data[2],data[3],data[4]);
		break;
		
		// Message
		case "onMessage" :
			FIRCComponent.printMessage(data[0],data[1],data[2]);
		break;
		
		case "onMyMessage" :
			FIRCComponent.printMessage(data[0],data[1],data[2]);
		break;
		
		case "onPrivMessage" :
			FIRCComponent.printPrivMessage(data[0],data[1]);
		break;
		
		case "onServerMessage" :
			FIRCComponent.printServerMessage(data);
		break;
	}
}

var FIRC = function(opt) {
	this.id = "firc";
	this.flash = null;
	this.flashURL= "./flash/firc2.swf?rnd="+Math.random();

	// global values
	this.autoNickString = "";
	this.autoNickPosition = 0;
	this.testChannel = new Array();
	this.channelList = new Ext.data.SimpleStore({
		fields:["channel",{"name":"usernum","type":"int"},"topic","mode"],
		data:[]
	});
	this.banList = new Ext.data.SimpleStore({
		fields:["channel","nickname","from",{"name":"time","type":"int"}],
		data:[]
	});
	
	// opt values
	this.server = opt.server ? opt.server : "";
	this.port = opt.port ? opt.port : 0;
	this.nickname = opt.nickname ? opt.nickname : "";
	this.channel = opt.channel ? opt.channel : "";
	this.password = opt.password ? opt.password : "";
	this.encode = opt.encode ? opt.encode : "";
	this.security = opt.security ? opt.security : "";
	this.hiddenChannel = opt.hiddenChannel ? (opt.hiddenChannel.indexOf("#") == 0 ? opt.hiddenChannel : "#"+opt.hiddenChannel) : "#firc";
	this.hiddenChannelKey = opt.hiddeChannelKey ? opt.hiddenChannelKey : "";
	this.dateFormat = opt.dateFormat ? opt.dateFormat : "H:i";
	this.textToolType = opt.textToolType ? opt.textToolType : "icontext";
	this.toolType = opt.toolType ? opt.toolType : "icontext";
	this.listeners = opt.listeners;
	
	// UIs
	this.printTextToolbar = function(channel) {
		return [
			new Ext.Button({
				id:channel+"BtnBold",
				text:this.textToolType != "icon" ? Lang.Button.bold : "",
				icon:this.textToolType != "text" ? "./images/icon/text_bold.png" : "",
				enableToggle:true,
				handler:function(button) {
					if (button.pressed) {
						Ext.getCmp(channel+"InputBox").getEl().dom.style.fontWeight = "bold";
					} else {
						Ext.getCmp(channel+"InputBox").getEl().dom.style.fontWeight = "normal";
					}
					Ext.getCmp(channel+"InputBox").focus(false,100);
				}
			}),
			' ',
			new Ext.Button({
				id:channel+"BtnUnderline",
				text:this.textToolType != "icon" ? Lang.Button.underline : "",
				icon:this.textToolType != "text" ? "./images/icon/text_underline.png" : "",
				enableToggle:true,
				handler:function(button) {
					if (button.pressed) {
						Ext.getCmp(channel+"InputBox").getEl().dom.style.textDecoration = "underline";
					} else {
						Ext.getCmp(channel+"InputBox").getEl().dom.style.textDecoration = "none";
					}
					Ext.getCmp(channel+"InputBox").focus(false,100);
				}
			}),
			"-",
			new Ext.form.ComboBox({
				id:channel+"BtnColor",
				width:80,
				typeAhead:true,
				triggerAction:"all",
				listClass:'x-combo-list-small',
				store:new Ext.data.SimpleStore({
					fields:["value","color"],
					data:[
						["",Lang.Color.none],
						["0",Lang.Color.white],
						["1",Lang.Color.black],
						["2",Lang.Color.navy],
						["3",Lang.Color.green],
						["4",Lang.Color.red],
						["5",Lang.Color.maroon],
						["6",Lang.Color.purple],
						["7",Lang.Color.orange],
						["8",Lang.Color.yellow],
						["9",Lang.Color.lime],
						["10",Lang.Color.teal],
						["11",Lang.Color.aqua],
						["12",Lang.Color.blue],
						["13",Lang.Color.fuchsia],
						["14",Lang.Color.gray],
						["15",Lang.Color.silver]
					]
				}),
				editable:false,
				mode:"local",
				displayField:"color",
				valueField:"value",
				emptyText:Lang.Button.textColor,
				listeners:{select:{fn:function(form) {
					var channel = form.getId().substr(0,form.getId().length-8);
					var color = new Array("white","black","navy","green","red","maroon","purple","orange","yellow","lime","teal","aqua","blue","fuchsia","gray","silver");
					if (form.getValue()) {
						Ext.getCmp(channel+"InputBox").getEl().dom.style.color = color[form.getValue()];
					} else {
						Ext.getCmp(channel+"InputBox").getEl().dom.style.color = "";
					}
					Ext.getCmp(channel+"InputBox").focus(false,100);
				}}}
			}),
			' ',
			new Ext.form.ComboBox({
				id:channel+"BtnBackgroundColor",
				width:80,
				typeAhead:true,
				triggerAction:"all",
				listClass:'x-combo-list-small',
				store:new Ext.data.SimpleStore({
					fields:["value","color"],
					data:[
						["",Lang.Color.none],
						["0",Lang.Color.white],
						["1",Lang.Color.black],
						["2",Lang.Color.navy],
						["3",Lang.Color.green],
						["4",Lang.Color.red],
						["5",Lang.Color.maroon],
						["6",Lang.Color.purple],
						["7",Lang.Color.orange],
						["8",Lang.Color.yellow],
						["9",Lang.Color.lime],
						["10",Lang.Color.teal],
						["11",Lang.Color.aqua],
						["12",Lang.Color.blue],
						["13",Lang.Color.fuchsia],
						["14",Lang.Color.gray],
						["15",Lang.Color.silver]
					]
				}),
				editable:false,
				mode:"local",
				displayField:"color",
				valueField:"value",
				emptyText:Lang.Button.backgroundColor,
				listeners:{select:{fn:function(form) {
					var channel = form.getId().substr(0,form.getId().length-18);
					var color = new Array("white","black","navy","green","red","maroon","purple","orange","yellow","lime","teal","aqua","blue","fuchsia","gray","silver");
					if (form.getValue()) {
						Ext.getCmp(channel+"InputBox").getEl().dom.style.background = color[form.getValue()];
					} else {
						Ext.getCmp(channel+"InputBox").getEl().dom.style.background = "";
					}
					Ext.getCmp(channel+"InputBox").focus(false,100);
				}}}
			})
		];
	}

	this.printFlash = function() {
		var flashHTML = "";
		var isIE = navigator.appName == "Microsoft Internet Explorer";
		if (isIE) {
			flashHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="1" height="1" id="'+this.id+'" align="middle">';
			flashHTML+= '<param name="allowScriptAccess" value="always" />';
			flashHTML+= '<param name="base" value=".">';
			flashHTML+= '<param name="movie" value="'+this.flashURL+'" />';
			flashHTML+= '<param name="quality" value="high" />';
			flashHTML+= '<param name="wmode" value="transparent" />';
			flashHTML+= '<embed src="'+this.id+'" quality="high" wmode="transparent" style="width:1px; height:1px;" align="middle" allowScriptAccess="always" base="." type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"></embed>';
			flashHTML+= '</object>';
		} else {
			flashHTML = '<embed id="'+this.id+'" src="'+this.flashURL+'" quality="high" wmode="transparent" style="width:1px; height:1px;" align="middle" allowScriptAccess="always" base="." type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"></embed>';
		}

		document.getElementById("FooterLayer").innerHTML = "copyrights © FIRC "+FIRCVersion+" (www.firc.kr) All Rights Reserved."+flashHTML;
		this.flash = document.getElementById(this.id);
	}
	
	this.joinedChannel = function(channel) {
		if (Ext.getCmp(channel+"Tab") || this.hiddenChannel == channel) return;
		
		Ext.getCmp("UITab").add(
			new Ext.Panel({
				id:channel+"Tab",
				title:channel,
				viewTitle:channel,
				closable:true,
				layout:"border",
				items:[
					new Ext.Panel({
						id:channel,
						region:"center",
						autoScroll:true,
						margins:"-1 0 0 -1"
					}),
					new Ext.grid.GridPanel({
						id:channel+"User",
						region:"east",
						width:180,
						margins:"-1 -1 0 -1",
						cm:new Ext.grid.ColumnModel([
							{
								header:Lang.Interface.userName,
								dataIndex:"nickname",
								sortable:false,
								menuDisabled:true,
								width:160,
								renderer:function(value,p,record) {
									return record.data.mode+value;
								}
							}
						]),
						store:new Ext.data.SimpleStore({
							fields:["mode","nickname","sort","ip"],
							data:[]
						}),
						listeners:{rowclick:{fn:function(grid,row,event) {
							var menu = new Ext.menu.Menu();
							var data = grid.getStore().getAt(row);
							var myMode = FIRCComponent.myMode(channel);
							
							
							if (myMode == "@" && data.get("ip") == "") FIRCComponent.flash.whois(data.get("nickname"));
	
							menu.add('<b class="menu-title">'+data.get("mode")+data.get("nickname")+'</b>');
							menu.add({
								text:Lang.Button.whois,
								icon:"./images/icon/at.png",
								handler:function() {
									new Ext.Window({
										id:"WhoIsWindow",
										title:data.get("mode")+data.get("nickname"),
										width:300,
										height:125,
										modal:true,
										resizable:false,
										layout:"fit",
										items:[
											new Ext.Panel({
												id:"WhoIsInfo",
												border:false,
												autoScroll:true,
												style:"background:#FFFFFF;",
												html:""
											})
										],
										listeners:{show:{fn:function() {
											FIRCComponent.flash.whois(data.get("nickname"));
										}}}
									}).show();
								}
							});
							
							menu.add({
								text:Lang.Button.query,
								icon:"./images/icon/ear-listen.png",
								handler:function() {
									FIRCComponent.printPrivMessage(data.get("nickname"));
								}
							});
							
							if (myMode == "@") {
								menu.add("-");
								if (data.get("mode") == "@") {
									menu.add({
										text:Lang.Button.takeOpper,
										icon:"./images/icon/crown_minus.png",
										handler:function() {
											FIRCComponent.flash.userMode(FIRCComponent.getActiveId(),data.get("nickname"),"-o");
										}
									});
								} else if (data.get("mode") == "+") {
									menu.add({
										text:Lang.Button.takeVoice,
										icon:"./images/icon/microphone_minus.png",
										handler:function() {
											FIRCComponent.flash.userMode(FIRCComponent.getActiveId(),data.get("nickname"),"-v");
										}
									});
									menu.add({
										text:Lang.Button.giveOpper,
										icon:"./images/icon/crown_plus.png",
										handler:function() {
											FIRCComponent.flash.userMode(FIRCComponent.getActiveId(),data.get("nickname"),"+o");
										}
									});
								} else {
									menu.add({
										text:Lang.Button.giveVoice,
										icon:"./images/icon/microphone_plus.png",
										handler:function() {
											FIRCComponent.flash.userMode(FIRCComponent.getActiveId(),data.get("nickname"),"+v");
										}
									});
									menu.add({
										text:Lang.Button.giveOpper,
										icon:"./images/icon/crown_plus.png",
										handler:function() {
											FIRCComponent.flash.userMode(FIRCComponent.getActiveId(),data.get("nickname"),"+o");
										}
									});
								}
								menu.add("-");
								menu.add({
									text:Lang.Button.kick,
									icon:"./images/icon/door_open.png",
									handler:function() {
										FIRCComponent.flash.userKick(FIRCComponent.getActiveId(),data.get("nickname"));
									}
								});
								menu.add({
									text:Lang.Button.ban,
									icon:"./images/icon/lock.png",
									handler:function() {
										if (data.get("ip")) {
											FIRCComponent.flash.banAdd(FIRCComponent.getActiveId(),"*!*@"+data.get("ip"));
										} else {
											Ext.Msg.show({title:Lang.Interface.error,msg:Lang.Msg.tryFewSeconds,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING});
										}
									}
								});
								menu.add({
									text:Lang.Button.kickBan,
									icon:"./images/icon/lock_break.png",
									handler:function() {
										if (data.get("ip")) {
											FIRCComponent.flash.banAdd(FIRCComponent.getActiveId(),"*!*@"+data.get("ip"));
											FIRCComponent.flash.userKick(FIRCComponent.getActiveId(),data.get("nickname"));
										} else {
											Ext.Msg.show({title:Lang.Interface.error,msg:Lang.Msg.tryFewSeconds,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING});
										}
									}
								});
							}
							event.stopEvent();
							menu.showAt(event.getXY());
						}}}
					}),
					new Ext.Panel({
						layout:"border",
						region:"south",
						height:60,
						border:false,
						tbar:FIRCComponent.printTextToolbar(channel),
						items:[
							new Ext.Panel({
								id:channel+"InputTool",
								region:"center",
								height:60,
								border:false,
								items:[
									new Ext.form.TextField({
										id:channel+"InputBox",
										hideLabel:true,
										name:"buildarea",
										allowBlank:true,
										style:"margin:5px 0px 0px 5px;",
										enableKeyEvents:true,
										listeners:{
											keydown:{fn:function(form,event) { FIRCComponent.inputEvent(form,event); }}
										}
									})
								],
								listeners:{resize:{fn:function() {
									Ext.getCmp(channel+"InputBox").setWidth(Ext.getCmp(channel+"InputTool").getWidth()-5);
								}}}
							}),
							new Ext.form.FormPanel({
								region:"east",
								width:30,
								border:false,
								items:[
									new Ext.Button({
										style:"margin:5px 0px 0px 3px;",
										icon:"./images/icon/pilcrow.png"
									})
								]
							})
						]
					})
				],
				listeners:{close:{fn:function(tabs,tab) {
					if (tab) FIRCComponent.flash.partChannel(channel);
				}}}
			})
		).show();
	}

	this.connect = function() {
		if (Ext.getCmp("ConnectWindow")) Ext.getCmp("ConnectWindow").close();
		this.wait(Lang.Msg.tryConnect);
		this.flash.connect();
	}

	this.setInfo = function() {
		this.flash.setInfo(this.server,this.port,this.encode,this.nickname,this.channel,this.password,this.security);
	}
	
	this.wait = function(message) {
		if (Ext.getCmp("WaitWindow")) Ext.getCmp("WaitWindow").close();
		
		new Ext.Window({
			id:"WaitWindow",
			modal:true,
			width:200,
			resizable:false,
			closable:false,
			draggable:false,
			autoHeight:true,
			title:"Please Wait...",
			items:[
				new Ext.Panel({
					border:false,
					style:"padding:5px; background:#FFFFFF;",
					html:'<div style="text-align:center;"><img src="./images/loader.gif" style="margin:5px;" /><br />'+message+'</div>'
				})
			]
		}).show();
	}
	
	this.setConnect = function() {
		if (Ext.getCmp("ConnectWindow")) return;

		var formElement = [];

		if (!this.server || this.server == "") {
			formElement.push(new Ext.form.TextField({
				name:"server",
				width:275,
				emptyText:Lang.Interface.insertServer
			}));
		}
		
		if (!this.port || this.port == "" || this.port == "0") {
			formElement.push(new Ext.form.TextField({
				name:"port",
				width:275,
				emptyText:Lang.Interface.insertPort
			}));
		}
		
		if (!this.security || this.security == "") {
			formElement.push(new Ext.form.TextField({
				name:"security",
				width:275,
				emptyText:Lang.Interface.insertSecurity
			}));
		}
		
		if (!this.encode || this.encode == "") {
			formElement.push(new Ext.form.ComboBox({
				hiddenName:"encode",
				typeAhead:true,
				triggerAction:"all",
				lazyRender:true,
				store:new Ext.data.SimpleStore({
					fields:["value","display"],
					data:[["UTF-8","UTF-8"],["EUC-KR","EUC-KR"]]
				}),
				width:275,
				editable:false,
				mode:"local",
				displayField:"display",
				valueField:"value",
				value:this.server && this.port ? this.server+":"+this.port+"|"+this.security+"|"+this.encode : "",
				emptyText:Lang.Interface.selectEncode
			}));
		}
		
		if (!this.nickname) {
			formElement.push(new Ext.form.TextField({
				name:"nickname",
				width:275,
				value:this.nickname,
				emptyText:Lang.Interface.insertNickname
			}));
		}

		if (!this.channel) {
			formElement.push(new Ext.form.TextField({
				name:"channel",
				width:275,
				value:this.channel,
				emptyText:Lang.Interface.insertChannel
			}));
			formElement.push(new Ext.form.TextField({
				name:"password",
				width:275,
				value:this.password,
				emptyText:Lang.Interface.insertPassword
			}));
		}

		new Ext.Window({
			id:"ConnectWindow",
			modal:true,
			width:300,
			title:Lang.Interface.connectWindow,
			resizable:false,
			closable:false,
			draggable:false,
			autoHeight:true,
			items:[
				new Ext.Panel({
					height:80,
					border:false,
					html:'<img src="./images/logoWindow.png" style="width:300px; height:80px;" alt="FIRC" />'
				}),
				new Ext.form.FormPanel({
					id:"ConnectForm",
					border:false,
					style:"padding:10px 5px 5px 5px; background:#FFFFFF;",
					defaults:{hideLabel:true},
					items:formElement
				})
			],
			buttons:[
				new Ext.Button({
					text:Lang.Button.connect,
					handler:function() {
						var form = Ext.getCmp("ConnectForm").getForm();
						if (form.findField("server")) {
							if (form.findField("server").getValue()) {
								FIRCComponent.server = form.findField("server").getValue();
							} else {
								Ext.Msg.show({title:Lang.Interface.error,msg:Lang.Msg.selectServer,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING});
								return false;
							}
						}
						
						if (form.findField("port")) {
							if (form.findField("port").getValue()) {
								FIRCComponent.port = form.findField("port").getValue();
							} else {
								Ext.Msg.show({title:Lang.Interface.error,msg:Lang.Msg.selectServer,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING});
								return false;
							}
						}
						
						if (form.findField("security")) {
							if (form.findField("security").getValue()) {
								FIRCComponent.security = form.findField("security").getValue();
							} else {
								Ext.Msg.show({title:Lang.Interface.error,msg:Lang.Msg.selectServer,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING});
								return false;
							}
						}
						
						if (form.findField("encode")) {
							if (form.findField("encode").getValue()) {
								FIRCComponent.encode = form.findField("encode").getValue();
							} else {
								Ext.Msg.show({title:Lang.Interface.error,msg:Lang.Msg.selectServer,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING});
								return false;
							}
						}

						if (form.findField("nickname")) {
							if (form.findField("nickname").getValue()) {
								FIRCComponent.nickname = form.findField("nickname").getValue();
							} else {
								Ext.Msg.show({title:Lang.Interface.error,msg:Lang.Msg.insertNickname,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING});
								return false;
							}
						}

						if (form.findField("channel")) {
							if (form.findField("channel").getValue()) {
								FIRCComponent.channel = form.findField("channel").getValue().indexOf("#") == 0 ? form.findField("channel").getValue() : "#"+form.findField("channel").getValue();
								FIRCComponent.password = form.findField("password").getValue();
							}
						}

						FIRCComponent.setInfo();
						FIRCComponent.connect();
					}
				})
			]
		}).show();
	}
	
	this.getActiveId = function() {
		return Ext.getCmp("UITab").getActiveTab().getId() == "UIMainTab" ? "UIMain" : Ext.getCmp("UITab").getActiveTab().title;
	}
	
	this.getActiveTab = function() {
		return Ext.getCmp(this.getActiveId()).getLayoutTarget().dom;
	}
	
	this.checkListeners = function(eventName) {
		if (this.listeners && this.listenres[eventName]) return true;
		else return false;
	}
	
	// channel
	this.joinChannel = function(channel,key) {
		var key = key == undefined ? "" : key;
		if (Ext.getCmp(channel) == null) this.flash.joinChannel(channel,key);
	}
	
	this.channelTopic = function(channel,nickname,topic) {
		if (Ext.getCmp(channel+"Tab")) {
			Ext.getCmp(channel+"Tab").viewTitle = topic ? topic : channel;
		}
		Ext.getCmp("UIBody").setTitle(Ext.getCmp("UITab").getActiveTab().viewTitle);
		
		if (nickname) this.printSystem(channel,Lang.Msg.topicChange.replace("{nickname}","<b>"+nickname+"</b>").replace("{topic}","<b>"+topic+"</b>"));
	}
	
	this.getBanList = function(channel) {
		if ((channel !== undefined && channel.indexOf("#") == 0) || this.getActiveId().indexOf("#") == 0) {
			this.banList.removeAll();
			this.wait(Lang.Msg.waitBanList);
			this.flash.getBanList(channel !== undefined ? channel : this.getActiveId());
		}
	}
	
	this.printBanList = function() {
		if (Ext.getCmp("WaitWindow")) Ext.getCmp("WaitWindow").close();
		if (Ext.getCmp("BanListWindow")) return;
		
		var channel = this.getActiveId();
		
		new Ext.Window({
			id:"BanListWindow",
			title:Lang.Interface.channelListWindow,
			modal:true,
			layout:"fit",
			width:500,
			height:300,
			items:[
				new Ext.grid.GridPanel({
					id:"BanList",
					border:false,
					keyword:"",
					tbar:[
						new Ext.form.TextField({
							id:"BanListKeyword",
							emptyText:Lang.Interface.searchBan,
							width:100
						}),
						' ',
						new Ext.Button({
							text:Lang.Button.search,
							icon:"./images/icon/magnifier.png",
							handler:function() {
								Ext.getCmp("BanList").getStore().filter("nickname",Ext.getCmp("BanListKeyword").getValue(),0,true,false);
							}
						}),
						"-",
						new Ext.Button({
							text:Lang.Button.banAdd,
							icon:"./images/icon/lock_add.png",
							handler:function() {
								new Ext.Window({
									id:"BanListAddWindow",
									title:Lang.Button.banAdd,
									width:300,
									modal:true,
									resizable:false,
									items:[
										new Ext.Panel({
											border:false,
											layout:"fit",
											style:"padding:5px; background:#FFFFFF;",
											items:[
												new Ext.form.FormPanel({
													id:"BanListAddForm",
													border:false,
													items:[
														new Ext.form.TextField({
															name:"nickname",
															hideLabel:true,
															width:275,
															emptyText:Lang.Msg.banNickname,
															enableKeyEvents:true,
															listeners:{
																keydown:{fn:function(form,event) {
																	var banText = "";
																	var form = Ext.getCmp("BanListAddForm").getForm();
																	if (form.findField("nickname").getValue()) {
																		banText+= form.findField("nickname").getValue();
																	} else {
																		banText+= "*";
																	}
																	banText+= "!";
																	if (form.findField("realname").getValue()) {
																		banText+= form.findField("realname").getValue();
																	} else {
																		banText+= "*";
																	}
																	banText+= "@";
																	if (form.findField("ip").getValue()) {
																		banText+= form.findField("ip").getValue();
																	} else {
																		banText+= "*";
																	}
																	
																	Ext.getCmp("BanListAddText").getLayoutTarget().dom.innerHTML = banText;
																}},
																blur:{fn:function(form,event) {
																	var banText = "";
																	var form = Ext.getCmp("BanListAddForm").getForm();
																	if (form.findField("nickname").getValue()) {
																		banText+= form.findField("nickname").getValue();
																	} else {
																		banText+= "*";
																	}
																	banText+= "!";
																	if (form.findField("realname").getValue()) {
																		banText+= form.findField("realname").getValue();
																	} else {
																		banText+= "*";
																	}
																	banText+= "@";
																	if (form.findField("ip").getValue()) {
																		banText+= form.findField("ip").getValue();
																	} else {
																		banText+= "*";
																	}
																	
																	Ext.getCmp("BanListAddText").getLayoutTarget().dom.innerHTML = banText;
																}}
															}
														}),
														new Ext.form.TextField({
															name:"realname",
															hideLabel:true,
															width:275,
															emptyText:Lang.Msg.banRealname,
															enableKeyEvents:true,
															listeners:{
																keydown:{fn:function(form,event) {
																	var banText = "";
																	var form = Ext.getCmp("BanListAddForm").getForm();
																	if (form.findField("nickname").getValue()) {
																		banText+= form.findField("nickname").getValue();
																	} else {
																		banText+= "*";
																	}
																	banText+= "!";
																	if (form.findField("realname").getValue()) {
																		banText+= form.findField("realname").getValue();
																	} else {
																		banText+= "*";
																	}
																	banText+= "@";
																	if (form.findField("ip").getValue()) {
																		banText+= form.findField("ip").getValue();
																	} else {
																		banText+= "*";
																	}
																	
																	Ext.getCmp("BanListAddText").getLayoutTarget().dom.innerHTML = banText;
																}},
																blur:{fn:function(form,event) {
																	var banText = "";
																	var form = Ext.getCmp("BanListAddForm").getForm();
																	if (form.findField("nickname").getValue()) {
																		banText+= form.findField("nickname").getValue();
																	} else {
																		banText+= "*";
																	}
																	banText+= "!";
																	if (form.findField("realname").getValue()) {
																		banText+= form.findField("realname").getValue();
																	} else {
																		banText+= "*";
																	}
																	banText+= "@";
																	if (form.findField("ip").getValue()) {
																		banText+= form.findField("ip").getValue();
																	} else {
																		banText+= "*";
																	}
																	
																	Ext.getCmp("BanListAddText").getLayoutTarget().dom.innerHTML = banText;
																}}
															}
														}),
														new Ext.form.TextField({
															name:"ip",
															hideLabel:true,
															width:275,
															emptyText:Lang.Msg.banIp,
															enableKeyEvents:true,
															listeners:{
																keydown:{fn:function(form,event) {
																	var banText = "";
																	var form = Ext.getCmp("BanListAddForm").getForm();
																	if (form.findField("nickname").getValue()) {
																		banText+= form.findField("nickname").getValue();
																	} else {
																		banText+= "*";
																	}
																	banText+= "!";
																	if (form.findField("realname").getValue()) {
																		banText+= form.findField("realname").getValue();
																	} else {
																		banText+= "*";
																	}
																	banText+= "@";
																	if (form.findField("ip").getValue()) {
																		banText+= form.findField("ip").getValue();
																	} else {
																		banText+= "*";
																	}
																	
																	Ext.getCmp("BanListAddText").getLayoutTarget().dom.innerHTML = banText;
																}},
																blur:{fn:function(form,event) {
																	var banText = "";
																	var form = Ext.getCmp("BanListAddForm").getForm();
																	if (form.findField("nickname").getValue()) {
																		banText+= form.findField("nickname").getValue();
																	} else {
																		banText+= "*";
																	}
																	banText+= "!";
																	if (form.findField("realname").getValue()) {
																		banText+= form.findField("realname").getValue();
																	} else {
																		banText+= "*";
																	}
																	banText+= "@";
																	if (form.findField("ip").getValue()) {
																		banText+= form.findField("ip").getValue();
																	} else {
																		banText+= "*";
																	}
																	
																	Ext.getCmp("BanListAddText").getLayoutTarget().dom.innerHTML = banText;
																}}
															}
														}),
														new Ext.form.FieldSet({
															title:Lang.Msg.banText,
															items:[
																new Ext.Panel({
																	border:false,
																	id:"BanListAddText",
																	html:"*!*@*"
																})
															]
														})
													]
												})
											]
										})
									],
									buttons:[
										new Ext.Button({
											text:Lang.Button.ban,
											handler:function() {
												var banText = "";
												var form = Ext.getCmp("BanListAddForm").getForm();
												if (form.findField("nickname").getValue()) {
													banText+= form.findField("nickname").getValue();
												} else {
													banText+= "*";
												}
												banText+= "!";
												if (form.findField("realname").getValue()) {
													banText+= form.findField("realname").getValue();
												} else {
													banText+= "*";
												}
												banText+= "@";
												if (form.findField("ip").getValue()) {
													banText+= form.findField("ip").getValue();
												} else {
													banText+= "*";
												}
												
												FIRCComponent.flash.banAdd(channel,banText);
												FIRCComponent.getBanList(channel);
												Ext.getCmp("BanListAddWindow").close();
											}
										})
									]
								}).show();
							}
						}),
						new Ext.Button({
							text:Lang.Button.banRemove,
							icon:"./images/icon/lock_delete.png",
							handler:function() {
								var checked = Ext.getCmp("BanList").selModel.getSelections();
								if (checked.length == 0) {
									Ext.Msg.show({title:Lang.Interface.error,msg:Lang.Msg.selectBanRemove,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING});
									return false;
								} else {
									for (var i=0, loop=checked.length;i<loop;i++) {
										FIRCComponent.flash.banRemove(checked[i].get("channel"),checked[i].get("nickname"));
									}
									FIRCComponent.getBanList(channel);
								}
							}
						})
					],
					cm:new Ext.grid.ColumnModel([
						new Ext.grid.CheckboxSelectionModel(),
						{
							header:Lang.Interface.banNickname,
							dataIndex:"nickname",
							sortable:true,
							width:180,
							menuDisabled:true
						},{
							header:Lang.Interface.banFrom,
							dataIndex:"from",
							sortable:true,
							width:120,
							menuDisabled:true
						},{
							header:Lang.Interface.banTime,
							dataIndex:"time",
							sortable:true,
							width:150,
							menuDisabled:true,
							renderer:function(value) {
								return new Date(value).format("Y-m-d H:i:s");
							}
						}
					]),
					sm:new Ext.grid.CheckboxSelectionModel(),
					store:FIRCComponent.banList
				})
			]
		}).show();
	}
	
	this.getChannelList = function() {
		this.wait(Lang.Msg.waitChannelList);
		this.flash.getChannelList();
	}

	this.printChannelList = function(page,sortInfo,keyword) {
		if (Ext.getCmp("WaitWindow")) Ext.getCmp("WaitWindow").close();
		
		var limit = 50;
		if (page === undefined) {
			page = 1;
		}
		
		if (sortInfo === undefined) {
			sortInfo = {"field":"usernum","direction":"DESC"};
		}
		
		if (keyword !== undefined) {
			this.channelList.filter("channel",keyword,0,true,false);
		}
		this.channelList.sort(sortInfo.field,sortInfo.direction);

		if (Ext.getCmp("ChannelListWindow") == null) {
			new Ext.Window({
				id:"ChannelListWindow",
				title:Lang.Interface.channelListWindow,
				modal:true,
				layout:"fit",
				width:500,
				height:300,
				items:[
					new Ext.grid.GridPanel({
						id:"ChannelList",
						border:false,
						page:page,
						totalPage:Math.ceil(this.channelList.getCount()/limit),
						keyword:"",
						tbar:[
							new Ext.form.TextField({
								id:"ChannelListKeyword",
								emptyText:Lang.Interface.searchChannel,
								width:100
							}),
							' ',
							new Ext.Button({
								text:Lang.Button.search,
								icon:"./images/icon/magnifier.png",
								handler:function() {
									FIRCComponent.printChannelList(1,FIRCComponent.channelList.getSortState(),Ext.getCmp("ChannelListKeyword").getValue());
								}
							}),
							"-",
							new Ext.Button({
								text:Lang.Button.selectChannelJoin,
								icon:"./images/icon/application_go.png",
								handler:function() {
									var checked = Ext.getCmp("ChannelList").selModel.getSelections();
									if (checked.length == 0) {
										Ext.Msg.show({title:Lang.Interface.error,msg:Lang.Msg.selectJoinChannel,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING});
										return false;
									} else {
										for (var i=0, loop=checked.length;i<loop;i++) {
											FIRCComponent.joinChannel(checked[i].get("channel"));
										}
									}
								}
							}),
							"-",
							new Ext.Button({
								text:Lang.Button.channelListHelp,
								icon:"./images/icon/help.png",
								handler:function() {
									new Ext.Window({
										id:"ChannelListHelp",
										title:Lang.Button.channelListHelp,
										modal:true,
										width:400,
										height:120,
										layout:"fit",
										resizable:false,
										items:[
											new Ext.Panel({
												border:false,
												style:"padding:5px; background:#FFFFFF; font-family:AppleGothic, dotum; font-size:12px;",
												html:Lang.Help.channelList
											})
										]
									}).show();
								}
							})
						],
						cm:new Ext.grid.ColumnModel([
							new Ext.grid.CheckboxSelectionModel(),
							{
								header:Lang.Interface.channelName,
								dataIndex:"channel",
								sortable:true,
								width:130,
								menuDisabled:true,
								renderer:function(value,p,record) {
									if (record.data.mode.indexOf("k") != -1) return '<span style="color:#FF0000;">'+value+'</span>';
									else if (record.data.mode.indexOf("i") != -1) return '<span style="color:#324298;">'+value+'</span>';
									else return value;
								}
							},{
								header:Lang.Interface.userNum,
								dataIndex:"usernum",
								sortable:true,
								width:60,
								menuDisabled:true,
								renderer:function(value,p,record) {
									var sHTML = "";
									var temp = record.data.mode.split(" ");
									if (record.data.mode.indexOf("l") != -1 && temp.length > 1) {
										sHTML+= Ext.util.Format.number(value,"0,0")+"/"+Ext.util.Format.number(temp.pop(),"0,0");
									} else {
										sHTML+= Ext.util.Format.number(value,"0,0");
									}
									
									return '<div style="text-align:right;font-family:arial;">'+sHTML+'</div>';
								}
							},{
								header:Lang.Interface.topic,
								dataIndex:"topic",
								sortable:true,
								width:250,
								menuDisabled:true,
								renderer:function(value) {
									return FIRCComponent.mIRCColorize(value);
								}
							}
						]),
						sm:new Ext.grid.CheckboxSelectionModel(),
						store:new Ext.data.SimpleStore({
							fields:["channel",{"name":"usernum","type":"int"},"topic","mode"],
							data:[]
						}),
						bbar:[
							new Ext.Button({
								id:"ChannelListBtnFirst",
								iconCls:"x-tbar-page-first",
								handler:function() {
									FIRCComponent.printChannelList(1,FIRCComponent.channelList.getSortState(),Ext.getCmp("ChannelList").keyword);
								}
							}),
							new Ext.Button({
								id:"ChannelListBtnPrev",
								iconCls:"x-tbar-page-prev",
								handler:function() {
									FIRCComponent.printChannelList(Ext.getCmp("ChannelList").page-1,FIRCComponent.channelList.getSortState(),Ext.getCmp("ChannelList").keyword);
								}
							}),
							"-",
							{xtype:"tbtext",text:Lang.Interface.page+"&nbsp;"},
							new Ext.form.TextField({
								id:"ChannelListBtnPage",
								value:"1",
								style:"text-align:right;",
								cls:"x-tbar-page-number"
							}),
							{xtype:"tbtext",text:"/<span id='ChannelListTotalPage'>1</span>"},
							new Ext.Button({
								id:"ChannelListBtnNext",
								iconCls:"x-tbar-page-next",
								handler:function() {
									FIRCComponent.printChannelList(Ext.getCmp("ChannelList").page+1,FIRCComponent.channelList.getSortState(),Ext.getCmp("ChannelList").keyword);
								}
							}),
							new Ext.Button({
								id:"ChannelListBtnLast",
								iconCls:"x-tbar-page-last",
								handler:function() {
									FIRCComponent.printChannelList(Ext.getCmp("ChannelList").totalPage,FIRCComponent.channelList.getSortState(),Ext.getCmp("ChannelList").keyword);
								}
							}),
							"-",
							new Ext.Button({
								id:"ChannelListBtnRefresh",
								iconCls:"x-tbar-loading",
								handler:function() {
									FIRCComponent.getChannelList();
								}
							}),
							{xtype:"tbtext",text:"<div id='ChannelListBtnStart' class='x-paging-info'></div>"}
						],
						listeners:{
							sortchange:{fn:function(grid,sort) {
								var sortInfo = FIRCComponent.channelList.getSortState();
								if (sortInfo.field != sort.field || sortInfo.direction != sort.direction) {
									FIRCComponent.printChannelList(1,{"field":sort.field,"direction":sort.direction});
								}
							}},
							rowdblclick:{fn:function(grid,row) {
								FIRCComponent.joinChannel(grid.getStore().getAt(row).get("channel"));
							}}
						}
					})
				]
			}).show();
		}
		
		Ext.getCmp("ChannelList").getStore().removeAll();
		var channels = new Array();
		for (var i=(page-1)*limit, loop=(page*limit < this.channelList.getCount() ? page*limit : this.channelList.getCount());i<loop;i++) {
			channels.push(this.channelList.getAt(i));
		}
		Ext.getCmp("ChannelList").getStore().add(channels);
		Ext.getCmp("ChannelList").getStore().sort(sortInfo.field,sortInfo.direction);
		Ext.getCmp("ChannelList").page = page;

		Ext.getCmp("ChannelListBtnPage").setValue(Ext.getCmp("ChannelList").page);
		document.getElementById("ChannelListBtnStart").innerHTML = ((page-1)*limit+1)+" - "+(page*limit < this.channelList.getCount() ? page*limit : this.channelList.getCount())+" of "+this.channelList.getCount();
		document.getElementById("ChannelListTotalPage").innerHTML = Math.ceil(this.channelList.getCount()/limit);
		if (Ext.getCmp("ChannelList").page != Ext.getCmp("ChannelList").totalPage) {
			Ext.getCmp("ChannelListBtnNext").enable();
			Ext.getCmp("ChannelListBtnLast").enable();
		} else {
			Ext.getCmp("ChannelListBtnNext").disable();
			Ext.getCmp("ChannelListBtnLast").disable();
		}
		if (Ext.getCmp("ChannelList").page != 1) {
			Ext.getCmp("ChannelListBtnPrev").enable();
			Ext.getCmp("ChannelListBtnFirst").enable();
		} else {
			Ext.getCmp("ChannelListBtnPrev").disable();
			Ext.getCmp("ChannelListBtnFirst").disable();
		}
		
		if (keyword !== undefined) {
			Ext.getCmp("ChannelList").keyword = keyword;
			Ext.getCmp("ChannelListKeyword").setValue(keyword);
		} else {
			Ext.getCmp("ChannelList").keyword = "";
			Ext.getCmp("ChannelListKeyword").setValue("");
		}
	}
	
	this.channelKey = function(channel) {
		if (Ext.getCmp("ChannelKeyWindow")) return;
		
		new Ext.Window({
			id:"ChannelKeyWindow",
			title:Lang.Interface.channelKey.replace('{channel}',channel),
			width:300,
			height:98,
			modal:true,
			resizable:false,
			layout:"fit",
			items:[
				new Ext.Panel({
					border:false,
					style:"padding:5px; background:#FFFFFF;",
					items:[
						new Ext.form.TextField({
							id:"ChannelKeyInput",
							width:275,
							emptyText:Lang.Msg.insertChannelKey,
							enableKeyEvents:true,
							listeners:{
								keydown:{fn:function(form,event) {
									if (event.keyCode == 13) {
										if (Ext.getCmp("ChannelKeyInput").getValue()) {
											FIRCComponent.joinChannel(channel,Ext.getCmp("ChannelKeyInput").getValue());
											Ext.getCmp("ChannelKeyWindow").close();
										} else {
											Ext.Msg.show({title:Lang.Interface.error,msg:Lang.Msg.insertChannelKey,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING});
										}
									}
								}}
							}
						})
					]
				})
			],
			buttons:[
				new Ext.Button({
					text:Lang.Button.channelJoin,
					handler:function() {
						if (Ext.getCmp("ChannelKeyInput").getValue()) {
							FIRCComponent.joinChannel(channel,Ext.getCmp("ChannelKeyInput").getValue());
							Ext.getCmp("ChannelKeyWindow").close();
						} else {
							Ext.Msg.show({title:Lang.Interface.error,msg:Lang.Msg.insertChannelKey,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING});
						}
					}
				})
			]
		}).show();
	}
	
	this.channelMode = function(channel,mode,key,limit) {
		Ext.getCmp("UITab").setActiveTab(Ext.getCmp(channel+"Tab"));

		new Ext.Window({
			id:"ChannelConfigWindow",
			title:Lang.Button.channelConfig,
			width:450,
			resizable:false,
			modal:true,
			items:[
				new Ext.FormPanel({
					style:"background:#FFFFFF;",
					border:false,
					autoScroll:true,
					id:"ChannelConfigForm",
					items:[
						new Ext.form.FieldSet({
							style:"margin:5px;",
							title:Lang.Interface.limitAndKeyConfig,
							labelWidth:80,
							autoHeight:true,
							items:[
								new Ext.form.NumberField({
									fieldLabel:Lang.Interface.limitConfig,
									width:200,
									name:"limit",
									emptyText:Lang.Msg.limitConfig,
									value:limit
								}),
								new Ext.form.TextField({
									fieldLabel:Lang.Interface.keyConfig,
									width:200,
									name:"key",
									emptyText:Lang.Msg.keyConfig,
									value:key
								})
							]
						}),
						new Ext.form.FieldSet({
							title:Lang.Interface.channelDetailConfig,
							autoHeight:true,
							hideLabel:true,
							style:"margin:5px;",
							items:[
								new Ext.form.Checkbox({
									boxLabel:Lang.Msg.channelConfigT,
									hideLabel:true,
									name:"t",
									checked:(mode.indexOf("t") > -1)
								}),
								new Ext.form.Checkbox({
									boxLabel:Lang.Msg.channelConfigI,
									hideLabel:true,
									name:"i",
									checked:(mode.indexOf("i") > -1)
								}),
								new Ext.form.Checkbox({
									boxLabel:Lang.Msg.channelConfigN,
									hideLabel:true,
									name:"n",
									checked:(mode.indexOf("n") > -1)
								}),
								new Ext.form.Checkbox({
									boxLabel:Lang.Msg.channelConfigP,
									hideLabel:true,
									name:"p",
									checked:(mode.indexOf("p") > -1)
								}),
								new Ext.form.Checkbox({
									boxLabel:Lang.Msg.channelConfigS,
									hideLabel:true,
									name:"s",
									checked:(mode.indexOf("s") > -1)
								}),
								new Ext.form.Checkbox({
									boxLabel:Lang.Msg.channelConfigM,
									hideLabel:true,
									name:"m",
									checked:(mode.indexOf("m") > -1)
								})
							]
						})
					]
				})
			],
			buttons:[
				new Ext.Button({
					text:Lang.Button.change,
					handler:function() {
						var form = Ext.getCmp("ChannelConfigForm").getForm();
						
						var oMode = mode;
						var oKey = key;
						var oLimit = limit;
						
						if (form.findField("limit").getValue()) {
							FIRCComponent.flash.channelConfig(channel,"+l "+form.findField("limit").getValue());
						} else if (oMode.indexOf("l") != -1) {
							FIRCComponent.flash.channelConfig(channel,"-l");
						}
						
						if (form.findField("key").getValue()) {
							FIRCComponent.flash.channelConfig(channel,"+k "+form.findField("key").getValue());
						} else if (oMode.indexOf("k") != -1) {
							FIRCComponent.flash.channelConfig(channel,"-k "+oKey);
						}
						// tinpsm
						var modeArray = ["t","i","n","p","s","m"];
						for (var i=0, loop=modeArray.length;i<loop;i++) {
							if (oMode.indexOf(modeArray[i]) == -1 && form.findField(modeArray[i]).checked == true) {
								FIRCComponent.flash.channelConfig(channel,"+"+modeArray[i]);
							} else if (oMode.indexOf(modeArray[i]) != -1 && form.findField(modeArray[i]).checked == false) {
								FIRCComponent.flash.channelConfig(channel,"-"+modeArray[i]);
							}
						}
						Ext.getCmp("ChannelConfigWindow").close();
					}
				})
			]
		}).show();
	}

	// Message
	this.printDate = function() {
		var date = new Date();
		return date.format(this.dateFormat);
	}
	
	this.printTimer = function(time) {
		var time = typeof time == "number" ? time : parseInt(time);
		time = time < 0 ? 0 : time;
		var year = Math.floor(time/60/60/24/365);
		time = time - year*60*60*24*365;
		var month = Math.floor(time/60/60/24/30);
		time = time - month*60*60*24*30;
		var week = Math.floor(time/60/60/24/7);
		time = time - week*60*60*24*7;
		var day = Math.floor(time/60/60/24);
		time = time - day*60*60*24;
		var hour = Math.floor(time/60/60);
		time = time - hour*60*60;
		var minute = Math.floor(time/60);
		var second = time - minute*60;
		
		var timer = [];
		if (year > 0) timer.push(year+" year"+(year > 1 ? "s" : ""));
		if (month > 0) timer.push(month+" month"+(month > 1 ? "s" : ""));
		if (week > 0) timer.push(week+" week"+(week > 1 ? "s" : ""));
		if (day > 0) timer.push(day+" day"+(day > 1 ? "s" : ""));
		if (hour > 0) timer.push(hour+" hour"+(hour > 1 ? "s" : ""));
		if (minute > 0) timer.push(minute+" minute"+(minute > 1 ? "s" : ""));
		if (second > 0) timer.push(second+" second"+(second > 1 ? "s" : ""));
		
		return timer.join(", ");
	}
	
	this.clear = function() {
		this.getActiveTab().innerHTML = "";
		Ext.getCmp(this.getActiveId()+"InputBox").focus(false,100);
	}
	
	this.printSystem = function(channel,message) {
		if (Ext.getCmp(channel)) {
			var panel = Ext.getCmp(channel).getLayoutTarget().dom;
			var msg = document.createElement("div");
			msg.className = "system";
			msg.innerHTML = "["+this.printDate()+"] "+message;
			panel.appendChild(msg);

			this.scrollBottom(channel);
		}
	}
	
	this.printServerMessage = function(message) {
		var panel = Ext.getCmp("UIMain").getLayoutTarget().dom;
		var msg = document.createElement("div");
		msg.className = "server";
		msg.innerHTML = "["+this.printDate()+"] "+message;
		panel.appendChild(msg);

		this.scrollBottom("UIMain");
	}
	
	this.printError = function(message) {
		var panel = this.getActiveTab();
		var msg = document.createElement("div");
		msg.className = "error";
		msg.innerHTML = "["+this.printDate()+"] "+message;
		panel.appendChild(msg);

		this.scrollBottom(this.getActiveId());
	}
	
	this.printHelp = function() {
		var panel = this.getActiveTab();
		for (code in Lang.Help) {
			var msg = document.createElement("div");
			msg.className = "system";
			msg.innerHTML = Lang.Help[code];
			panel.appendChild(msg);
		}
		
		this.scrollBottom(this.getActiveId());
	}
	
	this.printMessage = function(channel,nickname,message) {
		if (Ext.getCmp(channel)) {
			var panel = Ext.getCmp(channel).getLayoutTarget().dom;
			var msg = document.createElement("div");
			msg.className = "talk";
			msg.innerHTML = "["+this.printDate()+"] &lt;"+nickname+"&gt; "+this.mIRCColorize(message);
			panel.appendChild(msg);
			
			this.scrollBottom(channel);
		}
	}
	
	this.printPrivMessage = function(nickname,message,position,isShow) {
		if (Ext.getCmp(nickname)) {
			this.printMessage(nickname,nickname,message);
		} else {
			var channel = nickname;
			var activeTab = Ext.getCmp("UITab").getActiveTab();
			
			Ext.getCmp("UITab").insert(position ? position : Ext.getCmp("UITab").items.length,
				new Ext.Panel({
					id:channel+"Tab",
					title:channel,
					viewTitle:Lang.Interface.queryWindowTitle.replace('{nickname}',nickname),
					closable:true,
					layout:"border",
					items:[
						new Ext.Panel({
							id:channel,
							region:"center",
							autoScroll:true,
							margins:"-1 0 0 -1",
							listeners:{render:{fn:function() {
								if (message) FIRCComponent.printMessage(channel,nickname,message);
							}}}
						}),
						new Ext.Panel({
							layout:"border",
							region:"south",
							height:60,
							border:false,
							tbar:FIRCComponent.printTextToolbar(channel),
							items:[
								new Ext.Panel({
									id:channel+"InputTool",
									region:"center",
									height:60,
									border:false,
									items:[
										new Ext.form.TextField({
											id:channel+"InputBox",
											hideLabel:true,
											name:"buildarea",
											allowBlank:true,
											style:"margin:5px 0px 0px 5px;",
											enableKeyEvents:true,
											listeners:{
												keydown:{fn:function(form,event) { FIRCComponent.inputEvent(form,event); }}
											}
										})
									],
									listeners:{resize:{fn:function() {
										Ext.getCmp(channel+"InputBox").setWidth(Ext.getCmp(channel+"InputTool").getWidth()-5);
									}}}
								}),
								new Ext.form.FormPanel({
									region:"east",
									width:30,
									border:false,
									items:[
										new Ext.Button({
											style:"margin:5px 0px 0px 3px;",
											icon:"./images/icon/pilcrow.png"
										})
									]
								})
							]
						})
					]
				})
			).show();
			
			if (isShow === false) {
				activeTab.show();
			}
		}
	}

	this.scrollBottom = function(channel) {
		if (Ext.getCmp(channel)) {
			Ext.getCmp(channel).getLayoutTarget().dom.scrollTop = Ext.getCmp(channel).getLayoutTarget().dom.scrollHeight;
		}
	}
	
	this.mIRCColorize = function(str) { // Make By Arzz (copyrights(c) dev.arzz.com)
		var colortext = str;
		colortext = colortext.replace(/&/g, '&amp;');
		colortext = colortext.replace(/</g, '&lt;');
		colortext = colortext.replace(/>/g, '&gt;');
		colortext = colortext.replace(/\\/, '\\\\');
		colortext = colortext.replace(/"/g, '&quot;');
	
		colortext = colortext.replace(/((http|https|ftp):\/\/[^\s)()]+)/g, function(url) { var more = ''; if (/&lt;|&gt;/.test(url)) { var seps = url.split(/&lt;|&gt;/, 1); more = url.substr(seps[0].length); url = seps[0]; } return '<a href="'+url+'" target="_blank">'+url+'</a>'+more;});
	
		var irccode = new Array("white","black","navy","green","red","maroon","purple","orange","yellow","lime","teal","aqua","blue","fuchsia","gray","silver");
	
		var code = "";
		var codeNum = 0;
		var isCodeStart = false;
		var isBold = false;
		var isUnderline = false;
		for (var i=0, loop=str.length;i<loop;i++) {
			var txt = str.substr(i,1);
	
			if (txt == "") {
				if (isBold == true) colortext = colortext.replace(txt,'</b>');
				else colortext = colortext.replace(txt,'<b>');
				isBold = isBold == true ? false : true;
			}
	
			if (txt == "") {
				if (isUnderline == true) colortext = colortext.replace(txt,'</u>');
				else colortext = colortext.replace(txt,'<u>');
				isUnderline = isUnderline == true ? false : true;
			}
	
			if (txt == "") {
				isCodeStart = true;
				code+= txt;
				codeNum++;
				continue;
			}
	
			if (txt == "") {
				code = "";
				var endtag = "";
				for (var e=codeNum;e>0;e--) {
					endtag+= '</span>';
				}
				if (isBold == true) endtag+= '</b>';
				if (isUnderline == true) endtag+= '</u>';
				colortext = colortext.replace(txt,endtag);
				isBold = isUnderline = isCodeStart = false;
				codeNum = 0;
			}
	
			if (isCodeStart == true) {
				var matches = str.substr(i,5).match(/[0-9]{1,2}\,[0-9]{1,2}/);
				if (matches != null) {
					code+= matches;
					i = i + matches.length-1;
	
					var temp = matches.toString().split(",");
					colortext = colortext.replace(code,'<span style="color:'+irccode[parseInt(temp[0])%16]+'; background:'+irccode[parseInt(temp[1])%16]+';">');
	
					isCodeStart = false;
					code = "";
					continue;
				}
	
				var matches = str.substr(i,5).match(/[0-9]{1,2}/);
				if (matches != null) {
					code+= matches;
					i = i + matches.length-1;
	
					var temp = matches.toString().split(",");
					colortext = colortext.replace(code,'<span style="color:'+irccode[parseInt(matches)%16]+';">');
	
					isCodeStart = false;
					code = "";
					continue;
				}
			}
		}
	
		for (var e=codeNum;e>0;e--) {
			colortext+= '</span>';
		}
		if (isBold == true) colortext+= '</b>';
		if (isUnderline == true) colortext+= '</u>';
	
		colortext = colortext.replace(/ {2,}/g,function (text) { return new Array(text.length+1).join('&nbsp;'); });
		colortext = colortext.replace(/&amp;#([0-9]+);/g, function(text, num) { return '&#'+num+';'; });
	
		return colortext;
	}
	
	// User
	this.findUser = function(channel,nickname) {
		if (Ext.getCmp(channel+"User")) {
			var nickname = nickname.replace(/\^/g,'\\\^');
			var findIndex = Ext.getCmp(channel+"User").getStore().find("nickname",new RegExp(nickname+"$"),0,false,false);
			if (findIndex == -1) return null;
			else return Ext.getCmp(channel+"User").getStore().getAt(findIndex);
		} else {
			return null;
		}
	}
	
	this.myMode = function(channel) {
		var nickname = this.flash.getMyNickname();
		var user = this.findUser(channel,nickname);
		
		return user == null ? "" : user.get("mode");
	}
	
	this.changeNickname = function(isDuplication) {
		if (Ext.getCmp("changeNicknameWindow")) return;
		
		var isDuplication = isDuplication !== undefined ? isDuplication : false;
		
		new Ext.Window({
			id:"ChangeNicknameWindow",
			title:isDuplication == true ? Lang.Error.DuplicateNickname : Lang.Interface.changeNickname,
			width:300,
			height:98,
			modal:true,
			resizable:false,
			layout:"fit",
			items:[
				new Ext.Panel({
					border:false,
					style:"padding:5px; background:#FFFFFF;",
					items:[
						new Ext.form.TextField({
							id:"ChangeNicknameInput",
							width:275,
							emptyText:Lang.Msg.insertNickname,
							enableKeyEvents:true,
							value:isDuplication == false ? this.flash.getMyNickname() : "",
							listeners:{
								keydown:{fn:function(form,event) {
									if (event.keyCode == 13) {
										if (isDuplication == true) {
											FIRCComponent.wait(Lang.Msg.tryConnect);
										}
										FIRCComponent.flash.changeNickname(Ext.getCmp("ChangeNicknameInput").getValue());
										Ext.getCmp("ChangeNicknameWindow").close();
									}
								}}
							}
						})
					]
				})
			],
			buttons:[
				new Ext.Button({
					text:Lang.Button.change,
					handler:function() {
						if (isDuplication == true) {
							FIRCComponent.wait(Lang.Msg.tryConnect);
						}
						FIRCComponent.flash.changeNickname(Ext.getCmp("ChangeNicknameInput").getValue());
						Ext.getCmp("ChangeNicknameWindow").close();
					}
				})
			],
			listeners:{close:{fn:function() {
				if (isDuplication == true && !Ext.getCmp("WaitWindow")) {
					FIRCComponent.setConnect();
					FIRCComponent.flash.disconnect();
				}
			}}}
		}).show();
	}
	
	this.userJoin = function(channel,nickname) {
		if (this.findUser(channel,nickname) == null && Ext.getCmp(channel+"User")) {
			var tempRecord = Ext.data.Record.create([{"name":"mode"},{"name":"nickname"},{"name":"sort"},{"name":"ip"}]);
			var user = new tempRecord({"mode":"","nickname":nickname,"sort":"2:"+nickname,"ip":""});
			Ext.getCmp(channel+"User").getStore().add(user);
			this.userSort(channel);
			this.printSystem(channel,Lang.Msg.userJoin.replace("{nickname}","<b>"+nickname+"</b>"));
		}
	}
	
	this.userNick = function(user,nickname) {
		for (var i=0, loop=Ext.getCmp("UITab").items.length;i<loop;i++) {
			if (Ext.getCmp("UITab").items.items[i].title.indexOf("#") == 0) {
				var channel = Ext.getCmp("UITab").items.items[i].title;
				var checkUser = this.findUser(channel,user);
				if (checkUser != null) {
					checkUser.set("nickname",nickname);
					checkUser.set("sort",checkUser.get("mode")+nickname);
					this.userSort(channel);
					this.printSystem(channel,Lang.Msg.nickChange.replace("{user}","<b>"+user+"</b>").replace("{nickname}","<b>"+nickname+"</b>"));
				}
			}
			
			if (Ext.getCmp("UITab").items.items[i].title == user) {
				var prevMessage = Ext.getCmp(user).getLayoutTarget().dom.innerHTML;
				if (Ext.getCmp("UITab").getActiveTab().id == user+"Tab") var isShow = true;
				else isShow = false;
				Ext.getCmp("UITab").remove(Ext.getCmp("UITab").items.items[i],true);
				this.printPrivMessage(nickname,"",i,isShow);
				Ext.getCmp(nickname).getLayoutTarget().dom.innerHTML = prevMessage;
				this.printSystem(nickname,Lang.Msg.nickChange.replace("{user}","<b>"+user+"</b>").replace("{nickname}","<b>"+nickname+"</b>"));
			}
		}
	}
	
	this.userMode = function(channel,mode,nickname,from) {
		if (mode.indexOf("b") == -1) {
			var user = this.findUser(channel,nickname);
			if (user != null) {
				switch (mode) {
					case "+o" :
						user.set("mode","@");
						user.set("sort","0:"+user.get("nickname"));
						this.userSort(channel);
						this.printSystem(channel,Lang.Msg.getOpper.replace("{from}","<b>"+from+"</b>").replace("{nickname}","<b>"+nickname+"</b>"));
					break;
					
					case "+v" :
						if (user.get("mode") != "@") {
							user.set("mode","+");
							user.set("sort","1:"+user.get("nickname"));
							this.userSort(channel);
						}
						this.printSystem(channel,Lang.Msg.getVoice.replace("{from}","<b>"+from+"</b>").replace("{nickname}","<b>"+nickname+"</b>"));
					break;
					
					case "-o" :
						this.printSystem(channel,Lang.Msg.takeOpper.replace("{from}","<b>"+from+"</b>").replace("{nickname}","<b>"+nickname+"</b>"));
					break;
					
					case "-v" :
						this.printSystem(channel,Lang.Msg.takeVoice.replace("{from}","<b>"+from+"</b>").replace("{nickname}","<b>"+nickname+"</b>"));
					break;
				}
			}
		} else {
			switch (mode) {
				case "+b" :
					this.printSystem(channel,Lang.Msg.userBan.replace("{nickname}","<b>"+nickname+"</b>").replace("{from}","<b>"+from+"</b>"));
				break;
				
				case "-b" :
					this.printSystem(channel,Lang.Msg.userRemoveBan.replace("{nickname}","<b>"+nickname+"</b>").replace("{from}","<b>"+from+"</b>"));
				break;
			}
		}
	}
	
	this.userPart = function(channel,nickname,message,isQuit) {
		var user = this.findUser(channel,nickname);
		if (user != null) {
			Ext.getCmp(channel+"User").getStore().remove(user);
			this.userSort(channel);
			if (isQuit == true) {
				var systemMessage = Lang.Msg.userQuit.replace("{nickname}","<b>"+nickname+"</b>");
			} else {
				var systemMessage = Lang.Msg.userPart.replace("{nickname}","<b>"+nickname+"</b>");
			}
			if (message) systemMessage+= " ("+message+")";
			this.printSystem(channel,systemMessage);
		}
	}
	
	this.userQuit = function(nickname,message) {
		for (var i=0, loop=Ext.getCmp("UITab").items.length;i<loop;i++) {
			if (Ext.getCmp("UITab").items.items[i].title.indexOf("#") == 0) {
				var channel = Ext.getCmp("UITab").items.items[i].title;
				if (this.findUser(channel,nickname) != null) {
					this.userPart(channel,nickname,message,true);
				}
			} else if (Ext.getCmp("UITab").items.items[i].title == nickname) {
				this.userPart(nickname,nickname,message,true);
			}
		}
	}
	
	this.userKick = function(channel,nickname,from,message,isMe) {
		if (isMe == true) {
			var systemMessage = Lang.Msg.myKick.replace("{channel}","<b>"+channel+"</b>").replace("{from}","<b>"+from+"</b>");
			if (message) systemMessage+= " ("+message+")";
			Ext.Msg.show({title:Lang.Interface.error,msg:systemMessage,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING});
			Ext.getCmp("UITab").remove(channel+"Tab",false);
		} else {
			var user = this.findUser(channel,nickname);
			if (user != null) {
				Ext.getCmp(channel+"User").getStore().remove(user);
				this.userSort(channel);
				var systemMessage = Lang.Msg.userKick.replace("{nickname}","<b>"+nickname+"</b>").replace("{from}","<b>"+from+"</b>");
				if (message) systemMessage+= " ("+message+")";	
				this.printSystem(channel,systemMessage);
			}
		}
	}
	
	this.userWhoIs = function(nickname,realname,ip,channel,idle,connected) {
		if (Ext.getCmp("WhoIsInfo")) {
			var object = Ext.getCmp("WhoIsInfo").getLayoutTarget().dom;
			var div = document.createElement("div");
			div.className = "whois";
			div.innerHTML = "IP : <b>"+ip+"</b>";
			object.appendChild(div);
			
			var div = document.createElement("div");
			div.className = "whois";
			div.innerHTML = "RealName : <b>"+realname+"</b>";
			object.appendChild(div);
			
			var div = document.createElement("div");
			div.className = "whois";
			var channels = channel.split(" ");
			for (var i=0, loop=channels.length;i<loop;i++) {
				channels[i] = '<span class="channel" onclick="FIRCComponent.joinChannel(\''+channels[i]+'\');">'+channels[i]+'</span>';
			}
			div.innerHTML = "Channels : "+channels.join(", ");
			object.appendChild(div);
			
			var div = document.createElement("div");
			div.className = "whois";
			div.innerHTML = "Connected : <b>"+new Date(parseInt(connected)*1000).format("Y-m-d H:i:s")+"</b>";
			object.appendChild(div);
			
			var div = document.createElement("div");
			div.className = "whois";
			div.innerHTML = "Idle Time : <b>"+this.printTimer(idle)+"</b>";
			object.appendChild(div);
		}
		
		for (var i=0, loop=Ext.getCmp("UITab").items.length;i<loop;i++) {
			if (Ext.getCmp("UITab").items.items[i].title.indexOf("#") == 0) {
				var channel = Ext.getCmp("UITab").items.items[i].title;
				var user = this.findUser(channel,nickname);
				if (user != null) {
					user.set("ip",ip);
					this.userSort(channel);
				}
			}
		}
	}
	
	this.userSort = function(channel) {
		if (Ext.getCmp(channel+"User")) {
			Ext.getCmp(channel+"User").getStore().sort("sort","ASC");
			Ext.getCmp(channel+"User").getStore().commitChanges();
			Ext.getCmp(channel+"User").colModel.setColumnHeader(0,Lang.Interface.userName+"("+Lang.Interface.userCountUnit.replace("{count}",Ext.getCmp(channel+"User").getStore().getCount())+")");
		}
	}
	
	this.inputEvent = function(form,event) {
		var tab = Ext.getCmp("UITab").getActiveTab();
		if (tab.getId() == "UIMainTab") {
			var channel = "";
		} else {
			var channel = tab.title;
		}
		
		if (event.keyCode == 13) {
			var message = form.getValue();
			form.setValue("");
			this.sendMessage(channel,message);
		}
		
		if (event.keyCode == 9) {
			if (channel && form.getValue()) {
				var token = form.getValue().split(" ");
				var findText = token.pop();
				var command = token.join(" ") ? token.join(" ")+" " : "";

				if (this.autoNickString == "") {
					this.autoNickString = findText;
					token.join(" ") ? token.join(" ")+" " : "";
				} else {
					token.pop();
					var command = token.join(" ") ? token.join(" ")+" " : "";
				}
				var findIDX = Ext.getCmp(channel+"User").getStore().find("nickname",this.autoNickString,this.autoNickPosition,false,false);
				if (findIDX == -1 && this.autoNickPosition != 0) {
					this.autoNickPosition = 0;
					findIDX = Ext.getCmp(channel+"User").getStore().find("nickname",this.autoNickString,this.autoNickPosition,false,false);
				}
				
				if (findIDX != -1) {
					form.setValue(command+Ext.getCmp(channel+"User").getStore().getAt(findIDX).get("nickname")+" ");
					this.autoNickPosition = findIDX + 1;
				}
			}
			
			form.focus(false,100);
		} else {
			this.autoNickString = "";
			this.autoNickPosition = 0;
		}
	}
	
	this.sendMessage = function(channel,message) {
		if (message.length == 0) return;
		
		if (channel != "" && message.indexOf("/") != 0) {
			if (Ext.getCmp(channel+"BtnBold").pressed == true) {
				message = ""+message+""
			}
	
			if (Ext.getCmp(channel+"BtnUnderline").pressed == true) {
				message = ""+message+"";
			}
	
			if (Ext.getCmp(channel+"BtnColor").getValue() || Ext.getCmp(channel+"BtnBackgroundColor").getValue()) {
				colorMsg = "";
				if (Ext.getCmp(channel+"BtnColor").getValue()) {
					colorMsg+= Ext.getCmp(channel+"BtnColor").getValue();
				} else {
					colorMsg+= "1";
				}
	
				if (Ext.getCmp(channel+"BtnBackgroundColor").getValue()) {
					colorMsg+= ","+Ext.getCmp(channel+"BtnBackgroundColor").getValue();
				}
	
				message = colorMsg+message;
			}
	
			/*
			var temp = Ext.getCmp("Tabs").getActiveTab().getId().split("#");
	
			if (temp[0] == "C") {
				var channel = temp[1];
				if (Ext.getCmp("BtnAction").pressed == true) {
					msg = 'ACTION '+msg+'';
					Ext.getCmp("BtnAction").toggle(false);
				}
	
				if (Ext.getCmp("BtnNotice").pressed == true) {
					Ext.getCmp("BtnNotice").toggle(false);
	
					document.getElementById(fIRCID).send("NOTICE #"+channel+" :"+msg);
					fIRCChatBodyMessage("NOTICE",channel,msg,document.getElementById(fIRCID).nick());
				} else {
					document.getElementById(fIRCID).send("PRIVMSG #"+channel+" :"+msg);
					fIRCChatBodyMessage("TALK",channel,msg,document.getElementById(fIRCID).nick());
				}
			} else {
				var nickname = temp[1];
				document.getElementById(fIRCID).send("PRIVMSG "+nickname+" :"+msg);
				fIRCChatBodyMessage("WHISPER",nickname,msg,document.getElementById(fIRCID).nick());
			}
			*/
			this.flash.sendMessage(channel,message);
		} else if (message.indexOf("/") == 0) {
			var token = message.split(" ");
			var command = token.shift();
			
			switch (command) {
				case "/?" :
					this.printHelp();
				break;
				
				case "/clear" :
					this.clear();
				break;
				
				case "/join" :
					var value = token.shift();
					if (value) {
						this.joinChannel(value);
					} else {
						this.printError(Lang.Error.WrongCommand);
					}
				break;
				
				case "/part" :
					var value = token.shift();
					
					if (value && value.indexOf("#") == 0 && Ext.getCmp(value+"Tab")) {
						Ext.getCmp("UITab").remove(value+"Tab",true);
						this.flash.partChannel(value);
					} else if (channel.indexOf("#") == 0) {
						Ext.getCmp("UITab").remove(channel+"Tab",true);
						this.flash.partChannel(channel);
					} else {
						this.printError(Lang.Error.WrongCommand);
					}
				break;
				
				case "/query" :
					var value1 = token.shift();
					var value2 = token.join(" ");
					
					if (value1 && value2) {
						this.printPrivMessage(value1);
						this.sendMessage(value1,value2);
					} else {
						this.printError(Lang.Error.WrongCommand);
					}
				break;
				
				case "/nick" :
					var value = token.shift();
					if (value) {
						this.flash.changeNickname(value);
					} else {
						this.printError(Lang.Error.WrongCommand);
					}
				break;
				
				default :
					this.printError(Lang.Error.notSupportCommand);
				break;
			}
		} else {
			this.flash.sendMessage(channel,message);
		}
	}

	this.render = function() {
		new Ext.Viewport({
			id:"UI",
			layout:"border",
			renderTo:Ext.getBody(),
			items:[
				new Ext.Panel({
					region:"south",
					collapsible:false,
					height:20,
					split:true,
					minHeight:20,
					maxHeight:20,
					layout:"fit",
					border:false,
					contentEl:"FooterLayer"
				}),
				new Ext.Panel({
					id:"UIBody",
					region:"center",
					margins:"5 5 0 5",
					layout:"fit",
					title:Lang.Title,
					items:[
						new Ext.TabPanel({
							id:"UITab",
							border:false,
							activeTab:0,
							enableTabScroll:true,
							tabPosition:"bottom",
							tbar:[
								new Ext.Button({
									text:FIRCComponent.toolType != "icon" ? Lang.Button.clear : "",
									icon:FIRCComponent.toolType != "text" ? "./images/icon/broom.png" : "",
									handler:function() {
										FIRCComponent.clear();
									}
								}),
								"-",
								new Ext.Button({
									text:FIRCComponent.toolType != "icon" ? Lang.Button.changeNickname : "",
									icon:FIRCComponent.toolType != "text" ? "./images/icon/at.png" : "",
									handler:function() {
										FIRCComponent.changeNickname();
									}
								}),
								"-",
								new Ext.Button({
									id:"BtnChannelTopic",
									text:FIRCComponent.toolType != "icon" ? Lang.Button.channelTopic : "",
									icon:FIRCComponent.toolType != "text" ? "./images/icon/cup.png" : "",
									handler:function() {
										if (Ext.getCmp("UITab").getActiveTab().getId().indexOf("#") == 0) {
											new Ext.Window({
												id:"ChannelTopicWindow",
												title:Lang.Interface.changeChannelTopic,
												width:400,
												height:98,
												modal:true,
												resizable:false,
												layout:"fit",
												items:[
													new Ext.Panel({
														border:false,
														style:"padding:5px; background:#FFFFFF;",
														items:[
															new Ext.form.TextField({
																id:"ChannelTopicInput",
																width:375,
																emptyText:Lang.Msg.insertChannelTopic,
																enableKeyEvents:true,
																value:(Ext.getCmp("UITab").getActiveTab().title != Ext.getCmp("UITab").getActiveTab().viewTitle ? Ext.getCmp("UITab").getActiveTab().viewTitle : ""),
																listeners:{
																	keydown:{fn:function(form,event) {
																		if (event.keyCode == 13) {
																			FIRCComponent.flash.channelTopic(Ext.getCmp("UITab").getActiveTab().title,Ext.getCmp("ChannelTopicInput").getValue());
																			Ext.getCmp("ChannelTopicWindow").close();
																		}
																	}}
																}
															})
														]
													})
												],
												buttons:[
													new Ext.Button({
														text:Lang.Button.change,
														handler:function() {
															FIRCComponent.flash.channelTopic(Ext.getCmp("UITab").getActiveTab().title,Ext.getCmp("ChannelTopicInput").getValue());
															Ext.getCmp("ChannelTopicWindow").close();
														}
													})
												]
											}).show();
										}
									}
								}),
								new Ext.Button({
									id:"BtnChannelConfig",
									text:FIRCComponent.toolType != "icon" ? Lang.Button.channelConfig : "",
									icon:FIRCComponent.toolType != "text" ? "./images/icon/cog.png" : "",
									handler:function() {
										if (Ext.getCmp("UITab").getActiveTab().getId().indexOf("#") == 0) {
											FIRCComponent.flash.getChannelMode(Ext.getCmp("UITab").getActiveTab().title);
										}
									}
								}),
								new Ext.Button({
									id:"BtnChannelBanList",
									text:FIRCComponent.toolType != "icon" ? Lang.Button.banList : "",
									icon:FIRCComponent.toolType != "text" ? "./images/icon/lock.png" : "",
									handler:function() {
										FIRCComponent.getBanList();
									}
								}),
								"-",
								new Ext.Button({
									text:FIRCComponent.toolType != "icon" ? Lang.Button.channelJoin : "",
									icon:FIRCComponent.toolType != "text" ? "./images/icon/application_go.png" : "",
									handler:function() {
										new Ext.Window({
											id:"ChannelJoinWindow",
											title:Lang.Interface.channelJoin,
											width:300,
											height:125,
											modal:true,
											resizable:false,
											layout:"fit",
											items:[
												new Ext.Panel({
													border:false,
													style:"padding:5px; background:#FFFFFF;",
													items:[
														new Ext.form.TextField({
															id:"ChannelJoinInputChannel",
															width:275,
															emptyText:Lang.Msg.insertChannelName,
															enableKeyEvents:true,
															listeners:{
																keydown:{fn:function(form,event) {
																	if (event.keyCode == 13) {
																		if (Ext.getCmp("ChannelJoinInputChannel").getValue()) {
																			var channel = Ext.getCmp("ChannelJoinInputChannel").getValue().indexOf("#") == 0 ? Ext.getCmp("ChannelJoinInputChannel").getValue() : "#"+Ext.getCmp("ChannelJoinInputChannel").getValue();
																			FIRCComponent.joinChannel(channel,Ext.getCmp("ChannelJoinInputKey").getValue());
																			Ext.getCmp("ChannelJoinWindow").close();
																		} else {
																			Ext.Msg.show({title:Lang.Interface.error,msg:Lang.Msg.insertChannelName,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING});
																		}
																	}
																}}
															}
														}),
														new Ext.form.TextField({
															id:"ChannelJoinInputKey",
															width:275,
															emptyText:Lang.Msg.insertChannelKey+"("+Lang.Interface.Optional+")",
															enableKeyEvents:true,
															style:"margin-top:3px;",
															listeners:{
																keydown:{fn:function(form,event) {
																	if (event.keyCode == 13) {
																		if (Ext.getCmp("ChannelJoinInputChannel").getValue()) {
																			var channel = Ext.getCmp("ChannelJoinInputChannel").getValue().indexOf("#") == 0 ? Ext.getCmp("ChannelJoinInputChannel").getValue() : "#"+Ext.getCmp("ChannelJoinInputChannel").getValue();
																			FIRCComponent.joinChannel(channel,Ext.getCmp("ChannelJoinInputKey").getValue());
																			Ext.getCmp("ChannelJoinWindow").close();
																		} else {
																			Ext.Msg.show({title:Lang.Interface.error,msg:Lang.Msg.insertChannelName,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING});
																		}
																	}
																}}
															}
														})
													]
												})
											],
											buttons:[
												new Ext.Button({
													text:Lang.Button.channelJoin,
													handler:function() {
														if (Ext.getCmp("ChannelJoinInputChannel").getValue()) {
															var channel = Ext.getCmp("ChannelJoinInputChannel").getValue().indexOf("#") == 0 ? Ext.getCmp("ChannelJoinInputChannel").getValue() : "#"+Ext.getCmp("ChannelJoinInputChannel").getValue();
															FIRCComponent.joinChannel(channel,Ext.getCmp("ChannelJoinInputKey").getValue());
															Ext.getCmp("ChannelJoinWindow").close();
														} else {
															Ext.Msg.show({title:Lang.Interface.error,msg:Lang.Msg.insertChannelName,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING});
														}
													}
												})
											]
										}).show();
									}
								}),
								new Ext.Button({
									text:FIRCComponent.toolType != "icon" ? Lang.Button.channelList : "",
									icon:FIRCComponent.toolType != "text" ? "./images/icon/table.png" : "",
									handler:function() {
										FIRCComponent.getChannelList();
									}
								})
							],
							items:[
								new Ext.Panel({
									id:"UIMainTab",
									layout:"border",
									title:Lang.Title,
									viewTitle:Lang.Title,
									items:[
										new Ext.Panel({
											id:"UIMain",
											region:"center",
											autoScroll:true,
											margins:"-1 -1 0 -1"
										}),
										new Ext.Panel({
											layout:"border",
											region:"south",
											height:33,
											border:false,
											items:[
												new Ext.Panel({
													id:"UIMainInputTool",
													region:"center",
													border:false,
													items:[
														new Ext.form.TextField({
															id:"UIMainInputBox",
															hideLabel:true,
															name:"buildarea",
															allowBlank:true,
															style:"margin:5px 0px 0px 5px;",
															enableKeyEvents:true,
															listeners:{
																keydown:{fn:function(form,event) {
																	if (event.keyCode == 13) {
																		FIRCComponent.sendMessage("",form.getValue());
																		form.setValue("");
																	}
																}}
															}
														})
													],
													listeners:{resize:{fn:function() {
														Ext.getCmp("UIMainInputBox").setWidth(Ext.getCmp("UIMainInputTool").getWidth()-5);
													}}}
												}),
												new Ext.form.FormPanel({
													region:"east",
													width:30,
													border:false,
													items:[
														new Ext.Button({
															style:"margin:5px 0px 0px 3px;",
															icon:"./images/icon/pilcrow.png"
														})
													]
												})
											]
										})
									]
								})
							],
							listeners:{
								tabchange:{fn:function(tabs,tab) {
									if (tab) {
										Ext.getCmp("UIBody").setTitle(tab.viewTitle);
										if (tab.getId() == "UIMainTab") {
											FIRCComponent.scrollBottom("UIMain");
											Ext.getCmp("UIMainInputBox").focus(false,100);
										} else {
											var channel = tab.title;
											FIRCComponent.scrollBottom(channel);
											Ext.getCmp(channel+"InputBox").focus(false,100);
										}
										
										if (tab.getId().indexOf("#") == 0) {
											Ext.getCmp("BtnChannelTopic").enable();
											Ext.getCmp("BtnChannelConfig").enable();
											Ext.getCmp("BtnChannelBanList").enable();
										} else {
											Ext.getCmp("BtnChannelTopic").disable();
											Ext.getCmp("BtnChannelConfig").disable();
											Ext.getCmp("BtnChannelBanList").disable();
										}
									}
								}}
							}
						})
					]
				})
			],
			listeners:{render:{fn:function() {
				FIRCComponent.printFlash();
			}}}
		});
	}
	
	try {
		window.addEventListener('unload',function(event) {
			FIRCComponent.flash.quit();
		},false);
		
		window.addEventListener('beforeunload',function(event) {
			return Lang.Msg.beforeUnload;
		},false);

		window.addEventListener('blur',function(event) {
			//MinionComponent.setFocus(false);
		},false);

		window.addEventListener('focus',function(event) {
			//MinionComponent.setFocus(true);
		},false);
	} catch(e) {
		window.attachEvent('onunload',function(event) {
			FIRCComponent.flash.quit();
		});
		
		window.attachEvent('onbeforeunload',function(event) {
			return Lang.Msg.beforeUnload;
		});

		window.attachEvent('onfocus',function(event) {
			//MinionComponent.setFocus(true);
		});
	}

	FIRCComponent = this;
	this.render();
}