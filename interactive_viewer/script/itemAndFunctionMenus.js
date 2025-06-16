import { clusterOpenStyle, clusterClosedStyle } from "./defaultStyle";

export const itemOpenClose = {
        id: 'co',
        content: 'close/open',
        tooltipText: 'close/open',
        selector: 'node[group = "cluster"]',
        onClickFunction: function (event) {
            const cluster = event.target;
            if (cluster.data('isClose')) {
                openCluster(cluster);
            }
            else {
                closeCluster(cluster);
            }
        },
      }

/**
 * Open a cluster 
 * @param {*} cluster 
 */     
function openCluster(cluster) {
    cluster.children().style('display', 'element');
    cluster.data('isClose', false);
    cluster.style(clusterOpenStyle);
}

/**
 * Close a cluster
 * @param {*} cluster 
 */
function closeCluster(cluster) {
    cluster.children().style('display', 'none');
    cluster.data('isClose', true);
    cluster.style(clusterClosedStyle);
}