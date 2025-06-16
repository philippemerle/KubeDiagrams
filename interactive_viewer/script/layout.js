const layoutDagre = {
        id: 0,
        name: 'dagre',
        rankDir: 'TB', 
        ranker: 'network-simplex',
        nodeSep: 25,
        avoidOverlap: true,
        fit: true,
}

const layoutKlay = {
    id: 1,
    name: 'klay',
    klay: {
        direction: 'DOWN',
        layoutHierarchy: true,
        spacing: 50,
        edgeSpacingFactor: 0,
        fixedAlignment: 'RIGHTUP',
        nodeLayering:'INTERACTIVE',
      }

}

const layoutList = [layoutDagre, layoutKlay];
export default layoutList;