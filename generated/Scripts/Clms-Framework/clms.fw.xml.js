var _createMSXMLDocumentObject = window["CreateMSXMLDocumentObject"];
var System;
(function (System) {
    var Xml;
    (function (Xml) {
        /*
            TODO: Check why the following are true:
            - d.SelectSingleNode("bookstore/book").SelectSingleNode("title").setAttribute("lang", "gr");  -- does not change the attribute value
            - var title = d.SelectSingleNode("bookstore/book").SelectSingleNode("title"); title.setAttribute("lang", "gr"); -- changes the attribute value
        */
        if (!Node.prototype["SelectSingleNode"]) {
            Node.prototype["SelectSingleNode"] = function (xpath) {
                var xmlDocument = new DOMParser().parseFromString(this.outerHTML, "text/xml");
                //IE with ActiveXObject enabled
                if (typeof ActiveXObject !== "undefined") {
                    xmlDocument.setProperty("SelectionLanguage", "XPath");
                    return xmlDocument.selectSingleNode(xpath);
                }
                // Firefox, Opera, Google Chrome and Safari
                if (xmlDocument.evaluate) {
                    var result = xmlDocument.evaluate(xpath, xmlDocument.firstElementChild, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                    return result.singleNodeValue;
                }
                // Internet Explorer with no ActiveXObject
                else {
                    window.console && console.error("Your browser does not support the [evaluate] method!");
                }
            };
        }
        if (!Node.prototype["SelectNodes"]) {
            Node.prototype["SelectNodes"] = function (xpath) {
                var xmlDocument = new DOMParser().parseFromString(this.outerHTML, "text/xml");
                //IE with ActiveXObject enabled
                if (typeof ActiveXObject !== "undefined") {
                    xmlDocument.setProperty("SelectionLanguage", "XPath");
                    return xmlDocument.selectNodes(xpath);
                }
                // Firefox, Opera, Google Chrome and Safari
                if (xmlDocument.evaluate) {
                    var xPathRes = xmlDocument.evaluate(xpath, xmlDocument.firstElementChild, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                    var result = [];
                    var actualSpan = xPathRes.iterateNext();
                    while (actualSpan) {
                        result.push(actualSpan);
                        actualSpan = xPathRes.iterateNext();
                    }
                    return result;
                }
                // Internet Explorer with no ActiveXObject
                else {
                    window.console && console.error("Your browser does not support the  [evaluate] method!");
                }
            };
        }
        var XmlDocument = /** @class */ (function () {
            function XmlDocument() {
            }
            Object.defineProperty(XmlDocument.prototype, "outerHTML", {
                get: function () {
                    return this.xmlDocument.outerHTML;
                },
                enumerable: false,
                configurable: true
            });
            XmlDocument.prototype.LoadXml = function (text) {
                var message = "";
                //IE with ActiveXObject enabled
                if (typeof ActiveXObject !== "undefined") {
                    this.xmlDocument = new ActiveXObject("Microsoft.XMLDOM");
                    this.xmlDocument.loadXML(text);
                    this.xmlDocument.setProperty("SelectionLanguage", "XPath");
                    return true;
                }
                // All browsers, except IE before version 9
                if (window.DOMParser) {
                    var parser = new DOMParser();
                    try {
                        this.xmlDocument = parser.parseFromString(text, "text/xml");
                    }
                    catch (e) {
                        window.console && console.error("XML Parsing Error: Text is not well-formed");
                        return false;
                    }
                    ;
                }
                // Internet Explorer before version 9
                else {
                    this.xmlDocument = _createMSXMLDocumentObject();
                    if (!this.xmlDocument) {
                        window.console && console.error("Cannot create XMLDocument object");
                        return false;
                    }
                    this.xmlDocument.loadXML(text);
                }
                var errorMsg = null;
                if (this.xmlDocument.parseError && this.xmlDocument.parseError.errorCode != 0) {
                    errorMsg = "XML Parsing Error: " + this.xmlDocument.parseError.reason + " at line " + this.xmlDocument.parseError.line + " at position " + this.xmlDocument.parseError.linepos;
                }
                else {
                    if (this.xmlDocument.documentElement) {
                        if (this.xmlDocument.documentElement.nodeName == "parsererror") {
                            errorMsg = this.xmlDocument.documentElement.childNodes[0].nodeValue;
                        }
                    }
                    else {
                        errorMsg = "XML Parsing Error!";
                    }
                }
                if (errorMsg) {
                    window.console && console.error(errorMsg);
                    return false;
                }
                window.console && console.info("Successfully parsed he XML Document");
                return true;
            };
            XmlDocument.prototype.SelectSingleNode = function (xpath) {
                //IE with ActiveXObject enabled
                if (typeof ActiveXObject !== "undefined") {
                    //return (<any>this.xmlDocument).selectSingleNode(xpath);
                    var allNodes = this.xmlDocument.selectNodes(xpath);
                    if (allNodes.length > 0)
                        return allNodes[0];
                }
                // Firefox, Opera, Google Chrome and Safari
                if (this.xmlDocument.evaluate) {
                    var result = this.xmlDocument.evaluate(xpath, this.xmlDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                    return result.singleNodeValue;
                }
                // Internet Explorer with no ActiveXObject
                else {
                    window.console && console.error("Your browser does not support the [evaluate] method!");
                }
                return null;
            };
            XmlDocument.prototype.SelectNodes = function (xpath) {
                //IE with ActiveXObject enabled
                if (typeof ActiveXObject !== "undefined") {
                    return this.xmlDocument.selectNodes(xpath);
                }
                // Firefox, Opera, Google Chrome and Safari
                if (this.xmlDocument.evaluate) {
                    var xPathRes = this.xmlDocument.evaluate(xpath, this.xmlDocument, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                    var result = [];
                    var actualSpan = xPathRes.iterateNext();
                    while (actualSpan) {
                        result.push(actualSpan);
                        actualSpan = xPathRes.iterateNext();
                    }
                    return result;
                }
                // Internet Explorer with no ActiveXObject
                else {
                    window.console && console.error("Your browser does not support the [evaluate] method!");
                }
                return null;
            };
            return XmlDocument;
        }()); /*end class XmlDocument*/
        Xml.XmlDocument = XmlDocument;
        var HtmlVisitor = /** @class */ (function () {
            function HtmlVisitor() {
            }
            HtmlVisitor.prototype.visit = function (element, apply, root) {
                if (root === void 0) { root = null; }
                apply(root, element);
                var childs = element.children;
                for (var i = 0; i < childs.length; i++) {
                    this.visit(childs[i], apply, element);
                }
            };
            HtmlVisitor.prototype.toObject = function (element, apply, root) {
                if (root === void 0) { root = null; }
                var obj = apply(root, element);
                var childs = element.children;
                for (var i = 0; i < childs.length; i++) {
                    this.toObject(childs[i], apply, obj);
                }
                return obj;
            };
            return HtmlVisitor;
        }());
        Xml.HtmlVisitor = HtmlVisitor;
    })(Xml = System.Xml || (System.Xml = {}));
})(System || (System = {})); /*end namespace*/
