// ==UserScript==
// @name         Sound for Stock Room
// @namespace    stockroom-kiosk
// @version      0.7
// @description  Play Sound for Jaggaer Stock Room web interface
// @author       EPFL Durrer Laurent
// @match        https://erm-dev.epfl.ch/stockroom-kiosk/app/*
// @match        https://erm-test.epfl.ch/stockroom-kiosk/app/*
// @match        https://catalyse-erm.epfl.ch/stockroom-kiosk/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL  https://raw.githubusercontent.com/epfl-si/TamperMonkey_Jaggaer_Kiosk/master/Sound_for_stock_Room.js
// @grant        none
// ==/UserScript==

'use strict';
$( document ).ready( async () => {

    console.log( `UserScript "Sound for Stock Room" loaded...` );

    // hide cancel button
    $( '#footer' ).hide();

    // analyse when "enter" action
    $( document ).keypress(
        ( event ) => {
            if ( event.which == '13') {
                // when modify quantity focus to article scan
                if ( ( document.activeElement ).id == 'quantity' ) {
                    document.getElementById( 'bc' ).focus();
                    event.preventDefault();
                    return;
                }
                // prevent checkout without article scan
                if ( document.activeElement.id == 'bc' && document.getElementById( 'bc' ).value == '' ) {
                    event.preventDefault();
                }
            }
        });

    // if scan start with $$ (=çç) modif quantity
    $( document ).on( 'keyup', 'input', function (e) {
        if ( $(this).val().startsWith( 'çç' ) ) {
            this.value = '';
            document.getElementById( 'quantity' ).value = '';
            document.getElementById( 'quantity' ).focus();
            return;
        }
    });

    // permit to use two jquery, remove conflict if you have on the html site and
    // an other used on Tampermonkey script
    $.noConflict(true)( ($) => {

        // Song player function
        function songPlayer( songUrl ) {
            var playerPage = document.createElement( 'audio' );
            playerPage.src = songUrl;
            playerPage.preload = 'auto';
            return playerPage.play();
        }

        // Auto start-over after 10 seconds on page checkout
        $( document ).ready( function() {
            if ( window.location.href.indexOf( 'checkout/showreceipt' ) > -1 ) {
                setTimeout(
                    function () {
                        window.location.href = '/stockroom-kiosk/app/secure/kiosk/?clr=true';
                    }, 10000
                );
            }
        });

        // Run this function after an ajax is complete
        window.$( document ).ajaxComplete( ( event, request, settings ) => {

            let requestContent;
            // Intercept "ajaxComplete" requests to play sounds
            switch ( settings.url ) {

                // Called at the /stockroom-kiosk/app/secure/kiosk/, "login" process
                case '/stockroom-kiosk/app/secure/kiosk/validate/barcode' :
                    requestContent = JSON.parse( request.responseText ).status
                    if ( requestContent === -2 ) {
                        songPlayer( 'https://raw.githubusercontent.com/epfl-si/TamperMonkey_Jaggaer_Kiosk/master/assets/employee_bar_code_not_recognized.ogg' );
                        console.log( `  ↳ Employee barcode not recognized` );
                    }
                    break;

                // Called at the /stockroom-kiosk/app/secure/scan/, "scanning" process
                case '/stockroom-kiosk/app/secure/scan/barcode' :
                    requestContent = request.responseText.includes( 'id="notrecognizedbystockroom"' )
                    if ( requestContent ) {
                        songPlayer( 'https://raw.githubusercontent.com/epfl-si/TamperMonkey_Jaggaer_Kiosk/master/assets/Item_not_recognized_by_stockroom.ogg' );
                        console.log( `  ↳ Item not recognized by stockroom` );
                    }
                    break;

                default:
                    // Nothing to do with this URL... console.debug(settings.url)
                    break;
            }

            // TODO: how to get there?
            // Test value and execute sound
            var containeralreadyscanned = ( $( 'div#containeralreadyscanned' ).length );
            if ( containeralreadyscanned == 1 ) {
                songPlayer( 'https://raw.githubusercontent.com/epfl-si/TamperMonkey_Jaggaer_Kiosk/master/assets/Container_has_been_scanned_already.ogg' );
                console.log( `  ↳ Container has been scanned already` );
            }

        });
    });
});
