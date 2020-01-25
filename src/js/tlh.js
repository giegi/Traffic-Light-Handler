	/* ### LIBRARY CODE ### */
	
	var tlhl = (function () {    
		return function (_name, _configObject) { //_callback, _library, _libraryLoadSuccess, _libraryLoadError, _async[continueOnFailure]) {
			// Private Methods and properties
			var name = "";
			var console_prefix = "";
			var zconsole_prefix = "";
			var callback = function () {};
			var externalDependencies = [];
			var externalLibDependencies = [];
			var lights = {};        
			var liblights = {};
			var libraryToLoad = "";
			var libraryLoadSuccess = function() {};
			var libraryLoadError = function() {};
			var continueOnFailure = true;
			var logMode = 1;  //paranoid verbose info minimal disabled
			var tlhconsole = {};
			var internalReference;
			var complete = false;
			tlhconsole.log = function(logMsg, logLevel, _obj) {
				if(window.location.href.toString().indexOf("kwdebugtlh=true") === -1) { return; }
				if(!logLevel) { logLevel = 1; }
				var colorsLevel = ["#000", "#000", "#FF00FF", "#FF0000"];
				if(logMode >= logLevel) {
					//console.log(logMsg, 'background: #222; color: #bada55');
					if(_obj) {
						console.log('%c'+zconsole_prefix+' %c'+logMsg, 'padding: 2px; background: #E52524; color: #FFF', 'padding: 2px; color: '+colorsLevel[logLevel], _obj);
					} else {
						console.log('%c'+zconsole_prefix+' %c'+logMsg, 'padding: 2px; background: #E52524; color: #FFF', 'padding: 2px; color: '+colorsLevel[logLevel]);
					}
				}
			}
			var error = function(errorID) {
				var err;
				var abort = false;
				switch(errorID) {
					case 0:
						//err = new TypeError("ReferenceError", "Light as Object Not Valid (no tlh identified) - Discarded");
						break;
					case 1:
						err = new RangeError("Name Not Defined");
						break;
					case 2:
						err = new EvalError("Light Not Found");
						break;
					case 3:
						err = new TypeError("Light as Object Not Valid (no tlh identified) - Discarded");
						break;
					case 4:
						err = new TypeError("Light Not Valid - Discarded");
						break;
					case 5:
						err = new EvalError("Light Already exsiting");
						break;
					case 6:
						err = new ReferenceError("Can't greenify a tlh object as light - Check its status before");
						break;
					case 7:
						err = new RangeError("Callback passed is not valid. Pass null to disable callback");
						break;
					case 8:
						err = new ReferenceError("Can't add this tlh to itself.");
						break;    
					case 9:
						err = new ReferenceError("Light name not allowed.");
						break;
					default:
						err = new Error("Something Went Wrong and I don't know what. Debug better!");
						abort = true;
						break;
				}            
				if(abort === true) {                
					throw err;
				} else {
					/* console */ console.error(err);            
				}
			}
			
			var _executeLibraryFn = function() {
				var err = false;
				try {
					libraryToLoad();
				} catch(e) {
					err = true;
				}
				if(err === false || err === true && continueOnFailure === true) {
					_libraryLoaded();
				}
				if(err === false) {
					try { libraryLoadSuccess(); } catch(e) {}
				}
				if(err === true) {
					try { libraryLoadError(); } catch(e) {}
				}
			}
			
			var _loadLibrary = function() {                        
				if(libraryToLoad !== "" && lights['library'] === false) {
					lights['library'] = "downloading";
					/* console */ tlhconsole.log(console_prefix+" Library downloading started "+libraryToLoad, 3);
					var script = document.createElement('script');
					script.async = true;
					script.onload = function (e, elem) { 
						/* console */ tlhconsole.log(console_prefix+" Library downloading completed "+libraryToLoad, 1);
						/* console */ tlhconsole.log(e, 1);
						/* console */ tlhconsole.log(elem, 1);
						setTimeout(function() {
							_libraryLoaded(); 
							libraryLoadSuccess();
						}, 20);
						//document.head.appendChild(script)
					};
					script.onerror = function () { 
						/* console */ tlhconsole.log(console_prefix+" Library downloading completed with errors "+libraryToLoad, 1);
						if(continueOnFailure === true) {
							try { _libraryLoaded(); } catch(e) {}
						} else {
							/* console */ tlhconsole.log(console_prefix+" FATAL ERROR OCCURRED DOWNLOADING "+libraryToLoad+" - This failure won't be resolved. If any dependency from this, will remain uncompleted", 1);
						}
						try { libraryLoadError(); } catch(e) {}
					};
					script.src = libraryToLoad;
					document.head.appendChild(script); //or something of the likes
					 // call _libraryLoaded when done            
				}
			}
			var _loadCssLibrary = function() {                        
				if(libraryToLoad !== "" && lights['library'] === false) {
					/* console */ tlhconsole.log(console_prefix+" CSSLibrary downloading started "+libraryToLoad, 3);
					var cssscript = document.createElement('link');
					cssscript.async = true;
					cssscript.onload = function (e, elem) { 
						/* console */ tlhconsole.log(console_prefix+" CSSLibrary downloading completed "+libraryToLoad, 1);
						_libraryLoaded(); 
						libraryLoadSuccess();
						//document.head.appendChild(cssscript)
					};
					cssscript.onerror = function () { 
						/* console */ tlhconsole.log(console_prefix+" CSSLibrary downloading completed with errors "+libraryToLoad, 1);
						if(continueOnFailure === true) {
							try { _libraryLoaded(); } catch(e) {}
						} else {
							/* console */ tlhconsole.log(console_prefix+" FATAL ERROR OCCURRED DOWNLOADING "+libraryToLoad+" - This failure won't be resolved. If any dependency from this, will remain uncompleted", 1);
						}
						try { libraryLoadError(); } catch(e) {}
					};
					cssscript.rel = "stylesheet";
					cssscript.href = libraryToLoad;
					document.head.appendChild(cssscript); //or something of the likes
					 // call _libraryLoaded when done            
				}
			}
			var _libraryLoaded = function() {
				lights['library'] = true;
				internalReference.getStatus(true);
			}
			var _addExternalDependency = function(elem, prop) {
				// Do not check if an object has been added twice because it can happen for some reasons
				externalDependencies.push([prop, elem]);
			}
			var _addExternalLibDependency = function(elem, prop) {
				// Do not check if an object has been added twice because it can happen for some reasons
				externalLibDependencies.push([prop, elem]);
			}
			
			var _executeCallback = function () {
				switch(typeof callback) {
					case "function":
						/* console */ tlhconsole.log(console_prefix+" Callback is a function", 3);
						callback();
						break;
					case "string":
						if(callback === null) { 
							/* console */ tlhconsole.log(console_prefix+" Callback is null. Not executing anything", 3);
						} else if (callback.indexOf("()") > -1) {
							/* console */ tlhconsole.log(console_prefix+" Callback is a string with curls", 3);
							/* console */ tlhconsole.log(callback);
							eval(callback);
						} else {
							/* console */ tlhconsole.log(console_prefix+" Callback is a string without curls -> adding", 3);
							eval(callback + "()");
						}
						break;
					default:
						return false;
						break;
				}
				/* console */ tlhconsole.log(console_prefix+" Callback Executed", 1);
				return true;
			}
			
			var _loopLibLights = function () {
				/* console */ tlhconsole.log(console_prefix+" _loopLibLights START", 3);
				for (var a in liblights) {
					// check if current light is an object that has been destroyed, if it returns null or undefined or empty                                
					var loopRes = _loopSingleLight(liblights[a]);                                    
					/* console */ tlhconsole.log(console_prefix+" _loopLibLights "+a+" -> typeof expected: "+typeof(liblights[a])+" - completed: "+loopRes, 2, liblights[a]);
					if (loopRes === false) {
						return false;
					}
				}
				/* console */ tlhconsole.log(console_prefix+" _loopLibLights END - COMPLETED - going to load Library "+libraryToLoad, 3);
				return true;
			}
			
			var _loopLights = function () {
				/* console */ tlhconsole.log(console_prefix+" _loopLights START", 3);
				for (var a in lights) {
					// check if current light is an object that has been destroyed, if it returns null or undefined or empty                                
					// tlhconsole.log(console_prefix+" LOOPING light "+a);
					var loopRes = _loopSingleLight(lights[a]);                               
					/* console */ tlhconsole.log(console_prefix+" _loopLights "+a+" -> typeof expected: "+typeof(lights[a])+" - completed: "+loopRes, 2, lights[a]);
					if (loopRes === false) {
						return false;
					}
				}
				/* console */ tlhconsole.log(console_prefix+" _loopLights END", 3);
				return true;
			}
			var _loopSingleLight = function(l) {
				var loopRes = "";
				/* console */ tlhconsole.log(console_prefix+" _loopSingleLight  typeof expected: "+typeof(l), 4);
				switch(typeof l) {
					case "boolean":
						/* console */ tlhconsole.log(console_prefix+" _loopSingleLight BOOLEAN", 4, l.toString());
						return l;
					case "string":
						/* console */ tlhconsole.log(console_prefix+" _loopSingleLight STRING", 4, "downloading|false");
						var retval = "";
						if(l === "downloading")  {retval =  "downloading"; } else { retval =  false; }						
						return retval;
					case "object":
						/* console */ tlhconsole.log(console_prefix+" _loopSingleLight OBJECT", 4, l.hasCompleted());
						return l.hasCompleted();
					case "function":
						/* console */ tlhconsole.log(console_prefix+" _loopSingleLight FUNCTION", 4, l());
						return l();
					default:
						/* console */ tlhconsole.log(console_prefix+" _loopSingleLight DEFAULT", 4, "true");
						return true;
				}
				
			}
			var _greenifyExternalDependencies = function() {
				// Check if this object is in other traffic lights
				for(var z = 0; z < externalDependencies.length; z++) {
					// Call Green Light Method for that object on that property
					/* console */ tlhconsole.log(console_prefix+" Greenifying external dependency in "+externalDependencies[z][1].getName()+" tlh object - property : "+externalDependencies[z][0], 2);
					externalDependencies[z][1].setGreenLight(externalDependencies[z][0], true, true);
				}
				for(var z = 0; z < externalLibDependencies.length; z++) {
					// Call Green Light Method for that object on that property
					/* console */ tlhconsole.log(console_prefix+" Greenifying lib external dependency in "+externalLibDependencies[z][1].getName()+" tlh object - property : "+externalLibDependencies[z][0], 2);
					externalLibDependencies[z][1].setLibGreenLight(externalLibDependencies[z][0], true, true);
				}
			}
			
			
			// ################################### START CONSTRUCTOR ###################################
			 
			// CHECKING AND SETTING NAME
			if (_name === "" || _name === null || _name === undefined || typeof _name !== "string") {
				error(1);
			} else {
				name = _name;
			}
			console_prefix = "";
			zconsole_prefix = "[ tlh _ " + name + " ]";
			// CHECKING AND SETTING CALLBACK
			if(_configObject.cb === null) {
				callback = null;
			} else if (typeof _configObject.cb === "function" || ( typeof _configObject.cb === "string" && _configObject.cb !== "")) {
				callback = _configObject.cb;
			} else {
				/* console */ return error(7);
			}
			if(_configObject.libUrl != "" && _configObject.libUrl != undefined) {            
				lights['library'] = false;
				libraryToLoad = _configObject.libUrl;
			}
			if(typeof _configObject.libCbSuccess === "function") {
				libraryLoadSuccess = _configObject.libCbSuccess;
			}
			if(typeof _configObject.libCbError === "function") {
				libraryLoadError = _configObject.libCbError;
			}
			if(typeof _configObject.async === "boolean") {
				continueOnFailure = _configObject.async;
			}        
			// ##################################### END CONSTRUCTOR ####################################
			
			return {
			// PUBLIC OBJECT
				getName: function () { return name; },
				getObject: function () {
					try {
						/* console */ tlhconsole.log(console_prefix + "Library Lights", 1, liblights);
						/* console */ tlhconsole.log(console_prefix + "Lights", 1, lights);
					} catch(e) {
						
					}
				},
				getLibBlockers: function () {
					
				},
				
				getBlockers: function (mode) {
					if(!mode || mode == "library") {
						/* console */ tlhconsole.log(console_prefix + " ########  LIB BLOCKERS START ######### ", 1);
						var libblockers = [];
						for (var a in liblights) {
							switch(typeof liblights[a]) {
								case "boolean":
									if(liblights[a] === false) { libblockers.push(a+" - RED"); }
									break;
								case "object":
									if(liblights[a].getStatus() === false) { libblockers.push(a + " [this element is a tlh] NOT COMPLETED"); }
									break;
								case "function":
									try {
										if(liblights[a]() === false) { libblockers.push(a + " [this element is a function condition] NOT COMPLETED"); }
									} catch(e) {
										libblockers.push(a + " [this element is a function condition] CONDITION VERIFY RETURNED ERROR");
										}
									break;
								default:
									break;
							}                    
						}
						if ((libblockers.length > 0)) {                    
							/* console */ tlhconsole.log(libblockers, 1);
						} else {
							/* console */ tlhconsole.log(console_prefix + " No library blocker active", 1);
						}
						/* console */ tlhconsole.log(console_prefix + " ########  LIB BLOCKERS END ######### ", 1);
					}
					if(!mode || mode == "tlh") {
						/* console */ tlhconsole.log(console_prefix + " ########  BLOCKERS START ######### ", 1);
						var blockers = [];
						for (var a in lights) {
							switch(typeof lights[a]) {
								case "boolean":
									if(lights[a] === false) { blockers.push(a+" - RED"); }
									break;
								case "object":
									if(lights[a].getStatus() === false) { blockers.push(a + " [tlh] NOT COMPLETED"); }
									break;
								case "function":
									try {
										if(lights[a]() === false) { blockers.push(a + " [this element is a function condition] NOT COMPLETED"); }
									} catch(e) {
										blockers.push(a + " [this element is a function condition] CONDITION VERIFY RETURNED ERROR -  NOT COMPLETED");
									}
									break;
								default:
									break;
							}                    
						}
						
						if ((blockers.length > 0)) {                    
							/* console */ tlhconsole.log(blockers, 1);
						} else {
							/* console */ tlhconsole.log(console_prefix + " No blocker active", 1);
						}
						/* console */ tlhconsole.log(console_prefix + " ########  BLOCKERS END ######### ", 1);
					}
				},
				execute: function() {
					this.getStatus(true, true);
				},				
				hasCompleted: function () {
					return complete;
				},
				getStatus: function (doCallback) {
					if(complete === true) { 
						/* console */ tlhconsole.log(console_prefix+" Status COMPLETED - GREEN - SHORT RESPONSE", 1);
						return true;
					}
					/* console */ tlhconsole.log(console_prefix+" Getting TLH status....has library property..."+lights.hasOwnProperty("library"), 3);
					if(lights.hasOwnProperty("library") === true) {
						if(_loopSingleLight(lights['library']) !== true && _loopSingleLight(lights['library']) !== "downloading") {
							var liblightsLooped = _loopLibLights();
							if (liblightsLooped === true) {
								if (doCallback === true) {
									internalReference = this;
									if(typeof(libraryToLoad) === "function") {
										_executeLibraryFn();
									} else if(typeof(libraryToLoad) === "string") {
										if(libraryToLoad.indexOf(".js") > 0) { 
											_loadLibrary();
										} else if(libraryToLoad.indexOf(".css") > 0) {
											_loadCssLibrary();
										} else {
											_loadLibrary();
										}
									}
									return false;
								} else {
									/* console */ tlhconsole.log(console_prefix+" Library Status COMPLETED - GREEN", 1);
								}
							} else if (lightsLooped === false) {
								/* console */ tlhconsole.log(console_prefix+" Library Status NOT COMPLETED - RED", 1);
								if (doCallback === true) {
									return false;
								}
							}
						} else if(_loopSingleLight(lights['library']) === "downloading") {
							/* console */ tlhconsole.log(console_prefix+" Library Downloading - Status NOT COMPLETED - RED", 1);
							/* if (doCallback === true) {
								return;
							} */
							return false;
						}
						
					} 
					
					
					var lightsLooped = _loopLights();
					if (lightsLooped === true) {
						if (doCallback === true) {
							/* console */ tlhconsole.log(console_prefix+" Status COMPLETED - YELLOW", 1);
							complete = true;
							/* console */ tlhconsole.log(console_prefix+" Executing Callback", 1);
							_executeCallback();
							/* console */ tlhconsole.log(console_prefix+" Status COMPLETED AND EXECUTED - GREEN", 1);
							/* console */ tlhconsole.log(console_prefix+" Checking if this object is in other tlhs and informing them this is green", 1);
							_greenifyExternalDependencies();
						} else {
							if(complete === false) {
								/* console */ tlhconsole.log(console_prefix+" Status COMPLETED but not EXECUTED - YELLOW", 1);
							} 
						}
						return true;
					} else if (lightsLooped === false) {
						/* console */ tlhconsole.log(console_prefix+" Status NOT COMPLETED - RED", 1);
						return false;
					}
				},
				
				addRedLight: function (_light, _status) {
					if(_light === "library") {
						return error(9);
					}
					if (lights.hasOwnProperty(_light)) { 
						return error(5);
					}
					if (liblights.hasOwnProperty(_light)) { 
						return error(5);
					}
					if(_status === undefined) {
						_status = false;
					}
					var status;                
					switch(typeof _status) {
						case "object":
							try {
								if(_status.hasOwnProperty("addExternalDependency") === true) {
									status = _status;                                
									var added = status.addExternalDependency(this, _light);
									if(added !== true) {
										return error(added);
									}
								} else {
									return error(3);
								}
							} catch(e) {
								return error(3);
							}
							break;
						
						case "boolean":
							status = false;
							break;
							
						case "function":
							// TO VERIFY
							status = _status;
							// #########
							break;
							
						default:
							return error(4);
							break;
					}                
					lights[_light] = status;
					/* console */ tlhconsole.log(console_prefix+" Adding "+_light+" as RED LIGHT", 1);
					return true;
				},
				
				addLibRedLight: function (_light, _status) {
					if(_light === "library") {
						return error(9);
					}
					if (lights.hasOwnProperty(_light)) { 
						return error(5);
					}
					if (liblights.hasOwnProperty(_light)) { 
						return error(5);
					}
					if(_status === undefined) {
						_status = false;
					}
					var status;                
					switch(typeof _status) {
						case "object":
							try {
								if(_status.hasOwnProperty("addExternalLibDependency") === true) {
									status = _status;                                
									var added = status.addExternalLibDependency(this, _light);
									if(added !== true) {
										return error(added);
									}
								} else {
									return error(3);
								}
							} catch(e) {
								return error(3);
							}
							break;
						
						case "boolean":
							status = false;
							break;
							
						case "function":
							// TO VERIFY
							status = _status;
							// #########
							break;
							
						default:
							return error(4);
							break;
					}                
					liblights[_light] = status;
					/* console */ tlhconsole.log(console_prefix+" Adding "+_light+" as LIBRARY RED LIGHT", 1);
					return true;
				},
				
				
				setLibGreenLight: function (_light, _checkStatus, _doCallback) {
					if (!liblights.hasOwnProperty(_light)) {
						return error(2);
					}
					switch(typeof liblights[_light]) {
						case "object":
							// Do nothing because the only need is to check the object
							break;                    
						case "boolean":
							liblights[_light] = true;
							break;
						case "function":
							// TO VERIFY
							// #########
							break;
						default:
							return error(6);
							break;
					}
					/* console */ tlhconsole.log(console_prefix+" Set green light for property "+_light, 1);
					if (_checkStatus === true) {
						/* console */ tlhconsole.log(console_prefix+" Checking status after greenifying "+_light, 2);
						this.getStatus(_doCallback);
					}
					return true;
					
				},
				
				setGreenLight: function (_light, _checkStatus, _doCallback) {
					if (!lights.hasOwnProperty(_light)) {
						return error(2);
					}
					switch(typeof lights[_light]) {
						case "object":
							// Do nothing because the only need is to check the object
							break;                    
						case "boolean":
							lights[_light] = true;
							break;
						case "function":
							// TO VERIFY
							// #########
							break;
						default:
							return error(6);
							break;
					}
					/* console */ tlhconsole.log(console_prefix+" Set green light for property "+_light, 1);
					if (_checkStatus === true) {
						/* console */ tlhconsole.log(console_prefix+" Checking status after greenifying "+_light, 2);
						this.getStatus(_doCallback);
					}
					return true;
					
				},
				
				removeLight: function (_light) {
					/* console */ tlhconsole.log(console_prefix+" Removing light "+_light, 3);
					if (lights.hasOwnProperty(_light)) {
						lights[_light] = undefined;
						delete lights[_light];
						return true;
					} else {
						return error(2);
					}
				},
				removeLibLight: function (_light) {
					/* console */ tlhconsole.log(console_prefix+" Removing liblight "+_light, 3);
					if (liblights.hasOwnProperty(_light)) {
						liblights[_light] = undefined;
						delete liblights[_light];
						return true;
					} else {
						return error(2);
					}
				},
				
				addExternalLibDependency: function(obj, tlh_property_added) {
					// Do not try to add itself to itself
					if(obj === this) { 
						return (8);                    
					}
					// Do not add empty properties
					if(tlh_property_added === "") { 
						return (9);                    
					}
					_addExternalLibDependency(obj, tlh_property_added);
					return true;
				},
				addExternalDependency: function(obj, tlh_property_added) {
					// Do not try to add itself to itself
					if(obj === this) { 
						return (8);                    
					}
					// Do not add empty properties
					if(tlh_property_added === "") { 
						return (9);                    
					}
					_addExternalDependency(obj, tlh_property_added);
					return true;
				},
				skipLibrary: function(checkStatus) {
					/* console */ tlhconsole.log(console_prefix+" Skipping library download", 1);
					delete lights['library'];
					//lights['library'] = true;
					liblights = {};
					libraryToLoad = "";
					libraryLoadSuccess = function() {};
					libraryLoadError = function() {};
					/* console */ tlhconsole.log(console_prefix+" Must check status before ending library skip? -> "+checkStatus, 3);
					if(checkStatus === true) {
						/* console */ tlhconsole.log(console_prefix+" Checking status", 1);
						this.getStatus(true);
					}
				}
			}
		}
	})();