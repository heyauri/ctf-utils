const searchTree = (tree: Record<string, any>, target: string): any => {
    if (tree.name && tree.name.toLowerCase() === target.toLowerCase()) {
        return tree;
    }

    if (tree.children && tree.children.length > 0) {
        for (const child of tree.children) {
            const result = searchTree(child, target);
            if (result) {
                return result;
            }
        }
    }

    return null;
};

const getChildren = (tree: Record<string, any>): any[] => {
    return tree.children || [];
};

export {
    searchTree,
    getChildren
};
