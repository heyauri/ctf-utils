class KeyTree{
    constructor (){
        this.tree = {}
    }
    insert(keys,val){
        let k =keys[0];
        if(keys.length==1){
            this.tree[k] = val;
            return;
        }
        this.tree[k] = new KeyTree();
        this.tree[k].insert(keys.slice(1),val);
    }
    find(keys){
        let k =keys[0];
        if(keys.length==1){
            return this.tree[k]||this.tree;
        }
        if(Reflect.has(this.tree,k)){
            return this.tree[k].find(keys.slice(1));
        }
        return false;
    }
}

module.exports = KeyTree;