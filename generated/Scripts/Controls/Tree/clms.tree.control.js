var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Joove;
(function (Joove) {
    var Widget;
    (function (Widget) {
        var TreeNode = /** @class */ (function (_super) {
            __extends(TreeNode, _super);
            function TreeNode() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return TreeNode;
        }(Joove.BaseAngularProvider));
        function treeNode($timeout, $interval, ngRadio) {
            return {
                restrict: "AE",
                scope: {
                    collection: "="
                },
                link: function ($scope, $element, $attrs) {
                    var config = $.extend(window._treeNodesConfiguration[$element.attr("jb-id")], {
                        collection: $scope.collection
                    });
                    new TreeNodeHelper().appendTreeNode($element, config);
                }
            };
        }
        var TreeNodeHelper = /** @class */ (function () {
            function TreeNodeHelper() {
            }
            TreeNodeHelper.prototype.appendTreeNode = function ($parent, options) {
                if (options.collection == null || options.collection.length === 0) {
                    return;
                }
                if (options.depth == null) {
                    options.depth = 0;
                }
                if (options.maxInitial != null &&
                    options.maxInitial > 0 &&
                    options.depth > options.maxInitial) {
                    return;
                }
                for (var i = 0; i < options.collection.length; i++) {
                    $parent.append(this.drawTreeNodeItem(options.collection[i], options));
                }
            };
            TreeNodeHelper.prototype.drawTreeNodeItem = function (data, options) {
                var label = options.getLabel(data);
                var self = this;
                var li = $("<li jb-type='TreeNodeItem'></li>");
                var labelHtml = $("<span jb-type='TreeNodeLabelContainer'><span jb-type='TreeNodeLabel'>" + label + "</span></span>");
                var collapseExpandHtml = $('<span jb-type="TreeNodeArrow">+</span>');
                if (options.onClick != null) {
                    labelHtml.on("click", function (e) {
                        Joove.Common.executeEventCallback(options.onClick, e, data, []);
                    });
                }
                collapseExpandHtml.on("click", function () {
                    var ul = li.children("ul");
                    window._themeManager.toggleTreeNodeState(this);
                    if (ul.children().length === 0) {
                        self.appendTreeNode(ul, {
                            depth: 1,
                            maxInitial: 1,
                            recursive: options.recursive,
                            getLabel: options.getLabel,
                            collection: nextPart,
                            onClick: options.onClick
                        });
                    }
                });
                li.append(collapseExpandHtml);
                li.append(labelHtml);
                if (options.recursive != null) {
                    var nextPart = eval("dato." + options.recursive);
                    var ul = $("<ul jb-type='TreeNode'></ul>");
                    li.append(ul);
                    self.appendTreeNode(ul, {
                        maxInitial: options.maxInitial,
                        depth: options.depth + 1,
                        recursive: options.recursive,
                        getLabel: options.getLabel,
                        collection: nextPart,
                        onClick: options.onClick
                    });
                }
                var isExpanded = options.maxInitial == null ||
                    options.maxInitial == 0 ||
                    options.depth < options.maxInitial;
                window._themeManager.applyTreeNodeState(li, isExpanded
                    ? Joove.ThemeManager.States.Expanded
                    : Joove.ThemeManager.States.Collapsed);
                return li;
            };
            return TreeNodeHelper;
        }());
        angular
            .module("treeNode", [])
            .provider("treeNode", new TreeNode())
            .directive("treeNode", ["$timeout", "$interval", "treeNode", treeNode]);
    })(Widget = Joove.Widget || (Joove.Widget = {}));
})(Joove || (Joove = {}));
