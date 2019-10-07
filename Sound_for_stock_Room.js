// ==UserScript==
// @name         Sound for Stock Room
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Play Sound for Jaggaer Stock Room web interface
// @author       EPFL Durrer Laurent
// @match        https://erm-test-proj.epfl.ch/stockroom-kiosk/*
// @match        https://erm-test.epfl.ch/stockroom-kiosk/*
// @match        https://catalyse-erm.epfl.ch/stockroom-kiosk/*
// @require      https://code.jquery.com/jquery-3.4.1.js
// @downloadURL  https://github.com/loldu/TamperMonkey_Jaggaer_Kiosk/blob/master/Sound_for_stock_Room.js
// @grant        none
// ==/UserScript==

// permit to use two jquery, remove conflict if you have on the html site and
// an other used on Tampermonkey script
$.noConflict(true)(function($) {
'use strict';

// Test If Tampermonkey work correctly
var html = 'Ceci a été ajouté par Tampermonkey !!!';
console.log($);

//Song player function
function songPlayer(songUrl){
    var playerPage = document.createElement('audio');
    playerPage.src = songUrl;
    playerPage.preload = 'auto';
    return playerPage.play();
}

// Run this function after an ajax is complete
window.$( document ).ajaxComplete(function( event, request, settings ) {
    //debugger;
    //console.log("coucou");

    // Test value and execute sound
    var notrecognizedbystockroom = ($("div#notrecognizedbystockroom").length);
    var containeralreadyscanned = ($("div#containeralreadyscanned").length);


        if (notrecognizedbystockroom == 1){
        songPlayer('http://ermpro02.epfl.ch:9999/Item_not_recognized_by_stockroom.ogg');
        console.log("Item not recognized by stockroom");
        //alert("Item not recognized by stockroom");
        }
        if (containeralreadyscanned == 1){
        songPlayer('http://ermpro02.epfl.ch:9999/Container_has_been_scanned_already.ogg');
        console.log("Container has been scanned already");
        //alert("Container has been scanned already");
        }
});

// Test for debugging
////songPlayer('https://notificationsounds.com/soundfiles/3cf166c6b73f030b4f67eeaeba301103/file-sounds-902-oh-boy.ogg');
////$('#header').append(html);

});
