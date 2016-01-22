/**
 * favella.js
 *
 * Copyright (c) 2015 Alberto Pagliarini
 * Licensed under the MIT license
 * https://github.com/batopa/favella/blob/master/LICENSE
 */

if ('speechSynthesis' in window) {

    (function(window) {

        'use strict';

        /**
         * Save original console error function
         * @type {Object} console.error function
         */
        var consoleError = window.console.error;

        /**
         * Parental control
         * If it's true avoid to use curses
         * @type {boolean}
         */
        var parentalControl = false;

        /**
         * An list of curses to append to console.error() message
         * @type {Array}
         */
        var curses = [];

        /**
         * Speak options
         * @type {Object}
         */
        var speakOptions = {
            voice: null,
            voiceURI: 'native',
            volume: 1,
            rate: 1,
            pitch: 0,
            lang: 'en-US',
            onstart: function(e) {},
            onend: function(e) {},
            onerror: function(e) {},
            onpause: function(e) {},
            onboundary: function(e) {},
            onmark: function(e) {},
        };

        /**
         * true to make Favella speaks
         * @type {boolean}
         */
        var enabled = true;

        /**
         * true to mute console.error()
         * Favella.speak() will continue to work
         *
         * @type {Boolean}
         */
        var muteConsole = false;

        /**
         * List of SpeechSynthesisVoice available
         * @type {Array}
         */
        var voices = [];

        var Favella = {

            /**
             * Setup speak options
             * @return {void}
             */
            setup: function(options) {
                if (options) {
                    if (options.parentalControl) {
                        parentalControl = options.parentalControl;
                    }
                    if (options.curses) {
                        curses = options.curses;
                    }
                    if (options.mute) {
                        if (options.mute === true || options.mute == 'console') {
                            this.mute(options.mute);
                        }
                    }
                    if (options.speakOptions) {
                        Object.keys(speakOptions)
                            .forEach(function(item) {
                                if (options.speakOptions[item]) {
                                    speakOptions[item] = options.speakOptions[item];
                                }
                            });
                    }
                }
            },

            /**
             * Mute all or just console.error()
             *
             * @param {String} what if it is 'console' then just silence the console.error()
             * @return {void}
             */
            mute: function(what) {
                if (what && what == 'console') {
                    muteConsole = true;
                    console.log('console.error muted');
                } else {
                    enabled = false;
                    console.log('Ho perso la favella (I lost the power of speech)!');
                }
            },

            /**
             * Unmute what is silenced
             *
             * @return {void}
             */
            unmute: function() {
                // only for console.log() message
                if (!enabled) {
                    console.log('Ho riacquistato la favella (I recover the power of speech)!');
                } else if (muteConsole) {
                    console.log('console.error unmuted');
                }
                enabled = true;
                muteConsole = false;
            },

            /**
             * Is Favella mute?
             *
             * @param {String} what
             * @return {boolean}
             */
            isMute: function(what) {
                return (what && what == 'console') ? muteConsole : !enabled;
            },

            /**
             * Return the speechSynthesisVoices corresponding to lang
             * If no lang corresponding exists return 'en-US'
             *
             * @param {String} lang the language as it-IT, en-US,...
             * @return {Object} speechSynthesisVoices
             */
            getVoice: function(lang) {
                var voice = null;
                var voices = this.getVoices();
                if (voices.length) {
                    voices.forEach(function(v) {
                        if (v.lang == lang) {
                            voice = v;
                        }
                    });
                    if (!voice) {
                        console.log('Sorry, ' + lang + ' is not supported. Fallback to en-US.');
                        voice = this.getVoice('en-US');
                    }
                }
                return voice;
            },

            /**
             * Speak the message.
             * Eventually append a curse :)
             *
             * @param {String} message the text to speak
             * @param {Object} options params to configure the speaker.
             *                         see speakOptions for all options
             * @return {void}
             */
            speak: function(message, options) {
                if (!enabled) {
                    return false;
                }
                if (!message || typeof message != 'string') {
                    message = 'Something goes wrong';
                }

                options = options || {};
                Object.keys(speakOptions)
                    .forEach(function(item) {
                        if (!options[item]) {
                            options[item] = speakOptions[item];
                        }
                    });
                var msg = new SpeechSynthesisUtterance();
                var voices = this.getVoices();
                msg.voice = this.getVoice(options.lang);
                console.log('Voice selected: ' + msg.voice.name);
                msg.voiceURI = msg.voice.voiceURI;
                msg.volume = options.volume; // 0 to 1
                msg.rate = options.rate; // 0.1 to 10
                msg.pitch = options.pitch; //0 to 2
                msg.lang = msg.voice.lang;
                msg.text = message;

                // add events
                ['onstart', 'onend', 'onerror', 'onboundary', 'onmark']
                    .forEach(function(name) {
                        if (options[name] && typeof options[name] == 'function') {
                            msg[name] = options[name];
                        }
                    });

                window.speechSynthesis.speak(msg);
            },

            /**
             * Wrap speechSynthesis.getVoices() and save it in private voices var
             * Return a list of SpeechSynthesisVoice available
             *
             * @param {boolean} force if you want to force to get voices from speechsynthesis
             * @return {void}
             */
            getVoices: function(force) {
                if (!voices.length || force) {
                    voices = window.speechSynthesis.getVoices();
                }
                return voices;
            },

            /**
             * Wrap speechSynthesis.pause()
             * Pause any utterances that are being spoken
             *
             * @return {void}
             */
            pause: function() {
                window.speechSynthesis.pause();
            },

            /**
             * Wrap speechSynthesis.resume()
             * Resume an utterances that was previously paused
             *
             * @return {void}
             */
            resume: function() {
                window.speechSynthesis.resume();
            },

            /**
             * Wrap speechSynthesis.cancel()
             * Stop speaking and remove all utterances from the queue
             *
             * @return {void}
             */
            cancel: function() {
                window.speechSynthesis.cancel();
            },

            /**
             * Wrap speechSynthesis.speaking
             * Return true if Favella is speaking
             *
             * @return {boolean}
             */
            isSpeaking: function() {
                return window.speechSynthesis.speaking;
            },

            /**
             * Wrap speechSynthesis.pending
             * Return true if there are utterances in the queue that have not yet started speaking
             *
             * @return {boolean}
             */
            isPending: function() {
                return window.speechSynthesis.pending;
            },

            /**
             * Wrap speechSynthesis.paused
             * Return true if Favella is paused
             *
             * @return {boolean}
             */
            isPaused: function() {
                return window.speechSynthesis.paused;
            },

            /**
             * How do you say "favella"?
             *
             * @param {boolean} fail used to test missing italian voice situation
             * @return {void}
             */
            me: function(fail) {
                var lang = (fail) ? 'en-US' : 'it-IT';
                var voice = this.getVoice(lang);
                if (voice) {
                    var msg = [];
                    if (voice.lang == 'it-IT') {
                        msg.push('favella');
                    } else {
                        msg = [
                            'Sorry, I cannot pronunce properly because missing italian voice. I will try anyway.',
                            'favella.',
                            'Shit!'
                        ];
                    }
                    var that = this;
                    msg.forEach(function(m) {
                        that.speak(m, {
                            volume: 1,
                            rate: 1,
                            pitch: 0,
                            lang: voice.lang
                        });
                    });
                } else {
                    console.log('Missing voice :(');
                }
            }

        };

        // cancel pending speaking
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        // wait on voices to be loaded before fetching list
        window.speechSynthesis.onvoiceschanged = function() {
            Favella.getVoices(true);
        };

        /**
         * Override standard console.error()
         * Before write in console it speaks the error
         * @return {void}
         */
        window.console.error = function() {
            if (!Favella.isMute('console')) {
                var args = Array.prototype.slice.call(arguments);
                var message = args[0];
                if (!parentalControl && curses.length) {
                    message += '. ' +  curses[Math.floor(Math.random() * curses.length)] + '!';
                }
                Favella.speak(message);
            }
            consoleError.apply(window.console, arguments);
        };

        // export Favella module
        if (typeof module !== 'undefined' && module.exports) {
            module.exports = Favella;
        } else {
            window.Favella = Favella;
        }

    })(window);

} else {
    console.log('Sorry, speechSynthesis is not supported on this browser');
}
