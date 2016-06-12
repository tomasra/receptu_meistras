//! v.1.2.1, http://ilyabirman.net/projects/emerge/
jQuery&&(!function(t){t(function(){t.expr[":"].uncached=function(a){if(!t(a).is('img[src!=""]'))return!1;var e=new Image;return e.src=a.src,!e.complete};var a=[],e=500,i=!1,r=!1,o=["backgroundImage","borderImage","borderCornerImage","listStyleImage","cursor"],n=/url\(\s*(['"]?)(.*?)\1\s*\)/g,s=0,d=function(t,a,e,i,r){var o="emergeRotate"+ ++s;return'<div style="position: absolute; transition: opacity '+r+'ms ease-out"><div style="position: absolute; left: 50%; top: 50%; margin: -'+t+'px"><svg xmlns="http://www.w3.org/2000/svg" width="'+2*t+'" height="'+2*t+'"viewBox="0 0 24 24" style="-webkit-animation: '+o+" "+i+"ms linear infinite;animation: "+o+" "+i+'ms linear infinite"><path fill="'+a+'" d="M17.25 1.5c-.14-.06-.28-.11-.44-.11-.55 0-1 .45-1 1 0 .39.23.72.56.89l-.01.01c3.2 1.6 5.39 4.9 5.39 8.71 0 5.38-4.37 9.75-9.75 9.75S2.25 17.39 2.25 12c0-3.82 2.2-7.11 5.39-8.71v-.02c.33-.16.56-.49.56-.89 0-.55-.45-1-1-1-.16 0-.31.05-.44.11C2.9 3.43.25 7.4.25 12c0 6.49 5.26 11.75 11.75 11.75S23.75 18.49 23.75 12c0-4.6-2.65-8.57-6.5-10.5z"><animateTransform attributeName="transform" type="rotate" from="'+360*e+' 12 12" to="'+360*!e+' 12 12" dur="'+i+'ms" repeatCount="indefinite" /></path></svg></div></div>'};if(window.navigator&&"preview"===window.navigator.loadPurpose)return t(".emerge").css("transition","none"),t(".emerge").css("opacity","1"),!1;var c=function(t){return bodyHeight=Math.min(document.body.clientHeight,document.documentElement.clientHeight),t.offset().top-document.body.scrollTop<bodyHeight},l=function(t,a){var i=t.data("hold"),r=t.data("expose");if(r&&!c(t))return t.data("_waitingForView",!0),!1;if(i&&!t.data("_holding"))return t.data("_holding",!0),setTimeout(function(){l(t,!0)},i),!1;if(t.data("_holding")&&!a)return!1;var o=t.data("_spinner");o&&o.css("opacity",0),t.css("transition","opacity "+e+"ms ease-out"),t.css("opacity","1");var n=t.data("style-2");n&&t.attr("style",t.attr("style")+"; "+n),t.data("_fired",!0),u()},u=function(t){t&&a.push(t);for(var e in a){var i=a[e];if(i.data("_fired"));else{var r,o=!1;if(r=i.data("_waitFor")){for(;;){if(!r.data("_fired")){if(r[0]==i[0]){o=!0;break}if(r=r.data("_waitFor"))continue}break}(i.data("_waitFor").data("_fired")||o)&&l(i)}else l(i)}}},f=function(){for(var t in a){var e=a[t];e.data("_waitingForView")&&c(e)&&(e.data("_waitingForView",!1),l(e))}},p=function(){r||(t(window).on("scroll",f),r=!0)};t(".emerge").each(function(){var a=t(this),r={},s=!1,c=12,l=1333,f="#404040",m=0,g=e,v=0,w=0,h="",y="",b=e,_={};a.$prev=i;var x=function(){a.data("continue")&&a.data("_waitFor",a.$prev),a.data("await")&&a.data("_waitFor",t("#"+a.data("await"))),u(a)},k=function(){w++,w==v&&setTimeout(x,a.data("slow"))};if(a.data("opaque")&&a.css("opacity",1),_=a.data("effect")||!1,b=a.data("duration")||e,expose=a.data("expose"),p(),_){var z={},F=["","-webkit-"],I="transform",H="transform-origin",T=a.data("up")||0,j=a.data("down")||0,C=a.data("left")||0,M=a.data("right")||0,S=a.data("angle")||"90",V=a.data("scale")||-1,B=a.data("origin")||"50% 50%";if(j&&(T="-"+j,"--"==T.substr(0,2)&&(T=T.substr(2))),M&&(C="-"+M,"--"==C.substr(0,2)&&(C=C.substr(2))),"relax"==_&&(-1==V&&(V=.92),"50% 50%"==B&&(B="top"),z={one:"scaleY("+V+")",two:"scaleY(1)",orn:B,crv:"cubic-bezier(0, 0, 0.001, 1)"}),"slide"==_&&(T||(T="20px"),z={one:"translate("+C+","+T+")",two:"translate(0,0)",crv:"cubic-bezier(0, 0.9, 0.1, 1)"}),"zoom"==_&&(-1==V&&(V=.5),z={one:"scale("+V+")",two:"scale(1)",orn:B,crv:"cubic-bezier(0, 0.75, 0.25, 1)"}),"screw"==_&&(-1==V&&(V=.5),S||(S=90),z={one:"scale("+V+") rotate("+S+"deg)",two:"scale(1) rotate(0)",orn:B,crv:"cubic-bezier(0, 0.75, 0.25, 1)"}),z)for(var O=0;O<F.length;++O)h+=F[O]+I+": "+z.one+"; "+F[O]+H+": "+z.orn+"; ",y+=F[O]+I+": "+z.two+"; "+F[O]+"transition: opacity "+b+"ms ease-out, "+F[O]+I+" "+b+"ms "+z.crv+"; ";a.data("style-1",h),a.data("style-2",y)}if(h||(h=a.data("style-1")),h&&a.attr("style",a.attr("style")+"; "+h),a.find("*").addBack().each(function(){var a=t(this);a.is("img:uncached")&&a.attr("src")&&(r[a.attr("src")]=!0);for(var e=0;e<o.length;++e){var i,s=o[e],d=a.css(s),c=-1;if(d&&(c=d.indexOf("url("))>=0)for(;null!==(i=n.exec(d));)r[i[2]]=!0}}),Object.keys(r).length>0&&(s=a.data("spin"))){var Q=a.data("spin-element");if(Q)var Y=t("#"+Q).clone().css({position:"absolute",display:"block"});else{a.data("spin-size")&&(c=a.data("spin-size")/2),a.data("spin-color")&&(f=a.data("spin-color")),a.data("spin-period")&&(l=a.data("spin-period")),a.data("spin-direction")&&(m="clockwise"==a.data("spin-direction")?0:1),g=b;var Y=t(d(c,f,m,l,g))}Y.css({width:"100%",height:Math.min(a.height(),document.body.clientHeight-a.offset().top)}),a.before(Y),a.data("_spinner",Y)}for(var O in r){var $=new Image;$.src=O,v++,$.width>0?k():t($).on("load error",k)}v++,k(),i=a})})}(jQuery),document.write("<style>.emerge { opacity: 0; }</style>"));