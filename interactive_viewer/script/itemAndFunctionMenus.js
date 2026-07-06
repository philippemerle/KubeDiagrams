const itemOpenClose = {
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
    const image = cluster.data('image');
    cluster.style({ ...clusterOpenStyle, 'background-image': image || 'none' });
}

/**
 * Close a cluster
 * @param {*} cluster 
 */
function closeCluster(cluster) {
    cluster.children().style('display', 'none');
    cluster.data('isClose', true);
    const image = cluster.data('image');
    cluster.style({ ...clusterClosedStyle, 'background-image': image || 'none' });
}
