namespace Joove.Widget {

    class TreeNode extends BaseAngularProvider {
    }

    interface ITreeNodeScope extends IJooveScope {
        collection;
    }

    function treeNode($timeout: ng.ITimeoutService, $interval: ng.IIntervalService, ngRadio: any): ng.IDirective {
        return {
            restrict: "AE",
            scope: {
                collection: "="
            },
            link: ($scope: ITreeNodeScope, $element, $attrs) => {
                var config = $.extend(window._treeNodesConfiguration[$element.attr("jb-id")],
                {
                    collection: $scope.collection
                });

                new TreeNodeHelper().appendTreeNode($element, config);
            }
        };
    }

    class TreeNodeHelper {

        appendTreeNode($parent: JQuery, options: { collection?;
            depth?: number;
            maxInitial?: number;
            recursive?;
            getLabel?;
            nextPart?;
            onClick?;
        }) {
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

            for (let i = 0; i < options.collection.length; i++) {
                $parent.append(this.drawTreeNodeItem(options.collection[i], options));
            }
        }

        drawTreeNodeItem(data, options) {
            const label = options.getLabel(data);
            var self = this;

            var li = $("<li jb-type='TreeNodeItem'></li>");
            const labelHtml = $(`<span jb-type='TreeNodeLabelContainer'><span jb-type='TreeNodeLabel'>${label}</span></span>`);
            const collapseExpandHtml = $('<span jb-type="TreeNodeArrow">+</span>');

            if (options.onClick != null) {
                labelHtml.on("click",
                    e => {
                        Common.executeEventCallback(options.onClick, e, data, []);
                    });
            }

            collapseExpandHtml.on("click",
                function() {
                    const ul = li.children("ul");
                    window._themeManager.toggleTreeNodeState(this);
                    if (ul.children().length === 0) {
                        self.appendTreeNode(ul,
                        {
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
                var nextPart = eval(`dato.${options.recursive}`);
                const ul = $("<ul jb-type='TreeNode'></ul>");
                li.append(ul);
                self.appendTreeNode(ul,
                {
                    maxInitial: options.maxInitial,
                    depth: options.depth + 1,
                    recursive: options.recursive,
                    getLabel: options.getLabel,
                    collection: nextPart,
                    onClick: options.onClick
                });
            }

            const isExpanded = options.maxInitial == null ||
                options.maxInitial == 0 ||
                options.depth < options.maxInitial;

            window._themeManager.applyTreeNodeState(li,
                isExpanded
                ? ThemeManager.States.Expanded
                : ThemeManager.States.Collapsed);

            return li;
        }
    }

    angular
        .module("treeNode", [])
        .provider("treeNode", new TreeNode())
        .directive("treeNode", ["$timeout", "$interval", "treeNode", treeNode]);

}