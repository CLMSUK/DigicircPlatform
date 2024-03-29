var _createMSXMLDocumentObject = window["CreateMSXMLDocumentObject"];

namespace System.Xml {

    export interface Node {
        SelectSingleNode: (xpath: string) => Node;
        SelectNodes: (xpath: string) => Node[];
    }
    
	/*
		TODO: Check why the following are true: 
		- d.SelectSingleNode("bookstore/book").SelectSingleNode("title").setAttribute("lang", "gr");  -- does not change the attribute value
		- var title = d.SelectSingleNode("bookstore/book").SelectSingleNode("title"); title.setAttribute("lang", "gr"); -- changes the attribute value
	*/
    if (!Node.prototype["SelectSingleNode"]) {
        Node.prototype["SelectSingleNode"] = function (xpath: string) {
            const xmlDocument = new DOMParser().parseFromString(this.outerHTML, "text/xml");

            //IE with ActiveXObject enabled
            if (typeof ActiveXObject !== "undefined") {
                (xmlDocument as any).setProperty("SelectionLanguage", "XPath");
                return (xmlDocument as any).selectSingleNode(xpath);
            }

            // Firefox, Opera, Google Chrome and Safari
            if ((xmlDocument as any).evaluate) {
                const result = (xmlDocument as any).evaluate(xpath, xmlDocument.firstElementChild, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                return result.singleNodeValue;
            }
            // Internet Explorer with no ActiveXObject
            else {
                window.console && console.error("Your browser does not support the [evaluate] method!");
            }
        };
    }

    if (!Node.prototype["SelectNodes"]) {
        Node.prototype["SelectNodes"] = function (xpath: string) {
            const xmlDocument = new DOMParser().parseFromString(this.outerHTML, "text/xml");

            //IE with ActiveXObject enabled
            if (typeof ActiveXObject !== "undefined") {
                (xmlDocument as any).setProperty("SelectionLanguage", "XPath");
                return (xmlDocument as any).selectNodes(xpath);
            }

            // Firefox, Opera, Google Chrome and Safari
            if ((xmlDocument as any).evaluate) {    
                const xPathRes = (xmlDocument as any).evaluate(xpath, xmlDocument.firstElementChild, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                const result = [];
                let actualSpan = xPathRes.iterateNext();
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

    export class XmlDocument {

        public xmlDocument: XMLDocument;

        public xmlString: string;

        constructor() {

        }

        get outerHTML(): string {
            return (this.xmlDocument as any).outerHTML;
        }

        LoadXml(text) {
            const message = "";

            //IE with ActiveXObject enabled
            if (typeof ActiveXObject !== "undefined") {
                this.xmlDocument = new ActiveXObject("Microsoft.XMLDOM");
                (this.xmlDocument as any).loadXML(text); 
                (this.xmlDocument as any).setProperty("SelectionLanguage", "XPath");
                return true;
            }

            // All browsers, except IE before version 9
            if ((window as any).DOMParser) { 
                const parser = new DOMParser();
                try {
                    this.xmlDocument = parser.parseFromString(text, "text/xml");
                } catch (e) {
                    window.console && console.error("XML Parsing Error: Text is not well-formed");
                    return false;
                };
            }
            // Internet Explorer before version 9
            else {  
                this.xmlDocument = _createMSXMLDocumentObject();
                if (!this.xmlDocument) {
                    window.console && console.error("Cannot create XMLDocument object");
                    return false;
                }

                (this.xmlDocument as any).loadXML(text);
            }

            let errorMsg = null;
            if ((this.xmlDocument as any).parseError && (this.xmlDocument as any).parseError.errorCode != 0) {
                errorMsg = `XML Parsing Error: ${(this.xmlDocument as any).parseError.reason} at line ${(this.xmlDocument as any).parseError.line} at position ${(this.xmlDocument as any).parseError.linepos}`;
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
        }

        SelectSingleNode(xpath: string): any {    
            //IE with ActiveXObject enabled
            if (typeof ActiveXObject !== "undefined") {
                //return (<any>this.xmlDocument).selectSingleNode(xpath);
                const allNodes = (this.xmlDocument as any).selectNodes(xpath);
                if (allNodes.length > 0) return allNodes[0];
            }

            // Firefox, Opera, Google Chrome and Safari
            if ((this.xmlDocument as any).evaluate) {
                const result = (this.xmlDocument as any).evaluate(xpath, this.xmlDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                return result.singleNodeValue;
            }
            // Internet Explorer with no ActiveXObject
            else {
                window.console && console.error("Your browser does not support the [evaluate] method!");
            }
            return null;
        }

        SelectNodes(xpath: string): Node[] {
            //IE with ActiveXObject enabled
            if (typeof ActiveXObject !== "undefined") {
                return (this.xmlDocument as any).selectNodes(xpath);
            }

            // Firefox, Opera, Google Chrome and Safari
            if ((this.xmlDocument as any).evaluate) {    
                const xPathRes = (this.xmlDocument as any).evaluate(xpath, this.xmlDocument, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                const result = [];
                let actualSpan = xPathRes.iterateNext();
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
        }
        
    }/*end class XmlDocument*/

    export class HtmlVisitor {
        constructor() { }

        visit(element: Element, apply: (parent: Element, current: Element) => void, root: Element = null) {
            apply(root, element);
            const childs = element.children;
            for (let i = 0; i < childs.length; i++) {
                this.visit(childs[i], apply, element);
            }
        }

        toObject(element: Element, apply: (parent: any, current: Element) => any, root: any = null) {
            let obj = apply(root, element);
            const childs = element.children;
            for (let i = 0; i < childs.length; i++) {
                this.toObject(childs[i], apply, obj);
            }
            return obj;
        }
    }

} /*end namespace*/
