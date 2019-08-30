/* Wörter aus Silben:
 * [einsilbig, 2-silbig, 3-silbig, ...]
 * silbenGruppen=[20,40,30,9,1]
 * 
 */

Array.prototype.toString=function(){
	var t="";
	for(var i=0; i<this.length; i++){
		if(i!=0) t+=", ";
		t+=this[i];
	}
	return t;
}

/* normalisiert ein Array. Nimmt ein, das Array besteht nur aus Zahlen und teilt
jede Zahl durch die Summe aller Zahlen, so dass die Summe danach 1 ist.*/
Array.prototype.normalize=function(){
	let sum=0;
	for(let i=0; i<this.length; i++){
		sum+=this[i];
	}
	for(let i=0; i<this.length; i++) this[i]/=sum;
}

/* wie Array.prototype.normalize(), nur für Objects */
function normalizeObject(obj){
	let k=Object.keys(obj);
	let sum=0;
	for(let i=0; i<k.length; i++) sum+=obj[k[i]];
	for(let i=0; i<k.length; i++) obj[k[i]]/=sum;
}

Math.seed=1256;
Math.random=function(){
	Math.seed=(Math.seed*9301+49297)%233280;
	return Math.seed/233280.0;
}

function rand(n){
	if(typeof n==="number") return Math.floor(Math.random()*n);
	return n[Math.floor(Math.random()*n.length)];
}

/* Alle Buchstaben/-kombinationen die verwendet werden können. Dazu jeweils
ihre Erscheinungshäufigkeit. */
let laute={
	'a':42655, //'a':48381, // a-au
	'au':5726,
	'ä':4845, //'ä':5363, // ä-äu
	'äu':518,
	'b':18345,
	'c':13628,  //'c':23212,// c-ch
	'ch':9584, //'ch':19146, // ch-sch
	'd':17539,
	'e':91154, //'e':104462,// e-ei-eu
	'ei':11479,
	'eu':1829,  
	'f':16894,
	'g':28040,
	'h':14801, //'h':33947,// h-ch
	'i':41002, //'i':52481,// i-ei
	'j':896,
	'k':20199,
	'l':38085,
	'm':19863,
	'n':62828,
	'o':25641,
	'ö':2035,
	'p':14847,
	'q':8,//'q':543, // q-qu
	'qu':535,
	'r':60991,
	's':40369,//'s':49931, // s-sch
	'sch':9562,
	't':52291,
	'u':22946, //'u':31554,// u-au-eu-qu-äu
	'ü':4570,
	'v':6771,
	'w':8175,
	'x':1069,
	'y':1891,
	'z':9810
};
//laute.normalize();
normalizeObject(laute);

var STABEN={
	v:"aeiouy".split(""),
//	w:"hlnrjsw".split(""),
	w:"hlrjsw".split(""),
	h:"bdfgknmptz".split(""),
//	h:"bcdfgkmpqtvxz"
	ende:0
};

var staben={
	//v:"aeiouy".split(""),
	v:"a,e,i,o,u,au,eu,ei,ä,ö,ü,y,äu".split(","),
//	vp:"5.577,16.04,9.011,2.312,3.68,4.4543,1.7495,1,".split(","),
//w:"hlnrjsw".split(""),
//	w:"hlrjsw".split(""),
//	h:"bdfgknmptz".split(""),
//h:"bcdfgkmpqtvxz"
	kv:"bcdfghjklmnpqrstvw".split("").concat("sch,qu".split(",")),
	kn:"bcdfghklmnpqrstxz".split("").concat("sch,ch".split(",")),
	w:"hlrjswmn".split(""),
	h:"bcdfgkpqvtzx".split(""),
	ende:0
};

/* Ermittelt zu einem Array aus Lauten, die jeweilige Wahrscheinlichkeit,
** normalisiert diese und gibt sie zurück*/
function genWahrscheinlichkeit(elemente){
	let p=[];
	for(let i=0; i<elemente.length; i++){
		p[i]=laute[elemente[i]];
	}
	p.normalize();
	return p;
}// end #genWahrscheinlichkeit()

function init(){
	staben.v_p=genWahrscheinlichkeit(staben.v);
	staben.kv_p=genWahrscheinlichkeit(staben.v);
	staben.kn_p=genWahrscheinlichkeit(staben.v);
}// end #init()


// [h,hw,w,wh,-]
// 
var startSeed=0;

var silben=[];

