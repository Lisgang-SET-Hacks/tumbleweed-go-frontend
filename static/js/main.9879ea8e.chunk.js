(this["webpackJsonptumbleweed-go-frontend"]=this["webpackJsonptumbleweed-go-frontend"]||[]).push([[0],{133:function(e,t,a){e.exports=a(163)},138:function(e,t,a){},162:function(e,t,a){},163:function(e,t,a){"use strict";a.r(t);var n=a(1),o=a.n(n),l=a(75),r=a.n(l),i=(a(138),a(61)),c=a(62),s=a(66),u=a(64),d=a(106),p=a.n(d),m=a(180),f=a(184),w=a(112),b=a(177),h=a(188),g=a(181),v=a(113),y=a(6),L=a(107),_=a(187),E=a(182),T=a(186),I=a(185),D=a(183),S=a(94),x=a(96),k=a(93),O=a(74),P=function(e){var t=e.toDateString().split(" ");return t[0]+" "+t[2]},R=function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:5,n=e<0?"S":"N",o=t<0?"W":"E";return"".concat(e.toFixed(a),"&#xb0;").concat(n,", ").concat(t.toFixed(a),"&#xb0;").concat(o)},j=(a(156),function(e){Object(s.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).initWithData=function(e){for(var t=[],a=0;a<n.props.sliderRange;a++){var o=n.setTumbleweedLayer(e,a-1);t.push(o)}n.setState({tumbleweedLayers:t,currentTumbleweedLayer:t[0]},(function(){n.initMap()}))},n.setTumbleweedLayer=function(e,t){var a=new S.b({image:new x.a({radius:8,fill:new k.a({color:"#e3af2b"}),stroke:new O.a({color:"#664e13",width:2})})}),n=new S.b({image:new x.a({radius:8,fill:new k.a({color:"#e2cf9e"}),stroke:new O.a({color:"#664e13",width:2})})}),o=new S.b({stroke:new O.a({color:"#664e13",width:4})}),l=e.map((function(e,o){var l,r,i,c=a;if(-1===t)i="tumbleweed_".concat(o),r=e.location._lat,l=e.location._long;else if(0===e.predictedLocations.length)i="tumbleweed_".concat(o),r=e.location._lat,l=e.location._long,c=n;else if(t<e.predictedLocations.length)i="tumbleweed_".concat(o,"_").concat(t),r=e.predictedLocations[t]._lat,l=e.predictedLocations[t]._long;else{var s=e.predictedLocations.length-1;i="tumbleweed_".concat(o,"_").concat(s),r=e.predictedLocations[s]._lat,l=e.predictedLocations[s]._long,c=n}var u=new b.a({geometry:new L.a(Object(y.d)([l,r]))});return u.setId(i),u.setStyle(c),u}));if(-1!==t)for(var r=function(t){e.forEach((function(e){if(t<e.predictedLocations.length){var a=0===t?e.location._lat:e.predictedLocations[t-1]._lat,n=0===t?e.location._long:e.predictedLocations[t-1]._long,r=e.predictedLocations[t]._lat,i=e.predictedLocations[t]._long,c=new b.a({geometry:new _.a([Object(y.d)([n,a]),Object(y.d)([i,r])])});c.setStyle(o),l.push(c)}}))},i=0;i<=t;i++)r(i);return new E.a({source:new I.a({features:l})})},n.initMap=function(){var e=new T.a({className:"map__bingMaps",source:new D.a({key:"AtMr0RAC0iKdKPPPsGSPqIFCxjk7XpR9rq99IQR5vDBoax8u1KuYvOinwtsiQcFI",imagerySet:"AerialWithLabelsOnDemand"})}),t=new h.a({element:n.popupRef.current,positioning:"bottom-center",stopEvent:!1,offset:[0,-16]});n.map=new g.a({layers:[e,n.state.currentTumbleweedLayer],overlays:[t],target:n.mapRef.current,view:new v.a({center:Object(y.d)([-97,42]),zoom:5,minZoom:5,maxZoom:15})}),n.map.on("click",(function(e){var a=n.map.getFeaturesAtPixel(e.pixel)[0];a?(n.selectTumbleweed(a),n.showPopup(a,t)):(n.deselectTumbleweed(),n.hidePopup())})),n.map.on("pointermove",(function(e){var t=n.map.getFeaturesAtPixel(e.pixel)[0];n.map.getTarget().style.cursor=t?"pointer":""}))},n.selectTumbleweed=function(e){var t=String(e.getId()).split("_").splice(1),a=Object(w.a)(t,2),o=a[0],l=a[1];void 0!==l?n.props.updateInfoPanelFunc(o,l):n.props.updateInfoPanelFunc(o,-1)},n.deselectTumbleweed=function(){n.props.updateInfoPanelFunc(-1,-1)},n.showPopup=function(e,t){var a=e.getGeometry().getCoordinates(),o=Object(y.n)(a,"EPSG:3857","EPSG:4326");n.popupRef.current.innerHTML=R(o[1],o[0],3),n.popupRef.current.style.display="block",t.setPosition(a)},n.hidePopup=function(){n.popupRef.current.style.display="none"},n.showTumbleweedLayer=function(e){n.map.removeLayer(n.state.currentTumbleweedLayer),n.map.addLayer(n.state.tumbleweedLayers[e]),n.setState({currentTumbleweedLayer:n.state.tumbleweedLayers[e]})},n.state={tumbleweedLayers:[],currentTumbleweedLayer:null},n.map=null,n.mapRef=o.a.createRef(),n.popupRef=o.a.createRef(),n}return Object(c.a)(a,[{key:"componentDidUpdate",value:function(e,t){e.data!==this.props.data&&this.initWithData(this.props.data),e.day!==this.props.day&&this.showTumbleweedLayer(this.props.day)}},{key:"render",value:function(){return o.a.createElement("div",{ref:this.mapRef,className:"map"},o.a.createElement("div",{ref:this.popupRef,className:"map__popup",style:{display:"none"}}))}}]),a}(o.a.Component)),M=a(178),F=function(e){Object(s.a)(a,e);var t=Object(u.a)(a);function a(){var e;Object(i.a)(this,a);for(var n=arguments.length,l=new Array(n),r=0;r<n;r++)l[r]=arguments[r];return(e=t.call.apply(t,[this].concat(l))).renderInfo=function(){var t=e.props,a=t.data,n=t.predictionIndex;if(!a)return o.a.createElement("p",null,"No tumbleweed selected.");var l=a.location;if(a.predictedLocations.length>0&&-1!==n){var r=Math.min(n,a.predictedLocations.length-1);l=a.predictedLocations[r]}return o.a.createElement(o.a.Fragment,null,o.a.createElement("h4",null,"Current position (est.)"),o.a.createElement("p",{dangerouslySetInnerHTML:{__html:R(l._lat,l._long)}}),o.a.createElement(M.a,null),o.a.createElement("h4",null,"Initial sighting time"),o.a.createElement("p",null,new Date(a.uploadTime).toLocaleDateString(),o.a.createElement("br",null),new Date(a.uploadTime).toLocaleTimeString()),o.a.createElement("h4",null,"Initial sighting position"),o.a.createElement("p",{dangerouslySetInnerHTML:{__html:R(a.uploadLocation._lat,a.uploadLocation._long)}}),o.a.createElement("h4",null,"Initial sighting image"),o.a.createElement("div",{className:"aspect-ratio",style:{paddingBottom:"75%"}},o.a.createElement("div",null,o.a.createElement("img",{src:"https://picsum.photos/400",alt:"Initial sighting"}))))},e}return Object(c.a)(a,[{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement("h2",null,"Tumbleweed Info"),o.a.createElement(M.a,null),this.renderInfo())}}]),a}(o.a.Component),N=(a(162),function(e){Object(s.a)(a,e);var t=Object(u.a)(a);function a(){var e;Object(i.a)(this,a);for(var n=arguments.length,l=new Array(n),r=0;r<n;r++)l[r]=arguments[r];return(e=t.call.apply(t,[this].concat(l))).state={day:0,sliderMarks:[],sliderRange:8,tumbleweedData:[],selectedTumbleweedData:{tumbleweedIndex:-1,predictionIndex:-1}},e.getData=function(e){p.a.get("https://tumbleweed-go-284013.ue.r.appspot.com/tumbleweed/get").then((function(t){t.status&&200===t.status?e(t.data.result):console.log("rip "+t.status)})).catch((function(e){console.log("big rip "+e)}))},e.getSelectedTumbleweedData=function(){var t=e.state.selectedTumbleweedData.tumbleweedIndex;return-1===t?null:e.state.tumbleweedData[t]},e.onTimelineChange=function(t,a){e.setState({day:a}),e.updateInfoPanel(e.state.selectedTumbleweedData.tumbleweedIndex,a-1)},e.setSliderMarks=function(){for(var t=[{value:0,label:o.a.createElement("b",null,"Today")},{value:1,label:"Tomorrow"}],a=2;a<e.state.sliderRange;a++){var n=new Date(Date.now()+864e5*a);t.push({value:a,label:P(n)})}e.setState({sliderMarks:t})},e.updateInfoPanel=function(t,a){e.setState({selectedTumbleweedData:{tumbleweedIndex:t,predictionIndex:a}})},e}return Object(c.a)(a,[{key:"componentDidMount",value:function(){var e=this;this.setSliderMarks(),this.getData((function(t){e.setState({tumbleweedData:t})}))}},{key:"render",value:function(){return o.a.createElement("div",{className:"container"},o.a.createElement("div",{className:"map__wrapper"},o.a.createElement(j,{data:this.state.tumbleweedData,day:this.state.day,sliderRange:this.state.sliderRange,updateInfoPanelFunc:this.updateInfoPanel})),o.a.createElement(m.a,{className:"info"},o.a.createElement(F,{data:this.getSelectedTumbleweedData(),predictionIndex:this.state.selectedTumbleweedData.predictionIndex})),o.a.createElement("div",{className:"timeline"},o.a.createElement("h4",{style:{marginTop:0}},"Movement predictions (USA only)"),o.a.createElement(f.a,{className:"timeline__slider",onChange:this.onTimelineChange,min:0,max:this.state.sliderRange-1,marks:this.state.sliderMarks})))}}]),a}(o.a.Component));r.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(N,null)),document.getElementById("root"))}},[[133,1,2]]]);
//# sourceMappingURL=main.9879ea8e.chunk.js.map