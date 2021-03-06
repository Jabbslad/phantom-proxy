/*global  module:false, console:false, require:false*/
(function (module) {
    'use strict';
    module.exports = {

        create:function (server) {
            this.page = require('webpage').create();
            this.bindEvents(server);
            return this;
        },
        setProperty:function (propertyName, propertyValue) {
            var self = this;
            try {
                this.page[propertyName] = JSON.parse(propertyValue);
                this.response.write(this.page[propertyName]);
                this.response.statusCode = 200;
                this.response.close();
            } catch (ex) {
                self.response.statusCode = 500;
                self.response.write(ex.toString());
                self.response.close();
            }
        },
        getProperty:function (propertyName) {
            var self = this;
            try {
                var result = this.page[propertyName];
                this.response.write(JSON.stringify(result));
                this.response.statusCode = 200;
                this.response.close();
            } catch (ex) {
                self.response.statusCode = 500;
                self.response.write(ex.toString());
                self.response.close();
            }
        },
        setResponse:function (response) {
            this.response = response;
        },
        evaluate:function () {
            var self = this;
            try {
                var result = self.page.evaluate.apply(self.page, arguments);

                self.response.statusCode = 200;
                self.response.write(result);
                self.response.close();
            } catch (exception) {
                self.response.statusCode = 500;
                self.response.write(exception.toString());
                self.response.close();
            }
        },
        evaluateAsync:function () {
            var self = this;
            try {
                self.page.evaluateAsync.apply(self.page, arguments);

                self.response.statusCode = 200;
                self.response.write(true);
                self.response.close();
            } catch (exception) {
                self.response.statusCode = 500;
                self.response.write(exception.toString());
                self.response.close();
            }
        },
        close:function () {
            var self = this;
            try {
                self.page.close();
                self.response.status = 200;
                self.response.write(true);
                self.response.close();
            } catch (exception) {
                self.response.statusCode = 500;
                self.response.write(exception.toString());
                self.response.close();
            }
        },
        sendEvent:function () {
            var self = this;
            try {
                this.page.sendEvent.apply(self.page,
                    [
                        'mousedown'
                    ]);
                self.response.status = 200;
                self.response.write(true);
                self.response.close();
            }
            catch (error) {
                self.response.status = 500;
                self.response.write(error);
                self.response.close();
            }
        },
        includeJs:function (url) {
            var self = this;
            try {
                this.page.includeJs.call(self.page, url, function () {
                    self.response.statusCode = 200;
                    self.response.write(status);
                    self.response.close();
                });
            } catch (exception) {
                self.response.statusCode = 500;
                self.response.write(exception.toString());
                self.response.close();
            }
        },
        open:function (url) {
            var self = this;
            try {
                this.page.open.call(self.page, url, function (status) {
                    if (status === "success") {
                        self.response.statusCode = 200;
                    }
                    else {
                        self.response.statusCode = 500;
                    }
                    self.response.write(status);
                    self.response.close();
                });
            } catch (exception) {
                self.response.statusCode = 500;
                self.response.write(exception.toString());
                self.response.close();
            }
        },
        addCookie:function (cookie) {
            var self = this;
            try {
                var result = this.page.addCookie(cookie);
                this.response.statusCode = 200;
                this.response.write(result);
                this.response.close();
            } catch (ex) {
                self.response.statusCode = 500;
                self.response.write(ex.toString());
                self.response.close();
            }
        },
        clearCookies:function () {
            var self = this;
            try {
                this.page.clearCookies();
                this.response.statusCode = 200;
                this.response.write(true);
                this.response.close();
            } catch (ex) {
                self.response.statusCode = 500;
                self.response.write(ex.toString());
                self.response.close();
            }
        },
        deleteCookie:function (cookieName) {
            var self = this;
            try {
                var result = this.page.deleteCookie(cookieName);
                this.response.statusCode = 200;
                this.response.write(result);
                this.response.close();
            } catch (ex) {
                self.response.statusCode = 500;
                self.response.write(ex.toString());
                self.response.close();
            }
        },
        render:function (filename) {
            var self = this;
            try {
                var result = this.page.render.call(self.page, filename);
                this.response.statusCode = 200;
                this.response.write(result);
                this.response.close();
            } catch (ex) {
                self.response.statusCode = 500;
                self.response.write(ex.toString());
                self.response.close();
            }
        },
        renderBase64:function (format) {
            var self = this;
            try {
                var result = this.page.renderBase64.call(self.page, format);
                self.response.statusCode = 200;
                self.response.write(result);
                self.response.close();
            } catch (ex) {
                self.response.statusCode = 500;
                self.response.write(ex.toString());
                self.response.close();
            }
        },
        bindEvents:function (server) {

            this.page.onAlert = function (message) {
                var event = {
                    source:'alert',
                    args:
                        [
                            message
                        ]
                };
                server.triggerEvent('page', event);
            };
            this.page.onCallback = function (data) {
                var event = {
                    type:'callback',
                    args:
                        [
                            data
                        ]
                };

                server.triggerEvent('page', event);
            };
            this.page.onClosing = function (closingPage) {
                var event = {
                    type:'closing',
                    args:
                        [
                            closingPage
                        ]
                };
                server.triggerEvent('page', event);
            };

            this.page.onConfirm = function (msg) {
                var event = {
                    type:'confirm',
                    args:
                        [
                            msg
                        ]
                };
                server.triggerEvent('page', event);
            };
            //TODO:capture msg, linenum parms
            this.page.onConsoleMessage = function (msg, lineNum, typeId) {
                var event = {
                    type:'consoleMessage',
                    args:
                        [
                            msg,
                            lineNum,
                            typeId
                        ]
                };
                server.triggerEvent('page', event);
            };
            this.page.onError = function (msg, trace) {
                var event = {
                    type:'error',
                    args:
                        [
                            msg,
                            trace
                        ]
                };
                server.triggerEvent('page', event);
            };
            this.page.onInitialized = function () {
                var event = {
                    type:'initialized',
                    args:
                        [
                        ]
                };
                server.triggerEvent('page', event);
            };
            this.page.onLoadFinished = function (status) {
                var event = {
                    type:'loadFinished',
                    args:
                        [
                            status
                        ]
                };
                server.triggerEvent('page', event);
            };
            this.page.onLoadStarted = function () {
                var event = {
                    type:'loadStarted',
                    args:
                        [

                        ]
                };
                server.triggerEvent('page', event);
            };
            this.page.onNavigationRequested = function (url, type, willNavigate, main) {
                var event = {
                    type:'navigationRequested',
                    args:
                        [
                            url,
                            type,
                            willNavigate,
                            main
                        ]
                };
                server.triggerEvent('page', event);
            };
            this.page.onPageCreated = function (newPage) {
                var event = {
                    type:'pageCreated',
                    args:
                        [
                            newPage
                        ]
                };
                server.triggerEvent('page', event);
            };
//            this.page.onRetypeRequested = function (request) {
//                var event = {
//                    type:'retypeRequested',
//                    args:
//                        [
//                            request.url
//                        ]
//                };
//                logEvent(event);
//            };
            this.page.onRetypeReceived = function (response) {
                var event = {
                    type:'retypeReceived',
                    args:
                        [
                            response.url
                        ]
                };
                server.triggerEvent('page', event);
            };
            this.page.onUrlChanged = function (page) {
                var event = {
                    type:'urlChanged',
                    args:
                        [
                            page
                        ]
                };
                server.triggerEvent('page', event);
            };
        }
    };
}(module));