function silbenAnzahl(wort){
	var s=0;
	vokal=false;
	for(var i=0; i<wort.length; i++){
		var p=staben.v.indexOf(wort.charAt(i));
		if(p<0 || vokal){
			vokal=false;
			continue;
		}
		vokal=true;
		s++;
	}// end for(i)
	return s;
}

function $(id){
	return document.getElementById(id);
}

function genPermutation(n){
	var p=new Array(n);
	for(var i=0; i<n; i++) p[i]=i;
	for(var i=n-1; i>0; i--){
		var r=Math.floor(Math.random()*n);
		var t=p[i];
		p[i]=p[r];
		p[r]=t;
	}
	return p;
}// end #genPermutation

function mischen(liste){
	var n=liste.length;
	for(var i=n-1; i>0; i--){
		var r=Math.floor(Math.random()*n);
		var t=liste[i];
		liste[i]=liste[r];
		liste[r]=t;
	}
	return liste;
}// end #mischen()

function genSilben(){
	var t;
	// Konsonantenkombinationen erstellen
	// hw
	var hw=[];
	for(var i=0; i<staben.h.length; i++){
		t=staben.h[i];
		for(var j=0; j<staben.w.length; j++){
			hw.push(t+staben.w[j]);
		}
	}
	staben.hw=hw;
	// wh
	var wh=[];
	for(var i=0; i<staben.w.length; i++){
		t=staben.w[i];
		for(var j=0; j<staben.h.length; j++){
			wh.push(t+staben.h[j]);
		}
	}
	staben.wh=wh;
	// Mischen
	mischen(staben.hw);
	mischen(staben.wh);
	mischen(staben.v);
	mischen(staben.w);
	mischen(staben.h);
	// Silben erstellen
	var silbentotal=150;
	var sil=[];
	for(var i=0; i<silbentotal; i++){
		var k=rand(100);

		if(k<75) t=rand(staben.kv);
		else t="";

		t+=rand(staben.v);

		k=rand(100);
		if(k<50) t+=rand(staben.kn);
		sil.push(t);
	}// end for i
	silben=sil;

}// end #genSilben()

function wortsaat(wort){
	var saat=0;
	for(var i=0; i<wort.length; i++) saat+=wort.charCodeAt(i);
	return saat;
}

function uebersetzeWort(wort){
	var silbzahl=silbenAnzahl(wort);
	Math.seed=wortsaat(wort)+startSeed;
var a=[];
a[0]=silbzahl;
	silbzahl+=rand(3)-1;
a[1]=silbzahl;
	if(silbzahl<1) silbzahl=1;
	else if(silbzahl>6) silbzahl=6;
a[2]=silbzahl;
a[3]=Math.seed;
//console.log(a);
	var t="";
	while(silbzahl-->0) t+=rand(silben);
	return t;
}// end #uebersetzeWort

function uebersetze(satz){
//console.log(satz);
	var worte=satz.split(/[ ]/);
	var satz="";
	for(var i=0; i<worte.length; i++){
		if(i!=0) satz+=" ";
		satz+=uebersetzeWort(worte[i]);
	}
	return satz;
}// end uebersetze()


function generiereSprache(){
	// Silben renerieren
	genSilben();

	// Silben anzeigen
	$("silben").innerHTML="Silben:<br/>"+silben;
}// end #generiereSprache()

function demo(){
	generiereSprache();
	//var p=genPermutation(10);
	var t="";
	t=uebersetze("Wer im Glashaus sitzt, sollte nicht mit Steinen werfen");
	$("silben").innerHTML+="<hr>"+t;
	t=uebersetze("Wer im Glashaus sitzt, sollte nicht mit Steinen werfen");
	$("silben").innerHTML+="<hr>"+t;
	t=uebersetze("Lichter vor dem Glashaus werfen Steine");
	$("silben").innerHTML+="<hr>"+t;
	
	//+"<br/>"+silbenAnzahl("Hundehuette");
}

function bnOkClick(){
	var t=$("eingabe").value;
	t=t.replace(/[^a-zA-Z0-9ßäöü ]/g,""); // Nur Worte, keine Interpunktion
	t=uebersetze(t);
	$("ausgabe").innerHTML+="<p>"+t+"</p>";
}

function bnSaatClick(){
	Math.seed=Number.parseInt($("saat").value);
	startSeed=Math.seed;
console.log(Math.seed);
	generiereSprache();
}

function bnZufallClick(){
	Math.seed=rand(100000);
	startSeed=Math.seed;
	$("saat").value=Math.seed;
	generiereSprache();
}

